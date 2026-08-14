/* ===========================================================================
   HISTORY.js — porting minimalis HISTORY.BAS sebagai tabel baris.

   Enam belas halaman pelajaran tentang komputer, untuk orang yang baru saja
   membeli IBM PC. ENIAC, CPU, memori, DOS, bahasa pemrograman, dan lima belas
   perintah merawat disket.

   Susunannya sederhana dan sama di tiap halaman:

       <gambar dan teks halaman>
       GOSUB 3380          ' tunggu tombol
       IF BACKFLAG THEN <halaman sebelumnya>

   `BACKFLAG` disetel oleh jebakan F1 di baris 3490, yang memakai
   `RETURN 3500` — membuang alamat pulang dan memaksa GOSUB 3380 kembali
   dengan bendera menyala. Pola yang sama dengan HINTS.BAS dan ANATOMY.BAS.

   DAN DI SITULAH CACATNYA.

   Enam belas halaman, enam belas nomor "halaman sebelumnya", dan LIMA di
   antaranya salah sasaran:

       baris  halaman   menuju   seharusnya
       -----  --------  -------  ----------
        830   ke-4      40  (1)   470  (3)
       1330   ke-6      580 (4)   840  (5)
       1550   ke-7      580 (4)   1020 (6)
       1810   ke-8      840 (5)   1340 (7)
       2450   ke-11     1820 (9)  2050 (10)

   Perhatikan polanya: SEMUANYA melompat terlalu jauh ke belakang, tidak ada
   satu pun yang melompat ke depan. Baris 1010 menulis `THEN 580` dan itu
   BENAR untuk halaman kelima. Baris 1330 dan 1550 adalah salinannya yang
   tidak diperbarui. Baris 1810 menulis `THEN 840` — yang justru nilai yang
   seharusnya dipakai baris 1330. Nomornya bergeser satu halaman, dan
   bergesernya ikut tersalin.

   Yang membuatnya bertahan: menekan F1 tidak pernah menghasilkan galat. Ia
   selalu menampilkan halaman yang sah — cuma bukan yang barusan dilihat.

   TIGA HAL LAIN YANG LAYAK DILIHAT:

   - `DEFSTR Z` di baris 10 membuat variabel Z bertipe string tanpa tanda
     dolar. Satu-satunya DEFSTR di seluruh koleksi ini.
   - Baris 3390 memakai `POKE 106,0` di dalam gelung sampai INKEY$ kosong —
     persis perbaikan yang HILANG dari MUSIC.BAS dan baru ada di MUSIC1.BAS.
   - Halaman kesepuluh (baris 2050) TIDAK memanggil CLS. Ia menimpa bingkai
     halaman kesembilan, dan itu disengaja: bingkainya sama persis.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `RUN "intro"` dan `RUN "menu"` tidak bisa dijalankan — INTRO.BAS dan
     MENU.BAS tidak ada di koleksi ini.
   - `ON ERROR GOTO 3510` dipasang, tapi tidak ada galat yang dibangkitkan
     di jalur mana pun.
   - `DEF SEG:POKE 106,0` ditiru sebagai pengosongan penyangga tombol.
   =========================================================================== */

(function (global) {
  'use strict';

  function KOTAK(kode) { return String.fromCharCode(kode); }
  function rem(n) { return { baris: n, jalan: function () { } }; }

  function pet(n, baris, kolom, isi) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function judul(n, baris, kolom, isi) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.warna(15, 0); m.cetak(isi); m.barisBaru();
      m.warna(3, 0);
    } };
  }
  function warnaPet(n, baris, kolom, isi) {
    return { baris: n, jalan: function (m) {
      m.warna(3, 0); m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function bersih(n) { return { baris: n, jalan: function (m) { m.cls(); } }; }
  function warna(n, d, l) {
    return { baris: n, jalan: function (m) { m.warna(d, l); } };
  }
  function ulang(n, baris, kolom, kali, kode) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(m.ulang(kali, kode)); m.barisBaru();
    } };
  }
  function aksara(n, baris, kolom, kode) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(m.chr(kode)); m.barisBaru();
    } };
  }
  function blok(n, baris, kolom, kali) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(m.ulang(kali, 219)); m.barisBaru();
    } };
  }
  function kosongkan(n, baris, kolom, kali) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(m.ulang(kali, 32)); m.barisBaru();
    } };
  }
  /* Dua tiang blok yang menutup sisi kiri dan kanan sebuah kotak. */
  function tiang(n, dari, sampai, kiri, kanan) {
    return { baris: n, jalan: function (m) {
      for (m.v.A = dari; m.v.A <= sampai; m.v.A++) {
        m.locate(m.v.A, kiri);  m.cetak(m.ulang(2, 219)); m.barisBaru();
        m.locate(m.v.A, kanan); m.cetak(m.ulang(2, 219)); m.barisBaru();
      }
    } };
  }
  function kotakAtas(n) {
    return { baris: n, jalan: function (m) {
      m.locate(1, 1);
      m.cetak(m.chr(201) + m.ulang(78, 205) + m.chr(187)); m.barisBaru();
    } };
  }
  function kotakBawah(n) {
    return { baris: n, jalan: function (m) {
      m.locate(23, 1);
      m.cetak(m.chr(200) + m.ulang(78, 205) + m.chr(188));
    } };
  }
  function kotakSisi(n) {
    return { baris: n, jalan: function (m) {
      for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
        m.locate(m.v.A, 1);  m.cetak(m.chr(186)); m.barisBaru();
        m.locate(m.v.A, 80); m.cetak(m.chr(186));
      }
    } };
  }
  function panggil(n, ke) {
    return { baris: n, jalan: function (m) { m.gosub(ke); } };
  }
  function ke(n, tujuan) {
    return { baris: n, jalan: function (m) { m.lompat(tujuan); } };
  }
  function bersihPanggil(n, ke) {
    return { baris: n, bagian: [
      function (m) { m.cls(); },
      function (m) { m.gosub(ke); }
    ] };
  }
  /* "Halaman sebelumnya". Lima dari lima belas panggilan ini salah sasaran;
     lihat tabel di kepala berkas. */
  function mundur(n, ke) {
    return { baris: n, jalan: function (m) {
      if (m.v.BACKFLAG) m.lompat(ke);
    } };
  }

  var tabel = [

    /* 10 `DEFSTR Z` — variabel bernama Z (dan Z apa pun) otomatis bertipe
       STRING tanpa tanda dolar. Itu sebabnya baris 3400 bisa menulis
       `Z=INKEY$` alih-alih `Z$=INKEY$`. Satu-satunya DEFSTR di koleksi ini. */
    { baris: 10, jalan: function (m) { m.cls(); m.warna(3, 0); } },
/* 20 memasang PENANGANNYA saja; `KEY(10) ON` yang menyalakannya ada di
       baris 3480, dipanggil dari tiap halaman. Dua langkah terpisah, dan
       urutannya bebas — sama seperti HINTS.BAS. */
    { baris: 20, jalan: function (m) { m.pasangJebakan(10, 3410); } },
    { baris: 30, jalan: function (m) { m.pasangJebakan(1, 3490); } },
    { baris: 40, bagian: [
        function (m) { m.cls(); m.v.XLIN = 1; m.v.XPOS = 1; },
        function (m) { m.gosub(3460); }
      ] },
    blok(50, 3, 2, 78),
    tiang(60, 4, 22, 2, 78),
    blok(70, 23, 2, 78),
    { baris: 80, jalan: function (m) {
        m.locate(1, 25); m.warna(15, 0);
        m.cetak('THE EVOLUTION OF COMPUTER SIZE'); m.barisBaru();
      } },
    { baris: 90, jalan: function (m) {
        m.warna(0, 7); m.locate(15, 15); m.cetak('          '); m.barisBaru();
      } },
    pet(100, 16, 15, "   IBM    "),
    pet(110, 17, 15, "   360    "),
    { baris: 120, jalan: function (m) {
        m.locate(18, 15); m.cetak('          '); m.barisBaru(); m.warna(3, 0);
      } },
    { baris: 130, jalan: function (m) {
        m.locate(18, 55); m.warna(0, 7); m.cetak(' PC '); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 140, jalan: function (m) {
        m.locate(7, 4); m.cetak('<' + '-'.repeat(17)); m.barisBaru();
      } },
    { baris: 150, jalan: function (m) {
        m.locate(7, 57); m.cetak('-'.repeat(20) + '>'); m.barisBaru();
      } },
    pet(160, 6, 22, "The border that  surrounds this text"),
    pet(170, 7, 22, "represents  ENIAC, the first totally"),
    pet(180, 8, 22, "electronic digital computer. It took"),
    pet(190, 9, 22, "up 1500 square feet of  floor space,"),
    pet(200, 10, 22, "weighed over  30 tons, and contained"),
    pet(210, 11, 22, "over 18,000 vacuum tubes that failed"),
    pet(220, 12, 22, "at the rate of  1  every  7  minutes."),
    pet(230, 13, 22, "It first went into service  in  1946."),
    pet(240, 20, 18, "1964"),
    pet(250, 21, 17, "IBM 360"),
    pet(260, 20, 55, "1981"),
    pet(270, 21, 54, "IBM PC"),
    pet(280, 7, 4, "<---"),
    pet(290, 8, 6, "E"),
    pet(300, 9, 6, "N"),
    pet(310, 10, 6, "I"),
    pet(320, 11, 6, "A"),
    pet(330, 12, 6, "C"),
    pet(340, 13, 4, "<---"),
    panggil(350, 3380),
    /* 360 halaman PERTAMA: F1 keluar ke INTRO.BAS, bukan ke halaman lain. */
    { baris: 360, jalan: function (m) {
        if (m.v.BACKFLAG) m.jalankan('intro');
      } },
    pet(370, 6, 10, "            Computers got smaller when the VACUUM          "),
    pet(380, 7, 4, "<---              TUBE  was replaced by the  TRANSISTOR,                  "),
    pet(390, 8, 4, "  E               and soon thereafter, by SILICON CHIPS.                  "),
    pet(400, 9, 4, "  N                                                                 "),
    pet(410, 10, 4, "  I               The development of  LARGE SCALE INTE-             "),
    pet(420, 11, 4, "  A               GRATION (putting huge amounts of data             "),
    pet(430, 12, 4, "  C               in microscopic spaces)  also aided in             "),
    pet(440, 13, 4, "<---              the reduction of computer size.                    "),
    panggil(450, 3380),
    mundur(460, 40),
    pet(470, 6, 4, "          As computers  became  SMALLER, they also became FASTER."),
    pet(480, 7, 4, "<---                                                                      "),
    pet(490, 8, 4, "  E       In the early days,  processing  time would be measured  "),
    pet(500, 9, 4, "  N       in SECONDS and MILLISECONDS  (thousandths of a second)."),
    pet(510, 10, 4, "  I       Today,  processing  time is measured  in  MICROSECONDS"),
    pet(520, 11, 4, "  A       (millionths of a second)  and NANOSECONDS  (billionths"),
    pet(530, 12, 4, "  C       of a second). The  C P U  (central processing unit) in"),
    pet(540, 13, 4, "<---      in the IBM P C is  FOUR  times faster than the 360 !!!"),
    panggil(550, 3380),
    mundur(560, 370),
    rem(570)  /* ****** CPU ****** */,
    bersih(580),
    warna(590, 3, 0),
    panggil(600, 3460),
    kotakAtas(610),
    kotakSisi(620),
    kotakBawah(630),
    blok(640, 6, 23, 33),
    tiang(650, 7, 9, 23, 54),
    blok(660, 10, 23, 33),
    blok(670, 13, 11, 18),
    tiang(680, 14, 16, 11, 27),
    blok(690, 17, 11, 18),
    blok(700, 13, 46, 31),
    tiang(710, 14, 16, 46, 75),
    blok(720, 17, 46, 31),
    pet(730, 4, 20, "The Central Processing Unit Has 2 Parts"),
    pet(740, 8, 26, "THE CENTRAL PROCESSING UNIT"),
    pet(750, 15, 14, "CONTROL UNIT"),
    pet(760, 15, 51, "ARITHMETIC/LOGIC UNIT"),
    pet(770, 20, 13, "THE COMPUTER'S"),
    /* 780 `CHR$(34)` adalah tanda kutip. Satu-satunya cara mencetaknya di
       dalam string BASIC — tidak ada aksara pelolos. */
    { baris: 780, jalan: function (m) {
        m.locate(21, 16);
        m.cetak(m.chr(34) + 'BRAIN' + m.chr(34)); m.barisBaru();
      } },
    pet(790, 20, 49, "THE COMPUTER'S CALCULATOR"),
    pet(800, 21, 47, "(For handling binary numbers)"),
    ulang(810, 15, 29, 17, 196),
    panggil(820, 3380),
    mundur(830, 40),
    bersih(840),
    warna(850, 3, 0),
    panggil(860, 3460),
    kotakAtas(870),
    kotakSisi(880),
    kotakBawah(890),
    blok(900, 4, 31, 18),
    tiang(910, 5, 7, 31, 47),
    blok(920, 8, 31, 18),
    pet(930, 6, 34, "CONTROL UNIT"),
    pet(940, 11, 25, '- Fetches instructions'),
    pet(950, 13, 25, '- Interprets instructions'),
    pet(960, 15, 25, '- Executes the instructions'),
    pet(970, 17, 25, '- Controls ARITH/LOGIC UNIT'),
    pet(980, 19, 25, '- Controls Peripherals'),
    pet(990, 21, 25, '- Manipulates data throughout system'),
    panggil(1000, 3380),
    mundur(1010, 580),
    bersih(1020),
    warna(1030, 3, 0),
    panggil(1040, 3460),
    kotakAtas(1050),
    kotakSisi(1060),
    kotakBawah(1070),
    blok(1080, 3, 27, 26),
    tiang(1090, 3, 7, 27, 52),
    blok(1100, 7, 27, 25),
    { baris: 1110, jalan: function (m) {
        m.locate(11, 7);  m.cetak(m.ulang(16, 219)); m.barisBaru();
        m.locate(11, 35); m.cetak(m.ulang(11, 219)); m.barisBaru();
        m.locate(11, 58); m.cetak(m.ulang(14, 219)); m.barisBaru();
      } },
    tiang(1120, 11, 15, 7, 22),
    tiang(1130, 11, 15, 35, 45),
    tiang(1140, 11, 15, 58, 71),
    aksara(1150, 8, 40, 179),
    aksara(1160, 9, 40, 179),
    aksara(1170, 10, 15, 218),
    ulang(1180, 10, 16, 24, 196),
    aksara(1190, 10, 40, 197),
    ulang(1200, 10, 41, 24, 196),
    aksara(1210, 10, 65, 191),
    { baris: 1220, jalan: function (m) {
        m.locate(15, 7);  m.cetak(m.ulang(16, 219)); m.barisBaru();
        m.locate(15, 35); m.cetak(m.ulang(11, 219)); m.barisBaru();
        m.locate(15, 58); m.cetak(m.ulang(14, 219)); m.barisBaru();
      } },
    pet(1230, 5, 30, "ARITHMETIC/LOGIC UNIT"),
    pet(1240, 13, 10, "ACCUMULATOR"),
    pet(1250, 13, 38, "ADDERS"),
    pet(1260, 13, 61, "REGISTERS"),
    pet(1270, 17, 4, "  Retains partial comp-        Monitors  and         Temporarily  stores"),
    pet(1280, 18, 6, "utations  until used.        adds incoming         data from main mem-"),
    pet(1290, 19, 6, "Combines   main  and         and  outgoing         ory, and returns it"),
    pet(1300, 20, 6, "learned   memory  as         data  (binary         as it is no  longer"),
    pet(1310, 21, 6, "needed.                      numbers).             needed.            "),
    panggil(1320, 3380),
    mundur(1330, 580),
    bersih(1340),
    warna(1350, 3, 0),
    panggil(1360, 3460),
    kotakAtas(1370),
    kotakSisi(1380),
    kotakBawah(1390),
    judul(1400, 3, 21, "THE COMPUTER'S INTERNAL TRANSIT SYSTEM"),
    warnaPet(1410, 5, 15, "All information that goes in and out of a  computer"),
    pet(1420, 6, 15, "passes through an input/output port (I/O Port)."),
    pet(1430, 8, 15, "Early computers had only SERIAL PORTS that received"),
    pet(1440, 9, 15, "and returned data serially,  or, one bit at a time."),
    pet(1450, 11, 15, "Processing  time in computers  was vastly  improved"),
    pet(1460, 12, 15, "by the development of  PARALLEL PORTS  which handle"),
    pet(1470, 13, 15, "and move large amounts of data simultaneously."),
    pet(1480, 15, 15, "The process utilizes electrical conductors (printed"),
    pet(1490, 16, 15, "circuit boards) that will carry multiple electrical"),
    pet(1500, 17, 15, "impulses around the innards of the computer."),
    pet(1510, 19, 15, "These multiple impulse carriers are known as BUSSES,"),
    pet(1520, 20, 15, "and when several are used together, they are called"),
    pet(1530, 21, 15, "BUS SYSTEMS."),
    panggil(1540, 3380),
    mundur(1550, 580),
    rem(1560)  /* ****** memory ****** */,
    bersih(1570),
    warna(1580, 3, 0),
    panggil(1590, 3460),
    judul(1600, 2, 25, "PUTTING MEMORY IN HUMAN TERMS"),
    pet(1610, 4, 12, "Humans and computers think of  MEMORY in different ways."),
    pet(1620, 5, 12, "We think of it in terms of letters and pages. Computers"),
    pet(1630, 6, 12, "(and computer people) deal with memory in terms of BITS,"),
    pet(1640, 7, 12, "BYTES,  K's, and  MEGS.   The  comparison  chart  below"),
    pet(1650, 8, 12, "should  make  it  all  a  little  easier to  understand."),
    blok(1660, 10, 1, 80),
    tiang(1670, 11, 22, 1, 79),
    blok(1680, 23, 1, 80),
    { baris: 1690, jalan: function (m) {
        m.warna(1, 0); m.locate(12, 15); m.cetak('COMPUTERS'); m.barisBaru();
      } },
    pet(1700, 12, 53, "HUMANS"),
    warna(1710, 3, 0),
    pet(1720, 14, 4, "8 BITS = 1 BYTE"),
    pet(1730, 14, 40, "Nothing comparable to BITS."),
    pet(1740, 16, 4, "1 BYTE = 1 CHARACTER"),
    pet(1750, 16, 40, "Any LETTER, NUMBER, SYMBOL, OR SPACE."),
    pet(1760, 18, 4, "1 K = 1024 BYTES"),
    pet(1770, 18, 40, "1 PAGE = 3072 BYTES or 3 K."),
    pet(1780, 20, 4, "1 MEGABYTE = 1 Million BYTES"),
    pet(1790, 20, 40, "1 MEG = approx. 333 PAGES."),
    panggil(1800, 3380),
    mundur(1810, 840),
    { baris: 1820, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(3460); },
        function (m) {
          m.locate(4, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
        }
      ] },
    tiang(1830, 4, 22, 1, 79),
    blok(1840, 23, 1, 80),
    judul(1850, 2, 21, "THERE ARE THREE TYPES OF COMPUTER MEMORY"),
    kosongkan(1860, 5, 3, 76),
    kosongkan(1870, 6, 3, 76),
    pet(1880, 7, 12, " <1>  PERMANENT  MEMORY is the computers main, work-"),
    pet(1890, 8, 12, "      ing memory. It is also  known  as  ADDRESSABLE"),
    pet(1900, 9, 12, "      MEMORY."),
    kosongkan(1910, 10, 3, 76),
    kosongkan(1920, 11, 3, 76),
    pet(1930, 12, 12, " <2>  LONG  TERM  MEMORY is simply STORAGE.  This is"),
    pet(1940, 13, 12, "      memory that may be stored outside the computer"),
    pet(1950, 14, 4, "              on tapes, floppy diskettes, or hard disks."),
    kosongkan(1960, 15, 3, 76),
    kosongkan(1970, 16, 3, 76),
    pet(1980, 17, 12, " <3>  LEARNED  MEMORY  is  SOFTWARE.  This is memory"),
    pet(1990, 18, 4, "              that  the  computer  uses  temporarily to per-"),
    pet(2000, 19, 4, "              form a specific task.  The  computer  will not"),
    pet(2010, 20, 4, "              retain this data,  but  must `RELEARN' it each"),
    pet(2020, 21, 4, "              time you wish to use it."),
    panggil(2030, 3380),
    mundur(2040, 1560),
    judul(2050, 2, 21, "      FILES, RECORDS, AND FIELDS        "),
    pet(2060, 7, 12, "      In order to understand how your PC handles and"),
    pet(2070, 8, 12, "      stores data and information,  you will need to"),
    pet(2080, 9, 12, "      understand  FILES, RECORDS, and FIELDS."),
    pet(2090, 11, 12, "      Each diskette contains up to  64  FILES. A FILE"),
    pet(2100, 12, 12, "      is a collection of related  RECORDS arranged in"),
    pet(2110, 13, 12, "      FIELDS of data. Each FILE may have thousands of"),
    pet(2120, 14, 12, "      RECORDS.  RECORDS  may have thousands of FIELDS."),
    pet(2130, 16, 7, "     FILES------>contain------>RECORDS----->contain------->FIELDS     "),
    pet(2140, 17, 7, "XXXXXXXXXXXXXXX            XXXXXXXXXXXXXXX            XXXXXXXXXXXXXXX"),
    pet(2150, 18, 7, "X    The      X            X   Lambert   X            X     Age     X"),
    pet(2160, 19, 7, "X Pittsburgh  X            X    Swann    X            X    Height   X"),
    pet(2170, 20, 7, "X  Steelers   X            X   Bradshaw  X            X    Weight   X"),
    pet(2180, 21, 7, "XXXXXXXXXXXXXXX            XXXXXXXXXXXXXXX            XXXXXXXXXXXXXXX"),
    panggil(2190, 3380),
    mundur(2200, 1820),
    rem(2210)  /* ***** OPERATING SYSYEMS ****** */,
    bersihPanggil(2220, 3460),
    kotakAtas(2230),
    kotakSisi(2240),
    kotakBawah(2250),
    judul(2260, 3, 30, "DOS OPERATING SYSTEM"),
    pet(2270, 5, 20, "The Disk Operating System is responsible"),
    pet(2280, 6, 20, "for the  overall  operation of  your  PC."),
    pet(2290, 7, 20, "DOS has  3  main  operational  functions:"),
    pet(2300, 9, 39, "DOS"),
    pet(2310, 10, 40, "" + KOTAK(179) + ""),
    pet(2320, 11, 40, "" + KOTAK(179) + ""),
    pet(2330, 11, 15, "" + KOTAK(218) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(197) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(196) + "" + KOTAK(191) + ""),
    pet(2340, 12, 15, "" + KOTAK(179) + "                        " + KOTAK(179) + "                         " + KOTAK(179) + ""),
    pet(2350, 13, 11, "INTERPRET"),
    pet(2360, 14, 10, "AND EXECUTE"),
    pet(2370, 15, 9, "YOUR COMMANDS"),
    pet(2380, 13, 37, "MANAGE"),
    pet(2390, 14, 34, "AND  PROCESS"),
    pet(2400, 15, 35, "DISK FILES"),
    pet(2410, 13, 62, "OVERSEE"),
    pet(2420, 14, 58, "AND  COMMUNICATE"),
    pet(2430, 15, 58, "WITH PERIPHERALS"),
    panggil(2440, 3380),
    mundur(2450, 1820),
    bersihPanggil(2460, 3460),
    kotakAtas(2470),
    kotakSisi(2480),
    kotakBawah(2490),
    judul(2500, 3, 35, "LANGUAGES"),
    pet(2510, 5, 15, "MACHINE LANGUAGE"),
    pet(2520, 7, 15, "All computers operate in MACHINE  LANGUAGE, which is"),
    pet(2530, 8, 15, "a language without words."),
    pet(2540, 10, 15, "Machine  language is composed  completely of  BINARY"),
    pet(2550, 11, 15, "NUMBERS,  which are simply strings of zeros and ones"),
    pet(2560, 12, 15, "(the binary equivalent  of 14 is 1110)."),
    pet(2570, 14, 15, "ASSEMBLY LANGUAGE"),
    pet(2580, 16, 15, "Because programming  with binary numbers was so time"),
    pet(2590, 17, 15, "consuming and intricate, man soon developed a better"),
    pet(2600, 18, 15, "way.  ASSEMBLY  LANGUAGE allows programs and data to"),
    pet(2610, 19, 15, "be  entered in words and letters.  Assembly language"),
    pet(2620, 20, 15, "is  translated  into  machine language  by a program"),
    pet(2630, 21, 15, "called an ASSEMBLER."),
    panggil(2640, 3380),
    mundur(2650, 2210),
    bersihPanggil(2660, 3460),
    kotakAtas(2670),
    kotakSisi(2680),
    kotakBawah(2690),
    judul(2700, 3, 35, "LANGUAGES"),
    pet(2710, 5, 15, "HIGH-LEVEL LANGUAGES"),
    pet(2720, 7, 15, "The invention of a  program called a  COMPILER,  which"),
    pet(2730, 8, 15, "is very much like an  assembler,  enabled  man to dev-"),
    pet(2740, 9, 15, "elop languages that were very close to  plain  english."),
    pet(2750, 10, 15, "There are probably hundreds of these  HIGH LEVEL LAN-"),
    pet(2760, 11, 15, "GUAGES. A few, however, dominate the industry."),
    pet(2770, 13, 15, "BASIC"),
    pet(2780, 15, 15, "BASIC is, without doubt,the most widely known language"),
    pet(2790, 16, 15, "in the world today.  BASIC stands for  Beginner's  All"),
    pet(2800, 17, 15, "Purpose Symbolic Instruction Code. BASIC was developed"),
    pet(2810, 18, 15, "in the mid-60's at Dartmouth University."),
    pet(2820, 20, 15, "There are 3 levels of BASIC available on your PC: DISK"),
    pet(2830, 21, 15, "BASIC, CASSETTE BASIC, and ADVANCED BASIC."),
    panggil(2840, 3380),
    mundur(2850, 2460),
    bersihPanggil(2860, 3460),
    kotakAtas(2870),
    kotakSisi(2880),
    kotakBawah(2890),
    judul(2900, 3, 35, "LANGUAGES"),
    pet(2910, 4, 15, "FORTRAN"),
    pet(2920, 6, 15, "FORTRAN stands for FORmula TRANslator. It was one"),
    pet(2930, 7, 15, "of the first high level languages developed (1957)"),
    pet(2940, 8, 15, "and it is still the second most dominant language"),
    pet(2950, 9, 15, "in use today. FORTRAN is used primarily for tech-"),
    pet(2960, 10, 15, "nical and scientific applications."),
    pet(2970, 12, 15, "COBOL"),
    pet(2980, 14, 15, "COBOL is used extensively in business and account-"),
    pet(2990, 15, 15, "ing. In fact, COBOL means COMMON BUSINESS ORIENTED"),
    pet(3000, 16, 15, "LANGUAGE."),
    pet(3010, 18, 15, "OTHER HIGH LEVEL LANGUAGES"),
    pet(3020, 20, 15, "Some other languages you may see are: PASCAL, PL/1,"),
    pet(3030, 21, 15, "SNOBOL, LISP, STRESS, LOGO, JOVIAL, and ALGOL."),
    panggil(3040, 3380),
    mundur(3050, 2660),
    bersihPanggil(3060, 3460),
    kotakAtas(3070),
    kotakSisi(3080),
    kotakBawah(3090),
    judul(3100, 4, 22, 'THE 15 COMMANDMENTS OF DISKETTE CARE'),
    warna(3110, 3, 0),
    pet(3120, 6, 15, "#1  Always, Always, Always make a back-up copy."),
    pet(3130, 8, 15, "#2  Use the backup. Store the Master."),
    pet(3140, 10, 15, "#3  Identify and label immediately."),
    pet(3150, 12, 15, "#4  Use only soft-tipped pens to write on diskettes."),
    pet(3160, 14, 15, "#5  Insert with label up - under your thumb."),
    pet(3170, 16, 15, "#6  Never turn computer on or off with diskette in drive."),
    pet(3180, 18, 15, "#7  Keep away from magnetic fields (Monitor, Phone, TV, etc.)"),
    pet(3190, 20, 15, "#8  Keep away from food or drink."),
    panggil(3200, 3380),
    mundur(3210, 2860),
    bersihPanggil(3220, 3460),
    kotakAtas(3230),
    kotakSisi(3240),
    kotakBawah(3250),
    judul(3260, 4, 22, 'THE 15 COMMANDMENTS OF DISKETTE CARE'),
    warna(3270, 3, 0),
    pet(3280, 6, 15, "#9  Keep away from excessive dust or heat."),
    pet(3290, 8, 15, "#10 Touch only the jacket, not the diskette."),
    pet(3300, 10, 15, "#11 Return all diskettes to envelopes after use."),
    pet(3310, 12, 15, "#12 Store diskettes horizontally or vertically ONLY."),
    pet(3320, 14, 15, "#13 Spring for a plastic diskette holder."),
    pet(3330, 16, 15, "#14 Clean disk drive head frequently."),
    pet(3340, 18, 15, "#15 Treat diskettes like record albums, not frisbees."),
    panggil(3350, 3380),
    mundur(3360, 3060),
    /* 3370 halaman TERAKHIR jatuh langsung ke sini tanpa percabangan —
       sesudah halaman keenam belas, program selalu pulang ke INTRO.BAS. */
    { baris: 3370, jalan: function (m) { m.jalankan('intro'); } },
    { baris: 3380, jalan: function (m) {
        m.jebakan(1, true); m.v.BACKFLAG = 0;
        m.locate(24, 12); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue   Strike <F1> For Previous Page');
        m.warna(3, 0);
      } },
    /* 3390 `POKE 106,0` MEMBUANG TOMBOL YANG TERLANJUR TERTEKAN — dan di
       sini ia di dalam gelung yang mengulang sampai INKEY$ benar-benar
       kosong. Ini persis perbaikan yang HILANG di MUSIC.BAS. */
    { baris: 3390, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(3390);
      } },
    { baris: 3400, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3400); else m.kembali();
      } },
    { baris: 3410, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XLIN = m.barisKursor(); m.v.XPOS = m.pos();
        m.locate(25, 1); m.spc(79);
      } },
    { baris: 3420, jalan: function (m) {
        m.locate(25, 21); m.warna(15, 0);
        m.cetak('Do You Wish To Leave This Program? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 3430, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(3430);
      } },
    /* 3440 "INTRO" huruf besar di sini, "intro" huruf kecil di baris 360
       dan 3370. Di DOS tidak ada bedanya; di sistem berkas lain ada. */
    { baris: 3440, jalan: function (m) {
        if (m.v.Z === 'y' || m.v.Z === 'Y') m.jalankan('INTRO');
      } },
    { baris: 3450, jalan: function (m) {
        if (m.v.Z !== 'n' && m.v.Z !== 'N') m.lompat(3430);
      } },
    { baris: 3460, jalan: function (m) {
        m.locate(25, 1); m.spc(79); m.locate(25, 23); m.warna(0, 7);
      } },
    { baris: 3470, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Program '); m.warna(3, 0);
        m.locate(m.v.XLIN || 1, m.v.XPOS || 1, 0);
      } },
    { baris: 3480, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },
    /* 3490 `RETURN 3500` — membuang alamat pulang dan melanjutkan di baris
       yang ditentukan. Pola yang sama dengan HINTS.BAS dan ANATOMY.BAS:
       jebakan F1 menyetel bendera, lalu memaksa GOSUB 3380 pulang. */
    { baris: 3490, jalan: function (m) {
        m.jebakan(1, false); m.v.BACKFLAG = 1; m.kembali(3500);
      } },
    { baris: 3500, jalan: function (m) { m.kembali(); } },
    /* 3510 `ON ERROR GOTO 3510` menjadikan SETIAP galat, apa pun jenisnya,
       sebagai perintah kembali ke menu. Tidak ada pesan, tidak ada catatan. */
    { baris: 3510, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['HISTORY'] = {
    nama: 'HISTORY',
    judul: 'History — enam belas halaman pelajaran komputer',
    sumber: 'HISTORY',
    berkas: 'run/HISTORY.BAS',
    tabel: tabel,
    benih: 79,

    arsitektur: {
      judul: 'Alur HISTORY.BAS',
      simpul: [
        { id: 'pasang', baris: '10-30', jenis: 'mulai',
          teks: ['DEFSTR Z; jebakan F10 dan F1;', 'ON ERROR ke menu'] },
        { id: 'halaman', baris: '40-3360',
          teks: ['Enam belas halaman:', 'gambar, teks, tunggu tombol'] },
        { id: 'tunggu', baris: '3380-3400', jenis: 'subrutin',
          teks: ['Buang tombol sisa,', 'lalu tunggu satu ketukan'] },
        { id: 'mundur', baris: '3490-3500', jenis: 'subrutin',
          teks: ['F1: BACKFLAG=1,', 'lalu RETURN 3500'] },
        { id: 'salah', baris: '830, 1330, 1550, 1810, 2450', jenis: 'galat',
          teks: ['Lima nomor halaman', 'sebelumnya salah sasaran'] },
        { id: 'keluar', baris: '3410-3450', jenis: 'keluar',
          teks: ['F10: tanya Y/N,', 'lalu RUN "INTRO"'] }
      ],
      panah: [
        { dari: 'pasang', ke: 'halaman' },
        { dari: 'halaman', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'halaman', label: 'tombol apa pun' },
        { dari: 'tunggu', ke: 'mundur', label: 'F1' },
        { dari: 'mundur', ke: 'halaman', label: 'halaman sebelumnya' },
        { dari: 'mundur', ke: 'salah', label: 'lima kali', jenis: 'galat' },
        { dari: 'halaman', ke: 'keluar', label: 'F10' }
      ]
    },

    pseudokode: [
      { baris: 3490, tingkat: 0, teks: 'F1 &rarr; <code>BACKFLAG=1</code>, lalu <code>RETURN 3500</code> &mdash; <b>buang alamat pulang</b>' },
      { baris: 3380, tingkat: 1, teks: 'jadi <code>GOSUB 3380</code> kembali dengan bendera menyala&hellip;' },
      { baris: 830, tingkat: 2, teks: '&hellip;dan <code>IF BACKFLAG THEN 40</code> membuang pembaca ke <b>halaman pertama</b>, bukan ketiga' },
      { baris: 1330, tingkat: 2, teks: '<code>THEN 580</code> &mdash; salinan baris 1010 yang tidak diperbarui' },
      { baris: 1550, tingkat: 2, teks: '<code>THEN 580</code> lagi &mdash; salinan yang sama, dua halaman berturut-turut' },
      { baris: 10, tingkat: 0, teks: '<code>DEFSTR Z</code> &mdash; Z bertipe string <b>tanpa tanda dolar</b>; satu-satunya di koleksi ini' },
      { baris: 3390, tingkat: 0, teks: '<code>POKE 106,0</code> dalam gelung sampai <code>INKEY$</code> kosong &mdash; perbaikan yang <b>hilang</b> dari MUSIC.BAS' },
      { baris: 2050, tingkat: 0, teks: 'halaman kesepuluh <b>tidak</b> memanggil CLS &mdash; ia menimpa bingkai halaman kesembilan' },
      { baris: 3510, tingkat: 0, teks: '<code>ON ERROR</code> &rarr; <code>RUN "menu"</code>: <b>setiap</b> galat pulang diam-diam' }
    ],

    perintahAsli: 'run\\HISTORY.bat',
    catatanAsli: 'Tombol apa pun maju satu halaman, F1 mundur, F10 keluar. ' +
      'Coba tekan F1 di halaman keempat, keenam, ketujuh, kedelapan, dan ' +
      'kesebelas &mdash; kelimanya mendarat di halaman yang salah.',

    penyimpangan: [
      '<b><code>RUN "intro"</code> dan <code>RUN "menu"</code> tidak bisa ' +
      'dijalankan</b> &mdash; INTRO.BAS dan MENU.BAS tidak ada di koleksi ini. ' +
      'Penelusur berhenti dengan pesan program tidak ditemukan.',

      '<b><code>ON ERROR GOTO 3510</code> dipasang tapi tidak pernah ' +
      'terpicu</b>; tidak ada jalur di berkas ini yang membangkitkan galat.',

      '<b><code>DEF SEG:POKE 106,0</code> ditiru sebagai pengosongan ' +
      'penyangga tombol</b> &mdash; itu memang persis artinya di GW-BASIC.',

      '<b>Warna 1 (biru tua) di baris 1690 dan warna 0,7 (hitam di atas ' +
      'putih) tetap ditampilkan</b>, tapi konsol penelusur tidak punya ' +
      'pinggiran layar, jadi argumen ketiga <code>SCREEN</code> diabaikan.'
    ],

    pelajaran: {
      ringkas: 'Enam belas halaman pelajaran komputer, dengan tombol ' +
        '"halaman sebelumnya" yang salah sasaran di lima di antaranya ' +
        '&mdash; dan tidak satu pun menghasilkan galat.',
      pelajari: [
        ['Membuang alamat pulang untuk membawa jawaban',
         'Jebakan F1 di baris 3490 tidak bisa langsung memberitahu halaman ' +
         'mana yang sedang dibuka &mdash; ia bisa terpicu di mana saja. Yang ' +
         'dilakukannya: setel <code>BACKFLAG=1</code>, lalu ' +
         '<code>RETURN 3500</code>.',
         '<code>RETURN &lt;baris&gt;</code> <b>membuang</b> alamat pulang di ' +
         'tumpukan dan melanjutkan di baris yang disebut. Baris 3500 adalah ' +
         '<code>RETURN</code> biasa &mdash; miliknya subrutin 3380. Jadi ' +
         'jebakan itu memaksa <code>GOSUB 3380</code> pulang lebih awal, ' +
         'membawa bendera.',
         'Pemanggilnya lalu tinggal menulis satu baris: ' +
         '<code>IF BACKFLAG THEN &lt;halaman sebelumnya&gt;</code>. Setiap ' +
         'halaman tahu tetangganya sendiri, dan jebakannya tidak perlu tahu ' +
         'apa-apa.'],
        ['Membuang tombol yang terlanjur tertekan',
         'Baris 3390: <code>DEF SEG:POKE 106,0:IF INKEY$&lt;&gt;"" THEN 3390</code>. ' +
         'Ia mengosongkan penyangga tombol <b>berulang kali</b> sampai ' +
         '<code>INKEY$</code> benar-benar kosong, baru menunggu ketukan yang ' +
         'sebenarnya di 3400.',
         'Tanpa itu, satu ketukan nyasar dari halaman sebelumnya akan langsung ' +
         'membalik dua halaman sekaligus. Ini <b>persis</b> perbaikan yang ' +
         'hilang dari MUSIC.BAS dan baru muncul di MUSIC1.BAS &mdash; dan di ' +
         'sini ia sudah ada sejak awal, lengkap dengan gelungnya.'],
        ['Halaman yang menumpang bingkai tetangganya',
         'Halaman kesepuluh (baris 2050) tidak memanggil <code>CLS</code>. Ia ' +
         'langsung mencetak judul dan isinya di atas bingkai yang digambar ' +
         'halaman kesembilan &mdash; karena bingkainya memang sama persis.',
         'Menggambar bingkai 80&times;23 dengan <code>LOCATE</code> dan ' +
         '<code>PRINT</code> butuh dua puluh dua putaran gelung. Melewatinya ' +
         'membuat halaman itu muncul seketika, sementara yang lain tergambar ' +
         'baris demi baris.'],
        ['Tanda kutip yang tidak bisa diketik',
         'Baris 780: <code>PRINT CHR$(34)"BRAIN"CHR$(34)</code>. BASIC tidak ' +
         'punya aksara pelolos &mdash; tidak ada cara menulis tanda kutip ' +
         '<b>di dalam</b> string. Satu-satunya jalan adalah menyebut kode ' +
         'ASCII-nya dan menyambungnya.'],
        ['Satu variabel string tanpa tanda dolar',
         '<code>DEFSTR Z</code> di baris 10 membuat setiap variabel yang ' +
         'namanya dimulai Z bertipe string. Itu sebabnya baris 3400 bisa ' +
         'menulis <code>Z=INKEY$</code>. Satu-satunya <code>DEFSTR</code> di ' +
         'seluruh koleksi ini &mdash; program lain memakai <code>DEFINT</code> ' +
         'atau tidak sama sekali.']
      ],
      hindari: [
        ['Lima tombol mundur yang salah sasaran',
         'Enam belas halaman, lima belas nomor "halaman sebelumnya", dan ' +
         '<b>lima</b> di antaranya menunjuk ke halaman yang keliru:',
         '<code>&nbsp;830</code> halaman ke-4 &rarr; ke-1 <i>(seharusnya ke-3)</i><br>' +
         '<code>1330</code> halaman ke-6 &rarr; ke-4 <i>(seharusnya ke-5)</i><br>' +
         '<code>1550</code> halaman ke-7 &rarr; ke-4 <i>(seharusnya ke-6)</i><br>' +
         '<code>1810</code> halaman ke-8 &rarr; ke-5 <i>(seharusnya ke-7)</i><br>' +
         '<code>2450</code> halaman ke-11 &rarr; ke-9 <i>(seharusnya ke-10)</i>',
         'Polanya jelas: semuanya melompat <b>terlalu jauh ke belakang</b>, ' +
         'tidak ada satu pun yang melompat ke depan. Baris 1010 menulis ' +
         '<code>THEN 580</code> dan itu benar. Baris 1330 dan 1550 adalah ' +
         'salinannya. Dan baris 1810 menulis <code>THEN 840</code> &mdash; ' +
         'nilai yang justru seharusnya dipakai baris 1330.',
         'Nomornya bergeser satu halaman, dan <b>bergesernya ikut tersalin</b>.'],
        ['Cacat yang tidak pernah menghasilkan galat',
         'Menekan F1 di halaman keempat tidak menghentikan apa pun. Layar ' +
         'berganti, isinya sah, bingkainya rapi &mdash; cuma bukan halaman ' +
         'yang barusan dilihat pembacanya.',
         'Dan pembaca yang baru belajar komputer tidak punya cara tahu bahwa ' +
         'yang salah programnya. Yang lebih mungkin ia simpulkan: <i>"saya ' +
         'yang salah ingat"</i>.'],
        ['Setiap galat pulang diam-diam',
         '<code>ON ERROR GOTO 3510</code>, dan baris 3510 berbunyi ' +
         '<code>RUN "menu"</code>. Apa pun yang salah &mdash; berkas hilang, ' +
         'bagi nol, memori habis &mdash; jawabannya sama: kembali ke menu, ' +
         'tanpa pesan. Pemakainya melihat program tiba-tiba menutup diri.'],
        ['Nama berkas dengan besar-kecil yang berbeda',
         'Baris 360 dan 3370 menulis <code>RUN"intro</code>; baris 3440 ' +
         'menulis <code>RUN"INTRO</code>. Di DOS tidak ada bedanya, dan di ' +
         'sinilah kebiasaan itu tumbuh &mdash; kebiasaan yang jadi cacat ' +
         'begitu kodenya pindah ke sistem berkas yang membedakannya.'],
        ['Kata yang tersambung dua kali',
         'Baris 530 berakhir dengan <i>"&hellip;(central processing unit) in"</i> ' +
         'dan baris 540 dimulai dengan <i>"in the IBM P C is&hellip;"</i>. Di layar ' +
         'terbaca <i>"unit) in in the IBM P C"</i>. Salah sambung yang cuma ' +
         'terlihat kalau kedua barisnya dibaca berurutan &mdash; dan penulisnya ' +
         'menulis keduanya terpisah.'],
        ['Salah eja di komentar dan di layar',
         '<code>OPERATING SYSYEMS</code> (baris 2210, di dalam REM) dan ' +
         '"Dartmouth <b>University</b>" (baris 2810) &mdash; yang benar ' +
         'Dartmouth <b>College</b>.']
      ]
    },

    penjelasan: [
      { judul: 'Tombol mundur yang mundur terlalu jauh',
        isi: [
          'Susunan berkas ini rapi dan berulang. Tiap halaman menggambar ' +
          'isinya, lalu:',
          '<code>GOSUB 3380</code><br>' +
          '<code>IF BACKFLAG THEN &lt;nomor halaman sebelumnya&gt;</code>',
          'Dua baris, enam belas kali. Dan lima belas nomor yang harus ditulis ' +
          'tangan, satu per halaman.',
          'Lima di antaranya salah.',
          'Yang menarik bukan bahwa ada yang salah &mdash; melainkan ' +
          '<b>bagaimana</b> salahnya. Tidak ada satu pun yang menunjuk ke ' +
          'halaman berikutnya, atau ke nomor baris yang tidak ada, atau ke ' +
          'tengah-tengah sebuah halaman. Kelimanya menunjuk ke awal sebuah ' +
          'halaman yang sah &mdash; cuma halaman yang salah, dan selalu ' +
          '<b>terlalu jauh ke belakang</b>.',
          'Itu tanda tangan salin-tempel. Penulisnya menyalin pasangan ' +
          '<code>GOSUB</code>/<code>IF</code> dari halaman sebelumnya, lalu ' +
          'lupa memperbarui nomornya. Dan karena nomor lama <b>tetap sebuah ' +
          'halaman yang sah</b>, tidak ada yang meledak.',
          'Baris 1810 memberi petunjuk terakhir. Ia menulis ' +
          '<code>THEN 840</code>, dan 840 adalah halaman kelima &mdash; nilai ' +
          'yang seharusnya dipakai baris <b>1330</b>. Jadi nomornya bukan cuma ' +
          'lupa diperbarui; ia <b>bergeser satu halaman</b>, dan geseran itu ' +
          'ikut tersalin ke bawah.',
          'Pelajarannya bukan "hati-hati menyalin". Pelajarannya: <b>nomor ' +
          'halaman sebelumnya tidak seharusnya ditulis tangan sama sekali</b>. ' +
          'Sebuah larik nomor halaman, dan satu penunjuk yang naik-turun, akan ' +
          'membuat kelima cacat ini mustahil ada.'
        ] },
      { judul: 'Sebuah PC menjelaskan dirinya sendiri',
        isi: [
          'Program ini ditulis untuk orang yang baru saja membuka kardus IBM ' +
          'PC-nya dan tidak tahu apa yang ada di dalamnya.',
          'Halaman pertama menggambar bingkai di sekeliling layar dan ' +
          'mengatakan: <i>bingkai ini adalah ENIAC</i>. Seluas 1500 kaki ' +
          'persegi, berbobot 30 ton, 18.000 tabung hampa yang satu di ' +
          'antaranya rusak tiap tujuh menit. Di dalamnya ada kotak kecil ' +
          'bertuliskan IBM 360, dan kotak yang lebih kecil lagi bertuliskan PC.',
          'Tiga benda dalam satu layar, dengan skala yang bisa dilihat mata. ' +
          'Untuk sebuah pelajaran teks 80&times;25, itu cara menjelaskan yang ' +
          'sulit dikalahkan.',
          'Yang lain-lainnya juga menarik dibaca hari ini. <i>"Setiap disket ' +
          'memuat sampai 64 BERKAS"</i> (baris 2090) &mdash; angka yang benar ' +
          'untuk direktori akar disket PC pertama. <i>"1 MEG kira-kira 333 ' +
          'HALAMAN"</i>. <i>"CPU di IBM PC empat kali lebih cepat daripada ' +
          '360"</i>.',
          'Dan lima belas perintah merawat disket, yang ditutup dengan: ' +
          '<i>"Perlakukan disket seperti piringan hitam, bukan frisbee."</i>',
          'Berkas ini mengajarkan komputer kepada orang yang belum pernah ' +
          'memegangnya &mdash; dan hari ini ia jadi bahan pelajaran tentang ' +
          'sesuatu yang lain: bagaimana lima belas nomor yang ditulis tangan ' +
          'menghasilkan lima cacat yang tak seorang pun melihatnya.'
        ] }
    ]
  };
})(window);
