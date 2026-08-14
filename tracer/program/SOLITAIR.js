/* ===========================================================================
   SOLITAIR.js — porting minimalis SOLITAIR.BAS sebagai tabel baris.

        40 REM		 The Game of Klondyke Solitar
        50 REM		 By:  Jeff Littlefield
       110 REM  Modified by Ken Handzik 11/27/83 to display card suits
       120 REM  Revised by Jeff Littlefield 2/2/84 to give better instructions

   Tiga baris riwayat di kepala berkas: ditulis Littlefield, disunting Handzik
   untuk menampilkan lambang kartu, lalu disunting Littlefield lagi dua bulan
   kemudian. Satu-satunya program di koleksi ini yang mencatat perubahan
   tangan kedua dan kembalinya penulis asli.

   YANG PALING LAYAK DILIHAT: LAYAR PETUNJUK YANG SUDAH TERGAMBAR SEBELUM
   DIMINTA.

        180 SCREEN 0,1,0,0        tulis ke halaman 0, tampilkan halaman 0
        880 SCREEN 0,1,1,0        tulis ke halaman 1, tampilkan halaman 0
       1110 SCREEN 0,1,0,1        tulis ke halaman 0, tampilkan halaman 1

   Kartu CGA menyimpan beberapa layar teks penuh sekaligus. Baris 880 sampai
   1070 menggambar seluruh layar petunjuk ke halaman 1 — sementara pemain
   masih melihat meja permainannya di halaman 0.

   Lalu F1 cukup menukar halaman yang DITAMPILKAN. Petunjuknya muncul
   seketika, dan saat ditutup, meja permainannya sudah ada di sana. Tidak ada
   satu pun baris yang menggambar ulang apa pun.

   YANG KEDUA: TUNDAAN YANG MEMBACA JAM BIOS.

       2740 DV!=DT!*18.2/1000
       2750 DEF SEG = &H40
       2790 A! = A!*256 + PEEK(&H6F-ID)

   Bukan gelung kosong. Alamat 0040:006C..006F adalah pencacah detak BIOS —
   18,2 detak per detik — dan gelung 2760-2820 menghitung berapa kali ia
   berubah. Tundaan dalam milidetik yang benar, di mesin secepat apa pun.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `SOUND` diam, termasuk bel salah langkah (baris 1210 dan belasan lagi).
   - `RANDOMIZE` dari jam diganti benih tetap.
   - `PEEK` pencacah detak BIOS selalu memberi nilai yang sama, jadi gelung
     tundaan di baris 2760-2820 tidak menunda apa pun.
   - `LOAD"MENU",R` (baris 340) tidak bisa dijalankan.
   - Setiap halaman teks di kartunya punya kursornya sendiri; penelusur cuma
     punya satu. Tidak berpengaruh di sini, karena tiap halaman selalu
     memasang LOCATE-nya sendiri sebelum mencetak.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [];
  function T(e) { tabel.push(e); }
  function rem(n) { T({ baris: n, jalan: function () { } }); }
  /* `DEFINT A-Z`: semua variabel angka bulat kecuali yang bertanda `!`. */
  function set(m, nama, nilai) { m.v[nama] = Math.round(nilai); }
  function bas(n) {
    if (n === undefined || n === null) n = 0;
    return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
  }

  /* --- 10-180: siapkan ----------------------------------------------------- */
  [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130].forEach(rem);
  T({ baris: 140, jalan: function () { /* DEFINT A-Z */ } });
  /* 150 `TRUE = NOT FALSE` — dan di BASIC itu −1, bukan 1. Seluruh berkas ini
     memakai nama, bukan angka, dan itu jarang sekali di koleksi ini. */
  T({ baris: 150, jalan: function (m) {
      m.v.FALSE = 0; m.v.TRUE = -1;
      m.v.ABORT = 0; m.v.WON = 0;
      m.v['PARDON$'] = 'Pardon me while I shuffle the deck.';
    } });
  T({ baris: 160, jalan: function (m) {
      m.dim('DECK$()', 52); m.dim('STACK$()', 7, 21); m.dim('CARD$()', 52);
      m.dim('TOP$()', 4); m.dim('STACKPTR()', 7); m.dim('VISIPTR()', 7);
      m.dim('XYARR$()', 82);
    } });
  T({ baris: 170, jalan: function (m) { m.v['NOT.READ'] = -1; } });
  T({ baris: 180, jalan: function (m) {
      m.layar(0, 1, 0, 0); m.warna(7, 1); m.cls();
    } });
  T({ baris: 190, jalan: function (m) { m.cetak('Would You Like Instructions? '); } });
  T({ baris: 200, bagian: [
      function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') { m.lompat(200); return; }
        if (m.v['A$'] !== 'y' && m.v['A$'] !== 'Y') { m.lompat(210); return; }
        m.cls(); m.v.INSTRUC = -1;
      },
      function (m) { m.gosub(880); }
    ] });
  T({ baris: 210, jalan: function (m) {
      m.pasangJebakan(1, 1110); m.jebakan(1, true);
    } });
  T({ baris: 220, jalan: function () { /* RANDOMIZE dari jam */ } });
  T({ baris: 230, jalan: function (m) {
      m.warna(7, 1); m.cls(); m.cetak(m.v['PARDON$']); m.barisBaru();
    } });
  T({ baris: 240, bagian: [
      function (m) {
        if (m.v.INSTRUC) { m.v.INSTRUC = 0; m.lompat(250); return; }
        m.gosub(880);
      }
    ] });
  T({ baris: 250, jalan: function (m) { m.gosub(350); } });
  T({ baris: 260, jalan: function (m) { m.cls(); } });
  T({ baris: 270, jalan: function (m) { m.gosub(640); } });
  T({ baris: 280, jalan: function (m) { m.v.WON = 0; } });
  T({ baris: 290, jalan: function (m) { m.lompat(1130); } });
  T({ baris: 300, bagian: [
      function (m) { m.gosub(m.v.FLAG === 1 ? 2590 : 2230); }
    ] });
  T({ baris: 310, jalan: function (m) {
      if (m.v.ABORT) { m.v.ABORT = 0; m.lompat(290); }
    } });
  T({ baris: 320, bagian: [
      function (m) { m.v.FLAG = 0; },
      function (m) { m.gosub(2480); }
    ] });
  T({ baris: 330, jalan: function (m) {
      if (m.v.ABORT) { m.v.ABORT = 0; m.lompat(290); }
    } });
  T({ baris: 340, jalan: function (m) {
      if (m.v.FLAG === 1 && m.v.WON) m.lompat(230);
      else if (m.v.FLAG === 1) { m.cls(); m.cetak(m.v['PARDON$']); m.barisBaru(); m.lompat(250); }
      else { m.warna(7, 0); m.cls(); m.jalankan('MENU'); }
    } });

  /* --- 350-630: kocok dan bagi --------------------------------------------
     KARTU ADALAH STRING TIGA AKSARA: dua untuk pangkatnya (" A", "10", " K")
     dan satu untuk lambangnya — CHR$(3) sampai CHR$(6), yaitu hati, wajik,
     keriting, sekop di tabel aksara IBM.
     Jadi warnanya bisa dibaca langsung dari aksaranya (baris 2850), dan
     urutannya bisa dibandingkan sebagai teks (baris 1590-1700). */
  T({ baris: 350, jalan: function (m) { m.v.Z = 2; } });
  T({ baris: 360, jalan: function (m) { m.untuk('I', 1, 52, 1, 410); } });
  /* 370 `RESTORE` tiap tiga belas kartu: DATA yang sama dibaca empat kali,
     sekali untuk tiap lambang. Tiga belas nilai untuk lima puluh dua kartu. */
  T({ baris: 370, jalan: function (m) {
      if (m.v.I % 13 - 1 === 0) { m.ulangData(0); m.v.Z = m.v.Z + 1; }
    } });
  T({ baris: 380, jalan: function (m) { m.v['ZZ$'] = m.baca(); } });
  T({ baris: 390, jalan: function (m) {
      m.v['CARD$()'][m.v.I] = m.v['ZZ$'] + m.chr(m.v.Z);
    } });
  T({ baris: 400, jalan: function (m) { m.lanjutkan('I'); } });
  /* 410-450 kocokan Fisher-Yates yang benar: ambil satu kartu acak dari sisa,
     lalu PINDAHKAN kartu terakhir ke tempat yang barusan kosong. Tidak ada
     tolak-ulang, tidak ada percobaan yang terbuang — bandingkan dengan
     15PUZZLE.BAS baris 990-1060. */
  T({ baris: 410, jalan: function (m) { m.untuk('I', 52, 1, -1, 460); } });
  T({ baris: 420, jalan: function (m) {
      set(m, 'X', Math.floor(m.acak() * m.v.I) + 1);
    } });
  T({ baris: 430, jalan: function (m) {
      m.v['DECK$()'][m.v.I] = m.v['CARD$()'][m.v.X];
    } });
  T({ baris: 440, jalan: function (m) {
      m.v['CARD$()'][m.v.X] = m.v['CARD$()'][m.v.I];
    } });
  T({ baris: 450, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 460, jalan: function (m) { m.v.X = 1; } });
  T({ baris: 470, jalan: function (m) { m.untuk('I', 1, 7, 1, 550); } });
  T({ baris: 480, jalan: function (m) { m.untuk('J', 1, m.v.I, 1, 520); } });
  T({ baris: 490, jalan: function (m) {
      m.v['STACK$()'][m.v.I][m.v.J] = m.v['DECK$()'][m.v.X];
    } });
  T({ baris: 500, jalan: function (m) { m.v.X = m.v.X + 1; } });
  T({ baris: 510, jalan: function (m) { m.lanjutkan('J'); } });
  /* 520-530 DUA penunjuk per tumpukan: STACKPTR kartu paling atas, VISIPTR
     kartu terbawah yang TERBUKA. Selisihnya adalah berapa kartu yang boleh
     dipindahkan sekaligus. */
  T({ baris: 520, jalan: function (m) { m.v['STACKPTR()'][m.v.I] = m.v.I; } });
  T({ baris: 530, jalan: function (m) { m.v['VISIPTR()'][m.v.I] = m.v.I; } });
  T({ baris: 540, jalan: function (m) { m.lanjutkan('I'); } });
  /* 550 `DECK$(28)="   "` — kartu kosong sebagai PENJAGA di bawah tumpukan
     buangan, supaya baris 1430 boleh mencetak DECK$(DECKPTR) tanpa memeriksa
     apakah tumpukannya sudah habis. */
  T({ baris: 550, jalan: function (m) {
      m.v.DECKPTR = 31; m.v.ENDDECK = 52;
      m.v['DECK$()'][28] = '   '; m.v.NC = 24;
    } });
  /* 560 DATA dikumpulkan penafsirnya saat program DIMUAT, bukan saat
     barisnya dijalankan — dan baris ini berada di TENGAH gelung yang
     membacanya. Karena itu isinya dipindahkan ke `program.data` di bawah,
     dan baris ini tinggal penandanya. Hal yang sama berlaku untuk baris
     3040-3120. */
  rem(560);
  T({ baris: 570, jalan: function (m) { m.untuk('I', 1, 7, 1, 600); } });
  T({ baris: 580, jalan: function (m) { m.v['STACK$()'][m.v.I][0] = '   '; } });
  T({ baris: 590, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 600, jalan: function (m) { m.untuk('I', 1, 4, 1, 630); } });
  T({ baris: 610, jalan: function (m) { m.v['TOP$()'][m.v.I] = '   '; } });
  T({ baris: 620, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 630, jalan: function (m) { m.kembali(); } });

  /* --- 640-870: menggambar meja -------------------------------------------- */
  T({ baris: 640, jalan: function (m) {
      m.warna(3, 1); m.locate(1, 4); m.cetak('TOP:');
      m.locate(1, 65); m.cetak('Time: ');
    } });
  T({ baris: 650, jalan: function (m) { m.locate(3, 1); m.cetak('STACKS:'); } });
  T({ baris: 660, jalan: function (m) { m.untuk('I', 7, 1, -1, 700); } });
  T({ baris: 670, jalan: function (m) { m.locate(3, 45 - 5 * m.v.I); } });
  T({ baris: 680, jalan: function (m) { m.cetak(bas(m.v.I)); } });
  T({ baris: 690, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 700, jalan: function (m) { m.warna(7, 1); } });
  T({ baris: 710, jalan: function (m) { m.untuk('I', 1, 7, 1, 770); } });
  T({ baris: 720, jalan: function (m) { m.untuk('J', m.v.I, 7, 1, 760); } });
  T({ baris: 730, jalan: function (m) { m.locate(m.v.I + 3, 45 - m.v.J * 5); } });
  /* 740 kartu tertutup digambar dengan CHR$(254) — kotak kecil padat, tiga
     kali. Yang terbuka lewat subrutin 2840 yang memilih warnanya dari
     lambangnya. */
  T({ baris: 740, bagian: [
      function (m) {
        if (m.v['VISIPTR()'][m.v.J] !== m.v.I) {
          /* Aslinya `FOR X=1 TO 3:PRINT CHR$(254);:NEXT X` — tiga kotak
             padat, kartu tertutup. Ditulis sekaligus di sini. */
          m.cetak(m.chr(254) + m.chr(254) + m.chr(254));
          m.lompat(750); return;
        }
        m.v['C$'] = m.v['STACK$()'][m.v.J][m.v.I];
        m.gosub(2840);
      },
      function (m) {
        m.cetak(m.v['STACK$()'][m.v.J][m.v.I]); m.warna(7, 1);
      }
    ] });
  T({ baris: 750, jalan: function (m) { m.lanjutkan('J'); } });
  T({ baris: 760, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 770, jalan: function (m) { m.warna(3, 1); } });
  T({ baris: 780, jalan: function (m) { m.locate(10, 53); m.cetak('PILE:'); } });
  T({ baris: 790, jalan: function (m) { m.warna(7, 1); } });
  T({ baris: 800, bagian: [
      function (m) {
        m.locate(10, 59); m.v['C$'] = m.v['DECK$()'][m.v.DECKPTR];
        m.gosub(2840);
      },
      function (m) {
        m.cetak(m.v['DECK$()'][m.v.DECKPTR]);
        m.warna(3, 1); m.locate(10, 65); m.cetak('Count: ');
        m.warna(7); m.cetak(bas(m.v.NC)); m.warna(3);
      }
    ] });
  T({ baris: 810, jalan: function (m) {
      m.locate(11, 64); m.cetak('Card #: ');
      m.warna(7); m.cetak(bas(m.v.DECKPTR - 28) + '  ');
    } });
  T({ baris: 820, jalan: function (m) {
      m.warna(3); m.locate(12, 50); m.cetak('COMMAND: __  ');
    } });
  T({ baris: 830, jalan: function (m) { m.warna(2); } });
  T({ baris: 840, jalan: function (m) {
      m.locate(24, 26); m.cetak('Press F1 For Instructions');
    } });
  T({ baris: 850, jalan: function (m) { m.warna(7); } });
  T({ baris: 860, jalan: function (m) { m.locate(12, 59); } });
  T({ baris: 870, jalan: function (m) { m.kembali(); } });

  /* --- 880-1120: petunjuk, digambar DI HALAMAN LAIN ------------------------ */
  /* 880 tulis ke halaman 1, tampilkan halaman 0: pemain tidak melihat apa pun
     dari semua yang dicetak sepuluh baris berikutnya. */
  T({ baris: 880, jalan: function (m) { m.layar(0, 1, 1, 0); } });
  T({ baris: 890, jalan: function (m) {
      m.cls();
      m.v['KKKS$'] = '  K L O N D Y K E   S O L I T A I R E  ';
    } });
  T({ baris: 900, jalan: function (m) {
      m.locate(null, 11); m.warna(10); m.cetak('The Game Of  ');
      m.warna(12, 7); m.warna(5); m.cetak(m.v['KKKS$']);
      m.warna(0, 7); m.barisBaru(); m.warna(10, 1);
    } });
  T({ baris: 910, jalan: function (m) {
      m.locate(3, 1); m.cetak('R U L E S :'); m.warna(7); m.locate(4, 3);
      m.cetak('1. Cards are played alternating colors on the stack; by suit on the Top.');
    } });
  T({ baris: 920, jalan: function (m) {
      m.locate(5, 3);
      m.cetak('2. Stacks are played in descending order; Top is in ascending order.');
    } });
  T({ baris: 930, jalan: function (m) {
      m.locate(6, 3);
      m.cetak('3. Only Kings can be moved to an empty stack; only Aces can be');
      m.locate(7, 6); m.cetak('moved to an empty Top.');
    } });
  T({ baris: 940, jalan: function (m) {
      m.locate(8, 3);
      m.cetak('4. The Game can be claimed Victory when all cards are uncovered and');
      m.locate(9, 6); m.cetak('no cards are in the pile.');
    } });
  T({ baris: 950, jalan: function (m) {
      m.locate(10, 3);
      m.cetak('5. Commands are 1 - 2 characters. Illegal moves sound the BUZZER.');
    } });
  T({ baris: 960, jalan: function (m) {
      m.locate(11, 3);
      m.cetak('6. When you Quit two short beeps warn you of this.');
    } });
  T({ baris: 970, jalan: function (m) {
      m.locate(13, 1); m.warna(10); m.cetak('C O M M A N D S :'); m.warna(7);
    } });
  [[980, 15, 'C    Claim Victory'],
   [990, 16, 'N    Show the Next Card on the Pile'],
   [1000, 17, 'P#   Card on Pile to Stack No. #'],
   [1010, 18, 'PT   Card on Pile to Top'],
   [1020, 19, '##   Visible Cards on Stack #1 to Stack #2'],
   [1030, 20, '#T   Bottom Card on Stack #1 to the Top'],
   [1040, 21, 'Q    Quit This Game (and Try Again or Exit)'],
   [1050, 22, 'F1   For This Screen']
  ].forEach(function (k) {
    T({ baris: k[0], jalan: function (m) { m.locate(k[1], 10); m.cetak(k[2]); } });
  });
  T({ baris: 1060, jalan: function (m) {
      m.warna(12); m.locate(23, 10);
      m.cetak('Esc  Abort Quit and Return to Present Game'); m.barisBaru();
    } });
  T({ baris: 1070, jalan: function (m) {
      m.warna(13); m.locate(25, 28); m.cetak('Press Any Key To Continue');
      m.warna(7);
    } });
  T({ baris: 1080, jalan: function (m) { if (m.v.INSTRUC) m.lompat(1110); } });
  /* 1090 kembali menulis DAN menampilkan halaman 0 — meja permainannya, yang
     tidak pernah tersentuh. */
  T({ baris: 1090, jalan: function (m) { m.layar(0, 1, 0, 0); } });
  T({ baris: 1100, bagian: [
      function (m) { m.jebakan(1, true); },
      function (m) { m.kembali(); }
    ] });
  /* 1110 INI PENANGAN F1, dan seluruh isinya satu perintah SCREEN: tampilkan
     halaman 1. Layar petunjuknya sudah tergambar sejak awal permainan. */
  T({ baris: 1110, bagian: [
      function (m) { m.jebakan(1, false); m.locate(null, null, 0); },
      function (m) { m.layar(0, 1, 0, 1); }
    ] });
  T({ baris: 1120, jalan: function (m) {
      m.v['A$'] = m.inkey();
      if (m.v['A$'] === '') m.lompat(1120); else m.lompat(1090);
    } });

  /* --- 1130-1290: satu perintah ------------------------------------------- */
  T({ baris: 1130, bagian: [
      function (m) { m.v.FLAG = 0; },
      function (m) { m.gosub(1800); },
      function (m) { if (m.v.FLAG === 1) m.lompat(300); }
    ] });
  T({ baris: 1140, jalan: function (m) {
      m.locate(12, 59); m.cetak('__  '); m.locate(12, 59);
    } });
  /* 1150 jam berjalan DI DALAM gelung penantian tombol: selama tidak ada yang
     ditekan, baris 1 kolom 71 diperbarui terus. Jam yang berdetak tanpa satu
     pun jebakan waktu. */
  T({ baris: 1150, jalan: function (m) {
      m.v['K$'] = m.inkey();
      if (m.v['K$'] === '') {
        m.locate(1, 71); m.cetak('00:00:00'); m.locate(12, 59); m.lompat(1150);
      } else m.cetak(m.v['K$']);
    } });
  T({ baris: 1160, jalan: function (m) {
      if (m.v['K$'] === 'N' || m.v['K$'] === 'n') m.lompat(1220);
    } });
  T({ baris: 1170, jalan: function (m) {
      if (m.v['K$'] === 'P' || m.v['K$'] === 'p') m.lompat(1300);
    } });
  T({ baris: 1180, jalan: function (m) {
      if (m.v['K$'] >= '1' && m.v['K$'] <= '7') m.lompat(1860);
    } });
  T({ baris: 1190, jalan: function (m) {
      if (m.v['K$'] === 'Q' || m.v['K$'] === 'q') { m.v.FLAG = 0; m.lompat(300); }
    } });
  T({ baris: 1200, jalan: function (m) {
      if (m.v['K$'] === 'C' || m.v['K$'] === 'c') m.lompat(2610);
    } });
  T({ baris: 1210, jalan: function (m) { m.lompat(1140); } });

  /* --- 1220-1280: kartu berikutnya ---------------------------------------- */
  T({ baris: 1220, jalan: function (m) {
      if (m.v.DECKPTR + 3 > m.v.ENDDECK) m.v.DECKPTR = 28;
    } });
  T({ baris: 1230, jalan: function (m) { m.v.X = m.v.ENDDECK - 28; } });
  T({ baris: 1240, jalan: function (m) {
      if (m.v.X <= 3) m.v.DECKPTR = m.v.ENDDECK;
      else m.v.DECKPTR = m.v.DECKPTR + 3;
    } });
  T({ baris: 1250, jalan: function (m) { m.locate(10, 59); } });
  T({ baris: 1260, bagian: [
      function (m) { m.v['C$'] = m.v['DECK$()'][m.v.DECKPTR]; m.gosub(2840); },
      function (m) {
        m.cetak(m.v['DECK$()'][m.v.DECKPTR]); m.barisBaru(); m.warna(7, 1);
      }
    ] });
  T({ baris: 1270, jalan: function (m) {
      m.locate(11, 72); m.cetak(bas(m.v.DECKPTR - 28) + '  ');
    } });
  T({ baris: 1280, jalan: function (m) { m.lompat(1140); } });
  T({ baris: 1290, jalan: function (m) {
      m.v['K$'] = m.inkey();
      if (m.v['K$'] === '') m.lompat(1290);
      else { m.cetak(m.v['K$']); m.kembali(); }
    } });

  /* --- 1300-1510: kartu buangan dipindahkan -------------------------------- */
  T({ baris: 1300, jalan: function (m) { m.gosub(1290); } });
  T({ baris: 1310, jalan: function (m) {
      var k = m.v['K$'];
      if ((k === 't' || k === 'T') || (k >= '1' && k <= '7')) m.lompat(1320);
      else m.lompat(1140);
    } });
  T({ baris: 1320, jalan: function (m) { m.v['W$'] = m.v['DECK$()'][m.v.DECKPTR]; } });
  /* 1330 pangkat diambil dari aksara KEDUA, lambang dari aksara ketiga. Kartu
     sepuluh berpangkat "0" — dan baris 1620/1630 memakai kenyataan itu. */
  T({ baris: 1330, jalan: function (m) {
      m.v['SUIT$'] = m.v['W$'].charAt(2); m.v['SIZE$'] = m.v['W$'].charAt(1);
    } });
  T({ baris: 1340, bagian: [
      function (m) {
        if (m.v['K$'] !== 'T' && m.v['K$'] !== 't') { m.lompat(1350); return; }
        m.gosub(1520);
      },
      function (m) { m.lompat(1420); }
    ] });
  T({ baris: 1350, jalan: function (m) { set(m, 'K', parseInt(m.v['K$'], 10) || 0); } });
  T({ baris: 1360, jalan: function (m) {
      m.v['W1$'] = m.v['STACK$()'][m.v.K][m.v['STACKPTR()'][m.v.K]];
    } });
  T({ baris: 1370, jalan: function (m) {
      m.v['SUITST$'] = m.v['W1$'].charAt(2);
      m.v['SIZEST$'] = m.v['W1$'].charAt(1);
    } });
  T({ baris: 1380, bagian: [
      function (m) { m.v.FLAG = 0; },
      function (m) { m.gosub(1590); },
      function (m) { if (m.v.FLAG === 0) m.lompat(1130); }
    ] });
  T({ baris: 1390, jalan: function (m) {
      m.v['STACKPTR()'][m.v.K] = m.v['STACKPTR()'][m.v.K] + 1;
    } });
  T({ baris: 1400, jalan: function (m) {
      m.v['STACK$()'][m.v.K][m.v['STACKPTR()'][m.v.K]] = m.v['W$'];
    } });
  T({ baris: 1410, bagian: [
      function (m) {
        m.locate(m.v['STACKPTR()'][m.v.K] + 3, 45 - m.v.K * 5);
        m.v['C$'] = m.v['W$']; m.gosub(2840);
      },
      function (m) { m.cetak(m.v['W$']); m.barisBaru(); m.warna(7, 1); }
    ] });
  T({ baris: 1420, bagian: [
      function (m) { m.v.DECKPTR = m.v.DECKPTR - 1; },
      function (m) { m.gosub(1460); }
    ] });
  T({ baris: 1430, bagian: [
      function (m) {
        m.locate(10, 59);
        if (m.v.DECKPTR <= 28) { m.cetak('   '); m.lompat(1440); return; }
        m.v['C$'] = m.v['DECK$()'][m.v.DECKPTR]; m.gosub(2840);
      },
      function (m) {
        m.cetak(m.v['DECK$()'][m.v.DECKPTR]); m.barisBaru(); m.warna(7, 1);
      }
    ] });
  T({ baris: 1440, jalan: function (m) {
      m.locate(11, 72); m.cetak(bas(m.v.DECKPTR - 28) + '  ');
    } });
  T({ baris: 1450, jalan: function (m) { m.lompat(1130); } });
  /* 1460-1510 kartu yang dipakai DIBUANG dari tumpukan buangan dengan
     menggeser seluruh sisanya maju satu. Larik yang menyusut, dan itulah
     kenapa ENDDECK ada. */
  T({ baris: 1460, jalan: function (m) {
      if (m.v.DECKPTR + 1 === m.v.ENDDECK) m.lompat(1500);
    } });
  T({ baris: 1470, jalan: function (m) {
      m.untuk('I', m.v.DECKPTR + 2, m.v.ENDDECK, 1, 1500);
    } });
  T({ baris: 1480, jalan: function (m) {
      m.v['DECK$()'][m.v.I - 1] = m.v['DECK$()'][m.v.I];
    } });
  T({ baris: 1490, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 1500, jalan: function (m) {
      m.v.ENDDECK = m.v.ENDDECK - 1; m.v.NC = m.v.NC - 1;
      m.locate(10, 72); m.cetak(bas(m.v.NC));
    } });
  T({ baris: 1510, jalan: function (m) { m.kembali(); } });

  /* --- 1520-1580: ke tumpukan atas ----------------------------------------- */
  T({ baris: 1520, jalan: function (m) {
      if (m.v['SUIT$'] === m.chr(5)) { m.v.N = 1; m.lompat(1560); }
    } });
  T({ baris: 1530, jalan: function (m) {
      if (m.v['SUIT$'] === m.chr(4)) { m.v.N = 2; m.lompat(1560); }
    } });
  T({ baris: 1540, jalan: function (m) {
      if (m.v['SUIT$'] === m.chr(3)) { m.v.N = 3; m.lompat(1560); }
    } });
  T({ baris: 1550, jalan: function (m) { m.v.N = 4; } });
  T({ baris: 1560, jalan: function (m) {
      m.v['SIZEST$'] = (m.v['TOP$()'][m.v.N] || '   ').charAt(1);
    } });
  T({ baris: 1570, bagian: [
      function (m) { m.v.FLAG = 0; },
      function (m) { m.gosub(1710); },
      function (m) { if (m.v.FLAG === 0) m.lompat(1130); }
    ] });
  T({ baris: 1580, bagian: [
      function (m) {
        m.v['TOP$()'][m.v.N] = m.v['W$'];
        m.locate(1, 10 + 10 * (m.v.N - 1));
        m.v['C$'] = m.v['W$']; m.gosub(2840);
      },
      function (m) {
        m.cetak(m.v['W$']); m.barisBaru(); m.warna(7, 1); m.kembali();
      }
    ] });

  /* --- 1590-1700: bolehkah ke tumpukan? -----------------------------------
     Warna diuji dengan MEMBANDINGKAN LAMBANGNYA: CHR$(3) dan CHR$(4) merah,
     CHR$(5) dan CHR$(6) hitam. Kalau keduanya sewarna, RETURN tanpa mengubah
     FLAG — dan FLAG yang tetap nol berarti "tidak boleh". Penolakan yang
     ditulis sebagai ketiadaan persetujuan. */
  T({ baris: 1590, jalan: function (m) {
      var a = m.v['SUIT$'], b = m.v['SUITST$'];
      if ((a === m.chr(3) || a === m.chr(4)) &&
          (b === m.chr(3) || b === m.chr(4))) m.kembali();
    } });
  T({ baris: 1600, jalan: function (m) {
      var a = m.v['SUIT$'], b = m.v['SUITST$'];
      if ((a === m.chr(5) || a === m.chr(6)) &&
          (b === m.chr(5) || b === m.chr(6))) m.kembali();
    } });
  T({ baris: 1610, jalan: function (m) { if (m.v['SIZE$'] > '9') m.lompat(1650); } });
  /* 1620 sepuluh berpangkat "0" karena aksara keduanya nol. Jadi "0 di bawah
     J" harus ditulis sebagai kekecualian, dan begitu juga "9 di bawah 0". */
  T({ baris: 1620, jalan: function (m) {
      if (m.v['SIZE$'] === '0' && m.v['SIZEST$'] === 'J') m.lompat(1700);
    } });
  T({ baris: 1630, jalan: function (m) {
      if (m.v['SIZE$'] === '9' && m.v['SIZEST$'] === '0') m.lompat(1700);
    } });
  T({ baris: 1640, jalan: function (m) {
      if (m.v['SIZE$'] === 'A' && m.v['SIZEST$'] === '2') m.lompat(1700);
    } });
  T({ baris: 1650, jalan: function (m) {
      if (m.v['SIZE$'] === 'J' && m.v['SIZEST$'] === 'Q') m.lompat(1700);
    } });
  T({ baris: 1660, jalan: function (m) {
      if (m.v['SIZE$'] === 'Q' && m.v['SIZEST$'] === 'K') m.lompat(1700);
    } });
  /* 1670 raja di atas tumpukan KOSONG: pangkat tumpukannya spasi. */
  T({ baris: 1670, jalan: function (m) {
      if (m.v['SIZE$'] === 'K' && m.v['SIZEST$'] === ' ') m.lompat(1700);
    } });
  /* 1680 sisanya — angka 2 sampai 9 — cukup diuji dengan selisih kode
     aksaranya. Enam kekecualian di atas ada semata-mata karena A, 0, J, Q, K
     tidak berurutan di tabel aksara. */
  T({ baris: 1680, jalan: function (m) {
      if (m.v['SIZEST$'] < 'A' &&
          m.v['SIZEST$'].charCodeAt(0) - m.v['SIZE$'].charCodeAt(0) === 1) {
        m.lompat(1700);
      }
    } });
  T({ baris: 1690, jalan: function (m) { m.kembali(); } });
  T({ baris: 1700, jalan: function (m) { m.v.FLAG = 1; m.kembali(); } });

  /* --- 1710-1790: bolehkah ke tumpukan atas? ------------------------------- */
  T({ baris: 1710, jalan: function (m) {
      if (m.v['SIZE$'] === 'A' && m.v['SIZEST$'] === ' ') m.lompat(1790);
    } });
  T({ baris: 1720, jalan: function (m) {
      if (m.v['SIZE$'] === '2' && m.v['SIZEST$'] === 'A') m.lompat(1790);
    } });
  T({ baris: 1730, jalan: function (m) {
      if (m.v['SIZE$'] === '0' && m.v['SIZEST$'] === '9') m.lompat(1790);
    } });
  T({ baris: 1740, jalan: function (m) {
      if (m.v['SIZE$'] === 'J' && m.v['SIZEST$'] === '0') m.lompat(1790);
    } });
  T({ baris: 1750, jalan: function (m) {
      if (m.v['SIZE$'] === 'Q' && m.v['SIZEST$'] === 'J') m.lompat(1790);
    } });
  T({ baris: 1760, jalan: function (m) {
      if (m.v['SIZE$'] === 'K' && m.v['SIZEST$'] === 'Q') m.lompat(1790);
    } });
  T({ baris: 1770, jalan: function (m) {
      if (m.v['SIZE$'] < 'A' &&
          m.v['SIZE$'].charCodeAt(0) - m.v['SIZEST$'].charCodeAt(0) === 1) {
        m.lompat(1790);
      }
    } });
  T({ baris: 1780, jalan: function (m) { m.kembali(); } });
  T({ baris: 1790, jalan: function (m) { m.v.FLAG = 1; m.kembali(); } });

  /* --- 1800-1850: sudah menang? -------------------------------------------- */
  rem(1800);
  T({ baris: 1810, jalan: function (m) { m.untuk('I', 1, 4, 1, 1840); } });
  T({ baris: 1820, jalan: function (m) {
      if ((m.v['TOP$()'][m.v.I] || '   ').charAt(1) !== 'K') m.kembali();
    } });
  T({ baris: 1830, jalan: function (m) { m.lanjutkan('I'); } });
  rem(1840);
  T({ baris: 1850, jalan: function (m) { m.v.FLAG = 1; m.kembali(); } });

  /* --- 1860-2220: tumpukan ke tumpukan ------------------------------------- */
  rem(1860);
  T({ baris: 1870, jalan: function (m) {
      set(m, 'STKNUM1', parseInt(m.v['K$'], 10) || 0);
    } });
  T({ baris: 1880, jalan: function (m) { m.gosub(1290); } });
  T({ baris: 1890, jalan: function (m) {
      var k = m.v['K$'];
      if ((k >= '1' && k <= '7') || k === 'T' || k === 't') m.lompat(1910);
    } });
  T({ baris: 1900, jalan: function (m) { m.lompat(1140); } });
  /* 1910/1920 DUA kartu yang berbeda diambil: kalau tujuannya tumpukan atas,
     yang dipindahkan kartu PALING ATAS; kalau tumpukan lain, kartu terbawah
     yang TERBUKA — dan seluruh deret di atasnya ikut. */
  T({ baris: 1910, jalan: function (m) {
      if (m.v['K$'] === 't' || m.v['K$'] === 'T') {
        m.v['W$'] = m.v['STACK$()'][m.v.STKNUM1][m.v['STACKPTR()'][m.v.STKNUM1]];
        m.lompat(1930);
      }
    } });
  T({ baris: 1920, jalan: function (m) {
      m.v['W$'] = m.v['STACK$()'][m.v.STKNUM1][m.v['VISIPTR()'][m.v.STKNUM1]];
    } });
  T({ baris: 1930, jalan: function (m) { m.v['SUIT$'] = m.v['W$'].charAt(2); } });
  T({ baris: 1940, jalan: function (m) { m.v['SIZE$'] = m.v['W$'].charAt(1); } });
  T({ baris: 1950, bagian: [
      function (m) {
        if (m.v['K$'] !== 'T' && m.v['K$'] !== 't') { m.lompat(1960); return; }
        m.gosub(1520);
      },
      function (m) { m.lompat(2180); }
    ] });
  T({ baris: 1960, jalan: function (m) {
      set(m, 'STKNUM2', parseInt(m.v['K$'], 10) || 0);
    } });
  T({ baris: 1970, jalan: function (m) {
      m.v['W$'] = m.v['STACK$()'][m.v.STKNUM2][m.v['STACKPTR()'][m.v.STKNUM2]];
    } });
  T({ baris: 1980, jalan: function (m) { m.v['SUITST$'] = m.v['W$'].charAt(2); } });
  T({ baris: 1990, jalan: function (m) { m.v['SIZEST$'] = m.v['W$'].charAt(1); } });
  T({ baris: 2000, bagian: [
      function (m) { m.v.FLAG = 0; },
      function (m) { m.gosub(1590); }
    ] });
  T({ baris: 2010, jalan: function (m) { if (m.v.FLAG === 0) m.lompat(1140); } });
  T({ baris: 2020, jalan: function (m) {
      if (m.v['VISIPTR()'][m.v.STKNUM1] === 0) m.v['VISIPTR()'][m.v.STKNUM1] = 1;
    } });
  T({ baris: 2030, jalan: function (m) {
      m.untuk('I', m.v['VISIPTR()'][m.v.STKNUM1],
              m.v['STACKPTR()'][m.v.STKNUM1], 1, 2110);
    } });
  T({ baris: 2040, jalan: function (m) {
      m.v['STACKPTR()'][m.v.STKNUM2] = m.v['STACKPTR()'][m.v.STKNUM2] + 1;
    } });
  T({ baris: 2050, jalan: function (m) {
      m.locate(m.v.I + 3, 45 - m.v.STKNUM1 * 5); m.cetak('   ');
    } });
  T({ baris: 2060, jalan: function (m) {
      m.v['STACK$()'][m.v.STKNUM2][m.v['STACKPTR()'][m.v.STKNUM2]] =
        m.v['STACK$()'][m.v.STKNUM1][m.v.I];
    } });
  T({ baris: 2070, jalan: function (m) {
      m.locate(m.v['STACKPTR()'][m.v.STKNUM2] + 3, 45 - m.v.STKNUM2 * 5);
    } });
  T({ baris: 2080, bagian: [
      function (m) {
        m.v['C$'] = m.v['STACK$()'][m.v.STKNUM2][m.v['STACKPTR()'][m.v.STKNUM2]];
        m.gosub(2840);
      }
    ] });
  T({ baris: 2090, jalan: function (m) {
      m.cetak(m.v['STACK$()'][m.v.STKNUM2][m.v['STACKPTR()'][m.v.STKNUM2]]);
      m.warna(7, 1);
    } });
  T({ baris: 2100, jalan: function (m) { m.lanjutkan('I'); } });
  /* 2110 kartu yang tadi menutupi jadi terbuka: VISIPTR mundur satu. */
  T({ baris: 2110, jalan: function (m) {
      if (m.v['VISIPTR()'][m.v.STKNUM1] > 0) {
        m.v['VISIPTR()'][m.v.STKNUM1] = m.v['VISIPTR()'][m.v.STKNUM1] - 1;
      }
    } });
  T({ baris: 2120, jalan: function (m) {
      m.v['STACKPTR()'][m.v.STKNUM1] = m.v['VISIPTR()'][m.v.STKNUM1];
    } });
  T({ baris: 2130, jalan: function (m) {
      if (m.v['STACKPTR()'][m.v.STKNUM1] < 1) m.lompat(1130);
    } });
  T({ baris: 2140, jalan: function (m) {
      m.locate(m.v['STACKPTR()'][m.v.STKNUM1] + 3, 45 - m.v.STKNUM1 * 5);
    } });
  T({ baris: 2150, bagian: [
      function (m) {
        m.v['C$'] = m.v['STACK$()'][m.v.STKNUM1][m.v['STACKPTR()'][m.v.STKNUM1]];
        m.gosub(2840);
      }
    ] });
  T({ baris: 2160, jalan: function (m) {
      m.cetak(m.v['STACK$()'][m.v.STKNUM1][m.v['STACKPTR()'][m.v.STKNUM1]]);
      m.warna(7, 1);
    } });
  T({ baris: 2170, jalan: function (m) { m.lompat(1130); } });
  T({ baris: 2180, jalan: function (m) {
      m.locate(m.v['STACKPTR()'][m.v.STKNUM1] + 3, 45 - m.v.STKNUM1 * 5);
    } });
  T({ baris: 2190, jalan: function (m) { m.cetak('   '); } });
  T({ baris: 2200, jalan: function (m) {
      if (m.v['STACKPTR()'][m.v.STKNUM1] === m.v['VISIPTR()'][m.v.STKNUM1]) {
        m.lompat(2110);
      }
    } });
  T({ baris: 2210, jalan: function (m) {
      m.v['STACKPTR()'][m.v.STKNUM1] = m.v['STACKPTR()'][m.v.STKNUM1] - 1;
    } });
  T({ baris: 2220, jalan: function (m) { m.lompat(1130); } });

  /* --- 2230-2460: membuka semua kartu -------------------------------------- */
  rem(2230);
  T({ baris: 2240, jalan: function (m) { m.warna(2); m.v.SEEN = 0; } });
  T({ baris: 2250, bagian: [
      function (m) {
        m.locate(24, 24); m.cetak('Would you like to see the cards? ');
      },
      function (m) { m.gosub(2720); }
    ] });
  T({ baris: 2260, jalan: function (m) {
      m.v['A$'] = m.inkey(); if (m.v['A$'] === '') m.lompat(2260);
    } });
  T({ baris: 2270, jalan: function (m) {
      if (m.v['A$'] === m.chr(27)) {
        m.v.ABORT = -1; m.locate(24, 24); m.cetak(new Array(41).join(' '));
        m.warna(7); m.kembali();
      } else m.v.ABORT = 0;
    } });
  T({ baris: 2280, jalan: function (m) {
      var a = m.v['A$'];
      if (a !== 'y' && a !== 'Y' && a !== 'N' && a !== 'n') m.lompat(2260);
    } });
  T({ baris: 2290, jalan: function (m) {
      if (m.v['A$'] === 'N' || m.v['A$'] === 'n') m.lompat(2460);
    } });
  T({ baris: 2300, jalan: function (m) {
      m.v.SEEN = -1; m.locate(24, 24); m.cetak(new Array(37).join(' '));
    } });
  T({ baris: 2310, jalan: function (m) { m.untuk('I', 7, 1, -1, 2380); } });
  T({ baris: 2320, jalan: function (m) { m.v.X = 1; } });
  T({ baris: 2330, jalan: function (m) {
      if (!(m.v['VISIPTR()'][m.v.I] > m.v.X)) m.lompat(2370);
    } });
  T({ baris: 2340, jalan: function (m) {
      m.locate(m.v.X + 3, 45 - m.v.I * 5);
    } });
  T({ baris: 2350, jalan: function (m) {
      m.cetak(m.v['STACK$()'][m.v.I][m.v.X]); m.v.X = m.v.X + 1;
    } });
  T({ baris: 2360, jalan: function (m) { m.lompat(2330); } });
  T({ baris: 2370, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 2380, jalan: function (m) { m.locate(18, 50); m.cetak('Pile: '); } });
  T({ baris: 2390, jalan: function (m) { m.v.X = 0; m.v.RR = 18; } });
  T({ baris: 2400, jalan: function (m) { m.untuk('I', 29, m.v.ENDDECK, 1, 2450); } });
  T({ baris: 2410, jalan: function (m) {
      if (m.v.X + 56 > 76) { m.v.RR = m.v.RR + 1; m.v.X = 0; }
    } });
  T({ baris: 2420, jalan: function (m) { m.locate(m.v.RR, m.v.X + 56); } });
  T({ baris: 2430, jalan: function (m) {
      if (m.v['DECK$()'][m.v.I] === '   ') m.lompat(2460);
      else { m.cetak(m.v['DECK$()'][m.v.I]); m.v.X = m.v.X + 4; }
    } });
  T({ baris: 2440, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 2450, jalan: function (m) { m.warna(7); } });
  T({ baris: 2460, jalan: function (m) { m.kembali(); } });

  /* --- 2470-2580: main lagi? ----------------------------------------------
     2470 TIDAK PERNAH DIJALANKAN: baris 2460 RETURN, dan pemanggil masuk di
     2480. Satu baris yang berdiri di antara dua alur dan tidak dimiliki
     keduanya. */
  T({ baris: 2470, jalan: function (m) { m.warna(2); } });
  T({ baris: 2480, jalan: function (m) {
      if (m.v['SCR.WIDTH'] === 40) {
        m.v['SCR.WIDTH'] = 80; m.locate(24, 15); m.cetak('Play Again?');
        m.lompat(2500);
      } else m.locate(24, 24);
    } });
  T({ baris: 2490, jalan: function (m) {
      m.locate(24, 24);
      m.cetak('     Do you want to play again?                     ');
    } });
  T({ baris: 2500, jalan: function (m) {
      m.v['A$'] = m.inkey(); if (m.v['A$'] === '') m.lompat(2500);
    } });
  T({ baris: 2510, jalan: function (m) { if (!m.v.WON) m.warna(7); } });
  T({ baris: 2520, jalan: function (m) {
      if (m.v['A$'] !== m.chr(27)) m.lompat(2560);
      else if (!m.v.SEEN && !m.v.WON) {
        m.v.ABORT = -1; m.locate(24, 28); m.cetak(new Array(31).join(' '));
        m.kembali();
      }
    } });
  T({ baris: 2530, jalan: function (m) { if (m.v.WON) m.lompat(2500); } });
  /* 2540 pemain yang sudah mengintip kartunya tidak boleh membatalkan lagi —
     dan diberi tahu dengan sopan yang tidak sopan. */
  T({ baris: 2540, bagian: [
      function (m) {
        m.locate(24, 17);
        m.cetak("Cheater... Shame Shame!  You've already seen the cards!");
        m.v['DT!'] = 2000;
      },
      function (m) { m.gosub(2740); }
    ] });
  T({ baris: 2550, jalan: function (m) {
      m.locate(24, 17); m.cetak(new Array(61).join(' ')); m.lompat(2480);
    } });
  T({ baris: 2560, bagian: [
      function (m) {
        if (m.v['A$'] !== 'y' && m.v['A$'] !== 'Y') { m.lompat(2570); return; }
        m.v.FLAG = 1;
        if (m.v.WON) m.gosub(3030); else m.kembali();
      },
      function (m) { m.kembali(); }
    ] });
  T({ baris: 2570, bagian: [
      function (m) {
        if (m.v['A$'] !== 'N' && m.v['A$'] !== 'n') { m.lompat(2580); return; }
        m.gosub(3030);
      },
      function (m) { m.kembali(); }
    ] });
  T({ baris: 2580, jalan: function (m) { m.lompat(2500); } });
  T({ baris: 2590, jalan: function (m) { m.gosub(2870); } });
  T({ baris: 2600, jalan: function (m) { m.kembali(); } });

  /* --- 2610-2710: mengaku menang ------------------------------------------- */
  rem(2610);
  T({ baris: 2620, jalan: function (m) { m.v.FLAG = 0; } });
  T({ baris: 2630, jalan: function (m) { if (m.v.NC > 0) m.lompat(2680); } });
  T({ baris: 2640, jalan: function (m) { m.untuk('I', 1, 7, 1, 2670); } });
  T({ baris: 2650, jalan: function (m) {
      if (m.v['VISIPTR()'][m.v.I] > 1) m.lompat(2680);
    } });
  T({ baris: 2660, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 2670, jalan: function (m) { m.v.FLAG = 1; m.lompat(300); } });
  T({ baris: 2680, jalan: function (m) {
      m.locate(14, 50); m.cetak('You Have Not Won Yet!!!'); m.barisBaru();
    } });
  T({ baris: 2690, bagian: [
      function (m) { m.v['DT!'] = 2000; },
      function (m) { m.gosub(2740); }
    ] });
  T({ baris: 2700, jalan: function (m) {
      m.locate(14, 50); m.cetak(new Array(26).join(' '));
    } });
  T({ baris: 2710, jalan: function (m) { m.lompat(1140); } });

  /* --- 2720-2830: tundaan yang membaca jam BIOS ---------------------------- */
  rem(2720);
  T({ baris: 2730, jalan: function (m) { m.v['DT!'] = 100; } });
  /* 2740 18,2 detak per detik — angka itu bukan pilihan penulisnya melainkan
     pembagi pencacah 8253 di dalam PC: 1.193.180 dibagi 65.536. */
  T({ baris: 2740, jalan: function (m) {
      m.v['DV!'] = m.v['DT!'] * 18.2 / 1000;
    } });
  T({ baris: 2750, jalan: function () { /* DEF SEG = &H40 */ } });
  T({ baris: 2760, jalan: function (m) {
      if (!(m.v['DV!'] > 0)) m.lompat(2830);
    } });
  /* 2770 `A! = O` — huruf O, bukan angka nol. Sama persis dengan ABM2A.BAS
     baris 250, dan sama-sama benar karena O tidak pernah diisi. Dan baris
     2780 mengulanginya: `FOR ID = O TO 3`. */
  T({ baris: 2770, jalan: function (m) { m.v['A!'] = m.v.O || 0; } });
  T({ baris: 2780, jalan: function (m) { m.untuk('ID', m.v.O || 0, 3, 1, 2810); } });
  /* 2790 empat bita dibaca dari alamat TERTINGGI ke terendah dan disusun jadi
     satu bilangan 32 bit dengan mengalikan 256 tiap langkah. Pencacah detak
     BIOS, dibaca tanpa satu pun fungsi. */
  T({ baris: 2790, jalan: function (m) {
      m.v['A!'] = m.v['A!'] * 256 + 0;
    } });
  T({ baris: 2800, jalan: function (m) { m.lanjutkan('ID'); } });
  T({ baris: 2810, jalan: function (m) {
      if (m.v['A!'] !== m.v['AOLD!']) {
        m.v['DV!'] = m.v['DV!'] - 1; m.v['AOLD!'] = m.v['A!'];
      }
    } });
  T({ baris: 2820, jalan: function (m) { m.lompat(2760); } });
  T({ baris: 2830, jalan: function (m) { m.kembali(); } });

  /* --- 2840-2860: warna kartu --------------------------------------------- */
  T({ baris: 2840, jalan: function (m) { m.v['C$'] = (m.v['C$'] || '').charAt(2); } });
  T({ baris: 2850, jalan: function (m) {
      if (m.v['C$'] === m.chr(3) || m.v['C$'] === m.chr(4)) m.warna(12, 7);
      else m.warna(0, 7);
    } });
  T({ baris: 2860, jalan: function (m) { m.kembali(); } });

  /* --- 2870-3030: layar kemenangan ----------------------------------------- */
  rem(2870);
  T({ baris: 2880, bagian: [
      function (m) {
        if (!m.v['NOT.READ']) { m.lompat(2890); return; }
        m.untuk('I', 1, 82, 1);
      },
      function (m) { m.v['XYARR$()'][m.v.I] = m.baca(); },
      function (m) { m.lanjutkan('I'); },
      function (m) { m.v['NOT.READ'] = 0; }
    ] });
  T({ baris: 2890, jalan: function (m) { m.layar(1); m.warna(1, 0); } });
  T({ baris: 2900, jalan: function (m) { m.untuk('I', 82, 1, -1, 3020); } });
  T({ baris: 2910, jalan: function (m) { m.untuk('J', 1, 45, 1, 2950); } });
  T({ baris: 2920, jalan: function (m) {
      m.v.X = m.acak() * 320; m.v.Y = m.acak() * 200;
      m.v.C = (m.v.C || 0) + 1; if (m.v.C === 4) m.v.C = 1;
    } });
  T({ baris: 2930, jalan: function (m) { m.pset(m.v.X, m.v.Y, m.v.C); } });
  T({ baris: 2940, jalan: function (m) { m.lanjutkan('J'); } });
  /* 2950-2970 pemilihan tanpa pengembalian: ambil satu dari sisa, lalu
     PINDAHKAN yang terakhir ke tempatnya. Kocokan yang sama persis dengan
     baris 410-450, dipakai untuk urutan MUNCULNYA bintang. */
  T({ baris: 2950, jalan: function (m) {
      set(m, 'LL', Math.floor(m.acak() * m.v.I) + 1);
    } });
  T({ baris: 2960, jalan: function (m) { m.v['XYPOS$'] = m.v['XYARR$()'][m.v.LL]; } });
  T({ baris: 2970, jalan: function (m) {
      m.v['XYARR$()'][m.v.LL] = m.v['XYARR$()'][m.v.I];
    } });
  /* 2980-2990 satu string tiga angka menyimpan DUA koordinat: angka pertama
     barisnya, dua angka terakhir kolomnya. */
  T({ baris: 2980, jalan: function (m) {
      set(m, 'Y', parseInt(m.v['XYPOS$'].charAt(0), 10) + 8);
    } });
  T({ baris: 2990, jalan: function (m) {
      set(m, 'X', parseInt(m.v['XYPOS$'].slice(-2), 10));
    } });
  T({ baris: 3000, jalan: function (m) {
      m.locate(m.v.Y, Math.max(1, m.v.X)); m.cetak('*');
    } });
  T({ baris: 3010, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 3020, jalan: function (m) {
      m.v['SCR.WIDTH'] = 40; m.v.WON = -1; m.kembali();
    } });
  T({ baris: 3030, jalan: function (m) { m.layar(0, 1); m.kembali(); } });

  /* --- 3040-3120: delapan puluh dua titik ---------------------------------- */
  var TITIK = [
    ['002', '006', '009', '010', '011', '014', '018', '023', '027', '030'],
    ['031', '032', '035', '039', '103', '105', '108', '112', '114'],
    ['118', '123', '127', '129', '133', '135', '136', '139', '204', '208'],
    ['212', '214', '218', '223', '225', '227', '229', '233', '235', '236'],
    ['237', '239', '304', '308', '312', '314', '318', '323', '325', '327'],
    ['329', '333', '335', '337', '338', '339', '404', '408', '412', '414'],
    ['418', '423', '425', '427', '429', '433', '435', '438', '439', '504'],
    ['509', '510', '511', '515', '516', '517', '524', '526', '530', '531'],
    ['532', '535', '539']
  ];
  TITIK.forEach(function (baris, i) { rem(3040 + i * 10); });
  rem(65399);

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['SOLITAIR'] = {
    nama: 'SOLITAIR',
    judul: 'Klondyke Solitaire (Jeff Littlefield, 1983-84)',
    sumber: 'SOLITAIR',
    berkas: 'run/SOLITAIR.BAS',
    tabel: tabel,
    benih: 52,

    /* Seluruh DATA berkas ini, dalam urutan berkasnya: tiga belas pangkat
       kartu (baris 560), lalu delapan puluh dua koordinat bintang (baris
       3040-3120). `RESTORE` di baris 370 mengembalikan penunjuk ke indeks 0;
       sesudah membagi kartu penunjuknya berhenti di 13, tepat di awal
       koordinat bintangnya. */
    data: [' A', ' 2', ' 3', ' 4', ' 5', ' 6', ' 7', ' 8', ' 9', '10',
           ' J', ' Q', ' K',
           '002', '006', '009', '010', '011', '014', '018', '023', '027', '030',
           '031', '032', '035', '039', '103', '105', '108', '112', '114',
           '118', '123', '127', '129', '133', '135', '136', '139', '204', '208',
           '212', '214', '218', '223', '225', '227', '229', '233', '235', '236',
           '237', '239', '304', '308', '312', '314', '318', '323', '325', '327',
           '329', '333', '335', '337', '338', '339', '404', '408', '412', '414',
           '418', '423', '425', '427', '429', '433', '435', '438', '439', '504',
           '509', '510', '511', '515', '516', '517', '524', '526', '530', '531',
           '532', '535', '539'],

    arsitektur: {
      judul: 'Alur SOLITAIR.BAS',
      simpul: [
        { id: 'ajar', baris: '880-1120', jenis: 'mulai',
          teks: ['Petunjuk digambar ke HALAMAN 1', 'sementara halaman 0 tampil'] },
        { id: 'kocok', baris: '350-630',
          teks: ['Fisher-Yates 52 kartu;', 'kartu = 2 aksara pangkat', '+ 1 aksara lambang'] },
        { id: 'meja', baris: '640-870',
          teks: ['Tujuh tumpukan, dua penunjuk', 'masing-masing: atas dan terbuka'] },
        { id: 'perintah', baris: '1130-1210', jenis: 'putusan',
          teks: ['N, P#, PT, ##, #T, C, Q'] },
        { id: 'sah', baris: '1590-1790', jenis: 'putusan',
          teks: ['Warna dari LAMBANGNYA,', 'urutan dari kode aksaranya'] },
        { id: 'pindah', baris: '2030-2170',
          teks: ['Seluruh deret terbuka ikut;', 'kartu di bawahnya terbuka'] },
        { id: 'f1', baris: '1110',
          teks: ['F1: satu SCREEN,', 'petunjuknya sudah ada'] },
        { id: 'menang', baris: '2870-3020', jenis: 'keluar',
          teks: ['82 bintang, urutan acak,', '45 piksel acak di antaranya'] }
      ],
      panah: [
        { dari: 'ajar', ke: 'kocok' },
        { dari: 'kocok', ke: 'meja' },
        { dari: 'meja', ke: 'perintah' },
        { dari: 'perintah', ke: 'sah' },
        { dari: 'sah', ke: 'pindah', label: 'boleh' },
        { dari: 'sah', ke: 'perintah', label: 'ditolak' },
        { dari: 'pindah', ke: 'perintah' },
        { dari: 'perintah', ke: 'f1', label: 'F1' },
        { dari: 'f1', ke: 'perintah' },
        { dari: 'perintah', ke: 'menang', label: 'empat raja' }
      ]
    },

    pseudokode: [
      { baris: 880, tingkat: 0, teks: 'petunjuk digambar ke <b>halaman teks lain</b> sementara meja tetap tampil' },
      { baris: 1110, tingkat: 1, teks: '&hellip;jadi F1 cuma satu <code>SCREEN</code>, dan menutupnya tak perlu gambar ulang' },
      { baris: 390, tingkat: 0, teks: 'kartu = dua aksara pangkat + satu aksara <b>lambang</b> (CHR$ 3-6)' },
      { baris: 2850, tingkat: 1, teks: '&hellip;warnanya dibaca langsung dari lambangnya' },
      { baris: 1680, tingkat: 1, teks: '&hellip;urutannya dari selisih <b>kode aksara</b>; A/10/J/Q/K jadi kekecualian' },
      { baris: 410, tingkat: 0, teks: 'kocokan Fisher-Yates yang benar &mdash; tanpa satu percobaan terbuang' },
      { baris: 2950, tingkat: 1, teks: '&hellip;dan kocokan yang sama dipakai lagi untuk urutan bintang kemenangan' },
      { baris: 2790, tingkat: 0, teks: 'tundaan membaca <b>pencacah detak BIOS</b>, bukan gelung kosong' },
      { baris: 520, tingkat: 0, teks: 'dua penunjuk per tumpukan: kartu teratas dan kartu terbuka terbawah' },
      { baris: 2470, tingkat: 0, teks: 'satu baris yang <b>tidak pernah dijalankan</b> &mdash; 2460 RETURN, 2480 pintu masuk' }
    ],

    perintahAsli: 'run\\SOLITAIR.bat',
    catatanAsli: 'Jawab Y untuk melihat petunjuknya. Di meja, tekan N untuk ' +
      'kartu berikutnya, "P3" untuk memindahkan kartu buangan ke tumpukan 3, ' +
      '"52" untuk memindahkan tumpukan 5 ke tumpukan 2, "1T" untuk ke ' +
      'tumpukan atas. F1 kapan saja untuk petunjuk &mdash; perhatikan betapa ' +
      'cepat ia muncul dan hilang.',

    penyimpangan: [
      '<b><code>SOUND</code> diam</b>, termasuk bel salah langkah yang ' +
      'disebut petunjuknya sendiri di baris 950.',

      '<b>Pencacah detak BIOS selalu memberi nilai yang sama</b>, jadi gelung ' +
      'tundaan di baris 2760-2820 tidak menunda apa pun. Di penelusur ia ' +
      'tetap berputar &mdash; dan kalau ditelusuri langkah demi langkah, ' +
      'jumlah putarannya bisa dilihat.',

      '<b><code>TIME$</code> selalu 00:00:00</b>, jadi jam di sudut kanan ' +
      'atas tidak berjalan.',

      '<b><code>LOAD"MENU",R</code> tidak bisa dijalankan.</b>',

      '<b>Tiap halaman teks di kartunya punya kursornya sendiri; penelusur ' +
      'cuma punya satu.</b> Tidak berpengaruh di sini, karena tiap halaman ' +
      'selalu memasang <code>LOCATE</code>-nya sendiri sebelum mencetak.'
    ],

    pelajaran: {
      ringkas: 'Layar petunjuk yang sudah tergambar di halaman lain sebelum ' +
        'ada yang memintanya &mdash; dan kartu yang seluruh sifatnya muat di ' +
        'tiga aksara.',
      pelajari: [
        ['Halaman kedua sebagai penyimpan layar',
         '<code>SCREEN 0,1,aktif,tampak</code> memilih halaman teks mana yang ' +
         'DITULISI dan mana yang DITAMPILKAN, dan keduanya boleh berbeda.',
         'Baris 880 memasang tulis-ke-1, tampilkan-0. Sepuluh baris berikutnya ' +
         'menggambar seluruh layar petunjuk, dan pemain tidak melihat apa pun ' +
         '&mdash; ia masih menatap mejanya.',
         'Lalu F1 memicu baris 1110, yang seluruh isinya satu perintah: ' +
         'tampilkan halaman 1. Petunjuknya muncul seketika, tanpa satu huruf ' +
         'pun dicetak.',
         'Dan yang lebih penting: saat ditutup, baris 1090 cukup menampilkan ' +
         'halaman 0 lagi. Meja permainannya masih utuh di sana, tidak pernah ' +
         'tersentuh. Tidak ada satu baris pun yang mengurus pemulihan layar ' +
         '&mdash; bandingkan dengan SUB.BAS, yang harus membaca kembali isi ' +
         'layar sebelum menimpanya.'],
        ['Tiga aksara yang membawa seluruh kartu',
         '<code>390 CARD$(I) = ZZ$+CHR$(Z)</code>',
         'Dua aksara pertama pangkatnya (<code>" A"</code>, <code>"10"</code>, ' +
         '<code>" K"</code>), aksara ketiga lambangnya &mdash; CHR$(3) sampai ' +
         'CHR$(6), yaitu hati, wajik, keriting, dan sekop di tabel aksara IBM.',
         'Aksara itu sekaligus yang <b>dicetak</b>. Tidak ada penerjemahan ' +
         'dari nomor lambang ke gambar: nomor lambangnya sudah gambarnya.',
         'Dan warnanya dibaca dari aksara yang sama (baris 2850): CHR$(3) dan ' +
         'CHR$(4) merah, sisanya hitam. Satu bandingan, dan aturan "merah ' +
         'tidak boleh di atas merah" jadi dua baris di 1590-1600.',
         'Yang layak dicatat: penyimpanan, penampilan, dan pengujian aturan ' +
         'semuanya memakai bentuk yang sama. Tidak ada titik tempat kartu ' +
         'perlu diterjemahkan.'],
        ['Dua penunjuk untuk satu tumpukan',
         '<code>STACKPTR(I)</code> menunjuk kartu paling atas; ' +
         '<code>VISIPTR(I)</code> menunjuk kartu TERBAWAH yang terbuka.',
         'Selisih keduanya adalah deret kartu yang boleh dipindahkan ' +
         'sekaligus, dan baris 2030 memakainya langsung sebagai batas gelung.',
         'Membuka kartu yang tadi tertutup jadi satu pengurangan (baris 2110). ' +
         'Menggambar tumpukan jadi satu perbandingan (baris 740): kalau ' +
         'nomor barisnya sama dengan VISIPTR, kartunya dicetak; kalau tidak, ' +
         'tiga kotak CHR$(254).',
         'Dua bilangan, dan seluruh keadaan "apa yang terlihat" ada di ' +
         'keduanya.'],
        ['Tundaan yang membaca jam, bukan menghitung putaran',
         'Baris 2720-2830 tidak berputar sekian ribu kali. Ia membaca ' +
         'pencacah detak BIOS di alamat 0040:006C dan menghitung berapa kali ' +
         'nilainya BERUBAH.',
         '<code>2740 DV!=DT!*18.2/1000</code> &mdash; 18,2 detak per detik, ' +
         'angka yang datang dari pembagi pencacah 8253 di dalam PC: 1.193.180 ' +
         'dibagi 65.536.',
         '<code>2790 A! = A!*256 + PEEK(&amp;H6F-ID)</code> menyusun empat ' +
         'bita jadi satu bilangan, dibaca dari alamat tertinggi ke terendah.',
         'Hasilnya tundaan dalam milidetik yang benar di mesin secepat apa ' +
         'pun &mdash; sesuatu yang tidak bisa dilakukan gelung ' +
         '<code>FOR I=1 TO 2000</code> yang dipakai hampir semua program lain ' +
         'di koleksi ini.'],
        ['Kocokan yang dipakai dua kali untuk dua hal',
         'Baris 410-450 mengocok kartu: ambil satu acak dari sisa, lalu ' +
         'pindahkan kartu terakhir ke tempat yang barusan kosong.',
         'Baris 2950-2970 melakukan hal yang persis sama &mdash; tapi yang ' +
         'diambil bukan kartu melainkan POSISI BINTANG di layar kemenangan.',
         'Delapan puluh dua bintang muncul satu per satu dalam urutan acak ' +
         'yang tidak pernah mengulang. Algoritma yang sama, dipakai untuk ' +
         'sesuatu yang tidak ada hubungannya dengan kartu.']
      ],
      hindari: [
        ['Huruf O sebagai nol, lagi',
         '<code>2770 A! = O</code> dan <code>2780 FOR ID = O TO 3</code>.',
         'Keduanya huruf O, bukan angka nol. Dan keduanya benar &mdash; ' +
         'karena variabel <code>O</code> tidak pernah diisi.',
         'Ini pemakaian KEDUA dari kesalahan yang sama di koleksi ini; yang ' +
         'pertama ABM2A.BAS baris 250. Dua program, dua penulis, satu kebiasaan ' +
         'mengetik yang sama &mdash; dan dua kebenaran yang bergantung pada ' +
         'ketiadaan.'],
        ['Baris yang berdiri di antara dua alur',
         '<code>2460 RETURN</code>',
         '<code>2470 COLOR 2</code>',
         '<code>2480 IF SCR.WIDTH=40 THEN &hellip;</code>',
         'Baris 2470 tidak pernah dijalankan. Alur di atasnya berakhir dengan ' +
         '<code>RETURN</code>, dan satu-satunya jalan ke 2480 adalah ' +
         '<code>GOSUB 2480</code> dari baris 320 &mdash; yang melewatinya.',
         'Jelas ia dulu bagian dari 2480, lalu dipisah. Akibatnya kecil: ' +
         'warna pertanyaan "main lagi?" jadi warna apa pun yang tertinggal ' +
         'dari sebelumnya, bukan warna 2 yang dimaksudkan.'],
        ['Sepuluh yang berpangkat nol',
         'Kartu sepuluh ditulis <code>"10"</code>, jadi aksara keduanya ' +
         '&mdash; yang dipakai sebagai pangkat &mdash; adalah <b>"0"</b>.',
         'Dan "0" berada SEBELUM "1" sampai "9" di tabel aksara. Jadi seluruh ' +
         'perbandingan urutan di baris 1610-1680 dan 1710-1770 harus menulis ' +
         'kekecualian untuk sepuluh, dua kali di tiap tempat.',
         'Enam kekecualian yang seluruhnya ada karena satu keputusan ' +
         'penyimpanan: memakai aksara kedua sebagai pangkat, alih-alih ' +
         'menyimpan nomor pangkat tersendiri.',
         'Keputusan itu membeli sesuatu &mdash; kartu bisa dicetak apa adanya ' +
         '&mdash; dan yang dibayar tersebar di dua puluh baris di tempat ' +
         'lain.'],
        ['Tiga kali dua puluh empat',
         '<code>1220 IF DECKPTR+3>ENDDECK THEN DECKPTR=28</code>',
         '<code>1240 IF X &lt;=3 THEN DECKPTR=ENDDECK ELSE DECKPTR=DECKPTR+3</code>',
         'Kartu buangan dibuka tiga-tiga, dan penunjuknya melompat tiga. Tapi ' +
         '<code>ENDDECK</code> menyusut tiap kali sebuah kartu dipakai, jadi ' +
         'kelipatan tiganya bergeser.',
         'Akibatnya beberapa kartu di tumpukan buangan jadi tidak pernah ' +
         'terlihat pada putaran tertentu &mdash; bukan hilang, tapi baru ' +
         'muncul sesudah putaran berikutnya menggeser kelipatannya.',
         'Solitaire sungguhan punya persoalan yang sama, jadi tidak ada yang ' +
         'pernah menyebutnya cacat. Tapi di sini ia akibat dari aritmetika ' +
         'penunjuk, bukan dari aturan permainan.']
      ]
    },

    penjelasan: [
      { judul: 'Layar yang sudah ada sebelum diminta',
        isi: [
          'Kartu CGA punya memori teks untuk beberapa layar penuh sekaligus ' +
          '&mdash; delapan halaman di 40 kolom, empat di 80. Yang ditampilkan ' +
          'ke layar cuma satu, dan BASIC memilihnya lewat dua argumen ' +
          'terakhir <code>SCREEN</code>:',
          '<code>SCREEN mode, warna, aktif, tampak</code>',
          '<code>aktif</code> halaman yang menerima <code>PRINT</code>. ' +
          '<code>tampak</code> halaman yang terlihat. Keduanya boleh berbeda, ' +
          'dan di situlah seluruh triknya.',
          'Program ini memakainya tiga kali, dan ketiganya berbeda:',
          '<code>180 SCREEN 0,1,0,0</code> &nbsp; tulis 0, tampil 0 &mdash; ' +
          'keadaan biasa',
          '<code>880 SCREEN 0,1,1,0</code> &nbsp; tulis 1, tampil 0 &mdash; ' +
          '<b>menggambar diam-diam</b>',
          '<code>1110 SCREEN 0,1,0,1</code> &nbsp; tulis 0, tampil 1 &mdash; ' +
          '<b>menampilkan yang tadi digambar</b>',
          'Baris 880 sampai 1070 mencetak seluruh layar petunjuk: judul, enam ' +
          'aturan, sepuluh perintah, dua puluh dua baris teks berwarna. ' +
          'Semuanya masuk ke halaman 1, dan pemain tidak melihat apa-apa ' +
          'terjadi.',
          'Lalu baris 1110 &mdash; penangan F1 &mdash; berbunyi:',
          '<code>1110 KEY (1) OFF : LOCATE ,,0: SCREEN 0,1,0,1</code>',
          'Matikan jebakannya sendiri, sembunyikan kursor, tampilkan halaman ' +
          '1. Itu saja. Layar petunjuknya muncul dalam satu detak layar.',
          'Dan penutupnya, baris 1090: <code>SCREEN 0,1,0,0</code>. Meja ' +
          'permainannya kembali &mdash; utuh, karena ia tidak pernah ' +
          'tersentuh.',
          'Bandingkan dengan cara yang biasa dipakai program lain di koleksi ' +
          'ini: SUB.BAS membaca kembali isi layar sebelum menimpanya, lalu ' +
          'menuliskannya kembali sesudahnya. DRAW.BAS menyimpan seluruh RAM ' +
          'layar ke larik. Keduanya butuh kode, keduanya bisa salah, dan ' +
          'keduanya menghabiskan waktu.',
          'Di sini tidak ada apa-apa yang perlu disimpan, karena tidak ada ' +
          'apa-apa yang ditimpa.',
          'Diukur di penelusur: menekan F1 dari meja permainan membutuhkan ' +
          '<b>dua langkah</b> &mdash; baris 1110 saja &mdash; dan sesudahnya ' +
          'halaman 0 masih memegang meja lengkap dengan ketujuh tumpukannya ' +
          'sementara halaman 1 menampilkan seluruh layar petunjuk. Tidak ' +
          'satu sel pun ditulis ulang.'
        ] },
      { judul: 'Delapan puluh dua titik yang mengeja YOU WON',
        isi: [
          'Di ujung berkas ada sembilan baris DATA berisi 82 string tiga ' +
          'angka:',
          '<code>3040  DATA "002","006","009","010","011","014","018",&hellip;</code>',
          'Dan baris 2980-3000 memakainya:',
          '<code>2980 Y = VAL(LEFT$(XYPOS$,1))+8</code>',
          '<code>2990 X= VAL(RIGHT$(XYPOS$,2))</code>',
          '<code>3000 LOCATE Y,X:PRINT "*";</code>',
          'Angka pertama barisnya (nol sampai lima, ditambah delapan jadi 8 ' +
          'sampai 13), dua angka terakhir kolomnya (2 sampai 39). Satu string ' +
          'tiga aksara membawa dua koordinat.',
          'Digambar seluruhnya, kedelapan puluh dua bintang itu membentuk:',
          '<code>  *   *  ***  *   *    *   *  ***  *   *</code>',
          '<code>   * *  *   * *   *    *   * *   * **  *</code>',
          '<code>    *   *   * *   *    * * * *   * *** *</code>',
          '<code>    *   *   * *   *    * * * *   * * ***</code>',
          '<code>    *   *   * *   *    * * * *   * *  **</code>',
          '<code>    *    ***   ***      * *   ***  *   *</code>',
          'YOU WON.',
          'Tapi mereka tidak muncul sekaligus. Baris 2900-3010 mengambilnya ' +
          'satu per satu dalam urutan ACAK &mdash; dengan kocokan yang persis ' +
          'sama dengan yang dipakai untuk kartu di baris 410-450:',
          '<code>2950 LL = INT(RND(1)*I)+1</code>',
          '<code>2960 XYPOS$=XYARR$(LL)</code>',
          '<code>2970 XYARR$(LL)=XYARR$(I)</code>',
          'Ambil satu dari sisa, pindahkan yang terakhir ke tempatnya, ' +
          'perkecil sisanya. Tidak ada bintang yang muncul dua kali, dan ' +
          'tidak ada percobaan yang terbuang.',
          'Dan di antara tiap bintang, baris 2910-2940 menaburkan 45 piksel ' +
          'berwarna acak ke seluruh layar. Jadi hurufnya tersusun perlahan di ' +
          'tengah hujan warna &mdash; tiga ribu enam ratus piksel acak, dan ' +
          'delapan puluh dua yang tidak acak.',
          'Seluruh kembang api itu: sembilan baris DATA, dua puluh baris ' +
          'kode, dan sebuah kocokan yang sudah ada di program untuk keperluan ' +
          'lain.'
        ] }
    ]
  };
})(window);
