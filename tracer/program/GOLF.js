/* ===========================================================================
   GOLF.js — porting minimalis GOLF.BAS sebagai tabel baris.

   Program kedua puluh satu: "PC Golf". Tiga lapangan, delapan belas lubang
   masing-masing, dan pemandangan yang digambar ulang tiap pukulan.

   Dua hal yang membuatnya layak ditelusuri:

   (1) PENGACAKNYA DISEMAI OLEH JARI PEMAIN. Baris 1170 — gelung menunggu
       tombol — memanggil `RANDOMIZE VAL(RIGHT$(TIME$,2))` di TIAP putaran
       selama tak ada tombol ditekan. Jadi benihnya adalah detik pada saat
       pemain akhirnya menekan. Sumber keacakan yang gratis, tidak bisa
       ditebak, dan sepenuhnya berasal dari manusianya.

   (2) SEMUA HAL YANG BERBEDA ANTARA TIGA LAPANGAN CUMA POSISI PENUNJUK DATA.
       Baris 1290: `FOR D=1 TO ((C-1)*126):READ E:NEXT` — untuk lapangan
       kedua, baca lewat 126 angka. Tidak ada indeks lapangan di mana pun
       sesudah itu.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `Z(10)` jadi `Z_` (baris 3070 memakai `Z` sebagai teks biasa).
   - `LEFT` dan `RIGHT` dipakai sebagai nama variabel biasa; di penelusur
     namanya tetap sama.
   - `SOUND` diam, jadi tujuh bunyi hasil pukulan di baris 1530-1590 tidak
     terdengar.
   - `COLOR 31` di baris 1040 (bola berkedip) tidak berkedip.
   - Pengacaknya berbenih tetap; jam penelusur maju tetap tiap dibaca, jadi
     "keacakan dari jari pemain" di baris 1170 tetap bisa diulang.
   =========================================================================== */

(function (global) {
  'use strict';

  var tabel = [

    rem(10),
    { baris: 20, jalan: function (m) { m.locate(1, 1, 0); } },
    { baris: 30, jalan: function (m) { m.warna(15, 0); m.cls(); } },
    { baris: 40, bagian: [
        function (m) {
          m.v.JAM = 23; m.semai(detik(m));
          m.dim('Z_$', 10); m.v.Z_ = m.v['Z_$'];
          /* A(10) di-DIM dan tidak pernah dipakai sekali pun. */
          m.dim('A_', 10);
        },
        function (m) { m.gosub(2200); }
      ] },
    { baris: 50, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 1380); m.jebakan(m.v.A, true);
        }
      } },
    { baris: 60, jalan: function (m) { m.pasangJebakan(10, 2470); } },
    { baris: 70, jalan: function (m) { m.jebakan(10, true); } },
    { baris: 80, bagian: [
        function (m) { m.gosub(1210); },
        function (m) {
          m.warna(15, 0); m.cls();
          m.locate(5, 20); m.cetak('What Is Your Name? '); m.barisBaru();
        }
      ] },
    { baris: 90, jalan: function (m) {
        m.locate(23, 18);
        m.cetak('***** Enter Your Name And Strike Enter *****');
        m.barisBaru();
        m.locate(5, 38); m.cetak(' ');
      } },
    { baris: 100, bagian: [
        function (m) { m.gosub(3510); },
        function (m) { m.v['P$'] = ' ' + m.v.ZA.slice(0, 7); }
      ] },
    { baris: 110, bagian: [
        function (m) {
          m.locate(7, 20);
          m.cetak('What Is Your Handicap ' + m.v['P$'] + '? ');
          m.locate(23, 16);
          m.cetak('***** Enter Your Handicap And Strike Enter *****');
          m.locate(7, 20);
          m.cetak('What Is Your Handicap ' + m.v['P$'] + '? ');
        },
        function (m) { m.gosub(3510); },
        function (m) { m.v.A = parseFloat(m.v.ZA) || 0; }
      ] },
    { baris: 120, jalan: function (m) {
        if (m.v.A < 0 || m.v.A > 30) {
          m.cls(); m.locate(4, 16);
          m.cetak('Please Enter An Amount Between 0 And 30 Inclusive');
          m.barisBaru();
          m.lompat(110);
        }
      } },
    { baris: 130, jalan: function (m) {
        m.cls();
        if (m.v.A < 4) {
          m.locate(4, 25); m.cetak('You Should Be On The Tour!!'); m.barisBaru();
        }
      } },
    ajar(140, 6, 20, 'Difficulties At Golf Include The Following:'),
    { baris: 150, jalan: function (m) { m.warna(10, 0); } },
    ajar(160,  7, 30, '0 = HOOK                  '),
    ajar(170,  8, 30, '1 = SLICE                 '),
    ajar(180,  9, 30, '2 = POOR DISTANCE         '),
    ajar(190, 10, 30, '3 = PERFECT PLAYER        '),
    ajar(200, 11, 30, '4 = SAND TRAP PLAY        '),
    ajar(210, 12, 30, '5 = POOR PUTTING          '),
    { baris: 220, jalan: function (m) {
        m.locate(14, 30); m.warna(15, 0); m.cetak('Pick One:'); m.warna(3, 0);
      } },
    { baris: 230, bagian: [
        function (m) { m.gosub(1170); },
        function (m) { if (m.v.Z < '0' || m.v.Z > '5') m.gosub(1180); },
        function (m) {
          if (m.v.Z < '0' || m.v.Z > '5') m.lompat(220);
          else m.v.B = parseInt(m.v.Z, 10);
        }
      ] },
    { baris: 240, bagian: [
        function (m) { m.v.HOLE = 1; },
        function (m) { m.gosub(1220); }
      ] },
    { baris: 250, bagian: [
        function (m) { if (m.v.HOLE === 19) m.gosub(1610); else m.gosub(1740); },
        function (m) { if (m.v.HOLE === 19) m.jalankan(); }
      ] },
    { baris: 260, jalan: function (m) { m.gosub(1300); } },
    { baris: 270, jalan: function (m) { m.v.B1 = 1; } },
    { baris: 280, bagian: [
        function (m) { m.jebakan(1, true); m.v.Z1 = ''; },
        function (m) { m.gosub(1170); },
        function (m) {
          var z = m.v.Z;
          if (z > '0' && z <= '9') m.v.F = parseInt(z, 10);
          else if (z === 'P' || z === 'p') m.v.Z1 = z;
          else m.lompat(280);
        }
      ] },
    { baris: 290, jalan: function (m) {
        for (m.v.XX = 14; m.v.XX <= 17; m.v.XX++) {
          m.locate(m.v.XX, 1); m.spc(40);
        }
      } },
    { baris: 300, jalan: function (m) {
        m.locate(14, 10); m.cetak(m.v.Z);
        if (m.v.Z1 === 'P' || m.v.Z1 === 'p') m.lompat(320);
      } },
    { baris: 310, jalan: function (m) {
        m.locate(16, 2); m.warna(15, null);
        m.cetak("Choose `I' For Iron Or `W' For Wood"); m.barisBaru();
        m.warna(7, null); m.locate(14, 11);
      } },
    { baris: 320, jalan: function (m) { m.gosub(1170); } },
    { baris: 330, jalan: function (m) {
        if (m.v.Z1 === 'P' || m.v.Z1 === 'p') m.lompat(360);
      } },
    { baris: 340, jalan: function (m) {
        if (m.v.Z === 'W' || m.v.Z === 'w') { m.cetak(' WOOD'); m.lompat(380); }
      } },
    /* 350 nomor besi ditambah 9,5 supaya jarak dasarnya lebih pendek —
       satu angka pecahan yang membedakan besi dari kayu. */
    { baris: 350, jalan: function (m) {
        if (m.v.Z === 'I' || m.v.Z === 'i') {
          m.cetak(' IRON'); m.v.F = m.v.F + 9.5; m.lompat(380);
        }
      } },
    { baris: 360, jalan: function (m) {
        if (m.v.Z === 'W' || m.v.Z === 'w') {
          m.cetak(m.chr(29) + 'PITCHING WEDGE'); m.v.F = 20; m.lompat(380);
        }
      } },
    { baris: 370, bagian: [
        function (m) { m.gosub(1350); },
        function (m) { m.lompat(280); }
      ] },
    { baris: 380, bagian: [
        function (m) {
          m.v.__ = m.v.F > 4 && (m.v.Z === 'w' || m.v.Z === 'W') &&
                   (m.v.Z1 !== 'p' && m.v.Z1 !== 'P');
          if (m.v.__) m.gosub(1350);
        },
        function (m) { if (m.v.__) m.lompat(280); }
      ] },
    { baris: 390, bagian: [
        function (m) { if (m.v.F < 8) m.gosub(1200); },
        function (m) { if (m.v.F < 8) m.lompat(510); }
      ] },
    { baris: 400, jalan: function (m) {
        m.locate(16, 1); m.spc(40); m.barisBaru();
        m.locate(16, 1); m.warna(15, null);
        m.cetak('Select % Of Swing  <from 11 to 100>');
        m.v.Z2 = ''; m.warna(7, null); m.locate(14, 25);
      } },
    { baris: 410, jalan: function (m) { m.gosub(1170); } },
    { baris: 420, jalan: function (m) { if (m.v.Z === m.chr(8)) m.lompat(450); } },
    { baris: 430, jalan: function (m) {
        if (m.v.Z.length > 1) {
          m.lompat(m.v.Z.substr(1, 1) === m.chr(75) ? 450 : 410);
        }
      } },
    { baris: 440, jalan: function (m) {
        m.lompat((m.v.Z < '0' || m.v.Z > '9') ? 410 : 470);
      } },
    { baris: 450, jalan: function (m) { if (m.v.Z2.length < 1) m.lompat(410); } },
    { baris: 460, jalan: function (m) {
        m.cetak(m.chr(29) + ' ' + m.chr(29));
        m.v.Z2 = m.v.Z2.slice(0, m.v.Z2.length - 1);
        m.lompat(410);
      } },
    { baris: 470, jalan: function (m) {
        m.cetak(m.v.Z); m.v.Z2 = m.v.Z2 + m.v.Z;
        if (m.v.Z2.length > 1) m.v.SWING = parseFloat(m.v.Z2) || 0;
        else m.lompat(410);
      } },
    /* 480 "10" diperlakukan sebagai 100: pemain yang mengetik dua angka
       lalu berhenti dianggap memaksudkan seratus persen. */
    { baris: 480, jalan: function (m) {
        if (m.v.SWING === 10) {
          m.cetak('0 %'); m.barisBaru(); m.v.SWING = m.v.SWING * 10;
        } else { m.cetak(' %'); m.barisBaru(); }
      } },
    { baris: 490, bagian: [
        function (m) {
          m.v.__ = m.v.SWING < 1 || m.v.SWING > 100;
          if (m.v.__) { m.locate(16, 1); m.spc(40); m.barisBaru(); }
        },
        function (m) { if (m.v.__) m.gosub(1350); },
        function (m) { if (m.v.__) m.lompat(280); }
      ] },
    { baris: 500, bagian: [
        function (m) { m.gosub(1200); },
        function (m) {
          m.v.SWING = m.v.SWING / 100;
          if (m.v.B1 === 5) m.lompat(660);
          else { m.v.F = m.v.F - 5; m.lompat(530); }
        }
      ] },
    { baris: 510, jalan: function (m) {
        m.v.SWING = 1;
        if (m.v.B1 === 2 || m.v.B1 === 3) m.lompat(710);
      } },
    { baris: 520, jalan: function (m) {
        if (m.v.F === 1 && m.v.STK > 0 && m.v.PENALTY === 0) m.lompat(740);
      } },
    /* 530 rumus jarak: handicap, nomor tongkat, sedikit acak, lalu dikali
       persentase ayunan. Satu baris yang memuat seluruh "fisika"-nya. */
    { baris: 530, jalan: function (m) {
        var A = m.v.A, F = m.v.F;
        m.v.DIST = Math.trunc((30 - A) * 2.5 + 230 -
                   ((30 - A) * 0.25 + 20) * F / 2 + m.acak() * 20);
        m.v.DIST = Math.trunc(m.v.DIST * m.v.SWING);
      } },
    /* 540 simpangan dari garis lurus, lalu jarak ke green dihitung dengan
       teorema Pythagoras: sisi miring dari simpangan dan sisa jarak. */
    { baris: 540, jalan: function (m) {
        m.v.OF = (m.acak() / 0.6) * (2 * m.v.A + 16) *
                 Math.abs(Math.tan(m.v.DIST * 0.003));
        m.v.GRN = Math.trunc(Math.sqrt(
          Math.pow(m.v.OF, 2) + Math.pow(Math.abs(m.v.YARDS - m.v.DIST), 2)));
      } },
    { baris: 550, jalan: function (m) {
        if (m.v.YARDS - m.v.DIST < 0 && m.v.GRN >= 20) {
          m.locate(8, 1); m.warna(15, null);
          m.cetak("Too Much Club, You're Over The Green"); m.barisBaru();
          m.warna(7, null); m.locate(1, 1);
        }
      } },
    { baris: 560, jalan: function (m) { m.v.HOLD = m.v.YARDS; m.v.YARDS = m.v.GRN; } },
    { baris: 570, jalan: function (m) {
        if (m.v.GRN > 25) m.lompat(590);
        else if (m.v.GRN > 15) m.lompat(650);
        else if (m.v.GRN > 1) m.lompat(690);
      } },
    { baris: 580, jalan: function (m) { m.v.GRN = 0; m.lompat(750); } },
    { baris: 590, jalan: function (m) {
        if (m.v.OF < m.v.DIFF + m.v.A * 1.1 - m.v.SWING * 20) {
          m.v.B1 = 1; m.lompat(640);
        } else {
          m.locate(1, 1);
          var t = [610, 620][m.v.B];
          if (t) m.lompat(t);
        }
      } },
    { baris: 600, jalan: function (m) { m.lompat(640); } },
    { baris: 610, jalan: function (m) {
        m.cetak('You Hooked '); m.v.B1 = m.v.LEFT; m.lompat(630);
      } },
    { baris: 620, jalan: function (m) {
        m.cetak('YOU Sliced '); m.v.B1 = m.v.RIGHT;
      } },
    { baris: 630, jalan: function (m) {
        if (m.v.OF > 50) { m.cetak('Outa SIGHT.'); m.barisBaru(); }
      } },
    { baris: 640, bagian: [
        function (m) { m.gosub(1390); },
        function (m) { m.lompat(280); }
      ] },
    { baris: 650, bagian: [
        function (m) { m.v.B1 = 5; m.gosub(1390); },
        function (m) { m.lompat(280); }
      ] },
    { baris: 660, jalan: function (m) {
        m.locate(1, 1);
        m.v.X = (m.v.B === 4) ? m.acak() * 100 - m.v.A : m.acak() * 150 - m.v.A;
      } },
    { baris: 670, jalan: function (m) {
        if (m.v.X < 13) {
          m.cetak('You Dubbed It. Shot Still In The Trap.'); m.barisBaru();
        } else m.lompat(690);
      } },
    { baris: 680, bagian: [
        function (m) { m.v.B1 = 5; m.v.DIST = 0; m.gosub(1390); },
        function (m) { m.gosub(1350); },
        function (m) { m.lompat(280); }
      ] },
    { baris: 690, jalan: function (m) {
        m.v.B1 = 1; m.v.GRN = Math.trunc(m.v.GRN * (m.acak() * 4));
      } },
    { baris: 700, jalan: function (m) { m.lompat(750); } },
    { baris: 710, jalan: function (m) {
        m.locate(5, 1);
        m.v.X = Math.trunc(m.acak() * 50 - m.v.A);
        if (m.v.X < 18) {
          if (m.v.B1 === 3) {
            m.cetak('You Hit A Tree. Try Again.'); m.barisBaru();
            m.lompat(730);
          } else m.lompat(720);
        } else m.lompat(530);
      } },
    { baris: 720, jalan: function (m) {
        m.cetak('You Dubbed It.'); m.barisBaru();
        m.cetak('What Did You Say Your Handicap Was ?'); m.barisBaru();
      } },
    { baris: 730, jalan: function (m) {
        m.v.DIST = Math.trunc(m.acak() * 35); m.lompat(540);
      } },
    { baris: 740, jalan: function (m) {
        m.locate(5, 1);
        m.cetak('Where Did You Learn To Play Golf, HUH??'); m.barisBaru();
        m.cetak("You Don`t Hit A Driver In The Fairway"); m.barisBaru();
        m.lompat(730);
      } },

    /* --- 750-1160: green dan bola yang menggelinding --------------------- */
    { baris: 750, jalan: function (m) {
        m.v.FF = 1; m.v.CY = 2; m.cls(); m.warna(2, 0);
        m.locate(23, 1); m.cetak(m.ulang(78, 176));
        m.warna(3, null); m.locate(23, 40); m.cetak(m.chr(32));
      } },
    { baris: 760, jalan: function (m) { m.v.Z = m.inkey(); m.lompat(940); } },
    { baris: 770, jalan: function (m) {
        m.v.Z = m.inkey();
        m.locate(1, 21); m.warna(0, 7);
        m.cetak("You're On The Green" + angka(m.v.GRN) + 'Feet From The Pin ');
        m.barisBaru();
      } },
    { baris: 780, jalan: function (m) {
        m.locate(25, 26); m.cetak('Strike <F10> To Leave This Game');
      } },
    { baris: 790, jalan: function (m) {
        m.locate(3, 38); m.cetak(' Par' + angka(m.v.PAR)); m.barisBaru();
      } },
    { baris: 800, jalan: function (m) {
        m.locate(5, 36); m.cetak(' Strokes' + angka(m.v.STK)); m.barisBaru();
      } },
    { baris: 810, jalan: function (m) {
        m.warna(15, 0); m.locate(9, 28);
        m.cetak(' Strike Space Bar To Putt '); m.barisBaru();
      } },
    { baris: 820, jalan: function (m) {
        m.locate(8, 22);
        m.cetak(' Enter A Putt Factor Between .5 and 10  '); m.barisBaru();
      } },
    { baris: 830, jalan: function (m) { m.locate(10, 40); m.v.Z2 = ''; } },
    { baris: 840, bagian: [
        function (m) { m.gosub(1170); },
        function (m) {
          if (m.v.Z === m.chr(32) || m.v.Z === m.chr(13)) {
            m.v.PUTT = parseFloat(m.v.Z2) || 0; m.lompat(900);
          }
        }
      ] },
    { baris: 850, jalan: function (m) {
        if (m.v.Z.length > 1) {
          if (m.v.Z.substr(1, 1) === m.chr(75)) m.v.Z = m.chr(8);
          else m.lompat(840);
        }
      } },
    { baris: 860, jalan: function (m) {
        if (m.v.Z2.length < 1 && m.v.Z === m.chr(8)) m.lompat(840);
      } },
    { baris: 870, jalan: function (m) {
        if (m.v.Z === m.chr(8)) {
          m.cetak(m.chr(29) + ' ' + m.chr(29));
          m.v.Z2 = m.v.Z2.slice(0, m.v.Z2.length - 1);
          m.lompat(840);
        }
      } },
    { baris: 880, jalan: function (m) {
        if ((m.v.Z < '0' || m.v.Z > '9') && m.v.Z !== '.') m.lompat(840);
      } },
    { baris: 890, jalan: function (m) {
        m.locate(10, null); m.cetak(m.v.Z);
        m.v.Z2 = m.v.Z2 + m.v.Z; m.lompat(840);
      } },
    { baris: 900, jalan: function (m) {
        m.locate(10, 30); m.spc(30); m.barisBaru();
        m.locate(5, 43); m.cetak('       '); m.barisBaru();
        if (m.v.PUTT < 0 || m.v.PUTT > 10) m.lompat(820);
      } },
    { baris: 910, jalan: function (m) { m.v.HP = (m.v.HP || 0) + 1; } },
    /* 920 belas kasihan: sesudah enam putt, atau kalau pukulannya sudah
       jauh melewati handicap, bolanya dianggap masuk. */
    { baris: 920, jalan: function (m) {
        if (m.v.HP > 6 || m.v.STK - 1 > m.v.A * 0.75 + 2) m.lompat(970);
      } },
    { baris: 930, jalan: function (m) {
        m.v.GRN = (m.v.B === 5)
          ? m.v.GRN - m.v.PUTT * (4 + 1 * m.acak()) + 1
          : m.v.GRN - m.v.PUTT * (4 + 2 * m.acak()) + 1.5;
      } },
    { baris: 940, jalan: function (m) {
        if (m.v.GRN < -40 || m.v.GRN > 40) m.v.GRN = 40;
      } },
    { baris: 950, jalan: function (m) {
        if (m.v.GRN < -1.4) {
          if (m.v.FF === -1) m.v.CX = m.v.CX + m.v.GRN * 2;
          else m.v.CX = 40 - m.v.GRN;
          m.lompat(980);
        }
      } },
    { baris: 960, jalan: function (m) {
        if (m.v.GRN > 1.4) { m.v.CX = 40 - m.v.GRN; m.lompat(980); }
      } },
    { baris: 970, jalan: function (m) { m.v.GRN = 0; m.v.CX = 40; } },
    { baris: 980, jalan: function (m) { m.v.STK = (m.v.STK || 0) + 1; } },
    { baris: 990, jalan: function (m) { if (m.v.CY < 2) m.v.CY = 2; } },
    { baris: 1000, jalan: function (m) { if (m.v.CX > 79) m.v.CX = 77; } },
    { baris: 1010, jalan: function (m) { m.v.GRN = Math.trunc(m.v.GRN + 0.4); } },
    { baris: 1020, jalan: function (m) {
        m.locate(22, m.v.CY - 1); m.cetak('   ');
      } },
    { baris: 1030, jalan: function (m) { if (m.v.CX < 2) m.v.CX = 3; } },
    /* 1040-1070 bola bergerak: satu kolom per langkah, dan jejaknya dihapus
       dengan mencetak spasi di belakangnya. Arahnya (FF) menentukan sisi
       mana yang dihapus. */
    { baris: 1040, bagian: [
        function (m) {
          m.warna(31, null);
          m.untuk('CZ', m.v.CY, m.v.CX - 1, m.v.FF, 1070);
        },
        function (m) { if (m.v.FF === 1) m.lompat(1060); }
      ] },
    { baris: 1050, jalan: function (m) {
        m.locate(22, m.v.CZ); m.cetak(m.chr(32));
        m.locate(22, m.v.CZ - 1); m.cetak(m.chr(2));
        m.lompat(1070);
      } },
    { baris: 1060, jalan: function (m) {
        m.locate(22, m.v.CZ - 1); m.cetak(m.chr(32));
        m.locate(22, m.v.CZ); m.cetak(m.chr(32));
        m.locate(22, m.v.CZ + 1); m.cetak(m.chr(2));
      } },
    { baris: 1070, bagian: [
        function (m) { m.lanjutkan('CZ'); },
        function (m) { m.warna(7, null); }
      ] },
    { baris: 1080, jalan: function (m) {
        if (m.v.GRN < 0) { m.v.FF = -m.v.FF; m.v.GRN = -m.v.GRN; }
      } },
    { baris: 1090, jalan: function (m) {
        if (m.v.GRN === 0) {
          m.locate(22, 1); m.spc(39);
          m.locate(null, 41); m.spc(39); m.barisBaru();
          m.locate(23, 40); m.cetak(m.chr(2));
        }
      } },
    { baris: 1100, jalan: function (m) {
        m.v.CY = m.v.CX; m.v.GRN = Math.trunc(m.v.GRN);
      } },
    { baris: 1110, jalan: function (m) { m.warna(12, null); } },
    { baris: 1120, jalan: function (m) {
        var i;
        for (i = 22; i >= 19; i--) { m.locate(i, 40); m.cetak(m.chr(219)); }
        m.locate(18, 40); m.cetak(m.chr(219)); m.cetak(m.ulang(4, 178));
        m.locate(17, 40); m.cetak(m.chr(219)); m.cetak(m.ulang(4, 178));
      } },
    { baris: 1130, jalan: function (m) { m.warna(7, null); } },
    { baris: 1140, jalan: function (m) { if (m.v.GRN !== 0) m.lompat(770); } },
    { baris: 1150, jalan: function (m) { m.gosub(1530); } },
    { baris: 1160, bagian: [
        function (m) { m.gosub(1430); },
        function (m) { m.lompat(250); }
      ] },

    /* 1170 GELUNG TUNGGU TOMBOL YANG MENYEMAI PENGACAK.
       Selama tidak ada tombol ditekan, benihnya diganti terus dengan detik
       jam. Jadi yang menentukan hasil pukulan berikutnya adalah SAAT pemain
       menekan tombol — sumber keacakan yang gratis dan tak tertebak. */
    { baris: 1170, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') { m.semai(detik(m)); m.lompat(1170); }
        else m.kembali();
      } },
    { baris: 1180, jalan: function (m) {
        m.locate(20, 23);
        m.cetak('That Is Not A Choice. Please Try Again.'); m.barisBaru();
      } },
    { baris: 1190, jalan: function (m) {
        for (m.v.XX = 1; m.v.XX <= 2000; m.v.XX++) { /* jeda */ }
        m.locate(20, 1); m.spc(79); m.barisBaru();
        m.kembali();
      } },
    { baris: 1200, jalan: function (m) {
        for (m.v.XX = 9; m.v.XX >= 1; m.v.XX--) {
          m.locate(m.v.XX, 1); m.spc(40); m.barisBaru();
        }
        m.kembali();
      } },
    { baris: 1210, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 7; m.v.A++) m.v.Z_[m.v.A] = m.baca();
        m.kembali();
      } },
    { baris: 1220, jalan: function (m) {
        m.cls(); m.warna(0, 7); m.locate(10, 25);
        m.cetak(' Please Pick A Course To Play '); m.barisBaru();
      } },
    ajar(1230, 12, 15, ' 1 Amateur Green Grass Country Club     <Rating 65> '),
    ajar(1240, 13, 15, ' 2 Down Hill Country Club               <Rating 69> '),
    ajar(1250, 14, 15, ' 3 Swamp Grass USA                      <Rating 72> '),
    { baris: 1260, jalan: function (m) { m.warna(7, 0); } },
    { baris: 1270, bagian: [
        function (m) { m.gosub(1170); },
        function (m) { if (m.v.Z < '1' || m.v.Z > '3') m.gosub(1180); },
        function (m) {
          if (m.v.Z < '1' || m.v.Z > '3') m.lompat(1270);
          else m.v.C = parseInt(m.v.Z, 10);
        }
      ] },
    { baris: 1280, jalan: function (m) { if (m.v.C === 1) m.kembali(); } },
    /* 1290 memilih lapangan = MEMBACA LEWAT. Tidak ada indeks lapangan di
       mana pun sesudah baris ini; yang tersisa cuma penunjuk DATA. */
    { baris: 1290, jalan: function (m) {
        for (m.v.D = 1; m.v.D <= (m.v.C - 1) * 126; m.v.D++) m.v.E = m.baca();
        m.kembali();
      } },
    { baris: 1300, jalan: function (m) {
        m.locate(20, 1); m.warna(0, 7);
        m.cetak(m.v['P$'] + ' This Is Your Bag Of Clubs: '); m.barisBaru();
      } },
    tas(1310, 'Woods 1 thru 4', '300 to 250 Yards '),
    tas(1320, 'Irons 1 thru 9', '250 to   0 Yards '),
    { baris: 1330, jalan: function (m) {
        m.tab(5); m.cetak('Pitching Wedge'); m.tab(20);
        m.cetak('100 to   0 Yards '); m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 1340, jalan: function (m) {
        m.warna(0, 7); m.locate(25, 25);
        m.cetak(' Strike <F10> To Leave This Game '); m.warna(3, 0);
      } },
    { baris: 1350, jalan: function (m) {
        m.warna(15, null); m.locate(14, 5);
        m.cetak('Choose Your Club.              '); m.barisBaru();
      } },
    { baris: 1360, jalan: function (m) {
        m.locate(15, 5); m.cetak('1-9 For Irons, 1-4 For Woods,'); m.barisBaru();
      } },
    { baris: 1370, jalan: function (m) {
        m.locate(16, 1); m.spc(40); m.barisBaru();
        m.locate(16, 5); m.cetak('Or PW For Pitching Wedge.'); m.barisBaru();
        m.warna(7, null);
      } },
    /* 1380 penutup subrutin 1350 SEKALIGUS badan jebakan F1-F9. */
    { baris: 1380, jalan: function (m) { m.kembali(); } },
    { baris: 1390, jalan: function (m) {
        m.locate(2, 1); m.v.STK = (m.v.STK || 0) + 1;
        if (m.v.B1 > 5) m.lompat(1420);
      } },
    { baris: 1400, jalan: function (m) {
        m.cetak('Shot Went' + angka(m.v.DIST) + 'Yards.'); m.barisBaru();
        m.cetak("It`s"); m.warna(15, 0); m.cetak(angka(m.v.GRN));
        m.warna(3, 0); m.cetak('Yards From The Green'); m.barisBaru();
      } },
    { baris: 1410, bagian: [
        function (m) {
          m.cetak('And Is' + angka(Math.trunc(m.v.OF)) + 'Yards Off Line In ' +
                  m.v.Z_[m.v.B1]);
          m.barisBaru();
        },
        function (m) { m.gosub(1350); },
        function (m) { m.kembali(); }
      ] },
    /* 1420 masuk air atau keluar lapangan: satu pukulan denda, bola
       dikembalikan ke tempat semula, lalu MELOMPAT BALIK ke 1390 yang
       menaikkan pukulannya sekali lagi. */
    { baris: 1420, jalan: function (m) {
        m.cetak('Shot Went Into ' + m.v.Z_[m.v.B1]); m.barisBaru();
        m.v.STK = m.v.STK + 1;
        m.cetak('Penalty Stroke Accessed. '); m.barisBaru();
        m.cetak('Hit From Same Location'); m.barisBaru();
        m.v.PENALTY = 1; m.v.J = (m.v.J || 0) + 1; m.v.B1 = 1;
        m.v.YARDS = m.v.HOLD; m.v.DIST = 0; m.v.OF = 0; m.v.GRN = m.v.HOLD;
        m.lompat(1390);
      } },
    { baris: 1430, jalan: function (m) {
        m.v.PS = 0; m.v.HP = 0; m.v.S = (m.v.S || 0) + 1; m.v.J = 0;
      } },
    { baris: 1440, jalan: function (m) {
        for (m.v.XX = 9; m.v.XX >= 1; m.v.XX--) {
          m.locate(m.v.XX, 1); m.spc(70); m.barisBaru();
        }
      } },
    { baris: 1450, jalan: function (m) {
        m.v.STKS = (m.v.STKS || 0) + m.v.STK;
        m.v.HOLE = m.v.HOLE + 1;
      } },
    { baris: 1460, jalan: function (m) {
        m.locate(1, 28);
        m.cetak('Your Score On Hole' + angka(m.v.HOLE - 1) + 'Was' + angka(m.v.STK));
        m.barisBaru();
      } },
    { baris: 1470, jalan: function (m) {
        m.locate(3, 30);
        m.cetak('Total Par So Far Is' + angka(m.v.TOTAL)); m.barisBaru();
      } },
    { baris: 1480, jalan: function (m) {
        m.locate(4, 29);
        m.cetak('Your Current Score Is' + angka(m.v.STKS)); m.barisBaru();
      } },
    { baris: 1490, jalan: function (m) { m.v.STK = 0; } },
    { baris: 1500, jalan: function (m) {
        m.locate(25, 25); m.warna(15, 0);
        m.cetak('    Strike Any Key To Continue  ');
      } },
    { baris: 1510, bagian: [
        function (m) { m.warna(3, 0); },
        function (m) { m.gosub(1170); }
      ] },
    { baris: 1520, jalan: function (m) { m.kembali(); } },
    hasil(1530, 2, 'DOUBLEBOGEY', '  A Double Bogey. Let The Next Foursome Play Through '),
    hasil(1540, 1, 'BOGEY', '      A Bogey. Maybe The Next Hole Will Be Better.'),
    hasil(1550, 0, 'PARS', '            A Par. Keep Up The Good Work.'),
    { baris: 1560, jalan: function (m) {
        if (m.v.STK > m.v.PAR + 2) {
          m.v.BAD = (m.v.BAD || 0) + 1;
          m.cetak('       Maybe You Had Better Get Your Money Back.');
          m.barisBaru();
        }
      } },
    hasil(1570, -1, 'BIRDIE', '                Alright ! A Birdie.'),
    /* 1580 satu baris yang memuat dua hasil berbeda: dua di bawah par pada
       lubang par 3 adalah hole-in-one, di lubang lain namanya eagle. */
    { baris: 1580, jalan: function (m) {
        if (m.v.STK === m.v.PAR - 2) {
          if (m.v.PAR === 3) {
            m.v.HOLEINONE = (m.v.HOLEINONE || 0) + 1;
            m.cetak('A Hole In One !!!!'); m.barisBaru();
          } else {
            m.v.EAGLE = (m.v.EAGLE || 0) + 1;
            m.cetak('      An Eagle. WOW !! You Should Be On The Tour.');
            m.barisBaru();
          }
        }
      } },
    hasil(1590, -3, 'DOUEAG', 'YEE-HAA!!! A Double Eagle !!! Your Name Must Be JACK'),
    { baris: 1600, jalan: function (m) { m.warna(7, null); m.kembali(); } },

    /* --- 1610-1730: kartu skor akhir -------------------------------------- */
    { baris: 1610, jalan: function (m) {
        m.cls(); m.warna(2, 0); m.locate(1, 27);
        m.cetak('Your Score Is As Follows:'); m.barisBaru();
      } },
    cacah(1620, 3, 30, 'BAD', 'Awful Shots'),
    cacah(1630, 4, 30, 'DOUBLEBOGEY', 'Double Bogeys'),
    cacah(1640, 5, 30, 'BOGEY', 'Bogeys'),
    cacah(1650, 6, 30, 'PARS', 'Pars'),
    cacah(1660, 7, 30, 'BIRDIE', 'Birdies'),
    cacah(1670, 8, 30, 'EAGLE', 'Eagles'),
    cacah(1680, 9, 30, 'DOUEAG', 'Double Eagle'),
    cacah(1690, 10, 30, 'HOLEINONE', 'Hole In One'),
    { baris: 1700, jalan: function (m) {
        m.locate(12, 27);
        m.cetak('Par For This Course Is' + angka(m.v.TOTAL)); m.barisBaru();
      } },
    { baris: 1710, jalan: function (m) {
        m.locate(13, 31);
        m.cetak('Your Score Was' + angka(m.v.STKS)); m.barisBaru();
      } },
    { baris: 1720, jalan: function (m) {
        m.warna(0, 7); m.locate(15, 23);
        m.cetak(' Would You Like To Play Again? <Y/N> '); m.warna(7, 0);
      } },
    { baris: 1730, bagian: [
        function (m) { m.gosub(1170); },
        function (m) {
          var z = m.v.Z;
          if (z === 'Y' || z === 'y') m.kembali();
          else if (z !== 'N' && z !== 'n') m.lompat(1730);
          else m.lompat(2490);
        }
      ] },

    /* --- 1740-1840: papan informasi lubang -------------------------------- */
    { baris: 1740, jalan: function (m) {
        m.cls();
        m.v.PAR = m.baca(); m.v.YARDS = m.baca();
        m.v.LEFT = m.baca(); m.v.RIGHT = m.baca();
        m.v.DIFF = m.baca(); m.v.LNG = m.baca();
        /* FAC dibaca dan tidak pernah dipakai di mana pun. */
        m.v.FAC = m.baca();
      } },
    { baris: 1750, jalan: function (m) { m.v.LNG = m.v.LNG + 4; } },
    { baris: 1760, jalan: function (m) { m.gosub(2510); } },
    { baris: 1770, jalan: function (m) {
        m.locate(1, 1);
        m.cetak(m.chr(201) + m.ulang(26, 205) + m.chr(187)); m.barisBaru();
      } },
    { baris: 1780, jalan: function (m) {
        m.locate(2, 1);
        m.cetak(m.chr(186) + '    You Are At No.' + angka(m.v.HOLE) + 'Tee');
        m.barisBaru();
        m.locate(2, 28); m.cetak(m.chr(186)); m.barisBaru();
      } },
    { baris: 1790, jalan: function (m) {
        m.locate(3, 1); m.cetak(m.chr(186)); m.spc(5); m.cetak('Distance');
        m.warna(15, 0); m.cetak(angka(m.v.YARDS)); m.warna(3, 0);
        m.cetak('Yards'); m.barisBaru();
        m.locate(3, 28); m.cetak(m.chr(186)); m.barisBaru();
      } },
    { baris: 1800, jalan: function (m) {
        m.locate(4, 1); m.cetak(m.chr(186)); m.spc(9);
        m.cetak('Par' + angka(m.v.PAR)); m.barisBaru();
        m.locate(4, 28); m.cetak(m.chr(186)); m.barisBaru();
      } },
    { baris: 1810, jalan: function (m) {
        m.locate(5, 1);
        m.cetak(m.chr(200) + m.ulang(26, 205) + m.chr(188)); m.barisBaru();
        m.barisBaru();
      } },
    { baris: 1820, jalan: function (m) {
        m.cetak('On Your Left Is ' + m.v.Z_[m.v.LEFT]); m.barisBaru();
      } },
    { baris: 1830, jalan: function (m) {
        m.cetak('On Your Right Is ' + m.v.Z_[m.v.RIGHT]); m.barisBaru();
      } },
    { baris: 1840, jalan: function (m) {
        m.v.TOTAL = (m.v.TOTAL || 0) + m.v.PAR; m.kembali();
      } },
    /* 1850 baris yang tidak pernah dituju siapa pun. */
    { baris: 1850, jalan: function (m) {
        if (m.inkey() !== '') m.lompat(1850); else m.lompat(1350);
      } },
    data(1860), data(1870), data(1880), data(1890), data(1900), data(1910),
    data(1920), data(1930), data(1940), data(1950), data(1960), data(1970),
    data(1980), data(1990), data(2000), data(2010), data(2020), data(2030),
    data(2040), data(2050), data(2060), data(2070), data(2080), data(2090),
    data(2100), data(2110), data(2120), data(2130), data(2140), data(2150),
    data(2160), data(2170), data(2180), data(2190),

    /* --- 2200-2460: judul dan petunjuk ------------------------------------ */
    { baris: 2200, jalan: function (m) { m.untuk('XX', 2, 22, 1, 2240); } },
    { baris: 2210, jalan: function (m) {
        m.locate(m.v.XX, 1); m.cetak(m.chr(179));
      } },
    { baris: 2220, jalan: function (m) {
        m.locate(m.v.XX, 80); m.cetak(m.chr(179));
      } },
    { baris: 2230, jalan: function (m) { m.lanjutkan('XX'); } },
    { baris: 2240, jalan: function (m) {
        m.locate(1, 1);
        m.cetak(m.chr(218) + m.ulang(78, 196) + m.chr(191)); m.barisBaru();
      } },
    { baris: 2250, jalan: function (m) {
        m.locate(23, 1);
        m.cetak(m.chr(192) + m.ulang(78, 196) + m.chr(217));
      } },
    { baris: 2260, jalan: function (m) { m.locate(2, 2); m.warna(3, 0); } },
    { baris: 2270, jalan: function (m) {
        m.warna(15, 0); m.tab(33); m.cetak('P C   G O L F'); m.barisBaru();
      } },
    { baris: 2280, jalan: function (m) {
        m.locate(10, 23, 0);
        m.cetak('Would You Like Instructions? <Y/N>'); m.warna(3, 0);
      } },
    { baris: 2290, bagian: [
        function (m) { m.gosub(1170); },
        function (m) {
          var z = m.v.Z;
          if (z === 'N' || z === 'n') m.kembali();
          else if (z !== 'Y' && z !== 'y') m.lompat(2290);
        }
      ] },
    ajar(2300,  4, 13, 'Welcome to the first tee.  When asked,  you will need to'),
    ajar(2310,  5, 13, 'tell the starter your handicap (1 to 30) and indicate if'),
    ajar(2320,  6, 13, 'your game is affected by any of the problem areas listed.'),
    ajar(2330,  7, 13, 'It will be to your benefit to be honest in answering, as'),
    ajar(2340,  8, 13, 'it will emmulate your golfing abilities.'),
    ajar(2350, 10, 13, 'Before each shot, the scene will be set for you. Respond'),
    ajar(2360, 11, 13, 'by  choosing the right club from your bag and indicating'),
    ajar(2370, 12, 13, 'how hard you wish to swing   11 to 100 % .'),
    ajar(2380, 13, 13, 'Wood shots are always full hits.'),
    ajar(2390, 15, 13, 'The  game is  programmed to mix  pre-set  club  distance'),
    ajar(2400, 16, 13, "with your  indicated ` % ' of full swing to produce your"),
    ajar(2410, 17, 13, 'results.'),
    ajar(2420, 19, 13, 'Obviously, the more you  play  and  learn the subtleties'),
    ajar(2430, 20, 13, "of `club swing %,' the  better  you  will score."),
    ajar(2440, 22, 18, 'WHAT? YOU THOUGHT THIS WAS GOING TO BE EASY?'),
    { baris: 2450, jalan: function (m) {
        m.locate(25, 27); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue');
      } },
    /* 2460 GOTO — bukan GOSUB — ke subrutin tunggu tombol. RETURN di baris
       1170 nanti akan memulangkan alur ke pemanggil 2200, bukan ke sini.
       Subrutin yang dipinjam RETURN-nya. */
    { baris: 2460, jalan: function (m) { m.lompat(1170); } },
    { baris: 2470, jalan: function (m) {
        m.jebakan(10, false); m.warna(15, 0); m.locate(25, 20);
        m.cetak('Do You Wish To Leave This Game? <Y/N>    ');
        m.warna(3, m.v.O || 0);
      } },
    { baris: 2480, bagian: [
        function (m) { m.gosub(1170); },
        function (m) {
          var z = m.v.Z;
          if (z === 'N' || z === 'n') {
            m.locate(25, 1); m.spc(70);
            m.locate(25, 22); m.warna(0, 7);
            m.cetak('Strike <F10> To Leave This Game');
            m.warna(3, 0); m.jebakan(10, true); m.kembali();
          } else if (z !== 'Y' && z !== 'y') m.lompat(2480);
        }
      ] },
    { baris: 2490, jalan: function (m) {
        m.cls(); m.locate(12, 27); m.warna(15, null);
        m.cetak('Thank You For Playing'); m.barisBaru();
      } },
    { baris: 2500, jalan: function (m) { m.warna(7, null); m.jalankan('MENU'); } },

    /* --- 2510-2700: pemandangan lubang, digambar dalam perspektif --------- */
    { baris: 2510, jalan: function (m) { m.cls(); } },
    { baris: 2520, jalan: function (m) {
        m.locate(1, 41);
        m.cetak(m.chr(218) + m.ulang(37, 196) + m.chr(191)); m.barisBaru();
      } },
    { baris: 2530, jalan: function (m) { m.untuk('E', 2, 22, 1, 2560); } },
    { baris: 2540, jalan: function (m) {
        m.locate(m.v.E, 41); m.cetak(m.chr(179));
        m.locate(m.v.E, 79); m.cetak(m.chr(179)); m.barisBaru();
      } },
    { baris: 2550, jalan: function (m) { m.lanjutkan('E'); } },
    { baris: 2560, jalan: function (m) {
        m.locate(23, 41);
        m.cetak(m.chr(192) + m.ulang(17, 196) + m.chr(217) + m.chr(248) +
                m.chr(192) + m.ulang(17, 196) + m.chr(217));
        m.barisBaru();
      } },
    gambar(2570, 22, 59, [195, 196, 180]),
    gambar(2580, 21, 58, [192, 191, 32, 218, 217]),
    teks(2590, 20, 58, '\\   /'),
    teks(2600, 19, 57, '\\     /'),
    teks(2610, 18, 56, '\\       /'),
    /* 2620-2640 lorong fairway: makin panjang lubangnya (LNG kecil), makin
       jauh garis tepinya menjulur ke atas layar. */
    { baris: 2620, jalan: function (m) { m.untuk('E', 17, m.v.LNG, -1, 2650); } },
    { baris: 2630, jalan: function (m) {
        m.locate(m.v.E, 55); m.cetak(m.chr(179)); m.barisBaru();
        m.locate(m.v.E, 65); m.cetak(m.chr(179)); m.barisBaru();
      } },
    { baris: 2640, jalan: function (m) { m.lanjutkan('E'); } },
    { baris: 2650, jalan: function (m) {
        m.locate(m.v.LNG - 1, 56); m.cetak('/       \\'); m.barisBaru();
      } },
    { baris: 2660, jalan: function (m) {
        m.warna(2, 0); m.locate(m.v.LNG - 2, 57);
        m.cetak(' ' + m.ulang(5, 178) + ' '); m.barisBaru();
      } },
    { baris: 2670, jalan: function (m) {
        m.locate(m.v.LNG - 3, 58); m.cetak(m.ulang(5, 178)); m.barisBaru();
        m.warna(3, 0);
      } },
    { baris: 2680, jalan: function (m) {
        var t = [2710, 2800, 2890, 2900, 3010, 3070][m.v.RIGHT - 2];
        if (t) m.gosub(t);
      } },
    { baris: 2690, jalan: function (m) {
        var t = [3110, 3200, 3290, 3300, 3410, 3470][m.v.LEFT - 2];
        if (t) m.gosub(t);
      } },
    { baris: 2700, jalan: function (m) { m.kembali(); } },

    /* 2710-3100: enam bahaya di sisi kanan, satu subrutin masing-masing. */
    { baris: 2710, jalan: function (m) {
        m.warna(6, 0); m.locate(20, 62); m.cetak(m.chr(177)); m.barisBaru();
      } },
    ulangKode(2720, 19, 63, 3, 177),
    ulangKode(2730, 18, 64, 4, 177),
    { baris: 2740, jalan: function (m) { m.untuk('E', 17, m.v.LNG + 1, -1, 2770); } },
    { baris: 2750, jalan: function (m) {
        m.locate(m.v.E, 65); m.cetak(m.ulang(5, 177)); m.barisBaru();
      } },
    { baris: 2760, jalan: function (m) { m.lanjutkan('E'); } },
    dinamis(2770, 65, 4, 177),
    dinamis(2780, 64, 4, 177, -1),
    { baris: 2790, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    { baris: 2800, jalan: function (m) {
        m.warna(2, 0); m.locate(20, 62); m.cetak(m.chr(5)); m.barisBaru();
      } },
    ulangKode(2810, 19, 63, 3, 5),
    ulangKode(2820, 18, 64, 4, 5),
    { baris: 2830, jalan: function (m) { m.untuk('E', 17, m.v.LNG + 1, -1, 2860); } },
    { baris: 2840, jalan: function (m) {
        m.locate(m.v.E, 65); m.cetak(m.ulang(4, 5)); m.barisBaru();
      } },
    { baris: 2850, jalan: function (m) { m.lanjutkan('E'); } },
    dinamis(2860, 65, 4, 5),
    dinamis(2870, 64, 4, 5, -1),
    { baris: 2880, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    /* 2890 "Adjacent Fairway" tidak digambar apa-apa. */
    { baris: 2890, jalan: function (m) { m.kembali(); } },
    { baris: 2900, jalan: function (m) {
        m.warna(14, 0); m.locate(17, 65); m.cetak(m.ulang(4, 219)); m.barisBaru();
      } },
    ulangKode(2910, 16, 65, 4, 219),
    ulangKode(2920, 15, 65, 4, 219),
    ulangKode(2930, 14, 65, 4, 219),
    { baris: 2940, jalan: function (m) { if (m.v.LNG > 8) m.lompat(3000); } },
    ulangKode(2950, 11, 65, 4, 219),
    ulangKode(2960, 10, 65, 4, 219),
    ulangKode(2970,  9, 65, 4, 219),
    ulangKode(2980,  8, 65, 4, 219),
    ulangKode(2990,  7, 65, 4, 219),
    { baris: 3000, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    { baris: 3010, jalan: function (m) {
        m.warna(3, 0); m.untuk('E', 16, m.v.LNG + 1, -1, 3040);
      } },
    { baris: 3020, jalan: function (m) {
        m.locate(m.v.E, 64); m.cetak(m.ulang(7, 175)); m.barisBaru();
      } },
    { baris: 3030, jalan: function (m) { m.lanjutkan('E'); } },
    ulangKode(3040, 17, 65, 5, 175),
    dinamis(3050, 65, 5, 175),
    { baris: 3060, jalan: function (m) { m.kembali(); } },
    /* 3070-3090 "Out Of Bounds" ditulis TEGAK, satu huruf per baris. */
    { baris: 3070, bagian: [
        function (m) { m.v.X = 0; m.v.Z = 'OUT OF BOUNDS'; },
        function (m) { m.untuk('E', 7, 21, 1, 3100); }
      ] },
    { baris: 3080, jalan: function (m) {
        m.v.X = m.v.X + 1;
        m.locate(m.v.E, 70); m.cetak(m.v.Z.substr(m.v.X - 1, 1)); m.barisBaru();
      } },
    { baris: 3090, jalan: function (m) { m.lanjutkan('E'); } },
    { baris: 3100, jalan: function (m) { m.kembali(); } },

    /* 3110-3500: enam bahaya sisi kiri, cermin dari yang kanan. */
    { baris: 3110, jalan: function (m) {
        m.warna(6, 0); m.locate(20, 58); m.cetak(m.chr(176)); m.barisBaru();
      } },
    ulangKode(3120, 19, 55, 3, 176),
    ulangKode(3130, 18, 53, 4, 176),
    { baris: 3140, jalan: function (m) { m.untuk('E', 17, m.v.LNG + 1, -1, 3170); } },
    { baris: 3150, jalan: function (m) {
        m.locate(m.v.E, 51); m.cetak(m.ulang(5, 176)); m.barisBaru();
      } },
    { baris: 3160, jalan: function (m) { m.lanjutkan('E'); } },
    dinamis(3170, 53, 4, 176),
    dinamis(3180, 54, 4, 176, -1),
    { baris: 3190, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    { baris: 3200, jalan: function (m) {
        m.warna(2, 0); m.locate(20, 58); m.cetak(m.chr(5)); m.barisBaru();
      } },
    ulangKode(3210, 19, 55, 3, 5),
    ulangKode(3220, 18, 53, 4, 5),
    { baris: 3230, jalan: function (m) { m.untuk('E', 17, m.v.LNG + 1, -1, 3260); } },
    { baris: 3240, jalan: function (m) {
        m.locate(m.v.E, 52); m.cetak(m.ulang(4, 5)); m.barisBaru();
      } },
    { baris: 3250, jalan: function (m) { m.lanjutkan('E'); } },
    dinamis(3260, 52, 4, 5),
    dinamis(3270, 53, 4, 5, -1),
    { baris: 3280, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    { baris: 3290, jalan: function (m) { m.kembali(); } },
    { baris: 3300, jalan: function (m) {
        m.warna(15, 0); m.locate(17, 54); m.cetak(m.ulang(4, 219)); m.barisBaru();
      } },
    ulangKode(3310, 16, 54, 4, 219),
    ulangKode(3320, 15, 54, 4, 219),
    ulangKode(3330, 14, 54, 4, 219),
    /* 3340 melompat ke 3000 — yaitu ekor subrutin SISI KANAN. Dua subrutin
       yang berbagi baris penutup. */
    { baris: 3340, jalan: function (m) { if (m.v.LNG > 8) m.lompat(3000); } },
    ulangKode(3350, 11, 54, 4, 219),
    ulangKode(3360, 10, 54, 4, 219),
    ulangKode(3370,  9, 54, 4, 219),
    ulangKode(3380,  8, 54, 4, 219),
    ulangKode(3390,  7, 53, 4, 219),
    { baris: 3400, jalan: function (m) { m.warna(3, 0); m.kembali(); } },
    { baris: 3410, jalan: function (m) {
        m.warna(3, 0); m.untuk('E', 16, m.v.LNG + 1, -1, 3440);
      } },
    { baris: 3420, jalan: function (m) {
        m.locate(m.v.E, 50); m.cetak(m.ulang(7, 175)); m.barisBaru();
      } },
    { baris: 3430, jalan: function (m) { m.lanjutkan('E'); } },
    ulangKode(3440, 17, 51, 5, 175),
    dinamis(3450, 51, 5, 175),
    { baris: 3460, jalan: function (m) { m.kembali(); } },
    { baris: 3470, bagian: [
        function (m) { m.v.X = 0; m.v.Z = 'OUT OF BOUNDS'; },
        function (m) { m.untuk('E', 7, 21, 1, 3500); }
      ] },
    { baris: 3480, jalan: function (m) {
        m.v.X = m.v.X + 1;
        m.locate(m.v.E, 50); m.cetak(m.v.Z.substr(m.v.X - 1, 1)); m.barisBaru();
      } },
    { baris: 3490, jalan: function (m) { m.lanjutkan('E'); } },
    { baris: 3500, jalan: function (m) { m.kembali(); } },

    /* --- 3510-3610: penyunting nama, sepupu DRAW.BAS dan SUB.BAS ---------- */
    { baris: 3510, jalan: function (m) {
        m.v.ZH = '';
        if (m.inkey() !== '') m.lompat(3510);
      } },
    { baris: 3520, jalan: function (m) {
        m.v.ZI = m.inkey();
        if (m.v.ZI === '') m.lompat(3520);
      } },
    { baris: 3530, jalan: function (m) {
        if (m.v.ZI === m.chr(13)) {
          m.v.ZA = ((m.v.ZH || '') + '        ').slice(0, 8);
          m.kembali();
        }
      } },
    { baris: 3540, jalan: function (m) {
        if (m.v.ZI === m.chr(8)) m.lompat(3600);
      } },
    { baris: 3550, jalan: function (m) {
        if (m.v.ZI.length > 1) {
          m.lompat(m.v.ZI.slice(-1) === m.chr(75) ? 3600 : 3520);
        }
      } },
    /* 3560 batasnya 10 aksara, padahal medannya cuma 8 dan baris 100 cuma
       mengambil tujuh. Tiga aksara terakhir diketik, terlihat, lalu hilang. */
    { baris: 3560, jalan: function (m) {
        if ((m.v.ZH || '').length > 10) m.lompat(3520);
      } },
    { baris: 3570, jalan: function (m) {
        if (m.v.ZI < 'a' || m.v.ZI > 'z') m.lompat(3590);
      } },
    { baris: 3580, jalan: function (m) {
        m.v.ZI = m.chr(m.v.ZI.charCodeAt(0) - 32);
      } },
    { baris: 3590, jalan: function (m) {
        m.v.ZH = (m.v.ZH || '') + m.v.ZI; m.cetak(m.v.ZI); m.lompat(3520);
      } },
    { baris: 3600, jalan: function (m) {
        if ((m.v.ZH || '').length < 1) m.lompat(3520);
      } },
    { baris: 3610, jalan: function (m) {
        m.cetak(m.chr(29) + ' ' + m.chr(29));
        m.v.ZH = m.v.ZH.slice(0, m.v.ZH.length - 1);
        m.lompat(3520);
      } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }
  function data(nomor) { return { baris: nomor, jalan: function () { } }; }

  function angka(n) {
    var b = Math.round(n * 100) / 100;
    return (b < 0 ? '' : ' ') + String(b) + ' ';
  }

  function ajar(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }

  function teks(nomor, b, k, isi) { return ajar(nomor, b, k, isi); }

  function gambar(nomor, b, k, kode) {
    return { baris: nomor, jalan: function (m) {
      var s = '', i;
      for (i = 0; i < kode.length; i++) s += m.chr(kode[i]);
      m.locate(b, k); m.cetak(s); m.barisBaru();
    } };
  }

  function ulangKode(nomor, b, k, n, kode) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(m.ulang(n, kode)); m.barisBaru();
    } };
  }

  /* Baris yang barisnya bergantung LNG — panjang lubangnya. */
  function dinamis(nomor, k, n, kode, geser) {
    return { baris: nomor, jalan: function (m) {
      m.locate(m.v.LNG + (geser || 0), k); m.cetak(m.ulang(n, kode));
      m.barisBaru();
    } };
  }

  function tas(nomor, kiri, kanan) {
    return { baris: nomor, jalan: function (m) {
      m.tab(5); m.cetak(kiri); m.tab(20); m.cetak(kanan); m.barisBaru();
    } };
  }

  function hasil(nomor, selisih, nama, pesan) {
    return { baris: nomor, jalan: function (m) {
      if (nomor === 1530) { m.locate(10, 15); m.warna(15, null); }
      if (m.v.STK === m.v.PAR + selisih) {
        m.v[nama] = (m.v[nama] || 0) + 1;
        m.cetak(pesan); m.barisBaru();
      }
    } };
  }

  function cacah(nomor, b, k, nama, label) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(angka(m.v[nama] || 0) + label); m.barisBaru();
    } };
  }

  /* `RIGHT$(TIME$,2)` — jam yang maju tetap. Di program ini ia dibaca di
     dalam gelung tunggu-tombol, jadi majunya ikut menandai berapa lama
     pemain berpikir. */
  function detik(m) {
    m.v.JAM = ((m.v.JAM || 0) + 7) % 60;
    return m.v.JAM;
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['GOLF'] = {
    nama: 'GOLF',
    judul: 'PC Golf',
    sumber: 'GOLF',
    berkas: 'run/GOLF.BAS',
    tabel: tabel,
    benih: 7,
    data: [
      'Fairway', 'Deep Rough', 'Trees', 'Adjacent Fairway', 'Sand Trap',
      'A Big Lake', 'Out Of Bounds',
      5, 501, 2, 3, 60, 6, 3, 3, 165, 2, 6, 60, 6, 1, 5, 475, 3, 3, 50, 7, 3,
      4, 289, 3, 3, 35, 8, 2, 4, 340, 7, 2, 80, 6, 2, 4, 365, 7, 6, 80, 4, 2,
      3, 185, 7, 2, 80, 4, 1, 4, 330, 7, 2, 80, 6, 2, 4, 412, 7, 2, 80, 2, 2,
      4, 440, 7, 3, 80, 8, 3, 4, 420, 7, 4, 80, 9, 3, 3, 145, 2, 6, 85, 8, 1,
      5, 535, 7, 2, 80, 5, 3, 4, 340, 3, 3, 45, 5, 2, 4, 380, 6, 6, 85, 4, 2,
      3, 165, 3, 3, 34, 6, 1, 4, 410, 7, 2, 85, 2, 2, 5, 450, 3, 3, 45, 8, 3,
      4, 412, 6, 6, 80, 2, 2, 4, 446, 3, 3, 25, 8, 2, 5, 630, 3, 3, 35, 2, 3,
      3, 210, 6, 6, 75, 2, 1, 4, 315, 3, 1, 40, 7, 2, 4, 454, 3, 6, 85, 7, 3,
      3, 154, 6, 6, 85, 7, 1, 5, 625, 3, 6, 85, 2, 3, 4, 444, 3, 3, 25, 8, 3,
      3, 215, 1, 7, 85, 12, 2, 5, 556, 2, 2, 30, 4, 3, 4, 413, 3, 6, 85, 2, 2,
      4, 450, 4, 4, 25, 8, 3, 4, 465, 3, 7, 85, 7, 3, 5, 630, 2, 2, 15, 2, 3,
      3, 147, 6, 6, 85, 8, 1, 4, 432, 2, 3, 35, 8, 3, 4, 472, 7, 6, 85, 7, 3,
      5, 628, 3, 3, 10, 2, 3, 3, 235, 6, 6, 75, 10, 2, 4, 531, 3, 6, 65, 5, 3,
      4, 465, 2, 7, 65, 7, 3, 4, 543, 6, 2, 60, 4, 3, 3, 312, 6, 6, 85, 7, 2,
      5, 622, 2, 3, 25, 2, 3, 4, 476, 2, 2, 35, 7, 3, 4, 465, 3, 2, 40, 7, 3,
      3, 197, 6, 3, 75, 3, 1, 4, 345, 6, 2, 70, 5, 2, 5, 623, 3, 2, 30, 2, 3,
      4, 456, 2, 3, 35, 7, 3, 4, 398, 3, 3, 35, 3, 2, 3, 300, 6, 7, 75, 8, 2,
      5, 621, 2, 3, 45, 2, 3, 4, 467, 3, 3, 44, 7, 3, 4, 489, 2, 2, 32, 6, 3
    ],

    arsitektur: {
      judul: 'Alur GOLF.BAS',
      simpul: [
        { id: 'siap', baris: '40-230', jenis: 'mulai',
          teks: ['Nama, handicap,', 'satu kelemahan yang dipilih sendiri'] },
        { id: 'lapangan', baris: '1220-1290', jenis: 'putusan',
          teks: ['Pilih lapangan;', 'baca lewat 126 angka per lapangan'] },
        { id: 'lubang', baris: '1740-1840',
          teks: ['Baca 7 angka lubang,', 'gambar pemandangannya'] },
        { id: 'tongkat', baris: '280-500', jenis: 'putusan',
          teks: ['Pilih tongkat,', 'lalu persentase ayunan'] },
        { id: 'pukul', baris: '530-560',
          teks: ['Jarak, simpangan,', 'lalu Pythagoras ke green'] },
        { id: 'nasib', baris: '570-740', jenis: 'putusan',
          teks: ['Hook, slice, pohon,', 'pasir, atau lurus'] },
        { id: 'denda', baris: '1420', jenis: 'galat',
          teks: ['Air atau keluar lapangan:', 'satu pukulan denda'] },
        { id: 'green', baris: '750-1140',
          teks: ['Bola menggelinding di baris 22,', 'bolak-balik melewati lubang'] },
        { id: 'nilai', baris: '1530-1600',
          teks: ['Birdie, par, bogey,', 'atau hole in one'] },
        { id: 'kartu', baris: '1610-1730', jenis: 'keluar',
          teks: ['Lubang ke-19:', 'kartu skor akhir'] }
      ],
      panah: [
        { dari: 'siap', ke: 'lapangan' },
        { dari: 'lapangan', ke: 'lubang' },
        { dari: 'lubang', ke: 'tongkat' },
        { dari: 'tongkat', ke: 'pukul' },
        { dari: 'pukul', ke: 'nasib' },
        { dari: 'nasib', ke: 'tongkat', label: 'masih jauh' },
        { dari: 'nasib', ke: 'denda', label: 'air / OB', jenis: 'galat' },
        { dari: 'denda', ke: 'tongkat', jenis: 'galat' },
        { dari: 'nasib', ke: 'green', label: 'dekat lubang' },
        { dari: 'green', ke: 'green', label: 'putt berikutnya' },
        { dari: 'green', ke: 'nilai', label: 'bola masuk' },
        { dari: 'nilai', ke: 'lubang', label: 'lubang berikutnya' },
        { dari: 'nilai', ke: 'kartu', label: 'lubang ke-19' }
      ]
    },

    pseudokode: [
      { baris: 1210, tingkat: 0, teks: 'baca tujuh nama medan: Fairway, Deep Rough, Trees, &hellip;' },
      { baris: 230, tingkat: 0, teks: 'pemain memilih <b>kelemahannya sendiri</b>: hook, slice, pasir, putting&hellip;' },
      { baris: 1290, tingkat: 0, teks: 'pilih lapangan dengan <b>membaca lewat</b> 126 angka per lapangan' },
      { baris: 1740, tingkat: 0, teks: '<b>ULANG 18 lubang:</b> baca par, jarak, bahaya kiri/kanan, kesulitan, panjang' },
      { baris: 2510, tingkat: 1, teks: 'gambar pemandangannya: fairway menyempit + dua bahaya' },
      { baris: 280, tingkat: 1, teks: '<b>ULANG sampai bola dekat:</b> pilih tongkat dan persentase ayunan' },
      { baris: 530, tingkat: 2, teks: '<code>jarak = f(handicap, nomor tongkat, acak) &times; persen ayunan</code>' },
      { baris: 540, tingkat: 2, teks: 'simpangan dari garis, lalu <b>Pythagoras</b> ke jarak tersisa' },
      { baris: 590, tingkat: 2, teks: 'simpangan lebih besar dari batas? <b>kelemahan yang dipilih tadi berlaku</b>' },
      { baris: 1420, tingkat: 2, teks: 'masuk air atau OB: denda satu pukulan, bola dikembalikan' },
      { baris: 750, tingkat: 1, teks: 'di green: bola menggelinding di baris 22, arah dibalik kalau kelewatan' },
      { baris: 920, tingkat: 2, teks: 'sesudah enam putt, bolanya <b>dianggap masuk</b>' },
      { baris: 1530, tingkat: 1, teks: 'bandingkan dengan par: eagle, birdie, bogey&hellip;' }
    ],

    perintahAsli: 'run\\GOLF.bat',
    catatanAsli: 'Di DOSBox-X tiap hasil lubang punya bunyinya sendiri &mdash; ' +
      'tujuh pola SOUND berbeda di baris 1530-1590, dari nada rendah untuk ' +
      'double bogey sampai lengkingan untuk hole in one.',

    penyimpangan: [
      '<b><code>Z(10)</code> jadi <code>Z_</code></b> karena baris 3070 ' +
      'memakai <code>Z</code> sebagai teks biasa ("OUT OF BOUNDS").',

      '<b><code>SOUND</code> diam</b>, jadi tujuh bunyi hasil lubang di baris ' +
      '1530-1590 tidak terdengar, dan <b><code>COLOR 31</code> di baris 1040 ' +
      'tidak berkedip</b> &mdash; bolanya seharusnya berkedip waktu ' +
      'menggelinding.',

      '<b>Pengacaknya berbenih tetap.</b> Ini penting untuk program INI ' +
      'khususnya: baris 1170 menyemai ulang tiap putaran gelung tunggu-tombol, ' +
      'jadi di mesin sungguhan hasilnya bergantung pada <b>saat pemain ' +
      'menekan tombol</b>. Di penelusur jamnya maju tetap, jadi keacakannya ' +
      'bisa diulang &mdash; tapi sifat "ditentukan oleh jari pemain" itu ' +
      'hilang.',

      '<b>Gelung tunda habis seketika</b> (baris 1190).'
    ],

    pelajaran: {
      ringkas: 'Golf 18 lubang di tiga lapangan. Yang layak dipelajari: ' +
        'pengacak yang disemai oleh jari pemain, dan pemilihan lapangan yang ' +
        'seluruhnya berupa posisi penunjuk DATA.',
      pelajari: [
        ['Keacakan dari jari pemain',
         'Baris 1170 adalah gelung menunggu tombol &mdash; dan ia memanggil ' +
         '<code>RANDOMIZE VAL(RIGHT$(TIME$,2))</code> di <b>tiap putaran</b> ' +
         'selama tidak ada tombol ditekan. Jadi benihnya adalah detik pada ' +
         'saat pemain akhirnya menekan. Sumber keacakan yang gratis, tidak ' +
         'bisa ditebak, dan sepenuhnya berasal dari manusianya. Ide yang ' +
         'sama masih dipakai hari ini &mdash; gerakan tetikus sebagai sumber ' +
         'entropi.'],
        ['Memilih lapangan dengan membaca lewat',
         'Baris 1290: <code>FOR D=1 TO ((C-1)*126):READ E:NEXT</code>. Tiap ' +
         'lapangan 18 lubang &times; 7 angka = 126. Untuk lapangan ketiga, ' +
         'buang 252 angka. Sesudah baris itu <b>tidak ada indeks lapangan di ' +
         'mana pun</b> &mdash; yang tersisa cuma posisi penunjuk DATA. ' +
         'Gagasan yang sama dengan pemilih labirin di MAZE.BAS.'],
        ['Pemain memilih kelemahannya sendiri',
         'Baris 160-210 menawarkan enam pilihan: hook, slice, jarak buruk, ' +
         'pemain sempurna, pasir, putting buruk. Yang dipilih disimpan di ' +
         '<code>B</code>, dan dipakai di tiga tempat berbeda &mdash; baris ' +
         '590 (arah pukulan melenceng), 660 (keluar dari pasir), dan 930 ' +
         '(ketelitian putting). Satu angka yang mengubah tiga rumus.'],
        ['Pythagoras untuk jarak ke green',
         'Baris 540: <code>GRN=INT(SQR(OF^2+ABS(YARDS-DIST)^2))</code>. ' +
         'Simpangan dari garis dan sisa jarak lurus adalah dua sisi siku-siku; ' +
         'jarak sebenarnya ke lubang adalah sisi miringnya. Satu baris, dan ' +
         'pukulan yang melenceng jadi terasa mahal dengan sendirinya.'],
        ['Bola yang menggelinding melewati lubang',
         'Baris 1040-1080 menggerakkan bola satu kolom per langkah di baris ' +
         '22. Kalau jaraknya negatif, arahnya (<code>FF</code>) dibalik dan ' +
         'jaraknya dipositifkan &mdash; jadi putt yang terlalu keras ' +
         'menggelinding lewat, lalu balik lagi dari sisi lain. Fisika yang ' +
         'seluruhnya berupa satu tanda.']
      ],
      hindari: [
        ['GOTO ke dalam subrutin, meminjam RETURN-nya',
         'Baris 2460 <code>GOTO 1170</code>. Baris 1170 adalah subrutin ' +
         'tunggu-tombol, dan <code>RETURN</code>-nya akan memulangkan alur ke ' +
         'pemanggil <b>2200</b>, bukan ke 2460. Bekerja, dan tidak ada satu ' +
         'pun petunjuk di kode bahwa itulah yang dimaksud.'],
        ['Dua subrutin yang berbagi baris penutup',
         'Baris 3340 (bahaya sisi KIRI) melompat ke 3000 (penutup bahaya sisi ' +
         'KANAN). Menghemat empat baris, dan menyatukan dua hal yang tidak ' +
         'punya hubungan.'],
        ['Batas panjang yang tidak cocok dengan medannya',
         'Baris 3560 menerima sampai <b>10</b> aksara, baris 3530 menaruhnya ' +
         'di medan <b>8</b> aksara, dan baris 100 mengambil <b>7</b> yang ' +
         'pertama. Tiga aksara terakhir diketik, terlihat di layar, lalu ' +
         'hilang tanpa penjelasan.'],
        ['Larik yang di-DIM dan tidak pernah dipakai',
         'Baris 40: <code>DIM Z(10),A(10)</code>. <code>A()</code> tidak ' +
         'muncul sekali pun di seluruh program &mdash; yang ada cuma ' +
         '<code>A</code> skalar, handicap pemain.'],
        ['Nilai yang dibaca dan tidak pernah dipakai',
         'Baris 1740 membaca tujuh angka per lubang; yang ketujuh, ' +
         '<code>FAC</code>, tidak muncul lagi di mana pun. Delapan belas ' +
         'lubang kali tiga lapangan = 54 angka yang tidak berarti apa-apa.']
      ]
    },

    penjelasan: [
      { judul: 'Pengacak yang disemai oleh jari pemain',
        isi: [
          'Pertanyaan lama: dari mana angka acak yang benar-benar tak tertebak ' +
          'di mesin yang tidak punya apa pun yang acak?',
          'Jawaban program ini ada di baris 1170:',
          '<code>1170 Z=INKEY$:IF Z="" THEN RANDOMIZE VAL(RIGHT$(TIME$,2)):GOTO 1170 ELSE RETURN</code>',
          'Baca alurnya. Selama <b>tidak ada tombol ditekan</b>, program ' +
          'menyemai ulang pengacaknya dengan detik jam &mdash; lalu mengulang. ' +
          'Ribuan kali per detik.',
          'Begitu pemain menekan tombol, gelungnya berhenti. Benih yang ' +
          'terakhir dipasang adalah <b>detik pada saat itu</b>.',
          'Jadi hasil pukulan berikutnya ditentukan oleh <b>kapan pemain ' +
          'menekan tombolnya</b> &mdash; sesuatu yang tidak diketahui program, ' +
          'tidak diketahui pemain, dan tidak bisa diulang.',
          'Bandingkan dengan CRAPS.BAS dan MASTER.BAS, yang menyemai ulang di ' +
          'dalam gelung <b>kerja</b> &mdash; di sana penyemaian ulang cuma ' +
          'membuang deret yang sedang berjalan. Di sini ia berada di gelung ' +
          '<b>tunggu</b>, dan itu membuat seluruh perbedaannya.',
          'Idenya masih hidup: sistem operasi modern mengumpulkan entropi dari ' +
          'jarak antar-ketukan papan ketik dan gerakan tetikus, dengan alasan ' +
          'yang persis sama.',
          'Di penelusur jamnya maju tetap tujuh detik tiap dibaca, jadi ' +
          'penelusurannya bisa diulang &mdash; tapi sifat yang membuat baris ' +
          'ini menarik justru hilang. Itu harga yang harus dibayar supaya titik ' +
          'henti bisa dipasang.'
        ] },
      { judul: 'Sebuah lubang golf dalam tujuh angka',
        isi: [
          'Baris 1740 membaca satu lubang:',
          '<code>1740 CLS:READ PAR,YARDS,LEFT,RIGHT,DIFF,LNG,FAC</code>',
          'Tujuh angka, dan itulah seluruh lubangnya:',
          '<b>PAR</b> dan <b>YARDS</b> jelas. <b>LEFT</b> dan <b>RIGHT</b> ' +
          'adalah nomor medan (1 = fairway, 5 = pasir, 6 = danau, 7 = luar ' +
          'lapangan) &mdash; dan nomor itu dipakai dua kali: untuk ' +
          'menampilkan namanya (baris 1820-1830, lewat <code>Z(LEFT)</code>) ' +
          'dan untuk memilih subrutin yang menggambarnya (baris 2680-2690, ' +
          'lewat <code>ON LEFT-1 GOSUB</code>).',
          '<b>DIFF</b> adalah ambang batas kesulitan: baris 590 ' +
          'membandingkannya dengan simpangan pukulan untuk memutuskan apakah ' +
          'bolanya melenceng ke medan sebelah.',
          '<b>LNG</b> adalah baris layar tempat green digambar &mdash; makin ' +
          'kecil, makin jauh green-nya terlihat. Jadi "panjang lubang" dan ' +
          '"gambar di layar" adalah satu angka yang sama.',
          '<b>FAC</b> tidak dipakai sama sekali. Lima puluh empat angka di ' +
          'DATA yang tidak berarti apa-apa &mdash; barangkali sisa rancangan ' +
          'yang berubah, dan tidak ada yang berani membuangnya karena itu akan ' +
          'menggeser seluruh penunjuk DATA.',
          'Dan itulah harga dari "memilih lapangan dengan membaca lewat": ' +
          'angka 126 di baris 1290 <b>harus</b> cocok dengan jumlah angka per ' +
          'lapangan. Membuang FAC berarti mengubahnya jadi 108, dan lupa ' +
          'melakukannya berarti lapangan kedua dan ketiga membaca angka yang ' +
          'salah tanpa satu pun pesan galat.'
        ] },
      { judul: 'Satu variabel, tiga rumus',
        isi: [
          'Di awal permainan pemain memilih kelemahannya sendiri dari enam ' +
          'pilihan (baris 160-210), dan jawabannya disimpan di <code>B</code>.',
          'Yang menarik: <code>B</code> tidak dipakai di satu tempat, ' +
          'melainkan di <b>tiga rumus yang berbeda</b>:',
          'Baris 590: <code>ON B+1 GOTO 610,620</code> &mdash; kalau ' +
          'pukulannya melenceng, arah melencengnya ditentukan pilihan tadi. ' +
          '<code>B=0</code> hook (ke kiri), <code>B=1</code> slice (ke kanan), ' +
          'dan nilai lain tidak melompat ke mana-mana &mdash; jadi tidak ada ' +
          'kecenderungan arah.',
          'Baris 660: <code>IF B=4 THEN X=(RND*100-A) ELSE X=(RND*150-A)</code> ' +
          '&mdash; pemain yang memilih "sand trap play" punya peluang lebih ' +
          'kecil keluar dari pasir.',
          'Baris 930: <code>IF B=5 THEN GRN=GRN-PUTT*(4+1*RND)+1 ELSE ...</code> ' +
          '&mdash; pemain yang memilih "poor putting" dapat rentang acak yang ' +
          'lebih sempit, jadi lebih sulit menyetel kekuatan putt-nya.',
          'Tiga tempat, tiga rumus berbeda, satu angka. Ini kebalikan dari ' +
          '<code>P</code> di CRAPS.BAS (satu nilai yang membalik seluruh ' +
          'aturan): di sini satu nilai memberi <b>bumbu</b> pada tiga aturan ' +
          'yang tetap berlaku semuanya.'
        ] }
    ]
  };
})(window);
