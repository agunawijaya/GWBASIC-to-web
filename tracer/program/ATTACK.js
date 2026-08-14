/* ===========================================================================
   ATTACK.js — porting minimalis ATTACK.BAS sebagai tabel baris.

   Oktober 1982. Dan sebelum apa pun yang lain, baca dulu petunjuknya:

       1820 "YOUR MISSION IS TO ATTACK AND DESTROY
       1830  THE APPLE COMPUTER MANUFACTURING PLANT."
       1850 "THERE ARE APPLE-OWNED FIGHTERS TRYING TO STOP YOU"

   Sebuah permainan pengebom, di disket utilitas IBM, yang sasarannya pabrik
   Apple. Persaingan dua perusahaan itu, dibekukan dalam dua ratus empat baris
   BASIC.

   GAGASAN TEKNISNYA: PEMANDANGAN ADALAH SEBUAH STRING.

       540 A$="_____/\_____/\__/\____...▄╥╥╥▄__▄┴┴┴▄_..."
       670 B$=MID$(A$,L+Z,40-Z)
       680 LOCATE 23,1+Z:PRINT B$;

   Dua ratus aksara medan perang, dan yang tampak di layar cuma JENDELA
   selebar empat puluh yang bergeser satu langkah tiap putaran. Gulungan
   mendatar tanpa satu pun larik peta — dan `Z` menahan jendelanya sejenak
   sesudah bom meledak.

   DAN BOM MEMBACA LAYAR UNTUK TAHU APA YANG DIKENAINYA.

       1460 BE=SCREEN(BY+2,3)
       1510 IF BE=210 OR BE=193 THEN SC=SC+(25-Y2)*12
       1514 IF BE=>169 AND ... THEN SC=SC+INT(RND*30)+10

       Kode 210 dan 193 adalah bagian pabrik Apple; nilainya bergantung
       KETINGGIAN saat bom dijatuhkan. Program keenam di koleksi ini yang
       memakai layar sebagai data.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom. Jendela
     pemandangannya tetap selebar 40 karena diiris program sendiri.
   - `SOUND` dan `BEEP` diam.
   - Gelung tunda habis seketika, jadi animasi lepas landas dan ledakannya
     lewat dalam satu langkah.
   - `RANDOMIZE` memasang benih tetap.
   - `POKE &H17,&H40` (segmen &H40) dan `POKE 1047,32` (segmen 0) tidak
     ditiru — keduanya alamat yang SAMA, bendera papan tombol BIOS.
   - `LOAD "MENU",R` diperlakukan sama seperti `RUN "MENU"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var PETA = { '▄': 220, '█': 219, '∩': 239, '╨': 208, '┌': 218, '┐': 191,
               '╫': 215, '≤': 243, '≥': 242, '╥': 210, '┴': 193, '░': 176,
               '¥': 157, '─': 196 };
  function keBita(s) {
    var k = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      k += PETA[ch] !== undefined ? String.fromCharCode(PETA[ch]) : ch;
    }
    return k;
  }
  var MEDAN = keBita(
    '_____/\\_____/\\__/\\_______/\\_/\\____/\\__/\\___▄█▄_/\\_____/\\__∩∩▄█▄∩∩' +
    '____/\\___/\\/\\_┌╨┐___/\\__/\\▄▄▄▄▄/\\___▄╫╫▄___/\\___≤≥__/\\__▄╥╥╥▄__' +
    '▄┴┴┴▄_/\\__/\\__≤≥__/\\______/\\_____/\\__/\\_______/\\_/\\____/\\__/\\?');

  function basic(n) { return (n < 0 ? '-' : ' ') + Math.abs(n) + ' '; }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function jeda(n, sampai) {
    return { baris: n, jalan: function (m) {
      for (m.v.D = 1; m.v.D <= sampai; m.v.D++) { /* jeda */ }
    } };
  }

  var tabel = [

    /* --- 10-160: layar judul, sama bentuknya dengan SERPENT dan ZAP'EM ---- */
    { baris: 10, jalan: function (m) {
        m.warna(15, 0); m.cls();
        m.locate(5, 19); m.cetak('IBM'); m.barisBaru();
      } },
    { baris: 20, jalan: function (m) {
        m.locate(7, 8, 0); m.cetak('General  utility  programs'); m.barisBaru();
      } },
    { baris: 30, jalan: function (m) {
        m.warna(9, 0); m.locate(10, 9, 0);
        m.cetak(m.chr(213) + m.ulang(21, 205) + m.chr(184)); m.barisBaru();
      } },
    { baris: 40, jalan: function (m) {
        m.locate(11, 9, 0);
        m.cetak(m.chr(179) + '       ATTACK        ' + m.chr(179));
        m.barisBaru();
      } },
    { baris: 50, jalan: function (m) {
        m.locate(12, 9, 0);
        m.cetak(m.chr(179) + m.ulang(21, 32) + m.chr(179)); m.barisBaru();
      } },
    { baris: 60, jalan: function (m) {
        m.warna(9, 0); m.locate(13, 9, 0);
        m.cetak(m.chr(179) + '     Version  1.1    ' + m.chr(179));
        m.barisBaru();
      } },
    { baris: 70, jalan: function (m) { m.bunyi(); } },
    { baris: 80, jalan: function (m) {
        m.locate(14, 9, 0);
        m.cetak(m.chr(212) + m.ulang(21, 205) + m.chr(190)); m.barisBaru();
      } },
    { baris: 90, jalan: function (m) {
        m.warna(15, 0); m.locate(17, 7, 0);
        m.cetak('OCTOBER 7  1982   MOD-5-5-M '); m.barisBaru();
      } },
    { baris: 100, jalan: function (m) {
        m.warna(9, 0); m.locate(23, 6, 0);
        m.cetak('Press space bar to continue...'); m.barisBaru();
      } },
    { baris: 110, jalan: function (m) { if (m.inkey() !== '') m.lompat(110); } },
    { baris: 120, jalan: function (m) { m.v['CMD$'] = m.inkey(); } },
    { baris: 130, jalan: function (m) { if (m.v['CMD$'] === '') m.lompat(120); } },
    { baris: 140, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.lompat(160);
      } },
    { baris: 150, jalan: function (m) {
        if (m.v['CMD$'] !== ' ') m.lompat(120);
      } },
    /* 160 REM TRANSFER COMMAND — lalu nomor barisnya melompat ke 500, sama
       seperti SERPENT.BAS. Ruang yang dipesan dan tidak pernah dipakai. */
    { baris: 160, jalan: function () { } },

    /* --- 500-630: siapkan misi ------------------------------------------- */
    { baris: 500, jalan: function (m) {
        m.v['R1$'] = '00'; m.v['R2$'] = '00'; m.v['R3$'] = '00';
      } },
    { baris: 510, jalan: function (m) { m.semaiCampur(43); } },
    /* 520 `SF` laser, `BD` bom, `SC` skor. Dan `POKE &H17,&H40` di segmen
       &H40 menyalakan Caps Lock lewat bendera papan tombol BIOS. */
    { baris: 520, jalan: function (m) {
        m.v.SC = 0; m.v.SF = 60; m.v.BD = 35;
        m.warna(7, 0); m.cls();
      } },
    { baris: 530, bagian: [
        function (m) {
          m.locate(1, 1, 0); m.cetak('DO YOU WANT INSTRUCTIONS ?');
        },
        function (m) {
          m.v['I$'] = m.inkey();
          if (m.v['I$'] === '') m.tunggu();
          else if (m.v['I$'] === 'Y') m.gosub(1800);
        }
      ] },
    /* 540 SELURUH MEDAN PERANG, dalam satu string sepanjang dua ratus
       aksara. Yang tampak cuma empat puluh di antaranya. */
    { baris: 540, jalan: function (m) { m.v['A$'] = MEDAN; } },
    /* 550 `IF SC=0 THEN DIM` — penjaga supaya larik tidak di-DIM dua kali
       waktu babak berikutnya kembali ke baris 540. */
    { baris: 550, jalan: function (m) {
        m.cls();
        if (!m.v['X()']) {
          m.dim('X()', 4); m.dim('Y()', 4); m.dim('R()', 4); m.dim('Y1()', 10);
        }
      } },
    { baris: 560, jalan: function (m) {
        m.v.L = 0; m.v.Y1 = 0; m.v.Q = 1;
        m.v['Y()'][1] = 14; m.v['X()'][1] = 40;
        m.v.Q1 = 1; m.v.SE = 0; m.v.B = -1; m.v.Z = 0;
      } },
    { baris: 570, jalan: function (m) {
        m.v.Y = Math.trunc(m.acak() * 14) + 8;
      } },
    { baris: 580, jalan: function (m) {
        m.warna(1, null); m.locate(5, 10, 0);
        m.cetak('________________________________________');
      } },
    { baris: 590, jalan: function (m) {
        m.v['M$'] = m.ulang(36, 196);
        m.v['N$'] = m.ulang(36, 32);
      } },
    { baris: 600, jalan: function (m) {
        m.warna(7, null); m.locate(4, 3);
        m.cetak('BOMBS -' + basic(m.v.BD) + ' SCORE -' + basic(m.v.SC));
        m.locate(4, 28);
        m.cetak('LASERS -' + basic(m.v.SF));
      } },
    { baris: 610, jalan: function (m) {
        m.warna(1, null); m.locate(5, 10, 0);
        m.cetak('________________________________________');
      } },
    { baris: 620, jalan: function (m) { m.v['B$'] = m.v['A$'].slice(0, 40); } },
    { baris: 625, jalan: function () { /* POKE 1047,32: alamat yang sama */ } },
    { baris: 630, jalan: function (m) {
        m.warna(6, null); m.locate(23, 1 + m.v.Z, 0); m.cetak(m.v['B$']);
      } },
    { baris: 640, jalan: function (m) { m.gosub(2100); } },

    /* --- 650-1020: gelung utama ------------------------------------------ */
    /* 650 seratus lima puluh putaran, lalu misi selesai. Panjang medan
       perangnya, bukan waktu. */
    { baris: 650, jalan: function (m) {
        m.v.L = m.v.L + 1;
        if (m.v.L === 150) m.lompat(1580);
      } },
    { baris: 660, jalan: function (m) { if (m.v.Z > 0) m.v.Z = m.v.Z - 1; } },
    /* 670 JENDELA YANG BERGESER. `L` maju satu tiap putaran; `Z` menahan
       jendelanya sesudah bom meledak. */
    { baris: 670, jalan: function (m) {
        m.v['B$'] = m.v['A$'].substr(m.v.L + m.v.Z - 1, 40 - m.v.Z);
      } },
    { baris: 680, jalan: function (m) {
        m.warna(6, null); m.locate(23, 1 + m.v.Z, 0); m.cetak(m.v['B$']);
      } },
    /* 690 `Y5=1` berarti pesawat keluar dari atmosfer: kendali hilang dan
       ia jatuh sendiri. Satu bendera mengubah arti seluruh papan tombol. */
    { baris: 690, jalan: function (m) {
        if (m.v.Y5 === 1) { m.v['C$'] = m.inkey(); m.lompat(780); }
      } },
    { baris: 700, jalan: function (m) {
        m.v['C$'] = m.inkey();
        if (m.v['C$'] === '') m.lompat(800);
      } },
    { baris: 710, jalan: function (m) { if (m.v['C$'] === '8') m.v.Y1 = -1; } },
    { baris: 720, jalan: function (m) { if (m.v['C$'] === '2') m.v.Y1 = 1; } },
    { baris: 730, jalan: function (m) { if (m.v['C$'] === '5') m.v.Y1 = 0; } },
    { baris: 740, jalan: function (m) { m.lompat(780); } },
    { baris: 780, jalan: function (m) {
        if (m.v.BD > 0 && m.v.B === -1 && m.v.Y < 20 && m.v['C$'] === '4') {
          m.gosub(1030);
        }
      } },
    { baris: 790, jalan: function (m) {
        if (m.v.SF > 0 && m.v['C$'] === '6') m.gosub(1100);
      } },
    { baris: 800, jalan: function () { /* SOUND: diam */ } },
    { baris: 810, jalan: function (m) {
        if (m.v.Y + m.v.Y1 === 6) { m.v.Y5 = 1; m.v.Y1 = 1; }
      } },
    { baris: 820, jalan: function (m) {
        if (m.v.Y + m.v.Y1 === 23) { m.v.SE = 1; m.lompat(1200); }
      } },
    { baris: 830, jalan: function (m) {
        m.locate(m.v.Y, 2); m.cetak('   ');
      } },
    { baris: 840, jalan: function (m) { m.v.Y = m.v.Y + m.v.Y1; } },
    { baris: 850, jalan: function (m) {
        m.warna(15, null); m.locate(m.v.Y, 2);
        m.cetak('>' + m.chr(205) + m.chr(26));
      } },
    { baris: 860, jalan: function (m) { if (m.v.B === 1) m.gosub(1070); } },
    { baris: 870, jalan: function (m) { m.untuk('Q', 1, m.v.Q1, 1, 1020); } },
    { baris: 880, jalan: function (m) {
        if (m.v['R()'][m.v.Q] !== 1) m.lompat(910);
      } },
    { baris: 890, jalan: function (m) {
        if (m.v['R()'][m.v.Q] === 1 && Math.trunc(m.acak() * 50) > 45) {
          m.v['R()'][m.v.Q] = 0; m.lompat(910);
        }
      } },
    /* 900 pencacah gelung dinaikkan DARI DALAM gelungnya — pola yang sama
       dengan KENO.BAS baris 690. */
    { baris: 900, jalan: function (m) {
        if (m.v.Q < m.v.Q1) { m.v.Q = m.v.Q + 1; m.lompat(880); }
        else m.lompat(1020);
      } },
    { baris: 910, jalan: function (m) {
        m.locate(m.v['Y()'][m.v.Q], m.v['X()'][m.v.Q]);
        m.cetak(' '); m.barisBaru();
      } },
    { baris: 920, jalan: function (m) {
        m.v['X()'][m.v.Q] -= 2;
        m.v['Y()'][m.v.Q] += (m.v['Y1()'][m.v.Q] || 0);
      } },
    { baris: 930, jalan: function (m) {
        if (m.v['X()'][m.v.Q] === 0) m.gosub(1410);
      } },
    { baris: 940, jalan: function (m) {
        m.warna(7, null);
        m.locate(m.v['Y()'][m.v.Q], m.v['X()'][m.v.Q]);
        m.cetak(m.chr(27));
      } },
    { baris: 950, jalan: function (m) {
        if (m.v.Q1 < 4 && m.v['X()'][m.v.Q] === 30) m.gosub(1430);
      } },
    { baris: 960, jalan: function (m) {
        if (m.v['Y()'][m.v.Q] < m.v.Y) m.v['Y1()'][m.v.Q] = 1;
      } },
    { baris: 970, jalan: function (m) {
        if (m.v['Y()'][m.v.Q] > m.v.Y) m.v['Y1()'][m.v.Q] = -1;
      } },
    /* 980 satu dari delapan kali, arah pengejarnya DIBALIK — supaya ia tidak
       menempel sempurna dan permainannya masih bisa dimenangkan. */
    { baris: 980, jalan: function (m) {
        if (Math.trunc(m.acak() * 40) > 35) {
          m.v['Y1()'][m.v.Q] = -(m.v['Y1()'][m.v.Q] || 0);
        }
      } },
    { baris: 990, jalan: function (m) {
        var y = m.v['Y()'][m.v.Q] + (m.v['Y1()'][m.v.Q] || 0);
        if (y === 23 || y === 6) m.v['Y1()'][m.v.Q] = 0;
      } },
    { baris: 1000, jalan: function (m) {
        var x = m.v['X()'][m.v.Q];
        if ((x === 4 || x === 2) && m.v['Y()'][m.v.Q] === m.v.Y) m.lompat(1200);
      } },
    { baris: 1010, jalan: function (m) { m.lanjutkan('Q'); } },
    { baris: 1020, jalan: function (m) { m.lompat(650); } },

    /* --- 1030-1090: bom -------------------------------------------------- */
    /* 1030 bom selalu dijatuhkan dari baris GENAP, supaya langkah dua-baris
       di 1080 selalu mendarat di baris 21. */
    { baris: 1030, jalan: function (m) {
        m.v.BY = (m.v.Y / 2 === Math.trunc(m.v.Y / 2)) ? m.v.Y + 1 : m.v.Y;
      } },
    { baris: 1040, jalan: function (m) {
        m.warna(7, null); m.v.B = 1; m.v.BD = m.v.BD - 1; m.v.Y2 = m.v.Y;
        m.locate(4, 3); m.cetak('BOMBS -' + basic(m.v.BD));
      } },
    { baris: 1050, jalan: function (m) {
        m.warna(2, null); m.locate(m.v.BY, 3); m.cetak(m.chr(157));
      } },
    { baris: 1060, jalan: function (m) { m.kembali(); } },
    /* 1070 `IF BY=21 THEN GOSUB 1450:RETURN` — dua pernyataan di dalam satu
       THEN, jadi dua penggal: panggil dulu, pulang sesudahnya. */
    { baris: 1070, bagian: [
        function (m) { if (m.v.BY !== 21) m.lompat(1080); },
        function (m) { m.gosub(1450); },
        function (m) { m.kembali(); }
      ] },
    { baris: 1080, jalan: function (m) {
        m.warna(2, null); m.locate(m.v.BY, 3); m.cetak(' ');
        m.v.BY = m.v.BY + 2;
        m.locate(m.v.BY, 3); m.cetak(m.chr(157));
      } },
    { baris: 1090, jalan: function (m) { m.kembali(); } },

    /* --- 1100-1190: laser ------------------------------------------------ */
    { baris: 1100, jalan: function (m) {
        m.warna(4, null); m.locate(m.v.Y, 5); m.cetak(m.v['M$']);
        m.v.SF = m.v.SF - 1;
        m.warna(7, null); m.locate(4, 28);
        m.cetak('LASERS -' + basic(m.v.SF));
      } },
    { baris: 1110, jalan: function (m) {
        for (m.v.D = 1; m.v.D <= 20; m.v.D++) { /* jeda */ }
      } },
    { baris: 1120, jalan: function (m) {
        m.locate(m.v.Y, 5); m.cetak(m.v['N$']);
      } },
    { baris: 1130, bagian: [
        function (m) { m.untuk('W', 1, m.v.Q1, 1, 1150); },
        function (m) {
          if (m.v.Y === m.v['Y()'][m.v.W] && m.v['X()'][m.v.W] > 4 &&
              m.v['R()'][m.v.W] !== 1) m.lompat(1160);
        }
      ] },
    { baris: 1140, jalan: function (m) { m.lanjutkan('W'); } },
    { baris: 1150, jalan: function (m) { m.kembali(); } },
    { baris: 1160, jalan: function (m) {
        m.v.SC = m.v.SC + 20;
        m.warna(7, null); m.locate(4, 14);
        m.cetak('SCORE -' + basic(m.v.SC));
      } },
    { baris: 1170, jalan: function (m) {
        m.locate(m.v['Y()'][m.v.W], m.v['X()'][m.v.W]); m.cetak(m.chr(176));
        m.locate(m.v['Y()'][m.v.W], m.v['X()'][m.v.W]); m.cetak(' ');
      } },
    /* 1180 pesawat yang tertembak TIDAK hilang: ia disetel ulang di tepi
       kanan dengan `R(W)=1`, menunggu diaktifkan lagi oleh baris 890. */
    { baris: 1180, jalan: function (m) {
        m.v['Y()'][m.v.W] = Math.trunc(m.acak() * 16) + 7;
        m.v['X()'][m.v.W] = 40;
        m.v['R()'][m.v.W] = 1;
      } },
    { baris: 1190, jalan: function (m) { m.kembali(); } },

    /* --- 1200-1400: pesawat hancur --------------------------------------- */
    { baris: 1200, jalan: function (m) {
        m.locate(m.v.Y, 2); m.cetak('   ');
      } },
    { baris: 1210, jalan: function (m) { m.warna(7, null); } },
    { baris: 1220, jalan: function (m) {
        if (m.v.SE === 1) m.v.Y = m.v.Y + m.v.Y1;
      } },
    { baris: 1230, jalan: function (m) {
        m.locate(m.v.Y, 2); m.cetak('>' + m.chr(205) + m.chr(26));
      } },
    jeda(1240, 100),
    { baris: 1250, bagian: [
        function (m) { m.untuk('C1', 178, 176, -1, 1280); },
        function (m) { m.untuk('C', 15, 0, -1, 1270); }
      ] },
    { baris: 1260, jalan: function (m) {
        m.locate(m.v.Y, 2);
        m.cetak(m.chr(m.v.C1) + m.chr(m.v.C1) + m.chr(m.v.C1));
      } },
    { baris: 1270, bagian: [
        function (m) { m.lanjutkan('C'); },
        function (m) { m.lanjutkan('C1'); }
      ] },
    { baris: 1280, jalan: function () { /* SOUND 39,0 */ } },
    { baris: 1290, jalan: function (m) {
        m.locate(m.v.Y, 2); m.cetak('   '); m.barisBaru();
      } },
    /* 1295 menang kalau skor lebih dari 800 — walaupun pesawatnya baru saja
       hancur. Kerusakan yang sudah dilakukan lebih penting daripada nasibnya. */
    { baris: 1295, bagian: [
        function (m) { if (!(m.v.SC > 800)) m.lompat(1300); },
        function (m) {
          for (m.v.N = 1; m.v.N <= 15; m.v.N++) { m.warna(m.v.N, m.v.N); m.cls(); }
          m.warna(7, 0); m.cls();
          m.locate(11, 6); m.cetak('G A M E    O V E R'); m.barisBaru();
          m.barisBaru(); m.barisBaru();
          m.cetak('     GOOD JOB!!'); m.barisBaru();
          m.lompat(2300);
        }
      ] },
    { baris: 1300, jalan: function (m) { m.v['A$'] = 'YOU FAILED'; } },
    hurufDemiHuruf(1310, 1340, 10, 10, 14),
    { baris: 1350, jalan: function (m) { m.v['A$'] = 'YOUR MISSION'; } },
    hurufDemiHuruf(1360, 1390, 12, 12, 13),
    { baris: 1400, jalan: function (m) { m.lompat(2300); } },
    /* 1410-1420 `RETURN 1010` — membuang alamat pulang dan melanjutkan di
       NEXT-nya. Pola yang sama dengan HINTS.BAS dan ANATOMY.BAS. */
    { baris: 1410, jalan: function (m) {
        m.v['Y()'][m.v.Q] = Math.trunc(m.acak() * 15) + 8;
        m.v['X()'][m.v.Q] = 40;
        m.v['R()'][m.v.Q] = 1;
        m.v['Y1()'][m.v.Q] = 0;
      } },
    { baris: 1420, jalan: function (m) { m.kembali(1010); } },
    /* 1430 pesawat KELIMA muncul begitu ada yang mencapai kolom 30 — sampai
       empat. Kesulitan yang tumbuh dari keadaan, bukan dari penghitung. */
    { baris: 1430, jalan: function (m) {
        m.v.Q1 = m.v.Q1 + 1;
        m.v['Y()'][m.v.Q1] = Math.trunc(m.acak() * 15) + 8;
        m.v['X()'][m.v.Q1] = 40;
        m.v['Y1()'][m.v.Q] = 0;
      } },
    { baris: 1440, jalan: function (m) { m.kembali(); } },

    /* --- 1450-1570: bom meledak ------------------------------------------ */
    { baris: 1450, jalan: function (m) { m.v.B = -1; } },
    /* 1460 BOM MEMBACA LAYAR untuk tahu apa yang dikenainya. */
    { baris: 1460, jalan: function (m) {
        m.v.BE = m.layarAksara(m.v.BY + 2, 3);
      } },
    { baris: 1470, jalan: function (m) {
        m.locate(m.v.BY, 3); m.cetak(' ');
      } },
    { baris: 1480, jalan: function (m) { m.v.BY = m.v.BY + 2; } },
    { baris: 1490, jalan: function () { /* SOUND 50,0 */ } },
    { baris: 1500, bagian: [
        function (m) { m.untuk('D', 178, 176, -1, 1510); },
        function (m) { m.untuk('S', 140, 142, 1, 1500); },
        function (m) {
          m.locate(m.v.BY, 1);
          m.warna(Math.trunc(m.acak() * 16 + 1), null);
          m.cetak(' ' + m.ulang(3, m.v.D));
        },
        function (m) { m.lanjutkan('S'); },
        function (m) { m.lanjutkan('D'); }
      ] },
    /* 1510 kode 210 dan 193 adalah bagian pabrik Apple, dan nilainya
       bergantung KETINGGIAN saat bom dijatuhkan: makin tinggi makin besar. */
    { baris: 1510, jalan: function (m) {
        if (m.v.BE === 210 || m.v.BE === 193) {
          m.v.SC = m.v.SC + (25 - m.v.Y2) * 12;
        }
      } },
    /* 1514 `BE=>169` — tanda banding ditulis terbalik. GW-BASIC menerimanya. */
    { baris: 1514, jalan: function (m) {
        if (m.v.BE >= 169 && m.v.BE !== 210 && m.v.BE !== 193 && m.v.BE !== 196) {
          m.v.SC = m.v.SC + Math.trunc(m.acak() * 30) + 10;
        }
      } },
    { baris: 1520, jalan: function (m) {
        m.warna(7, null); m.locate(4, 14);
        m.cetak('SCORE -' + basic(m.v.SC));
      } },
    /* 1530 `Z=4` MENAHAN gulungan pemandangan empat putaran, supaya ledakan
       sempat terlihat di tempatnya. */
    { baris: 1530, jalan: function (m) { m.v.Z = 4; } },
    { baris: 1540, jalan: function (m) {
        m.locate(m.v.BY, 2); m.cetak('   '); m.barisBaru();
      } },
    { baris: 1550, jalan: function (m) { m.kembali(); } },
    { baris: 1560, jalan: function (m) { m.v.BY = m.v.BY + 2; } },
    { baris: 1570, jalan: function () { /* SOUND 50,0 */ } },

    /* --- 1580-1799: misi selesai ----------------------------------------- */
    rem(1580),
    jeda(1590, 150),
    { baris: 1600, jalan: function (m) {
        m.warna(7, null); m.locate(7, 1); m.cetak(' \\ /');
      } },
    jeda(1610, 150),
    { baris: 1620, jalan: function (m) {
        m.locate(7, 1); m.cetak('/   \\'); m.barisBaru(); m.warna(14, null);
      } },
    { baris: 1630, bagian: [
        function (m) { m.untuk('L', 7, m.v.Y - 1, 1, 1650); },
        function (m) { m.locate(m.v.L, 3); m.cetak(m.chr(219)); }
      ] },
    { baris: 1640, bagian: [
        function (m) { for (m.v.D = 1; m.v.D <= 100; m.v.D++) { } },
        function (m) { m.lanjutkan('L'); }
      ] },
    { baris: 1650, jalan: function (m) { m.warna(15, null); } },
    { baris: 1660, bagian: [
        function (m) { m.untuk('L', m.v.Y - 1, 7, -1, 1680); },
        function (m) {
          m.locate(m.v.L + 1, 2); m.cetak('   ');
          m.locate(m.v.L, 2); m.cetak('>=' + m.chr(26));
        }
      ] },
    { baris: 1670, bagian: [
        function (m) { for (m.v.D = 1; m.v.D <= 100; m.v.D++) { } },
        function (m) { m.lanjutkan('L'); }
      ] },
    { baris: 1680, jalan: function (m) {
        m.warna(7, null); m.locate(m.v.L + 1, 2); m.cetak('   ');
      } },
    jeda(1690, 150),
    { baris: 1700, jalan: function (m) {
        m.locate(m.v.L + 1, 1); m.cetak(' \\ / ');
      } },
    jeda(1710, 150),
    { baris: 1720, jalan: function (m) {
        m.locate(m.v.L + 1, 1); m.cetak('     ');
      } },
    { baris: 1730, jalan: function (m) {
        m.locate(m.v.L, 2); m.cetak('___');
      } },
    { baris: 1740, jalan: function (m) { m.v['A$'] = 'MISSION COMPLETE'; } },
    hurufDemiHuruf(1750, 1780, 16, 10, 11),
    { baris: 1790, jalan: function (m) {
        if (m.v.SC > 500) m.lompat(1795);
      } },
    { baris: 1793, jalan: function (m) { m.lompat(2300); } },
    { baris: 1795, jalan: function (m) {
        m.locate(15, 5); m.cetak('ON TO THE NEXT ROUND!'); m.barisBaru();
      } },
    { baris: 1797, jalan: function (m) {
        for (m.v.O = 1; m.v.O <= 1900; m.v.O++) { /* jeda */ }
      } },
    { baris: 1799, jalan: function (m) { m.lompat(540); } },

    /* --- 1800-2090: petunjuk --------------------------------------------- */
    { baris: 1800, jalan: function (m) { m.cls(); } },
    rem(1810),
    cet(1820, '  YOUR MISSION IS TO ATTACK AND DESTROY'),
    cet(1830, 'THE APPLE COMPUTER MANUFACTURING PLANT.'),
    cet(1840, 'YOU ARE ALLOTED 35 BOMBS AND 60 LASERS.'),
    cet(1850, 'THERE ARE APPLE-OWNED FIGHTERS TRYING'),
    cet(1860, 'TO STOP YOU,YOU MUST DESTROY THEM WITH'),
    cet(1870, 'YOUR LASERS.IF YOU GET HIT BY THEM THEN'),
    cet(1880, 'YOU ARE DESTROYED,IF YOU HIT THE GROUND'),
    cet(1890, 'THEN YOU ARE DESTROYED.IF YOU GO OUT OF'),
    cet(1900, 'THE ATMOSPHERE (THE BLUE LINE),THEN YOU'),
    cet(1910, 'LOOSE ALL CONTROL EXCEPT LASERS AND'),
    cet(1920, 'BOMBS,AND YOUR SHIP WILL BEGIN FALLING.'),
    cet(1930, '  DROP BOMBS ON ALL STRUCTURES AND YOU'),
    cet(1940, 'WILL GET POINTS. THE APPLE PLANT (SHOWN'),
    cet(1950, 'BELOW) IS WORTH THE MOST POINTS.'),
    cet(1960, ''),
    { baris: 1970, jalan: function (m) {
        m.warna(6, null);
        m.cetak(MEDAN.substr(163, 40));
      } },
    { baris: 1980, jalan: function (m) {
        m.warna(7 + 16, null);
        m.cetak('            ^^^    ^^^'); m.barisBaru();
      } },
    { baris: 1990, jalan: function (m) { m.warna(7, null); m.barisBaru(); } },
    cet(2000, '  IF YOUR SCORE IS HIGH ENOUGH AFTER '),
    cet(2010, 'ROUND ONE THEN YOU ARE READY TO FACE '),
    cet(2020, 'ROUND TWO. '),
    { baris: 2030, jalan: function (m) {
        m.locate(25, 1, 0); m.cetak('press space bar to continue');
      } },
    { baris: 2040, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(2040);
      } },
    cet(2050, '  USE CURSOR CONTROL KEYS TO MOVE,8 TO'),
    cet(2060, '  GO UP,2 TO GO DOWN,5 TO STOP,4 TO '),
    cet(2070, '  DROP BOMBS, AND 6 TO FIRE THE LASER'),
    { baris: 2080, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(2080);
      } },
    { baris: 2090, jalan: function (m) { m.cls(); m.kembali(); } },

    /* --- 2100-2270: lepas landas ----------------------------------------- */
    rem(2100),
    jeda(2110, 150),
    { baris: 2120, jalan: function (m) {
        m.warna(7, null); m.locate(7, 1); m.cetak(' \\ /');
      } },
    jeda(2130, 150),
    { baris: 2140, jalan: function (m) {
        m.locate(7, 1); m.cetak('/   \\'); m.barisBaru(); m.warna(14, null);
      } },
    { baris: 2150, bagian: [
        function (m) { m.untuk('L', 7, m.v.Y - 1, 1, 2170); },
        function (m) {
          m.warna(14, null); m.locate(m.v.L, 2); m.cetak(' ' + m.chr(219) + ' ');
          m.warna(15, null); m.locate(m.v.L + 1, 2); m.cetak('>=' + m.chr(26));
        }
      ] },
    { baris: 2160, bagian: [
        function (m) { for (m.v.D = 1; m.v.D <= 100; m.v.D++) { } },
        function (m) { m.lanjutkan('L'); }
      ] },
    { baris: 2170, jalan: function (m) { m.warna(15, null); } },
    { baris: 2180, bagian: [
        function (m) { m.untuk('L', m.v.Y - 1, 7, -1, 2200); },
        function (m) { m.locate(m.v.L, 3); m.cetak(' '); }
      ] },
    { baris: 2190, bagian: [
        function (m) { for (m.v.D = 1; m.v.D <= 100; m.v.D++) { } },
        function (m) { m.lanjutkan('L'); }
      ] },
    { baris: 2200, jalan: function (m) {
        m.warna(7, null); m.locate(m.v.L + 1, 2); m.cetak('   ');
      } },
    jeda(2210, 150),
    { baris: 2220, jalan: function (m) {
        m.locate(m.v.L + 1, 1); m.cetak(' \\ / ');
      } },
    jeda(2230, 150),
    { baris: 2240, jalan: function (m) {
        m.locate(m.v.L + 1, 1); m.cetak('     ');
      } },
    { baris: 2250, jalan: function (m) {
        m.locate(m.v.L, 2); m.cetak('___');
      } },
    { baris: 2260, jalan: function (m) {
        for (m.v.D = 1; m.v.D <= 150; m.v.D++) { }
        m.warna(1, null); m.locate(m.v.L, 2); m.cetak('___');
      } },
    { baris: 2270, jalan: function (m) { m.kembali(); } },

    /* --- 2300-2350: main lagi -------------------------------------------- */
    cet(2300, '        Press Y to play again'),
    cet(2310, '        Press Space bar for menu'),
    { baris: 2320, jalan: function (m) {
        m.v['R$'] = m.inkey();
        if (m.v['R$'] === '') m.lompat(2320);
      } },
    { baris: 2330, jalan: function (m) {
        if (m.v['R$'] === 'y' || m.v['R$'] === 'Y') m.jalankan('ATTACK');
      } },
    { baris: 2340, jalan: function (m) {
        if (m.v['R$'] === ' ') m.jalankan('MENU');
      } },
    { baris: 2350, jalan: function (m) { m.lompat(2320); } }
  ];

  /* Baris seperti 1310-1340: cetak sebuah kata satu huruf per putaran, dengan
     bunyi dan jeda di antaranya. Empat baris, tiga kali di berkas ini. */
  function hurufDemiHuruf(awal, akhir, panjang, baris, kolom) {
    return {
      baris: awal, bagian: [
        function (m) { m.untuk('L', 1, panjang, 1, akhir + 10); },
        function (m) { m.v['B$'] = m.v['A$'].substr(m.v.L - 1, 1); },
        function (m) {
          m.locate(baris, kolom + m.v.L); m.cetak(m.v['B$']);
          for (m.v.D = 1; m.v.D <= 50; m.v.D++) { /* jeda */ }
        },
        function (m) { m.lanjutkan('L'); }
      ]
    };
  }

  /* Ketiga blok "huruf demi huruf" memakai empat nomor baris berurutan.
     Yang dua di tengah tidak punya percabangan, jadi digabung di atas dan
     didaftarkan di sini supaya cakupannya tetap utuh. */
  [[1320, 1330, 1340], [1370, 1380, 1390], [1760, 1770, 1780]]
    .forEach(function (tiga) {
      tiga.forEach(function (n) { tabel.push(rem(n)); });
    });
  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['ATTACK'] = {
    nama: 'ATTACK',
    judul: 'Attack (mengebom pabrik Apple, Oktober 1982)',
    sumber: 'ATTACK',
    berkas: 'run/ATTACK.BAS',
    tabel: tabel,
    benih: 47,

    arsitektur: {
      judul: 'Alur ATTACK.BAS',
      simpul: [
        { id: 'judul', baris: '10-160', jenis: 'mulai',
          teks: ['Layar judul IBM,', 'lalu tawaran petunjuk'] },
        { id: 'siap', baris: '500-640',
          teks: ['35 bom, 60 laser;', 'medan perang jadi satu string'] },
        { id: 'gulung', baris: '650-680',
          teks: ['Geser jendela 40 aksara', 'satu langkah tiap putaran'] },
        { id: 'tombol', baris: '690-790', jenis: 'putusan',
          teks: ['8/2/5 arah, 4 bom, 6 laser;', 'di luar atmosfer: kendali hilang'] },
        { id: 'musuh', baris: '870-1020',
          teks: ['Pesawat mengejar ketinggian pemain,', 'kadang membalik arah'] },
        { id: 'bom', baris: '1030-1090, 1450-1550', jenis: 'subrutin',
          teks: ['Bom jatuh dua baris sekali;', 'BACA LAYAR untuk menilai'] },
        { id: 'laser', baris: '1100-1190', jenis: 'subrutin',
          teks: ['Laser sebaris penuh;', 'kena = 20 angka'] },
        { id: 'hancur', baris: '1200-1400', jenis: 'galat',
          teks: ['Tertabrak atau menyentuh tanah;', 'skor > 800 tetap menang'] },
        { id: 'selesai', baris: '1580-1799', jenis: 'keluar',
          teks: ['150 putaran: MISSION COMPLETE;', 'skor > 500 lanjut babak dua'] }
      ],
      panah: [
        { dari: 'judul', ke: 'siap' },
        { dari: 'siap', ke: 'gulung' },
        { dari: 'gulung', ke: 'tombol' },
        { dari: 'tombol', ke: 'bom', label: 'tombol 4' },
        { dari: 'tombol', ke: 'laser', label: 'tombol 6' },
        { dari: 'tombol', ke: 'musuh' },
        { dari: 'musuh', ke: 'gulung', label: 'putaran berikutnya' },
        { dari: 'musuh', ke: 'hancur', label: 'tertabrak', jenis: 'galat' },
        { dari: 'tombol', ke: 'hancur', label: 'menyentuh tanah', jenis: 'galat' },
        { dari: 'gulung', ke: 'selesai', label: 'putaran ke-150' },
        { dari: 'selesai', ke: 'siap', label: 'skor > 500' }
      ]
    },

    pseudokode: [
      { baris: 540, tingkat: 0, teks: 'seluruh medan perang jadi <b>satu string</b> sepanjang dua ratus aksara' },
      { baris: 670, tingkat: 0, teks: '<code>B$ = MID$(A$, L+Z, 40-Z)</code> &mdash; <b>jendela yang bergeser</b>' },
      { baris: 1530, tingkat: 1, teks: '<code>Z=4</code> <b>menahan</b> gulungannya empat putaran sesudah bom meledak' },
      { baris: 810, tingkat: 0, teks: 'menyentuh garis biru &rarr; <code>Y5=1</code>: <b>kendali hilang, pesawat jatuh</b>' },
      { baris: 960, tingkat: 0, teks: 'pesawat musuh mengejar ketinggian pemain&hellip;' },
      { baris: 980, tingkat: 1, teks: '&hellip;tapi satu dari delapan kali arahnya <b>dibalik</b>, supaya bisa dihindari' },
      { baris: 1430, tingkat: 0, teks: 'pesawat baru muncul begitu ada yang mencapai kolom 30 &mdash; sampai empat' },
      { baris: 1460, tingkat: 0, teks: '<code>BE = SCREEN(BY+2,3)</code> &mdash; <b>bom membaca layar</b>' },
      { baris: 1510, tingkat: 1, teks: 'kode 210/193 = pabrik Apple; nilainya <code>(25-Y2)*12</code> &mdash; makin tinggi makin besar' },
      { baris: 1295, tingkat: 0, teks: 'skor &gt; 800 &rarr; <b>menang, walaupun pesawatnya baru saja hancur</b>' }
    ],

    perintahAsli: 'run\\ATTACK.bat',
    catatanAsli: 'Kemudikan dengan 8 (naik), 2 (turun), 5 (berhenti); 4 ' +
      'menjatuhkan bom, 6 menembakkan laser. Jangan menyentuh garis biru di ' +
      'atas maupun tanah di bawah.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol tetap 80 kolom. ' +
      'Jendela pemandangannya tetap selebar 40 karena diiris program sendiri.',

      '<b><code>SOUND</code> dan <code>BEEP</code> diam.</b>',

      '<b>Gelung tunda habis seketika</b>, jadi animasi lepas landas ' +
      '(2100&ndash;2270) dan ledakan (1500) lewat dalam satu langkah.',

      '<b><code>RANDOMIZE</code> memasang benih tetap.</b>',

      '<b><code>POKE &amp;H17,&amp;H40</code> dan <code>POKE 1047,32</code> ' +
      'tidak ditiru.</b> Keduanya alamat yang <b>sama</b> &mdash; 0040:0017 ' +
      'dan 0:1047 &mdash; ditulis dengan dua cara berbeda di satu program.',

      '<b>Tiga blok "huruf demi huruf" (1310-1340, 1360-1390, 1750-1780) ' +
      'digabung</b> jadi satu entri tabel per blok, karena tiga baris di ' +
      'tengahnya tidak punya percabangan. Nomor barisnya tetap ada di tabel ' +
      'supaya cakupannya utuh.',

      '<b><code>LOAD "MENU",R</code> diperlakukan sama seperti ' +
      '<code>RUN "MENU"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Pemandangan yang seluruhnya sebuah string, jendela yang ' +
        'bergeser di atasnya, dan bom yang membaca layar untuk tahu apa yang ' +
        'dikenainya.',
      pelajari: [
        ['Peta sebagai string, tampilan sebagai jendela',
         'Baris 540 menyimpan seluruh medan perang &mdash; bukit, gedung, ' +
         'pabrik &mdash; sebagai <b>satu string sepanjang dua ratus aksara</b>. ' +
         'Baris 670 mengiris empat puluh di antaranya dan mencetaknya. ' +
         'Menggeser <code>L</code> satu langkah menggeser seluruh dunia. ' +
         'Tidak ada larik peta, tidak ada penggambaran ulang &mdash; ' +
         '<b>gulungan mendatar dari satu <code>MID$</code></b>.'],
        ['Menahan gulungan tanpa menghentikan permainan',
         '<code>Z=4</code> di baris 1530, dan baris 660 menguranginya satu ' +
         'tiap putaran. Selama <code>Z</code> masih ada, baris 670 mengiris ' +
         'dari tempat yang sama dan mencetaknya digeser ke kanan &mdash; jadi ' +
         'pemandangannya <b>berhenti bergerak</b> sejenak supaya ledakannya ' +
         'sempat terlihat, sementara pesawat dan musuh tetap jalan.'],
        ['Bom yang membaca layar',
         '<code>BE=SCREEN(BY+2,3)</code> menanyakan aksara apa yang ada tepat ' +
         'di bawah bom. Kode 210 dan 193 adalah bagian pabrik Apple; apa pun ' +
         'di atas 169 adalah bangunan lain. <b>Nilai sasaran disimpan sebagai ' +
         'kode aksara gambarnya</b>, dan tidak ada tabel di mana pun. Program ' +
         'keenam di koleksi ini yang memakai layar sebagai data.'],
        ['Nilai yang bergantung keberanian',
         'Baris 1510: pabrik Apple bernilai <code>(25-Y2)*12</code>, dengan ' +
         '<code>Y2</code> ketinggian saat bom <b>dijatuhkan</b>. Mengebom dari ' +
         'atas aman tapi murah; menukik rendah berbahaya tapi mahal. Satu ' +
         'perkalian, dan permainannya punya pilihan.'],
        ['Kesulitan yang tumbuh dari keadaan',
         'Baris 950 memanggil 1430 begitu ada pesawat mencapai kolom 30, dan ' +
         '1430 memunculkan satu pesawat baru &mdash; sampai empat. Tidak ada ' +
         'penghitung tingkat, tidak ada jadwal. <b>Makin lama bertahan, makin ' +
         'ramai</b>, dan itu akibat langsung dari geraknya sendiri.']
      ],
      hindari: [
        ['Dua ejaan untuk satu alamat',
         'Baris 520 menulis <code>DEF SEG=&amp;H40:POKE &amp;H17,&amp;H40</code>; ' +
         'baris 625 menulis <code>DEF SEG=0:POKE 1047,32</code>. Keduanya ' +
         'menyentuh <b>bita yang sama</b> &mdash; 0040:0017 dan 0:1047 adalah ' +
         'alamat yang identik. Satu program, dua cara menuliskannya, seratus ' +
         'baris berjauhan.'],
        ['Tanda banding yang terbalik',
         'Baris 1514: <code>IF BE=&gt;169</code>. Yang benar ' +
         '<code>&gt;=</code>. GW-BASIC menerimanya diam-diam &mdash; dan ' +
         'karena menerimanya, tidak ada yang pernah memperbaikinya.'],
        ['Pencacah gelung yang dinaikkan sendiri',
         'Baris 900: <code>IF Q&lt;Q1 THEN Q=Q+1:GOTO 880</code>, di dalam ' +
         'gelung <code>FOR Q</code>. Pola yang sama dengan KENO.BAS baris 690 ' +
         '&mdash; dan sama sulitnya dibaca.'],
        ['Menang sesudah hancur',
         'Baris 1295 memeriksa <code>SC&gt;800</code> <b>di dalam</b> jalur ' +
         'kehancuran pesawat. Jadi pemain yang skornya cukup akan melihat ' +
         'pesawatnya meledak, lalu diberi tahu "GOOD JOB!!". Mungkin ' +
         'disengaja &mdash; kerusakan yang sudah dilakukan lebih penting ' +
         'daripada nasib pilotnya &mdash; tapi tidak ada satu kata pun yang ' +
         'mengatakannya.'],
        ['Salah eja di petunjuk',
         '<code>ALLOTED</code> (baris 1840) dan <code>LOOSE</code> untuk ' +
         '"lose" (baris 1910).']
      ]
    },

    penjelasan: [
      { judul: 'Dunia yang muat di satu string',
        isi: [
          'Baris 540 panjangnya lebih dari dua ratus aksara, dan isinya ' +
          'seluruh medan perang:',
          '<code>A$="_____/\\_____/\\__/\\____&hellip;▄╥╥╥▄__▄┴┴┴▄_&hellip;"</code>',
          'Garis bawah adalah tanah datar. <code>/\\</code> adalah bukit. ' +
          'Kumpulan aksara blok adalah bangunan &mdash; dan yang di tengah, ' +
          '<code>▄╥╥╥▄__▄┴┴┴▄</code>, adalah pabrik Apple.',
          'Yang tampak di layar cuma empat puluh aksara:',
          '<code>670 B$=MID$(A$,L+Z,40-Z)</code><br>' +
          '<code>680 LOCATE 23,1+Z:PRINT B$;</code>',
          'Dan <code>L</code> naik satu tiap putaran. Itu saja seluruh ' +
          'mesin gulungannya. Tidak ada larik peta, tidak ada penggambaran ' +
          'ulang per petak, tidak ada perhitungan tepi &mdash; <b>satu ' +
          '<code>MID$</code>, dan dunianya bergerak</b>.',
          'Yang lebih rapi lagi: <code>Z</code>. Waktu bom meledak, baris ' +
          '1530 menyetel <code>Z=4</code>, dan baris 660 menguranginya satu ' +
          'tiap putaran. Selama itu, irisannya diambil dari tempat yang sama ' +
          'dan dicetak digeser ke kanan &mdash; <b>pemandangannya berhenti ' +
          'bergerak</b> sementara pesawat dan musuh tetap jalan.',
          'Satu variabel, dan sebuah jeda dramatis yang tidak menghentikan ' +
          'apa pun yang lain.'
        ] },
      { judul: 'Sasarannya bernama',
        isi: [
          'Petunjuk di baris 1820&ndash;1850 tidak berbasa-basi:',
          '<i>"YOUR MISSION IS TO ATTACK AND DESTROY THE APPLE COMPUTER ' +
          'MANUFACTURING PLANT&hellip; THERE ARE APPLE-OWNED FIGHTERS TRYING TO ' +
          'STOP YOU."</i>',
          'Tanggalnya <b>7 Oktober 1982</b>, dan berkasnya duduk di disket ' +
          'bertuliskan "IBM General utility programs" &mdash; layar judul yang ' +
          'sama dengan SERPENT.BAS dan ZAP\'EM.BAS di koleksi ini.',
          'Pada 1982, Apple II sudah lima tahun di pasar dan IBM PC baru ' +
          'setahun. Persaingannya nyata, dan bagi orang yang menulis program ' +
          'ini ia cukup terasa untuk dijadikan permainan.',
          'Yang menarik secara teknis: <b>pabriknya bukan gambar terpisah</b>. ' +
          'Ia bagian dari string medan perang di baris 540, dan yang ' +
          'membuatnya bernilai lebih cuma dua kode aksara &mdash; 210 dan 193 ' +
          '&mdash; yang diperiksa baris 1510 waktu bom mendarat.',
          'Jadi "pabrik Apple" di program ini bukan benda, bukan struktur ' +
          'data, bukan entri di tabel apa pun. Ia <b>dua kode aksara di ' +
          'sebuah string</b>, dan sebuah <code>IF</code> yang tahu artinya.'
        ] }
    ]
  };
})(window);
