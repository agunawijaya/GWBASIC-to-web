/* ===========================================================================
   MENU2.js — porting minimalis MENU2.BAS sebagai tabel baris.

   Program kedua puluh lima, dan yang terbesar: 642 baris. Tapi ia bukan satu
   program melainkan TUJUH — amortisasi, titik impas, penyusutan, kuantitas
   pesanan ekonomis, nilai kini/mendatang, titik pesan ulang, dan rasio saham
   — ditambah menunya sendiri.

   Tiga hal yang membuatnya layak ditelusuri:

   (1) MENUNYA MELOMPAT, BUKAN MENJALANKAN. Baris 310-395: empat pilihan
       memakai `RUN "..."` (program lain), tujuh sisanya `GOTO <nomor>` ke
       dalam berkas yang sama. Batas antara "program" dan "subrutin" di sini
       cuma soal apakah muat di memori.

   (2) PENCARIAN SUKU BUNGA DITULIS TANGAN LIMA KALI. Baris 4100-4460: coba
       dengan langkah 5, lalu 1, lalu 0,1, lalu 0,01, lalu 0,001 — dan tiap
       tahap adalah SALINAN enam baris yang sama dengan satu angka diganti.
       Tiga puluh enam baris untuk satu gelung.

   (3) PENYUNTING ANGKA YANG MENGGAMBAR ULANG DIRINYA TIAP KETUKAN. Baris
       6040-6340 menyimpan angkanya sebagai DERET DIGIT, lalu mencetaknya
       lewat `PRINT USING` setelah tiap tombol. Yang terlihat pemakai selalu
       angka yang sudah berformat — sesuatu yang biasanya perlu pustaka.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Presisi ganda (`#`) ditiru dengan bilangan pecahan JavaScript biasa.
     Hasilnya sama untuk seluruh angka yang dipakai program ini.
   - `PRINT USING` yang ditiru cuma bentuk `$$`, `#`, `,`, `.##`, dan `%`
     harfiah di ujungnya.
   - `POKE &H17` (bendera CapsLock) tidak berbuat apa-apa.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    { baris: 20, jalan: function (m) { m.penangkapGalat = 410; } },
    { baris: 30, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 440); m.jebakan(m.v.A, true);
        }
        m.pasangJebakan(10, 6470);
      } },
    { baris: 40, jalan: function (m) { m.jebakan(10, true); } },
    { baris: 80, jalan: function (m) { m.cls(); } },
    garisAtas(90), sudut(100), sisi(110),
    { baris: 120, jalan: function (m) {
        m.warna(0, 7); m.locate(2, 29);
        m.cetak(' F R I E N D L Y W A R E '); m.barisBaru(); m.warna(3, 0);
      } },
    ajar(130, 5, 18, 'Menu #2 - Programs Available On This Diskette'),
    pilihan(140,  9,  1, ' A ', ' Business Simulation'),
    pilihan(150, 12,  1, ' B ', ' Depreciation Costs'),
    pilihan(160, 15,  1, ' C ', ' Inventory Reorder'),
    pilihan(170,  9, 27, ' D ', ' Present / Future Value'),
    pilihan(180, 12, 27, ' E ', ' Amortization Analysis'),
    pilihan(190, 15, 27, ' F ', ' Economic Order Quantity'),
    pilihan(191, 18, 27, ' G ', ' Introduction to Computers'),
    pilihan(200,  9, 57, ' H ', ' Break Even Analysis'),
    pilihan(210, 12, 57, ' I ', ' Stock Ratio Analysis'),
    pilihan(220, 15, 57, ' J ', ' Check Book Register'),
    pilihan(221, 18, 57, ' K ', ' Return to Menu #1'),
    { baris: 230, jalan: function (m) {
        m.locate(22, 13); m.warna(15, 0); m.cetak('*****');
        m.warna(3, null); m.cetak(' Strike Key Corresponding To Function Desired ');
        m.warna(15, null); m.cetak('*****'); m.barisBaru(); m.warna(3, null);
      } },
    { baris: 290, jalan: function () { } },
    { baris: 300, jalan: function (m) {
        m.v['RS$'] = m.inkey();
        if (m.v['RS$'] === '') m.lompat(300);
      } },
    /* 310-395 penyalur menu. Empat pilihan MENJALANKAN program lain; tujuh
       sisanya MELOMPAT ke dalam berkas ini. Dari sisi pemakai keduanya
       terlihat sama. */
    jalankanKe(310, 'A', 'BUSONE'),
    lompatKe(320, 'B', 1940),
    lompatKe(330, 'E', 450),
    lompatKe(340, 'H', 1560),
    lompatKe(350, 'C', 4770),
    lompatKe(360, 'F', 3060),
    lompatKe(370, 'D', 3480),
    lompatKe(380, 'I', 5120),
    jalankanKe(385, 'G', 'INTRO'),
    jalankanKe(390, 'J', 'CHECK'),
    jalankanKe(395, 'K', 'MENU'),
    { baris: 400, jalan: function (m) { m.lompat(300); } },
    { baris: 410, jalan: function (m) { if (m.err === 53) m.jalankan('MENU2'); } },
    /* 420 `RESUME NEXT` untuk galat 6 (limpahan). Penelusur memakai RESUME
       biasa: tidak ada baris di program ini yang benar-benar melimpah. */
    { baris: 420, jalan: function (m) { if (m.err === 6) m.lanjut(); } },
    { baris: 430, jalan: function (m) { m.penangkapGalat = 0; } },
    { baris: 440, jalan: function (m) { m.kembali(); } },

    /* --- 450-1550: AMORTISASI --------------------------------------------- */
    { baris: 450, jalan: function (m) { m.lompat(500); } },
    { baris: 460, jalan: function () { } },
    { baris: 470, jalan: function (m) { if (m.inkey() !== '') m.lompat(460); } },
    { baris: 480, jalan: function (m) {
        m.v['RS$'] = m.inkey();
        if (m.v['RS$'] === '') m.lompat(480);
      } },
    { baris: 490, jalan: function (m) { m.kembali(); } },
    { baris: 500, jalan: function (m) {
        m.v.AMNT = 0; m.v.IST = 0; m.v.TNT = 0; m.v.TMT = 0;
        m.v.MD = 0; m.v.PYMT = 0; m.v.NB = 0; m.v.YS = 0; m.v.PF = 0;
      } },
    { baris: 510, jalan: function (m) { m.gosub(640); } },
    { baris: 520, jalan: function (m) { m.gosub(700); } },
    { baris: 530, jalan: function (m) { m.gosub(460); } },
    { baris: 540, jalan: function (m) {
        var r = m.v['RS$'];
        if ((r < 'a' || r > 'e') && (r < 'A' || r > 'E')) m.lompat(530);
      } },
    judul(550, 'A', 'Calculate Interest Rate ', 600),
    judul(560, 'B', 'Calculate Payment Amount', 610),
    judul(570, 'C', ' Calculate Loan Amount  ', 620),
    judul(580, 'D', ' Calculate Loan Payoff  ', 630),
    { baris: 590, jalan: function (m) {
        var r = m.v['RS$'];
        if (r === 'E' || r === 'e') m.lompat(40);
      } },
    rantai(600, [640, 790, 930, 950, 970, 990, 1150, 1050, 780, 460], 500),
    rantai(610, [640, 790, 930, 970, 990, 1010, 1300, 1050, 780, 460], 500),
    rantai(620, [640, 790, 950, 970, 990, 1010, 1380, 1050, 780, 460], 500),
    rantai(630, [640, 790, 930, 950, 990, 1010, 1030, 1460, 1050, 780, 460], 500),
    kepala(640), garisAtas(650), sudut(660), sisi(670),
    { baris: 680, jalan: function (m) { m.warna(0, 7); } },
    namaLayar(690, 29, ' A M O R T I Z A T I O N '),
    { baris: 700, jalan: function (m) {
        m.warna(11, 0); m.locate(5, 30);
        m.cetak('Functions Available'); m.barisBaru();
      } },
    { baris: 710, jalan: function (m) {
        m.tab(30); m.cetak('--------------------'); m.barisBaru();
      } },
    fungsi(720,  8, 26, ' A ', ' Calculate interest rate'),
    fungsi(730, 10, 26, ' B ', ' Calculate payment amount'),
    fungsi(740, 12, 26, ' C ', ' Calculate loan amount'),
    fungsi(750, 14, 26, ' D ', ' Calculate loan payoff'),
    fungsi(760, 16, 26, ' E ', ' Return to main menu'),
    petunjuk(770, 23, 12, '***** Strike Key Corresponding To Function Desired *****'),
    petunjuk(780, 25, 22, '***** Strike Key To Return To Menu *****'),
    { baris: 790, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 30); m.cetak(m.v['HD$']); m.warna(7, 0);
      } },
    kotakAtas(800, 5, 11, 58), kotakKanan(810, 70), kotakBawah(820, 11, 69),
    kotakKiri(830, 11),
    ajar(840,  6, 16, 'Loan Amount'),
    ajar(850,  8, 16, 'Payment Amount'),
    ajar(860, 10, 16, 'Number Of Years'),
    ajar(870, 12, 16, 'No. Payments Per Year'),
    ajar(880, 14, 16, 'Interest Rate'),
    ajar(890, 16, 16, 'No. Payments made'),
    ajar(900, 18, 16, 'Payoff Amount'),
    ajar(910, 20, 16, 'Total Interest Paid'),
    { baris: 920, jalan: function (m) {
        m.locate(22, 16); m.cetak('Total Amount To Pay'); m.barisBaru();
        m.kembali();
      } },
    minta(930, 6, 'Loan Amount                   '),
    ambil(940, 1550, 'AMNT', 930),
    minta(950, 8, 'Payment Amount                '),
    ambil(960, 1550, 'PYMT', 950),
    minta(970, 10, 'Number Of Years               '),
    ambil(980, 6350, 'YS', 970),
    minta(990, 12, 'No. Payments Per Year         '),
    ambil(1000, 6350, 'NB', 990),
    minta(1010, 14, 'Interest Rate                 '),
    { baris: 1020, bagian: [
        function (m) { m.v.DEC = 3; m.gosub(1550); },
        function (m) {
          m.v.IST = angka(m.v.ZA);
          if (m.v.IST === 0) m.lompat(1010); else m.kembali();
        }
      ] },
    minta(1030, 16, 'No. Payments Made             '),
    { baris: 1040, bagian: [
        function (m) { m.gosub(6350); },
        function (m) { m.v.MD = angka(m.v.ZA); m.kembali(); }
      ] },
    hasil(1050, 6, 'Loan Amount             $$################,.##', 'AMNT'),
    hasil(1060, 8, 'Payment Amount          $$################,.##', 'PYMT'),
    hasil(1070, 10, 'Number Of Years            ################,.#', 'YS'),
    hasil(1080, 12, 'No. Payments Per Year        #############,###', 'NB'),
    { baris: 1090, jalan: function (m) {
        m.locate(14, 16);
        m.cetakFormat('Interest Rate            ################,.##%', m.v.IST);
      } },
    { baris: 1100, jalan: function (m) {
        if (m.v.SW) { m.cetak(' +'); m.barisBaru(); m.v.SW = 0; }
      } },
    hasil(1110, 16, 'No. Payments made            ############,####', 'MD'),
    hasil(1120, 18, 'Payoff Amount          $$#################,.##', 'PF'),
    hasil(1130, 20, 'Total Interest Paid    $$#################,.##', 'TNT'),
    { baris: 1140, jalan: function (m) {
        m.locate(22, 16);
        m.cetakFormat('Total Amount To Pay    $$#################,.##', m.v.TMT);
        m.barisBaru(); m.kembali();
      } },
    /* 1150-1290 mencari suku bunga dengan MEMBELAH DUA: mulai dari 0,5,
       lalu terus dibelah sampai selisihnya cukup kecil. Baris 1190 menjaga
       kalau nilainya berhenti berubah — pertanda tidak akan pernah bertemu. */
    { baris: 1150, jalan: function (m) {
        m.v.X1 = 0; m.v.X2 = 1; m.v.IST = 0.5;
      } },
    { baris: 1160, jalan: function (m) {
        m.v.I = (m.v.AMNT * m.v.IST) / (m.v.PYMT * m.v.NB) - 1 +
                (1 / Math.pow(1 + m.v.IST / m.v.NB, m.v.YS * m.v.NB));
      } },
    { baris: 1170, jalan: function (m) {
        if (Math.abs(Math.abs(m.v.I) - 1e-10) < 5e-10) m.lompat(1250);
      } },
    { baris: 1180, jalan: function (m) { if (m.v.I > 0) m.lompat(1230); } },
    { baris: 1190, jalan: function (m) {
        if (m.v.HH === m.v.I) { m.v.IST = 1; m.v.SW = 1; m.lompat(1250); }
        else m.v.HH = m.v.I;
      } },
    { baris: 1200, jalan: function (m) { m.v.X1 = m.v.IST; } },
    { baris: 1210, jalan: function (m) { m.v.IST = (m.v.X1 + m.v.X2) / 2; } },
    { baris: 1220, jalan: function (m) { m.lompat(1160); } },
    { baris: 1230, jalan: function (m) { m.v.X2 = m.v.IST; } },
    { baris: 1240, jalan: function (m) { m.lompat(1210); } },
    { baris: 1250, jalan: function (m) {
        m.v.TMT = m.v.YS * m.v.PYMT * m.v.NB;
      } },
    { baris: 1260, jalan: function (m) { m.v.TNT = m.v.TMT - m.v.AMNT; } },
    { baris: 1270, jalan: function (m) { m.v.PF = m.v.AMNT; } },
    { baris: 1280, jalan: function (m) {
        m.v.IST = Math.floor(m.v.IST * 10000 + 0.5) / 100;
      } },
    { baris: 1290, jalan: function (m) { m.kembali(); } },
    { baris: 1300, jalan: function (m) { m.v.IST = m.v.IST / 100; } },
    { baris: 1310, jalan: function (m) {
        m.v.PYMT = ((m.v.AMNT * m.v.IST) / m.v.NB) /
                   (1 - 1 / Math.pow(1 + m.v.IST / m.v.NB, m.v.YS * m.v.NB));
      } },
    { baris: 1320, jalan: function (m) {
        m.v.PYMT = Math.floor(m.v.PYMT * 100 + 0.5) / 100;
      } },
    { baris: 1330, jalan: function (m) { m.v.TMT = m.v.YS * m.v.PYMT * m.v.NB; } },
    { baris: 1340, jalan: function (m) { m.v.IST = m.v.IST * 100; } },
    { baris: 1350, jalan: function (m) { m.v.TNT = m.v.TMT - m.v.AMNT; } },
    { baris: 1360, jalan: function (m) { m.v.PF = m.v.AMNT; } },
    { baris: 1370, jalan: function (m) { m.kembali(); } },
    { baris: 1380, jalan: function (m) { m.v.IST = m.v.IST / 100; } },
    { baris: 1390, jalan: function (m) {
        m.v.AMNT = m.v.PYMT *
          ((1 - 1 / Math.pow(1 + m.v.IST / m.v.NB, m.v.YS * m.v.NB)) /
           (m.v.IST / m.v.NB));
      } },
    { baris: 1400, jalan: function (m) {
        m.v.AMNT = Math.floor(m.v.AMNT * 100 + 0.5) / 100;
      } },
    { baris: 1410, jalan: function (m) { m.v.TMT = m.v.YS * m.v.PYMT * m.v.NB; } },
    { baris: 1420, jalan: function (m) { m.v.PF = m.v.AMNT; } },
    { baris: 1430, jalan: function (m) { m.v.TNT = m.v.TMT - m.v.AMNT; } },
    { baris: 1440, jalan: function (m) { m.v.IST = m.v.IST * 100; } },
    { baris: 1450, jalan: function (m) { m.kembali(); } },
    { baris: 1460, jalan: function (m) { m.v.IST = m.v.IST / 100; } },
    { baris: 1470, jalan: function (m) {
        var r = m.v.IST / m.v.NB;
        m.v.PF = m.v.AMNT * Math.pow(1 + r, m.v.MD) -
                 m.v.PYMT * ((1 - Math.pow(1 + r, m.v.MD)) / (-r));
      } },
    { baris: 1480, jalan: function (m) {
        m.v.PF = Math.floor(m.v.PF * 100 + 0.5) / 100;
      } },
    { baris: 1490, jalan: function (m) { m.v.IST = m.v.IST * 100; } },
    { baris: 1500, jalan: function (m) { m.v.TMT = m.v.PF; } },
    { baris: 1510, jalan: function (m) {
        m.v.TNT = m.v.PF - (m.v.AMNT - m.v.PYMT * m.v.MD);
      } },
    { baris: 1520, jalan: function (m) {
        m.v.TNT = Math.floor(m.v.TNT * 100 + 0.5) / 100;
      } },
    { baris: 1530, jalan: function (m) { m.kembali(); } },
    { baris: 1540, jalan: function (m) { m.warna(7, 0); m.lompat(40); } },
    { baris: 1550, jalan: function (m) { m.lompat(6040); } },

    /* --- 1560-1930: TITIK IMPAS ------------------------------------------- */
    { baris: 1560, jalan: function (m) { m.lompat(1570); } },
    rantai(1570, [1580, 1690, 1680, 460], 1570),
    kepala(1580), garisAtas(1590), sudut(1600),
    { baris: 1610, jalan: function (m) {
        m.locate(2, 19);
        m.cetak(m.chr(179)); m.spc(43); m.cetak(m.chr(179)); m.barisBaru();
        m.warna(0, 7);
      } },
    namaLayar(1620, 31, ' B R E A K   E V E N '),
    subJudul(1630, 32, 'Break Even Analysis'),
    kotakAtas(1640, 5, 6, 68), kotakKanan(1650, 75), kotakBawah(1660, 6, 74),
    kotakKiri(1670, 6),
    petunjuk(1680, 25, 17, '***** Strike Any Key For Additional Analysis *****'),
    ajar(1690, 7, 18, 'Fixed Costs (In $)'),
    ajar(1700, 9, 18, 'Variable Costs (In %)'),
    minta(1710, 7, 'Fixed Costs (In $)            ', 18),
    { baris: 1720, bagian: [
        function (m) { m.gosub(1930); },
        function (m) {
          m.v.FCOST = angka(m.v.ZA);
          if (m.v.FCOST === 0) m.lompat(1710);
        }
      ] },
    minta(1730, 9, 'Variable Costs (In %)         ', 18),
    { baris: 1740, bagian: [
        function (m) { m.v.DEC = 3; m.gosub(1930); },
        function (m) { m.v.VPERC = angka(m.v.ZA); }
      ] },
    { baris: 1750, jalan: function (m) {
        if (m.v.VPERC === 0 || m.v.VPERC > 99) {
          m.locate(23, 20, 0);
          m.cetak('Percent cannot be greater than 100 - Retry');
          m.locate(23, 19); m.spc(43);
          m.locate(9, 40); m.spc(30);
          m.lompat(1730);
        }
      } },
    hasil(1760, 7, 'Fixed Costs (In $)            $$##########,.##', 'FCOST', 18),
    hasil(1770, 9, 'Variable Costs (In %)                  ##,.##%', 'VPERC', 18),
    ajar(1780, 11, 15, 'Sales         Fixed Costs    Variable Costs      Net Profit'),
    { baris: 1790, jalan: function (m) {
        m.v.FPERC = (100 - m.v.VPERC) / 100;
      } },
    { baris: 1800, jalan: function (m) {
        m.v.VCOST = Math.floor((m.v.FCOST * m.v.VPERC / m.v.FPERC / 100 +
                    0.005000001) * 100) / 100;
      } },
    { baris: 1810, jalan: function (m) { m.v.SALES = m.v.VCOST + m.v.FCOST; } },
    { baris: 1820, jalan: function (m) { m.warna(7, 0); m.v.PC = 0.75; } },
    { baris: 1830, jalan: function (m) { m.untuk('I', 13, 23, 1, 1920); } },
    { baris: 1840, jalan: function (m) {
        m.v.ESALES = Math.floor((m.v.SALES * m.v.PC + 0.005000001) * 100) / 100;
      } },
    { baris: 1850, jalan: function (m) {
        m.v.ECOST = Math.floor((m.v.ESALES * m.v.VPERC / 100 +
                    0.005000001) * 100) / 100;
      } },
    { baris: 1860, jalan: function (m) {
        m.v.EPROFIT = m.v.ESALES - m.v.FCOST - m.v.ECOST;
      } },
    { baris: 1870, jalan: function (m) {
        if (m.v.PC === 1) { m.warna(11, 0); m.v.EPROFIT = 0; }
      } },
    { baris: 1880, jalan: function (m) {
        m.locate(m.v.I, 7);
        m.cetakFormat('$$##########,.##', m.v.ESALES); m.cetak(' ');
        m.cetakFormat('$$##########,.##', m.v.FCOST); m.cetak(' ');
        m.cetakFormat('$$##########,.##', m.v.ECOST); m.cetak(' ');
        m.cetakFormat('$$##########,.##', m.v.EPROFIT);
      } },
    { baris: 1890, jalan: function (m) { m.warna(7, 0); } },
    { baris: 1900, jalan: function (m) {
        m.v.PC = Math.floor((m.v.PC + 0.05500001) * 100) / 100;
      } },
    { baris: 1910, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1920, jalan: function (m) { m.kembali(); } },
    { baris: 1930, jalan: function (m) { m.lompat(6040); } },

    /* --- 1940-3050: PENYUSUTAN -------------------------------------------- */
    { baris: 1940, jalan: function (m) { m.lompat(1950); } },
    rantai(1950, [2090, 2140]),
    { baris: 1960, jalan: function (m) { m.gosub(460); } },
    { baris: 1970, jalan: function (m) {
        var r = m.v['RS$'];
        if ((r < 'a' || r > 'e') && (r < 'A' || r > 'E')) m.lompat(1960);
      } },
    { baris: 1980, jalan: function (m) {
        var r = m.v['RS$'];
        if (r === 'E' || r === 'e') m.lompat(40);
      } },
    { baris: 1990, jalan: function (m) { m.v['SAVERS$'] = m.v['RS$']; } },
    { baris: 2000, jalan: function (m) { m.gosub(2090); } },
    judul(2010, 'A', '      Straight-line method', 2050),
    judul(2020, 'B', '   Units-of-production method', 2060),
    judul(2030, 'C', '    Declining-balance method', 2070),
    judul(2040, 'D', ' Sum-of-the-years-digits method', 2080),
    rantai(2050, [2230, 2280, 2390, 2450, 2550, 2580, 2620, 2660, 2220, 460], 1950),
    rantai(2060, [2230, 2330, 2390, 2960, 2580, 3010, 2220, 460], 1950),
    rantai(2070, [2230, 2280, 2390, 2450, 2580, 2620, 2730, 2220, 460], 1950),
    rantai(2080, [2230, 2280, 2390, 2450, 2580, 2620, 2860, 2220, 460], 1950),
    kepala(2090), garisAtas(2100), sudut(2110), sisi(2120),
    namaLayar(2130, 29, ' D E P R E C I A T I O N ', true),
    { baris: 2140, jalan: function (m) {
        m.warna(11, 0); m.locate(5, 32);
        m.cetak('FUNCTIONS AVAILABLE'); m.barisBaru();
      } },
    { baris: 2150, jalan: function (m) {
        m.tab(32); m.cetak('-------------------'); m.barisBaru();
      } },
    fungsi(2160,  8, 25, ' A ', ' Straight-line method'),
    fungsi(2170, 10, 25, ' B ', ' Units-of-production method'),
    fungsi(2180, 12, 25, ' C ', ' Double-Declining-balance method'),
    fungsi(2190, 14, 25, ' D ', ' Sum-of-the-years-digits method'),
    fungsi(2200, 16, 25, ' E ', ' Return to main menu'),
    petunjuk(2210, 23, 12, '***** Strike Key Corresponding To Function Desired *****'),
    petunjuk(2220, 25, 22, '***** Strike Key To Return To Menu *****'),
    { baris: 2230, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 25); m.cetak(m.v['HD$']); m.warna(7, 0);
      } },
    kotakAtas(2240, 5, 4, 72), kotakKanan(2250, 77), kotakBawah(2260, 4, 76),
    kotakKiri(2270, 4),
    ajar(2280,  7, 16, 'Asset Cost'),
    ajar(2290,  9, 16, 'Estimated Residual Value'),
    ajar(2300, 11, 16, 'Estimated Life (20 Yrs Max)'),
    ajar(2310, 13, 16, 'Fiscal Year Starting Month (1-12)'),
    { baris: 2320, jalan: function (m) {
        m.locate(15, 16);
        m.cetak('Usage Year Starting Month (1-12)'); m.barisBaru();
        m.kembali();
      } },
    ajar(2330,  7, 16, 'Asset Cost'),
    ajar(2340,  9, 16, 'Estimated Residual Value'),
    ajar(2350, 11, 16, 'Estimated Life (Hours)'),
    ajar(2360, 13, 16, 'Hours Used During Year'),
    ajar(2370, 15, 16, 'Hourly Depreciation Rate'),
    { baris: 2380, jalan: function (m) {
        m.locate(17, 16);
        m.cetak('Current Year Depreciation'); m.barisBaru();
        m.kembali();
      } },
    minta(2390, 7, 'Asset Cost                        ', 16),
    { baris: 2400, bagian: [
        function (m) { m.gosub(3050); },
        function (m) {
          m.v.COST = angka(m.v.ZA);
          if (m.v.COST === 0) m.lompat(2390);
        }
      ] },
    minta(2410, 9, 'Estimated Residual Value          ', 16),
    { baris: 2420, bagian: [
        function (m) { m.gosub(3050); },
        function (m) { m.v.VALUE = angka(m.v.ZA); }
      ] },
    { baris: 2430, jalan: function (m) {
        if (m.v.VALUE > m.v.COST) {
          m.locate(23, 17); m.warna(11, 0);
          m.cetak('Salvage value cannot be greater than cost - Retry');
          m.locate(23, 17); m.spc(49);
          m.locate(9, 45); m.spc(20); m.warna(7, 0);
          m.lompat(2410);
        }
      } },
    { baris: 2440, jalan: function (m) { m.kembali(); } },
    minta(2450, 11, 'Estimated Life (20 Yrs Max)       ', 16),
    { baris: 2460, bagian: [
        function (m) { m.gosub(6350); },
        function (m) {
          m.v.LF = angka(m.v.ZA);
          if (m.v.LF === 0) m.lompat(2450);
        }
      ] },
    batas(2470, function (m) { return m.v.LF > 20; },
      'Estimated life cannot be greater than 20 - Retry', 2450),
    batas(2480, function (m) { return m.v.LF < 3; },
      'This method not advisable for short term - Retry', 2450),
    minta(2490, 13, 'Fiscal Year Starting Month (1-12) ', 16),
    { baris: 2500, bagian: [
        function (m) { m.gosub(6350); },
        function (m) {
          m.v.FMNT = angka(m.v.ZA);
          if (m.v.FMNT === 0) m.lompat(2490);
        }
      ] },
    minta(2510, 15, 'Usage Year Starting Month  (1-12) ', 16),
    { baris: 2520, bagian: [
        function (m) { m.gosub(6350); },
        function (m) {
          m.v.UNMT = angka(m.v.ZA);
          if (m.v.UNMT === 0) m.lompat(2510); else m.v.NMNT = m.v.UNMT;
        }
      ] },
    { baris: 2530, jalan: function (m) {
        if (m.v.UNMT < m.v.FMNT) m.v.NMNT = m.v.UNMT + 12;
      } },
    { baris: 2540, jalan: function (m) {
        m.v.PARTIAL = 12 - (m.v.NMNT - m.v.FMNT); m.kembali();
      } },
    { baris: 2550, jalan: function (m) {
        m.v.AN = (m.v.COST - m.v.VALUE) / m.v.LF;
      } },
    { baris: 2560, jalan: function (m) {
        if (m.v.PARTIAL < 12) {
          m.v.FIRST = m.v.AN * m.v.PARTIAL / 12;
          m.v.LAST = m.v.AN * (12 - m.v.PARTIAL) / 12;
          m.v.REMAIN = 12 - m.v.PARTIAL;
          m.v.YSD = m.v.LF - 1;
        }
      } },
    { baris: 2570, jalan: function (m) { m.kembali(); } },
    { baris: 2580, jalan: function (m) { m.warna(11, 0); } },
    hasil(2590, 7, 'Asset Cost                    $$##############,.##', 'COST', 16),
    { baris: 2600, jalan: function (m) {
        m.locate(9, 16);
        m.cetakFormat('Estimated Residual Value      $$##############,.##', m.v.VALUE);
        m.barisBaru();
      } },
    { baris: 2610, jalan: function (m) { m.kembali(); } },
    hasil(2620, 11, 'Estimated Life (20 Yrs Max)                   ####', 'LF', 16),
    hasil(2630, 13, 'Fiscal Year Starting Month (1-12)               ##', 'FMNT', 16),
    hasil(2640, 15, 'Usage Year Starting Month (1-12)                ##', 'UNMT', 16),
    { baris: 2650, jalan: function (m) { m.kembali(); } },
    { baris: 2660, jalan: function (m) {
        if (m.v.PARTIAL < 12) m.lompat(2690);
      } },
    hasil(2670, 17, 'Annual Depreciation           $$##############,.##', 'AN', 16),
    { baris: 2680, jalan: function (m) { m.lompat(2720); } },
    { baris: 2690, jalan: function (m) {
        m.locate(17, 16);
        m.cetak('First ' + teks(m.v.PARTIAL) + ' Months Deprec.'); m.tab(46);
        m.cetakFormat('$$##############,.##', m.v.FIRST); m.barisBaru();
      } },
    { baris: 2700, jalan: function (m) {
        m.locate(19, 16);
        m.cetak('Annual Deprec.: ' + teks(m.v.YSD) + ' Years'); m.tab(46);
        m.cetakFormat('$$##############,.##', m.v.AN); m.barisBaru();
      } },
    { baris: 2710, jalan: function (m) {
        m.locate(21, 16, 1);
        m.cetak('Last  ' + teks(m.v.REMAIN) + ' Months Deprec.'); m.tab(46);
        m.cetakFormat('$$##############,.##', m.v.LAST); m.barisBaru();
      } },
    { baris: 2720, jalan: function (m) { m.kembali(); } },
    ajar(2730, 17, 6, 'Yr.      Deprec.  Yr.      Deprec.  Yr.      Deprec.  Yr.      Deprec.'),
    ajar(2740, 18, 6, '---  -----------  ---  -----------  ---  -----------  ---  -----------'),
    { baris: 2750, jalan: function (m) {
        m.v.PC = Math.floor((100 / m.v.LF * 0.02 + 0.005000001) * 100) / 100;
      } },
    { baris: 2760, jalan: function (m) { m.v.BK = m.v.COST; } },
    { baris: 2770, jalan: function (m) {
        m.v.AN = Math.floor((m.v.PARTIAL / 12 * (m.v.PC * m.v.BK) +
                 0.005000001) * 100) / 100;
      } },
    { baris: 2780, jalan: function (m) {
        m.v.BK = m.v.BK - m.v.AN; m.v.YRS = 1;
      } },
    { baris: 2790, bagian: [
        function (m) { m.untuk('C', 6, 65, 18, 2850); },
        function (m) { m.untuk('R', 19, 23, 1, 2840); }
      ] },
    { baris: 2800, jalan: function (m) {
        m.locate(m.v.R, m.v.C, 0);
        m.cetakFormat('## ', m.v.YRS); m.warna(7, 0);
        m.cetakFormat('$$#######,.##', m.v.AN); m.barisBaru(); m.warna(11, 0);
      } },
    { baris: 2810, jalan: function (m) {
        m.v.YRS = m.v.YRS + 1;
        if (m.v.YRS > m.v.LF) m.lompat(2850);
      } },
    { baris: 2820, jalan: function (m) {
        m.v.AN = Math.floor((m.v.PC * m.v.BK + 0.005000001) * 100) / 100;
        m.v.BK = m.v.BK - m.v.AN;
      } },
    { baris: 2830, jalan: function (m) {
        if (m.v.BK < m.v.VALUE && m.v.BK > 0) {
          m.v.BK = m.v.BK + m.v.AN;
          m.v.AN = Math.floor((m.v.BK - m.v.VALUE + 0.005000001) * 100) / 100;
          m.v.BK = 0;
        }
      } },
    { baris: 2840, bagian: [
        function (m) { m.lanjutkan('R'); },
        function (m) { m.lanjutkan('C'); }
      ] },
    { baris: 2850, jalan: function (m) { m.kembali(); } },
    ajar(2860, 17, 6, 'Yr.      Deprec.  Yr.      Deprec.  Yr.      Deprec.  Yr.      Deprec.'),
    ajar(2870, 18, 6, '---  -----------  ---  -----------  ---  -----------  ---  -----------'),
    { baris: 2880, jalan: function (m) {
        m.v.DENOM = 0;
        for (m.v.I = 1; m.v.I <= m.v.LF; m.v.I++) m.v.DENOM = m.v.DENOM + m.v.I;
        m.v.BK = m.v.COST - m.v.VALUE; m.v.YRS = 1;
      } },
    { baris: 2890, jalan: function (m) {
        m.v.AN = Math.floor((m.v.PARTIAL / 12 *
                 (m.v.LF / m.v.DENOM * m.v.BK) + 0.005000001) * 100) / 100;
      } },
    { baris: 2900, bagian: [
        function (m) { m.untuk('C', 6, 65, 18, 2950); },
        function (m) { m.untuk('R', 19, 23, 1, 2940); }
      ] },
    { baris: 2910, jalan: function (m) {
        m.locate(m.v.R, m.v.C, 0);
        m.cetakFormat('## ', m.v.YRS); m.warna(7, 0);
        m.cetakFormat('$$#######,.##', m.v.AN); m.barisBaru(); m.warna(11, 0);
      } },
    { baris: 2920, jalan: function (m) {
        var s = m.v.PARTIAL;
        m.v.AN = Math.floor(((12 - s) / 12 *
                 ((m.v.LF - m.v.YRS + 1) / m.v.DENOM * m.v.BK) +
                 (12 - (12 - s)) / 12 *
                 ((m.v.LF - m.v.YRS) / m.v.DENOM * m.v.BK) +
                 0.005000001) * 100) / 100;
      } },
    { baris: 2930, jalan: function (m) {
        m.v.YRS = m.v.YRS + 1;
        if (m.v.YRS > m.v.LF) m.lompat(2950);
      } },
    { baris: 2940, bagian: [
        function (m) { m.lanjutkan('R'); },
        function (m) { m.lanjutkan('C'); }
      ] },
    { baris: 2950, jalan: function (m) { m.kembali(); } },
    minta(2960, 11, 'Estimated Life (Hours)            ', 16),
    { baris: 2970, bagian: [
        function (m) { m.gosub(6350); },
        function (m) {
          m.v.LF = angka(m.v.ZA);
          if (m.v.LF === 0) m.lompat(2960);
        }
      ] },
    minta(2980, 13, 'Hours Used During Year            ', 16),
    { baris: 2990, bagian: [
        function (m) { m.gosub(6350); },
        function (m) {
          m.v.HRS = angka(m.v.ZA);
          if (m.v.HRS === 0) m.lompat(2980);
        }
      ] },
    { baris: 3000, jalan: function (m) {
        m.v.HR = (m.v.COST - m.v.VALUE) / m.v.LF;
        m.v.AN = m.v.HR * m.v.HRS;
        m.kembali();
      } },
    hasil(3010, 11, 'Estimated Life (Hours)                     #######', 'LF', 16),
    hasil(3020, 13, 'Hours Used During Year                     #######', 'HRS', 16),
    hasil(3030, 15, 'Hourly Depreciation Rate          $$##########,.##', 'HR', 16),
    { baris: 3040, jalan: function (m) {
        m.locate(17, 16);
        m.cetakFormat('Current Year Depreciation     $$##############,.##', m.v.AN);
        m.barisBaru(); m.kembali();
      } },
    { baris: 3050, jalan: function (m) { m.lompat(6040); } },

    /* --- 3060-3470: KUANTITAS PESANAN EKONOMIS ---------------------------- */
    { baris: 3060, jalan: function (m) { m.lompat(3070); } },
    rantai(3070, [3080, 3200, 3190, 460], 3070),
    kepala(3080), garisAtas(3090), sudut(3100), sisi(3110, true),
    namaLayar(3120, 27, ' E C O N O M I C   O R D E R '),
    subJudul(3130, 30, 'Economic Order Quantity'),
    kotakAtas(3140, 5, 11, 58), kotakKanan(3150, 70), kotakBawah(3160, 11, 69),
    kotakKiri(3170, 11),
    { baris: 3180, jalan: function (m) { m.kembali(); } },
    petunjuk(3190, 25, 17, '***** Strike Any Key For Additional Analysis *****'),
    ajar(3200,  7, 18, 'Units Required During Year'),
    ajar(3210,  9, 18, 'Ordering Cost, Per Order'),
    ajar(3220, 11, 18, 'Holding Cost, Per Unit'),
    ajar(3230, 13, 18, 'Economic Order Quantity'),
    ajar(3240, 15, 18, 'Number of Orders Per Year'),
    ajar(3250, 17, 18, 'Average Units In Inventory'),
    ajar(3260, 19, 18, 'Total Ordering Cost'),
    ajar(3270, 21, 18, 'Total Holding Cost'),
    minta(3280, 7, 'Units Required During Year    ', 18),
    { baris: 3290, bagian: [
        function (m) { m.gosub(6350); },
        function (m) {
          m.v.UNITS = angka(m.v.ZA);
          if (m.v.UNITS === 0) m.lompat(3280);
        }
      ] },
    minta(3300, 9, 'Ordering Cost, Per Order      ', 18),
    { baris: 3310, bagian: [
        function (m) { m.gosub(3470); },
        function (m) {
          m.v.COST = angka(m.v.ZA);
          if (m.v.COST === 0) m.lompat(3300);
        }
      ] },
    minta(3320, 11, 'Holding Cost, Per Unit        ', 18),
    { baris: 3330, bagian: [
        function (m) { m.gosub(3470); },
        function (m) {
          m.v.HOLD = angka(m.v.ZA);
          if (m.v.HOLD === 0) m.lompat(3320);
        }
      ] },
    /* 3340 rumus akar kuadrat Wilson — satu-satunya rumus di seluruh berkas
       ini yang punya nama sendiri di buku teks. */
    { baris: 3340, jalan: function (m) {
        m.v.EOQ = Math.floor(
          Math.sqrt(2 * m.v.UNITS * m.v.COST / m.v.HOLD) + 0.5);
      } },
    { baris: 3350, jalan: function (m) {
        m.v.ODS = Math.floor(m.v.UNITS / m.v.EOQ + 0.5);
        if (m.v.ODS * m.v.EOQ < m.v.UNITS) m.v.ODS = m.v.ODS + 1;
      } },
    { baris: 3360, jalan: function (m) {
        m.v.AVERAGE = Math.floor(m.v.EOQ / 2 + 0.5);
      } },
    { baris: 3370, jalan: function (m) {
        m.v.TOTCOST = Math.floor((m.v.COST * m.v.ODS + 0.005000001) * 100) / 100;
      } },
    { baris: 3380, jalan: function (m) {
        m.v.TOTHOLD = Math.floor((m.v.AVERAGE * m.v.HOLD + 0.005000001) * 100) / 100;
      } },
    hasil(3390,  7, 'Units Required During Year      ###########,##', 'UNITS', 18),
    hasil(3400,  9, 'Ordering Cost, Per Order      $$##########,.##', 'COST', 18),
    hasil(3410, 11, 'Holding Cost, Per Unit        $$##########,.##', 'HOLD', 18),
    hasil(3420, 13, 'Economic Order Quantity          ##########,##', 'EOQ', 18),
    hasil(3430, 15, 'Number of Orders Per Year        ##########,##', 'ODS', 18),
    hasil(3440, 17, 'Average Units In Inventory       ##########,##', 'AVERAGE', 18),
    hasil(3450, 19, 'Total Ordering Cost           $$##########,.##', 'TOTCOST', 18),
    { baris: 3460, jalan: function (m) {
        m.locate(21, 18);
        m.cetakFormat('Total Holding Cost            $$##########,.##', m.v.TOTHOLD);
        m.barisBaru(); m.kembali();
      } },
    { baris: 3470, jalan: function (m) { m.lompat(6040); } },

    /* --- 3480-4760: NILAI KINI / MENDATANG -------------------------------- */
    { baris: 3480, jalan: function (m) { m.lompat(3490); } },
    { baris: 3490, jalan: function (m) {
        m.v.AMNT = 0; m.v.IST = 0; m.v.TNT = 0; m.v.TMT = 0;
        m.v.MD = 0; m.v.PYMT = 0; m.v.NB = 0; m.v.YS = 0; m.v.PRS = 0;
      } },
    { baris: 3500, jalan: function (m) { m.gosub(3630); } },
    { baris: 3510, jalan: function (m) { m.gosub(3680); } },
    { baris: 3520, jalan: function (m) { m.gosub(460); } },
    { baris: 3530, jalan: function (m) {
        var r = m.v['RS$'];
        if ((r < 'a' || r > 'e') && (r < 'A' || r > 'E')) m.lompat(3520);
      } },
    judul(3540, 'A', 'Calculate Present Value ', 3590),
    judul(3550, 'B', 'Calculate Future Value  ', 3600),
    judul(3560, 'C', ' Calculate Interest Rate', 3610),
    judul(3570, 'D', 'Calculate No. Of Years ', 3620),
    { baris: 3580, jalan: function (m) {
        var r = m.v['RS$'];
        if (r === 'E' || r === 'e') m.lompat(40);
      } },
    rantai(3590, [3630, 3770, 3890, 3930, 3950, 4040, 3990, 3760, 460], 3490),
    rantai(3600, [3630, 3770, 3870, 3930, 3950, 4070, 3990, 3760, 460], 3490),
    rantai(3610, [3630, 3770, 3870, 3890, 3930, 4100, 3990, 3760, 460], 3490),
    rantai(3620, [3630, 3770, 3870, 3890, 3950, 4490, 3990, 3760, 460], 3490),
    kepala(3630), garisAtas(3640), sudut(3650), sisi(3660),
    namaLayar(3670, 21, ' P R E S E N T / F U T U R E   V A L U E ', true),
    { baris: 3680, jalan: function (m) {
        m.warna(11, 0); m.locate(5, 30, 0);
        m.cetak('Functions Available'); m.barisBaru();
      } },
    { baris: 3690, jalan: function (m) {
        m.tab(30); m.cetak('--------------------'); m.barisBaru();
      } },
    fungsi(3700,  8, 26, ' A ', ' Calculate Present Value'),
    fungsi(3710, 10, 26, ' B ', ' Calculate Future Value'),
    fungsi(3720, 12, 26, ' C ', ' Calculate Interest Rate'),
    fungsi(3730, 14, 26, ' D ', ' Calculate Number Of Years'),
    fungsi(3740, 16, 26, ' E ', ' Return to main menu'),
    petunjuk(3750, 23, 12, '***** Strike Key Corresponding To Function Desired *****'),
    petunjuk(3760, 25, 22, '***** Strike Key To Return To Menu *****'),
    { baris: 3770, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 30); m.cetak(m.v['HD$']); m.warna(7, 0);
      } },
    kotakAtas(3780, 5, 11, 58), kotakKanan(3790, 70), kotakBawah(3800, 11, 69),
    kotakKiri(3810, 11),
    ajar(3820,  8, 22, 'Present Value'),
    ajar(3830, 11, 22, 'Future Value'),
    ajar(3840, 14, 22, 'Number Of Years'),
    ajar(3850, 17, 22, 'Interest Rate'),
    { baris: 3860, jalan: function (m) {
        m.locate(20, 22); m.cetak('Return on Investment'); m.barisBaru();
        m.kembali();
      } },
    minta(3870, 8, 'Present Value         ', 22),
    ambil(3880, 4760, 'PRS', 3870),
    minta(3890, 11, 'Future Value          ', 22),
    { baris: 3900, bagian: [
        function (m) { m.gosub(4760); },
        function (m) {
          m.v.FT = angka(m.v.ZA);
          if (m.v.FT === 0) m.lompat(3890);
        }
      ] },
    { baris: 3910, jalan: function (m) {
        if (m.v.FT <= m.v.PRS) {
          m.locate(23, 13);
          m.cetak('Future Value Must Be Greater Than Present Value - Retry');
          m.locate(23, 13); m.spc(55);
          m.locate(11, 46); m.spc(20);
          m.lompat(3890);
        }
      } },
    { baris: 3920, jalan: function (m) { m.kembali(); } },
    minta(3930, 14, 'Number Of Years       ', 22),
    { baris: 3940, bagian: [
        function (m) { m.v.DEC = 2; m.gosub(4760); },
        function (m) {
          m.v.YS = angka(m.v.ZA);
          if (m.v.YS === 0) m.lompat(3930); else m.kembali();
        }
      ] },
    minta(3950, 17, 'Interest Rate         ', 22),
    { baris: 3960, bagian: [
        function (m) { m.v.DEC = 3; m.gosub(4760); },
        function (m) {
          m.v.IST = angka(m.v.ZA);
          if (m.v.IST === 0) m.lompat(3950); else m.kembali();
        }
      ] },
    minta(3970, 20, 'Return On Investment    ', 22),
    ambil(3980, 4760, 'RETRN', 3970),
    hasil(3990,  8, 'Present Value       $$############,.##', 'PRS', 22),
    hasil(4000, 11, 'Future Value        $$############,.##', 'FT', 22),
    hasil(4010, 14, 'Number Of Years     ###############.##', 'YS', 22),
    hasil(4020, 17, 'Interest Rate       ##############.##%', 'IST', 22),
    { baris: 4030, jalan: function (m) {
        m.locate(20, 22);
        m.cetakFormat('Return On Investment $$###########,.##', m.v.RETRN);
        m.barisBaru(); m.kembali();
      } },
    { baris: 4040, jalan: function (m) {
        m.v.PRS = Math.floor((m.v.FT / Math.pow(1 + m.v.IST / 100, m.v.YS) +
                  0.005000001) * 100) / 100;
      } },
    { baris: 4050, jalan: function (m) { m.v.RETRN = m.v.FT - m.v.PRS; } },
    { baris: 4060, jalan: function (m) { m.kembali(); } },
    { baris: 4070, jalan: function (m) {
        m.v.FT = Math.floor((m.v.PRS * Math.pow(1 + m.v.IST / 100, m.v.YS) +
                 0.005000001) * 100) / 100;
      } },
    { baris: 4080, jalan: function (m) { m.v.RETRN = m.v.FT - m.v.PRS; } },
    { baris: 4090, jalan: function (m) { m.kembali(); } },
    /* 4100-4460 LIMA TAHAP PENCARIAN, ditulis lima kali. Tiap tahap enam
       baris yang sama persis kecuali besar langkahnya: 5, 1, 0,1, 0,01,
       0,001. Yang di bahasa mana pun ditulis sebagai satu gelung dengan
       langkah yang dibagi sepuluh. */
    { baris: 4100, jalan: function (m) {
        m.v.IST = 5.1;
        m.v.BT = Math.floor((m.v.FT - m.v.FT * 0.0001) * 100);
        m.v.TP = Math.floor((m.v.FT + m.v.FT * 0.0001) * 100);
      } },
    tebak(4110), bulatkan(4120), ujiTebak(4130, 4470),
    arah(4140, 5, 4170), naik(4150, 5), { baris: 4160, jalan: function (m) { m.lompat(4110); } },
    tebak(4170), bulatkan(4180), ujiTebak(4190, 4470),
    arah(4200, 1, 4230), naik(4210, 1), { baris: 4220, jalan: function (m) { m.lompat(4170); } },
    tebak(4230), bulatkan(4240), ujiTebak(4250, 4470),
    arah(4260, 0.1, 4290), naik(4270, 0.1), { baris: 4280, jalan: function (m) { m.lompat(4230); } },
    tebak(4290), bulatkan(4300), ujiTebak(4310, 4470),
    arah(4320, 0.01, 4350), naik(4330, 0.01), { baris: 4340, jalan: function (m) { m.lompat(4290); } },
    tebak(4350), bulatkan(4360), ujiTebak(4370, 4470),
    arah(4380, 0.001, 4410), naik(4390, 0.001), { baris: 4400, jalan: function (m) { m.lompat(4350); } },
    tebak(4410), bulatkan(4420), ujiTebak(4430, 4470),
    { baris: 4440, jalan: function (m) { if (m.v.GS > m.v.TP) m.lompat(4470); } },
    naik(4450, 0.0001), { baris: 4460, jalan: function (m) { m.lompat(4410); } },
    { baris: 4470, jalan: function (m) { m.v.RETRN = m.v.FT - m.v.PRS; } },
    { baris: 4480, jalan: function (m) { m.kembali(); } },
    { baris: 4490, jalan: function (m) { m.v.YS = 1.1; } },
    { baris: 4500, jalan: function (m) {
        m.v.BT = Math.floor((m.v.FT - m.v.FT * 0.005000001) * 100);
      } },
    { baris: 4510, jalan: function (m) {
        m.v.TP = Math.floor((m.v.FT + m.v.FT * 0.005000001) * 100);
      } },
    tebak(4520), bulatkan(4530),
    arahYS(4540, 10, 4570), naikYS(4550, 10),
    { baris: 4560, jalan: function (m) { m.lompat(4520); } },
    tebak(4570), bulatkan(4580),
    arahYS(4590, 1, 4620), naikYS(4600, 1),
    { baris: 4610, jalan: function (m) { m.lompat(4570); } },
    tebak(4620), bulatkan(4630),
    arahYS(4640, 0.5, 4670), naikYS(4650, 0.5),
    { baris: 4660, jalan: function (m) { m.lompat(4620); } },
    tebak(4670), bulatkan(4680), ujiTebak(4690, 4730),
    { baris: 4700, jalan: function (m) { if (m.v.GS > m.v.TP) m.lompat(4730); } },
    naikYS(4710, 0.05),
    { baris: 4720, jalan: function (m) { m.lompat(4670); } },
    { baris: 4730, jalan: function (m) { m.v.RETRN = m.v.FT - m.v.PRS; } },
    { baris: 4740, jalan: function (m) { m.kembali(); } },
    { baris: 4750, jalan: function (m) { m.lompat(40); } },
    { baris: 4760, jalan: function (m) { m.lompat(6040); } },

    /* --- 4770-5110: TITIK PESAN ULANG ------------------------------------- */
    { baris: 4770, jalan: function (m) { m.lompat(4780); } },
    rantai(4780, [4790, 4900, 4890, 460], 4780),
    kepala(4790), garisAtas(4800), sudut(4810), sisi(4820, true),
    namaLayar(4830, 27, ' R E - O R D E R   P O I N T '),
    subJudul(4840, 29, 'Inventory Re-order Point'),
    kotakAtas(4850, 5, 11, 58), kotakKanan(4860, 70), kotakBawah(4870, 11, 69),
    kotakKiri(4880, 11),
    petunjuk(4890, 25, 17, '***** Strike Any Key For Additional Analysis *****'),
    ajar(4900, 7, 18, 'Units Used Daily'),
    ajar(4910, 9, 18, 'Delivery Days Required'),
    minta(4920, 7, 'Units Used Daily        ', 18),
    { baris: 4930, jalan: function (m) { m.gosub(6350); } },
    { baris: 4940, jalan: function (m) { m.v.UNITS = angka(m.v.ZA); } },
    { baris: 4950, jalan: function (m) { if (m.v.UNITS === 0) m.lompat(4920); } },
    minta(4960, 9, 'Delivery Days Required  ', 18),
    { baris: 4970, bagian: [
        function (m) { m.gosub(6350); },
        function (m) {
          m.v.TIME = angka(m.v.ZA);
          if (m.v.TIME === 0) m.lompat(4960);
        }
      ] },
    hasil(4980, 7, 'Units Used Daily           ##########,##', 'UNITS', 18),
    hasil(4990, 9, 'Delivery Days Required     ##########,##', 'TIME', 18),
    ajar(5000, 11, 13, 'Safety Margin       Minimum Quantity      Re-order Point'),
    { baris: 5010, jalan: function (m) { m.v.MA = 0; } },
    { baris: 5020, jalan: function (m) {
        m.v.MN = Math.floor(m.v.UNITS * m.v.TIME + 0.5);
      } },
    { baris: 5030, jalan: function (m) { m.untuk('I', 13, 21, 1, 5100); } },
    { baris: 5040, jalan: function (m) {
        m.v.RO = Math.floor(m.v.MA * m.v.MN + m.v.MN + 0.5);
      } },
    { baris: 5050, jalan: function (m) { m.v.MA = Math.floor(m.v.MA * 100); } },
    { baris: 5060, jalan: function (m) {
        m.locate(m.v.I, 18);
        m.cetakFormat('##%', m.v.MA); m.cetak('            ');
        m.cetakFormat('########,##', m.v.MN); m.cetak('          ');
        m.cetakFormat('########,##', m.v.RO); m.barisBaru();
      } },
    { baris: 5070, jalan: function (m) { if (m.v.I === 13) m.warna(7, 0); } },
    { baris: 5080, jalan: function (m) {
        m.v.MA = Math.floor((m.v.MA / 100 + 0.05500001) * 100) / 100;
      } },
    { baris: 5090, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 5100, jalan: function (m) { m.kembali(); } },
    { baris: 5110, jalan: function (m) { m.lompat(6040); } },

    /* --- 5120-6020: RASIO SAHAM ------------------------------------------- */
    { baris: 5120, jalan: function (m) { m.lompat(5130); } },
    { baris: 5130, bagian: [
        function (m) { m.gosub(5140); },
        function (m) { m.gosub(5190); },
        function (m) { m.lompat(5240); }
      ] },
    kepala(5140), garisAtas(5150), sudut(5160), sisi(5170, true),
    namaLayar(5180, 29, ' S T O C K   R A T I O S ', true),
    { baris: 5190, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 30, 0);
        m.cetak('Enter Known Information'); m.barisBaru();
      } },
    kotakAtas(5200, 5, 11, 58),
    { baris: 5210, jalan: function (m) {
        for (m.v.J = 6; m.v.J <= 22; m.v.J++) {
          m.locate(m.v.J, 70); m.cetak(m.chr(186)); m.barisBaru();
        }
        m.locate(null, 70); m.cetak(m.chr(188));
      } },
    { baris: 5220, jalan: function (m) {
        for (m.v.J = 69; m.v.J >= 12; m.v.J--) {
          m.locate(23, m.v.J); m.cetak(m.chr(205));
        }
        m.locate(23, 11); m.cetak(m.chr(200));
      } },
    { baris: 5230, jalan: function (m) {
        for (m.v.J = 22; m.v.J >= 6; m.v.J--) {
          m.locate(m.v.J, 11); m.cetak(m.chr(186)); m.barisBaru();
        }
        m.warna(7, 0); m.kembali();
      } },
    ajar(5240,  6, 16, 'Average Inventory'),
    ajar(5250,  7, 16, 'Current Assets'),
    ajar(5260,  8, 16, 'Fixed and Long-Term Assets'),
    ajar(5270,  9, 33, 'Total Assets'),
    ajar(5280, 11, 16, 'Current Liabilities'),
    ajar(5290, 12, 16, 'Long-Term Liabilities'),
    ajar(5300, 13, 28, 'Total Liabilities'),
    ajar(5310, 15, 16, 'Net Sales'),
    ajar(5320, 16, 16, 'Cost of Goods Sold'),
    ajar(5330, 17, 16, 'Total Operating Expenses'),
    ajar(5340, 18, 35, 'Net Income'),
    ajar(5350, 20, 16, 'Shareholders Equity'),
    ajar(5360, 21, 16, 'Shares Outstanding'),
    ajar(5370, 22, 16, 'Price Per Share'),
    { baris: 5380, jalan: function (m) {
        ['CR', 'QR', 'IU', 'ITR', 'FAU', 'TAU', 'DTE', 'OP',
         'PWR', 'NPNS', 'ROIA', 'PER', 'EPS'].forEach(function (n) {
          m.v[n] = 0;
        });
      } },
    minta(5390, 6, 'Average Inventory                  ', 16),
    isi(5400, 'I'),
    minta(5410, 7, 'Current Assets                     ', 16),
    isi(5420, 'CA'),
    minta(5430, 8, 'Fixed And Long Term Assets         ', 16),
    isi(5440, 'NFA'),
    minta(5450, 9, 'Total Assets     ', 33),
    { baris: 5460, jalan: function (m) { m.v.TA = m.v.CA + m.v.NFA; } },
    { baris: 5470, jalan: function (m) {
        m.cetakFormat('$$###########,.##', m.v.TA); m.barisBaru();
      } },
    minta(5480, 11, 'Current Liabilities                ', 16),
    isi(5490, 'CL'),
    minta(5500, 12, 'Long Term Liabilities              ', 16),
    isi(5510, 'LTD'),
    minta(5520, 13, 'Total Liabilities     ', 28),
    { baris: 5530, jalan: function (m) { m.v.TD = m.v.CL + m.v.LTD; } },
    { baris: 5540, jalan: function (m) {
        m.cetakFormat('$$###########,.##', m.v.TD); m.barisBaru();
      } },
    minta(5550, 15, 'Net Sales                          ', 16),
    isi(5560, 'S'),
    minta(5570, 16, 'Cost of Goods Sold                 ', 16),
    isi(5580, 'COG'),
    minta(5590, 17, 'Total Operating Expenses           ', 16),
    isi(5600, 'OE'),
    minta(5610, 18, 'Net Income     ', 35),
    { baris: 5620, jalan: function (m) {
        m.v.NI = m.v.S - m.v.COG - m.v.OE;
      } },
    { baris: 5630, jalan: function (m) {
        m.cetakFormat('$$###########,.##', m.v.NI); m.barisBaru();
      } },
    minta(5640, 20, 'Shareholders Equity                ', 16),
    isi(5650, 'SE'),
    minta(5660, 21, 'Shares Outstanding                 ', 16),
    { baris: 5670, bagian: [
        function (m) { m.gosub(6350); },
        function (m) { m.v.SO = angka(m.v.ZA); }
      ] },
    minta(5680, 22, 'Price Per Share                    ', 16),
    isi(5690, 'PPS'),
    { baris: 5700, bagian: [
        function (m) {
          m.locate(24, 18);
          m.cetak('***** Strike Any Key To Calculate Ratios *****');
        },
        function (m) { m.gosub(460); },
        function (m) { m.gosub(5140); },
        function (m) {
          m.warna(11, 0); m.locate(4, 31, 0);
          m.cetak('These Are Your Ratios');
        },
        function (m) { m.gosub(5200); }
      ] },
    rasio(5710, 'CR', function (m) {
        return (m.v.CA > 0 && m.v.CL > 0) ? m.v.CA / m.v.CL : null;
      }),
    { baris: 5720, jalan: function (m) { m.v.TA = m.v.CA + m.v.NFA; } },
    rasio(5730, 'QR', function (m) {
        return (m.v.CL !== 0 && m.v.CA !== m.v.I) ? (m.v.CA - m.v.I) / m.v.CL : null;
      }),
    rasio(5740, 'IU', function (m) {
        return (m.v.S > 0 && m.v.I > 0) ? m.v.S / m.v.I : null;
      }),
    rasio(5750, 'ITR', function (m) {
        return (m.v.COG > 0 && m.v.I > 0) ? m.v.COG / m.v.I : null;
      }),
    rasio(5760, 'FAU', function (m) {
        return (m.v.S > 0 && m.v.NFA !== 0) ? m.v.S / m.v.NFA : null;
      }),
    rasio(5770, 'TAU', function (m) {
        return (m.v.S > 0 && m.v.TA > 0) ? m.v.S / m.v.TA : null;
      }),
    { baris: 5780, jalan: function (m) {
        m.v.X1 = m.v.TD - m.v.CL + m.v.SE;
      } },
    /* 5790 `IF X1#<0.01 THEN ELSE DTE#=...` — cabang THEN-nya KOSONG. Yang
       sebenarnya dimaksud "kalau TIDAK kurang dari 0,01, hitunglah". Ditulis
       dengan cara paling berputar yang mungkin. */
    { baris: 5790, jalan: function (m) {
        if (m.v.X1 < 0.01) { /* kosong */ }
        else m.v.DTE = (m.v.TD - m.v.CL) / m.v.X1;
      } },
    rasio(5800, 'OP', function (m) {
        return (m.v.OE > 0 && m.v.S > 0) ? m.v.OE / m.v.S : null;
      }),
    rasio(5810, 'PWR', function (m) {
        return (m.v.SE !== 0) ? m.v.NI / m.v.SE : null;
      }),
    rasio(5820, 'NPNS', function (m) {
        return (m.v.S !== 0) ? m.v.NI / m.v.S : null;
      }),
    rasio(5830, 'ROIA', function (m) {
        return (m.v.TA !== 0) ? m.v.NI / m.v.TA : null;
      }),
    rasio(5840, 'EPS', function (m) {
        return (m.v.SO !== 0) ? m.v.NI / m.v.SO : null;
      }),
    rasio(5850, 'PER', function (m) {
        return (m.v.EPS !== 0) ? m.v.PPS / m.v.EPS : null;
      }),
    ajar(5860, 6, 58, 'Averages'),
    banding(5870,  8, 'Current Ratio             #####.##', 'CR', '            2.5 x'),
    banding(5880,  9, 'Quick Ratio               #####.##', 'QR', '            1.0 x'),
    banding(5890, 10, 'Inventory Utilization     #####.##', 'IU', '              9 x'),
    banding(5900, 11, 'Inventory Turnover Ratio  #####.##', 'ITR', '            .17 x   '),
    banding(5910, 12, 'Fixed Asset Utilization   #####.##', 'FAU', '            3.0 x'),
    banding(5920, 13, 'Total Asset Utilization   #####.##', 'TAU', '            1.8 x'),
    banding(5930, 14, 'Debt to Equity Ratio       ####.##', 'DTE', '         Variable'),
    banding(5940, 15, 'Operating Ratio           #####.##', 'OP', '            .60 x'),
    banding(5950, 16, 'Profits-Worth Ratio        ####.##', 'PWR', '            .18 x'),
    banding(5960, 17, 'N.Profits-N.Sales Ratio    ####.##', 'NPNS', '            .05 x'),
    banding(5970, 18, 'ROI in Assets Ratio        ####.##', 'ROIA', '         Variable'),
    banding(5980, 19, 'Price Earnings Ratio      #####.##', 'PER', '            9.0 x'),
    banding(5990, 20, 'Earnings Per Share         $###.##', 'EPS', '         Variable'),
    { baris: 6000, jalan: function (m) {
        m.warna(11, 0); m.locate(24, 16, 0);
        m.cetak('***** Strike Any Key To Try Another Analysis *****');
      } },
    { baris: 6010, bagian: [
        function (m) { m.gosub(460); },
        function (m) { m.lompat(5130); }
      ] },
    { baris: 6020, jalan: function (m) { m.warna(7, 0); m.lompat(40); } },
    { baris: 6030, jalan: function (m) { m.lompat(6040); } },

    /* --- 6040-6340: PENYUNTING UANG --------------------------------------
       Angkanya disimpan sebagai DERET DIGIT (`ZH`), bukan sebagai bilangan.
       Tiap ketukan menambah satu digit di ujung, lalu seluruh medannya
       DICETAK ULANG lewat PRINT USING. Yang terlihat pemakai selalu angka
       yang sudah berformat lengkap dengan koma dan tanda dolar. */
    { baris: 6040, jalan: function (m) {
        m.v.LENGTH = 12; m.v.FIRSTONE = 1;
      } },
    topeng(6050, 1, ' #############,.#'),
    topeng(6060, 2, ' ############,.##'),
    topeng(6070, 3, ' ###########,.##%'),
    { baris: 6080, jalan: function (m) {
        m.v['MASK$'] = '$$' + ulang('#', 11) + ',.##';
      } },
    { baris: 6090, jalan: function (m) {
        m.v.ZH = '000';
        m.v.XLIN = m.barisKursor(); m.v.XPOS = m.pos() - 1;
        m.v.ZR = ulang(' ', m.v.LENGTH);
        m.v.FLAG = 0; m.v.PERIOD = 0;
      } },
    gambarMedan(6100),
    { baris: 6110, jalan: function (m) { if (m.inkey() !== '') m.lompat(6110); } },
    { baris: 6120, jalan: function (m) {
        m.v.ZI = m.inkey();
        if (m.v.ZI === '') m.lompat(6120);
      } },
    { baris: 6130, jalan: function (m) {
        if (m.v.ZI === '0' && m.v.FIRSTONE) m.lompat(6120);
        else m.v.FIRSTONE = 0;
      } },
    { baris: 6140, jalan: function (m) {
        if (m.v.ZI === m.chr(13)) {
          var n = angka(m.v.ZH) / 100;
          m.v.ZA = (ulang(' ', m.v.LENGTH + 2) + teks(n)).slice(-(m.v.LENGTH + 2));
          m.kembali();
        }
      } },
    { baris: 6150, jalan: function (m) {
        if (m.v.ZI === '.' && m.v.PERIOD === 0) { m.v.PERIOD = 1; m.lompat(6120); }
      } },
    { baris: 6160, jalan: function (m) {
        if (m.v.ZI.length > 1) {
          m.lompat(m.v.ZI.slice(-1) === m.chr(75) ? 6270 : 6120);
        }
      } },
    { baris: 6170, jalan: function (m) { if (m.v.ZI === m.chr(8)) m.lompat(6270); } },
    { baris: 6180, jalan: function (m) {
        if (m.v.FLAG || m.v.ZI < '0' || m.v.ZI > '9') m.lompat(6120);
      } },
    { baris: 6190, jalan: function (m) {
        if (m.v.PERIOD === 1) {
          m.v.ZH = ganti(m.v.ZH, m.v.ZH.length - 2, m.v.ZI); m.lompat(6230);
        }
      } },
    { baris: 6200, jalan: function (m) {
        if (m.v.PERIOD === 2) {
          m.v.ZH = ganti(m.v.ZH, m.v.ZH.length - 1, m.v.ZI); m.lompat(6230);
        }
      } },
    { baris: 6210, jalan: function (m) {
        if (m.v.ZH.length > m.v.LENGTH - 1) m.lompat(6120);
      } },
    { baris: 6220, jalan: function (m) {
        m.v.ZH = m.v.ZH + '0';
        m.v.ZH = ganti(m.v.ZH, m.v.ZH.length - 3, m.v.ZI);
      } },
    gambarMedan(6230),
    { baris: 6240, jalan: function (m) { if (m.v.PERIOD === 2) m.v.FLAG = 1; } },
    { baris: 6250, jalan: function (m) { if (m.v.PERIOD === 1) m.v.PERIOD = 2; } },
    { baris: 6260, jalan: function (m) { m.lompat(6120); } },
    { baris: 6270, jalan: function (m) {
        if (m.v.ZH.length < 3) m.v.ZH = '0' + m.v.ZH;
      } },
    { baris: 6280, jalan: function (m) { if (m.v.ZH.length < 3) m.lompat(6120); } },
    { baris: 6290, jalan: function (m) {
        if (m.v.PERIOD === 1) {
          m.v.PERIOD = 0;
          m.v.ZH = ganti(m.v.ZH, m.v.ZH.length - 2, '0');
          m.lompat(6330);
        }
      } },
    { baris: 6300, jalan: function (m) {
        if (m.v.PERIOD === 2 && m.v.FLAG) {
          m.v.FLAG = 0; m.v.PERIOD = 1;
          m.v.ZH = ganti(m.v.ZH, m.v.ZH.length - 1, '0');
          m.lompat(6330);
        }
      } },
    { baris: 6310, jalan: function (m) {
        if (m.v.PERIOD === 2) {
          m.v.PERIOD = 0;
          m.v.ZH = ganti(m.v.ZH, m.v.ZH.length - 2, '0');
          m.lompat(6330);
        }
      } },
    { baris: 6320, jalan: function (m) {
        m.v.ZH = ganti(m.v.ZH, m.v.ZH.length - 3, '0');
        m.v.ZH = m.v.ZH.slice(0, m.v.ZH.length - 1);
      } },
    { baris: 6330, jalan: function (m) {
        m.locate(m.v.XLIN, m.v.XPOS); m.spc(m.v.LENGTH);
      } },
    { baris: 6340, jalan: function (m) {
        m.locate(m.v.XLIN, m.v.XPOS, 1);
        m.v.ZR = (ulang(' ', m.v.LENGTH) + m.v.ZH).slice(-m.v.LENGTH);
        m.cetakFormat(m.v['MASK$'], angka(m.v.ZR) / 100);
        m.locate(null, m.pos() - 1);
        m.lompat(6120);
      } },

    /* --- 6350-6460: PENYUNTING BILANGAN BULAT ----------------------------- */
    { baris: 6350, jalan: function (m) {
        m.v['MASK$'] = '############,### ';
        m.v.ZA = ulang(' ', 10);
      } },
    { baris: 6360, jalan: function (m) {
        m.v.XLIN = m.barisKursor(); m.v.XPOS = m.pos();
        m.cetakFormat(m.v['MASK$'], 0);
      } },
    { baris: 6370, jalan: function (m) {
        m.v.ZH = '';
        if (m.inkey() !== '') m.lompat(6370);
      } },
    { baris: 6380, jalan: function (m) {
        m.v.ZI = m.inkey();
        if (m.v.ZI === '') m.lompat(6380);
      } },
    { baris: 6390, jalan: function (m) {
        if (m.v.ZI === m.chr(13)) {
          m.v.ZA = (m.v.ZH + ulang(' ', 10)).slice(0, 10);
          m.kembali();
        }
      } },
    { baris: 6400, jalan: function (m) {
        if (m.v.ZI === m.chr(8) || m.v.ZI.slice(-1) === m.chr(75)) m.lompat(6450);
      } },
    { baris: 6410, jalan: function (m) { if (m.v.ZI.length > 1) m.lompat(6370); } },
    { baris: 6420, jalan: function (m) {
        if (m.v.ZI < '0' || m.v.ZI > '9') m.lompat(6380);
      } },
    { baris: 6430, jalan: function (m) { if (m.v.ZH.length > 9) m.lompat(6380); } },
    { baris: 6440, jalan: function (m) {
        m.v.ZH = m.v.ZH + m.v.ZI;
        m.v.ZA = (ulang(' ', 10) + m.v.ZH).slice(-10);
        m.locate(m.v.XLIN, m.v.XPOS);
        m.cetakFormat(m.v['MASK$'], angka(m.v.ZA));
        m.lompat(6380);
      } },
    { baris: 6450, jalan: function (m) { if (m.v.ZH.length < 1) m.lompat(6380); } },
    { baris: 6460, jalan: function (m) {
        m.v.ZH = m.v.ZH.slice(0, m.v.ZH.length - 1);
        m.v.ZA = (ulang(' ', 10) + m.v.ZH).slice(-10);
        m.locate(m.v.XLIN, m.v.XPOS);
        m.cetakFormat(m.v['MASK$'], angka(m.v.ZA));
        m.lompat(6380);
      } },
    { baris: 6470, jalan: function (m) { m.lompat(40); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function angka(z) { return parseFloat(String(z).replace(/,/g, '')) || 0; }
  function teks(n) {
    var b = Math.round(n * 1e6) / 1e6;
    return (b < 0 ? '' : ' ') + String(b) + ' ';
  }
  function ulang(s, n) { var k = '', i; for (i = 0; i < n; i++) k += s; return k; }
  function ganti(s, i, c) { return s.slice(0, i) + c + s.slice(i + 1); }

  function ajar(nomor, b, k, isiTeks) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isiTeks); m.barisBaru();
    } };
  }

  function pilihan(nomor, b, k, kode, isiTeks) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.warna(0, 7); m.cetak(kode);
      m.warna(3, 0); m.cetak(isiTeks); m.barisBaru();
    } };
  }

  function fungsi(nomor, b, k, kode, isiTeks) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.warna(0, 7); m.cetak(kode);
      m.warna(7, 0); m.cetak(isiTeks); m.barisBaru();
    } };
  }

  function petunjuk(nomor, b, k, isiTeks) {
    return { baris: nomor, jalan: function (m) {
      m.warna(11, 0); m.locate(b, k, 0); m.cetak(isiTeks);
      m.warna(7, 0); m.kembali();
    } };
  }

  function garisAtas(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.warna(15, 0);
      for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
        for (m.v.J = 20; m.v.J <= 62; m.v.J++) {
          m.locate(m.v.I, m.v.J, 0); m.cetak(m.chr(196)); m.barisBaru();
        }
      }
    } };
  }

  function sudut(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.locate(1, 19); m.cetak(m.chr(218)); m.barisBaru();
      m.locate(1, 63); m.cetak(m.chr(191)); m.barisBaru();
      m.locate(3, 63); m.cetak(m.chr(217)); m.barisBaru();
      m.locate(3, 19); m.cetak(m.chr(192)); m.barisBaru();
    } };
  }

  function sisi(nomor, warnaBalik) {
    return { baris: nomor, jalan: function (m) {
      m.locate(2, 19);
      m.cetak(m.chr(179)); m.spc(43); m.cetak(m.chr(179)); m.barisBaru();
      if (warnaBalik) m.warna(0, 7);
    } };
  }

  function kepala(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.cls(); m.barisBaru(); m.warna(0, 7); m.cetak(' F10 ');
      m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru(); m.warna(11, 0);
    } };
  }

  function namaLayar(nomor, k, isiTeks, pulang) {
    return { baris: nomor, jalan: function (m) {
      m.warna(0, 7); m.locate(2, k); m.cetak(isiTeks); m.barisBaru();
      m.warna(7, 0);
      if (pulang) m.kembali();
    } };
  }

  function subJudul(nomor, k, isiTeks) {
    return { baris: nomor, jalan: function (m) {
      m.warna(11, 0); m.locate(4, k); m.cetak(isiTeks); m.barisBaru();
      m.warna(7, 0);
    } };
  }

  function kotakAtas(nomor, b, k, lebar) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(m.chr(201));
      for (m.v.I = 1; m.v.I <= lebar; m.v.I++) m.cetak(m.chr(205));
      m.cetak(m.chr(187)); m.barisBaru();
    } };
  }

  function kotakKanan(nomor, k) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.J = 6; m.v.J <= 23; m.v.J++) {
        m.locate(m.v.J, k); m.cetak(m.chr(186)); m.barisBaru();
      }
      m.locate(null, k); m.cetak(m.chr(188));
    } };
  }

  function kotakBawah(nomor, kiri, kanan) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.J = kanan; m.v.J >= kiri + 1; m.v.J--) {
        m.locate(24, m.v.J); m.cetak(m.chr(205));
      }
      m.locate(24, kiri); m.cetak(m.chr(200));
    } };
  }

  function kotakKiri(nomor, k) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.J = 23; m.v.J >= 6; m.v.J--) {
        m.locate(m.v.J, k); m.cetak(m.chr(186)); m.barisBaru();
      }
    } };
  }

  /* Satu baris `GOSUB a:GOSUB b:...:GOTO n` — rantai subrutin yang jadi
     "resep" tiap fungsi. Inilah cara program ini menyusun tujuh perhitungan
     dari potongan yang sama. */
  function rantai(nomor, daftar, tujuan) {
    var bagian = daftar.map(function (t) {
      return function (m) { m.gosub(t); };
    });
    if (tujuan !== undefined) bagian.push(function (m) { m.lompat(tujuan); });
    return { baris: nomor, bagian: bagian };
  }

  function judul(nomor, huruf, teksJudul, tujuan) {
    return { baris: nomor, jalan: function (m) {
      var r = m.v['RS$'];
      if (r === huruf || r === huruf.toLowerCase()) {
        m.v['HD$'] = teksJudul; m.lompat(tujuan);
      }
    } };
  }

  function lompatKe(nomor, huruf, tujuan) {
    return { baris: nomor, jalan: function (m) {
      var r = m.v['RS$'];
      if (r === huruf || r === huruf.toLowerCase()) m.lompat(tujuan);
    } };
  }

  function jalankanKe(nomor, huruf, nama) {
    return { baris: nomor, jalan: function (m) {
      var r = m.v['RS$'];
      if (r === huruf || r === huruf.toLowerCase()) m.jalankan(nama);
    } };
  }

  function minta(nomor, b, isiTeks, kol) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, kol || 16, 1); m.warna(11, 0); m.cetak(isiTeks);
    } };
  }

  function ambil(nomor, sub, nama, ulangKe) {
    return { baris: nomor, bagian: [
      function (m) { m.gosub(sub); },
      function (m) {
        m.v[nama] = angka(m.v.ZA);
        if (m.v[nama] === 0) m.lompat(ulangKe); else m.kembali();
      }
    ] };
  }

  function isi(nomor, nama) {
    return { baris: nomor, bagian: [
      function (m) { m.gosub(6030); },
      function (m) { m.v[nama] = angka(m.v.ZA); }
    ] };
  }

  function hasil(nomor, b, fmt, nama, kol) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, kol || 16);
      m.cetakFormat(fmt, m.v[nama] || 0); m.barisBaru();
    } };
  }

  function batas(nomor, uji, pesan, ulangKe) {
    return { baris: nomor, jalan: function (m) {
      if (uji(m)) {
        m.locate(23, 17); m.warna(11, 0); m.cetak(pesan);
        m.locate(23, 17); m.spc(49);
        m.locate(11, 45); m.spc(20); m.warna(7, 0);
        m.lompat(ulangKe);
      }
    } };
  }

  function rasio(nomor, nama, hitung) {
    return { baris: nomor, jalan: function (m) {
      var h = hitung(m);
      if (h !== null) m.v[nama] = h;
    } };
  }

  function banding(nomor, b, fmt, nama, rata) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, 15); m.cetakFormat(fmt, m.v[nama] || 0);
      m.cetak(rata); m.barisBaru();
    } };
  }

  function topeng(nomor, dec, mask) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.DEC === dec) { m.v['MASK$'] = mask; m.v.DEC = 0; m.lompat(6090); }
    } };
  }

  function gambarMedan(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.v.ZR = (ulang(' ', m.v.LENGTH) + m.v.ZH).slice(-m.v.LENGTH);
      m.locate(m.v.XLIN, m.v.XPOS, 1);
      m.cetakFormat(m.v['MASK$'], angka(m.v.ZR) / 100);
      m.locate(null, m.pos() - 1);
    } };
  }

  function tebak(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.v.GS = Math.floor((m.v.PRS * Math.pow(1 + m.v.IST / 100, m.v.YS) +
               0.005000001) * 100) / 100;
    } };
  }
  function bulatkan(nomor) {
    return { baris: nomor, jalan: function (m) {
      m.v.GS = Math.floor(m.v.GS * 100);
    } };
  }
  function ujiTebak(nomor, tujuan) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.GS > m.v.BT && m.v.GS < m.v.TP) m.lompat(tujuan);
    } };
  }
  function arah(nomor, langkah, tujuan) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.GS > m.v.TP) { m.v.IST = m.v.IST - langkah; m.lompat(tujuan); }
    } };
  }
  function naik(nomor, langkah) {
    return { baris: nomor, jalan: function (m) { m.v.IST = m.v.IST + langkah; } };
  }
  function arahYS(nomor, langkah, tujuan) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.GS > m.v.TP) { m.v.YS = m.v.YS - langkah; m.lompat(tujuan); }
    } };
  }
  function naikYS(nomor, langkah) {
    return { baris: nomor, jalan: function (m) { m.v.YS = m.v.YS + langkah; } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['MENU2'] = {
    nama: 'MENU2',
    judul: 'Menu #2 — tujuh program bisnis',
    sumber: 'MENU2',
    berkas: 'run/MENU2.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur MENU2.BAS',
      simpul: [
        { id: 'menu', baris: '80-400', jenis: 'mulai',
          teks: ['Sebelas pilihan;', 'empat RUN, tujuh GOTO'] },
        { id: 'amort', baris: '450-1550', jenis: 'subrutin',
          teks: ['Amortisasi: bunga, cicilan,', 'pokok, atau pelunasan'] },
        { id: 'impas', baris: '1560-1930', jenis: 'subrutin',
          teks: ['Titik impas:', 'sebelas baris ramalan'] },
        { id: 'susut', baris: '1940-3050', jenis: 'subrutin',
          teks: ['Penyusutan: empat metode', 'akuntansi'] },
        { id: 'eoq', baris: '3060-3470', jenis: 'subrutin',
          teks: ['Kuantitas pesanan ekonomis:', 'rumus akar Wilson'] },
        { id: 'nilai', baris: '3480-4760', jenis: 'subrutin',
          teks: ['Nilai kini/mendatang;', 'bunga dicari dengan menebak'] },
        { id: 'pesan', baris: '4770-5110', jenis: 'subrutin',
          teks: ['Titik pesan ulang:', 'sembilan margin keamanan'] },
        { id: 'rasio', baris: '5120-6020', jenis: 'subrutin',
          teks: ['Tiga belas rasio saham,', 'dengan rata-rata pembanding'] },
        { id: 'uang', baris: '6040-6340',
          teks: ['Penyunting uang:', 'digambar ulang tiap ketukan'] },
        { id: 'bulat', baris: '6350-6460',
          teks: ['Penyunting bilangan bulat'] }
      ],
      panah: [
        { dari: 'menu', ke: 'amort', label: 'E' },
        { dari: 'menu', ke: 'impas', label: 'H' },
        { dari: 'menu', ke: 'susut', label: 'B' },
        { dari: 'menu', ke: 'eoq', label: 'F' },
        { dari: 'menu', ke: 'nilai', label: 'D' },
        { dari: 'menu', ke: 'pesan', label: 'C' },
        { dari: 'menu', ke: 'rasio', label: 'I' },
        { dari: 'amort', ke: 'uang' },
        { dari: 'nilai', ke: 'uang' },
        { dari: 'rasio', ke: 'uang' },
        { dari: 'susut', ke: 'bulat' },
        { dari: 'eoq', ke: 'bulat' },
        { dari: 'pesan', ke: 'bulat' },
        { dari: 'uang', ke: 'menu', label: 'F10' },
        { dari: 'bulat', ke: 'menu', label: 'F10' }
      ]
    },

    pseudokode: [
      { baris: 310, tingkat: 0, teks: '<b>menu:</b> empat pilihan <code>RUN</code> berkas lain, tujuh <code>GOTO</code> ke dalam berkas ini' },
      { baris: 600, tingkat: 0, teks: 'tiap fungsi adalah <b>rantai GOSUB</b>: gambar, minta, hitung, tampilkan' },
      { baris: 6040, tingkat: 1, teks: 'penyunting uang: angkanya disimpan sebagai <b>deret digit</b>&hellip;' },
      { baris: 6230, tingkat: 2, teks: '&hellip;dan seluruh medannya <b>dicetak ulang</b> lewat PRINT USING tiap ketukan' },
      { baris: 1150, tingkat: 1, teks: 'amortisasi: suku bunga dicari dengan <b>membelah dua</b>' },
      { baris: 1190, tingkat: 2, teks: 'nilai berhenti berubah? berhenti &mdash; tidak akan pernah bertemu' },
      { baris: 4100, tingkat: 1, teks: 'nilai kini: bunga dicari dengan <b>lima tahap penebakan yang ditulis lima kali</b>' },
      { baris: 3340, tingkat: 1, teks: 'EOQ: <code>SQR(2 &times; unit &times; biaya / simpan)</code>' },
      { baris: 5710, tingkat: 1, teks: 'rasio saham: tiga belas rumus, masing-masing dijaga pembagian nol' },
      { baris: 5790, tingkat: 2, teks: '&mdash; kecuali yang satu ini, ditulis <code>IF &hellip; THEN ELSE &hellip;</code>' }
    ],

    perintahAsli: 'run\\MENU2.bat',
    catatanAsli: 'Menu ini adalah pintu masuk kelompok program bisnis; ' +
      'pilihan A, G, J, dan K benar-benar menjalankan berkas lain.',

    penyimpangan: [
      '<b>Presisi ganda (<code>#</code>) ditiru dengan bilangan pecahan ' +
      'JavaScript biasa.</b> Untuk seluruh angka yang dipakai program ini ' +
      'hasilnya sama; untuk angka yang jauh lebih besar bisa berbeda di digit ' +
      'terakhir.',

      '<b><code>PRINT USING</code> yang ditiru cuma bentuk <code>$$</code>, ' +
      '<code>#</code>, <code>,</code>, <code>.##</code></b>, beserta ' +
      '<code>%</code> harfiah di ujungnya.',

      '<b><code>POKE &amp;H17</code> (bendera CapsLock) tidak berbuat ' +
      'apa-apa.</b>',

      '<b><code>RESUME NEXT</code> di baris 420 dijalankan sebagai ' +
      '<code>RESUME</code> biasa.</b> Tidak ada baris di program ini yang ' +
      'benar-benar melimpah, jadi bedanya tidak pernah terlihat.'
    ],

    pelajaran: {
      ringkas: 'Tujuh program bisnis dalam satu berkas. Yang layak ' +
        'dipelajari: penyunting angka yang menggambar ulang dirinya tiap ' +
        'ketukan, dan pencarian akar yang ditulis tangan lima kali.',
      pelajari: [
        ['Penyunting angka yang selalu berformat',
         'Baris 6040-6340 menyimpan angkanya sebagai <b>deret digit</b> ' +
         '(<code>ZH</code>), bukan sebagai bilangan. Tiap ketukan menambah ' +
         'satu digit, lalu seluruh medannya dicetak ulang lewat ' +
         '<code>PRINT USING</code>. Yang terlihat pemakai selalu angka ' +
         'lengkap dengan koma dan tanda dolar &mdash; sesuatu yang di masa ' +
         'itu biasanya butuh pustaka tersendiri.'],
        ['Rantai GOSUB sebagai resep',
         'Baris 600: <code>GOSUB 640:GOSUB 790:GOSUB 930:GOSUB 950:GOSUB 970: ' +
         '&hellip;</code>. Tiap fungsi disusun dari potongan yang sama: ' +
         'gambar kepala, gambar kotak, minta angka A, minta angka B, hitung, ' +
         'tampilkan. Empat fungsi amortisasi berbeda hanya di <b>urutan ' +
         'potongannya</b>.'],
        ['Menu yang melompat, bukan menjalankan',
         'Empat pilihan memakai <code>RUN "..."</code> (berkas lain); tujuh ' +
         'sisanya <code>GOTO &lt;nomor&gt;</code>. Dari sisi pemakai keduanya ' +
         'identik. Batas antara "program" dan "subrutin" di sini cuma soal ' +
         'apakah muat di memori 64K.'],
        ['Membelah dua untuk mencari bunga',
         'Baris 1150-1240: batas bawah 0, batas atas 1, tebak di tengah, ' +
         'lalu ganti salah satu batasnya. Cara baku mencari akar sebuah ' +
         'persamaan yang tidak bisa dibalik &mdash; dan baris 1190 ' +
         'menambahkan penjaga: kalau nilainya berhenti berubah, berhenti.']
      ],
      hindari: [
        ['Menulis satu gelung lima kali',
         'Baris 4100-4460 mencari suku bunga dengan menebak: langkah 5, lalu ' +
         '1, lalu 0,1, lalu 0,01, lalu 0,001. Tiap tahap adalah <b>salinan ' +
         'enam baris yang sama</b> dengan satu angka diganti. Tiga puluh enam ' +
         'baris untuk apa yang bisa ditulis sebagai satu gelung dengan langkah ' +
         'yang dibagi sepuluh. Dan baris 4490-4720 melakukannya lagi untuk ' +
         'jumlah tahun, kali ini empat tahap.'],
        ['THEN yang kosong',
         'Baris 5790: <code>IF X1#&lt;0.01 THEN ELSE DTE#=(TD#-CL#)/X1#</code>. ' +
         'Cabang <code>THEN</code>-nya tidak ada isinya sama sekali. Yang ' +
         'dimaksud "kalau TIDAK kurang dari 0,01, hitunglah" &mdash; ditulis ' +
         'dengan cara paling berputar yang mungkin.'],
        ['Konstanta ajaib yang berulang',
         '<code>0.005000001</code> muncul <b>lebih dari dua puluh kali</b> di ' +
         'berkas ini. Itu "setengah sen, plus sedikit" untuk pembulatan ke ' +
         'atas. Satu variabel bernama akan menjelaskan dirinya sendiri; dua ' +
         'puluh salinan angka tidak.'],
        ['Variabel yang diisi dan tidak pernah dibaca',
         '<code>SAVERS$</code> di baris 1990 menyimpan tombol yang ditekan, ' +
         'dan tidak muncul lagi di mana pun.']
      ]
    },

    penjelasan: [
      { judul: 'Tujuh program dalam satu berkas',
        isi: [
          'Berkas ini 642 baris &mdash; yang terbesar di koleksi. Tapi ia ' +
          'bukan satu program: ia <b>tujuh</b>, ditambah menunya.',
          'Lihat penyalur di baris 310-395:',
          '<code>310 IF RS$="A" ... THEN RUN"BUSONE"</code><br>' +
          '<code>320 IF RS$="B" ... THEN 1940</code>',
          'Pilihan A menjalankan <b>berkas lain</b>. Pilihan B melompat ke ' +
          'baris 1940 <b>di berkas ini</b>. Dari sisi pemakai, keduanya sama ' +
          'saja: layar berganti, program lain jalan.',
          'Kenapa dibagi begitu? Karena memori. GW-BASIC memuat seluruh ' +
          'programnya ke RAM, dan mesin 64K tidak bisa memuat sepuluh program ' +
          'sekaligus. Yang kecil digabung; yang besar dipisah.',
          'Akibatnya terlihat di baris 20: <code>CLEAR ,36000</code> ' +
          '&mdash; menyisakan 36 kilobita untuk variabel. Dan di baris 410: ' +
          'galat 53 (berkas tidak ditemukan) berarti <code>RUN"menu2"</code> ' +
          '&mdash; kembali ke sini.',
          'Pelajarannya bukan "jangan lakukan ini". Pelajarannya: <b>batas ' +
          'antara modul sering ditentukan oleh mesin, bukan oleh ' +
          'rancangan</b> &mdash; dan waktu batas mesinnya hilang, batas ' +
          'modulnya sering ikut tertinggal.'
        ] },
      { judul: 'Angka yang selalu terlihat berformat',
        isi: [
          'Mengetik jumlah uang di layar teks 1982 biasanya berarti: ketik ' +
          'angka mentah, tekan Enter, lalu program mencetaknya rapi.',
          'Program ini melakukan sesuatu yang lain, di baris 6040-6340.',
          'Angkanya disimpan sebagai <b>deret digit</b> di <code>ZH</code> ' +
          '&mdash; string, bukan bilangan. Mulai dari "000". Tiap kali pemakai ' +
          'menekan angka, baris 6220 menggeser digitnya masuk:',
          '<code>ZH=ZH+"0":MID$(ZH,LEN(ZH)-2)=ZI</code>',
          'Lalu baris 6230 mencetak ulang <b>seluruh medannya</b>:',
          '<code>RSET ZR=ZH:LOCATE XLIN,XPOS,1:PRINT USING MASK$;VAL(ZR)/100;</code>',
          'Jadi mengetik 1, 2, 3, 4, 5 memperlihatkan berturut-turut ' +
          '<code>$0.01</code>, <code>$0.12</code>, <code>$1.23</code>, ' +
          '<code>$12.34</code>, <code>$123.45</code>. Angkanya <b>tumbuh dari ' +
          'kanan</b>, persis seperti mesin kasir.',
          'Titik desimal ditangani dengan bendera <code>PERIOD</code> yang ' +
          'punya tiga keadaan (0, 1, 2) &mdash; belum ada titik, satu digit ' +
          'sesudah titik, dua digit &mdash; dan <code>FLAG</code> yang ' +
          'mengunci masukan sesudah dua desimal.',
          'Dan <code>MASK$</code> dipilih baris 6050-6080 dari variabel ' +
          '<code>DEC</code>: 1 untuk satu desimal, 2 untuk dua, 3 untuk ' +
          'persen, dan selain itu format dolar. Satu penyunting, empat ' +
          'tampilan.'
        ] },
      { judul: 'Satu gelung yang ditulis lima kali',
        isi: [
          'Untuk mencari suku bunga dari nilai kini dan nilai mendatang, ' +
          'tidak ada rumus terbalik. Yang bisa dilakukan: menebak, hitung ' +
          'hasilnya, dan sesuaikan.',
          'Program ini melakukannya bertahap: langkah 5, lalu 1, lalu 0,1, ' +
          'lalu 0,01, lalu 0,001. Idenya benar dan tua &mdash; kasar dulu, ' +
          'lalu halus.',
          'Yang tidak biasa adalah cara menulisnya. Baris 4110-4160:',
          '<code>4110 GS#=INT((PRS#*((1+IST#/100)^YS)+0.005000001)*100)/100</code><br>' +
          '<code>4120 GS#=INT(GS#*100)</code><br>' +
          '<code>4130 IF GS#>BT# AND GS#&lt;TP# THEN 4470</code><br>' +
          '<code>4140 IF GS#>TP# THEN IST#=IST#-5:GOTO 4170</code><br>' +
          '<code>4150 IST#=IST#+5</code><br>' +
          '<code>4160 GOTO 4110</code>',
          'Lalu baris 4170-4220 mengulanginya dengan langkah <b>1</b>. Lalu ' +
          '4230-4280 dengan <b>0,1</b>. Lalu 4290-4340 dengan <b>0,01</b>. ' +
          'Lalu 4350-4400 dengan <b>0,001</b>.',
          'Tiga puluh enam baris, lima salinan, satu angka yang berbeda.',
          'Satu gelung dengan <code>STEP</code> yang dibagi sepuluh tiap ' +
          'putaran akan mengerjakan hal yang sama dalam delapan baris. Dan ' +
          'baris 4490-4720 melakukan kesalahan yang sama lagi, kali ini untuk ' +
          'mencari jumlah tahun.',
          'Bandingkan dengan baris 1150-1240 di bagian amortisasi, yang ' +
          'memecahkan masalah yang sama dengan <b>membelah dua</b> &mdash; ' +
          'sembilan baris, satu gelung, dan lebih cepat bertemu. Dua ' +
          'pendekatan berbeda untuk pertanyaan yang sama, di dalam berkas ' +
          'yang sama.'
        ] }
    ]
  };
})(window);
