/* ===========================================================================
   MORTGAGE.js — porting minimalis MORTGAGE.BAS sebagai tabel baris.

       950 REM Version 1.00 (C)Copyright IBM Corp 1981, 1982
       960 REM Licensed Material - Program Property of IBM
       965 REM Author - Glenn Stuart Dardick
       970 REM Modified by Ayodele Isaac Anise; September, 1986.

   Satu-satunya PERANGKAT LUNAK IBM RESMI di koleksi ini — dan satu-satunya
   yang punya baris hak cipta perusahaan. Dua kegunaan: membandingkan angsuran
   bulanan di berbagai suku bunga, dan membuat tabel amortisasi.

   Tiga hal yang membuatnya layak ditelusuri:

   (1) SELURUH MATEMATIKANYA SATU BARIS.

           1480 PF = AF*(RF/(1-(1/((1+RF)^NF)))):RETURN

       Rumus anuitas: angsuran = pokok x bunga / (1 - (1+bunga)^-jumlah).
       Dipakai dua kali, dari kedua kegunaannya.

   (2) TATA LETAKNYA DITENTUKAN OLEH PERANGKAT KERASNYA.

           1155 IF (PEEK(&H410) AND &H30)<>&H30 THEN COLS = 3:GOTO 1158
           1156 WIDTH 80:COLS=8

       Alamat &H410 adalah KATA PERLENGKAPAN BIOS. Dua bitnya menyimpan jenis
       kartu layar yang terpasang. Monokrom -> layar 80 kolom, delapan kolom
       pembanding. Selain itu -> 40 kolom, tiga kolom pembanding. Program yang
       menanyakan mesinnya sendiri, lalu menyesuaikan diri.

   (3) PEMBULATAN UANG DENGAN ANGKA YANG ANEH.

           1930 P = INT((P+0.005000001)*100)/100

       Bukan 0.005 — melainkan 0.005000001. Tambahan sepersejuta itu ada
       untuk mengalahkan galat perwakilan pecahan biner: separuh sen yang
       "sebenarnya" 0.00499999... akan membulat ke bawah tanpa dorongan itu.
       Sebuah tambalan yang harus ditulis penulisnya, dan yang masih dipakai
       akuntan sampai hari ini dengan nama lain.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom. Baris 1155
     dijalankan seolah kartu layarnya BUKAN monokrom, jadi `COLS=3` — tiga
     kolom pembanding, seperti di mesin berwarna.
   - `COLOR 23,0` (baris 2435) memakai atribut KEDIP; konsol tidak berkedip.
   - Gelung tunda `FOR I=1 TO 1000` habis seketika.
   =========================================================================== */

(function (global) {
  'use strict';

  var KA = 218, DATAR = 196, KN = 191, TEGAK = 179, BA = 192, BN = 217;

  function ul(m, kode, n) { return m.ulang(n, kode); }
  /* PRINT USING "####.##" dan kawan-kawannya. */
  function fmt(n, lebar, desimal) {
    var s = (Number(n) || 0).toFixed(desimal);
    while (s.length < lebar) s = ' ' + s;
    return s;
  }
  function basic(n) {
    var v = Number(n) || 0;
    var s = (v === Math.floor(v)) ? String(Math.abs(v))
                                  : String(Number(Math.abs(v).toPrecision(15)));
    return (v < 0 ? '-' : ' ') + s + ' ';
  }

  var tabel = [

    rem(940), rem(950), rem(960), rem(965), rem(970),
    { baris: 975, jalan: function () { } },
    { baris: 980, jalan: function (m) { m.v['SAMPLES$'] = 'NO'; } },
    /* 990 melompati baris 1000 — jadi `SAMPLES$` TIDAK PERNAH jadi "YES"
       kecuali program lain masuk lewat `RUN "MORTGAGE",1000`. Pintu masuk
       kedua yang tidak dipakai siapa pun di disket ini. */
    { baris: 990, jalan: function (m) { m.lompat(1010); } },
    { baris: 1000, jalan: function (m) { m.v['SAMPLES$'] = 'YES'; } },

    /* --- 1010-1140: layar judul ------------------------------------------- */
    { baris: 1010, jalan: function (m) {
        m.warna(15, 0); m.cls();
        m.locate(5, 19); m.cetak('IBM'); m.barisBaru();
      } },
    { baris: 1020, jalan: function (m) {
        m.locate(7, 12, 0); m.cetak('Personal Computer'); m.barisBaru();
      } },
    { baris: 1030, jalan: function (m) {
        m.warna(10, 0); m.locate(10, 9, 0);
        m.cetak(m.chr(213) + m.ulang(21, 205) + m.chr(184)); m.barisBaru();
      } },
    { baris: 1040, jalan: function (m) {
        m.locate(11, 9, 0);
        m.cetak(m.chr(TEGAK) + '      MORTGAGE       ' + m.chr(TEGAK));
        m.barisBaru();
      } },
    { baris: 1050, jalan: function (m) {
        m.locate(12, 9, 0);
        m.cetak(m.chr(TEGAK) + m.ulang(21, 32) + m.chr(TEGAK)); m.barisBaru();
      } },
    { baris: 1060, jalan: function (m) {
        m.locate(13, 9, 0);
        m.cetak(m.chr(TEGAK) + '    Version 1.10     ' + m.chr(TEGAK));
        m.barisBaru();
      } },
    { baris: 1070, jalan: function (m) {
        m.locate(14, 9, 0);
        m.cetak(m.chr(212) + m.ulang(21, 205) + m.chr(190)); m.barisBaru();
      } },
    { baris: 1080, jalan: function (m) {
        m.warna(15, 0); m.locate(17, 4, 0);
        m.cetak('(C) Copyright IBM Corp 1981, 1982'); m.barisBaru();
      } },
    { baris: 1090, jalan: function (m) {
        m.warna(14, 0); m.locate(23, 7, 0);
        m.cetak('Press space bar to continue'); m.barisBaru();
      } },
    { baris: 1100, jalan: function (m) { if (m.inkey() !== '') m.lompat(1100); } },
    { baris: 1110, jalan: function (m) { m.v['CMD$'] = m.inkey(); } },
    { baris: 1120, jalan: function (m) {
        if (m.v['CMD$'] === ' ') m.lompat(1150);
      } },
    { baris: 1130, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.lompat(1210);
      } },
    { baris: 1140, jalan: function (m) { m.lompat(1110); } },

    /* --- 1150-1158: MENANYAKAN PERANGKAT KERASNYA SENDIRI ----------------- */
    /* `DEFDBL P` — P, PD, dan PF berpresisi ganda. Untuk uang, presisi
       tunggal (tujuh angka berarti) sudah habis di ratusan ribu rupiah. */
    { baris: 1150, jalan: function (m) {
        m.warna(15, 0); m.cls();
        m.dim('AMORT()', 500, 2);
      } },
    { baris: 1154, jalan: function () { } },
    /* 1155 `PEEK(&H410)` membaca KATA PERLENGKAPAN BIOS di 0040:0010. Bit 4
       dan 5 menyimpan jenis kartu layar saat mesin dinyalakan; nilai 0x30
       berarti monokrom 80 kolom. Di penelusur, dianggap BUKAN monokrom. */
    { baris: 1155, jalan: function (m) { m.v.COLS = 3; m.lompat(1158); } },
    { baris: 1156, jalan: function (m) { m.v.COLS = 8; } },
    { baris: 1158, jalan: function () { } },
    { baris: 1160, jalan: function (m) { m.gosub(1240); } },
    { baris: 1170, jalan: function (m) {
        if (m.v['I$'].charCodeAt(0) === 27) m.lompat(1210);
      } },
    { baris: 1180, jalan: function (m) {
        if (m.v['I$'].charAt(0) === '2') m.lompat(2010);
      } },
    { baris: 1190, jalan: function (m) {
        if (m.v['I$'].charAt(0) === '1') m.lompat(1490);
      } },
    { baris: 1200, jalan: function (m) { m.lompat(1160); } },
    { baris: 1210, jalan: function (m) {
        if (m.v['SAMPLES$'] !== 'YES') m.lompat(1220);
      } },
    /* 1215 tidak pernah tercapai, karena baris 990 melompati 1000. */
    { baris: 1215, jalan: function (m) { m.rantai('SAMPLES', 1000); } },
    { baris: 1220, jalan: function (m) { m.gosub(1470); } },
    { baris: 1230, jalan: function (m) { m.henti('END di baris 1230.'); } },

    /* --- 1240-1461: menu utama -------------------------------------------- */
    rem(1240),
    { baris: 1250, jalan: function (m) {
        m.warna(15, 0); m.cls(); m.warna(0, 7);
        m.cetak(' MORTGAGE ANALYSIS '); m.barisBaru();
      } },
    { baris: 1260, jalan: function (m) {
        m.warna(15, 0); m.locate(3, 1);
        m.cetak('OPTIONS - '); m.barisBaru();
      } },
    cet(1270, '1 - MORTGAGE PAYMENT COMPARISONS '),
    cet(1280, '2 - MORTGAGE AMORTIZATION'),
    cet(1290, 'ESC KEY - EXIT'),
    cet(1300, ' '),
    cet(1310, 'OPTION NUMBER (1,2, OR ESC) =====>'),
    cet(1330, ' '),
    { baris: 1340, jalan: function (m) { m.warna(15, 0); } },
    kotakAtas(1350), kotak(1360, '  MORTGAGE PAYMENT COMPARISONS       '),
    kotak(1370, '    - USE THIS OPTION TO COMPARE     '),
    kotak(1380, '      THE MONTHLY PAYMENTS OF        '),
    kotak(1390, '      MORTGAGES AT VARIOUS RATES     '),
    kotak(1400, '      AND PRINCIPAL AMOUNTS.         '),
    kotak(1410, '  MORTGAGE AMORTIZATION              '),
    kotak(1420, '    - USE THIS OPTION TO CALCULATE   '),
    kotak(1430, '      THE PRINCIPAL AND INTEREST     '),
    kotak(1440, '      PAID OVER ANY 12 MONTH PERIOD. '),
    kotakBawah(1450),
    { baris: 1460, jalan: function (m) {
        m.warna(0, 7); m.locate(8, 37); m.cetak(' '); m.locate(8, 37);
      } },
    { baris: 1461, jalan: function (m) {
        m.v['I$'] = m.inkey();
        if (m.v['I$'] === '') m.lompat(1461);
        else { m.cetak(m.v['I$']); m.kembali(); }
      } },
    { baris: 1470, jalan: function (m) {
        m.warna(15, 0); m.cls();
        m.henti('END di baris 1470.');
      } },
    /* 1480 SELURUH matematikanya: rumus anuitas dalam satu baris. */
    { baris: 1480, jalan: function (m) {
        m.v.PF = m.v.AF * (m.v.RF / (1 - (1 / Math.pow(1 + m.v.RF, m.v.NF))));
        m.kembali();
      } },

    /* --- 1490-2000: perbandingan angsuran --------------------------------- */
    rem(1490),
    { baris: 1500, jalan: function (m) {
        m.warna(15, 0); m.cls(); m.warna(0, 7);
        m.cetak(' MORTGAGE PAYMENT COMPARISON PROGRAM '); m.barisBaru();
      } },
    { baris: 1510, jalan: function (m) { m.locate(10, 1); m.warna(15, 0); } },
    kotakAtas(1520), kotak(1530, '  MORTGAGE PAYMENT COMPARISONS       '),
    kotak(1540, '    - USE THIS OPTION TO COMPARE     '),
    kotak(1550, '      THE MONTHLY PAYMENTS OF        '),
    kotak(1560, '      MORTGAGES AT VARIOUS RATES     '),
    kotak(1570, '      AND PRINCIPAL AMOUNTS.         '),
    kotak(1580, '                                     '),
    kotak(1590, '  NOTE: TO SELECT A VALUE OR AMOUNT  '),
    kotak(1600, '      ENTER THE APPROPRIATE VALUE    '),
    kotak(1610, '      AND PRESS THE ENTER KEY.       '),
    kotakBawah(1620),
    { baris: 1630, bagian: [
        function (m) { m.locate(3, 1); },
        function (m) { m.masukan('A$', 'ENTER BASE MORTGAGE AMOUNT ===> '); }
      ] },
    /* 1640 `GOTO 1600` — DAN 1600 ADALAH SALAH SATU BARIS KOTAK, bukan
       tempat bertanya. Memasukkan nol atau angka negatif melompat ke tengah
       penggambar kotak, mencetak tiga baris sisanya, lalu jatuh ke 1630 dan
       bertanya lagi. Kesalahan yang sama ada di baris 2200. */
    { baris: 1640, jalan: function (m) {
        m.v.A = parseFloat(m.v['A$']) || 0;
        if (m.v.A <= 0) m.lompat(1600);
      } },
    { baris: 1650, jalan: function (m) { m.v.AINC = 2000; } },
    { baris: 1660, jalan: function (m) {
        m.locate(4, 1); m.spc(38);
      } },
    { baris: 1670, jalan: function (m) {
        m.locate(5, 1); m.cetak('(1 TO 35 PERCENT)');
      } },
    { baris: 1680, bagian: [
        function (m) { m.locate(4, 1); },
        function (m) { m.masukan('IR$', 'ENTER BASE INTEREST RATE =====> '); }
      ] },
    { baris: 1690, jalan: function (m) {
        m.v.IR = parseFloat(m.v['IR$']) || 0;
        if (m.v.IR > 35 || m.v.IR < 1) m.lompat(1660);
      } },
    /* 1700 bunga tahunan jadi bunga BULANAN (bagi 1200 = bagi 100 lalu bagi
       12), dan langkah kenaikannya seperempat persen setahun. */
    { baris: 1700, jalan: function (m) {
        m.v.R = m.v.IR / 1200; m.v.RINC = 0.0025 / 12;
      } },
    { baris: 1710, jalan: function (m) { m.locate(5, 1); m.spc(38); } },
    { baris: 1720, jalan: function (m) {
        m.locate(6, 1); m.cetak('(1 TO 35 YEARS)');
      } },
    { baris: 1730, bagian: [
        function (m) { m.locate(5, 1); },
        function (m) { m.masukan('Y$', 'ENTER NUMBER OF YEARS IN MTG => '); }
      ] },
    { baris: 1740, jalan: function (m) { m.v.Y = parseFloat(m.v['Y$']) || 0; } },
    { baris: 1750, jalan: function (m) { m.v.N = m.v.Y * 12; } },
    { baris: 1760, jalan: function (m) { m.v.NF = m.v.N; } },
    { baris: 1770, jalan: function (m) {
        if (m.v.NF > 420 || m.v.NF < 1) m.lompat(1710);
      } },
    { baris: 1780, jalan: function (m) { m.cls(); } },
    { baris: 1790, jalan: function (m) {
        m.warna(0, 7);
        m.cetak(' MONTHLY MORTGAGE PAYMENT COMPARISONS '); m.barisBaru();
      } },
    { baris: 1800, jalan: function (m) {
        m.warna(15, 0); m.locate(3, 10);
        m.cetak(m.v['Y$'] + '-YEAR MORTGAGE LOAN AMOUNTS');
      } },
    { baris: 1810, jalan: function (m) {
        m.locate(5, 2); m.cetak('RATES'); m.warna(0, 7);
      } },
    { baris: 1820, jalan: function (m) { m.untuk('I', 0, m.v.COLS, 1, 1850); } },
    { baris: 1830, jalan: function (m) {
        m.locate(4, 9 + m.v.I * 8); m.spc(7); m.barisBaru();
        m.locate(4, 9 + m.v.I * 8);
        m.cetak(basic(m.v.A + m.v.I * m.v.AINC)); m.barisBaru();
      } },
    { baris: 1840, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1850, jalan: function (m) { m.untuk('I', 0, 14, 1, 1890); } },
    { baris: 1860, jalan: function (m) {
        m.locate(6 + m.v.I, 1); m.spc(7); m.barisBaru();
        m.locate(6 + m.v.I, 2);
      } },
    /* 1870 bunga bulanan dikembalikan jadi persen tahunan: kali 120000 lalu
       bagi 100, dengan +0,5 untuk membulatkan. */
    { baris: 1870, jalan: function (m) {
        var p = Math.floor(((m.v.R + m.v.I * m.v.RINC) * 120000) + 0.5) / 100;
        m.cetakFormat('##.##', p); m.barisBaru();
      } },
    { baris: 1880, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1890, jalan: function (m) { m.warna(15, 0); } },
    { baris: 1900, jalan: function (m) { m.untuk('I', 0, 14, 1, 1970); } },
    { baris: 1910, bagian: [
        function (m) {
          m.v.RF = m.v.R + m.v.I * m.v.RINC; m.v.AF = 1;
        },
        function (m) { m.gosub(1480); }
      ] },
    { baris: 1920, jalan: function (m) { m.untuk('J', 0, m.v.COLS, 1, 1960); } },
    /* 1930 PEMBULATAN UANG. Perhatikan 0.005000001, bukan 0.005 — lihat
       catatan di kepala berkas. */
    { baris: 1930, jalan: function (m) {
        m.v.P = m.v.PF * (m.v.A + m.v.J * m.v.AINC);
        m.v.P = Math.floor((m.v.P + 0.005000001) * 100) / 100;
      } },
    { baris: 1935, jalan: function (m) {
        if (m.v.P > 10000) {
          m.locate(22, 1);
          m.cetak('PAYMENTS TOO LARGE TO DISPLAY'); m.barisBaru();
          m.lompat(1980);
        }
      } },
    { baris: 1940, jalan: function (m) {
        m.locate(6 + m.v.I, 9 + m.v.J * 8);
        m.cetakFormat('####.##', m.v.P);
      } },
    { baris: 1950, jalan: function (m) { m.lanjutkan('J'); } },
    { baris: 1960, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1970, jalan: function (m) { m.cetak(' '); m.barisBaru(); } },
    { baris: 1980, jalan: function (m) {
        m.cetak('PRESS SPACE BAR TO CONTINUE');
      } },
    { baris: 1990, jalan: function (m) {
        if (m.inkey() !== ' ') m.lompat(1990);
      } },
    { baris: 2000, jalan: function (m) { m.lompat(1160); } },

    /* --- 2010-2860: amortisasi -------------------------------------------- */
    rem(2010),
    { baris: 2020, jalan: function (m) { m.warna(7, 0); } },
    { baris: 2030, jalan: function (m) { m.cls(); } },
    { baris: 2040, jalan: function (m) { m.warna(0, 7); } },
    { baris: 2050, jalan: function (m) { m.locate(1, 1); } },
    cet(2060, ' MORTGAGE AMORTIZATION PROGRAM '),
    { baris: 2070, jalan: function (m) { m.locate(10, 1); m.warna(15, 0); } },
    kotakAtas(2080), kotak(2090, '  MORTGAGE AMORTIZATION              '),
    kotak(2100, '    - USE THIS OPTION TO CALCULATE   '),
    kotak(2110, '      THE PRINCIPAL AND INTEREST     '),
    kotak(2120, '      PAID OVER ANY 12 MONTH PERIOD. '),
    kotak(2130, '                                     '),
    kotak(2140, '  NOTE: TO SELECT A VALUE OR AMOUNT  '),
    kotak(2150, '      ENTER THE APPROPRIATE VALUE    '),
    kotak(2160, '      AND PRESS THE ENTER KEY.       '),
    kotakBawah(2170),
    { baris: 2180, jalan: function (m) { m.locate(3, 1); } },
    { baris: 2190, jalan: function (m) {
        m.masukan('A$', 'ENTER MORTGAGE AMOUNT ===> ');
      } },
    /* 2200 `THEN 2150` — kesalahan yang sama dengan baris 1640: 2150 adalah
       baris kotak, bukan tempat bertanya. */
    { baris: 2200, jalan: function (m) {
        m.v.AF = parseFloat(m.v['A$']) || 0;
        if (m.v.AF <= 0) m.lompat(2150);
      } },
    { baris: 2210, jalan: function (m) { m.locate(4, 1); } },
    { baris: 2220, jalan: function (m) {
        m.cetak('                                      ');
      } },
    { baris: 2230, jalan: function (m) { m.locate(5, 1); } },
    { baris: 2240, jalan: function (m) { m.cetak('(1 TO 35 PERCENT)'); } },
    { baris: 2250, jalan: function (m) { m.locate(4, 1); } },
    { baris: 2260, jalan: function (m) {
        m.masukan('IR$', 'ENTER INTEREST RATE =====> ');
      } },
    { baris: 2270, jalan: function (m) {
        m.v.IR = parseFloat(m.v['IR$']) || 0;
      } },
    { baris: 2280, jalan: function (m) { if (m.v.IR > 35) m.lompat(2210); } },
    { baris: 2290, jalan: function (m) { if (m.v.IR < 1) m.lompat(2210); } },
    { baris: 2300, jalan: function (m) { m.v.RF = m.v.IR / 1200; } },
    { baris: 2310, jalan: function (m) { m.locate(5, 1); } },
    { baris: 2320, jalan: function (m) {
        m.cetak('                                      ');
      } },
    { baris: 2330, jalan: function (m) { m.locate(6, 1); } },
    { baris: 2340, jalan: function (m) { m.cetak('(1 TO 35 YEARS)'); } },
    { baris: 2350, jalan: function (m) { m.locate(5, 1); } },
    { baris: 2360, jalan: function (m) {
        m.masukan('Y$', 'ENTER NUMBER OF YEARS ===> ');
      } },
    { baris: 2370, jalan: function (m) { m.v.Y = parseFloat(m.v['Y$']) || 0; } },
    { baris: 2380, jalan: function (m) { m.v.NF = m.v.Y * 12; } },
    { baris: 2390, jalan: function (m) { if (m.v.NF > 420) m.lompat(2310); } },
    { baris: 2400, jalan: function (m) { if (m.v.NF < 1) m.lompat(2310); } },
    { baris: 2410, jalan: function (m) { m.gosub(1480); } },
    { baris: 2420, jalan: function (m) {
        m.v.PF = Math.floor((m.v.PF + 0.005000001) * 100) / 100;
      } },
    { baris: 2430, jalan: function (m) {
        m.cetak('MONTHLY PAYMENTS ARE ====>' + basic(m.v.PF)); m.barisBaru();
      } },
    { baris: 2435, jalan: function (m) { m.warna(23, 0); } },
    cet(2440, 'CALCULATING AMORTIZATION'),
    { baris: 2445, jalan: function (m) { m.warna(15, 0); } },
    { baris: 2450, jalan: function (m) { if (m.v.NF > 36) m.lompat(2470); } },
    /* 2460 jeda buatan: kalau tabelnya pendek, perhitungannya selesai terlalu
       cepat dan pesan "CALCULATING" tidak sempat terbaca. */
    { baris: 2460, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 1000; m.v.I++) { /* jeda */ }
      } },
    { baris: 2470, jalan: function (m) { m.v['AMORT()'][0][1] = m.v.AF; } },
    { baris: 2480, jalan: function (m) { m.untuk('I', 1, m.v.NF, 1, 2520); } },
    /* 2490-2500 seluruh amortisasinya: bunga bulan ini dari saldo bulan lalu,
       lalu saldo baru = saldo lama - angsuran + bunga. */
    { baris: 2490, jalan: function (m) {
        m.v['AMORT()'][m.v.I][2] =
          Math.floor((m.v['AMORT()'][m.v.I - 1][1] * m.v.RF + 0.005000001) * 100) / 100;
      } },
    { baris: 2500, jalan: function (m) {
        m.v['AMORT()'][m.v.I][1] =
          m.v['AMORT()'][m.v.I - 1][1] - m.v.PF + m.v['AMORT()'][m.v.I][2];
      } },
    { baris: 2510, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 2520, jalan: function (m) {
        for (m.v.I = 7; m.v.I <= 25; m.v.I++) {
          m.locate(m.v.I, 1); m.spc(39);
        }
      } },
    { baris: 2530, jalan: function (m) { m.locate(9, 1); } },
    { baris: 2540, jalan: function (m) {
        m.cetak(' - 1 TO' + basic(m.v.NF).replace(/ $/, '')); m.barisBaru();
      } },
    { baris: 2550, jalan: function (m) { m.cetak(' - 0 TO END AMORTIZATION'); } },
    { baris: 2560, jalan: function (m) { m.locate(7, 1); } },
    cet(2570, 'ENTER BEGINNING PAYMENT NUMBER'),
    { baris: 2580, jalan: function (m) {
        m.masukan('PERIOD$', 'OF 12 MONTH PERIOD ======> ');
      } },
    { baris: 2590, jalan: function (m) {
        m.v.PD = parseFloat(m.v['PERIOD$']) || 0;
      } },
    { baris: 2600, jalan: function (m) { if (m.v.PD !== 0) m.lompat(2620); } },
    { baris: 2610, jalan: function (m) {
        if (m.v['PERIOD$'] !== '0') m.lompat(2560);
      } },
    { baris: 2620, jalan: function (m) { if (m.v.PD === 0) m.lompat(1160); } },
    { baris: 2630, jalan: function (m) { if (m.v.PD > m.v.NF) m.lompat(2560); } },
    { baris: 2640, jalan: function (m) { if (m.v.PD < 0) m.lompat(2560); } },
    { baris: 2650, jalan: function (m) { m.locate(7, 1); } },
    { baris: 2660, jalan: function (m) { m.spc(39); m.barisBaru(); } },
    { baris: 2670, jalan: function (m) { m.spc(39); m.barisBaru(); } },
    { baris: 2680, jalan: function (m) { m.locate(9, 1); } },
    cet(2690, 'PYMNT PRINCIPAL   INTEREST    BALANCE'),
    { baris: 2700, jalan: function (m) { m.v.TINT = 0; } },
    { baris: 2710, jalan: function (m) {
        m.untuk('I', m.v.PD, m.v.PD + 11, 1, 2760);
      } },
    { baris: 2711, jalan: function (m) { if (m.v.I > m.v.NF) m.lompat(2750); } },
    { baris: 2720, jalan: function (m) {
        m.v.TINT = m.v.TINT + m.v['AMORT()'][m.v.I][2];
      } },
    { baris: 2730, jalan: function (m) { m.cetak(fmt(m.v.I, 3, 0) + ' '); } },
    { baris: 2740, jalan: function (m) {
        var A = m.v['AMORT()'][m.v.I];
        m.cetak('  ' + fmt(m.v.PF - A[2], 9, 2));
        m.cetak('  ' + fmt(A[2], 9, 2));
        m.cetak('  ' + fmt(A[1], 9, 2));
        m.barisBaru();
      } },
    { baris: 2750, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 2760, jalan: function (m) { m.cetak(' '); m.barisBaru(); } },
    { baris: 2770, jalan: function (m) {
        m.cetak('INTEREST FOR 12 PERIODS =');
      } },
    { baris: 2780, jalan: function (m) {
        m.cetak(fmt(m.v.TINT, 9, 2) + ' '); m.barisBaru();
      } },
    { baris: 2790, jalan: function (m) { m.locate(25, 1); } },
    { baris: 2800, jalan: function (m) {
        m.cetak('PRESS SPACE BAR TO CONTINUE');
      } },
    { baris: 2810, jalan: function (m) { m.kursor(false); } },
    { baris: 2820, jalan: function (m) { if (m.inkey() !== '') m.lompat(2820); } },
    { baris: 2830, jalan: function (m) { m.v['CMD$'] = m.inkey(); } },
    { baris: 2840, jalan: function (m) {
        if (m.v['CMD$'] === ' ') m.lompat(2520);
      } },
    { baris: 2850, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.lompat(1210);
      } },
    { baris: 2860, jalan: function (m) { m.lompat(2830); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function kotakAtas(n) {
    return { baris: n, jalan: function (m) {
      m.cetak(m.chr(KA) + m.ulang(37, DATAR) + m.chr(KN)); m.barisBaru();
    } };
  }
  function kotakBawah(n) {
    return { baris: n, jalan: function (m) {
      m.cetak(m.chr(BA) + m.ulang(37, DATAR) + m.chr(BN)); m.barisBaru();
    } };
  }
  function kotak(n, isi) {
    return { baris: n, jalan: function (m) {
      m.cetak(m.chr(TEGAK) + isi + m.chr(TEGAK)); m.barisBaru();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['MORTGAGE'] = {
    nama: 'MORTGAGE',
    judul: 'Mortgage (IBM, 1981-82) — anuitas dan amortisasi',
    sumber: 'MORTGAGE',
    berkas: 'run/MORTGAGE.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur MORTGAGE.BAS',
      simpul: [
        { id: 'judul', baris: '1010-1140', jenis: 'mulai',
          teks: ['Layar judul IBM,', 'spasi atau ESC'] },
        { id: 'keras', baris: '1150-1158',
          teks: ['PEEK kata perlengkapan BIOS:', 'monokrom? 80 kolom, 8 kolom'] },
        { id: 'menu', baris: '1240-1461', jenis: 'putusan',
          teks: ['1 bandingkan, 2 amortisasi,', 'ESC keluar'] },
        { id: 'rumus', baris: '1480', jenis: 'subrutin',
          teks: ['PF = AF*(RF/(1-(1+RF)^-NF))', 'seluruh matematikanya'] },
        { id: 'banding', baris: '1490-2000',
          teks: ['Tabel 15 baris bunga', 'x beberapa kolom pokok'] },
        { id: 'amort', baris: '2010-2510',
          teks: ['Hitung saldo dan bunga', 'tiap bulan sampai lunas'] },
        { id: 'petak', baris: '2520-2860',
          teks: ['Tampilkan 12 bulan mana pun,', 'lalu tanya lagi'] },
        { id: 'keluar', baris: '1210-1230', jenis: 'keluar',
          teks: ['CHAIN "SAMPLES" - tak pernah;', 'lalu END'] }
      ],
      panah: [
        { dari: 'judul', ke: 'keras' },
        { dari: 'keras', ke: 'menu' },
        { dari: 'menu', ke: 'banding', label: '1' },
        { dari: 'menu', ke: 'amort', label: '2' },
        { dari: 'banding', ke: 'rumus' },
        { dari: 'amort', ke: 'rumus' },
        { dari: 'amort', ke: 'petak' },
        { dari: 'petak', ke: 'menu', label: '0' },
        { dari: 'banding', ke: 'menu' },
        { dari: 'menu', ke: 'keluar', label: 'ESC' }
      ]
    },

    pseudokode: [
      { baris: 1155, tingkat: 0, teks: '<code>PEEK(&amp;H410)</code> &mdash; <b>tanyakan kartu layar apa yang terpasang</b>' },
      { baris: 1156, tingkat: 1, teks: 'monokrom &rarr; <code>WIDTH 80</code>, delapan kolom pembanding; selain itu tiga' },
      { baris: 1480, tingkat: 0, teks: '<code>PF = AF*(RF/(1-(1/((1+RF)^NF))))</code> &mdash; <b>rumus anuitas</b>' },
      { baris: 1700, tingkat: 0, teks: 'bunga tahunan &rarr; bulanan: bagi <b>1200</b>; kenaikan seperempat persen' },
      { baris: 1930, tingkat: 0, teks: '<code>INT((P+0.005000001)*100)/100</code> &mdash; <b>bukan 0.005</b>' },
      { baris: 2490, tingkat: 0, teks: 'bunga bulan ini = saldo bulan lalu &times; bunga bulanan' },
      { baris: 2500, tingkat: 1, teks: 'saldo baru = saldo lama &minus; angsuran + bunga' },
      { baris: 1640, tingkat: 0, teks: 'jumlah &le; 0 &rarr; <code>GOTO 1600</code> &mdash; <b>baris kotak, bukan tempat bertanya</b>' },
      { baris: 2710, tingkat: 0, teks: 'tampilkan dua belas bulan mana pun dari tabel yang sudah dihitung' }
    ],

    perintahAsli: 'run\\MORTGAGE.bat',
    catatanAsli: 'Perangkat lunak IBM resmi. Di layar monokrom ia beralih ke ' +
      '80 kolom dan menampilkan delapan kolom pembanding; di layar berwarna ' +
      '40 kolom dan tiga kolom.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol tetap 80 kolom. ' +
      'Baris 1155 dijalankan seolah kartu layarnya <b>bukan</b> monokrom, ' +
      'jadi <code>COLS=3</code> &mdash; tiga kolom pembanding, seperti di ' +
      'mesin berwarna.',

      '<b><code>COLOR 23,0</code> memakai atribut KEDIP</b> (7+16); pesan ' +
      '"CALCULATING AMORTIZATION" di baris 2440 seharusnya berkedip.',

      '<b>Gelung tunda habis seketika</b> (baris 2460).',

      '<b><code>DEFDBL P</code> tidak berpengaruh.</b> JavaScript cuma punya ' +
      'satu jenis bilangan pecahan, dan ia setara dengan presisi ganda ' +
      'BASIC &mdash; jadi hasilnya sama, tapi karena alasan yang berbeda.'
    ],

    pelajaran: {
      ringkas: 'Perangkat lunak IBM resmi: rumus anuitas satu baris, tata ' +
        'letak yang menyesuaikan diri dengan kartu layar, dan pembulatan uang ' +
        'yang harus ditambal sepersejuta.',
      pelajari: [
        ['Program yang menanyakan mesinnya sendiri',
         'Baris 1155 membaca <code>PEEK(&amp;H410)</code> &mdash; <b>kata ' +
         'perlengkapan BIOS</b> di 0040:0010, tempat BIOS mencatat apa saja ' +
         'yang terpasang saat mesin dinyalakan. Bit 4 dan 5 menyimpan jenis ' +
         'kartu layarnya; nilai 0x30 berarti monokrom 80 kolom. Kalau ya, ' +
         'program beralih ke 80 kolom dan menampilkan <b>delapan</b> kolom ' +
         'pembanding; kalau tidak, tetap 40 kolom dan <b>tiga</b>. Satu ' +
         '<code>PEEK</code>, dan seluruh tata letaknya menyesuaikan diri.'],
        ['Seluruh matematikanya satu baris',
         '<code>1480 PF = AF*(RF/(1-(1/((1+RF)^NF))))</code>. Rumus anuitas: ' +
         'angsuran = pokok &times; bunga &divide; (1 &minus; (1+bunga)<sup>' +
         '&minus;jumlah</sup>). Dipanggil dari kedua kegunaan program, dengan ' +
         'variabel yang sudah disiapkan pemanggilnya &mdash; <code>AF</code>, ' +
         '<code>RF</code>, <code>NF</code>. Subrutin tanpa parameter, di ' +
         'bahasa yang tidak punya parameter.'],
        ['Bunga tahunan dibagi 1200',
         'Baris 1700: <code>R = IR/1200</code>. Dua pembagian sekaligus ' +
         '&mdash; bagi 100 untuk mengubah persen jadi pecahan, bagi 12 untuk ' +
         'mengubah setahun jadi sebulan. Dan <code>RINC = 0.0025/12</code>: ' +
         'seperempat persen setahun, per bulan. Angka-angka itu tidak pernah ' +
         'dijelaskan, dan pembacanya harus membongkarnya sendiri.'],
        ['Amortisasi dalam dua baris',
         '<code>2490 AMORT(I,2) = bunga bulan ini dari saldo bulan lalu</code><br>' +
         '<code>2500 AMORT(I,1) = saldo lama &minus; angsuran + bunga</code>',
         ],
        ['Presisi ganda untuk uang',
         '<code>DEFDBL P</code> membuat <code>P</code>, <code>PD</code>, dan ' +
         '<code>PF</code> berpresisi ganda. Presisi tunggal BASIC cuma punya ' +
         'tujuh angka berarti &mdash; habis di ratusan ribu. Untuk cicilan ' +
         'yang dihitung 420 kali berturut-turut, galat kecil di awal jadi ' +
         'galat besar di akhir.']
      ],
      hindari: [
        ['Nomor baris salah di dua tempat yang sama',
         'Baris 1640: <code>IF A &lt;= 0 THEN GOTO 1600</code>. Tapi 1600 ' +
         'adalah salah satu <b>baris penggambar kotak</b> ' +
         '(<code>PRINT CHR$(179)+" ENTER THE APPROPRIATE VALUE "&hellip;</code>), ' +
         'bukan tempat bertanya. Memasukkan nol melompat ke tengah kotak, ' +
         'mencetak tiga baris sisanya di tempat yang salah, lalu jatuh ke 1630 ' +
         'dan bertanya lagi. <b>Kesalahan yang sama persis ada di baris ' +
         '2200</b> (<code>THEN 2150</code>). Empat pemeriksaan lain di berkas ' +
         'yang sama menunjuk baris yang benar.'],
        ['Angka ajaib yang tidak dijelaskan',
         '<code>1200</code>, <code>0.0025/12</code>, <code>120000</code>, ' +
         '<code>2000</code>, <code>420</code>, <code>0.005000001</code>. ' +
         'Enam angka yang masing-masing menyimpan satu keputusan, dan tidak ' +
         'satu pun punya <code>REM</code>.'],
        ['Pintu masuk kedua yang tidak dipakai siapa pun',
         'Baris 990 <code>GOTO 1010</code> melompati baris 1000 ' +
         '(<code>SAMPLES$="YES"</code>). Artinya <code>SAMPLES$</code> selalu ' +
         '"NO", dan <code>CHAIN "SAMPLES",1000</code> di baris 1215 tidak ' +
         'pernah tercapai. Rancangannya jelas: program lain masuk lewat ' +
         '<code>RUN "MORTGAGE",1000</code> untuk menyalakan modus contoh. ' +
         'Tidak ada program seperti itu di disket ini.'],
        ['Pinjaman yang tidak pernah benar-benar lunas',
         'Terverifikasi di penelusur: pinjaman 100.000 dengan bunga 12 persen ' +
         'selama 30 tahun memberi angsuran <b>1028,61</b> &mdash; angka buku ' +
         'teks, tepat. Tapi sesudah <b>360</b> angsuran, saldo di ' +
         '<code>AMORT(360,1)</code> masih <b>8,17</b> &mdash; sisa yang ' +
         'ditinggalkan pembulatan angsuran ke sen bulat. Program tidak pernah ' +
         'menyebutkannya, dan kolom BALANCE di bulan terakhir memperlihatkan ' +
         'angka itu apa adanya. Di dunia nyata, sisa seperti ini ditagihkan ' +
         'di angsuran terakhir; di sini ia cuma duduk di sana.'],
        ['Tabel yang dibuang seluruhnya karena satu sel',
         'Baris 1935: kalau satu angsuran melebihi 10.000, seluruh tabel ' +
         'ditinggalkan dengan pesan "PAYMENTS TOO LARGE TO DISPLAY". Lima ' +
         'belas baris yang mungkin sudah tergambar dibiarkan setengah jadi.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa 0,005000001 dan bukan 0,005',
        isi: [
          'Baris 1930 membulatkan uang ke sen terdekat:',
          '<code>P = INT((P+0.005000001)*100)/100</code>',
          'Cara membulatkan yang biasa: tambahkan setengah, lalu buang ' +
          'pecahannya. Untuk dua angka di belakang koma, setengahnya 0,005.',
          'Tapi yang ditulis <b>0,005000001</b>.',
          'Alasannya ada di cara komputer menyimpan pecahan. Bilangan seperti ' +
          '0,005 tidak bisa ditulis tepat dalam biner &mdash; yang tersimpan ' +
          'sebenarnya sedikit lebih kecil atau sedikit lebih besar. Begitu ' +
          'juga hasil perkalian di baris sebelumnya.',
          'Akibatnya sebuah angka yang secara matematika tepat 12,345 bisa ' +
          'tersimpan sebagai 12,34499999998. Ditambah 0,005 jadi ' +
          '12,34999999998, dikali 100 jadi 1234,999999998, dan ' +
          '<code>INT</code> membuangnya jadi <b>1234</b> &mdash; 12,34, bukan ' +
          '12,35.',
          'Tambahan sepersejuta itu memberi dorongan yang cukup untuk ' +
          'melewati batas, dan terlalu kecil untuk mengubah angka mana pun ' +
          'yang tidak sedang duduk tepat di batasnya.',
          'Ini <b>tambalan</b>, bukan pemecahan. Cara yang benar adalah ' +
          'menyimpan uang sebagai bilangan bulat sen sejak awal &mdash; dan ' +
          'itulah yang dilakukan setiap sistem keuangan modern. Tapi pada ' +
          '1981, di BASIC yang tidak punya jenis desimal, tambalan sepersejuta ' +
          'adalah yang bisa ditulis.',
          'Yang layak diingat: angka itu ada di sana karena <b>seseorang ' +
          'menemukan cicilan yang meleset satu sen</b>, melacaknya sampai ke ' +
          'pembulatan, dan menambahkan enam nol dan satu. Setiap angka aneh ' +
          'di kode keuangan biasanya punya cerita seperti itu.'
        ] },
      { judul: 'Program yang menanyakan mesinnya sendiri',
        isi: [
          'Pada 1981, sebuah IBM PC bisa punya salah satu dari dua kartu ' +
          'layar: MDA monokrom 80 kolom, atau CGA berwarna yang lebih nyaman ' +
          'di 40 kolom. Program yang sama harus jalan di keduanya.',
          'Baris 1155 memecahkannya dengan bertanya:',
          '<code>1155 IF (PEEK(&amp;H410) AND &amp;H30)&lt;&gt;&amp;H30 THEN ' +
          'COLS = 3:GOTO 1158</code><br>' +
          '<code>1156 WIDTH 80:COLS=8</code>',
          'Alamat <code>&amp;H410</code> adalah <b>kata perlengkapan</b> ' +
          '&mdash; enam belas bit yang diisi BIOS saat mesin dinyalakan, ' +
          'mencatat berapa banyak disket, berapa banyak port, dan jenis kartu ' +
          'layarnya. Bit 4 dan 5 (topeng <code>&amp;H30</code>) menyimpan ' +
          'yang terakhir; nilai 0x30 berarti monokrom.',
          'Dan hasilnya bukan cuma lebar layar. <code>COLS</code> menentukan ' +
          '<b>berapa banyak kolom pokok pinjaman yang dibandingkan</b>: ' +
          'delapan di layar lebar, tiga di layar sempit. Satu variabel ' +
          'menghubungkan perangkat keras dengan isi laporannya.',
          'Yang menarik: ini bentuk paling awal dari sesuatu yang sekarang ' +
          'ada di setiap halaman web &mdash; <i>tata letak responsif</i>. ' +
          'Bedanya, di sini yang ditanyakan bukan lebar jendela melainkan ' +
          '<b>kartu apa yang tertancap di papan induk</b>, dan jawabannya ' +
          'dibaca langsung dari memori BIOS.'
        ] }
    ]
  };
})(window);
