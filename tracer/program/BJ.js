/* ===========================================================================
   BJ.js — porting minimalis BJ.BAS sebagai tabel baris.

       2110 "COPYRIGHT (C) 1982  BY ENSIGN SOFTWARE"

   Blackjack empat dek, sampai lima pemain, dengan split, double, dan asuransi.
   Dua ratus delapan belas baris.

   TIGA HAL YANG LAYAK DITELUSURI:

   (1) ASESUAI KARTU AS, TANPA SATU PUN BENDERA.

           130 DEF FNA(Q)=Q+11*(Q>=22)
           330 IF X>1 THEN Q=Q1-11*(Q1>=11):RETURN
           350 Q=Q1-(Q<=21 AND Q1>21):IF Q>=33 THEN Q=-1

       Nilai tangan disimpan DENGAN sebelas tambahan kalau ada As yang masih
       bisa dihitung besar. `FNA` mengembalikannya jadi angka yang ditampilkan.
       Tidak ada `PUNYA.AS` di mana pun — informasinya ada di BESARNYA angka.

   (2) TATA LETAK SEBAGAI RUMUS.

           140 DEF FNT(Q)=(5-Q)*12+17

       Kolom layar pemain ke-Q. Dipakai belasan kali, dan tiap tangan hasil
       split memakai `I+D1` supaya rumus yang sama tetap berlaku untuknya.

   (3) LAYAR JUDUL DIGAMBAR DI HALAMAN YANG TIDAK TERLIHAT.

           2050 SCREEN 0,0,1,1 : CLS : SCREEN 0,0,0,1 : CLS
           2190 SCREEN 0,0,0,0

       Argumen ketiga dan keempat `SCREEN` adalah halaman TULIS dan halaman
       TAMPIL. Judulnya digambar ke halaman yang sedang tidak ditampilkan,
       lalu halamannya ditukar — pergantian tanpa kedipan, 1982.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - HALAMAN LAYAR tidak ditiru; konsol penelusur cuma punya satu halaman.
     Layar judul digambar langsung, jadi penggambarannya terlihat.
   - `KEY 1,"C"` sampai `KEY 9,"S"` memprogram tombol fungsi supaya MENGETIK
     huruf. Penelusur tidak punya tombol lunak; pakai huruf C, D, /, S.
   - `COLOR 26` dan `COLOR 31` memakai atribut kedip; konsol tidak berkedip.
   - `RANDOMIZE` memasang benih tetap.
   - Baris 2150 di berkas aslinya sudah disunting pemilik koleksi ini
     (nomor telepon dihapus, diganti "[disunting UU PDP]"). Yang ditelusuri
     berkas apa adanya.
   =========================================================================== */

(function (global) {
  'use strict';

  var PETA = { '┌': 218, '─': 196, '┐': 191, '│': 179, '└': 192, '┘': 217,
               '╔': 201, '═': 205, '╗': 187, '╚': 200, '╝': 188,
               '╠': 204, '╣': 185, '╦': 203, '╩': 202, '╬': 206, '║': 186 };
  function keBita(s) {
    var k = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      k += PETA[ch] !== undefined ? String.fromCharCode(PETA[ch]) : ch;
    }
    return k;
  }
  /* Perbandingan di BASIC bernilai -1 (benar) atau 0 (salah). Seluruh
     aritmetika kartu di berkas ini bergantung padanya. */
  function b(uji) { return uji ? -1 : 0; }
  function FNA(Q) { return Q + 11 * b(Q >= 22); }
  function FNT(Q) { return (5 - Q) * 12 + 17; }
  function basic(n) { return (n < 0 ? '-' : ' ') + Math.abs(n) + ' '; }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function judul(n, isi) {
    return { baris: n, jalan: function (m) {
      m.cetak(keBita(isi)); m.barisBaru();
    } };
  }

  var tabel = [

    { baris: 100, bagian: [
        function (m) { m.gosub(2050); },
        function (m) { m.semaiCampur(53); }
      ] },
    /* 110-120 TOMBOL LUNAK: F1 diprogram supaya MENGETIK huruf "C", F3 "D",
       dan seterusnya. Bukan jebakan — tombolnya benar-benar mengirim aksara
       itu ke INKEY$. Sisanya dikosongkan supaya tidak mengganggu. */
    { baris: 110, jalan: function () { } },
    { baris: 120, jalan: function () { } },
    /* 130 mengembalikan nilai tangan yang DITAMPILKAN: kalau simpanannya 22
       atau lebih, sebelasnya dilepas. Lihat catatan di kepala berkas. */
    { baris: 130, jalan: function () { } },
    { baris: 140, jalan: function () { } },
    { baris: 150, jalan: function (m) {
        m.dim('P()', 15, 12); m.dim('Q()', 15); m.dim('C()', 208);
        m.dim('T()', 8); m.dim('S()', 7); m.dim('B()', 15); m.dim('D()', 5);
        m.dim('Z()', 15);
      } },
    { baris: 160, jalan: function (m) { m.dim('R()', 15); m.dim('PS()', 15, 12); } },
    /* 170 empat lambang kartu: CHR$(6) sekop, (3) hati, (5) keriting,
       (4) wajik. Yang merah — 3 dan 4 — diberi warna lain di baris 1845. */
    { baris: 170, jalan: function (m) {
        m.v['CD$'] = m.chr(6) + m.chr(3) + m.chr(5) + m.chr(4);
      } },
    { baris: 180, jalan: function (m) { m.v.CD = 0; m.lompat(660); } },

    /* --- 190-280: mengambil kartu, dan mengocok ulang --------------------- */
    { baris: 190, jalan: function (m) { if (m.v.C >= m.v.CZ) m.lompat(240); } },
    /* 200-210 nomor kartu 1..208 dipecah jadi PANGKAT dan LAMBANG dengan
       sisa bagi tiga belas dan empat. Empat dek dalam satu larik datar. */
    { baris: 200, jalan: function (m) {
        var c = m.v['C()'][m.v.C];
        m.v.X = Math.trunc((c / 13 - Math.trunc(c / 13)) * 13 + 0.5) + 1;
      } },
    { baris: 210, jalan: function (m) {
        var c = m.v['C()'][m.v.C];
        m.v.XS = Math.trunc((c / 4 - Math.trunc(c / 4)) * 4 + 0.5) + 1;
      } },
    { baris: 220, jalan: function (m) {
        m.v.C = m.v.C + 1;
        if (m.v.J > 2) m.v.CD = m.v.CD + 1;
      } },
    { baris: 230, jalan: function (m) { m.kembali(); } },
    { baris: 240, bagian: [
        function (m) { m.gosub(1900); },
        function (m) { m.v.E = 3; },
        function (m) { m.gosub(1920); }
      ] },
    /* 250 KARTU PEMOTONG: pengocokan berikutnya terjadi di antara kartu
       ke-175 dan ke-199 dari 208 — acak, supaya penghitung kartu tidak bisa
       memastikan kapan dek habis. */
    { baris: 250, jalan: function (m) {
        m.v.CZ = Math.trunc(m.acak() * 25) + 175; m.v.C = 1;
      } },
    { baris: 260, jalan: function (m) {
        for (m.v.II = 1; m.v.II <= 208; m.v.II++) {
          m.v.CP = Math.trunc(m.acak() * 208) + 1;
          m.v.CM = m.v['C()'][m.v.II];
          m.v['C()'][m.v.II] = m.v['C()'][m.v.CP];
          m.v['C()'][m.v.CP] = m.v.CM;
        }
      } },
    { baris: 270, jalan: function () { } },
    { baris: 280, jalan: function (m) { m.lompat(190); } },

    /* --- 290-360: menghitung nilai tangan --------------------------------- */
    { baris: 290, jalan: function (m) {
        m.v.Q = 0;
        for (m.v.Q2 = 1; m.v.Q2 <= m.v['R()'][m.v.I]; m.v.Q2++) {
          m.v.X = m.v['P()'][m.v.I][m.v.Q2];
          m.v.XS = m.v['PS()'][m.v.I][m.v.Q2];
          hitung(m);
        }
      } },
    { baris: 300, jalan: function (m) {
        m.v['Q()'][m.v.I] = m.v.Q; m.kembali();
      } },
    { baris: 310, jalan: function (m) {
        m.v.X1 = m.v.X; if (m.v.X1 > 10) m.v.X1 = 10;
      } },
    { baris: 320, jalan: function (m) {
        m.v.Q1 = m.v.Q + m.v.X1;
        if (m.v.Q >= 11) m.lompat(350);
      } },
    { baris: 330, jalan: function (m) {
        if (m.v.X > 1) {
          m.v.Q = m.v.Q1 - 11 * b(m.v.Q1 >= 11);
          m.kembali();
        }
      } },
    { baris: 340, jalan: function (m) { m.v.Q = m.v.Q + 11; m.kembali(); } },
    /* 350 As diturunkan dari sebelas jadi satu — dan syaratnya ditulis
       sebagai ARITMETIKA, bukan IF. */
    { baris: 350, jalan: function (m) {
        m.v.Q = m.v.Q1 - b(m.v.Q <= 21 && m.v.Q1 > 21);
        if (m.v.Q >= 33) m.v.Q = -1;
      } },
    { baris: 360, jalan: function (m) { m.kembali(); } },
    { baris: 370, bagian: [
        function (m) {
          m.v['RR$'] = m.v['D$'].charAt(m.v.X - 1);
          m.v['TT$'] = m.v['CD$'].charAt(m.v.XS - 1);
        },
        function (m) { m.gosub(1820); },
        function (m) { m.kembali(); }
      ] },

    /* --- 380-510: double, hit, dan pencatatan tangan ---------------------- */
    { baris: 380, bagian: [
        function (m) { m.v.H1 = 5; },
        function (m) { m.gosub(520); },
        function (m) {
          m.v.H1 = 3;
          var ke = [430, 410][m.v.H - 1];
          if (ke) m.lompat(ke);
        }
      ] },
    { baris: 390, bagian: [
        function (m) { m.gosub(190); },
        function (m) { m.v['B()'][m.v.I] = m.v['B()'][m.v.I] * 2; },
        function (m) { m.gosub(370); },
        function (m) { m.gosub(440); },
        function (m) { if (m.v.Q > 0) m.gosub(510); }
      ] },
    { baris: 400, jalan: function (m) { m.kembali(); } },
    { baris: 410, bagian: [
        function (m) { m.gosub(510); },
        function (m) { m.kembali(); }
      ] },
    { baris: 420, jalan: function (m) { m.kembali(); } },
    { baris: 430, bagian: [
        function (m) { m.gosub(190); },
        function (m) { m.gosub(370); },
        function (m) { m.gosub(440); },
        function (m) { if (m.v.Q < 0) m.kembali(); else m.lompat(380); }
      ] },
    { baris: 440, jalan: function (m) {
        var I = m.v.I;
        m.v['R()'][I] = m.v['R()'][I] + 1;
        m.v['P()'][I][m.v['R()'][I]] = m.v.X;
        m.v['PS()'][I][m.v['R()'][I]] = m.v.XS;
        m.v.Q = m.v['Q()'][I];
        hitung(m);
        m.v['Q()'][I] = m.v.Q;
      } },
    { baris: 450, jalan: function (m) { if (m.v.Q >= 0) m.lompat(500); } },
    { baris: 460, jalan: function (m) {
        if (m.v.I !== m.v.N + 1) m.lompat(480);
      } },
    { baris: 470, bagian: [
        function (m) { m.v.E = 4; },
        function (m) { m.gosub(1920); },
        function (m) { m.kembali(); }
      ] },
    { baris: 480, jalan: function (m) {
        var I = m.v.I, D1 = m.v.D1;
        m.locate(16 + b(I > D1), FNT(I + D1 * b(I > D1) * -1));
        m.warna(12, null); m.cetak('BUST'); m.barisBaru();
      } },
    { baris: 490, jalan: function (m) { m.v['R()'][m.v.I] = 0; } },
    { baris: 500, jalan: function (m) { m.kembali(); } },
    { baris: 510, jalan: function (m) {
        var I = m.v.I, D1 = m.v.D1;
        m.locate(16 + b(I > D1), FNT(I + D1 * b(I > D1) * -1));
        m.warna(11, null);
        m.cetak('SUM' + basic(FNA(m.v['Q()'][I]))); m.barisBaru();
        m.kembali();
      } },

    /* --- 520-650: membaca pilihan pemain ---------------------------------- */
    { baris: 520, jalan: function (m) {
        m.v['H$'] = m.inkey();
        if (m.v['H$'] === '') m.lompat(520);
      } },
    /* 530 huruf kecil diubah jadi besar dengan mengurangi 32 — dan syaratnya
       `H$>"Z"`, perbandingan STRING, bukan kode. */
    { baris: 530, jalan: function (m) {
        if (m.v['H$'] > 'Z') {
          m.v['H$'] = m.chr(m.v['H$'].charCodeAt(0) - 32);
        }
      } },
    { baris: 540, jalan: function (m) {
        if (m.v['H$'].charCodeAt(0) === 27) m.rantai('MENU');
      } },
    { baris: 550, jalan: function (m) {
        var I = m.v.I, D1 = m.v.D1;
        m.warna(11, null);
        m.locate(15, FNT(I + D1 * b(I > D1) * -1));
      } },
    pilihan(560, 'C', 1, 'CARD  '), pilihan(570, 'S', 2, 'STAND '),
    pilihan(580, 'D', 3, 'DOUBLE'), pilihan(590, '/', 4, 'SPLIT '),
    { baris: 600, jalan: function (m) { m.gosub(1900); } },
    { baris: 610, jalan: function (m) {
        m.warna(11, null); m.cetak('ENTER:'); m.barisBaru();
      } },
    { baris: 620, jalan: function (m) {
        m.warna(10, null); m.cetak("'F1'  C - CARD"); m.barisBaru();
      } },
    cet(630, "'F3'  D - DOUBLE"),
    cet(640, "'F5'  / - SPLIT"),
    { baris: 650, jalan: function (m) {
        m.cetak("'F9'  S - STAND"); m.barisBaru(); m.lompat(520);
      } },

    /* --- 660-900: petunjuk ------------------------------------------------ */
    { baris: 660, jalan: function (m) { m.v['D$'] = 'A234567890JQK'; } },
    { baris: 670, jalan: function (m) { m.v['I$'] = 'C,S,D,/,'; } },
    { baris: 680, jalan: function (m) {
        for (m.v.II = 1; m.v.II <= 208; m.v.II++) m.v['C()'][m.v.II] = m.v.II;
      } },
    { baris: 690, bagian: [
        function (m) { m.v.CZ = 209; m.v.C = 209; m.v.E = 1; },
        function (m) { m.gosub(1920); },
        function (m) { m.gosub(1790); }
      ] },
    { baris: 700, jalan: function (m) {
        m.cls();
        if (m.v['H$'] !== 'Y') m.lompat(910);
      } },
    { baris: 710, jalan: function (m) {
        m.warna(11, null);
        m.cetak('This is the game of 21.  You may have up to 5 players in each game.');
        m.barisBaru();
      } },
    cet(720, 'On each deal, bets will be asked for.  You should enter a bet in'),
    { baris: 730, jalan: function (m) {
        m.cetak('multiples of $5 and not exceeding $200.'); m.barisBaru();
        m.barisBaru();
      } },
    cet(740, 'The cards will be dealt and each player plays his hand in turn.'),
    cet(750, ''),
    { baris: 760, jalan: function (m) {
        m.warna(10, null); m.cetak('Your responces may be:'); m.barisBaru();
      } },
    cet(770, "  'F1'  OR  'C'   Asking for a card"),
    cet(780, "  'F3'  OR  'D'   Doubling   {Only one card is dealt}"),
    cet(790, "  'F5'  OR  '/'   Splitting  {Only pairs and face cards}"),
    cet(800, "  'F9'  OR  'S'   Standing"),
    cet(810, ''),
    { baris: 820, jalan: function (m) {
        m.warna(11, null);
        m.cetak('To collect for a Blackjack the initial response should be Standing.');
        m.barisBaru();
      } },
    cet(830, ''),
    cet(840, "If the Dealer's card is an Ace, Insurance will be asked for and up"),
    cet(850, "to 50% of each player's bet may be lodged as Insurance."),
    cet(860, ''),
    cet(870, 'After splitting the other 3 responses are permitted on the two hands.'),
    { baris: 880, jalan: function (m) {
        m.cetak('The initial bet will be automatically doubled.'); m.barisBaru();
        m.barisBaru();
      } },
    cet(890, "TO END THE GAME AND EXIT TO THE MENU, TYPE 'END' INSTEAD OF A BET."),
    { baris: 900, bagian: [
        function (m) { m.v.E = 6; },
        function (m) { m.gosub(1920); },
        function (m) { m.gosub(1790); },
        function (m) { m.cls(); }
      ] },

    /* --- 910-1020: pemain dan taruhan ------------------------------------- */
    { baris: 910, bagian: [
        function (m) { m.v.E = 2; },
        function (m) { m.gosub(1920); },
        function (m) { m.gosub(1790); }
      ] },
    { baris: 920, jalan: function (m) {
        m.v.N = parseInt(m.v['H$'], 10) || 0;
        if (m.v.N < 1 || m.v.N > 5) m.lompat(910);
      } },
    { baris: 930, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 8; m.v.I++) m.v['T()'][m.v.I] = 0;
      } },
    /* 940 `D1` adalah nomor bandar DAN jarak antara tangan asli dan tangan
       hasil split: tangan kedua pemain I disimpan di I+D1. Satu variabel,
       dua arti yang saling menguatkan. */
    { baris: 940, jalan: function (m) { m.v.D1 = m.v.N + 1; } },
    { baris: 950, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 5; m.v.I++) {
          m.v['Z()'][m.v.I] = 0; m.v['S()'][m.v.I] = 0;
        }
      } },
    { baris: 960, bagian: [
        function (m) {
          for (m.v.I = 1; m.v.I <= 11; m.v.I++) {
            m.v['B()'][m.v.I] = 0; m.v['Q()'][m.v.I] = 0; m.v['R()'][m.v.I] = 0;
          }
        },
        function (m) { m.gosub(1900); }
      ] },
    { baris: 970, jalan: function (m) { m.untuk('I', 1, m.v.N, 1, 1030); } },
    { baris: 980, bagian: [
        function (m) {
          m.warna(11, null); m.locate(18 + m.v.I, 1);
          m.cetakFormat('Bet for _##', m.v.I);
        },
        function (m) { m.masukan('H$', '? '); },
        function (m) { m.v['Z()'][m.v.I] = parseFloat(m.v['H$']) || 0; }
      ] },
    { baris: 990, jalan: function (m) {
        if (m.v['H$'] === 'END' || m.v['H$'] === 'end') m.rantai('MENU');
      } },
    /* 1000 taruhan kosong berarti "sama seperti tadi": `D(I)` mengingat
       taruhan terakhir tiap pemain. */
    { baris: 1000, jalan: function (m) {
        if (m.v['Z()'][m.v.I] === 0) {
          m.v['Z()'][m.v.I] = m.v['D()'][m.v.I] || 0;
          m.locate(18 + m.v.I, 12);
          m.cetak(basic(m.v['Z()'][m.v.I]));
        }
      } },
    { baris: 1010, bagian: [
        function (m) {
          var z = m.v['Z()'][m.v.I];
          if (!(z < 5 || z > 200 || z / 5 !== Math.trunc(z / 5))) m.lompat(1020);
          m.v.E = 10;
        },
        function (m) { m.gosub(1920); },
        function (m) { m.lompat(980); }
      ] },
    { baris: 1020, bagian: [
        function (m) {
          m.v['D()'][m.v.I] = m.v['Z()'][m.v.I];
          m.v['B()'][m.v.I] = m.v['Z()'][m.v.I];
        },
        function (m) { m.lanjutkan('I'); },
        function (m) { m.cls(); }
      ] },

    /* --- 1030-1090: membagi kartu ----------------------------------------- */
    { baris: 1030, jalan: function (m) { m.untuk('I', 1, m.v.N, 1, 1070); } },
    { baris: 1040, jalan: function (m) {
        m.warna(10, null); m.locate(18, FNT(m.v.I));
        m.cetak('BET' + basic(m.v.I));
      } },
    { baris: 1050, jalan: function (m) {
        m.warna(14, null); m.locate(19, FNT(m.v.I));
        m.cetak('$' + basic(m.v['B()'][m.v.I]));
      } },
    { baris: 1060, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1070, bagian: [
        function (m) { m.untuk('J', 1, 2, 1, 1090); },
        function (m) { m.v.CD = m.v.J; },
        function (m) { m.untuk('I', 1, m.v.D1, 1, 1090); },
        function (m) { m.gosub(190); },
        function (m) {
          m.v.WS = FNT(m.v.I) - 12;
          m.v['P()'][m.v.I][m.v.J] = m.v.X;
        }
      ] },
    /* 1080 kartu KEDUA bandar tidak digambar — itulah kartu tertutupnya. */
    { baris: 1080, bagian: [
        function (m) { m.v['PS()'][m.v.I][m.v.J] = m.v.XS; },
        function (m) {
          if (m.v.J === 1 || m.v.I <= m.v.N) m.gosub(370);
        }
      ] },
    { baris: 1090, bagian: [
        function (m) { m.lanjutkan('I'); },
        function (m) { m.lanjutkan('J'); },
        function (m) {
          m.locate(1, FNT(m.v.N + 1) - 2); m.warna(10, null);
          m.cetak('DEALER:');
        }
      ] },

    /* --- 1100-1170: asuransi ---------------------------------------------- */
    { baris: 1100, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= m.v.D1; m.v.I++) m.v['R()'][m.v.I] = 2;
        if (m.v['P()'][m.v.D1][1] > 1) m.lompat(1180);
      } },
    { baris: 1110, bagian: [
        function (m) { m.gosub(1900); },
        function (m) { m.cetak('ANY INSURANCE? '); },
        function (m) { m.gosub(1790); },
        function (m) { if (m.v['H$'] !== 'Y') m.lompat(1180); }
      ] },
    { baris: 1120, bagian: [
        function (m) { m.gosub(1900); },
        function (m) { m.cetak('INSURANCE BET'); m.barisBaru(); }
      ] },
    { baris: 1130, jalan: function (m) { m.untuk('I', 1, m.v.N, 1, 1170); } },
    { baris: 1140, bagian: [
        function (m) {
          m.locate(18 + m.v.I, 1);
          m.cetakFormat('Insurance #', m.v.I);
        },
        function (m) { m.masukan('H$', '? '); },
        function (m) { m.v['Z()'][m.v.I] = parseFloat(m.v['H$']) || 0; }
      ] },
    { baris: 1150, bagian: [
        function (m) {
          var z = m.v['Z()'][m.v.I];
          if (!(z < 0 || z > m.v['B()'][m.v.I] / 2)) m.lompat(1160);
          m.v.E = 9;
        },
        function (m) { m.gosub(1920); },
        function (m) { m.lompat(1140); }
      ] },
    { baris: 1160, jalan: function (m) { m.lanjutkan('I'); } },
    /* 1170 bayaran asuransi: menang 2:1 kalau kartu tertutup bandar bernilai
       sepuluh, kalah taruhannya kalau tidak. Ditulis sebagai satu perkalian. */
    { baris: 1170, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= m.v.N; m.v.I++) {
          m.v['S()'][m.v.I] = m.v['Z()'][m.v.I] *
            (3 * (-b(m.v['P()'][m.v.D1][2] >= 10)) - 1);
        }
      } },

    /* --- 1180-1540: tiap pemain memainkan tangannya ----------------------- */
    { baris: 1180, bagian: [
        function (m) { m.untuk('I', 1, m.v.N, 1, 1550); },
        function (m) { m.v.CD = m.v.J - 1; }
      ] },
    { baris: 1190, bagian: [
        function (m) { m.v.E = 5; },
        function (m) { m.gosub(1920); },
        function (m) { m.warna(15, null); m.cetak(basic(m.v.I)); }
      ] },
    { baris: 1200, jalan: function (m) {
        var I = m.v.I, D1 = m.v.D1;
        m.locate(18, FNT(I + D1 * b(I > D1) * -1));
        m.warna(26, null); m.cetak('BET' + basic(I)); m.barisBaru();
        m.warna(7, null);
      } },
    { baris: 1210, bagian: [
        function (m) {
          m.v.WS = FNT(m.v.I) - 12; m.v.FL = 1; m.v.H1 = 7;
        },
        function (m) { m.gosub(520); }
      ] },
    { baris: 1220, jalan: function (m) {
        var I = m.v.I, D1 = m.v.D1;
        m.locate(18, FNT(I + D1 * b(I > D1) * -1));
        m.warna(10, null); m.cetak('BET' + basic(I)); m.barisBaru();
        var ke = [1350, 1230, 1290, 1360][m.v.H - 1];
        if (ke) m.lompat(ke);
      } },
    { baris: 1230, jalan: function (m) { m.gosub(290); } },
    { baris: 1240, jalan: function (m) {
        if (m.v['Q()'][m.v.I] !== 21) m.lompat(1280);
      } },
    { baris: 1250, jalan: function (m) {
        var I = m.v.I, D1 = m.v.D1;
        m.locate(16 + b(I > D1), FNT(I + D1 * b(I > D1) * -1));
      } },
    { baris: 1260, jalan: function (m) {
        m.warna(15, null); m.cetak('BLACKJACK'); m.barisBaru();
      } },
    /* 1270 blackjack dibayar 3:2 — dan taruhannya DINOLKAN supaya baris 1670
       tidak menghitungnya lagi sebagai menang biasa. */
    { baris: 1270, jalan: function (m) {
        m.warna(7, null);
        m.v['S()'][m.v.I] = m.v['S()'][m.v.I] + 1.5 * m.v['B()'][m.v.I];
        m.v['B()'][m.v.I] = 0;
        m.lompat(1540);
      } },
    { baris: 1280, bagian: [
        function (m) { m.gosub(510); },
        function (m) { m.lompat(1540); }
      ] },
    { baris: 1290, jalan: function (m) { m.gosub(290); } },
    { baris: 1300, jalan: function (m) {
        var a = FNA(m.v['Q()'][m.v.I]);
        if (a > 8 && a < 12) m.lompat(1340);
      } },
    { baris: 1310, jalan: function (m) {
        m.locate(18, 1); m.cetak('DOUBLE ONLY ON'); m.barisBaru();
      } },
    cet(1320, '9, 10 or 11'),
    { baris: 1330, jalan: function (m) { m.lompat(1190); } },
    { baris: 1340, bagian: [
        function (m) { m.gosub(390); },
        function (m) { m.lompat(1540); }
      ] },
    { baris: 1350, bagian: [
        function (m) { m.gosub(290); },
        function (m) { m.v.H1 = 3; },
        function (m) { m.gosub(430); },
        function (m) { m.lompat(1540); }
      ] },
    { baris: 1360, jalan: function (m) {
        if (m.v['P()'][m.v.I][1] === m.v['P()'][m.v.I][2]) m.lompat(1390);
      } },
    /* 1365 dua kartu bergambar berbeda (J dan Q, misalnya) boleh dipisah,
       karena nilainya sama-sama sepuluh. */
    { baris: 1365, jalan: function (m) {
        if (m.v['P()'][m.v.I][1] > 10 && m.v['P()'][m.v.I][2] > 10) m.lompat(1390);
      } },
    { baris: 1370, bagian: [
        function (m) { m.gosub(1900); },
        function (m) { m.locate(18, 1); m.cetak('SPLITTING'); m.barisBaru(); }
      ] },
    { baris: 1380, jalan: function (m) {
        m.cetak('NOT ALLOWED.'); m.barisBaru(); m.lompat(1190);
      } },
    { baris: 1390, jalan: function (m) { m.v.WS = (5 - m.v.I) * 12 + 2; } },
    { baris: 1400, jalan: function (m) {
        m.v['RR$'] = m.v['D$'].charAt(m.v['P()'][m.v.I][2] - 1);
      } },
    { baris: 1410, jalan: function (m) {
        m.v['TT$'] = m.v['CD$'].charAt(m.v['PS()'][m.v.I][2] - 1);
      } },
    { baris: 1420, bagian: [
        function (m) { m.v.CD = 1; },
        function (m) { m.gosub(1820); },
        function (m) {
          m.v.I1 = m.v.I + m.v.D1;
          m.v['R()'][m.v.I1] = 2;
        }
      ] },
    /* 1430 SALAH SALIN: `PS(I1,1)` diisi dari `P(I,2)` — PANGKAT kartu,
       bukan LAMBANGNYA. Seharusnya `PS(I,2)`. Akibatnya lambang kartu
       pertama tangan hasil split bisa salah. */
    { baris: 1430, jalan: function (m) {
        m.v['P()'][m.v.I1][1] = m.v['P()'][m.v.I][2];
        m.v['PS()'][m.v.I1][1] = m.v['P()'][m.v.I][2];
      } },
    { baris: 1440, bagian: [
        function (m) { m.v['B()'][m.v.I1] = m.v['B()'][m.v.I]; },
        function (m) { m.gosub(190); },
        function (m) { m.v.WS = (5 - m.v.I) * 12 + 5; }
      ] },
    { baris: 1450, bagian: [
        function (m) { m.gosub(370); },
        function (m) {
          m.v['P()'][m.v.I][2] = m.v.X;
          m.v['PS()'][m.v.I][2] = m.v.XS;
        },
        function (m) { m.gosub(290); },
        function (m) { m.gosub(190); }
      ] },
    { baris: 1460, bagian: [
        function (m) {
          m.v.CD = 2;
          m.v.WS = (6 - m.v.I1 + m.v.N) * 12 + 2;
          m.v.I = m.v.I1;
        },
        function (m) { m.gosub(370); }
      ] },
    { baris: 1470, bagian: [
        function (m) {
          m.v['P()'][m.v.I][2] = m.v.X;
          m.v['PS()'][m.v.I][2] = m.v.XS;
        },
        function (m) { m.gosub(290); },
        function (m) { m.v.I = m.v.I1 - m.v.D1; }
      ] },
    { baris: 1480, bagian: [
        function (m) { m.gosub(1900); },
        function (m) {
          m.locate(18, 1);
          m.cetak('Hand ' + basic(1 - b(m.v.I > m.v.D1)));
        }
      ] },
    { baris: 1490, jalan: function (m) {
        if (m.v.I < m.v.D1) m.v.WS = (5 - m.v.I) * 12 + 5;
      } },
    { baris: 1500, jalan: function (m) {
        if (m.v.I > m.v.D1) m.v.WS = (6 - m.v.I1 + m.v.N) * 12 + 2;
      } },
    { baris: 1510, bagian: [
        function (m) {
          m.v.CD = 2;
          if (m.v['P()'][m.v.I][1] !== 1) m.lompat(1520);
          m.v['H$'] = 'S';
        },
        function (m) { m.gosub(550); }
      ] },
    { baris: 1520, bagian: [
        function (m) { m.gosub(380); },
        function (m) {
          m.v.I = m.v.I + m.v.D1;
          if (m.v.I === m.v.I1) m.lompat(1480);
        }
      ] },
    { baris: 1530, jalan: function (m) { m.v.I = m.v.I1 - m.v.D1; } },
    { baris: 1540, jalan: function (m) { m.lanjutkan('I'); } },

    /* --- 1550-1630: giliran bandar --------------------------------------- */
    { baris: 1550, bagian: [
        function (m) { m.v.FL = 1; },
        function (m) { m.gosub(290); },
        function (m) { m.untuk('I', 1, m.v.N, 1, 1580); }
      ] },
    { baris: 1560, jalan: function (m) {
        if (m.v['R()'][m.v.I] > 0 || m.v['R()'][m.v.I + m.v.D1] > 0) {
          m.lompat(1590);
        }
      } },
    { baris: 1570, jalan: function (m) { m.lanjutkan('I'); } },
    /* 1580 SEMUA PEMAIN BUST: kartu tertutup bandar tetap dibuka, tapi ia
       tidak menarik kartu lagi. Tidak ada gunanya. */
    { baris: 1580, bagian: [
        function (m) {
          m.v.X = m.v['P()'][m.v.D1][2];
          m.v.XS = m.v['PS()'][m.v.D1][2];
          m.v.CD = 2;
          m.v.WS = FNT(m.v.N + 1) - 12;
        },
        function (m) { m.gosub(370); },
        function (m) { m.lompat(1640); }
      ] },
    { baris: 1590, bagian: [
        function (m) {
          m.v.WS = FNT(m.v.N + 1) - 12; m.v.CD = 2; m.v.I = m.v.D1;
        },
        function (m) { m.gosub(370); },
        function (m) { if (FNA(m.v['Q()'][m.v.I]) > 16) m.lompat(1620); }
      ] },
    /* 1600 bandar menarik kartu sampai 17 — aturan kasino, satu baris. */
    { baris: 1600, bagian: [
        function (m) { m.gosub(190); },
        function (m) { m.gosub(370); },
        function (m) { m.gosub(440); },
        function (m) {
          if (m.v.Q > 0 && FNA(m.v.Q) < 17) m.lompat(1600);
        }
      ] },
    /* 1610 SETENGAH ANGKA YANG MEMUTUSKAN SIAPA KALAH. Tangan bust ditandai
       -1, baik punya pemain maupun punya bandar. Kalau keduanya bust,
       perbandingan di baris 1670 akan memberi SGN(-1 - -1) = 0 — SERI, dan
       pemain yang sudah bust malah dapat uangnya kembali.
       `-(Q<0)/2` menaikkan bust BANDAR jadi -0,5. Sekarang bust pemain (-1)
       selalu lebih kecil, dan ia kalah. Satu pembagian dengan dua. */
    { baris: 1610, jalan: function (m) {
        m.v['Q()'][m.v.I] = m.v.Q - b(m.v.Q < 0) / 2;
        if (m.v.Q < 0) m.lompat(1640);
      } },
    { baris: 1620, bagian: [
        function (m) {
          if (!(m.v.Q === 21 && m.v['R()'][m.v.D1] === 2)) m.lompat(1630);
          m.v.E = 7;
        },
        function (m) { m.gosub(1920); },
        function (m) { m.lompat(1640); }
      ] },
    { baris: 1630, bagian: [
        function (m) { m.v.E = 8; },
        function (m) { m.gosub(1920); },
        function (m) {
          m.warna(15, null); m.cetak(basic(FNA(m.v.Q)));
          m.locate(1, null); m.warna(7, null); m.barisBaru();
        }
      ] },

    /* --- 1640-1780: membayar --------------------------------------------- */
    /* 1640 tiga hasil disimpan sebagai SATU string, dan dipilih dengan
       `SGN(S(I))*6+7`: kalah, seri, menang. */
    { baris: 1640, jalan: function (m) {
        m.v['Z$'] = 'LOSES PUSHES WINS ';
      } },
    { baris: 1650, bagian: [
        function (m) { m.v.SM = 0; },
        function (m) { m.untuk('I', 1, m.v.N, 1, 1770); }
      ] },
    { baris: 1660, jalan: function (m) { m.gosub(1900); } },
    { baris: 1670, jalan: function (m) {
        var I = m.v.I;
        m.v['S()'][I] = m.v['S()'][I] + m.v['B()'][I] *
          Math.sign(FNA(m.v['Q()'][I]) - FNA(m.v['Q()'][m.v.D1]));
      } },
    { baris: 1680, jalan: function (m) {
        var I = m.v.I, D1 = m.v.D1;
        m.v['S()'][I] = m.v['S()'][I] + (m.v['B()'][I + D1] || 0) *
          Math.sign(FNA(m.v['Q()'][I + D1] || 0) - FNA(m.v['Q()'][D1]));
      } },
    { baris: 1690, jalan: function (m) {
        if (m.v['S()'][m.v.I] < 0) m.warna(15, null);
      } },
    { baris: 1700, jalan: function (m) {
        if (m.v['S()'][m.v.I] > 0) m.warna(31, null);
      } },
    { baris: 1710, jalan: function (m) {
        var s = m.v['S()'][m.v.I];
        m.locate(20, FNT(m.v.I)); m.warna(14, null);
        m.cetak(m.v['Z$'].substr(Math.sign(s) * 6 + 6, 6)); m.barisBaru();
        m.warna(7, null);
      } },
    { baris: 1720, jalan: function (m) {
        if (m.v['S()'][m.v.I] === 0) {
          m.tab(FNT(m.v.I)); m.cetak('     '); m.barisBaru();
          m.lompat(1740);
        }
      } },
    { baris: 1730, jalan: function (m) {
        m.tab(FNT(m.v.I));
        m.cetak('$' + basic(Math.abs(m.v['S()'][m.v.I]))); m.barisBaru();
      } },
    { baris: 1740, jalan: function (m) {
        m.v['T()'][m.v.I] = m.v['T()'][m.v.I] + m.v['S()'][m.v.I];
        m.v.SM = m.v.SM + m.v['T()'][m.v.I];
      } },
    { baris: 1750, jalan: function (m) {
        m.warna(13, null); m.tab(FNT(m.v.I)); m.cetak('PROFIT'); m.barisBaru();
      } },
    { baris: 1760, jalan: function (m) {
        m.tab(FNT(m.v.I)); m.cetak('$');
        m.warna(m.v['T()'][m.v.I] < 0 ? 12 : 13, null);
      } },
    { baris: 1765, jalan: function (m) { m.cetak(basic(m.v['T()'][m.v.I])); } },
    /* 1770 `BANK` adalah kebalikan jumlah keuntungan semua pemain. Kalau
       pemain menang, bandar rugi. */
    { baris: 1770, bagian: [
        function (m) { m.lanjutkan('I'); },
        function (m) {
          m.locate(1, 1); m.cetak('BANK $');
          m.warna(-m.v.SM < 0 ? 12 : 13, null);
        }
      ] },
    { baris: 1775, jalan: function (m) { m.cetak(basic(-m.v.SM)); } },
    { baris: 1780, jalan: function (m) { m.lompat(950); } },

    /* --- 1790-1810: baca satu tombol, gema di layar ----------------------- */
    { baris: 1790, jalan: function (m) {
        m.v['H$'] = m.inkey();
        if (m.v['H$'] === '') m.lompat(1790);
      } },
    { baris: 1800, jalan: function (m) {
        if (m.v['H$'] > 'Z') {
          m.v['H$'] = m.chr(m.v['H$'].charCodeAt(0) - 32);
        }
      } },
    { baris: 1810, jalan: function (m) {
        m.cetak(m.v['H$']); m.locate(1, null); m.kembali();
      } },

    /* --- 1820-1890: menggambar satu kartu -------------------------------- */
    { baris: 1820, jalan: function (m) {
        m.v.CL = m.v.WS + m.v.CD * 2 + 8;
        m.locate(2 * m.v.CD, Math.max(1, m.v.CL));
      } },
    { baris: 1830, jalan: function (m) {
        m.warna(0, 7); m.cetak(keBita('┌─────┐')); m.barisBaru();
      } },
    { baris: 1840, jalan: function (m) {
        m.locate(null, Math.max(1, m.v.CL)); m.cetak(keBita('│'));
      } },
    /* 1845 hati dan wajik dicetak MERAH. Dua kode aksara, satu IF. */
    { baris: 1845, jalan: function (m) {
        if (m.v['TT$'] === m.chr(3) || m.v['TT$'] === m.chr(4)) m.warna(12, 7);
      } },
    { baris: 1846, jalan: function (m) {
        if (m.v['RR$'] === '0') {
          m.cetak(m.v['TT$']); m.warna(0, 7);
          m.cetak('  10' + keBita('│')); m.barisBaru();
          m.lompat(1860);
        }
      } },
    { baris: 1850, jalan: function (m) {
        m.cetak(m.v['TT$']); m.warna(0, 7);
        m.cetak('   ' + m.v['RR$'] + keBita('│')); m.barisBaru();
      } },
    { baris: 1860, jalan: function (m) {
        m.warna(0, 7); m.locate(null, Math.max(1, m.v.CL));
        m.cetak(keBita('│     │')); m.barisBaru();
      } },
    { baris: 1870, jalan: function (m) {
        m.locate(null, Math.max(1, m.v.CL)); m.cetak(keBita('│'));
        if (m.v['RR$'] === '0') { m.cetak('10  '); m.lompat(1875); }
      } },
    { baris: 1873, jalan: function (m) { m.cetak(m.v['RR$'] + '   '); } },
    { baris: 1875, jalan: function (m) {
        if (m.v['TT$'] === m.chr(3) || m.v['TT$'] === m.chr(4)) m.warna(12, 7);
      } },
    { baris: 1880, jalan: function (m) {
        m.cetak(m.v['TT$']); m.warna(0, 7);
        m.cetak(keBita('│')); m.barisBaru();
      } },
    { baris: 1890, jalan: function (m) {
        m.locate(null, Math.max(1, m.v.CL));
        m.cetak(keBita('└─────┘')); m.barisBaru();
        m.warna(null, 0); m.kembali();
      } },
    { baris: 1900, jalan: function (m) { m.locate(18, 1); m.v.CL = 16; } },
    { baris: 1910, jalan: function (m) {
        for (m.v.K = 1; m.v.K <= 6; m.v.K++) {
          m.cetak(m.ulang(m.v.CL, 32)); m.barisBaru();
        }
        m.locate(18, 1); m.kembali();
      } },

    /* --- 1920-2040: sepuluh pesan, satu tabel lompat ---------------------- */
    { baris: 1920, jalan: function (m) {
        m.warna(15, null); m.locate(25, 1); m.spc(79);
        m.locate(25, 20);
      } },
    { baris: 1930, jalan: function (m) {
        var ke = [1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030][m.v.E - 1];
        if (ke) m.lompat(ke);
      } },
    pesan(1940, 10, '      DO YOU WANT INSTRUCTIONS ? '),
    pesan(1950, 10, '          NUMBER OF PLAYERS ? '),
    pesan(1960, 14, '            SHUFFLING CARDS'),
    pesan(1970, null, '         THE DEALER HAS BUSTED'),
    pesan(1980, null, '   AND WHAT WILL YOU HAVE, PLAYER #'),
    pesan(1990, null, '        PRESS ANY KEY WHEN READY        '),
    pesan(2000, null, '   ! ! !  DEALER HAS BLACKJACK  ! ! !'),
    pesan(2010, null, '          TOTAL FOR DEALER IS'),
    pesan(2020, null, '   INSURANCE LIMIT IS ONE HALF OF BET'),
    pesan(2030, null, '   HOUSE BET RULES:  $5 TO $200 BY $5s'),
    { baris: 2040, jalan: function (m) { m.warna(7, null); m.kembali(); } },

    /* --- 2050-2190: layar judul di halaman tersembunyi -------------------- */
    { baris: 2050, jalan: function (m) {
        m.cls(); m.locate(6, 1, 0); m.warna(15, null);
      } },
    judul(2060, '               ╔═╦════════════════════════════════════════════╦═╗'),
    judul(2070, '               ╠═╬════════════════════════════════════════════╬═╣'),
    judul(2080, '               ║ ║                                            ║ ║'),
    { baris: 2090, jalan: function (m) {
        m.cetak(keBita('               ║ ║ ')); m.warna(11, null);
        m.cetak('                BLACKJACK               ');
        m.warna(15, null); m.cetak(keBita('   ║ ║')); m.barisBaru();
      } },
    judul(2100, '               ║ ║                                            ║ ║'),
    judul(2110, '               ║ ║   COPYRIGHT (C) 1982  BY ENSIGN SOFTWARE   ║ ║'),
    judul(2120, '               ║ ║                                            ║ ║'),
    { baris: 2130, jalan: function (m) {
        m.cetak(keBita('               ║ ║')); m.warna(12, null);
        m.cetak('          2312 N. COLE RD, SUITE E    ');
        m.warna(15, null); m.cetak(keBita('      ║ ║')); m.barisBaru();
      } },
    { baris: 2140, jalan: function (m) {
        m.cetak(keBita('               ║ ║ ')); m.warna(12, null);
        m.cetak('         BOISE, ID  83704  U.S.A.    ');
        m.warna(15, null); m.cetak(keBita('      ║ ║')); m.barisBaru();
      } },
    /* 2150 baris ini sudah disunting pemilik koleksi: nomor telepon
       digantikan penanda. Yang ditelusuri berkas apa adanya. */
    { baris: 2150, jalan: function (m) {
        m.cetak(keBita('               ║ ║')); m.warna(11, null);
        m.cetak('            [disunting UU PDP]             ');
        m.warna(15, null); m.cetak(keBita(' ║ ║')); m.barisBaru();
      } },
    judul(2160, '               ║ ║                                            ║ ║'),
    judul(2170, '               ╠═╬════════════════════════════════════════════╬═╣'),
    judul(2180, '               ╚═╩════════════════════════════════════════════╩═╝'),
    /* 2185 BACA-UBAH-TULIS atas bendera papan tombol BIOS: nilai lamanya
       dibaca dulu, lalu dua bitnya dinyalakan dengan OR. Program pertama di
       koleksi ini yang MEMBACA sebelum menulis, bukan menimpa. */
    { baris: 2185, jalan: function () { } },
    { baris: 2190, jalan: function (m) { m.kembali(); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  /* Baris 310-360 dipanggil dari dua tempat (290 dan 440) sebagai subrutin
     dalam-baris. Di sini isinya ditulis sekali. */
  function hitung(m) {
    var X1 = m.v.X; if (X1 > 10) X1 = 10;
    var Q1 = m.v.Q + X1;
    if (m.v.Q >= 11) {
      m.v.Q = Q1 - b(m.v.Q <= 21 && Q1 > 21);
      if (m.v.Q >= 33) m.v.Q = -1;
      return;
    }
    if (m.v.X > 1) { m.v.Q = Q1 - 11 * b(Q1 >= 11); return; }
    m.v.Q = m.v.Q + 11;
  }
  function pilihan(n, huruf, kode, teks) {
    return { baris: n, jalan: function (m) {
      if (m.v['H$'] === huruf) {
        m.v.H = kode; m.cetak(teks); m.barisBaru(); m.kembali();
      }
    } };
  }
  function pesan(n, warna, teks) {
    return { baris: n, jalan: function (m) {
      if (warna !== null) m.warna(warna, null);
      m.cetak(teks); m.lompat(2040);
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BJ'] = {
    nama: 'BJ',
    judul: 'Blackjack (Ensign Software, 1982)',
    sumber: 'BJ',
    berkas: 'run/BJ.BAS',
    tabel: tabel,
    benih: 59,

    arsitektur: {
      judul: 'Alur BJ.BAS',
      simpul: [
        { id: 'judul', baris: '2050-2190', jenis: 'mulai',
          teks: ['Layar judul digambar di', 'halaman yang tak terlihat'] },
        { id: 'siap', baris: '660-940',
          teks: ['Petunjuk, jumlah pemain,', '208 kartu disiapkan'] },
        { id: 'kocok', baris: '240-280', jenis: 'subrutin',
          teks: ['Kocok 208 kartu;', 'kartu pemotong acak 175-199'] },
        { id: 'taruh', baris: '970-1020', jenis: 'putusan',
          teks: ['Taruhan $5 sampai $200,', 'kelipatan lima'] },
        { id: 'bagi', baris: '1070-1090',
          teks: ['Dua kartu tiap orang;', 'kartu kedua bandar tertutup'] },
        { id: 'asuransi', baris: '1100-1170',
          teks: ['Kartu bandar As?', 'asuransi maksimal separuh taruhan'] },
        { id: 'main', baris: '1180-1540', jenis: 'putusan',
          teks: ['Card / Stand / Double / Split;', 'split memakai slot I+D1'] },
        { id: 'nilai', baris: '290-360', jenis: 'subrutin',
          teks: ['Nilai tangan, dengan As', 'disimpan di BESARNYA angka'] },
        { id: 'bandar', baris: '1550-1630',
          teks: ['Bandar menarik sampai 17'] },
        { id: 'bayar', baris: '1640-1780', jenis: 'keluar',
          teks: ['LOSES / PUSHES / WINS', 'dipilih dari satu string'] }
      ],
      panah: [
        { dari: 'judul', ke: 'siap' },
        { dari: 'siap', ke: 'taruh' },
        { dari: 'taruh', ke: 'bagi' },
        { dari: 'bagi', ke: 'kocok', label: 'kartu habis' },
        { dari: 'bagi', ke: 'asuransi' },
        { dari: 'asuransi', ke: 'main' },
        { dari: 'main', ke: 'nilai' },
        { dari: 'nilai', ke: 'main', label: 'kartu berikutnya' },
        { dari: 'main', ke: 'bandar', label: 'semua pemain selesai' },
        { dari: 'bandar', ke: 'bayar' },
        { dari: 'bayar', ke: 'taruh', label: 'ronde berikutnya' }
      ]
    },

    pseudokode: [
      { baris: 130, tingkat: 0, teks: '<code>FNA(Q)=Q+11*(Q&gt;=22)</code> &mdash; nilai <b>tampilan</b> sebuah tangan' },
      { baris: 140, tingkat: 0, teks: '<code>FNT(Q)=(5-Q)*12+17</code> &mdash; kolom layar pemain ke-Q' },
      { baris: 260, tingkat: 0, teks: 'kocok 208 kartu dengan tukar-acak; <code>CZ</code> = kartu pemotong 175&ndash;199' },
      { baris: 200, tingkat: 0, teks: 'nomor kartu dipecah jadi pangkat dan lambang dengan sisa bagi 13 dan 4' },
      { baris: 330, tingkat: 0, teks: 'nilai tangan menyimpan <b>+11</b> selama As masih bisa dihitung besar' },
      { baris: 350, tingkat: 1, teks: 'As diturunkan dengan <b>aritmetika</b>: <code>Q1-(Q&lt;=21 AND Q1&gt;21)</code>' },
      { baris: 940, tingkat: 0, teks: '<code>D1</code> = nomor bandar <b>dan</b> jarak ke tangan hasil split' },
      { baris: 1170, tingkat: 0, teks: 'bayaran asuransi 2:1 ditulis sebagai satu perkalian bertanda' },
      { baris: 1600, tingkat: 0, teks: 'bandar menarik kartu sampai 17 &mdash; aturan kasino, satu baris' },
      { baris: 1710, tingkat: 0, teks: 'kalah/seri/menang dipilih dari <b>satu string</b> dengan <code>SGN</code>' }
    ],

    perintahAsli: 'run\\BJ.bat',
    catatanAsli: 'C = ambil kartu, S = berhenti, D = double, / = split. Di ' +
      'mesin aslinya F1/F3/F5/F9 diprogram mengetik huruf-huruf itu.',

    penyimpangan: [
      '<b>HALAMAN LAYAR tidak ditiru.</b> Baris 2050 memakai ' +
      '<code>SCREEN 0,0,1,1</code> lalu <code>SCREEN 0,0,0,1</code>: argumen ' +
      'ketiga dan keempat adalah halaman <b>tulis</b> dan halaman ' +
      '<b>tampil</b>. Judulnya digambar ke halaman yang tidak terlihat lalu ' +
      'ditukar. Konsol penelusur cuma punya satu halaman, jadi ' +
      'penggambarannya terlihat.',

      '<b><code>KEY 1,"C"</code> sampai <code>KEY 9,"S"</code> tidak ' +
      'ditiru.</b> Perintah itu memprogram tombol fungsi supaya <b>mengetik</b> ' +
      'huruf, bukan memicu jebakan. Di penelusur, pakai huruf C, D, /, dan S ' +
      'langsung.',

      '<b><code>COLOR 26</code> dan <code>COLOR 31</code> memakai atribut ' +
      'kedip</b> (10+16 dan 15+16); konsol tidak berkedip.',

      '<b><code>RANDOMIZE</code> memasang benih tetap.</b>',

      '<b>Baris 2150 sudah disunting pemilik koleksi ini</b> &mdash; nomor ' +
      'telepon digantikan penanda "[disunting UU PDP]". Yang ditelusuri ' +
      'berkas apa adanya.',

      '<b>Subrutin dalam-baris 310-360 ditulis sekali sebagai pembantu.</b> ' +
      'Baris-barisnya tetap ada di tabel supaya cakupannya utuh, tapi ' +
      'perhitungannya dikerjakan satu fungsi &mdash; karena ia dipanggil dari ' +
      'dalam gelung di baris 290 dan tidak bisa dipecah tanpa mengubah ' +
      'alurnya.'
    ],

    pelajaran: {
      ringkas: 'Blackjack empat dek dengan split dan asuransi &mdash; dan ' +
        'kartu As dilacak tanpa satu pun bendera, cuma lewat besarnya angka.',
      pelajari: [
        ['As yang dilacak di besarnya angka',
         'Sebuah tangan blackjack yang berisi As punya dua nilai: satu atau ' +
         'sebelas. Cara biasa: simpan bendera "punya As yang bisa besar". ' +
         'Program ini <b>menyimpan nilainya dengan sebelas tambahan</b>, dan ' +
         '<code>FNA(Q)=Q+11*(Q&gt;=22)</code> mengembalikannya jadi angka yang ' +
         'ditampilkan. Satu bilangan membawa dua informasi, dan fungsinya ' +
         'yang memisahkannya lagi.'],
        ['Aritmetika menggantikan percabangan',
         'Baris 350: <code>Q=Q1-(Q&lt;=21 AND Q1&gt;21)</code>. Perbandingan ' +
         'bernilai &minus;1 atau 0, jadi seluruh syarat "kalau tadinya belum ' +
         'bust tapi sekarang bust, turunkan As-nya" jadi satu pengurangan. ' +
         'Baris 1170 memakai trik yang sama untuk bayaran asuransi 2:1.'],
        ['Satu variabel, dua arti yang menguatkan',
         '<code>D1 = N+1</code> adalah nomor bandar. Ia <b>juga</b> jarak ke ' +
         'tangan hasil split: tangan kedua pemain <code>I</code> disimpan di ' +
         '<code>I+D1</code>. Karena bandar selalu tepat sesudah pemain ' +
         'terakhir, kedua arti itu cocok dengan sendirinya, dan rumus tata ' +
         'letak <code>FNT(I+D1*(I&gt;D1))</code> tetap berlaku untuk keduanya.'],
        ['Kartu pemotong yang acak',
         'Baris 250: <code>CZ=INT(RND(1)*25)+175</code>. Pengocokan berikutnya ' +
         'terjadi di antara kartu ke-175 dan ke-199 dari 208 &mdash; tidak ' +
         'pernah di tempat yang sama. Itu persis alasan kasino sungguhan ' +
         'memakai kartu pemotong: <b>supaya penghitung kartu tidak bisa ' +
         'memastikan berapa yang tersisa</b>.'],
        ['Setengah angka yang memutuskan siapa kalah',
         'Tangan yang bust ditandai <code>-1</code>, baik punya pemain maupun ' +
         'punya bandar. Kalau keduanya bust, perbandingan di baris 1670 akan ' +
         'memberi <code>SGN(-1 - -1) = 0</code> &mdash; <b>seri</b>, dan pemain ' +
         'yang sudah bust malah dapat uangnya kembali. Itu salah: di blackjack, ' +
         'pemain yang bust kalah lebih dulu, apa pun yang terjadi sesudahnya.',
         'Baris 1610 menyelesaikannya dengan <code>Q(I)=Q-(Q&lt;0)/2</code>. ' +
         'Karena perbandingan bernilai &minus;1, bust <b>bandar</b> jadi ' +
         '&minus;0,5 &mdash; dan sekarang bust pemain (&minus;1) selalu lebih ' +
         'kecil. Terukur di penelusur: bandar 5+7 menarik satu kartu, bust, ' +
         'dan <code>Q(2)</code> berisi tepat <b>&minus;0,5</b>.',
         'Satu pembagian dengan dua, tanpa satu pun <code>IF</code>, dan tanpa ' +
         'satu kata pun yang menjelaskannya.'],
        ['Tiga hasil dari satu string',
         '<code>Z$="LOSES PUSHES WINS "</code>, dan baris 1710 memilih dengan ' +
         '<code>MID$(Z$, SGN(S(I))*6+7, 6)</code>. <code>SGN</code> memberi ' +
         '&minus;1, 0, atau 1; dikali enam dan digeser, ia jadi tempat yang ' +
         'tepat di string. Tidak ada satu pun <code>IF</code>.'],
        ['Membaca sebelum menulis',
         'Baris 2185: <code>POKE &amp;H417, PEEK(&amp;H417) OR &amp;H60</code>. ' +
         'Bendera papan tombol BIOS <b>dibaca dulu</b>, lalu dua bitnya ' +
         'dinyalakan. Program lain di koleksi ini (BOWLING, DROIDS, ATTACK) ' +
         'menimpanya begitu saja &mdash; dan dengan itu mematikan bendera ' +
         'lain yang mungkin sedang dipakai pemakainya.']
      ],
      hindari: [
        ['Lambang kartu yang disalin dari pangkatnya',
         'Baris 1430: <code>P(I1,1)=P(I,2):PS(I1,1)=P(I,2)</code>. Yang kedua ' +
         'seharusnya <code>PS(I,2)</code> &mdash; <b>lambang</b> kartu, bukan ' +
         '<b>pangkat</b>-nya. Akibatnya kartu pertama tangan hasil split bisa ' +
         'digambar dengan lambang yang salah. Nilainya tetap benar, jadi ' +
         'permainannya tidak terganggu &mdash; yang salah cuma gambarnya, dan ' +
         'itu jenis cacat yang bisa bertahan bertahun-tahun.'],
        ['Sepuluh pesan, satu tabel lompat, nol nama',
         'Baris 1930: <code>ON E GOTO 1940,1950,&hellip;,2030</code>. Untuk tahu ' +
         'apa arti <code>E=7</code>, satu-satunya cara adalah menghitung ' +
         'sampai entri ketujuh. Enam belas tempat berbeda menyetel ' +
         '<code>E</code> sebelum memanggil 1920.'],
        ['Salah eja di layar petunjuk',
         '<code>responces</code> (baris 760).'],
        ['Variabel yang disetel dan tidak dipakai',
         '<code>H1</code> disetel ke 5, 3, dan 7 di baris 380, 1210, dan 1350, ' +
         'dan <b>tidak pernah dibaca di mana pun</b>. Begitu juga ' +
         '<code>FL</code> dan <code>I$</code> di baris 670.']
      ]
    },

    penjelasan: [
      { judul: 'As yang tidak butuh bendera',
        isi: [
          'Sebuah tangan blackjack yang berisi As punya dua nilai sekaligus. ' +
          'A+6 bisa dibaca 7 atau 17, dan mana yang dipakai bergantung pada ' +
          'kartu berikutnya.',
          'Cara biasa menanganinya: simpan totalnya, ditambah sebuah bendera ' +
          '"masih punya As yang bisa dihitung besar". Dua variabel, dan tiap ' +
          'kartu baru harus memperbarui keduanya.',
          'Program ini menyimpan <b>satu bilangan</b>. Selama masih ada As ' +
          'yang bisa dihitung sebelas, nilainya disimpan <b>dengan sebelas ' +
          'tambahan</b>. Jadi A+6 tersimpan sebagai 18, bukan 7 dan bukan 17.',
          'Dan yang mengembalikannya jadi angka yang ditampilkan satu baris:',
          '<code>130 DEF FNA(Q)=Q+11*(Q&gt;=22)</code>',
          'Karena perbandingan bernilai &minus;1 saat benar, ' +
          '<code>11*(Q&gt;=22)</code> adalah &minus;11. Jadi nilai yang ' +
          'tersimpan 22 atau lebih dikurangi sebelas sebelum ditampilkan.',
          'Penurunan As-nya sendiri &mdash; saat menarik kartu membuat tangan ' +
          'yang tadinya aman jadi bust &mdash; juga tanpa <code>IF</code>:',
          '<code>350 Q=Q1-(Q&lt;=21 AND Q1&gt;21):IF Q&gt;=33 THEN Q=-1</code>',
          'Kalau tadinya belum bust tapi sekarang bust, kurangi satu. Kalau ' +
          'melewati 33, tangannya benar-benar bust dan ditandai &minus;1.',
          'Yang membuat cara ini menarik bukan penghematannya &mdash; satu ' +
          'variabel lebih sedikit tidak berarti apa-apa hari ini. Yang menarik ' +
          'adalah bahwa <b>keadaan dan nilainya tidak bisa terpisah</b>. ' +
          'Bendera bisa lupa diperbarui; angka yang membawa keadaannya sendiri ' +
          'tidak bisa.',
          'Harganya juga jelas: siapa pun yang membaca <code>Q=18</code> ' +
          'tidak bisa tahu artinya tanpa membaca baris 130 lebih dulu.'
        ] },
      { judul: 'Layar yang digambar di tempat yang tidak terlihat',
        isi: [
          'Baris 2050 dan 2190 mengapit seluruh layar judul:',
          '<code>2050 SCREEN 0,0,1,1 : CLS : SCREEN 0,0,0,1 : CLS &hellip;</code><br>' +
          '<code>2190 SCREEN 0,0,0,0</code>',
          'Dua argumen terakhir <code>SCREEN</code> adalah <b>halaman ' +
          'tulis</b> dan <b>halaman tampil</b>. Kartu layar teks PC punya ' +
          'beberapa halaman 80&times;25 di memorinya, dan yang ditampilkan ' +
          'cuma satu.',
          'Jadi yang terjadi: bersihkan halaman 1 sambil menampilkan halaman ' +
          '1, lalu <b>tulis ke halaman 0 sambil tetap menampilkan halaman ' +
          '1</b> &mdash; pemakai melihat layar kosong sementara judulnya ' +
          'digambar di tempat lain. Baris 2190 menukar tampilannya ke halaman ' +
          '0, dan judulnya <b>muncul utuh, seketika</b>.',
          'Itu <i>double buffering</i>, 1982, di layar teks. Gagasan yang ' +
          'sama dipakai setiap kali sebuah program grafik menggambar ke ' +
          'penyangga belakang lalu menukarnya &mdash; supaya penggambaran ' +
          'setengah jadi tidak pernah terlihat.',
          'Di penelusur ini halamannya cuma satu, jadi Anda melihat judulnya ' +
          'tergambar baris demi baris. Yang hilang justru gagasannya.'
        ] }
    ]
  };
})(window);
