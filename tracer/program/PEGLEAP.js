/* ===========================================================================
   PEGLEAP.js — porting minimalis PEGLEAP.BAS sebagai tabel baris.

   Program kesembilan, dan yang pertama memakai KURSOR sebagai alat tunjuk.
   Tidak ada `INPUT`, tidak ada nomor kotak yang diketik: pemain menggerakkan
   kursor dengan tombol panah lalu menekan Enter. Dua kali — sekali untuk pasak
   yang melompat, sekali untuk lubang tujuannya.

   Yang ditagih program ini dari mesinnya:

   1. JEBAKAN TOMBOL PANAH. `ON KEY(11..14)` — 11 atas, 12 kiri, 13 kanan,
      14 bawah, penomoran GW-BASIC. Selama jebakannya terpasang, panah TIDAK
      sampai ke `INKEY$`; ia langsung memanggil penanganya.
   2. `KEY(n) STOP` — keadaan KETIGA di samping ON dan OFF. Tombolnya tetap
      diingat, penjemputannya ditunda sampai `KEY(n) ON` berikutnya. Baris
      410-470 memakainya sebagai gelung.
   3. KURSOR SEBAGAI PENYIMPAN KEADAAN. Posisi pilihan pemain tidak disimpan
      di variabel mana pun — ia DIBACA KEMBALI dari `CSRLIN` dan `POS(0)`
      (baris 480-490). Layar yang mengingat, bukan program.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Gelung tunda `FOR DD=1 TO 1000:NEXT` di baris 760 habis seketika.
   - `COLOR 23,0` berarti putih BERKEDIP di atas biru (7 + 16); kedipnya
     tidak ditiru.
   - Baris 1400 dimodelkan sebagai GALAT SINTAKS. Lihat catatan di sana:
     kalau permainan berakhir dengan tepat dua pasak tersisa, program aslinya
     kemungkinan besar berhenti dengan `Syntax error in 1400`.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Tiga baris gambar satu petak, dari balok CP437. */
  function atas(n)   { return ulang(n, chr(218) + chr(196) + chr(196) + chr(196) + chr(191)); }
  function bawah(n)  { return ulang(n, chr(192) + chr(196) + chr(196) + chr(196) + chr(217)); }
  function isi(pola) {
    return pola.split('').map(function (p) {
      return chr(179) + (p === 'o' ? ' o ' : '   ') + chr(179);
    }).join(' ');
  }
  function ulang(n, satu) {
    var keluar = [], i;
    for (i = 0; i < n; i++) keluar.push(satu);
    return keluar.join(' ');
  }
  function chr(k) { return String.fromCharCode(k); }

  /* Baris papan: [nomorBaris, kolomTAB, teks]. Papan salib klasik: tiga di
     atas, tujuh di tengah, tiga di bawah — 33 petak, satu lubang di pusat. */
  function petak(nomor, tab, teks) {
    return { baris: nomor, jalan: function (m) {
      m.tab(tab); m.cetak(teks); m.barisBaru();
    } };
  }

  var tabel = [

    /* 10 SCREEN:COLOR:KEY OFF:GOSUB 1590:GOSUB 1910 */
    { baris: 10, bagian: [
        function (m) { m.warna(3, 0); },
        function (m) { m.gosub(1590); },   /* layar judul + petunjuk  */
        function (m) { m.gosub(1910); }    /* pasang jebakan F1-F9    */
      ] },
    { baris: 15, jalan: function (m) { m.pasangJebakan(10, 1830); } },
    { baris: 20, jalan: function (m) { m.v['PEG$'] = 'o'; m.v['HOLE$'] = ' '; } },
    { baris: 30, jalan: function (m) { m.dim('B_', 70); m.dim('T_', 9, 9); m.dim('XY', 9, 9); } },

    /* 40-100 bangun papan dalam ingatan.
       T(R,C) = 5 petak yang boleh dipakai, -5 di luar papan salib.
       Syarat di baris 50-80 memilih bentuk salibnya: kolom 4-6 ATAU baris
       4-6, kecuali keempat tepinya. */
    { baris: 40, bagian: [
        function (m) { m.cls(); m.v.XLIN = 1; m.v.XPOS = 1; },
        function (m) { m.gosub(1880); },
        function (m) { m.untuk('R', 1, 9, 1, 110); },
        function (m) { m.untuk('C', 1, 9, 1, 100); }
      ] },
    { baris: 50, jalan: function (m) {
        var R = m.v.R;
        if ((R - 4) * (R - 5) * (R - 6) === 0) m.lompat(80);
      } },
    { baris: 60, jalan: function (m) {
        var C = m.v.C;
        if ((C - 4) * (C - 5) * (C - 6) === 0) m.lompat(80);
      } },
    { baris: 70, jalan: function (m) {
        m.v.T_[m.v.R][m.v.C] = -5; m.lompat(100);
      } },
    { baris: 80, jalan: function (m) {
        var R = m.v.R, C = m.v.C;
        if ((R - 1) * (C - 1) * (R - 9) * (C - 9) === 0) m.lompat(70);
      } },
    /* 90 T(R,C)=5:READ XY(R,C)
       Satu nilai DATA per petak yang sah — dan DATA yang sama nanti dibaca
       ULANG oleh baris 330 untuk keperluan yang berbeda. Satu daftar, dua
       pekerjaan. */
    { baris: 90, jalan: function (m) {
        m.v.T_[m.v.R][m.v.C] = 5;
        m.v.XY[m.v.R][m.v.C] = m.baca();
      } },
    { baris: 100, bagian: [
        function (m) { m.lanjutkan('C'); },
        function (m) { m.lanjutkan('R'); }
      ] },
    { baris: 110, bagian: [
        function (m) { m.v.T_[5][5] = 0; },      /* lubang di pusat */
        function (m) { m.barisBaru(); }
      ] },

    /* 120-320 gambar papannya. */
    petak(120, 32, atas(3)),
    petak(130, 32, isi('ooo')),
    petak(140, 32, bawah(3)),
    petak(150, 32, atas(3)),
    petak(160, 32, isi('ooo')),
    petak(170, 32, bawah(3)),
    petak(180, 20, atas(7)),
    petak(190, 20, isi('ooooooo')),
    petak(200, 20, bawah(7)),
    petak(210, 20, atas(7)),
    petak(220, 20, isi('ooo ooo')),      /* lubang di tengah */
    petak(230, 20, bawah(7)),
    petak(240, 20, atas(7)),
    petak(250, 20, isi('ooooooo')),
    petak(260, 20, bawah(7)),
    petak(270, 32, atas(3)),
    petak(280, 32, isi('ooo')),
    petak(290, 32, bawah(3)),
    petak(300, 32, atas(3)),
    petak(310, 32, isi('ooo')),
    petak(320, 32, bawah(3)),

    /* 330 RESTORE lalu baca ulang DATA yang SAMA, kali ini sebagai daftar
       petak berisi pasak. B(41) adalah pusat papan — satu-satunya lubang. */
    { baris: 330, jalan: function (m) {
        m.ulangData();
        for (m.v.W = 1; m.v.W <= 33; m.v.W++) {
          m.v.M = m.baca();
          m.v.B_[m.v.M] = -7;
        }
        m.v.B_[41] = -3;
      } },
    { baris: 340, jalan: function () { /* DATA 13,14,15,22,... */ } },
    { baris: 350, jalan: function () { /* DATA 42,43,44,47,... */ } },

    /* 360-400 siapkan kursor dan panggil gelung pemilihan. */
    { baris: 360, jalan: function (m) { m.v.YSAVE = 12; m.v.XSAVE = 40; } },
    { baris: 370, jalan: function (m) {
        m.locate(24, 1); m.spc(24);
        m.cetak('Position Cursor And Strike Enter.');
      } },
    { baris: 380, jalan: function (m) {
        m.locate(23, 30, 0);
        m.cetak('  Move Which Piece?   ');
      } },
    { baris: 390, jalan: function (m) { m.locate(m.v.YSAVE, m.v.XSAVE, 1); } },
    { baris: 400, jalan: function (m) { m.lompat(660); } },

    /* 410-470 GELUNG PEMILIHAN, dan bentuknya layak diperhatikan.

       Tiap putaran: nyalakan keempat jebakan panah, langsung tunda lagi,
       pasang penanganya, lalu baca INKEY$. Kalau yang terbaca bukan Enter,
       ulangi dari 410 — dan `KEY ON` di situlah yang menjemput panah yang
       ditekan sementara itu.

       Kenapa ON lalu langsung STOP? Karena penangan panah memindahkan kursor,
       dan memindahkan kursor di tengah penjemputan jebakan lain akan kacau.
       STOP membuat tombol berikutnya menunggu giliran dengan tertib. */
    { baris: 410, jalan: function (m) {
        m.jebakan(11, true); m.jebakan(12, true);
        m.jebakan(13, true); m.jebakan(14, true);
      } },
    { baris: 420, jalan: function (m) {
        m.tundaJebakan(11); m.tundaJebakan(12);
        m.tundaJebakan(13); m.tundaJebakan(14);
      } },
    { baris: 430, jalan: function (m) { m.pasangJebakan(11, 500); } },
    { baris: 440, jalan: function (m) { m.pasangJebakan(12, 540); } },
    { baris: 450, jalan: function (m) { m.pasangJebakan(13, 580); } },
    { baris: 460, jalan: function (m) { m.pasangJebakan(14, 620); } },
    { baris: 470, jalan: function (m) {
        m.v['MOVE$'] = m.inkey();
        if (m.v['MOVE$'] !== m.chr(13)) m.lompat(410);
      } },

    /* 480-490 BACA POSISI PILIHAN DARI LAYAR. Tidak ada variabel yang
       menyimpan "kursor sedang di petak mana" — koordinatnya dihitung
       kembali dari POS(0) dan CSRLIN dengan dua pembagian. */
    { baris: 480, jalan: function (m) {
        m.v.XSAVE = m.pos();
        m.v.XCOORD = (m.pos() - 10) / 6;
      } },
    { baris: 490, jalan: function (m) {
        m.v.YSAVE = m.barisKursor();
        m.v.YCOORD = (m.barisKursor() / 3) + 1;
        m.kembali();
      } },

    /* 500-650 empat penangan panah, masing-masing dengan penjaga tepinya
       sendiri. Perhatikan syarat di 510/550/590/630: mereka menjaga kursor
       tetap di dalam bentuk SALIB, bukan sekadar di dalam kotak. */
    { baris: 500, jalan: function (m) { if (m.barisKursor() < 6) m.lompat(530); } },
    { baris: 510, jalan: function (m) {
        if (m.barisKursor() < 12 && (m.pos() < 34 || m.pos() > 46)) m.lompat(530);
      } },
    { baris: 520, jalan: function (m) { m.locate(m.barisKursor() - 3, m.pos(), 1); } },
    { baris: 530, jalan: function (m) { m.kembali(); } },

    { baris: 540, jalan: function (m) { if (m.pos() < 28) m.lompat(570); } },
    { baris: 550, jalan: function (m) {
        var b = m.barisKursor();
        if ((b < 9 || b > 15) && m.pos() < 40) m.lompat(570);
      } },
    { baris: 560, jalan: function (m) { m.locate(m.barisKursor(), m.pos() - 6, 1); } },
    { baris: 570, jalan: function (m) { m.kembali(); } },

    { baris: 580, jalan: function (m) { if (m.pos() > 52) m.lompat(610); } },
    { baris: 590, jalan: function (m) {
        var b = m.barisKursor();
        if ((b < 9 || b > 15) && m.pos() > 40) m.lompat(610);
      } },
    { baris: 600, jalan: function (m) { m.locate(m.barisKursor(), m.pos() + 6, 1); } },
    { baris: 610, jalan: function (m) { m.kembali(); } },

    { baris: 620, jalan: function (m) { if (m.barisKursor() > 20) m.lompat(650); } },
    { baris: 630, jalan: function (m) {
        if (m.barisKursor() > 12 && (m.pos() < 34 || m.pos() > 46)) m.lompat(650);
      } },
    { baris: 640, jalan: function (m) { m.locate(m.barisKursor() + 3, m.pos(), 1); } },
    { baris: 650, jalan: function (m) { m.kembali(); } },

    /* 660-770 pilihan pertama: pasak yang akan melompat. */
    { baris: 660, jalan: function (m) { m.gosub(410); } },
    { baris: 670, jalan: function (m) {
        m.v.ZYSAVE = m.v.YSAVE; m.v.ZXSAVE = m.v.XSAVE;
        m.v.ZYCOORD = m.v.YCOORD; m.v.ZXCOORD = m.v.XCOORD;
        m.v.Z = m.v.XY[m.v.YCOORD][m.v.XCOORD];
      } },
    { baris: 680, jalan: function (m) { if (m.v.B_[m.v.Z] === -7) m.lompat(780); } },

    { baris: 690, jalan: function (m) { m.v['CONTENT$'] = m.v['HOLE$']; } },
    { baris: 700, jalan: function (m) {
        if (m.v.T_[m.v.ZYCOORD][m.v.ZXCOORD] === 5) m.v['CONTENT$'] = m.v['PEG$'];
      } },
    { baris: 710, jalan: function (m) {
        m.locate(m.v.ZYSAVE, m.v.ZXSAVE); m.cetak(m.v['CONTENT$']);
      } },
    { baris: 720, jalan: function (m) { m.v['CONTENT$'] = m.v['HOLE$']; } },
    { baris: 730, jalan: function (m) {
        if (m.v.T_[m.v.YCOORD][m.v.XCOORD] === 5) m.v['CONTENT$'] = m.v['PEG$'];
      } },
    { baris: 740, jalan: function (m) {
        m.locate(m.v.YSAVE, m.v.XSAVE); m.cetak(m.v['CONTENT$']);
      } },
    { baris: 750, jalan: function (m) {
        m.locate(20, 1); m.cetak('Illegal Move, Try Again...');
      } },
    { baris: 760, jalan: function (m) {
        for (m.v.DD = 1; m.v.DD <= 1000; m.v.DD++) { /* jeda */ }
      } },
    { baris: 770, jalan: function (m) {
        m.locate(20, 1); m.spc(27);
        m.locate(m.v.YSAVE, m.v.XSAVE);
        m.lompat(360);
      } },

    /* 780-860 pilihan kedua: lubang tujuannya, lalu keabsahan lompatannya. */
    { baris: 780, jalan: function (m) {
        m.locate(23, 31); m.cetak('     To Where?       ');
      } },
    { baris: 790, jalan: function (m) {
        m.locate(m.v.YSAVE, m.v.XSAVE);
        m.warna(23, 0); m.cetak(m.v['PEG$']); m.warna(3, 0);
      } },
    { baris: 800, bagian: [
        function (m) { m.locate(m.v.YSAVE, m.v.XSAVE); },
        function (m) { m.gosub(410); }
      ] },
    { baris: 810, jalan: function (m) { m.v.P = m.v.XY[m.v.YCOORD][m.v.XCOORD]; } },
    { baris: 820, jalan: function (m) {
        var b = m.v.B_[m.v.P];
        if (b === 0 || b === -7) m.lompat(690);
      } },
    { baris: 830, jalan: function (m) { if (m.v.Z === m.v.P) m.lompat(360); } },
    /* 840 lompatan harus BERJARAK GENAP di penomoran papan — kalau tidak,
       yang dilewati bukan tepat satu petak. */
    { baris: 840, jalan: function (m) {
        var s = (m.v.Z + m.v.P) / 2;
        if (s === Math.floor(s)) m.lompat(850); else m.lompat(690);
      } },
    /* 850 dan jaraknya harus 2 (mendatar) atau 18 (menegak). Diagonal
       ditolak dengan satu perkalian: salah satu faktornya nol kalau sah. */
    { baris: 850, jalan: function (m) {
        var d = Math.abs(m.v.Z - m.v.P);
        if ((d - 2) * (d - 18) !== 0) m.lompat(690);
      } },
    { baris: 860, bagian: [
        function (m) { m.gosub(990); },    /* pindahkan di ingatan */
        function (m) { m.gosub(870); },    /* gambar di layar      */
        function (m) { m.gosub(1180); },   /* hitung sisa pasak    */
        function (m) { m.lompat(360); }
      ] },

    /* 870-980 gambar ulang tiga petak: asal, tujuan, dan yang dilompati. */
    { baris: 870, jalan: function (m) { m.v['CONTENT$'] = m.v['HOLE$']; } },
    { baris: 880, jalan: function (m) {
        if (m.v.T_[m.v.ZYCOORD][m.v.ZXCOORD] === 5) m.v['CONTENT$'] = m.v['PEG$'];
      } },
    { baris: 890, jalan: function (m) {
        m.locate(m.v.ZYSAVE, m.v.ZXSAVE); m.cetak(m.v['CONTENT$']);
        m.v['CONTENT$'] = m.v['HOLE$'];
      } },
    { baris: 900, jalan: function (m) {
        if (m.v.T_[m.v.YCOORD][m.v.XCOORD] === 5) m.v['CONTENT$'] = m.v['PEG$'];
      } },
    { baris: 910, jalan: function (m) {
        m.locate(m.v.YSAVE, m.v.XSAVE); m.cetak(m.v['CONTENT$']);
      } },
    { baris: 920, jalan: function (m) {
        m.v.YOFFSET = m.v.ZYCOORD - m.v.YCOORD;
        m.v.XOFFSET = m.v.ZXCOORD - m.v.XCOORD;
      } },
    { baris: 930, jalan: function (m) { if (m.v.YOFFSET > 0) m.v.YOFFSET = 1; } },
    { baris: 940, jalan: function (m) { if (m.v.XOFFSET > 0) m.v.XOFFSET = 1; } },
    { baris: 950, jalan: function (m) { if (m.v.YOFFSET < 0) m.v.YOFFSET = -1; } },
    { baris: 960, jalan: function (m) { if (m.v.XOFFSET < 0) m.v.XOFFSET = -1; } },
    { baris: 970, jalan: function (m) { m.v['CONTENT$'] = m.v['HOLE$']; } },
    { baris: 980, jalan: function (m) {
        m.locate(m.v.YSAVE + m.v.YOFFSET * 3, m.v.XSAVE + m.v.XOFFSET * 6);
        m.cetak(m.v['CONTENT$']);
        m.kembali();
      } },

    /* 990-1170 pindahkan pasak di dalam ingatan. Gelung menyisir seluruh
       kisi 9x9 sambil menghitung nomor petak C, sampai ketemu petak asal. */
    { baris: 990, bagian: [
        function (m) { m.v.C = 1; },
        function (m) { m.untuk('X', 1, 9, 1, 1170); },
        function (m) { m.untuk('Y', 1, 9, 1, 1170); }
      ] },
    { baris: 1000, jalan: function (m) { if (m.v.C !== m.v.Z) m.lompat(1160); } },
    { baris: 1010, jalan: function (m) { if (m.v.C + 2 !== m.v.P) m.lompat(1050); } },
    { baris: 1020, jalan: function (m) {
        if (m.v.T_[m.v.X][m.v.Y + 1] === 0) m.lompat(690);
      } },
    { baris: 1030, jalan: function (m) { m.v.T_[m.v.X][m.v.Y + 2] = 5; } },
    { baris: 1040, jalan: function (m) {
        m.v.T_[m.v.X][m.v.Y + 1] = 0; m.v.B_[m.v.C + 1] = -3; m.lompat(1140);
      } },
    { baris: 1050, jalan: function (m) { if (m.v.C + 18 !== m.v.P) m.lompat(1080); } },
    { baris: 1060, jalan: function (m) {
        if (m.v.T_[m.v.X + 1][m.v.Y] === 0) m.lompat(690);
      } },
    { baris: 1070, jalan: function (m) {
        m.v.T_[m.v.X + 2][m.v.Y] = 5; m.v.T_[m.v.X + 1][m.v.Y] = 0;
        m.v.B_[m.v.C + 9] = -3; m.lompat(1140);
      } },
    { baris: 1080, jalan: function (m) { if (m.v.C - 2 !== m.v.P) m.lompat(1110); } },
    { baris: 1090, jalan: function (m) {
        if (m.v.T_[m.v.X][m.v.Y - 1] === 0) m.lompat(690);
      } },
    { baris: 1100, jalan: function (m) {
        m.v.T_[m.v.X][m.v.Y - 2] = 5; m.v.T_[m.v.X][m.v.Y - 1] = 0;
        m.v.B_[m.v.C - 1] = -3; m.lompat(1140);
      } },
    { baris: 1110, jalan: function (m) { if (m.v.C - 18 !== m.v.P) m.lompat(1160); } },
    { baris: 1120, jalan: function (m) {
        if (m.v.T_[m.v.X - 1][m.v.Y] === 0) m.lompat(690);
      } },
    { baris: 1130, jalan: function (m) {
        m.v.T_[m.v.X - 2][m.v.Y] = 5; m.v.T_[m.v.X - 1][m.v.Y] = 0;
        m.v.B_[m.v.C - 9] = -3; m.v.B_[m.v.Z] = -3; m.v.B_[m.v.P] = -7;
      } },
    { baris: 1140, jalan: function (m) { m.v.B_[m.v.Z] = -3; m.v.B_[m.v.P] = -7; } },
    { baris: 1150, jalan: function (m) { m.v.T_[m.v.X][m.v.Y] = 0; m.kembali(); } },
    { baris: 1160, jalan: function (m) { m.v.C++; } },
    { baris: 1170, bagian: [
        function (m) { m.lanjutkan('Y'); },
        function (m) { m.lanjutkan('X'); },
        function (m) { m.kembali(); }
      ] },

    /* 1180-1310 hitung sisa pasak DAN periksa apakah masih ada lompatan yang
       mungkin. Caranya cerdik: jumlahkan tiga petak berderet; kalau totalnya
       10 berarti dua pasak (5+5) dan satu lubang (0) — artinya masih ada
       lompatan. Satu penjumlahan menggantikan tiga perbandingan. */
    { baris: 1180, jalan: function (m) { m.v.F = 0; } },
    { baris: 1190, bagian: [
        function (m) { m.untuk('R', 2, 8, 1, 1320); },
        function (m) { m.untuk('C', 2, 8, 1, 1310); }
      ] },
    { baris: 1200, jalan: function (m) {
        if (m.v.T_[m.v.R][m.v.C] !== 5) m.lompat(1300);
      } },
    { baris: 1210, jalan: function (m) { m.v.F++; } },
    { baris: 1220, bagian: [
        function (m) { m.untuk('A', m.v.R - 1, m.v.R + 1, 1, 1260); },
        function (m) {
          m.v.T = 0;
          for (m.v.B = m.v.C - 1; m.v.B <= m.v.C + 1; m.v.B++) {
            m.v.T += m.v.T_[m.v.A][m.v.B];
          }
        }
      ] },
    { baris: 1230, jalan: function (m) { if (m.v.T !== 10) m.lompat(1250); } },
    { baris: 1240, jalan: function (m) {
        if (m.v.T_[m.v.A][m.v.C] !== 0) m.lompat(1570);
      } },
    { baris: 1250, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 1260, bagian: [
        function (m) { m.untuk('X', m.v.C - 1, m.v.C + 1, 1, 1300); },
        function (m) {
          m.v.T = 0;
          for (m.v.Y = m.v.R - 1; m.v.Y <= m.v.R + 1; m.v.Y++) {
            m.v.T += m.v.T_[m.v.Y][m.v.X];
          }
        }
      ] },
    { baris: 1270, jalan: function (m) { if (m.v.T !== 10) m.lompat(1290); } },
    { baris: 1280, jalan: function (m) {
        if (m.v.T_[m.v.R][m.v.X] !== 0) m.lompat(1570);
      } },
    { baris: 1290, jalan: function (m) { m.lanjutkan('X'); } },
    { baris: 1300, jalan: function (m) { m.lanjutkan('C'); } },
    { baris: 1310, jalan: function (m) { m.lanjutkan('R'); } },

    /* 1320-1510 tidak ada lompatan lagi: umumkan hasilnya. */
    { baris: 1320, jalan: function (m) {
        m.locate(22, 1);
        m.cetak('Only' + angka(m.v.F) + 'Pieces Remaining.'); m.barisBaru();
      } },
    { baris: 1330, jalan: function (m) { m.locate(24, 1); m.spc(79); } },
    { baris: 1340, jalan: function (m) { if (m.v.F !== 1) m.lompat(1380); } },
    nilai(1350, 21, 1, 'BRAVO!'),
    nilai(1360, 23, 1, 'A Perfect Score!'),
    { baris: 1370, jalan: function (m) {
        if (m.v.T_[5][5] === 5) {
          m.locate(23, 1);
          m.cetak("In The Center! You're A Genius!"); m.barisBaru();
        }
      } },
    { baris: 1380, jalan: function (m) { if (m.v.F !== 2) m.lompat(1410); } },
    nilai(1390, 21, 1, 'EXECELLENT!'),

    /* 1400 THEN LOCATE 21,3:PRINT "Try Again."

       `THEN` tanpa `IF` di depannya. Itu bukan pernyataan yang sah di
       GW-BASIC, dan baris ini HANYA tercapai kalau permainan berakhir dengan
       tepat dua pasak tersisa — jadi cacatnya bersembunyi di jalur yang
       jarang dilalui.

       Penelusur memodelkannya sebagai galat sintaks (ERR 2). Apakah GW-BASIC
       asli benar-benar berhenti di sini BELUM DIPERIKSA; cara memastikannya
       satu perintah: jalankan run\PEGLEAP.bat dan mainkan sampai tersisa dua
       pasak. */
    { baris: 1400, jalan: function (m) {
        m.galat(2, 'Syntax error — THEN tanpa IF');
      } },

    { baris: 1410, jalan: function (m) {
        if (m.v.F === 3 || m.v.F === 4) {
          m.locate(21, 1); m.cetak('GREAT!'); m.barisBaru();
        }
      } },
    { baris: 1420, jalan: function (m) {
        if (m.v.F === 3 || m.v.F === 4) {
          m.locate(23, 1); m.cetak("Don't Give Up Yet."); m.barisBaru();
        }
      } },
    { baris: 1430, jalan: function (m) {
        if (m.v.F >= 5 && m.v.F <= 7) {
          m.locate(21, 1); m.cetak('NOT BAD.'); m.barisBaru();
        }
      } },
    { baris: 1440, jalan: function (m) {
        if (m.v.F >= 5 && m.v.F <= 7) {
          m.locate(23, 1); m.cetak('Give It Another Shot.'); m.barisBaru();
        }
      } },
    { baris: 1450, jalan: function (m) { if (m.v.F < 8) m.lompat(1520); } },
    { baris: 1460, jalan: function (m) { if (m.v.F > 24) m.lompat(1500); } },
    nilai(1470, 21, 1, 'OUCH!'),
    { baris: 1480, jalan: function (m) {
        m.locate(22, 1);
        m.cetak('You Had' + angka(m.v.F) + 'Pieces Remaining.'); m.barisBaru();
      } },
    { baris: 1490, jalan: function (m) {
        m.locate(23, 1); m.cetak('Today Is Not Your Day!'); m.barisBaru();
        m.lompat(1520);
      } },
    nilai(1500, 21, 1, 'WRONG OBJECTIVE!'),
    nilai(1510, 23, 1, 'When All Else Fails, Read The Instructions!'),

    { baris: 1520, jalan: function (m) {
        m.locate(24, 1, 1);
        m.cetak('Would You Like To Play Again? <Y/N>');
      } },
    { baris: 1530, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(1530);
      } },
    { baris: 1540, jalan: function (m) {
        var a = m.v['A$'];
        if (a === 'n' || a === 'N') m.lompat(1580);
      } },
    { baris: 1550, jalan: function (m) {
        var a = m.v['A$'];
        if (a !== 'y' && a !== 'Y') m.lompat(1530);
      } },
    { baris: 1560, jalan: function (m) { m.ulangData(); m.lompat(40); } },
    { baris: 1570, jalan: function (m) { m.kembali(); } },
    { baris: 1580, jalan: function (m) { m.jalankan('menu'); } },

    /* 1590-1820 layar judul dan petunjuk. */
    { baris: 1590, jalan: function (m) { m.cls(); m.warna(6, 0); } },
    { baris: 1600, jalan: function (m) {
        m.locate(1, 1); m.cetak(m.ulang(80, 219)); m.barisBaru();
      } },
    { baris: 1610, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1);  m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 1620, jalan: function (m) {
        m.locate(23, 1); m.cetak(m.ulang(80, 219));
      } },
    { baris: 1630, jalan: function (m) {
        m.locate(3, 34); m.warna(11, 0);
        m.cetak('P E G    L E A P'); m.barisBaru();
      } },
    { baris: 1640, jalan: function (m) {
        m.warna(15, 0); m.locate(8, 25);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
        m.warna(3, null);
      } },
    { baris: 1650, jalan: function (m) {
        m.v['Z$'] = m.inkey();
        if (m.v['Z$'] === '') m.lompat(1650);
      } },
    { baris: 1660, jalan: function (m) {
        var z = m.v['Z$'];
        if (z === 'N' || z === 'n') { m.cls(); m.kembali(); }
      } },
    { baris: 1670, jalan: function (m) {
        var z = m.v['Z$'];
        if (z !== 'Y' && z !== 'y') m.lompat(1650);
      } },
    { baris: 1680, jalan: function (m) {
        m.locate(5, 10); m.cetak(''); m.barisBaru();
      } },
    petunjuk(1690,  7, 21, '  This is a  simple  little game that is'),
    petunjuk(1700,  8, 21, '  played a lot like checkers. The object'),
    petunjuk(1710,  9, 21, "  of the game is to remove as many `pegs'"),
    petunjuk(1720, 10, 21, "  as possible by jumping each `peg' with"),
    petunjuk(1730, 11, 21, '  another.  You may not jump  diagonally.'),
    petunjuk(1740, 12, 21, '  The peg that you jump will be  removed'),
    petunjuk(1750, 13, 21, '  from the game board automatically.'),
    petunjuk(1760, 16, 21, '  First,  position the  cursor under the'),
    petunjuk(1770, 17, 21, '  jumping peg and Strike The  Enter  Key.'),
    petunjuk(1780, 18, 21, '  Then,  move  the  cursor  to the empty'),
    petunjuk(1790, 19, 21, '  hole that you are jumping to and again'),
    petunjuk(1800, 20, 21, '  Strike The Enter Key.'),
    { baris: 1810, jalan: function (m) {
        m.locate(25, 28); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue');
      } },
    { baris: 1820, jalan: function (m) {
        m.v['Z$'] = m.inkey();
        if (m.v['Z$'] === '') m.lompat(1820);
        else { m.cls(); m.kembali(); }
      } },

    /* 1830-1900 penangan F10. Baris 1870 jatuh ke 1880, yang juga dipanggil
       sebagai subrutin dari baris 40 — satu blok, dua cara masuk. */
    { baris: 1830, jalan: function (m) {
        m.jebakan(10, false);
        m.v.XLIN = m.barisKursor(); m.v.XPOS = m.pos();
        m.locate(25, 1); m.spc(79);
      } },
    { baris: 1840, jalan: function (m) {
        m.locate(25, 22);
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
      } },
    { baris: 1850, jalan: function (m) {
        m.v['Z$'] = m.inkey();
        if (m.v['Z$'] === '') m.lompat(1850);
      } },
    { baris: 1860, jalan: function (m) {
        var z = m.v['Z$'];
        if (z === 'y' || z === 'Y') m.jalankan('menu');
      } },
    { baris: 1870, jalan: function (m) {
        var z = m.v['Z$'];
        if (z !== 'n' && z !== 'N') m.lompat(1850);
      } },
    { baris: 1880, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.locate(25, 25); m.warna(0, 7);
      } },
    { baris: 1890, jalan: function (m) {
        m.cetak(' Strike <F10> To Leave This Game ');
        m.warna(3, 0);
        m.locate(m.v.XLIN, m.v.XPOS, 0);
      } },
    { baris: 1900, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },

    /* 1910-2010 sembilan jebakan mandul, ditulis sembilan baris. */
    jebakanF(1910, 1), jebakanF(1920, 2), jebakanF(1930, 3),
    jebakanF(1940, 4), jebakanF(1950, 5), jebakanF(1960, 6),
    jebakanF(1970, 7), jebakanF(1980, 8), jebakanF(1990, 9),
    { baris: 2000, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) m.jebakan(m.v.A, true);
      } },
    { baris: 2010, jalan: function (m) { m.kembali(); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function angka(n) { return (n < 0 ? '' : ' ') + String(n) + ' '; }

  function nilai(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }

  function petunjuk(nomor, baris, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }

  function jebakanF(nomor, tombol) {
    return { baris: nomor, jalan: function (m) { m.pasangJebakan(tombol, 2010); } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['PEGLEAP'] = {
    nama: 'PEGLEAP',
    judul: 'Peg Leap',
    sumber: 'PEGLEAP',
    berkas: 'run/PEGLEAP.BAS',
    tabel: tabel,
    data: [13, 14, 15, 22, 23, 24, 29, 30, 31, 32, 33, 34, 35, 38, 39, 40, 41,
           42, 43, 44, 47, 48, 49, 50, 51, 52, 53, 58, 59, 60, 67, 68, 69],

    arsitektur: {
      judul: 'Alur PEGLEAP.BAS',
      simpul: [
        { id: 'siap', baris: '10-30', jenis: 'mulai',
          teks: ['Layar judul, petunjuk,', 'pasang jebakan F1-F10'] },
        { id: 'papan', baris: '40-350',
          teks: ['Bangun papan salib di ingatan,', 'gambar 33 petak, isi larik pasak'] },
        { id: 'pilih1', baris: '360-660', jenis: 'subrutin',
          teks: ['Gerakkan kursor dengan panah,', 'Enter memilih pasak'] },
        { id: 'adaPasak', baris: '670-680', jenis: 'putusan',
          teks: ['Petak itu berisi pasak?'] },
        { id: 'pilih2', baris: '780-800', jenis: 'subrutin',
          teks: ['Gerakkan kursor lagi,', 'Enter memilih lubang tujuan'] },
        { id: 'sah', baris: '810-850', jenis: 'putusan',
          teks: ['Jaraknya 2 atau 18,', 'dan genap?'] },
        { id: 'tolak', baris: '690-770', jenis: 'galat',
          teks: ['"Illegal Move, Try Again"', 'gambar ulang, ulangi'] },
        { id: 'pindah', baris: '860-980',
          teks: ['Pindahkan pasak, buang', 'yang dilompati, gambar ulang'] },
        { id: 'sisa', baris: '1180-1310', jenis: 'putusan',
          teks: ['Hitung sisa pasak;', 'masih ada lompatan mungkin?'] },
        { id: 'usai', baris: '1320-1580', jenis: 'keluar',
          teks: ['Umumkan nilai menurut', 'jumlah pasak yang tersisa'] }
      ],
      panah: [
        { dari: 'siap',     ke: 'papan' },
        { dari: 'papan',    ke: 'pilih1' },
        { dari: 'pilih1',   ke: 'adaPasak' },
        { dari: 'adaPasak', ke: 'tolak',  label: 'tidak', jenis: 'galat' },
        { dari: 'adaPasak', ke: 'pilih2', label: 'ya' },
        { dari: 'pilih2',   ke: 'sah' },
        { dari: 'sah',      ke: 'tolak',  label: 'tidak', jenis: 'galat' },
        { dari: 'sah',      ke: 'pindah', label: 'ya' },
        { dari: 'tolak',    ke: 'pilih1', label: 'GOTO 360', jenis: 'galat' },
        { dari: 'pindah',   ke: 'sisa' },
        { dari: 'sisa',     ke: 'pilih1', label: 'masih ada' },
        { dari: 'sisa',     ke: 'usai',   label: 'buntu' },
        { dari: 'usai',     ke: 'papan',  label: 'main lagi' }
      ]
    },

    diagramLain: [
      {
        jenis: 'keadaan',
        judul: 'Keadaan pemilihan',
        keterangan: 'Tombol Enter yang sama berarti dua hal berbeda, dan ' +
          'yang membedakan cuma sudah berapa kali ia ditekan. Perhatikan ' +
          'baris 23 layar: teksnya berubah dari "Move Which Piece?" jadi ' +
          '"To Where?" — satu-satunya petunjuk keadaan yang diberikan ke pemain.',
        simpul: [
          { id: 'pilihPasak', baris: '380', jenis: 'mulai',
            teks: ['Memilih pasak', '"Move Which Piece?"'] },
          { id: 'pilihLubang', baris: '780', jenis: 'keadaan',
            teks: ['Memilih tujuan', '"To Where?"'] }
        ],
        panah: [
          { dari: 'pilihPasak', ke: 'pilihLubang', label: 'Enter di petak berisi pasak (680)' },
          { dari: 'pilihLubang', ke: 'pilihPasak', label: 'lompatan sah: pindahkan (860)' },
          { dari: 'pilihLubang', ke: 'pilihPasak', label: 'lompatan tidak sah (690)', jenis: 'galat' },
          { dari: 'pilihPasak', ke: 'pilihPasak', label: 'petak kosong: ditolak' }
        ]
      }
    ],

    pseudokode: [
      { baris: 30,  tingkat: 0, teks: 'siapkan tiga larik: papan 9&times;9, daftar pasak, peta koordinat' },
      { baris: 40,  tingkat: 0, teks: 'untuk tiap petak di kisi 9&times;9:' },
      { baris: 50,  tingkat: 1, teks: 'di dalam bentuk <b>salib</b>? tandai boleh dipakai, baca nomornya dari DATA' },
      { baris: 70,  tingkat: 1, teks: 'kalau tidak: tandai di luar papan' },
      { baris: 110, tingkat: 0, teks: 'kosongkan petak pusat &mdash; itu satu-satunya lubang di awal' },
      { baris: 120, tingkat: 0, teks: 'gambar 33 petak dari balok CP437' },
      { baris: 330, tingkat: 0, teks: '<b>baca ulang DATA yang sama</b>, kali ini sebagai daftar petak berisi pasak' },
      { baris: 360, tingkat: 0, teks: '<b>ULANG:</b>' },
      { baris: 380, tingkat: 1, teks: 'tulis "Move Which Piece?"' },
      { baris: 410, tingkat: 1, teks: 'gelung kursor: nyalakan jebakan panah, tunda lagi, tunggu Enter' },
      { baris: 480, tingkat: 1, teks: '<b>baca posisi pilihan dari layar</b>, bukan dari variabel' },
      { baris: 680, tingkat: 1, teks: 'petak itu berisi pasak? kalau tidak, tolak' },
      { baris: 780, tingkat: 1, teks: 'tulis "To Where?", gelung kursor lagi' },
      { baris: 840, tingkat: 1, teks: 'jarak antar petak harus genap&hellip;' },
      { baris: 850, tingkat: 1, teks: '&hellip;dan tepat 2 (mendatar) atau 18 (menegak) &mdash; diagonal ditolak' },
      { baris: 990, tingkat: 1, teks: 'pindahkan pasak, buang yang dilompati' },
      { baris: 1180, tingkat: 1, teks: 'hitung sisa pasak, dan periksa apakah masih ada lompatan' },
      { baris: 1220, tingkat: 2, teks: 'jumlahkan tiga petak berderet: <b>total 10 berarti masih bisa melompat</b>' },
      { baris: 1320, tingkat: 0, teks: '<b>BUNTU:</b> umumkan nilai menurut jumlah pasak tersisa' },
      { baris: 1340, tingkat: 1, teks: '1 pasak: "BRAVO! A Perfect Score!"' },
      { baris: 1380, tingkat: 1, teks: '2 pasak: "EXECELLENT!" &mdash; <b>lalu baris 1400 yang cacat</b>' },
      { baris: 1520, tingkat: 0, teks: 'main lagi? kembalikan penunjuk DATA, bangun papan dari awal' }
    ],

    perintahAsli: 'run\\PEGLEAP.bat',
    catatanAsli: 'Di DOSBox-X kursornya berkedip dan tombol panah menggerakkan ' +
      'petak demi petak. Cara memastikan cacat baris 1400: mainkan sampai ' +
      'tersisa tepat dua pasak.',

    penyimpangan: [
      '<b>Baris 1400 dimodelkan sebagai galat sintaks.</b> Ia berbunyi ' +
      '<code>THEN LOCATE 21,3:PRINT "Try Again."</code> — <code>THEN</code> ' +
      'tanpa <code>IF</code> di depannya, yang bukan pernyataan sah di ' +
      'GW-BASIC. Baris itu hanya tercapai kalau permainan berakhir dengan ' +
      '<b>tepat dua pasak tersisa</b>. Apakah penafsir aslinya benar-benar ' +
      'berhenti di sana <b>belum diperiksa</b>; cara memastikannya satu ' +
      'perintah, dan hasilnya menentukan apakah catatan ini perlu diperbaiki.',

      '<b>Jeda satu detik sesudah "Illegal Move" habis seketika</b> ' +
      '(baris 760). Pasang titik henti di sana untuk membacanya.',

      '<b><code>COLOR 23,0</code> tidak berkedip.</b> Warna 23 berarti putih ' +
      'terang + kedip (7 + 16); pasak yang sedang dipilih seharusnya berkedip.',

      '<b>Larik <code>B()</code> dan <code>T()</code> ditulis <code>B_</code> ' +
      'dan <code>T_</code> di dalam mesin.</b> BASIC membedakan variabel ' +
      '<code>T</code> dari larik <code>T()</code>, dan baris 1220 memakai ' +
      'keduanya dalam satu baris. JavaScript tidak punya pembedaan itu.'
    ],

    pelajaran: {
      ringkas: 'Papan salib 33 petak, satu lubang di pusat, dan tujuan ' +
        'menyisakan satu pasak. Yang layak dipelajari bukan permainannya, ' +
        'melainkan tiga trik penyimpanan keadaan di dalamnya.',
      pelajari: [
        ['Satu daftar DATA, dua pekerjaan',
         'Tiga puluh tiga angka di baris 340-350 dibaca DUA kali. Pertama ' +
         'oleh baris 90 sebagai peta koordinat papan; lalu <code>RESTORE</code> ' +
         'di baris 330 mengembalikan penunjuknya dan membacanya lagi sebagai ' +
         'daftar petak berisi pasak. Satu sumber kebenaran melayani dua ' +
         'kebutuhan, dan tidak mungkin melenceng satu sama lain.'],
        ['Jumlah tiga petak sebagai uji lompatan',
         'Baris 1220-1230 menjumlahkan tiga petak berderet. Kalau totalnya ' +
         '<b>10</b>, isinya pasti dua pasak (5+5) dan satu lubang (0) — ' +
         'artinya lompatan masih mungkin. Satu penjumlahan menggantikan tiga ' +
         'perbandingan, dan itu jalan hanya karena nilai penandanya dipilih ' +
         'dengan sengaja: 5, 0, dan &minus;5.'],
        ['Bentuk papan sebagai perkalian',
         '<code>IF (R-4)*(R-5)*(R-6)=0 THEN …</code> berarti "kalau R salah ' +
         'satu dari 4, 5, 6". Satu perkalian menggantikan tiga perbandingan ' +
         'ber-<code>OR</code>. Baris 850 memakai trik yang sama untuk menguji ' +
         'jarak lompatan.']
      ],
      hindari: [
        ['Kursor sebagai satu-satunya penyimpan keadaan',
         'Baris 480-490 menghitung koordinat pilihan pemain dari ' +
         '<code>POS(0)</code> dan <code>CSRLIN</code>. Tidak ada variabel yang ' +
         'menyimpan "kursor sedang di petak mana" — layar yang mengingat. ' +
         'Satu <code>LOCATE</code> nyasar dari mana pun, dan pilihannya ikut ' +
         'salah tanpa jejak.'],
        ['Cacat yang bersembunyi di jalur langka',
         'Baris 1400 hanya tercapai kalau tersisa tepat dua pasak. Sepanjang ' +
         'pengujian biasa ia tidak pernah dijalankan, jadi tidak pernah ' +
         'ketahuan. Jalur yang jarang dilalui adalah tempat cacat berumah.'],
        ['Empat penangan panah yang hampir sama',
         'Baris 500-650 adalah empat blok tiga baris yang bentuknya identik; ' +
         'yang berbeda cuma arah dan angka penjaga tepinya. Itu tabel yang ' +
         'menyamar jadi empat salinan — pola yang sama dengan 21 ' +
         '<code>IF</code> di MENU.BAS.']
      ]
    },

    penjelasan: [
      { judul: 'Kenapa papan 3x3 disimpan sebagai 9x9',
        isi: [
          'Papan Peg Leap berbentuk salib: tiga petak di atas, tujuh di ' +
          'tengah, tiga di bawah — tiga puluh tiga petak seluruhnya.',
          'Program menyimpannya sebagai kisi <b>9&times;9</b>, dengan tiap ' +
          'petak diberi nilai: <b>5</b> berarti ada pasak, <b>0</b> berarti ' +
          'lubang, dan <b>&minus;5</b> berarti di luar papan.',
          'Baris 50-80 yang memilih bentuknya, dan caranya elegan: ' +
          '<code>IF (R-4)*(R-5)*(R-6)=0</code> bernilai benar kalau R adalah ' +
          '4, 5, atau 6 — karena salah satu faktornya jadi nol. Satu ' +
          'perkalian menggantikan <code>IF R=4 OR R=5 OR R=6</code>.',
          'Sama seperti tepi sentinel di [TICTAC], nilai &minus;5 di luar ' +
          'papan membuat pemeriksaan tetangga tidak perlu menanyakan "apakah ' +
          'saya sudah di pinggir".'
        ] },
      { judul: 'Satu penjumlahan yang menjawab "masih bisa melompat?"',
        isi: [
          'Bagaimana tahu permainannya sudah buntu? Untuk tiap pasak, periksa ' +
          'kedelapan arah, lihat apakah tetangganya pasak dan tetangga ' +
          'berikutnya lubang. Itu tiga perbandingan per arah.',
          'Baris 1220 melakukannya dengan satu penjumlahan:',
          '<code>FOR A=R-1 TO R+1:T=0:FOR B=C-1 TO C+1:T=T+T(A,B):NEXT B</code>',
          '<code>IF T&lt;&gt;10 THEN …</code>',
          'Tiga petak berderet dijumlahkan. Kalau totalnya <b>10</b>, satu- ' +
          'satunya kemungkinan adalah 5+5+0 — dua pasak dan satu lubang. ' +
          'Kombinasi lain tidak bisa berjumlah 10, karena nilainya cuma 5, 0, ' +
          'dan &minus;5.',
          'Ini bekerja <b>hanya karena nilai penandanya dipilih dengan ' +
          'sengaja</b>. Kalau "ada pasak" diberi nilai 1 dan "lubang" 0, ' +
          'jumlahnya tidak bisa membedakan 1+1+0 dari 1+0+1. Memilih ' +
          'representasi yang membuat pertanyaan Anda mudah dijawab adalah ' +
          'setengah dari pekerjaan pemrograman.'
        ] },
      { judul: 'Layar sebagai satu-satunya ingatan',
        isi: [
          'Pemain menggerakkan kursor dengan tombol panah. Di petak mana ' +
          'kursornya sekarang?',
          'Program ini tidak menyimpannya. Baris 480-490 menghitungnya ' +
          'kembali dari posisi kursor di layar:',
          '<code>XCOORD=(POS(0)-10)/6</code> &middot; ' +
          '<code>YCOORD=(CSRLIN/3)+1</code>',
          'Berhasil, dan hemat dua variabel. Tapi artinya <b>layar adalah ' +
          'satu-satunya tempat keadaan itu disimpan</b>. Satu ' +
          '<code>LOCATE</code> nyasar dari penangan mana pun — misalnya dari ' +
          'jebakan F10 — dan pilihan pemain ikut bergeser, tanpa satu pun ' +
          'pesan galat.',
          'Program ini sadar akan bahaya itu: baris 1830 menyimpan posisi ' +
          'kursor sebelum penangan F10 mengubahnya, dan baris 1890 ' +
          'mengembalikannya. Tambalan yang benar untuk masalah yang tidak ' +
          'perlu ada.'
        ] },
      { judul: 'Cacat yang menunggu di jalur langka',
        isi: [
          '<code>1400 THEN LOCATE 21,3:PRINT "Try Again."</code>',
          '<code>THEN</code> tanpa <code>IF</code>. Itu bukan pernyataan yang ' +
          'sah, dan baris ini hanya tercapai lewat satu jalan: baris 1380 ' +
          'memeriksa <code>IF F&lt;&gt;2 THEN 1410</code>, jadi 1390 dan 1400 ' +
          'hanya jalan kalau <b>tepat dua pasak</b> tersisa.',
          'Berapa sering itu terjadi? Cukup jarang sehingga bisa lolos dari ' +
          'seluruh pengujian, dan cukup sering sehingga pemain yang bermain ' +
          'bagus justru yang menemukannya.',
          'Pola ini punya nama yang layak diingat: <b>cacat berumah di jalur ' +
          'yang jarang dilalui</b>. Jalur galat, jalur kasus tepi, jalur ' +
          '"seharusnya tidak mungkin". Kalau Anda menulis cabang yang jarang ' +
          'dijalankan, jalankan ia sekali dengan sengaja — sebelum penggunanya ' +
          'yang melakukannya untuk Anda.'
        ] }
    ]
  };
})(window);
