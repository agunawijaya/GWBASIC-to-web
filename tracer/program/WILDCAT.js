/* ===========================================================================
   WILDCAT.js — porting minimalis WILDCAT.BAS sebagai tabel baris.

   Program keenam belas: permainan pengeboran minyak. Sepuluh sumur, sejuta
   dolar modal, dan sebuah peta 10x10 tempat sebagian besar petaknya kosong.

   Dua hal yang membuatnya layak ditelusuri:

   (1) KISI PETANYA DIGAMBAR SETENGAH DENGAN PRINT, SETENGAH DENGAN POKE.
       Baris mendatarnya dicetak biasa (`PRINT STRING$(60,196)`), tapi tiap
       SIMPANGAN — siku, T, palang — dipoke langsung ke RAM layar di alamat
       yang dihitung sendiri (baris 1820-1930). Lebih cepat daripada mencetak
       ulang seluruh baris hanya untuk mengganti satu aksara.

   (2) SELURUH "GEOLOGI"-NYA CUMA TIGA TABEL DATA. Peluang menemukan minyak,
       banyaknya, dan harganya semua dibaca dari `DATA` di baris 2160-2330.
       Tidak ada rumus; yang ada tabel — dan tabel itulah keseluruhan
       permainannya.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Larik dan skalar bernama sama dipisahkan: `HIT(3,40)` jadi `HIT_`,
     `Z(10)` jadi `Z_`. BASIC membedakan `HIT` dari `HIT()`, JS tidak.
   - `PEEK`/`DEF SEG` tidak berarti apa-apa; uji kartu monokrom di baris 1810
     selalu menjawab kartu warna, jadi alamat pokenya selalu RAM layar.
   - `PRINT USING` yang ditiru hanya bentuk `$$`, `#`, `,`, `.##` (dan spasi
     harfiah di ujungnya).
   - Pengacaknya berbenih tetap; `RANDOMIZE` dari `TIME$` di baris 70-80
     memakai jam penelusur yang maju tetap, seperti CRAPS.BAS.
   - Kelima gelung tunda habis seketika.
   =========================================================================== */

(function (global) {
  'use strict';

  var ZUM = '$$########,.##';

  /* Sandi gambar menara bor, supaya berkas ini tetap ASCII:
       B = 219 balok penuh   b = 220 balok bawah
       t = 223 balok atas    | = 186 garis tegak ganda (pipa borannya) */
  var SANDI = { 'B': 219, 'b': 220, 't': 223, '|': 186, ' ': 32 };

  var tabel = [

    rem(10),
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 2340); m.jebakan(m.v.A, true);
        }
      } },
    { baris: 30, jalan: function (m) { m.pasangJebakan(10, 2670); } },
    { baris: 40, jalan: function (m) {
        m.warna(3, 0); m.v.XX = 1; m.v.YY = 1;
      } },
    { baris: 50, jalan: function (m) { m.locate(1, 1, 0); } },
    { baris: 60, jalan: function (m) {
        m.cls();
        m.dim('Z_', 10); m.dim('HIT_', 3, 40); m.dim('PAY', 20, 5, 3);
        m.dim('MAP', 100, 3); m.dim('WELL', 10);
        /* YRN() tidak pernah di-DIM. BASIC membuatnya sendiri dengan batas
           10 begitu disentuh pertama kali — dan kebetulan itu pas, karena
           sumurnya memang sepuluh. Kebetulan yang menyelamatkan. */
        m.dim('YRN', 10);
        m.v.JAM = 23;
      } },
    { baris: 70, jalan: function (m) { m.semai(detik(m)); } },
    { baris: 80, jalan: function (m) { m.semai(m.acak() * 30000); } },
    { baris: 90, jalan: function (m) { m.v.ZUM = ZUM; } },
    { baris: 100, jalan: function (m) { m.v.CSH = 1000000; } },
    { baris: 110, bagian: [
        function (m) { m.gosub(2350); },   /* judul + petunjuk */
        function (m) { m.gosub(2020); }    /* bangkitkan peta  */
      ] },
    { baris: 120, jalan: function (m) { m.v.CHS = 0; } },
    { baris: 130, jalan: function (m) { m.gosub(1770); } },
    { baris: 140, jalan: function (m) { m.gosub(2710); } },
    { baris: 150, jalan: function (m) {
        m.locate(24, 28); m.warna(14, 0);
        m.cetak('Please Pick A Drill Site.'); m.warna(3, 0);
      } },
    { baris: 160, jalan: function (m) {
        m.v.Z = m.inkey();
        var z = m.v.Z;
        if ((z < 'A' || z > 'J') && (z < 'a' || z > 'j')) m.lompat(160);
      } },
    { baris: 170, jalan: function (m) {
        if (m.v.Z > 'J') m.v.Z = m.chr(m.v.Z.charCodeAt(0) - 32);
        m.v.A = m.v.Z.charCodeAt(0) - 65;
      } },
    { baris: 180, jalan: function (m) { m.cetak('  ' + m.v.Z); } },
    { baris: 190, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(190);
      } },
    { baris: 200, jalan: function (m) {
        if (m.v.Z < '0' || m.v.Z > '9') {
          m.locate(24, 28); m.spc(50); m.barisBaru(); m.lompat(150);
        }
      } },
    { baris: 210, jalan: function (m) {
        m.v.B = parseInt(m.v.Z, 10) || 0; m.cetak(m.v.Z);
      } },
    { baris: 220, jalan: function (m) { m.v.C = m.v.A * 10 + m.v.B; } },
    /* 230 petak yang nilainya 2 = tanah kosong, 1 = sudah dibor. Keduanya
       ditolak, dan pesannya cuma "layar dibersihkan" — tidak ada satu kata
       pun yang memberi tahu kenapa. */
    { baris: 230, jalan: function (m) {
        var s = m.v.MAP[m.v.C][0];
        if (s === 2 || s === 1) {
          m.locate(24, 1); m.spc(79); m.lompat(150);
        }
      } },
    { baris: 240, jalan: function (m) { m.gosub(1590); } },
    { baris: 250, jalan: function (m) { if (m.v.YES) m.gosub(280); } },
    { baris: 260, jalan: function (m) { if (m.v.CHS < 10) m.lompat(130); } },
    { baris: 270, jalan: function (m) { m.lompat(2750); } },

    /* --- 280-430: menara bor, digambar sebelas baris teks ------------------ */
    { baris: 280, jalan: function (m) {
        m.cls(); m.locate(21, 1); m.cetak(m.ulang(80, 178)); m.barisBaru();
      } },
    { baris: 290, jalan: function (m) { m.warna(12, 0); } },
    derek(300,  9, 40, '|'),
    derek(310, 10, 35, 'BbbbbBbbbbB'),
    derek(320, 11, 35, '  Bb | bB  '),
    derek(330, 12, 35, '  BtB|BtB  '),
    derek(340, 13, 35, ' BtbB|BbtB '),
    derek(350, 14, 35, ' BBt | tBB '),
    derek(360, 15, 35, 'bBb  |  bBb'),
    derek(370, 16, 35, 'B tBb|bBt B'),
    derek(380, 17, 35, 'B   BBB   B'),
    derek(390, 18, 34, 'Bt bBt|tBb tB'),
    derek(400, 19, 34, 'BbBt  |  tBbB'),
    derek(410, 20, 34, 'Bt    |    tB'),
    derek(420, 21, 40, '|'),
    { baris: 430, jalan: function (m) { m.warna(2, 0); } },
    { baris: 440, jalan: function (m) {
        m.locate(1, 19); m.cetak('Potential Pay Zone   :');
      } },
    { baris: 450, jalan: function (m) {
        m.warna(15, 0);
        m.cetak(angka(m.v.SZN) + 'To' + angka(m.v.EZN) + 'Ft.');
        m.barisBaru(); m.warna(2, 0);
      } },
    { baris: 460, jalan: function (m) {
        m.locate(2, 25); m.cetak('Cost To Drill Per Ft : ');
      } },
    { baris: 470, jalan: function (m) {
        m.warna(15, 0); m.cetakFormat('$$#.##', 30);
        m.barisBaru(); m.warna(2, 0);
      } },
    { baris: 480, jalan: function (m) {
        m.v.MAP[m.v.C][0] = 1;
        m.v.CSF = m.v.SZN * 30;
        m.v.DT = m.v.SZN + 500;
      } },
    /* 490 dan 510 adalah uji yang SAMA, ditulis dua kali karena baris 500
       menaikkan CHS di antaranya — jadi indeks larik yang benar berubah dari
       CHS+1 jadi CHS. Menyalin barisnya lebih murah daripada memikirkannya
       ulang, tapi sekarang ada dua tempat yang harus ikut berubah. */
    { baris: 490, jalan: function (m) {
        if (m.v.CSH - m.v.CSF < 0) {
          m.v.OOM = 1; m.v.YRN[m.v.CHS + 1] = -m.v.CSH; m.lompat(2750);
        }
      } },
    { baris: 500, jalan: function (m) { m.v.D = 1; m.v.CHS = m.v.CHS + 1; } },
    { baris: 510, jalan: function (m) {
        if (m.v.CSH - m.v.CSF < 0) {
          m.v.OOM = 1; m.v.YRN[m.v.CHS] = -m.v.CSH; m.lompat(2750);
        }
      } },
    { baris: 520, jalan: function (m) {
        m.warna(2, 0); m.locate(3, 25); m.cetak('Cost So Far ');
      } },
    { baris: 530, jalan: function (m) {
        m.warna(15, 0); m.cetakFormat(ZUM, m.v.CSF);
        m.barisBaru(); m.warna(2, 0);
      } },
    { baris: 540, jalan: function (m) {
        m.locate(4, 25); m.cetak('Current Depth ');
      } },
    { baris: 550, jalan: function (m) {
        m.warna(15, 0); m.cetak(angka(m.v.DT)); m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 560, jalan: function (m) { m.v.D = m.v.D + 1; } },
    /* 570-580 inti seluruh permainannya: satu lemparan dadu 40 sisi, dibaca
       dari tabel yang dipilih menurut JENIS lapisan (1, 2, atau 3). Tabel
       jenis 1 (dangkal) penuh angka besar; tabel jenis 3 (dalam) hampir
       semuanya 1. Itulah "makin dalam makin kecil peluangnya". */
    { baris: 570, jalan: function (m) {
        m.v.TRY = Math.floor(m.acak() * 40) + 1;
      } },
    { baris: 580, jalan: function (m) {
        m.v.PAYOFF = m.v.HIT_[m.v.TYPE][m.v.TRY];
      } },
    { baris: 590, jalan: function (m) { if (m.v.PAYOFF > 1) m.lompat(930); } },
    hapus(600, 23), hapus(610, 24),
    { baris: 620, jalan: function (m) {
        m.locate(23, 32); m.cetak('No Show At');
        m.cetakFormat(' ##,### ', m.v.DT);
        m.cetak('Feet.');
      } },
    { baris: 630, jalan: function (m) { if (m.v.D < 3) m.lompat(660); } },
    { baris: 640, jalan: function (m) {
        m.locate(24, 28); m.cetak('You Must Try A New Well Sight');
      } },
    { baris: 650, jalan: function (m) {
        for (m.v.X = 1; m.v.X <= 4000; m.v.X++) { /* jeda */ }
        m.lompat(680);
      } },
    { baris: 660, jalan: function (m) {
        m.warna(13, 0); m.locate(24, 27);
        m.cetak('Do You Wish To Go Deeper? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 670, bagian: [
        function (m) { m.gosub(1720); },
        function (m) { if (m.v.YES) m.lompat(700); }
      ] },
    { baris: 680, jalan: function (m) { m.v.YRN[m.v.CHS] = -m.v.CSF; } },
    { baris: 690, jalan: function (m) {
        m.v.OPD = 0; m.v.GSP = 0; m.v.FRC = 0; m.v.OPN = 0;
        m.lompat(1180);
      } },
    hapus(700, 23), hapus(710, 24),
    { baris: 720, jalan: function (m) { m.warna(15, 0); } },
    { baris: 730, jalan: function (m) {
        m.locate(24, 27); m.cetak('Strike Enter Key When Ready');
      } },
    { baris: 740, jalan: function (m) {
        m.locate(23, 27); m.cetak('Enter New Test Depth : ');
      } },
    { baris: 750, jalan: function (m) { m.warna(3, 0); } },
    { baris: 760, jalan: function (m) { m.v.Z1 = ''; } },
    { baris: 770, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(770);
      } },
    { baris: 780, jalan: function (m) {
        if (m.v.Z === m.chr(13)) m.lompat(840);
      } },
    { baris: 790, jalan: function (m) {
        if (m.v.Z.slice(-1) === m.chr(75) || m.v.Z === m.chr(8)) m.lompat(820);
      } },
    { baris: 800, jalan: function (m) {
        if (m.v.Z1.length > 6) m.lompat(770);
      } },
    { baris: 810, jalan: function (m) {
        m.cetak(m.v.Z); m.v.Z1 = m.v.Z1 + m.v.Z; m.lompat(770);
      } },
    { baris: 820, jalan: function (m) {
        if (m.v.Z1.length < 1) m.lompat(770);
      } },
    { baris: 830, jalan: function (m) {
        m.cetak(m.chr(29) + m.chr(32) + m.chr(29));
        m.v.Z1 = m.v.Z1.slice(0, m.v.Z1.length - 1);
        m.lompat(770);
      } },
    { baris: 840, jalan: function (m) {
        m.locate(23, 1, 0); m.spc(79);
        m.warna(3, 0);
        m.v.DPT = parseFloat(m.v.Z1) || 0;
      } },
    { baris: 850, jalan: function (m) {
        if (m.v.DPT >= m.v.DT) m.lompat(880);
      } },
    { baris: 860, jalan: function (m) {
        m.locate(23, 31); m.cetak('You Must Go Deeper ');
        for (m.v.X = 1; m.v.X <= 4000; m.v.X++) { /* jeda */ }
      } },
    { baris: 870, jalan: function (m) {
        m.locate(23, 1); m.spc(79); m.lompat(740);
      } },
    { baris: 880, jalan: function (m) {
        if (m.v.DPT <= m.v.EZN) m.lompat(920);
      } },
    hapus(890, 24),
    { baris: 900, jalan: function (m) {
        m.locate(23, 30); m.cetak('You Are Past The Pay Zone');
      } },
    { baris: 910, jalan: function (m) {
        for (m.v.CC = 1; m.v.CC <= 4000; m.v.CC++) { /* jeda */ }
        m.lompat(700);
      } },
    { baris: 920, jalan: function (m) {
        m.v.CSF = m.v.CSF + 30 * (m.v.DPT - m.v.DT);
        m.v.DT = m.v.DPT;
        m.lompat(510);
      } },
    hapus(930, 23), hapus(940, 24),
    { baris: 950, jalan: function (m) {
        m.locate(23, 27); m.cetak('Oil And GAS Show At');
        m.cetakFormat(' ##### ', m.v.DT);
        m.cetak('Feet');
      } },
    { baris: 960, jalan: function (m) { m.v.FRC = 10 * m.v.DT; } },
    { baris: 970, jalan: function (m) {
        m.locate(24, 27); m.cetak('Fracture Cost Is');
        m.cetakFormat(ZUM, m.v.FRC);
      } },
    hapus(980, 25),
    { baris: 990, jalan: function (m) {
        m.locate(25, 27); m.cetak('Do You Want To Fracture? <Y/N>');
      } },
    { baris: 1000, bagian: [
        function (m) { m.gosub(1720); },
        function (m) { if (m.v.NO) m.lompat(680); }
      ] },
    /* 1010 `FIX(FIX(RND*10)*2)+1` — FIX di dalam FIX. Yang dalam sudah
       membulatkan, jadi yang luar tidak berbuat apa-apa. Hasilnya angka
       ganjil 1,3,5,...,19; baris 1020-1030 memakai pasangan (HIT, HIT+1)
       sebagai dua angka bersebelahan di tabel yang sama. */
    { baris: 1010, jalan: function (m) {
        m.v.HIT = Math.floor(Math.floor(m.acak() * 10) * 2) + 1;
      } },
    { baris: 1020, jalan: function (m) {
        m.v.OPD = m.v.PAY[m.v.HIT][m.v.PAYOFF][m.v.TYPE];
      } },
    { baris: 1030, jalan: function (m) {
        m.v.GSP = m.v.PAY[m.v.HIT + 1][m.v.PAYOFF][m.v.TYPE] * 1000;
      } },
    hapus(1040, 23), hapus(1050, 24), hapus(1060, 25),
    { baris: 1070, jalan: function (m) {
        m.locate(23, 20);
        m.cetak('    !!  EUREKA,  WE  STRUCK  OIL  !!'); m.barisBaru();
      } },
    /* 1080 GOTO ke baris tepat di bawahnya — sisa suntingan yang tak sempat
       dibuang. Tidak salah, tapi juga tidak berguna. */
    { baris: 1080, jalan: function (m) { m.lompat(1090); } },
    { baris: 1090, jalan: function (m) {
        m.locate(24, 19); m.cetak('Well Will Produce');
      } },
    { baris: 1100, jalan: function (m) {
        m.warna(15, 0); m.cetakFormat(' ### ', m.v.OPD); m.warna(3, 0);
      } },
    { baris: 1110, jalan: function (m) { m.cetak('Barrels Of Oil Per Day'); } },
    { baris: 1120, jalan: function (m) { m.locate(25, 19); } },
    { baris: 1130, jalan: function (m) {
        m.warna(15, 0); m.cetakFormat(' #,###,### ', m.v.GSP); m.warna(3, 0);
      } },
    { baris: 1140, jalan: function (m) {
        m.cetak('Cubic Feet Of Natural Gas Per Day');
      } },
    { baris: 1150, jalan: function (m) {
        m.v.OPN = (Math.floor(m.acak() * 75) + 150) * 12;
      } },
    { baris: 1160, jalan: function (m) {
        m.locate(22, 27); m.warna(14, 0);
        m.cetak('Strike Any Key To Continue'); m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 1170, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1170);
      } },

    /* --- 1180-1580: laporan laba-rugi ------------------------------------- */
    { baris: 1180, jalan: function (m) { m.warna(3, 0); m.cls(); } },
    { baris: 1190, jalan: function (m) {
        m.locate(1, 20); m.cetak(m.ulang(40, 177)); m.barisBaru();
      } },
    { baris: 1200, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 20); m.cetak(m.chr(177)); m.barisBaru();
          m.locate(m.v.A, 59); m.cetak(m.chr(177)); m.barisBaru();
        }
      } },
    { baris: 1210, jalan: function (m) {
        m.locate(23, 20); m.cetak(m.ulang(40, 177));
      } },
    { baris: 1220, jalan: function (m) {
        m.locate(2, 26); m.warna(3, 0);
        m.cetak('***** INCOME STATEMENT *****'); m.barisBaru();
      } },
    { baris: 1230, jalan: function (m) {
        m.locate(3, 21); m.cetak(m.ulang(38, 205)); m.barisBaru();
      } },
    { baris: 1240, jalan: function (m) {
        m.locate(4, 22); m.warna(15, 0);
        m.cetak('Well #' + angka(m.v.CHS)); m.barisBaru();
      } },
    label(1250, 5, 38, 1, 'Costs'),
    label(1260, 6, 25, 3, 'Drilling'),
    { baris: 1270, jalan: function (m) {
        m.locate(7, 25); m.cetak('Fracture'); m.barisBaru();
      } },
    label(1280, 8, 25, 1, '1 YR. OPER.             '),
    { baris: 1290, jalan: function (m) {
        m.v.TOTALCOST = m.v.OPN + m.v.FRC + m.v.CSF;
      } },
    uang(1300, 6, 40, 3, 'CSF'),
    uang(1310, 7, 40, null, 'FRC'),
    uang(1320, 8, 40, 1, 'OPN'),
    label(1330, 9, 25, 15, 'Total Cost'),
    uang(1340, 9, 40, 15, 'TOTALCOST'),
    label(1350, 11, 34, 1, 'Gross Income'),
    label(1360, 12, 25, 3, 'Oil'),
    label(1370, 13, 25, 1, 'Gas                  '),
    { baris: 1380, jalan: function (m) {
        m.v.ODS = m.v.OPD * 9000;
        m.v.GDS = m.v.GSP * 2.1;
      } },
    { baris: 1390, jalan: function (m) { m.v.GRDS = m.v.ODS + m.v.GDS; } },
    /* 1400 pendapatan seumur sumur ditaksir lima kali pendapatan tahun
       pertama. Satu angka, dan itulah seluruh model cadangannya. */
    { baris: 1400, jalan: function (m) {
        m.v.RVS = (m.v.ODS + m.v.GDS) * 5;
        m.v.WELL[m.v.CHS] = m.v.RVS;
      } },
    uang(1410, 13, 40, null, 'GDS'),
    uang(1420, 12, 40, 3, 'ODS'),
    label(1430, 14, 25, 15, 'Total Income'),
    uang(1440, 14, 40, null, 'GRDS'),
    label(1450, 15, 25, 1, 'Cost          -'),
    { baris: 1460, jalan: function (m) {
        m.v.NTP = m.v.GRDS - m.v.TOTALCOST;
      } },
    uang(1470, 15, 40, null, 'TOTALCOST'),
    label(1480, 16, 25, 15, 'Net Profit'),
    { baris: 1490, jalan: function (m) {
        m.locate(16, 40); m.cetakFormat(ZUM, m.v.NTP);
        m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 1500, jalan: function (m) {
        m.locate(18, 25); m.cetak('Estimated Reserves In Ground');
        m.barisBaru();
      } },
    { baris: 1510, jalan: function (m) { m.v.CSH = m.v.CSH + m.v.NTP; } },
    { baris: 1520, jalan: function (m) { m.v.YRN[m.v.CHS] = m.v.NTP; } },
    { baris: 1530, jalan: function (m) {
        m.warna(15, 0); m.locate(19, 40); m.cetakFormat(ZUM, m.v.RVS);
        m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 1540, jalan: function (m) {
        m.v.ADD = 0;
        for (m.v.A = 1; m.v.A <= m.v.CHS; m.v.A++) {
          m.v.ADD = m.v.ADD + m.v.WELL[m.v.A];
        }
      } },
    { baris: 1550, jalan: function (m) {
        m.locate(21, 25); m.cetak('Total Reserves So Far '); m.barisBaru();
      } },
    { baris: 1560, jalan: function (m) {
        m.warna(15, 0); m.locate(22, 40); m.cetakFormat(ZUM, m.v.ADD);
        m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 1570, jalan: function (m) {
        m.warna(14, 0); m.locate(24, 27);
        m.cetak('Strike Any Key To Continue');
      } },
    { baris: 1580, jalan: function (m) {
        m.warna(3, 0);
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1580); else m.kembali();
      } },

    /* --- 1590-1710: laporan geologi --------------------------------------- */
    { baris: 1590, jalan: function (m) {
        m.cls(); m.locate(1, 28); m.warna(13, 0);
      } },
    kotak(1600, null, 201, 205, 187, 23),
    { baris: 1610, jalan: function (m) {
        m.locate(2, 28);
        m.cetak(m.chr(186) + '    GEOLOGY REPORT     ' + m.chr(186));
        m.barisBaru();
      } },
    kotak(1620, 3, 200, 205, 188, 23),
    kotak(1630, 4, 201, 205, 187, 39),
    { baris: 1640, bagian: [
        function (m) { m.untuk('X', 5, 11, 1, 1660); },
        function (m) {
          m.locate(m.v.X, 20); m.cetak(m.chr(186)); m.barisBaru();
          m.locate(m.v.X, 60); m.cetak(m.chr(186)); m.barisBaru();
        }
      ] },
    { baris: 1650, jalan: function (m) { m.lanjutkan('X'); } },
    { baris: 1660, jalan: function (m) {
        m.locate(12, 20);
        m.cetak(m.chr(200) + m.ulang(39, 205) + m.chr(188)); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 1670, jalan: function (m) {
        m.v.SZN = m.v.MAP[m.v.C][1];
        m.v.EZN = m.v.MAP[m.v.C][2];
        m.v.TYPE = m.v.MAP[m.v.C][3];
      } },
    { baris: 1680, jalan: function (m) {
        m.locate(6, 30); m.cetak('Potential Pay Zone :'); m.barisBaru();
      } },
    { baris: 1690, jalan: function (m) {
        m.locate(7, 29); m.warna(15, 0);
        m.cetak(angka(m.v.SZN) + 'To' + angka(m.v.EZN) + 'Ft.');
        m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 1700, jalan: function (m) {
        m.locate(9, 26);
        m.cetak('Target Zone Starts At' + angka(m.v.SZN + 500) + 'Ft.');
        m.barisBaru();
      } },
    { baris: 1710, jalan: function (m) {
        m.locate(14, 27); m.warna(15, 0);
        m.cetak('Do You Wish To Drill? <Y/N>'); m.warna(3, 0);
      } },
    /* 1720-1750 satu subrutin ya/tidak yang dipakai lima tempat, dan ia
       mengisi DUA bendera: YES dan NO. Cukup satu — tapi dengan dua, tiap
       pemanggil bisa memilih yang paling enak dibaca di tempatnya. */
    { baris: 1720, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1720);
      } },
    { baris: 1730, jalan: function (m) {
        if (m.v.Z === 'Y' || m.v.Z === 'y') {
          m.v.YES = 1; m.v.NO = 0; m.kembali();
        }
      } },
    { baris: 1740, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') {
          m.v.NO = 1; m.v.YES = 0; m.kembali();
        }
      } },
    { baris: 1750, jalan: function (m) { m.lompat(1720); } },
    /* 1760 subrutin tunda yang tidak pernah dipanggil siapa pun. */
    { baris: 1760, jalan: function (m) {
        for (m.v.X = 1; m.v.X <= 2000; m.v.X++) { /* jeda */ }
        m.kembali();
      } },

    /* --- 1770-2010: peta Boom County -------------------------------------- */
    { baris: 1770, jalan: function (m) { m.warna(15, 0); m.cls(); } },
    { baris: 1780, jalan: function (m) {
        m.locate(1, 26); m.cetak('B O O M   C O U N T Y   U S A');
        m.barisBaru();
      } },
    /* 1790 sebelas potongan kisi diberi nama sekali di sini, lalu dipakai
       lewat namanya di baris 1830-1930. Membaca `POKE A,B8` memang tidak
       lebih jelas daripada `POKE A,218` — tapi mengganti bentuk kisinya
       cukup di satu baris. */
    { baris: 1790, jalan: function (m) {
        m.v.B1 = 179; m.v.B2 = 195; m.v.B3 = 197; m.v.B4 = 180; m.v.B5 = 192;
        m.v.B6 = 193; m.v.B7 = 217; m.v.B8 = 218; m.v.B9 = 194; m.v.B0 = 191;
      } },
    { baris: 1800, jalan: function () { } },
    /* 1810 45056 = &HB000 (kartu monokrom), 47104 = &HB800 (kartu warna).
       Penelusur selalu kartu warna, dan alamat pokenya dihitung relatif
       terhadap awal RAM layar. */
    { baris: 1810, jalan: function () { } },
    { baris: 1820, jalan: function (m) {
        m.v.A = 178;
        m.locate(Math.floor(m.v.A / 160) + 1, 10);
        m.cetak(m.ulang(60, 196)); m.barisBaru();
      } },
    kisi(1830, 'B8', 'B9', 'B0'),
    { baris: 1840, jalan: function (m) { m.untuk('A', 338, 3058, 160, 1900); } },
    kisi(1850, 'B1', 'B1', 'B1'),
    { baris: 1860, jalan: function (m) { m.v.A = m.v.A + 160; } },
    { baris: 1870, jalan: function (m) {
        m.locate(Math.floor(m.v.A / 160) + 1, 10);
        m.cetak(m.ulang(60, 196)); m.barisBaru();
      } },
    kisi(1880, 'B2', 'B3', 'B4'),
    { baris: 1890, jalan: function (m) { m.lanjutkan('A'); } },
    kisi(1900, 'B1', 'B1', 'B1'),
    { baris: 1910, jalan: function (m) { m.v.A = m.v.A + 160; } },
    { baris: 1920, jalan: function (m) {
        m.locate(Math.floor(m.v.A / 160) + 1, 10);
        m.cetak(m.ulang(60, 196)); m.barisBaru();
      } },
    kisi(1930, 'B5', 'B6', 'B7'),
    { baris: 1940, jalan: function (m) { m.warna(3, 0); m.v.D = 0; } },
    { baris: 1950, jalan: function (m) { m.untuk('A', 3, 21, 2, 1990); } },
    { baris: 1960, jalan: function (m) {
        m.v.C = 0; m.untuk('B', 13, 67, 6, 1980);
      } },
    /* 1970 `Z(A/2-1)` — indeks larik yang PECAHAN. A ganjil, jadi A/2-1
       selalu berujung 0,5; BASIC membulatkannya ke atas, sehingga baris 3
       jadi Z(1)="A" dan baris 21 jadi Z(10)="J". Bekerja, tapi hanya karena
       pembulatannya kebetulan searah. */
    { baris: 1970, jalan: function (m) {
        if (m.v.MAP[m.v.D][0] === 0) {
          m.locate(m.v.A, m.v.B);
          /* `PRINT Z(...) RIGHT$(STR$(C),1)` — dua ungkapan bersebelahan,
             jadi tercetak berdempet: "A3". Spasi di sumbernya cuma perataan. */
          m.cetak(m.v.Z_[Math.round(m.v.A / 2 - 1)] + String(m.v.C).slice(-1));
        }
      } },
    { baris: 1980, bagian: [
        function (m) { m.v.D = m.v.D + 1; m.v.C = m.v.C + 1; },
        function (m) { m.lanjutkan('B'); }
      ] },
    { baris: 1990, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2000, jalan: function (m) {
        m.locate(23, 28); m.cetak('Cash Assets');
        m.cetakFormat(ZUM, m.v.CSH);
      } },
    { baris: 2010, jalan: function (m) { m.kembali(); } },

    /* --- 2020-2340: bangkitkan peta, lalu baca tiga tabel besar ------------ */
    { baris: 2020, jalan: function (m) {
        m.locate(12, 30); m.cetak('ONE MOMENT PLEASE');
      } },
    /* 2030-2060 enam puluh persen petak langsung dibuang (nilai 2). Sisanya
       dibagi jadi tiga jenis lapisan: dangkal, sedang, dalam. Perhatikan
       ketiga `RND` yang dipanggil BERURUTAN di satu petak — peluang
       gabungannya bukan 40%/60% seperti terbacanya sekilas. */
    { baris: 2030, bagian: [
        function (m) { m.untuk('C', 0, 100, 1, 2080); },
        function (m) {
          if (m.acak() < 0.6) { m.v.MAP[m.v.C][0] = 2; m.lompat(2070); }
        }
      ] },
    lapisan(2040, 0.4, 4000, 7000, 1),
    lapisan(2050, 0.6, 7500, 10000, 2),
    { baris: 2060, jalan: function (m) {
        m.v.MAP[m.v.C][1] = 10500; m.v.MAP[m.v.C][2] = 15000;
        m.v.MAP[m.v.C][3] = 3;
        m.lompat(2070);
      } },
    { baris: 2070, jalan: function (m) { m.lanjutkan('C'); } },
    { baris: 2080, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10; m.v.A++) m.v.Z_[m.v.A] = m.baca();
      } },
    { baris: 2090, jalan: function (m) {
        for (m.v.B = 1; m.v.B <= 3; m.v.B++) {
          for (m.v.A = 1; m.v.A <= 40; m.v.A++) {
            m.v.HIT_[m.v.B][m.v.A] = m.baca();
          }
        }
      } },
    { baris: 2100, jalan: function (m) { m.untuk('C', 1, 3, 1, 2150); } },
    { baris: 2110, jalan: function (m) { m.untuk('B', 1, 5, 1, 2140); } },
    { baris: 2120, jalan: function (m) { m.untuk('A', 1, 20, 1, 2140); } },
    { baris: 2130, jalan: function (m) {
        m.v.PAY[m.v.A][m.v.B][m.v.C] = m.baca();
      } },
    /* 2140 `NEXT A,B,C` — tiga NEXT dalam satu pernyataan, menutup ketiga
       gelung dari yang paling dalam ke yang paling luar. */
    { baris: 2140, bagian: [
        function (m) { m.lanjutkan('A'); },
        function (m) { m.lanjutkan('B'); },
        function (m) { m.lanjutkan('C'); }
      ] },
    data(2150), data(2160), data(2170), data(2180), data(2190),
    data(2200), data(2210), data(2220), data(2230), data(2240),
    data(2250), data(2260), data(2270), data(2280), data(2290),
    data(2300), data(2310), data(2320), data(2330),
    /* 2340 badan jebakan F1-F9: langsung pulang. Sembilan tombol yang
       sengaja dibuat tidak berbuat apa-apa. */
    { baris: 2340, jalan: function (m) { m.kembali(); } },

    /* --- 2350-2660: judul dan petunjuk ------------------------------------ */
    { baris: 2350, jalan: function (m) { m.cls(); } },
    { baris: 2360, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 2370, jalan: function (m) { m.untuk('A', 2, 22, 1, 2400); } },
    { baris: 2380, jalan: function (m) {
        m.locate(m.v.A, 1); m.cetak(m.chr(219)); m.barisBaru();
        m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
      } },
    { baris: 2390, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2400, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 2410, jalan: function (m) {
        m.locate(3, 24); m.warna(15, 0);
        m.cetak('* * * W I L D C A T T E R * * *'); m.barisBaru();
      } },
    { baris: 2420, jalan: function (m) {
        m.locate(12, 23);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 2430, bagian: [
        function (m) { m.gosub(1720); },
        function (m) { if (m.v.NO) { m.cls(); m.kembali(); } }
      ] },
    ajar(2440,  4, 10, ''),
    ajar(2450,  5, 15, 'In this game,  you own an  independent  oil and gas'),
    ajar(2460,  6, 15, 'drilling company.  First you must select a drilling'),
    ajar(2470,  7, 15, 'sight from the map of Boom County.  After you enter'),
    ajar(2480,  8, 15, 'your sight,  you  will  be  shown a  geology report'),
    ajar(2490,  9, 15, 'indicating the  potential pay zone.  The deeper you'),
    ajar(2500, 10, 15, 'drill a well,  the less  chance you have of finding'),
    ajar(2510, 11, 15, 'oil or gas,  but the chance of finding huge strikes'),
    ajar(2520, 12, 15, 'increases. Shallow wells are more likely to produce.'),
    ajar(2530, 13, 10, ''),
    ajar(2540, 14, 15, 'If after drilling to the  potential pay zone and no'),
    ajar(2550, 15, 15, 'oil or gas is indicated, you may choose to drill to'),
    ajar(2560, 16, 15, 'ONE  other depth at that sight.  If you do show oil'),
    ajar(2570, 17, 15, 'or gas, you must  FRACTURE a well before production.'),
    ajar(2580, 18, 10, ''),
    ajar(2590, 18, 15, 'We have loaned you  $1,000,000 to begin exploration.'),
    ajar(2600, 19, 15, 'That is your credit limit.  When you have completed'),
    ajar(2610, 20, 15, 'ten wells or run out of operating capital, you will'),
    ajar(2620, 21, 15, 'be given a final statement of operations. GOOD LUCK'),
    { baris: 2630, jalan: function (m) { m.warna(15, 0); } },
    { baris: 2640, jalan: function (m) {
        m.locate(25, 28); m.cetak('Strike Any Key To Continue');
      } },
    { baris: 2650, jalan: function (m) { m.warna(3, 0); } },
    { baris: 2660, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(2660); else { m.cls(); m.kembali(); }
      } },

    /* --- 2670-2740: F10, keluar ------------------------------------------- */
    { baris: 2670, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XX = m.barisKursor(); m.v.YY = m.pos();
      } },
    { baris: 2680, jalan: function (m) {
        m.locate(25, 1); m.spc(79); m.warna(15, 0);
      } },
    { baris: 2690, jalan: function (m) {
        m.locate(25, 22);
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
      } },
    { baris: 2700, bagian: [
        function (m) { m.gosub(1720); },
        function (m) { if (m.v.YES) m.lompat(2740); }
      ] },
    { baris: 2710, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.warna(0, 7); m.locate(25, 24);
      } },
    { baris: 2720, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Game '); m.warna(3, 0);
      } },
    { baris: 2730, jalan: function (m) {
        m.locate(m.v.XX, m.v.YY); m.jebakan(10, true); m.kembali();
      } },
    { baris: 2740, jalan: function (m) { m.jalankan('MENU'); } },

    /* --- 2750-2960: laporan akhir ----------------------------------------- */
    { baris: 2750, jalan: function (m) { m.cls(); } },
    { baris: 2760, jalan: function (m) {
        m.locate(1, 15); m.cetak(m.ulang(50, 177)); m.barisBaru();
      } },
    { baris: 2770, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 15); m.cetak(m.chr(177)); m.barisBaru();
          m.locate(m.v.A, 64); m.cetak(m.chr(177)); m.barisBaru();
        }
      } },
    { baris: 2780, jalan: function (m) {
        m.locate(23, 15); m.cetak(m.ulang(50, 177));
      } },
    { baris: 2790, jalan: function (m) {
        m.locate(2, 26); m.warna(3, 0);
        m.cetak('***** FINAL  STATEMENT *****'); m.barisBaru();
      } },
    { baris: 2800, jalan: function (m) {
        m.locate(3, 16); m.cetak(m.ulang(48, 205)); m.barisBaru();
      } },
    { baris: 2810, jalan: function (m) {
        m.locate(4, 17);
        m.cetak('Well #     1st Year  Earnings         Reserves');
        m.barisBaru();
      } },
    { baris: 2820, bagian: [
        function (m) { m.untuk('A', 1, 10, 1, 2870); },
        function (m) {
          m.locate(null, 19); m.cetakFormat('##', m.v.A); m.spc(10);
        }
      ] },
    { baris: 2830, jalan: function (m) {
        m.v.TOTALRVS = (m.v.TOTALRVS || 0) + m.v.WELL[m.v.A];
      } },
    { baris: 2840, jalan: function (m) { m.cetakFormat(ZUM, m.v.YRN[m.v.A]); } },
    { baris: 2850, jalan: function (m) {
        m.cetakFormat('    ' + ZUM, m.v.WELL[m.v.A]); m.barisBaru();
      } },
    { baris: 2860, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 2870, jalan: function (m) { m.warna(15, 0); } },
    /* 2880 kalau modalnya habis, yang dicetak BUKAN kerugian sebenarnya
       melainkan angka mati -1000000. Sederhana, dan sedikit tidak jujur. */
    { baris: 2880, jalan: function (m) {
        if (m.v.OOM) {
          m.locate(null, 31);
          m.cetakFormat('$$#,###,###.##', -1000000);
          m.lompat(2900);
        }
      } },
    { baris: 2890, jalan: function (m) {
        m.locate(null, 31);
        m.cetakFormat('$$#,###,###.##', m.v.CSH - 1000000);
      } },
    { baris: 2900, jalan: function (m) {
        m.locate(null, m.pos() + 1);
        m.cetakFormat('$$,###,###,###.##', m.v.TOTALRVS || 0);
        m.barisBaru();
      } },
    { baris: 2910, jalan: function (m) { m.lompat(m.v.OOM ? 2920 : 2950); } },
    { baris: 2920, jalan: function (m) {
        m.locate(18, 23);
        m.cetak('You Ran Out Of Money At' +
                angka(Math.trunc(m.v.CSH / 30)) + 'Feet.');
        m.barisBaru();
      } },
    ajar(2930, 19, 23, 'You Have 30 Days To Repay Your Loan'),
    ajar(2940, 20, 23, 'Personal Checks Are Not Accepted !!'),
    { baris: 2950, jalan: function (m) {
        m.locate(22, 23); m.warna(15, 0);
        m.cetak('Would You Like To Play Again? <Y/N>');
      } },
    { baris: 2960, bagian: [
        function (m) { m.warna(3, 0); m.gosub(1720); },
        function (m) { if (m.v.NO) m.lompat(2740); else m.jalankan(); }
      ] }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }
  function data(nomor) { return { baris: nomor, jalan: function () { } }; }

  /* Angka BASIC dicetak dengan spasi di depan (tempat tanda minus) dan satu
     spasi di belakang. */
  function angka(n) {
    var b = Math.round(n * 100) / 100;
    return (b < 0 ? '' : ' ') + String(b) + ' ';
  }

  /* `PRINT SPC(79);` — titik koma di ujungnya penting: tanpa penutup baris.
     Kalau penutupnya ikut dicetak sementara kursornya di baris 25, layarnya
     tergulung satu baris dan seluruh gambar di atasnya bergeser. */
  function hapus(nomor, b) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, 1); m.spc(79);
    } };
  }

  function ajar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  function label(nomor, b, k, warna, isi) {
    return { baris: nomor, jalan: function (m) {
      if (warna !== null) m.warna(warna, warna === 1 ? null : 0);
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  function uang(nomor, b, k, warna, nama) {
    return { baris: nomor, jalan: function (m) {
      if (warna !== null) m.warna(warna, warna === 1 ? null : 0);
      m.locate(b, k); m.cetakFormat(ZUM, m.v[nama]); m.barisBaru();
    } };
  }

  function kotak(nomor, b, kiri, isi, kanan, lebar) {
    return { baris: nomor, jalan: function (m) {
      if (b !== null) m.locate(b, 28);
      m.cetak(m.chr(kiri) + m.ulang(lebar, isi) + m.chr(kanan));
      m.barisBaru();
    } };
  }

  function derek(nomor, b, k, pola) {
    return { baris: nomor, jalan: function (m) {
      var s = '', i;
      for (i = 0; i < pola.length; i++) s += m.chr(SANDI[pola.charAt(i)]);
      m.locate(b, k); m.cetak(s); m.barisBaru();
    } };
  }

  /* Sebelas POKE dalam satu baris: satu simpangan tiap enam kolom. Alamatnya
     bita, jadi enam kolom = dua belas bita. */
  function kisi(nomor, kiri, tengah, kanan) {
    return { baris: nomor, jalan: function (m) {
      var i;
      m.pokeLayar(m.v.A, m.v[kiri]);
      for (i = 1; i <= 9; i++) m.pokeLayar(m.v.A + i * 12, m.v[tengah]);
      m.pokeLayar(m.v.A + 120, m.v[kanan]);
    } };
  }

  function lapisan(nomor, peluang, awal, akhir, jenis) {
    return { baris: nomor, jalan: function (m) {
      if (m.acak() < peluang) {
        m.v.MAP[m.v.C][1] = awal;
        m.v.MAP[m.v.C][2] = akhir;
        m.v.MAP[m.v.C][3] = jenis;
        m.lompat(2070);
      }
    } };
  }

  /* `RIGHT$(TIME$,2)` — jam yang penelusur tidak punya. Sama seperti
     CRAPS.BAS: dibuat MAJU supaya penelusurannya tetap bisa diulang tanpa
     membekukan hasilnya. Di sini hanya dibaca sekali, di baris 70. */
  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 60;
    return m.v.JAM;
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['WILDCAT'] = {
    nama: 'WILDCAT',
    judul: 'Wildcatter',
    sumber: 'WILDCAT',
    berkas: 'run/WILDCAT.BAS',
    tabel: tabel,
    data: [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      /* HIT(1,*) lapisan dangkal — angka besar sering muncul */
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5,
      /* HIT(2,*) lapisan sedang */
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5,
      /* HIT(3,*) lapisan dalam — tiga puluh dari empat puluh isinya 1 */
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 5, 5,
      /* PAY(*,*,1) */
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      54, 0, 13, 240, 0, 370, 112, 0, 41, 600, 0, 514, 70, 112, 95, 0, 0, 301, 62, 98,
      37, 0, 12, 128, 0, 131, 19, 50, 0, 167, 6, 114, 42, 0, 36, 20, 0, 185, 39, 11,
      0, 75, 15, 32, 21, 0, 7, 39, 0, 78, 3, 67, 17, 0, 0, 59, 0, 133, 22, 11,
      0, 22, 8, 11, 2, 0, 6, 13, 0, 61, 3, 36, 8, 2, 0, 60, 4, 0, 0, 24,
      /* PAY(*,*,2) */
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 461, 123, 0, 78, 502, 124, 120, 270, 0, 0, 960, 41, 581, 108, 333, 0, 1333, 121, 380,
      0, 197, 51, 0, 22, 142, 37, 65, 51, 0, 17, 131, 0, 233, 41, 69, 19, 158, 65, 0,
      0, 141, 13, 88, 30, 0, 6, 106, 15, 53, 28, 0, 21, 50, 0, 137, 25, 83, 49, 0,
      7, 0, 4, 34, 0, 47, 9, 25, 17, 0, 11, 30, 2, 6, 11, 0, 3, 0, 4, 13,
      /* PAY(*,*,3) — sumur dalam: dua baris nol, lalu satu baris raksasa */
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      276, 620, 29, 1500, 282, 0, 0, 4400, 241, 1200, 35, 1400, 860, 0, 80, 997, 240, 0, 105, 2200,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 200, 40, 0, 23, 90, 41, 33, 0, 187, 32, 104, 0, 202, 43, 0, 0, 281, 27, 104
    ],

    arsitektur: {
      judul: 'Alur WILDCAT.BAS',
      simpul: [
        { id: 'siap', baris: '20-110', jenis: 'mulai',
          teks: ['Judul, petunjuk,', 'bangkitkan peta 10x10'] },
        { id: 'peta', baris: '1770-2010',
          teks: ['Gambar kisi peta:', 'PRINT + POKE ke RAM layar'] },
        { id: 'pilih', baris: '150-230', jenis: 'putusan',
          teks: ['Pemain memilih petak,', 'huruf lalu angka'] },
        { id: 'geologi', baris: '1590-1710', jenis: 'subrutin',
          teks: ['Laporan geologi:', 'zona bayar dan jenis lapisan'] },
        { id: 'bor', baris: '280-580',
          teks: ['Menara bor, biaya per kaki,', 'lalu satu lemparan tabel HIT'] },
        { id: 'kosong', baris: '600-690', jenis: 'galat',
          teks: ['Tidak ada tanda:', 'lebih dalam, atau menyerah'] },
        { id: 'dalam', baris: '700-920',
          teks: ['Kedalaman baru;', 'lewat zona bayar = ditolak'] },
        { id: 'temu', baris: '930-1170',
          teks: ['Ada minyak: bayar rekah,', 'lalu baca tabel PAY'] },
        { id: 'laba', baris: '1180-1580', jenis: 'subrutin',
          teks: ['Laporan laba-rugi,', 'taksiran cadangan'] },
        { id: 'akhir', baris: '2750-2960', jenis: 'keluar',
          teks: ['Sepuluh sumur atau modal habis:', 'laporan akhir'] }
      ],
      panah: [
        { dari: 'siap', ke: 'peta' },
        { dari: 'peta', ke: 'pilih' },
        { dari: 'pilih', ke: 'pilih', label: 'petak terpakai', jenis: 'galat' },
        { dari: 'pilih', ke: 'geologi' },
        { dari: 'geologi', ke: 'pilih', label: 'jawab N' },
        { dari: 'geologi', ke: 'bor', label: 'jawab Y' },
        { dari: 'bor', ke: 'temu', label: 'PAYOFF > 1' },
        { dari: 'bor', ke: 'kosong', label: 'PAYOFF = 1', jenis: 'galat' },
        { dari: 'kosong', ke: 'dalam', label: 'coba lebih dalam' },
        { dari: 'dalam', ke: 'bor', label: 'bor lagi' },
        { dari: 'kosong', ke: 'laba', label: 'menyerah', jenis: 'galat' },
        { dari: 'temu', ke: 'laba' },
        { dari: 'laba', ke: 'peta', label: 'sumur berikutnya' },
        { dari: 'laba', ke: 'akhir', label: 'sumur ke-10' },
        { dari: 'bor', ke: 'akhir', label: 'modal habis', jenis: 'galat' }
      ]
    },

    pseudokode: [
      { baris: 2030, tingkat: 0, teks: 'bangkitkan peta 10&times;10: <b>60% petaknya langsung kosong</b>' },
      { baris: 2040, tingkat: 1, teks: 'sisanya dibagi tiga jenis lapisan: dangkal, sedang, dalam' },
      { baris: 2090, tingkat: 0, teks: 'baca tabel <code>HIT</code> (3&times;40) dan <code>PAY</code> (20&times;5&times;3) dari DATA' },
      { baris: 1770, tingkat: 0, teks: 'gambar kisi peta &mdash; garisnya di-<code>PRINT</code>, <b>simpangannya di-<code>POKE</code></b>' },
      { baris: 130, tingkat: 0, teks: '<b>ULANG sampai sepuluh sumur atau modal habis:</b>' },
      { baris: 160, tingkat: 1, teks: 'pemain mengetik huruf lalu angka; <code>C = huruf&times;10 + angka</code>' },
      { baris: 1670, tingkat: 1, teks: 'laporan geologi: zona bayar dan jenis lapisan petak itu' },
      { baris: 480, tingkat: 1, teks: 'biaya bor = kedalaman &times; $30/kaki' },
      { baris: 570, tingkat: 1, teks: '<b>satu lemparan dadu 40 sisi</b> ke tabel <code>HIT</code> jenis lapisan itu' },
      { baris: 590, tingkat: 2, teks: 'hasil 1 &rarr; tidak ada tanda; boleh coba <b>satu</b> kedalaman lain' },
      { baris: 1010, tingkat: 2, teks: 'hasil &gt; 1 &rarr; bayar rekah, lalu baca dua angka bersebelahan dari <code>PAY</code>' },
      { baris: 1380, tingkat: 1, teks: 'minyak &times; $9.000, gas &times; 2,1; cadangan = 5&times; pendapatan tahun pertama' },
      { baris: 2750, tingkat: 0, teks: 'laporan akhir: sepuluh sumur, laba tahun pertama, dan cadangannya' }
    ],

    perintahAsli: 'run\\WILDCAT.bat',
    catatanAsli: 'Di DOSBox-X kisi petanya tergambar seketika karena POKE ' +
      'langsung ke RAM layar; di penelusur tiap POKE bisa dilihat satu per satu.',

    penyimpangan: [
      '<b>Larik dan skalar bernama sama dipisahkan.</b> <code>HIT(3,40)</code> ' +
      'jadi <code>HIT_</code> dan <code>Z(10)</code> jadi <code>Z_</code>, ' +
      'karena baris 1010 memakai <code>HIT</code> sebagai skalar dan baris 160 ' +
      'memakai <code>Z</code> sebagai teks. BASIC membedakan keduanya; ' +
      'JavaScript tidak.',

      '<b><code>PEEK</code> dan <code>DEF SEG</code> tidak berarti apa-apa.</b> ' +
      'Uji kartu monokrom di baris 1810 selalu menjawab kartu warna, jadi ' +
      'alamat <code>POKE</code>-nya selalu dihitung relatif terhadap awal RAM ' +
      'layar penelusur.',

      '<b><code>PRINT USING</code> yang ditiru hanya bentuk <code>$$</code>, ' +
      '<code>#</code>, <code>,</code>, <code>.##</code></b> beserta spasi ' +
      'harfiah di ujung formatnya.',

      '<b>Pengacaknya berbenih tetap</b>, jadi peta dan hasil pengeborannya ' +
      'selalu sama. <code>RIGHT$(TIME$,2)</code> di baris 70 memakai jam ' +
      'penelusur yang maju tetap, seperti CRAPS.BAS.',

      '<b>Kelima gelung tunda habis seketika</b>, jadi pesan "You Must Go ' +
      'Deeper" dan "You Are Past The Pay Zone" terhapus sebelum sempat ' +
      'terbaca. Pasang titik henti di baris 860 atau 900.'
    ],

    pelajaran: {
      ringkas: 'Permainan pengeboran minyak. Yang layak dipelajari: kisi peta ' +
        'yang digambar separuh dengan PRINT dan separuh dengan POKE, dan ' +
        '"geologi" yang seluruhnya cuma tiga tabel DATA.',
      pelajari: [
        ['Menggambar kisi dengan POKE',
         'Garis mendatarnya dicetak biasa &mdash; <code>PRINT ' +
         'STRING$(60,196)</code>. Tapi tiap <b>simpangan</b> (&#9484; &#9516; ' +
         '&#9488; &#9500; &#9532; &#9508;) dipoke satu per satu langsung ke ' +
         'RAM layar. Alasannya kecepatan: mengganti satu aksara di tengah ' +
         'baris tanpa mencetak ulang seluruh barisnya. Alamatnya dihitung ' +
         'sendiri &mdash; dua bita per sel, 160 bita per baris.'],
        ['Seluruh permainan ada di tiga tabel',
         'Tidak ada rumus peluang di mana pun. <code>HIT(3,40)</code> ' +
         'menentukan apakah ada minyak: tabel lapisan dangkal penuh angka ' +
         'besar, tabel lapisan dalam <b>tiga puluh dari empat puluhnya berisi ' +
         '1</b> (= gagal). <code>PAY(20,5,3)</code> menentukan berapa ' +
         'banyaknya. Mengubah keseimbangan permainan berarti mengubah angka, ' +
         'bukan kode.'],
        ['Dua angka bersebelahan sebagai satu pasangan',
         'Baris 1020-1030 membaca <code>PAY(HIT,...)</code> dan ' +
         '<code>PAY(HIT+1,...)</code> &mdash; minyak dan gas. Dan baris 1010 ' +
         'sengaja hanya menghasilkan angka <b>ganjil</b>, supaya pasangannya ' +
         'tidak pernah tumpang tindih. Larik satu dimensi yang dipakai sebagai ' +
         'larik pasangan.'],
        ['Satu subrutin ya/tidak untuk lima pertanyaan',
         'Baris 1720-1750 dipanggil dari lima tempat berbeda, dan mengisi ' +
         '<b>dua</b> bendera: <code>YES</code> dan <code>NO</code>. Satu saja ' +
         'sebenarnya cukup &mdash; tapi dengan dua, tiap pemanggil bisa ' +
         'menulis syaratnya dalam bentuk yang paling enak dibaca di tempatnya.']
      ],
      hindari: [
        ['Dua nama yang cuma beda urutan huruf',
         '<code>CSH</code> adalah <b>uang tunai</b>. <code>CHS</code> adalah ' +
         '<b>nomor sumur</b>. Keduanya dipakai di baris yang sama lebih dari ' +
         'sekali (lihat 490 dan 510), dan tertukar sekali saja sudah cukup ' +
         'untuk merusak seluruh pembukuan tanpa satu pun pesan galat.'],
        ['Uji yang sama ditulis dua kali',
         'Baris 490 dan 510 memeriksa hal yang persis sama. Bedanya cuma ' +
         'indeks larik: <code>YRN(CHS+1)</code> versus <code>YRN(CHS)</code>, ' +
         'karena baris 500 menaikkan <code>CHS</code> di antaranya. Sekarang ' +
         'ada dua tempat yang harus ikut berubah kalau aturannya berubah.'],
        ['Indeks larik yang pecahan',
         'Baris 1970: <code>Z(A/2-1)</code> dengan <code>A</code> selalu ' +
         'ganjil &mdash; jadi indeksnya selalu berujung 0,5. Bekerja hanya ' +
         'karena pembulatan BASIC kebetulan searah dengan yang dimaui.'],
        ['Larik yang tidak pernah di-DIM',
         '<code>YRN()</code> tidak muncul di baris 60. BASIC membuatnya ' +
         'sendiri dengan batas 10 &mdash; dan kebetulan itu pas, karena ' +
         'sumurnya memang sepuluh. Kebetulan yang menyelamatkan, bukan ' +
         'rancangan.'],
        ['Sisa suntingan yang ikut terkirim',
         'Baris 1080 <code>GOTO 1090</code> &mdash; melompat ke baris tepat di ' +
         'bawahnya. Dan baris 1760 adalah subrutin tunda yang tidak pernah ' +
         'dipanggil siapa pun.']
      ]
    },

    penjelasan: [
      { judul: 'Setengah dicetak, setengah dipoke',
        isi: [
          'Kisi peta 10&times;10 di layar itu digambar dengan dua cara ' +
          'sekaligus, dan alasannya kecepatan.',
          'Garis mendatarnya gampang: <code>PRINT STRING$(60,196)</code> ' +
          '&mdash; enam puluh potongan garis sekali cetak.',
          'Masalahnya <b>simpangan</b>. Di kolom 10, 16, 22, dan seterusnya, ' +
          'garis mendatar itu harus berubah jadi &#9516;, &#9532;, atau ' +
          '&#9508;. Mencetak ulang seluruh barisnya potongan demi potongan ' +
          'jauh lebih lambat.',
          'Maka program ini <b>menulis langsung ke RAM layar</b>:',
          '<code>1830 POKE A,B8:POKE A+12,B9:POKE A+24,B9: ... :POKE A+120,B0</code>',
          'Aritmetikanya perlu diketahui untuk membacanya: satu sel teks ' +
          'memakan <b>dua</b> bita (aksara + warna), jadi satu baris 80 kolom ' +
          '= 160 bita, dan enam kolom = <b>dua belas</b> bita. Itulah kenapa ' +
          'jaraknya 12.',
          'Dan itu juga sebabnya baris 1820 menulis <code>LOCATE A\\160+1,10</code> ' +
          '&mdash; membagi alamat bita dengan 160 untuk mendapatkan nomor ' +
          'barisnya kembali. Satu variabel, <code>A</code>, dipakai sebagai ' +
          'alamat <b>dan</b> sebagai nomor baris.',
          'Penelusur meniru ini apa adanya: <code>m.pokeLayar</code> menulis ' +
          'bita aksaranya saja dan tidak menyentuh bita warnanya &mdash; persis ' +
          'seperti <code>POKE</code> ke alamat genap.'
        ] },
      { judul: 'Geologi yang seluruhnya tabel',
        isi: [
          'Pertanyaan intinya: seberapa besar peluang menemukan minyak di ' +
          'kedalaman tertentu? Program ini tidak menjawabnya dengan rumus. Ia ' +
          'menjawabnya dengan <b>tabel</b>.',
          '<code>HIT(3,40)</code> punya tiga baris, satu untuk tiap jenis ' +
          'lapisan, masing-masing berisi empat puluh angka. Baris 570-580 ' +
          'melempar dadu empat puluh sisi dan membaca hasilnya:',
          '<code>570 TRY=FIX(RND*40)+1</code><br>' +
          '<code>580 PAYOFF=HIT(TYPE,TRY)</code>',
          'Nilai 1 berarti gagal. Sekarang lihat isi ketiga tabelnya:',
          '<b>Lapisan dangkal</b> (4.000&ndash;7.000 kaki): sepuluh angka 1, ' +
          'sisanya 2 sampai 5. Sepuluh dari empat puluh gagal.',
          '<b>Lapisan sedang</b> (7.500&ndash;10.000): dua puluh angka 1.',
          '<b>Lapisan dalam</b> (10.500&ndash;15.000): <b>tiga puluh</b> angka ' +
          '1 &mdash; tapi dua di antara sepuluh sisanya bernilai 5, dan tabel ' +
          '<code>PAY</code> untuk nilai 5 di lapisan dalam memuat angka ' +
          'seperti 4.400 dan 2.200 barel per hari.',
          'Itulah kalimat di layar petunjuk &mdash; "makin dalam, makin kecil ' +
          'peluangnya, tapi makin besar temuannya" &mdash; ditulis bukan ' +
          'sebagai aturan melainkan sebagai <b>seratus enam puluh angka</b>.',
          'Keuntungannya nyata: menyetel keseimbangan permainan cukup dengan ' +
          'mengetik ulang satu baris <code>DATA</code>, tanpa menyentuh satu ' +
          'pun baris kode.'
        ] },
      { judul: 'CSH dan CHS',
        isi: [
          'Program ini punya dua variabel penting yang namanya cuma beda ' +
          'urutan dua huruf:',
          '<code>CSH</code> = uang tunai. <code>CHS</code> = nomor sumur ' +
          'yang sedang dikerjakan.',
          'Keduanya muncul berdekatan berkali-kali:',
          '<code>490 IF CSH-CSF&lt;0 THEN OOM=1:YRN(CHS+1)=-(CSH):GOTO 2750</code>',
          'Di satu baris itu ada <code>CSH</code>, <code>CSF</code> (biaya ' +
          'sejauh ini), dan <code>CHS</code>. Tiga nama tiga huruf yang ' +
          'ketiganya dimulai dengan C.',
          'Tertukar sekali saja &mdash; <code>YRN(CSH)</code> alih-alih ' +
          '<code>YRN(CHS)</code> &mdash; dan yang terjadi bukan pesan galat, ' +
          'melainkan larik yang ditulis di indeks satu juta. BASIC akan ' +
          'mengeluh "Subscript out of range"; kalau angkanya kebetulan kecil, ' +
          'ia tidak akan mengeluh sama sekali.',
          'Nama pendek dulu punya alasan: penafsir BASIC lama hanya ' +
          'membedakan <b>dua huruf pertama</b>, dan tiap huruf tambahan ' +
          'memakan memori. Alasannya sudah lama hilang; kebiasaannya belum.'
        ] }
    ]
  };
})(window);
