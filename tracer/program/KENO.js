/* ===========================================================================
   KENO.js — porting minimalis KENO.BAS sebagai tabel baris.

   Seratus tiga puluh tujuh baris, Steve Schlich, September 1984. Papan 80
   angka, pemain memilih 1-11 di antaranya, lalu komputer mengundi 20 angka
   dan mewarnai yang cocok.

   Dua hal yang layak ditelusuri, dan keduanya soal NAMA.

   (1) `ROW()` MENYIMPAN KOLOM, DAN `COL()` MENYIMPAN BARIS.

       840 LOCATE COL(C1),ROW(C1)

       `LOCATE` menerima (baris, kolom). Jadi larik bernama `COL` dipakai
       sebagai baris dan `ROW` sebagai kolom — tertukar, di seluruh berkas,
       konsisten. Programnya benar; namanya yang berbohong.

   (2) DELAPAN BELAS GELUNG UNTUK SATU RUMUS. Baris 120-290 mengisi kedua
       larik itu dengan delapan belas gelung yang hampir identik. Rumusnya
       ada — kolom = 16 + 5*((n-1) MOD 10) — kecuali di satu tempat: baris
       judul di tengah papan membuat barisnya melompat dari 8 ke 12. Satu
       ketidakteraturan, dan seluruh rumus ditulis panjang.

   Dan satu janji yang tidak ditepati: petunjuk di baris 9050 menjanjikan
   PEMBAYARAN menurut perbandingan spot dipilih dan spot kena. Tidak ada satu
   baris pun di program ini yang menghitung pembayaran. Yang dicetak cuma
   "Spots matched: n".

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Gelung tunda `FOR J=1 TO 400:NEXT` habis seketika, jadi angka undiannya
     muncul sekaligus. Pakai penggeser laju di atas layar.
   - `COLOR 16,5` memakai atribut KEDIP (16 = 0 + kedip). Konsol penelusur
     tidak berkedip, jadi angka yang cocok tampil hitam di atas ungu tanpa
     kedipan.
   - `RANDOMIZE T` memasang benih tetap di penelusur.
   - `LOAD"MENU",R` diperlakukan sama seperti `RUN "MENU"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var PETA = { '║': 186, '═': 205, '╔': 201, '╗': 187, '╚': 200, '╝': 188,
               '╠': 204, '╣': 185, '╦': 203, '╩': 202, '╬': 206 };
  function keBita(s) {
    var k = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      k += PETA[ch] !== undefined ? String.fromCharCode(PETA[ch]) : ch;
    }
    return k;
  }
  function basic(n) { return ' ' + n + ' '; }

  /* 120-290: delapan belas gelung yang isinya satu rumus dengan satu
     ketidakteraturan. Ditulis sebagai pembantu supaya tabelnya tetap
     satu-entri-per-baris. */
  function isiRow(nomor, awal, akhir, nilai) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.C1 = awal; m.v.C1 <= akhir; m.v.C1 += 10) {
        m.v['ROW()'][m.v.C1] = nilai;
      }
    } };
  }
  function isiCol(nomor, awal, akhir, nilai) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.C1 = awal; m.v.C1 <= akhir; m.v.C1++) {
        m.v['COL()'][m.v.C1] = nilai;
      }
    } };
  }
  function papan(nomor, isi, ekor) {
    return { baris: nomor, jalan: function (m) {
      m.tab(15); m.cetak(keBita(isi) + (ekor || '')); m.barisBaru();
    } };
  }
  function cet(nomor, isi) {
    return { baris: nomor, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }

  var tabel = [

    { baris: 10, jalan: function () { } },
    { baris: 20, jalan: function (m) { m.v.GAME = 1; } },
    { baris: 30, jalan: function () { } },
    { baris: 40, jalan: function () { } },
    { baris: 50, jalan: function (m) { m.cls(); } },
    { baris: 55, jalan: function (m) {
        m.cls(); m.cetak('Do you want instructions (Y/N)?');
      } },
    { baris: 56, jalan: function (m) {
        m.v['B$'] = m.inkey();
        if (m.v['B$'] === '') m.lompat(56);
      } },
    { baris: 57, jalan: function (m) {
        if (m.v['B$'] === 'Y' || m.v['B$'] === 'y') m.lompat(9000);
      } },
    { baris: 60, jalan: function (m) { m.cls(); m.dim('ROW()', 100); } },
    { baris: 70, jalan: function (m) { m.dim('COL()', 100); } },
    { baris: 80, jalan: function (m) { m.dim('CHOSEN()', 100); } },
    { baris: 90, jalan: function (m) { m.dim('PICKED()', 100); } },
    { baris: 100, jalan: function (m) { m.dim('PICK()', 100); } },
    /* 105 `GAME=1` untuk kedua kalinya — baris 20 sudah melakukannya. */
    { baris: 105, jalan: function (m) { m.v.GAME = 1; } },
    { baris: 110, jalan: function (m) { m.warna(6, 0); } },

    /* 120-210: KOLOM tiap angka, disimpan di larik bernama ROW(). */
    isiRow(120, 1, 71, 16), isiRow(130, 2, 72, 21), isiRow(140, 3, 73, 26),
    isiRow(150, 4, 74, 31), isiRow(160, 5, 75, 36), isiRow(170, 6, 76, 41),
    isiRow(180, 7, 77, 46), isiRow(190, 8, 78, 51), isiRow(200, 9, 79, 56),
    isiRow(210, 10, 80, 61),
    /* 220-290: BARIS tiap angka, disimpan di larik bernama COL(). Perhatikan
       lompatan 8 -> 12 di baris 260: di antara keduanya ada baris judul. */
    isiCol(220, 1, 10, 2), isiCol(230, 11, 20, 4), isiCol(240, 21, 30, 6),
    isiCol(250, 31, 40, 8), isiCol(260, 41, 50, 12), isiCol(270, 51, 60, 14),
    isiCol(280, 61, 70, 16), isiCol(290, 71, 80, 18),

    /* --- 300-510: papan ---------------------------------------------------- */
    papan(300, '╔════╦════╦════╦════╦════╦════╦════╦════╦════╦════╗'),
    papan(310, '║ 1  ║ 2  ║ 3  ║ 4  ║ 5  ║ 6  ║ 7  ║ 8  ║ 9  ║ 10 ║', '      GAME'),
    /* 320 angka "1" ikut dicetak sebagai bagian garis pemisah. Nomor
       permainan berikutnya ditimpakan ke situ oleh baris 1082. */
    papan(320, '╠════╬════╬════╬════╬════╬════╬════╬════╬════╬════╣', '       1'),
    papan(330, '║ 11 ║ 12 ║ 13 ║ 14 ║ 15 ║ 16 ║ 17 ║ 18 ║ 19 ║ 20 ║'),
    papan(340, '╠════╬════╬════╬════╬════╬════╬════╬════╬════╬════╣'),
    papan(350, '║ 21 ║ 22 ║ 23 ║ 24 ║ 25 ║ 26 ║ 27 ║ 28 ║ 29 ║ 30 ║'),
    papan(360, '╠════╬════╬════╬════╬════╬════╬════╬════╬════╬════╣'),
    papan(370, '║ 31 ║ 32 ║ 33 ║ 34 ║ 35 ║ 36 ║ 37 ║ 38 ║ 39 ║ 40 ║'),
    papan(380, '╚════╩════╩════╩════╩════╩════╩════╩════╩════╩════╝'),
    { baris: 390, jalan: function (m) { m.warna(4, 0); } },
    papan(400, '         * * *   P C   *   K E N O   * * *         '),
    { baris: 410, jalan: function (m) { m.warna(6, 0); } },
    papan(420, '╔════╦════╦════╦════╦════╦════╦════╦════╦════╦════╗'),
    papan(430, '║ 41 ║ 42 ║ 43 ║ 44 ║ 45 ║ 46 ║ 47 ║ 48 ║ 49 ║ 50 ║'),
    papan(440, '╠════╬════╬════╬════╬════╬════╬════╬════╬════╬════╣'),
    papan(450, '║ 51 ║ 52 ║ 53 ║ 54 ║ 55 ║ 56 ║ 57 ║ 58 ║ 59 ║ 60 ║'),
    papan(460, '╠════╬════╬════╬════╬════╬════╬════╬════╬════╬════╣'),
    papan(470, '║ 61 ║ 62 ║ 63 ║ 64 ║ 65 ║ 66 ║ 67 ║ 68 ║ 69 ║ 70 ║'),
    papan(480, '╠════╬════╬════╬════╬════╬════╬════╬════╬════╬════╣'),
    papan(490, '║ 71 ║ 72 ║ 73 ║ 74 ║ 75 ║ 76 ║ 77 ║ 78 ║ 79 ║ 80 ║'),
    papan(500, '╚════╩════╩════╩════╩════╩════╩════╩════╩════╩════╝'),
    { baris: 510, jalan: function (m) {
        m.locate(25, 22); m.warna(0, 3); m.cetak(' your spot ');
        m.locate(25, 35); m.warna(0, 7); m.cetak(' drawn spot ');
        m.locate(25, 49); m.warna(16, 5); m.cetak(' a match ');
        m.warna(6, 0);
      } },

    /* --- 520-610: pemain memilih ------------------------------------------ */
    { baris: 520, jalan: function (m) { m.v.N = 0; } },
    { baris: 525, jalan: function (m) {
        m.locate(21, 5); m.cetak('                           ');
        m.locate(21, 5);
      } },
    { baris: 530, jalan: function (m) {
        m.masukan(function (s) { m.v.SPOTS = Math.round(parseFloat(s) || 0); },
                  'How many spots (1-11)? ');
      } },
    { baris: 535, jalan: function (m) {
        if (m.v.SPOTS < 1 || m.v.SPOTS > 11) m.lompat(520);
      } },
    { baris: 540, jalan: function (m) { m.untuk('D2', 1, m.v.SPOTS, 1, 620); } },
    { baris: 550, jalan: function (m) {
        m.locate(21, 5);
        m.cetak('                   Spot #' + basic(m.v.D2));
      } },
    { baris: 555, jalan: function (m) {
        m.masukan(function (s) { m.v.SPOT = Math.round(parseFloat(s) || 0); },
                  '? ');
      } },
    { baris: 560, jalan: function (m) {
        m.locate(21, 30); m.cetak('        '); m.barisBaru();
      } },
    /* 565 hanya rentangnya yang diperiksa. Memilih angka yang SAMA dua kali
       diterima tanpa keluhan — dan yang kedua tidak menambah peluang apa
       pun, karena PICK() cuma bernilai 0 atau 1. */
    { baris: 565, jalan: function (m) {
        if (m.v.SPOT < 1 || m.v.SPOT > 80) m.lompat(550);
      } },
    { baris: 570, jalan: function (m) { m.v.C1 = m.v.SPOT; } },
    { baris: 580, jalan: function (m) { m.v['PICK()'][m.v.C1] = 1; } },
    { baris: 590, jalan: function (m) { m.v['PICKED()'][m.v.C1] = 1; } },
    { baris: 600, jalan: function (m) { m.gosub(760); } },
    { baris: 610, jalan: function (m) { m.lanjutkan('D2'); } },

    /* --- 620-750: komputer mengundi dua puluh angka ------------------------ */
    { baris: 620, jalan: function () { } },
    { baris: 630, jalan: function (m) { m.v['T$'] = '00'; } },
    { baris: 640, jalan: function (m) { m.v.T = 0; } },
    /* 650 benih dipasang ulang TIAP PERMAINAN dari detik jam. Dua permainan
       dalam detik yang sama akan mengundi angka yang persis sama. */
    { baris: 650, jalan: function (m) { m.semaiCampur(m.v.T); } },
    { baris: 660, jalan: function (m) { m.untuk('D1', 1, 20, 1, 750); } },
    { baris: 670, jalan: function (m) {
        m.v.CHOICE = Math.trunc(m.acak() * 80) + 1;
      } },
    { baris: 680, jalan: function (m) {
        if (m.v['CHOSEN()'][m.v.CHOICE] !== 1) m.lompat(700);
      } },
    /* 690 SUDAH PERNAH KELUAR: pencacah gelungnya DIKURANGI, lalu lompat ke
       NEXT. Mengubah variabel FOR dari dalam gelungnya sendiri — cara lama
       melakukan pengambilan-ulang tanpa gelung tambahan. */
    { baris: 690, jalan: function (m) { m.v.D1 = m.v.D1 - 1; m.lompat(740); } },
    { baris: 700, jalan: function (m) { m.v['CHOSEN()'][m.v.CHOICE] = 1; } },
    { baris: 710, jalan: function (m) { m.v.C1 = m.v.CHOICE; } },
    { baris: 720, jalan: function (m) { m.gosub(760); } },
    { baris: 730, jalan: function (m) {
        for (m.v.J = 1; m.v.J <= 400; m.v.J++) { /* jeda antar angka */ }
      } },
    { baris: 740, jalan: function (m) { m.lanjutkan('D1'); } },
    { baris: 750, jalan: function (m) { m.lompat(880); } },

    /* --- 760-870: warnai satu petak --------------------------------------- *
       Empat kemungkinan, dan warnanya yang membedakan:
         dipilih pemain saja      -> hitam di atas cyan
         diundi komputer saja     -> hitam di atas putih
         keduanya                 -> kedip, ungu   (dan MATCHES naik)
         bukan keduanya           -> kuning di atas hitam                    */
    { baris: 760, jalan: function () { } },
    { baris: 765, jalan: function (m) {
        m.locate(21, 16); m.cetak('Drawing numbers...');
      } },
    { baris: 770, jalan: function (m) {
        if (m.v['PICKED()'][m.v.C1] === 1) m.warna(0, 3);
      } },
    { baris: 780, jalan: function (m) {
        if (m.v['CHOSEN()'][m.v.C1] !== 1) m.lompat(840);
      } },
    { baris: 790, jalan: function (m) {
        if (m.v['PICK()'][m.v.C1] !== 1) m.lompat(830);
      } },
    { baris: 800, jalan: function (m) {
        m.v.MATCHES = (m.v.MATCHES || 0) + 1;
      } },
    { baris: 810, jalan: function (m) { m.warna(16, 5); } },
    { baris: 820, jalan: function (m) { m.lompat(840); } },
    { baris: 830, jalan: function (m) { m.warna(0, 7); } },
    /* 840 di sinilah nama lariknya tertukar: LOCATE(baris, kolom), tapi yang
       diberikan COL() lalu ROW(). */
    { baris: 840, jalan: function (m) {
        m.locate(m.v['COL()'][m.v.C1], m.v['ROW()'][m.v.C1]);
      } },
    { baris: 850, jalan: function (m) { m.cetak(basic(m.v.C1)); } },
    { baris: 860, jalan: function (m) { m.warna(6, 0); } },
    { baris: 870, jalan: function (m) { m.kembali(); } },

    /* --- 880-960: hasil, lalu pilihan lanjutan ---------------------------- */
    { baris: 880, jalan: function (m) { m.locate(21, 1); m.warna(4, 0); } },
    /* 890 SATU-SATUNYA hasil yang dilaporkan: jumlah kecocokan. Petunjuk di
       baris 9050 menjanjikan pembayaran; tidak ada. */
    { baris: 890, jalan: function (m) {
        m.cetak('               Spots matched:' + basic(m.v.MATCHES || 0) +
                '       P=Play same' + basic(m.v.SPOTS) + 'spots again.');
        m.barisBaru();
      } },
    cet(900, '               N=play New spots.       Q=Quit.'),
    { baris: 910, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(910);
      } },
    { baris: 920, jalan: function (m) {
        if (m.v['A$'] === 'N' || m.v['A$'] === 'n') m.lompat(930);
        else m.lompat(940);
      } },
    { baris: 930, jalan: function (m) {
        m.v.N = 1;
        for (m.v.C1 = 1; m.v.C1 <= 80; m.v.C1++) {
          m.v['PICK()'][m.v.C1] = 0; m.v['PICKED()'][m.v.C1] = 0;
        }
        m.lompat(970);
      } },
    { baris: 940, jalan: function (m) {
        if (m.v['A$'] === 'P' || m.v['A$'] === 'p') m.lompat(970);
      } },
    { baris: 950, jalan: function (m) {
        if (m.v['A$'] === 'Q' || m.v['A$'] === 'q') m.jalankan('MENU');
      } },
    { baris: 960, jalan: function (m) { m.lompat(910); } },

    /* --- 970-1090: bersihkan papan, simpan pilihan pemain ------------------ */
    { baris: 970, jalan: function () { } },
    { baris: 980, jalan: function (m) { m.v.MATCHES = 0; } },
    { baris: 990, jalan: function (m) {
        m.locate(21, 16);
        m.cetak('                                                   ');
        m.barisBaru();
      } },
    { baris: 1000, jalan: function (m) {
        m.locate(22, 16);
        m.cetak('                                                   ');
        m.barisBaru();
      } },
    { baris: 1010, jalan: function (m) { m.untuk('C2', 1, 80, 1, 1082); } },
    { baris: 1020, jalan: function (m) { m.v['CHOSEN()'][m.v.C2] = 0; } },
    { baris: 1030, jalan: function (m) {
        if (m.v['PICK()'][m.v.C2] === 1) m.lompat(1050);
      } },
    { baris: 1040, jalan: function (m) { m.warna(6, 0); m.lompat(1060); } },
    { baris: 1050, jalan: function (m) { m.warna(0, 3); } },
    { baris: 1060, jalan: function (m) {
        m.locate(m.v['COL()'][m.v.C2], m.v['ROW()'][m.v.C2]);
      } },
    { baris: 1070, jalan: function (m) {
        m.cetak(basic(m.v.C2)); m.barisBaru();
      } },
    { baris: 1075, jalan: function (m) { m.warna(6, 0); } },
    { baris: 1080, jalan: function (m) { m.lanjutkan('C2'); } },
    { baris: 1082, jalan: function (m) {
        m.v.GAME = m.v.GAME + 1;
        m.locate(3, 72); m.cetak(String(m.v.GAME)); m.barisBaru();
      } },
    { baris: 1087, jalan: function (m) { if (m.v.N === 1) m.lompat(520); } },
    { baris: 1090, jalan: function (m) { m.lompat(630); } },
    /* 1100 tidak pernah tercapai: baris 1090 selalu melompat. */
    { baris: 1100, jalan: function (m) { m.jalankan('MENU'); } },

    /* --- 9000-9140: petunjuk ---------------------------------------------- */
    { baris: 9000, jalan: function (m) { m.cls(); m.warna(6, 0); } },
    cet(9010, "KENO has the worst odds of any casino game.  The `house' (in this case,"),
    cet(9020, 'your computer) draws 20 random numbers from 1 to 80 for each game.'),
    cet(9030, 'You try to guess ahead of time which numbers (spots) will come up.'),
    { baris: 9040, jalan: function (m) {
        m.barisBaru();
        m.cetak('You pick from 1 to 11 spots, and bet that at least some of your picks');
        m.barisBaru();
      } },
    /* 9050-9060 JANJI PEMBAYARAN. Tidak ada satu baris pun di program ini
       yang menghitungnya. */
    cet(9050, 'will come up.  Your payoff (if there is one) depends on the ratio between'),
    cet(9060, 'how many spots you picked and how many came up during the game.'),
    { baris: 9070, jalan: function (m) {
        m.barisBaru();
        m.cetak('At the end of each game, you have three options:'); m.barisBaru();
      } },
    cet(9080, 'P=Play the same spots again; N=play New spots; Q=Quit the game.'),
    cet(9090, 'Press P or N or Q to answer.'),
    { baris: 9100, jalan: function (m) {
        m.barisBaru();
        m.cetak('When picking your spots, type the number of each spot and press Return.');
        m.barisBaru();
      } },
    cet(9110, "The `house' will begin drawing numbers as soon as your last spot is picked."),
    { baris: 9120, jalan: function (m) {
        m.barisBaru();
        m.cetak('GOOD LUCK!  Press any key to begin play...');
      } },
    { baris: 9130, jalan: function (m) {
        m.v['B$'] = m.inkey();
        if (m.v['B$'] === '') m.lompat(9130);
      } },
    { baris: 9140, jalan: function (m) { m.lompat(60); } }
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['KENO'] = {
    nama: 'KENO',
    judul: 'PC Keno (Steve Schlich, 1984)',
    sumber: 'KENO',
    berkas: 'run/KENO.BAS',
    tabel: tabel,
    benih: 17,

    arsitektur: {
      judul: 'Alur KENO.BAS',
      simpul: [
        { id: 'tanya', baris: '55-57', jenis: 'putusan',
          teks: ['Mau petunjuk?', 'Y ke 9000'] },
        { id: 'tabel', baris: '120-290',
          teks: ['Delapan belas gelung', 'mengisi peta letak 80 petak'] },
        { id: 'papan', baris: '300-510',
          teks: ['Gambar papan 80 angka', 'dan keterangan warnanya'] },
        { id: 'pilih', baris: '520-610',
          teks: ['Pemain memilih', '1 sampai 11 angka'] },
        { id: 'undi', baris: '620-750',
          teks: ['Undi dua puluh angka;', 'yang berulang diambil ulang'] },
        { id: 'warna', baris: '760-870', jenis: 'subrutin',
          teks: ['Warnai satu petak;', 'yang cocok menaikkan MATCHES'] },
        { id: 'hasil', baris: '880-960', jenis: 'putusan',
          teks: ['Cetak jumlah cocok;', 'P / N / Q'] },
        { id: 'bersih', baris: '970-1090',
          teks: ['Bersihkan papan,', 'simpan pilihan pemain'] },
        { id: 'keluar', baris: '950', jenis: 'keluar',
          teks: ['Q: kembali ke menu'] }
      ],
      panah: [
        { dari: 'tanya', ke: 'tabel' },
        { dari: 'tabel', ke: 'papan' },
        { dari: 'papan', ke: 'pilih' },
        { dari: 'pilih', ke: 'warna' },
        { dari: 'pilih', ke: 'undi' },
        { dari: 'undi', ke: 'warna' },
        { dari: 'undi', ke: 'hasil' },
        { dari: 'hasil', ke: 'bersih', label: 'P atau N' },
        { dari: 'bersih', ke: 'pilih', label: 'N: pilih baru' },
        { dari: 'bersih', ke: 'undi', label: 'P: angka yang sama' },
        { dari: 'hasil', ke: 'keluar', label: 'Q' }
      ]
    },

    pseudokode: [
      { baris: 120, tingkat: 0, teks: 'isi peta letak 80 petak &mdash; <b>delapan belas gelung untuk satu rumus</b>' },
      { baris: 530, tingkat: 0, teks: 'pemain memilih 1&ndash;11 angka; hanya <b>rentangnya</b> yang diperiksa' },
      { baris: 650, tingkat: 0, teks: '<code>RANDOMIZE T</code> dari detik jam &mdash; tiap permainan disemai ulang' },
      { baris: 670, tingkat: 0, teks: 'undi 20 angka dari 1&ndash;80' },
      { baris: 690, tingkat: 1, teks: 'sudah pernah keluar? <code>D1=D1-1</code> &mdash; <b>ubah pencacah FOR-nya sendiri</b>' },
      { baris: 770, tingkat: 1, teks: 'warna petak: dipilih / diundi / <b>keduanya</b> / bukan keduanya' },
      { baris: 800, tingkat: 2, teks: 'keduanya &rarr; <code>MATCHES</code> naik satu' },
      { baris: 840, tingkat: 1, teks: '<code>LOCATE COL(C1),ROW(C1)</code> &mdash; <b>namanya tertukar</b>' },
      { baris: 890, tingkat: 0, teks: 'cetak jumlah kecocokan &mdash; dan <b>tidak ada pembayaran apa pun</b>' }
    ],

    perintahAsli: 'run\\KENO.bat',
    catatanAsli: 'Di DOSBox-X angka undiannya muncul satu per satu dengan jeda, ' +
      'dan angka yang cocok berkedip ungu.',

    penyimpangan: [
      '<b>Gelung tunda habis seketika</b> (baris 730), jadi kedua puluh angka ' +
      'undian muncul sekaligus. Pakai penggeser laju di atas layar untuk ' +
      'melihatnya satu per satu.',

      '<b><code>COLOR 16,5</code> memakai atribut KEDIP.</b> Nilai 16 adalah ' +
      '0 + bit kedip; konsol penelusur tidak berkedip, jadi angka yang cocok ' +
      'tampil hitam di atas ungu tanpa kedipan.',

      '<b><code>RANDOMIZE T</code> memasang benih tetap</b> di penelusur, ' +
      'jadi undiannya bisa diulang persis.',

      '<b><code>LOAD"MENU",R</code> diperlakukan sama seperti ' +
      '<code>RUN "MENU"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Papan 80 angka dengan peta letak yang ditulis panjang, undian ' +
        'tanpa pengulangan, dan sebuah janji pembayaran yang tidak pernah ' +
        'ditepati.',
      pelajari: [
        ['Peta letak sebagai larik',
         'Alih-alih menghitung letak tiap petak saat menggambarnya, program ' +
         'ini menyiapkan <b>dua larik berisi 80 koordinat</b> lebih dulu. ' +
         'Sesudah itu menggambar angka berapa pun cuma butuh satu baris: ' +
         '<code>LOCATE COL(n),ROW(n)</code>. Menukar perhitungan dengan ' +
         'ingatan &mdash; dan di sini menang, karena tiap petak digambar ulang ' +
         'puluhan kali per permainan.'],
        ['Mengambil ulang tanpa gelung tambahan',
         'Baris 690: <code>D1=D1-1: GOTO 740</code>. Kalau angka yang keluar ' +
         'sudah pernah muncul, pencacah gelungnya <b>dikurangi</b> lalu ' +
         'dilanjutkan ke <code>NEXT</code> &mdash; yang menaikkannya kembali. ' +
         'Hasilnya putaran itu tidak dihitung. Mengubah variabel FOR dari ' +
         'dalam gelungnya sendiri dilarang di banyak bahasa modern, dan di ' +
         'sini justru bentuk paling ringkas dari <i>rejection sampling</i>.'],
        ['Warna sebagai keterangan',
         'Empat keadaan petak dibedakan dengan warna saja: dipilih pemain ' +
         '(cyan), diundi komputer (putih), <b>keduanya</b> (ungu berkedip), ' +
         'atau bukan keduanya (kuning). Baris 510 mencetak keterangannya di ' +
         'baris 25. Tidak ada satu huruf pun yang menandai keadaan &mdash; ' +
         'seluruh papan terbaca dari warnanya.']
      ],
      hindari: [
        ['Nama larik yang tertukar',
         '<code>ROW()</code> menyimpan <b>kolom</b>, <code>COL()</code> ' +
         'menyimpan <b>baris</b>. Konsisten di seluruh berkas, jadi programnya ' +
         'benar &mdash; tapi baris 840 <code>LOCATE COL(C1),ROW(C1)</code> ' +
         'terbaca terbalik oleh siapa pun yang tahu urutan argumen ' +
         '<code>LOCATE</code>. <b>Nama yang salah lebih buruk daripada tidak ' +
         'ada nama</b>, karena ia menyesatkan dengan percaya diri.'],
        ['Janji di petunjuk yang tidak ada di kode',
         'Baris 9050&ndash;9060 menjanjikan pembayaran menurut perbandingan ' +
         'spot dipilih dan spot kena. <b>Tidak ada satu baris pun yang ' +
         'menghitungnya.</b> Yang dicetak baris 890 cuma "Spots matched: n". ' +
         'Dokumentasi yang menjanjikan lebih banyak daripada yang dikerjakan ' +
         'programnya adalah cacat yang tidak akan pernah tertangkap uji apa ' +
         'pun.'],
        ['Delapan belas gelung untuk satu rumus',
         'Baris 120&ndash;290 bisa ditulis sebagai dua baris: ' +
         '<code>ROW(n)=16+5*((n-1) MOD 10)</code> dan ' +
         '<code>COL(n)=2+2*INT((n-1)/10)</code>. Yang menghalangi cuma satu ' +
         'ketidakteraturan: baris judul di tengah papan membuat barisnya ' +
         'melompat dari 8 ke 12. <b>Satu pengecualian, dan seluruh rumus ' +
         'ditulis panjang</b> &mdash; padahal satu <code>IF</code> sudah ' +
         'cukup.'],
        ['Angka yang sama boleh dipilih dua kali',
         'Baris 565 cuma memeriksa rentang 1&ndash;80. Memilih angka yang ' +
         'sama dua kali diterima tanpa keluhan, dan yang kedua tidak menambah ' +
         'peluang apa pun karena <code>PICK()</code> cuma bernilai 0 atau 1. ' +
         'Pemain kehilangan satu pilihan tanpa diberi tahu.'],
        ['Baris yang tidak pernah tercapai, dan penugasan berulang',
         'Baris 1100 <code>LOAD"MENU",R</code> berada tepat sesudah baris ' +
         '1090 yang selalu melompat. Dan <code>GAME=1</code> ditulis dua kali, ' +
         'di baris 20 dan 105.']
      ]
    },

    penjelasan: [
      { judul: 'Nama yang berbohong',
        isi: [
          'Baris 840 adalah satu-satunya tempat kedua larik itu dipakai ' +
          'bersamaan:',
          '<code>840 LOCATE COL(C1),ROW(C1)</code>',
          '<code>LOCATE</code> di BASIC menerima <b>baris dulu, kolom ' +
          'kemudian</b>. Jadi <code>COL()</code> berisi nomor baris, dan ' +
          '<code>ROW()</code> berisi nomor kolom.',
          'Isinya pun mengkonfirmasi: <code>ROW()</code> diisi 16, 21, 26, ' +
          '&hellip; 61 &mdash; sepuluh nilai berjarak lima, yang cocok untuk ' +
          'sepuluh kolom papan selebar lima aksara. <code>COL()</code> diisi ' +
          '2, 4, 6, 8, 12, 14, 16, 18 &mdash; delapan nilai, untuk delapan ' +
          'baris papan.',
          'Programnya <b>benar</b>. Kedua larik dipakai konsisten di ketiga ' +
          'tempat yang menyentuhnya (840, 1060, dan pengisiannya). Tidak ada ' +
          'satu pun cacat yang timbul dari sini.',
          'Yang timbul cuma satu hal, dan ia tidak terlihat di keluaran ' +
          'program: <b>setiap orang yang membaca baris 840 akan berhenti dan ' +
          'membacanya dua kali.</b> Nama yang salah tidak membuat program ' +
          'gagal; ia membuat pembacanya gagal, sekali per pembaca, selamanya.',
          'Dan itu jenis harga yang tidak muncul di uji mana pun.'
        ] },
      { judul: 'Petunjuk yang menjanjikan lebih dari yang ada',
        isi: [
          'Baris 9050&ndash;9060:',
          '<i>"Your payoff (if there is one) depends on the ratio between how ' +
          'many spots you picked and how many came up during the game."</i>',
          'Kalimat itu benar untuk permainan Keno sungguhan. Di kasino, ' +
          'membayar 3 dari 5 pilihan berbeda dari 3 dari 10 &mdash; dan ' +
          'seluruh tabel pembayarannya adalah inti permainan.',
          'Di program ini, tidak ada pembayaran. Tidak ada taruhan, tidak ada ' +
          'saldo, tidak ada tabel. Yang dicetak baris 890 satu angka: berapa ' +
          'pilihan yang kena.',
          'Ada dua kemungkinan yang sama masuk akal: pembayarannya ' +
          '<b>direncanakan lalu tidak jadi ditulis</b>, atau petunjuknya ' +
          'disalin dari penjelasan Keno yang sungguhan tanpa disesuaikan.',
          'Yang bisa dipastikan cuma akibatnya. Pemakai membaca janji, ' +
          'memainkan permainannya, dan tidak mendapatkan yang dijanjikan ' +
          '&mdash; tanpa satu pun galat, tanpa satu pun tanda bahwa ada yang ' +
          'kurang.',
          '<b>Dokumentasi tidak bisa diuji.</b> Ia satu-satunya bagian sebuah ' +
          'program yang bisa berbohong tanpa pernah ketahuan oleh mesin.'
        ] }
    ]
  };
})(window);
