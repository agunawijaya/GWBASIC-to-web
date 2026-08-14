/* ===========================================================================
   ELIZA.js — porting minimalis ELIZA.BAS sebagai tabel baris.

       100 "ELIZA - Version 3.0"
       110 "Copyright (C) 1981 by Steve Grumette"

   Psikoterapis Rogerian karya Joseph Weizenbaum (1966), ditulis ulang untuk
   IBM PC. Lima ratus empat belas baris — dan aturannya TIDAK ADA DI DALAM
   PROGRAM:

       160 OPEN"I",1,"STRINGS.FIL"
       170 FOR I=1 TO 22:INPUT#1,OW$(I),RW$(I),LO(I),LR(I):NEXT
       190 FOR I=1 TO 27:INPUT#1,B$(I):NEXT
       220 FOR I=1 TO 44:INPUT#1,K$(I):NEXT

   Seluruh kosakatanya — 22 aturan penukaran kata, 27 penggal frasa, dan 44
   kata kunci — dibaca dari berkas terpisah sepanjang 1.274 bita. Program dan
   datanya bisa diganti sendiri-sendiri.

   YANG PALING LAYAK DILIHAT: BITA NOL SEBAGAI PENANDA "JANGAN DISENTUH LAGI".

   Baris 420-450 menukar kata ganti: "I" jadi "YOU", "YOU" jadi "I", "MY"
   jadi "YOUR". Tapi gelungnya berjalan dua puluh dua kali berturut-turut —
   jadi "YOU" yang baru saja ditulis akan ketemu lagi oleh aturan berikutnya
   dan dibalik kembali jadi "I".

   Jalan keluarnya:

       180 RW$(12)=" YO"+CHR$(0)+"U "
       230 K$(22)=" AR"+CHR$(0)+"E "
      4600 ZZ=INSTR(B$,CHR$(0))
      4605 IF ZZ THEN B$=LEFT$(B$,ZZ-1)+MID$(B$,ZZ+1):GOTO 4600

   Kata penggantinya disisipi BITA NOL DI TENGAHNYA. " YO\0U " tidak pernah
   cocok dengan pola " YOU ", jadi aturan berikutnya melewatinya. Dan tepat
   sebelum dicetak, baris 4600 mencabut semua nol itu.

   Berkas datanya memakai penanda kedua untuk maksud yang sama: tanda bintang.
   `" MY "," *OUR "` — dan baris 480 mengubah tiap `*` jadi `Y` sesudah
   seluruh penukaran selesai. Dua penanda, satu gagasan.

   DAN JAWABANNYA TIDAK ACAK. Tiap kelompok jawaban punya pencacahnya sendiri
   yang berputar: `X0=X0+1:IF X0=7 THEN X0=1`. Ada empat puluh enam pencacah
   semacam itu di berkas ini. ELIZA tidak mengundi — ia BERGILIR.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `STRINGS.FIL` dimuat sebagai disket dalam memori; isinya persis berkas
     aslinya, 159 nilai.
   - `WIDTH WD` dengan `WD` dibaca dari BIOS (`PEEK &H40:&H4A`) diganti
     lebar konsol penelusur, 80.
   - Menyimpan percakapan ke berkas (4860-4880) menulis ke disket dalam
     memori, bukan ke cakram sungguhan.
   - `RUN` (baris 330 dan 4990) memuat ulang program yang sama.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Isi STRINGS.FIL apa adanya: 22 x (kata lama, kata baru, panjang lama,
     panjang baru), lalu 27 penggal frasa, lalu 44 kata kunci. */
  var STRINGS = [".", " . ", 1, 3, ",", " . ", 1, 3, "?", " . ", 1, 3, "!", " . ", 1, 3, " MOM ", " MOTHER ", 5, 8, " DAD ", " FATHER ", 5, 8, " DONT ", " DON'T ", 6, 7, " CANT ", " CAN'T ", 6, 7, " WONT ", " WON'T ", 6, 7, " DREAMED ", " DREAMT ", 9, 8, " DREAMS ", " DREAM ", 8, 7, " I ", " YOU ", 3, 5, " YOU ", " I ", 5, 3, " ME ", " YOU ", 4, 5, " MY ", " *OUR ", 4, 6, " YOUR ", " MY ", 6, 4, " MYSELF ", " *OURSELF ", 8, 10, " YOURSELF ", " MYSELF ", 10, 8, " I'M ", " *OU'RE ", 5, 8, " YOU'RE ", " I'M ", 8, 5, " AM ", " ARE ", 4, 5, " WERE ", " WAS ", 6, 5, " IS ", " ARE ", " ARE ", " WAS ", " MOTHER ", " FATHER ", " SISTER ", " BROTHER ", " WIFE ", " HUSBAND ", " CHILDREN ", " WANT ", " NEED ", " SAD ", " UNHAPPY ", " DEPRESSED ", " SICK ", " HAPPY ", " ELATED ", " GLAD ", " BETTER ", " FEEL ", " THINK ", " BELIEVE ", " WISH ", " CAN'T ", " CANNOT ", " COMPUTER ", " COMPUTERS ", " MACHINE ", " MACHINES ", " NAME ", " ALIKE ", " LIKE ", " SAME ", " REMEMBER ", " DREAMT ", " DREAM ", " IF ", " EVERYBODY ", " EVERYONE ", " NOBODY ", " NO ONE ", " WAS ", " YOUR ", " ALWAYS ", " SORRY ", " ARE ", " ARE ", " BECAUSE ", " CAN ", " CERTAINLY ", " YES ", " DEUTSCH ", " ESPANOL ", " FRANCAIS ", " ITALIANO ", " HELLO ", " HOW ", " WHAT ", " WHEN ", " WHO ", " I ", " I'M ", " MAYBE ", " PERHAPS ", " MY ", " NO ", " WHY ", " YOU ", " YOU'RE "];

  /* --- padanan fungsi string BASIC --------------------------------------
     BASIC menghitung posisi mulai dari SATU, dan INSTR mengembalikan nol
     kalau tidak ketemu. Keduanya dipertahankan supaya aritmetika posisi di
     seluruh berkas ini bisa disalin apa adanya. */
  function INSTR(a, b, c) {
    if (c === undefined) { c = b; b = a; a = 1; }
    if (a < 1) a = 1;
    return b.indexOf(c, a - 1) + 1;
  }
  function MID(s, i, n) {
    if (i < 1) i = 1;
    return n === undefined ? s.slice(i - 1) : s.substr(i - 1, n);
  }
  function LEFT(s, n) { return s.slice(0, Math.max(0, n)); }
  function RIGHT(s, n) { return n <= 0 ? '' : s.slice(-n); }
  /* `MID$(A$,i)=x` — MID$ sebagai SASARAN penugasan: timpa di tempat, tanpa
     mengubah panjang string. */
  function timpa(s, i, x) {
    return s.slice(0, i - 1) + x + s.slice(i - 1 + x.length);
  }

  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }

  var tabel = [];
  function T(x) { if (x) tabel.push(x); return x; }

  /* Kepala sebuah kelompok jawaban: naikkan pencacahnya, dan kalau sudah
     mencapai batas, kembalikan ke satu. Empat puluh enam kali di berkas ini. */
  function putar(n, ctr, batas) {
    return { baris: n, jalan: function (m) {
      m.v[ctr] = (m.v[ctr] || 0) + 1;
      if (m.v[ctr] === batas) m.v[ctr] = 1;
    } };
  }
  /* `ON <pencacah> GOTO ...` — memilih jawaban ke berapa. */
  function pilih(n, ctr, tujuan) {
    return { baris: n, jalan: function (m) {
      var ke = tujuan[(m.v[ctr] || 0) - 1];
      if (ke) m.lompat(ke);
    } };
  }
  /* Satu jawaban: susun `B$`, lalu pulang. */
  function jwb(n, bikin) {
    return { baris: n, jalan: function (m) {
      m.v['B$'] = bikin(m); m.kembali();
    } };
  }
  /* Slot kosong di dalam daftar jawaban — sebuah `RETURN` telanjang yang
     TIDAK menyusun `B$`. Pemanggilnya memeriksa nilai pencacahnya dan
     mengalihkan ke jawaban umum. Lihat catatan di halaman ini. */
  function pulang(n) {
    return { baris: n, jalan: function (m) { m.kembali(); } };
  }

  /* ===================== 10-275: penyiapan ============================= */
  T(rem(10));
  T(rem(20));
  /* 30-55 LEBAR LAYAR DIBACA DARI BIOS. Alamat 0040:004A menyimpan jumlah
     kolom layar sekarang — 40 atau 80. Program menyesuaikan pemenggalan
     barisnya (4610) dengan apa pun yang sedang dipakai pemakainya. */
  T(rem(30));
  T({ baris: 40, jalan: function (m) { m.v.WD = 80; } });
  T(rem(50));
  T({ baris: 55, jalan: function () { } });
  T({ baris: 60, jalan: function (m) { m.v['CL$'] = m.chr(12); } });
  T({ baris: 90, jalan: function (m) {
      m.v['BELL$'] = m.chr(7); m.cls();
    } });
  T({ baris: 100, jalan: function (m) {
      m.tab(30); m.cetak('ELIZA - Version 3.0'); m.barisBaru();
    } });
  T({ baris: 110, jalan: function (m) {
      m.tab(21); m.cetak('Copyright (C) 1981 by Steve Grumette');
      m.barisBaru();
    } });
  T({ baris: 120, jalan: function (m) {
      m.tab(30); m.cetak('All rights reserved'); m.barisBaru();
    } });
  /* 140 `T=1` menyalakan pengubahan huruf kecil jadi besar di baris 380.
     Tidak ada satu baris pun yang mematikannya lagi. */
  T({ baris: 140, jalan: function (m) { m.v.T = 1; } });
  T({ baris: 150, jalan: function (m) {
      m.dim('OW$()', 22); m.dim('RW$()', 22); m.dim('LO()', 22);
      m.dim('LR()', 22); m.dim('A$()', 20); m.dim('K$()', 44);
      m.dim('B$()', 27); m.dim('M$()', 20);
    } });
  T({ baris: 160, jalan: function (m) { m.bukaBaca('STRINGS.FIL'); } });
  T({ baris: 170, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 22; m.v.I++) {
        m.v['OW$()'][m.v.I] = m.bacaBerkas();
        m.v['RW$()'][m.v.I] = m.bacaBerkas();
        m.v['LO()'][m.v.I]  = m.bacaBerkas();
        m.v['LR()'][m.v.I]  = m.bacaBerkas();
      }
    } });
  /* 180 DI SINILAH BITA NOL DIPASANG. Aturan ke-12 mengubah " I " jadi
     " YOU ", dan ke-21 mengubah " AM " jadi " ARE ". Kalau penggantinya
     ditulis biasa, aturan ke-13 (" YOU " -> " I ") akan membalikkannya lagi
     dalam putaran yang sama. */
  T({ baris: 180, jalan: function (m) {
      m.v['RW$()'][12] = ' YO' + m.chr(0) + 'U ';
      m.v['RW$()'][21] = ' AR' + m.chr(0) + 'E ';
    } });
  T({ baris: 190, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 27; m.v.I++) {
        m.v['B$()'][m.v.I] = m.bacaBerkas();
      }
    } });
  T({ baris: 200, jalan: function (m) {
      m.v['B$()'][2] = ' AR' + m.chr(0) + 'E ';
    } });
  T({ baris: 210, jalan: function (m) {
      m.v['Y$'] = 'YO' + m.chr(0) + 'U ';
    } });
  T({ baris: 220, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 44; m.v.I++) {
        m.v['K$()'][m.v.I] = m.bacaBerkas();
      }
    } });
  /* 230 kata KUNCI-nya pun harus memakai bentuk bernol, karena yang dicari
     nanti adalah teks yang SUDAH ditukar — dan teks itu penuh bita nol. */
  T({ baris: 230, jalan: function (m) {
      m.v['K$()'][22] = ' AR' + m.chr(0) + 'E ';
      m.v['K$()'][43] = ' YO' + m.chr(0) + 'U ';
    } });
  T({ baris: 240, jalan: function (m) {
      m.tutup(); m.dim('S$()', 100); m.barisBaru(); m.barisBaru();
    } });
  /* 250-260 DUA KATA KOTOR, DISIMPAN SEBAGAI KODE ANGKA di baris 1510 supaya
     tidak terbaca siapa pun yang mencetak daftar programnya. Dipakai baris
     460 untuk menegur pemakainya. */
  T({ baris: 250, jalan: function (m) {
      m.v['FZ$'] = '';
      for (m.v.I = 1; m.v.I <= 4; m.v.I++) {
        m.v.ZZ = m.baca(); m.v['FZ$'] += m.chr(m.v.ZZ);
      }
    } });
  T({ baris: 260, jalan: function (m) {
      m.v['SZ$'] = '';
      for (m.v.I = 1; m.v.I <= 4; m.v.I++) {
        m.v.ZZ = m.baca(); m.v['SZ$'] += m.chr(m.v.ZZ);
      }
    } });
  T(cet(270, 'HOW DO YOU DO.'));
  T({ baris: 275, jalan: function (m) {
      m.cetak('PLEASE TELL ME YOUR PROBLEM.'); m.barisBaru(); m.barisBaru();
    } });

  /* ===================== 280-410: membaca masukan ====================== */
  T({ baris: 280, bagian: [
      function (m) { if (m.v.X === 100) m.lompat(5020); },
      function (m) { m.masukan('A$', ''); }
    ] });
  T({ baris: 290, bagian: [
      function (m) {
        if (m.v['A$'] !== 'DISPLAY' && m.v['A$'] !== 'display') m.lompat(330);
        else if ((m.v.X || 0) === 0) m.lompat(4780);
        else { m.cls(); m.barisBaru(); m.untuk('J', 0, m.v.X - 1, 1, 320); }
      },
      function (m) { m.v['B$'] = m.v['S$()'][m.v.J]; },
      function (m) { m.gosub(4610); },
      function (m) { if (m.v.J % 2 === 0) m.lompat(320); }
    ] });
  T({ baris: 300, jalan: function (m) {
      m.barisBaru();
      if (m.v.J === m.v.X - 1) m.lompat(320);
    } });
  T({ baris: 310, jalan: function (m) {
      m.v['A$'] = m.inkey();
      if (m.v['A$'] === m.chr(13)) m.lompat(320); else m.lompat(310);
    } });
  T({ baris: 320, bagian: [
      function (m) { m.lanjutkan('J'); },
      function (m) { m.lompat(280); }
    ] });
  T({ baris: 330, jalan: function (m) {
      if (m.v['A$'] === 'RESTART' || m.v['A$'] === 'restart') {
        m.jalankan('ELIZA');
      } else m.v.B = 1;
    } });
  T({ baris: 340, jalan: function (m) {
      if (m.v['A$'] === 'CLEAR' || m.v['A$'] === 'clear') {
        if ((m.v.X || 0) === 0) m.lompat(4780);
        else {
          m.v.X = 0; m.cls();
          m.tab(22); m.cetak('**** CONVERSATION BUFFER CLEARED ****');
          m.barisBaru(); m.lompat(4800);
        }
      }
    } });
  T({ baris: 350, jalan: function (m) {
      if (m.v['A$'] === 'SAVE' || m.v['A$'] === 'save') m.lompat(4780);
    } });
  /* 360 Enter di tengah masukan diganti spasi — LINE INPUT bisa membawa
     aksara 13 kalau pemakainya menempel teks berbaris banyak. */
  T({ baris: 360, jalan: function (m) {
      var a = INSTR(m.v.B, m.v['A$'], m.chr(13));
      if (a !== 0) {
        m.v['A$'] = timpa(m.v['A$'], a, ' ');
        m.v.B = a + 1; m.lompat(360);
      }
    } });
  T({ baris: 370, jalan: function (m) {
      m.v['S$()'][m.v.X || 0] = m.v['A$'];
      m.v.X = (m.v.X || 0) + 1;
    } });
  /* 380 huruf kecil jadi besar dengan mengurangi 32 — dan `MID$` sebagai
     sasaran penugasan menimpanya di tempat. */
  T({ baris: 380, jalan: function (m) {
      if (m.v.T === 0 || m.v['A$'] === '') { m.lompat(400); return; }
      for (m.v.I = 1; m.v.I <= m.v['A$'].length; m.v.I++) {
        m.v.A = MID(m.v['A$'], m.v.I, 1).charCodeAt(0);
        if (m.v.A > 96) {
          m.v['A$'] = timpa(m.v['A$'], m.v.I, m.chr(m.v.A - 32));
        }
      }
    } });
  T({ baris: 390, jalan: function () { } });
  /* 400 dua spasi di depan, satu di belakang — supaya pola seperti " I "
     bisa ketemu walaupun katanya ada di ujung kalimat. */
  T({ baris: 400, jalan: function (m) {
      m.v['A$'] = '  ' + m.v['A$'] + ' ';
    } });
  T({ baris: 410, jalan: function (m) {
      if (INSTR(m.v['A$'], ' SEX') !== 0) m.v.SX = 1;
    } });

  /* ===================== 420-540: menukar kata ========================= */
  T({ baris: 420, jalan: function (m) { m.untuk('I', 1, 22, 1, 460); } });
  T({ baris: 430, jalan: function (m) { m.v.B = 1; } });
  /* 440 penukaran yang sebenarnya. `LO(I)` panjang kata lama, `LR(I)`
     panjang kata baru — keduanya disimpan di berkas data supaya program
     tidak perlu menghitungnya. */
  T({ baris: 440, jalan: function (m) {
      var i = m.v.I;
      var a = INSTR(m.v.B, m.v['A$'], m.v['OW$()'][i]);
      if (a !== 0) {
        m.v['A$'] = LEFT(m.v['A$'], a - 1) + m.v['RW$()'][i] +
                    MID(m.v['A$'], a + m.v['LO()'][i]);
        m.v.B = a + m.v['LR()'][i];
        m.lompat(440);
      }
    } });
  T({ baris: 450, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 460, bagian: [
      function (m) {
        if (!(INSTR(m.v['A$'], m.v['FZ$']) || INSTR(m.v['A$'], m.v['SZ$']))) {
          m.lompat(470);
        }
      },
      function (m) { m.gosub(4410); },
      function (m) { m.gosub(4600); },
      function (m) { m.lompat(640); }
    ] });
  T({ baris: 470, jalan: function (m) { m.v.B = 1; } });
  /* 480 PENANDA KEDUA. Berkas datanya menulis " *OUR " untuk mengganti
     " MY " — bintangnya mencegah aturan lain mengenalinya sebagai "YOUR".
     Di sini, sesudah semua penukaran selesai, tiap bintang jadi huruf Y. */
  T({ baris: 480, jalan: function (m) {
      var a = INSTR(m.v.B, m.v['A$'], '*');
      if (a !== 0) {
        m.v['A$'] = timpa(m.v['A$'], a, 'Y');
        m.v.B = a + 1; m.lompat(480);
      }
    } });
  T({ baris: 490, jalan: function (m) { m.v.I = 0; } });
  /* 500-530 kalimat dipotong di tiap titik, dan tiap penggal diperiksa
     sendiri-sendiri. Empat aturan pertama di berkas data mengubah koma,
     tanda tanya, dan tanda seru jadi titik — jadi keempatnya memotong. */
  T({ baris: 500, jalan: function (m) {
      m.v.A = INSTR(m.v['A$'], '.');
      if (m.v.A === 0) m.v.A = m.v['A$'].length + 1;
    } });
  T({ baris: 510, jalan: function (m) {
      m.v['A0$'] = LEFT(m.v['A$'], m.v.A - 1);
      if (INSTR(' '.repeat(100), m.v['A0$']) === 1) m.lompat(530);
      else { m.v.I = m.v.I + 1; m.v['A$()'][m.v.I] = m.v['A0$']; }
    } });
  T({ baris: 520, jalan: function (m) {
      var s = m.v['A$()'][m.v.I];
      if (RIGHT(s, 2).charCodeAt(0) === 32 && s.length > 2) {
        m.v['A$()'][m.v.I] = LEFT(s, s.length - 1);
        m.lompat(520);
      }
    } });
  T({ baris: 530, jalan: function (m) {
      m.v['A$'] = MID(m.v['A$'], m.v.A + 1);
      if (m.v['A$'].length > 2) m.lompat(500);
    } });
  T({ baris: 540, jalan: function (m) {
      if (m.v.I === 0) { m.v.X = m.v.X - 1; m.lompat(280); }
    } });
  /* 550 `NE` menghitung giliran BERTURUT-TURUT tanpa kata kunci yang cocok.
     Lima kali, dan baris 1500 menggali kembali sesuatu dari ingatannya. */
  T({ baris: 550, jalan: function (m) { m.v.NE = (m.v.NE || 0) + 1; } });

  /* ===================== 560-640: mencari kata kunci =================== */
  T({ baris: 560, bagian: [
      function (m) { m.untuk('P', 1, m.v.I, 1, 1500); },
      function (m) { m.v['A$'] = m.v['A$()'][m.v.P]; }
    ] });
  /* 570-600 DUA GOLONGAN KATA KUNCI. Nomor 1 sampai 20 langsung dipakai
     begitu ketemu — itu kata yang kuat, seperti "COMPUTER" atau "DREAM".
     Nomor 21 ke atas hanya dicatat, lalu yang posisinya PALING KIRI di
     kalimat yang menang. Prioritas dari urutan berkas data. */
  T({ baris: 570, bagian: [
      function (m) { m.v.A0 = 50; m.untuk('Z', 1, 44, 1, 600); },
      function (m) {
        m.v.A = INSTR(m.v['A$'], m.v['K$()'][m.v.Z]);
        if (m.v.A === 0) m.lompat(590);
        else if (m.v.Z < 21) m.lompat(620);
      }
    ] });
  T({ baris: 580, jalan: function (m) {
      if (m.v.A < m.v.A0) { m.v.A0 = m.v.A; m.v.Z0 = m.v.Z; }
    } });
  T({ baris: 590, jalan: function (m) { m.lanjutkan('Z'); } });
  T({ baris: 600, jalan: function (m) {
      if (m.v.A0 !== 50) { m.v.Z = m.v.Z0; m.v.A = m.v.A0; m.lompat(620); }
    } });
  T({ baris: 610, bagian: [
      function (m) { m.lanjutkan('P'); },
      function (m) { m.lompat(1500); }
    ] });
  T({ baris: 620, bagian: [
      function (m) {
        var d = [650,650,650,650,660,670,680,670,710,750,
                 780,800,820,820,820,820,840,890,950,1220,960,990,
                 1020,1030,1070,1070,1080,1080,1080,1080,1090,1100,1100,1100,
                 1100,1110,1170,1180,1180,1190,1210,1230,1280,1490];
        m._ke = d[m.v.Z - 1];
        if (!m._ke) m.lompat(630);
      },
      function (m) { m.gosub(m._ke); }
    ] });
  /* 630 TIGA ARTI DI SATU VARIABEL. `A` bernilai nol berarti "coba kata
     kunci berikutnya di kalimat ini"; minus satu berarti "menyerah, coba
     kalimat berikutnya"; apa pun selain itu berarti "jawaban sudah dicetak". */
  T({ baris: 630, jalan: function (m) {
      if (m.v.A === 0) m.lompat(590);
      else if (m.v.A === -1) m.lompat(610);
    } });
  T({ baris: 640, jalan: function (m) { m.barisBaru(); m.lompat(280); } });

  /* ===================== 650-1500: penangan tiap kata kunci ============ */
  T(panggil(650, 1600)); T(panggil(660, 1680)); T(panggil(670, 1720));
  T({ baris: 680, jalan: function (m) {
      m.v['B$'] = LEFT(m.v['A$'], m.v.A);
    } });
  T({ baris: 690, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= 4; m.v.I++) {
        if (INSTR(m.v['B$'], m.v['B$()'][m.v.I]) !== 0) { m.lompat(670); return; }
      }
    } });
  T({ baris: 700, jalan: function (m) { m.v.A = 0; m.kembali(); } });
  T({ baris: 710, bagian: [
      function (m) { m.v.C = m.v.A; },
      function (m) { m.gosub(1520); },
      function (m) { m.v.D = m.v.A; m.v.A = m.v.C; },
      function (m) { m.gosub(1550); },
      function (m) {
        if (m.v.A === 0) { m.kembali(); return; }
        m.v['D$'] = MID(m.v['A$'], m.v.A, 4);
        if (m.v.D === 0 ||
            (m.v['D$'] + ' ' !== m.v['Y$'] && m.v['D$'] !== 'YOU ')) {
          m.lompat(730);
        }
      }
    ] });
  T({ baris: 720, bagian: [
      function (m) { m.v.A = m.v.D; },
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(1820); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 730, bagian: [
      function (m) { m.gosub(1550); },
      function (m) {
        if (m.v.A === 0) { m.kembali(); return; }
        if (MID(m.v['A$'], m.v.A, 5) === 'DO I ') m.v.A = m.v.D;
        else { m.v.A = 0; m.kembali(); return; }
      },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 740, bagian: [
      function (m) { m.gosub(1900); },
      function (m) { m.lompat(m.v.X4 === 4 ? 1100 : 4600); }
    ] });
  T({ baris: 750, bagian: [
      function (m) { m.v.C = m.v.A; },
      function (m) { m.gosub(1520); },
      function (m) {
        if (m.v.A === 0) { m.kembali(); return; }
        m.v.D = m.v.A; m.v.A = m.v.C;
      },
      function (m) { m.gosub(1550); },
      function (m) {
        if (m.v.A === 0) { m.kembali(); return; }
        if (MID(m.v['A$'], m.v.A, 5) === m.v['Y$']) m.v.A = m.v.D;
        else { m.v.A = 0; m.kembali(); return; }
      },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 760, bagian: [
      function (m) { m.gosub(1990); },
      function (m) {
        if (m.v.X5 === 4) m.lompat(780);
        else if (m.v.A !== 0) m.lompat(4600);
      }
    ] });
  T({ baris: 770, jalan: function (m) { m.kembali(); } });
  T({ baris: 780, bagian: [
      function (m) { m.gosub(2060); },
      function (m) { if (m.v.A !== 0) m.lompat(4600); }
    ] });
  T({ baris: 790, jalan: function (m) { m.kembali(); } });
  T({ baris: 800, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { if (m.v.A === 0) m.kembali(); }
    ] });
  T({ baris: 810, bagian: [
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(2130); },
      function (m) { m.lompat(4600); }
    ] });
  /* 820 kata kuncinya SENDIRI yang jadi bahan jawaban — tanda spasi di
     ujungnya dibuang, lalu 2190 menyisipkannya. */
  T({ baris: 820, bagian: [
      function (m) {
        var k = m.v['K$()'][m.v.Z];
        m.v['D$'] = MID(k, 1, k.length - 1);
      },
      function (m) { m.gosub(2190); },
      function (m) { m.lompat(4600); }
    ] });
  /* 830 TIDAK BISA DICAPAI dari mana pun: tidak ada satu lompatan pun ke
     sini, dan baris 820 di atasnya berakhir dengan GOTO. */
  T({ baris: 830, jalan: function (m) {
      m.cetak(m.v['B$']); m.barisBaru(); m.kembali();
    } });
  T({ baris: 840, bagian: [
      function (m) { m.v.C = m.v.A; },
      function (m) { m.gosub(1550); },
      function (m) { m.v.D = m.v.A; m.v.A = m.v.C; },
      function (m) { m.gosub(1520); },
      function (m) {
        if (!(m.v.D !== 0 && MID(m.v['A$'], m.v.D, 5) === m.v['Y$'])) {
          m.lompat(850);
        }
      },
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(2300); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 850, bagian: [
      function (m) {
        if (m.v.A === 0) { m.kembali(); return; }
        m.v.C = m.v.A;
      },
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 860, bagian: [
      function (m) {
        if (MID(m.v['A$'], m.v.C, 5) !== m.v['Y$']) m.lompat(870);
      },
      function (m) { m.gosub(2350); },
      function (m) { m.lompat(m.v.XA === 6 ? 1100 : 4600); }
    ] });
  T({ baris: 870, bagian: [
      function (m) {
        if (MID(m.v['A$'], m.v.C, 2) !== 'I ') m.lompat(880);
      },
      function (m) { m.gosub(2430); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 880, jalan: function (m) { m.v.A = 0; m.kembali(); } });
  /* 890-940 INGATAN. Tiap kali pemakainya menyebut anggota keluarga,
     penggal kalimatnya disimpan di `M$(S)`. Baris 1500 menggalinya kembali
     kalau lima giliran berturut-turut tidak ada kata kunci yang cocok. */
  T({ baris: 890, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); },
      function (m) {
        if (m.v.A === 0) { m.kembali(); return; }
        if (m.v.S === 0 || m.v.S === undefined) m.v.NE = 0;
      }
    ] });
  T({ baris: 900, bagian: [
      function (m) {
        m.v.S = (m.v.S || 0) + 1;
        m.v['M$()'][m.v.S] = m.v['D$'];
        for (m.v.I = 5; m.v.I <= 11; m.v.I++) {
          m.v.B = INSTR(m.v.A - 1, m.v['A$'], m.v['B$()'][m.v.I]);
          if (m.v.B !== 0) {
            var b = m.v['B$()'][m.v.I];
            m.v['F$'] = LEFT(b, b.length - 1);
            m.v.A = m.v.B;
            return;
          }
          if (m.v.I >= 11) { m.lompat(930); return; }
        }
      }
    ] });
  T({ baris: 910, jalan: function (m) { if (m.v.I < 7) m.v.M = 1; } });
  T({ baris: 920, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(2500); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 930, jalan: function () { } });
  T({ baris: 940, bagian: [
      function (m) { m.gosub(2560); },
      function (m) { m.lompat(4600); }
    ] });
  T(panggil(950, 2620));
  T({ baris: 960, bagian: [
      function (m) { m.gosub(1520); },
      function (m) {
        if (m.v.A === 0) { m.lompat(980); return; }
        if (MID(m.v['A$'], m.v.A, 2) !== 'I ') m.lompat(980);
      },
      function (m) { m.gosub(1520); }
    ] });
  T({ baris: 970, bagian: [
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(2680); },
      function (m) { m.lompat(m.v.XF === 5 ? 1100 : 4600); }
    ] });
  T({ baris: 980, bagian: [
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(2750); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 990, bagian: [
      function (m) { m.gosub(1520); },
      function (m) {
        if (m.v.A === 0) { m.lompat(1010); return; }
        m.v.C = m.v.A;
      },
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 1000, bagian: [
      function (m) {
        if (MID(m.v['A$'], m.v.C, 5) !== m.v['Y$']) m.lompat(1010);
      },
      function (m) { m.gosub(2810); },
      function (m) { m.lompat(m.v.XH === 5 ? 1100 : 4600); }
    ] });
  T({ baris: 1010, bagian: [
      function (m) { m.gosub(2880); },
      function (m) { m.lompat(4600); }
    ] });
  T(panggil(1020, 2900));
  T({ baris: 1030, bagian: [
      function (m) { m.gosub(1520); },
      function (m) {
        if (m.v.A === 0) { m.v.A = -1; m.kembali(); return; }
        m.v.C = m.v.A;
      },
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 1040, bagian: [
      function (m) {
        if (MID(m.v['A$'], m.v.C, 2) !== 'I ') m.lompat(1050);
      },
      function (m) { m.gosub(2960); },
      function (m) { m.lompat(m.v.XK === 2 ? 1100 : 4600); }
    ] });
  T({ baris: 1050, bagian: [
      function (m) {
        if (MID(m.v['A$'], m.v.C, 5) !== m.v['Y$']) m.lompat(1060);
      },
      function (m) { m.gosub(3020); },
      function (m) { m.lompat(m.v.XL === 4 ? 1100 : 4600); }
    ] });
  T({ baris: 1060, jalan: function (m) { m.v.A = -1; m.kembali(); } });
  T(panggil(1070, 3080));
  T({ baris: 1080, jalan: function (m) {
      m.v['B$'] = 'I AM SORRY, I SPEAK ONLY ENGLISH.'; m.lompat(4600);
    } });
  T({ baris: 1090, jalan: function (m) {
      m.v['B$'] = 'HELLO.  PLEASE STATE YOUR PROBLEM.'; m.lompat(4600);
    } });
  T(panggil(1100, 3140));
  T({ baris: 1110, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); },
      function (m) { if (m.v.A === 0) m.lompat(1160); }
    ] });
  T({ baris: 1120, jalan: function (m) {
      if (MID(m.v['A$'], m.v.A, 14) === 'REMIND YOU OF ') m.lompat(670);
    } });
  T({ baris: 1130, bagian: [
      function (m) {
        if (MID(m.v['A$'], m.v.A, 4) !== 'ARE ') m.lompat(1150);
      },
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 1140, bagian: [
      function (m) { m.gosub(3250); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1150, bagian: [
      function (m) {
        m.v.A1 = INSTR(m.v.A, m.v['A$'], ' YOU ');
        if (!(m.v.A1 > 0)) { m.lompat(1160); return; }
        m.v['D$'] = MID(m.v['A$'], m.v.A - 1, m.v.A1 - m.v.A + 1);
      },
      function (m) { m.gosub(3310); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1160, bagian: [
      function (m) { m.gosub(3400); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1170, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); },
      function (m) { m.lompat(1140); }
    ] });
  T(panggil(1180, 3460));
  T({ baris: 1190, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { if (m.v.A === 0) { m.v.A = -1; m.kembali(); } },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 1200, bagian: [
      function (m) { m.gosub(3530); },
      function (m) { m.lompat(4600); }
    ] });
  T(panggil(1210, 3590));
  T(panggil(1220, 3660));
  T({ baris: 1230, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { if (m.v.A === 0) { m.v.A = 1; m.lompat(1100); } }
    ] });
  T({ baris: 1240, bagian: [
      function (m) {
        if (MID(m.v['A$'], m.v.A, 8) !== "DON'T I ") { m.lompat(1260); return; }
        m.v.A = m.v.A + 5;
      },
      function (m) { m.gosub(1520); }
    ] });
  T({ baris: 1250, bagian: [
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(3720); },
      function (m) { m.lompat(m.v.XV === 5 ? 1100 : 4600); }
    ] });
  T({ baris: 1260, bagian: [
      function (m) {
        if (MID(m.v['A$'], m.v.A, 11) !== "CAN'T " + m.v['Y$']) {
          m.lompat(1100); return;
        }
        m.v.A = m.v.A + 5;
      },
      function (m) { m.gosub(1520); }
    ] });
  T({ baris: 1270, bagian: [
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(3790); },
      function (m) { m.lompat(m.v.XW === 5 ? 1100 : 4600); }
    ] });
  T({ baris: 1280, bagian: [
      function (m) { m.gosub(1520); },
      function (m) {
        if (m.v.A === 0) { m.lompat(4590); return; }
        for (m.v.I = 12; m.v.I <= 13; m.v.I++) {
          if (MID(m.v['A$'], m.v.A - 1, 6) === m.v['B$()'][m.v.I]) return;
        }
        m.lompat(1310);
      }
    ] });
  T({ baris: 1290, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { if (m.v.A === 0) m.lompat(4590); },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 1300, bagian: [
      function (m) { m.gosub(3860); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1310, jalan: function (m) {
      if (MID(m.v['A$'], m.v.A, 5) !== 'AR' + m.chr(0) + 'E ') m.lompat(1380);
    } });
  T({ baris: 1320, jalan: function (m) {
      for (m.v.I = 14; m.v.I <= 17; m.v.I++) {
        if (INSTR(m.v.A, m.v['A$'], m.v['B$()'][m.v.I]) !== 0) return;
      }
      m.lompat(1340);
    } });
  T({ baris: 1330, bagian: [
      function (m) { m.v['A$'] = m.v['B$()'][m.v.I]; m.v.A = 2; },
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(3940); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1340, jalan: function (m) {
      for (m.v.I = 18; m.v.I <= 21; m.v.I++) {
        if (INSTR(m.v.A, m.v['A$'], m.v['B$()'][m.v.I]) !== 0) return;
      }
      m.lompat(1360);
    } });
  T({ baris: 1350, bagian: [
      function (m) { m.v['A$'] = m.v['B$()'][m.v.I]; m.v.A = 2; },
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(4000); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1360, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { if (m.v.A === 0) m.lompat(4590); },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 1370, bagian: [
      function (m) { m.gosub(4060); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1380, jalan: function (m) {
      for (m.v.I = 22; m.v.I <= 25; m.v.I++) {
        if (INSTR(m.v.A - 1, m.v['A$'], m.v['B$()'][m.v.I]) === m.v.A - 1) return;
      }
      m.lompat(1420);
    } });
  T({ baris: 1390, bagian: [
      function (m) { m.gosub(1520); },
      function (m) {
        if (m.v.A === 0) { m.lompat(4590); return; }
        if (MID(m.v['A$'], m.v.A, 5) !== m.v['Y$']) m.lompat(1410);
      }
    ] });
  T({ baris: 1400, bagian: [
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); },
      function (m) { if (m.v.A === 0) m.lompat(4590); },
      function (m) { m.gosub(4120); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1410, jalan: function (m) {
      m.v.C = INSTR(m.v.A - 1, m.v['A$'], ' I ');
      if (m.v.C !== 0) { m.v.A = m.v.C; m.lompat(1110); }
      else m.lompat(1460);
    } });
  T({ baris: 1420, jalan: function (m) {
      for (m.v.I = 26; m.v.I <= 27; m.v.I++) {
        m.v.C = INSTR(m.v.A - 1, m.v['A$'], m.v['B$()'][m.v.I]);
        if (m.v.C !== 0) return;
      }
      m.lompat(1440);
    } });
  T({ baris: 1430, bagian: [
      function (m) { m.v.A = m.v.C; },
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(4170); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1440, bagian: [
      function (m) {
        if (MID(m.v['A$'], m.v.A, 6) !== "DON'T ") { m.lompat(1470); return; }
      },
      function (m) { m.gosub(1520); },
      function (m) { m.gosub(1580); }
    ] });
  T({ baris: 1450, bagian: [
      function (m) { m.gosub(4230); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1460, bagian: [
      function (m) { if (m.v.I !== 22) m.lompat(1470); },
      function (m) { m.gosub(1580); },
      function (m) { m.gosub(4290); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1470, jalan: function (m) {
      m.v.C = INSTR(m.v.A, m.v['A$'], ' I ');
      if (m.v.C === 0) m.lompat(4590);
    } });
  T({ baris: 1480, bagian: [
      function (m) {
        m.v['D$'] = MID(m.v['A$'], m.v.A - 1, m.v.C - m.v.A + 1);
      },
      function (m) { m.gosub(4350); },
      function (m) { m.lompat(4600); }
    ] });
  T({ baris: 1490, jalan: function (m) { m.lompat(1320); } });
  /* 1500 LIMA GILIRAN TANPA KATA KUNCI, dan ELIZA menggali ingatannya. */
  T({ baris: 1500, bagian: [
      function (m) {
        if ((m.v.NE || 0) > 5 && (m.v.S || 0) !== 0) {
          m.v.NE = 0; m.lompat(4460);
        }
      },
      function (m) { m.gosub(4690); },
      function (m) { m.gosub(4600); },
      function (m) { m.lompat(640); }
    ] });
  /* 1510 dua kata kotor, tersimpan sebagai delapan bilangan. */
  T({ baris: 1510, jalan: function (m) {
      m.data([83, 72, 73, 84, 70, 85, 67, 75]);
    } });

  /* --- 1520-1590: maju satu kata, mundur satu kata, ambil sisanya ------- */
  T({ baris: 1520, jalan: function (m) {
      m.v.A = m.v.A + 1;
      m.v.A = INSTR(m.v.A, m.v['A$'], ' ');
    } });
  T({ baris: 1530, jalan: function (m) {
      m.v.A = m.v.A + 1;
      if (m.v.A > m.v['A$'].length) { m.v.A = 0; m.kembali(); }
      else if (MID(m.v['A$'], m.v.A, 1) === ' ') m.lompat(1530);
    } });
  T({ baris: 1540, jalan: function (m) { m.kembali(); } });
  T({ baris: 1550, jalan: function (m) {
      m.v.A = m.v.A - 1;
      if (m.v.A === 0) m.kembali();
      else if (MID(m.v['A$'], m.v.A, 1) === ' ') m.lompat(1550);
    } });
  T({ baris: 1560, jalan: function (m) {
      m.v.A = m.v.A - 1;
      if (MID(m.v['A$'], m.v.A, 1) !== ' ') m.lompat(1560);
    } });
  T({ baris: 1570, jalan: function (m) { m.v.A = m.v.A + 1; m.kembali(); } });
  /* 1580 SISA KALIMAT MULAI SATU AKSARA SEBELUM `A` — spasi di depannya
     ikut terbawa, dan itulah sebabnya jawabannya bisa ditulis
     `"DO YOU OFTEN THINK OF"+D$+"?"` tanpa menambah spasi. */
  T({ baris: 1580, jalan: function (m) {
      if (m.v.A === 0) m.v['D$'] = '';
      else m.v['D$'] = MID(m.v['A$'], m.v.A - 1, m.v['A$'].length - m.v.A + 1);
    } });
  T({ baris: 1590, jalan: function (m) { m.kembali(); } });


  /* ===== 1600-4580: empat puluh enam kelompok jawaban ===== */
  T(putar(1600, 'X0', 7));
  T(pilih(1610, 'X0', [1620, 1630, 1640, 1650, 1660, 1670]));
  T(jwb(1620, function (m) { return "DO COMPUTERS WORRY YOU?"; }));
  T(jwb(1630, function (m) { return "WHY DO YOU MENTION COMPUTERS?"; }));
  T(jwb(1650, function (m) { return "DON'T YOU THINK COMPUTERS CAN HELP PEOPLE?"; }));
  T(jwb(1660, function (m) { return "WHAT ABOUT MACHINES WORRIES YOU?"; }));
  T(jwb(1670, function (m) { return "WHAT DO YOU THINK ABOUT MACHINES?"; }));
  T(putar(1680, 'X1', 3));
  T(pilih(1690, 'X1', [1700, 1710]));
  T(jwb(1700, function (m) { return "I AM NOT INTERESTED IN NAMES."; }));
  T(putar(1720, 'X2', 9));
  T(pilih(1730, 'X2', [1740, 1750, 1760, 1770, 1780, 1790, 1800, 1810]));
  T(jwb(1740, function (m) { return "IN WHAT WAY?"; }));
  T(jwb(1750, function (m) { return "WHAT RESEMBLANCE DO YOU SEE?"; }));
  T(jwb(1760, function (m) { return "WHAT DOES THAT SIMILARITY SUGGEST TO YOU?"; }));
  T(jwb(1770, function (m) { return "WHAT OTHER CONNECTIONS DO YOU SEE"; }));
  T(jwb(1780, function (m) { return "WHAT DO YOU SUPPOSE THAT RESEMBLANCE MEANS?"; }));
  T(jwb(1790, function (m) { return "WHAT IS THE CONNECTION, DO YOU SUPPOSE?"; }));
  T(jwb(1800, function (m) { return "COULD THERE REALLY BE SOME CONNECTION?"; }));
  T(jwb(1810, function (m) { return "HOW?"; }));
  T(putar(1820, 'X3', 7));
  T(pilih(1830, 'X3', [1840, 1850, 1860, 1870, 1880, 1890]));
  T(jwb(1840, function (m) { return "DO YOU OFTEN THINK OF" + m.v['D$'] + "?"; }));
  T(jwb(1850, function (m) { return "DOES THINKING OF" + m.v['D$'] + " BRING ANYTHING ELSE TO MIND?"; }));
  T(jwb(1860, function (m) { return "WHAT ELSE DO YOU REMEMBER?"; }));
  T(jwb(1870, function (m) { return "WHY DO YOU REMEMBER" + m.v['D$'] + " JUST NOW?"; }));
  T(jwb(1880, function (m) { return "WHAT IN THE PRESENT SITUATION REMINDS YOU OF" + m.v['D$'] + "?"; }));
  T(jwb(1890, function (m) { return "WHAT IS THE CONNECTION BETWEEN ME AND" + m.v['D$'] + "?"; }));
  T(putar(1900, 'X4', 6));
  T(pilih(1910, 'X4', [1920, 1930, 1940, 1960, 1970]));
  T(jwb(1920, function (m) { return "DID YOU THINK I WOULD FORGET" + m.v['D$'] + "?"; }));
  T(jwb(1930, function (m) { return "WHY DO YOU THINK I SHOULD RECALL" + m.v['D$'] + " NOW?"; }));
  T(jwb(1950, function (m) { return "WHAT ABOUT" + m.v['D$'] + "?"; }));
  T(pulang(1960));
  T(jwb(1980, function (m) { return "YOU MENTIONED" + m.v['D$'] + "."; }));
  T(putar(1990, 'X5', 6));
  T(pilih(2000, 'X5', [2010, 2020, 2030, 2040, 2050]));
  T(jwb(2010, function (m) { return "REALLY," + m.v['D$'] + "?"; }));
  T(jwb(2020, function (m) { return "HAVE YOU EVER FANTASIED" + m.v['D$'] + " WHILE YOU WERE AWAKE?"; }));
  T(jwb(2030, function (m) { return "HAVE YOU DREAMT" + m.v['D$'] + " BEFORE?"; }));
  T(pulang(2040));
  T(putar(2060, 'X6', 6));
  T(pilih(2070, 'X6', [2080, 2090, 2100, 2110, 2120]));
  T(jwb(2080, function (m) { return "WHAT DOES THAT DREAM SUGGEST TO YOU?"; }));
  T(jwb(2090, function (m) { return "DO YOU DREAM OFTEN?"; }));
  T(jwb(2100, function (m) { return "WHAT PERSONS APPEAR IN YOUR DREAMS?"; }));
  T(putar(2130, 'X7', 5));
  T(pilih(2140, 'X7', [2150, 2160, 2170, 2180]));
  T(jwb(2150, function (m) { return "DO YOU THINK ITS LIKELY THAT" + m.v['D$'] + "?"; }));
  T(jwb(2160, function (m) { return "DO YOU WISH THAT" + m.v['D$'] + "?"; }));
  T(jwb(2170, function (m) { return "WHAT DO YOU THINK ABOUT IF" + m.v['D$'] + "?"; }));
  T(jwb(2180, function (m) { return "REALLY, IF" + m.v['D$'] + "?"; }));
  T(putar(2190, 'X8', 10));
  T(pilih(2200, 'X8', [2210, 2220, 2230, 2240, 2250, 2260, 2270, 2280, 2290]));
  T(jwb(2210, function (m) { return "REALLY," + m.v['D$'] + "?"; }));
  T(jwb(2220, function (m) { return "SURELY NOT" + m.v['D$'] + "?"; }));
  T(jwb(2230, function (m) { return "CAN YOU THINK OF ANYONE IN PARTICULAR?"; }));
  T(jwb(2240, function (m) { return "WHO, FOR EXAMPLE?"; }));
  T(jwb(2250, function (m) { return "YOU ARE THINKING OF A VERY SPECIAL PERSON."; }));
  T(jwb(2260, function (m) { return "WHO, MAY I ASK?"; }));
  T(jwb(2270, function (m) { return "SOMEONE SPECIAL PERHAPS?"; }));
  T(jwb(2280, function (m) { return "YOU HAVE A PARTICULAR PERSON IN MIND, DON'T YOU?"; }));
  T(jwb(2290, function (m) { return "WHO DO YOU THINK YOU'RE TALKING ABOUT?"; }));
  T(putar(2300, 'X9', 4));
  T(pilih(2310, 'X9', [2320, 2330, 2340]));
  T(jwb(2320, function (m) { return "WERE YOU REALLY?"; }));
  T(jwb(2330, function (m) { return "WHY DO YOU TELL ME YOU WERE" + m.v['D$'] + " NOW?"; }));
  T(jwb(2340, function (m) { return "PERHAPS I ALREADY KNEW YOU WERE" + m.v['D$'] + "."; }));
  T(putar(2350, 'XA', 7));
  T(pilih(2360, 'XA', [2370, 2380, 2390, 2400, 2410, 2420]));
  T(jwb(2370, function (m) { return "WHAT IF YOU WERE" + m.v['D$'] + "?"; }));
  T(jwb(2380, function (m) { return "DO YOU THINK YOU WERE" + m.v['D$'] + "?"; }));
  T(jwb(2390, function (m) { return "WERE YOU" + m.v['D$'] + "?"; }));
  T(jwb(2400, function (m) { return "WHAT WOULD IT MEAN IF YOU WERE" + m.v['D$'] + "?"; }));
  T(pulang(2420));
  T(putar(2430, 'XB', 6));
  T(pilih(2440, 'XB', [2450, 2460, 2470, 2480, 2490]));
  T(jwb(2450, function (m) { return "WOULD YOU LIKE TO BELIEVE I WAS" + m.v['D$'] + "?"; }));
  T(jwb(2460, function (m) { return "WHAT SUGGESTS THAT I WAS" + m.v['D$'] + "?"; }));
  T(jwb(2470, function (m) { return "WHAT DO YOU THINK?"; }));
  T(jwb(2480, function (m) { return "PERHAPS I WAS" + m.v['D$'] + "."; }));
  T(jwb(2490, function (m) { return "WHAT IF I HAD BEEN" + m.v['D$'] + "?"; }));
  T(putar(2500, 'XC', 5));
  T(pilih(2510, 'XC', [2520, 2530, 2540, 2550]));
  T(jwb(2520, function (m) { return "TELL ME MORE ABOUT YOUR FAMILY."; }));
  T(jwb(2540, function (m) { return "LET'S TALK ABOUT YOUR" + m.v['F$'] + "."; }));
  T(jwb(2550, function (m) { return "WHAT ELSE COMES TO MIND WHEN YOU THINK OF YOUR" + m.v['F$'] + "?"; }));
  T(putar(2560, 'XD', 5));
  T(pilih(2570, 'XD', [2580, 2590, 2600, 2610]));
  T(jwb(2590, function (m) { return "WHY DO YOU SAY YOUR" + m.v['D$'] + "?"; }));
  T(jwb(2600, function (m) { return "DOES THE FACT THAT YOUR" + m.v['D$'] + " SUGGEST ANYTHING ELSE TO YOU?"; }));
  T(jwb(2610, function (m) { return "IS IT IMPORTANT TO YOU THAT YOUR" + m.v['D$'] + "?"; }));
  T(putar(2620, 'XE', 5));
  T(pilih(2630, 'XE', [2640, 2650, 2660, 2670]));
  T(jwb(2640, function (m) { return "CAN YOU THINK OF A SPECIFIC EXAMPLE?"; }));
  T(jwb(2650, function (m) { return "WHEN?"; }));
  T(jwb(2660, function (m) { return "WHAT INCIDENT ARE YOU THINKING OF?"; }));
  T(jwb(2670, function (m) { return "REALLY, ALWAYS?"; }));
  T(putar(2680, 'XF', 6));
  T(pilih(2690, 'XF', [2700, 2710, 2720, 2730, 2740]));
  T(jwb(2700, function (m) { return "WHY ARE YOU INTERESTED IN WHETHER I AM" + m.v['D$'] + " OR NOT?"; }));
  T(jwb(2710, function (m) { return "WOULD YOU PREFER IT IF I WEREN'T" + m.v['D$'] + "?"; }));
  T(jwb(2720, function (m) { return "PERHAPS I AM" + m.v['D$'] + " IN YOUR FANTASIES."; }));
  T(jwb(2730, function (m) { return "DO YOU SOMETIMES THINK I AM" + m.v['D$'] + "?"; }));
  T(pulang(2740));
  T(putar(2750, 'XG', 5));
  T(pilih(2760, 'XG', [2770, 2780, 2790, 2800]));
  T(jwb(2770, function (m) { return "DID YOU THINK THEY MIGHT NOT BE" + m.v['D$'] + "?"; }));
  T(jwb(2780, function (m) { return "WOULD YOU LIKE IT IF THEY WERE NOT" + m.v['D$'] + "?"; }));
  T(jwb(2790, function (m) { return "WHAT IF THEY WERE NOT" + m.v['D$'] + "?"; }));
  T(jwb(2800, function (m) { return "POSSIBLY THEY ARE" + m.v['D$'] + "."; }));
  T(putar(2810, 'XH', 6));
  T(pilih(2820, 'XH', [2830, 2840, 2850, 2860, 2870]));
  T(jwb(2830, function (m) { return "DO YOU BELIEVE YOU ARE" + m.v['D$'] + "?"; }));
  T(jwb(2840, function (m) { return "WOULD YOU WANT TO BE" + m.v['D$'] + "?"; }));
  T(jwb(2850, function (m) { return "YOU WISH I WOULD TELL YOU THAT YOU ARE" + m.v['D$'] + "."; }));
  T(jwb(2860, function (m) { return "WHAT WOULD IT MEAN TO YOU IF YOU WERE" + m.v['D$'] + "?"; }));
  T(pulang(2870));
  T(pulang(2890));
  T(putar(2900, 'XJ', 5));
  T(pilih(2910, 'XJ', [2920, 2930, 2940, 2950]));
  T(jwb(2920, function (m) { return "IS THAT THE REAL REASON?"; }));
  T(jwb(2930, function (m) { return "DON'T ANY OTHER REASONS COME TO MIND?"; }));
  T(jwb(2940, function (m) { return "DOES THAT REASON SEEM TO EXPLAIN ANYTHING ELSE?"; }));
  T(jwb(2950, function (m) { return "WHAT OTHER REASONS MIGHT THERE BE?"; }));
  T(putar(2960, 'XK', 5));
  T(pilih(2970, 'XK', [2980, 2990, 3000, 3010]));
  T(jwb(2980, function (m) { return "YOU BELIEVE I CAN" + m.v['D$'] + ", DON'T YOU?"; }));
  T(pulang(2990));
  T(jwb(3000, function (m) { return "DO YOU WANT ME TO BE ABLE TO" + m.v['D$'] + "?"; }));
  T(jwb(3010, function (m) { return "PERHAPS YOU WOULD LIKE TO BE ABLE TO" + m.v['D$'] + " YOURSELF."; }));
  T(putar(3020, 'XL', 5));
  T(pilih(3030, 'XL', [3040, 3050, 3060, 3070]));
  T(jwb(3050, function (m) { return "DO YOU WANT TO BE ABLE TO" + m.v['D$'] + "?"; }));
  T(jwb(3060, function (m) { return "PERHAPS YOU DON'T WANT TO" + m.v['D$'] + "?"; }));
  T(pulang(3070));
  T(putar(3080, 'XM', 5));
  T(pilih(3090, 'XM', [3100, 3110, 3120, 3130]));
  T(jwb(3100, function (m) { return "YOU SEEM QUITE POSITIVE."; }));
  T(jwb(3110, function (m) { return "YOU ARE SURE?"; }));
  T(jwb(3120, function (m) { return "I SEE."; }));
  T(jwb(3130, function (m) { return "I UNDERSTAND."; }));
  T(putar(3140, 'XN', 10));
  T(pilih(3150, 'XN', [3160, 3170, 3180, 3190, 3200, 3210, 3220, 3230, 3240]));
  T(jwb(3160, function (m) { return "WHY DO YOU ASK?"; }));
  T(jwb(3170, function (m) { return "DOES THAT QUESTION INTEREST YOU?"; }));
  T(jwb(3180, function (m) { return "WHAT IS IT YOU REALLY WANT TO KNOW?"; }));
  T(jwb(3190, function (m) { return "ARE SUCH QUESTIONS MUCH ON YOUR MIND?"; }));
  T(jwb(3200, function (m) { return "WHAT ANSWER WOULD PLEASE YOU MOST?"; }));
  T(jwb(3210, function (m) { return "WHAT DO YOU THINK?"; }));
  T(jwb(3220, function (m) { return "WHAT COMES TO YOUR MIND WHEN YOU ASK THAT?"; }));
  T(jwb(3230, function (m) { return "HAVE YOU ASKED SUCH QUESTIONS BEFORE?"; }));
  T(jwb(3240, function (m) { return "HAVE YOU ASKED ANYONE ELSE?"; }));
  T(putar(3250, 'XO', 5));
  T(pilih(3260, 'XO', [3270, 3280, 3290, 3300]));
  T(jwb(3270, function (m) { return "WHAT MAKES YOU THINK I AM" + m.v['D$'] + "?"; }));
  T(jwb(3280, function (m) { return "DOES IT PLEASE YOU TO BELIEVE I AM" + m.v['D$'] + "?"; }));
  T(jwb(3290, function (m) { return "DO YOU SOMETIMES WISH YOU WERE" + m.v['D$'] + "?"; }));
  T(jwb(3300, function (m) { return "PERHAPS YOU WOULD LIKE TO BE" + m.v['D$'] + "?"; }));
  T(putar(3310, 'XP', 8));
  T(pilih(3320, 'XP', [3330, 3340, 3350, 3360, 3370, 3380, 3390]));
  T(jwb(3330, function (m) { return "WHY DO YOU THINK I" + m.v['D$'] + " YOU?"; }));
  T(jwb(3340, function (m) { return "YOU LIKE TO THINK I" + m.v['D$'] + " YOU - DON'T YOU?"; }));
  T(jwb(3350, function (m) { return "WHAT MAKES YOU THINK I" + m.v['D$'] + " YOU?"; }));
  T(jwb(3360, function (m) { return "REALLY, I" + m.v['D$'] + " YOU?"; }));
  T(jwb(3370, function (m) { return "DO YOU WISH TO BELIEVE I" + m.v['D$'] + " YOU?"; }));
  T(jwb(3380, function (m) { return "SUPPOSE I DID" + m.v['D$'] + " YOU - WHAT WOULD THAT MEAN?"; }));
  T(jwb(3390, function (m) { return "DOES SOMEONE ELSE BELIEVE I" + m.v['D$'] + " YOU?"; }));
  T(putar(3400, 'XQ', 5));
  T(pilih(3410, 'XQ', [3420, 3430, 3440, 3450]));
  T(jwb(3420, function (m) { return "WE WERE DISCUSSING YOU - NOT ME."; }));
  T(jwb(3440, function (m) { return "YOU'RE NOT REALLY TALKING ABOUT ME, ARE YOU?"; }));
  T(jwb(3450, function (m) { return "WHAT ARE YOUR FEELINGS NOW?"; }));
  T(putar(3460, 'XR', 6));
  T(pilih(3470, 'XR', [3480, 3490, 3500, 3510, 3520]));
  T(jwb(3480, function (m) { return "YOU DON'T SEEM QUITE CERTAIN."; }));
  T(jwb(3490, function (m) { return "WHY THE UNCERTAIN TONE?"; }));
  T(jwb(3500, function (m) { return "CAN'T YOU BE MORE POSITIVE?"; }));
  T(jwb(3510, function (m) { return "YOU AREN'T SURE?"; }));
  T(jwb(3520, function (m) { return "DON'T YOU KNOW?"; }));
  T(putar(3530, 'XS', 5));
  T(pilih(3540, 'XS', [3550, 3560, 3570, 3580]));
  T(jwb(3550, function (m) { return "WHY ARE YOU CONCERNED OVER MY" + m.v['D$'] + "?"; }));
  T(jwb(3560, function (m) { return "WHAT ABOUT YOUR OWN" + m.v['D$'] + "?"; }));
  T(jwb(3570, function (m) { return "ARE YOU WORRIED ABOUT SOMEONE ELSES" + m.v['D$'] + "?"; }));
  T(jwb(3580, function (m) { return "REALLY, MY" + m.v['D$'] + "?"; }));
  T(putar(3590, 'XT', 6));
  T(pilih(3600, 'XT', [3610, 3620, 3630, 3640, 3650]));
  T(jwb(3610, function (m) { return "WHY NOT?"; }));
  T(jwb(3620, function (m) { return "ARE YOU SAYING " + m.chr(34) + "NO" + m.chr(34) + " JUST TO BE NEGATIVE?"; }));
  T(jwb(3630, function (m) { return "YOU ARE BEING A BIT NEGATIVE."; }));
  T(jwb(3640, function (m) { return "HOW COME?"; }));
  T(jwb(3650, function (m) { return "WHY DO YOU SAY " + m.chr(34) + "NO" + m.chr(34) + "?"; }));
  T(putar(3660, 'XU', 5));
  T(pilih(3670, 'XU', [3680, 3690, 3700, 3710]));
  T(jwb(3680, function (m) { return "PLEASE DON'T APOLOGIZE."; }));
  T(jwb(3690, function (m) { return "APOLOGIES ARE NOT NECESSARY."; }));
  T(jwb(3700, function (m) { return "WHAT FEELINGS DO YOU HAVE WHEN YOU APOLOGIZE?"; }));
  T(jwb(3710, function (m) { return "I'VE TOLD YOU THAT APOLOGIES ARE NOT REQUIRED."; }));
  T(putar(3720, 'XV', 6));
  T(pilih(3730, 'XV', [3740, 3750, 3760, 3770, 3780]));
  T(jwb(3740, function (m) { return "DO YOU BELIEVE I DON'T" + m.v['D$'] + "?"; }));
  T(jwb(3750, function (m) { return "PERHAPS I WILL" + m.v['D$'] + " IN GOOD TIME."; }));
  T(jwb(3760, function (m) { return "SHOULD YOU" + m.v['D$'] + " YOURSELF?"; }));
  T(jwb(3770, function (m) { return "YOU WANT ME TO" + m.v['D$'] + "?"; }));
  T(pulang(3780));
  T(putar(3790, 'XW', 6));
  T(pilih(3800, 'XW', [3810, 3820, 3830, 3840, 3850]));
  T(jwb(3810, function (m) { return "DO YOU THINK YOU SHOULD BE ABLE TO" + m.v['D$'] + "?"; }));
  T(jwb(3820, function (m) { return "DO YOU WANT TO BE ABLE TO" + m.v['D$'] + "?"; }));
  T(jwb(3830, function (m) { return "DO YOU BELIEVE THIS WILL HELP YOU TO" + m.v['D$'] + "?"; }));
  T(jwb(3840, function (m) { return "HAVE YOU ANY IDEA WHY YOU CAN'T" + m.v['D$'] + "?"; }));
  T(pulang(3850));
  T(putar(3860, 'XX', 7));
  T(pilih(3870, 'XX', [3880, 3890, 3900, 3910, 3920, 3930]));
  T(jwb(3880, function (m) { return "WHAT WOULD IT MEAN TO YOU IF YOU GOT" + m.v['D$'] + "?"; }));
  T(jwb(3890, function (m) { return "WHY DO YOU WANT" + m.v['D$'] + "?"; }));
  T(jwb(3900, function (m) { return "SUPPOSE YOU GOT" + m.v['D$'] + " SOON?"; }));
  T(jwb(3910, function (m) { return "WHAT IF YOU NEVER GOT" + m.v['D$'] + "?"; }));
  T(jwb(3920, function (m) { return "WHAT WOULD GETTING" + m.v['D$'] + " MEAN TO YOU?"; }));
  T(putar(3940, 'XY', 5));
  T(pilih(3950, 'XY', [3960, 3970, 3980, 3990]));
  T(jwb(3960, function (m) { return "I AM SORRY TO HEAR YOU ARE" + m.v['D$'] + "."; }));
  T(jwb(3970, function (m) { return "DO YOU THINK COMING HERE WILL HELP YOU NOT TO BE" + m.v['D$'] + "?"; }));
  T(jwb(3980, function (m) { return "I'M SURE IT'S NOT PLEASANT TO BE" + m.v['D$'] + "."; }));
  T(jwb(3990, function (m) { return "CAN YOU EXPLAIN WHAT MADE YOU" + m.v['D$'] + "?"; }));
  T(putar(4000, 'XZ', 5));
  T(pilih(4010, 'XZ', [4020, 4030, 4040, 4050]));
  T(jwb(4020, function (m) { return "HOW HAVE I HELPED YOU TO BE" + m.v['D$'] + "?"; }));
  T(jwb(4030, function (m) { return "HAS YOUR TREATMENT MADE YOU" + m.v['D$'] + "?"; }));
  T(jwb(4040, function (m) { return "WHAT MAKES YOU" + m.v['D$'] + " JUST NOW?"; }));
  T(jwb(4050, function (m) { return "CAN YOU EXPLAIN WHY YOU ARE SUDDENLY" + m.v['D$'] + "?"; }));
  T(putar(4060, 'Y0', 5));
  T(pilih(4070, 'Y0', [4080, 4090, 4100, 4110]));
  T(jwb(4080, function (m) { return "IS IT BECAUSE YOU ARE" + m.v['D$'] + " THAT YOU CAME TO ME?"; }));
  T(jwb(4090, function (m) { return "HOW LONG HAVE YOU BEEN" + m.v['D$'] + "?"; }));
  T(jwb(4100, function (m) { return "DO YOU BELIEVE IT NORMAL TO BE" + m.v['D$'] + "?"; }));
  T(jwb(4110, function (m) { return "DO YOU ENJOY BEING" + m.v['D$'] + "?"; }));
  T(putar(4120, 'Y1', 4));
  T(pilih(4130, 'Y1', [4140, 4150, 4160]));
  T(jwb(4140, function (m) { return "DO YOU REALLY THINK SO?"; }));
  T(jwb(4150, function (m) { return "BUT YOU ARE NOT SURE YOU" + m.v['D$'] + "?"; }));
  T(jwb(4160, function (m) { return "DO YOU REALLY DOUBT YOU" + m.v['D$'] + "?"; }));
  T(putar(4170, 'Y2', 5));
  T(pilih(4180, 'Y2', [4190, 4200, 4210, 4220]));
  T(jwb(4190, function (m) { return "HOW DO YOU KNOW YOU CAN'T" + m.v['D$'] + "?"; }));
  T(jwb(4200, function (m) { return "HAVE YOU TRIED?"; }));
  T(jwb(4210, function (m) { return "PERHAPS YOU COULD" + m.v['D$'] + " NOW?"; }));
  T(jwb(4220, function (m) { return "DO YOU REALLY WANT TO BE ABLE TO" + m.v['D$'] + "?"; }));
  T(putar(4230, 'Y3', 5));
  T(pilih(4240, 'Y3', [4250, 4260, 4270, 4280]));
  T(jwb(4250, function (m) { return "DON'T YOU REALLY" + m.v['D$'] + "?"; }));
  T(jwb(4260, function (m) { return "WHY DON'T YOU" + m.v['D$'] + "?"; }));
  T(jwb(4270, function (m) { return "DO YOU WISH TO BE ABLE TO" + m.v['D$'] + "?"; }));
  T(jwb(4280, function (m) { return "DOES THAT TROUBLE YOU?"; }));
  T(putar(4290, 'Y4', 5));
  T(pilih(4300, 'Y4', [4310, 4320, 4330, 4340]));
  T(jwb(4310, function (m) { return "TELL ME MORE ABOUT SUCH FEELINGS."; }));
  T(jwb(4320, function (m) { return "DO YOU OFTEN FEEL" + m.v['D$'] + "?"; }));
  T(jwb(4330, function (m) { return "DO YOU ENJOY FEELING" + m.v['D$'] + "?"; }));
  T(jwb(4340, function (m) { return "OF WHAT DOES FEELING" + m.v['D$'] + " REMIND YOU?"; }));
  T(putar(4350, 'Y5', 5));
  T(pilih(4360, 'Y5', [4370, 4380, 4390, 4400]));
  T(jwb(4370, function (m) { return "PERHAPS IN YOUR FANTASY WE" + m.v['D$'] + " EACH OTHER."; }));
  T(jwb(4380, function (m) { return "DO YOU WISH TO" + m.v['D$'] + " ME?"; }));
  T(jwb(4390, function (m) { return "YOU SEEM TO NEED TO" + m.v['D$'] + " ME."; }));
  T(jwb(4400, function (m) { return "DO YOU" + m.v['D$'] + " ANYONE ELSE?"; }));
  T(putar(4410, 'Y9', 4));
  T(pilih(4420, 'Y9', [4430, 4440, 4450]));
  T(jwb(4430, function (m) { return "MY, MY, SUCH LANGUAGE!"; }));
  T(jwb(4440, function (m) { return "I'M NOT ACCUSTOMED TO HEARING THAT KIND OF LANGUAGE!"; }));
  T(jwb(4450, function (m) { return "I THOUGHT I ALREADY TALKED TO YOU ABOUT YOUR LANGUAGE!"; }));
  T(putar(4470, 'Y8', 5));
  T(pilih(4480, 'Y8', [4490, 4500, 4510, 4520]));
  T(jwb(4490, function (m) { return "DOES THAT HAVE ANYTHING TO DO WITH THE FACT THAT YOUR" + m.v['D$'] + "?"; }));
  T(jwb(4500, function (m) { return "EARLIER YOU SAID YOUR" + m.v['D$'] + "."; }));
  T(jwb(4510, function (m) { return "BUT YOUR" + m.v['D$'] + "."; }));
  T(jwb(4520, function (m) { return "LET'S DISCUSS FURTHER WHY YOUR" + m.v['D$'] + "."; }));
  T(putar(4530, 'Y6', 5));
  T(pilih(4540, 'Y6', [4550, 4560, 4570, 4580]));
  T(jwb(4550, function (m) { return "WHY DO YOU NEED TO TELL ME" + m.v['D$'] + "?"; }));
  T(jwb(4560, function (m) { return "CAN YOU ELABORATE ON THAT?"; }));
  T(jwb(4570, function (m) { return "DO YOU SAY" + m.v['D$'] + " FOR SOME SPECIAL REASON?"; }));
  T(jwb(4580, function (m) { return "THAT'S QUITE INTERESTING."; }));

  /* ===================== 4590-5120: cetak, simpan, menu ================= */
  T({ baris: 4590, bagian: [
      function (m) { m.gosub(5090); },
      function (m) { m.gosub(4530); }
    ] });
  /* 4600-4605 SEMUA BITA NOL DICABUT tepat sebelum jawabannya masuk ke
     penyangga percakapan. Sesudah baris ini, " YO\0U " kembali jadi " YOU ". */
  T({ baris: 4600, jalan: function (m) {
      m.v.ZZ = INSTR(m.v['B$'], m.chr(0));
    } });
  T({ baris: 4605, jalan: function (m) {
      if (m.v.ZZ) {
        m.v['B$'] = LEFT(m.v['B$'], m.v.ZZ - 1) + MID(m.v['B$'], m.v.ZZ + 1);
        m.lompat(4600);
      }
    } });
  T({ baris: 4608, jalan: function (m) {
      m.v['S$()'][m.v.X || 0] = m.v['B$'];
      m.v.X = (m.v.X || 0) + 1;
    } });
  /* 4610-4640 PEMENGGALAN BARIS: mulai dari kolom terakhir, mundur sampai
     ketemu spasi, cetak sampai sana, dan ulangi dengan sisanya. */
  T({ baris: 4610, jalan: function (m) {
      if (m.v['B$'].length < m.v.WD) {
        m.cetak(m.v['B$']); m.barisBaru(); m.v.A = 1; m.kembali();
      }
    } });
  T({ baris: 4620, jalan: function (m) { m.v.I = m.v.WD + 1; } });
  T({ baris: 4630, jalan: function (m) {
      m.v.I = m.v.I - 1;
      if (MID(m.v['B$'], m.v.I, 1) !== ' ') m.lompat(4630);
    } });
  T({ baris: 4640, jalan: function (m) {
      m.cetak(LEFT(m.v['B$'], m.v.I - 1)); m.barisBaru();
      m.v['B$'] = MID(m.v['B$'], m.v.I + 1);
      m.lompat(4610);
    } });
  /* 4650-4680 SALINAN PERSIS dari 4610-4640, hanya `PRINT` diganti
     `PRINT#1`. Empat baris yang sama ditulis dua kali karena BASIC tidak
     punya cara memberitahukan "cetak ke mana" sebagai parameter. */
  T({ baris: 4650, jalan: function (m) {
      if (m.v['B$'].length < m.v.WD) {
        m.tulisBerkas(m.v['B$']); m.kembali();
      }
    } });
  T({ baris: 4660, jalan: function (m) { m.v.I = m.v.WD + 1; } });
  T({ baris: 4670, jalan: function (m) {
      m.v.I = m.v.I - 1;
      if (MID(m.v['B$'], m.v.I, 1) !== ' ') m.lompat(4670);
    } });
  T({ baris: 4680, jalan: function (m) {
      m.tulisBerkas(LEFT(m.v['B$'], m.v.I - 1));
      m.v['B$'] = MID(m.v['B$'], m.v.I + 1);
      m.lompat(4650);
    } });
  T(putar(4690, 'Y7', 8));
  T(pilih(4700, 'Y7', [4710, 4720, 4730, 4740, 4750, 4760, 4770]));
  T(jwb(4710, function () { return 'I AM NOT SURE I UNDERSTAND YOU FULLY.'; }));
  T(jwb(4720, function () { return 'PLEASE GO ON.'; }));
  T(jwb(4730, function () { return 'WHAT DOES THAT SUGGEST TO YOU?'; }));
  /* 4740 DUA TEGURAN YANG HANYA BISA KELUAR SEKALI SEUMUR PERCAKAPAN.
     Kalau pemakainya belum pernah menyebut orang tua, ELIZA menegurnya —
     lalu menyetel `M=1` supaya tidak diulang. Begitu juga soal seks lewat
     `SX`. Dan kalau keduanya sudah terpakai, pencacahnya dimundurkan ke
     lima supaya slot ini dilewati selamanya. */
  T({ baris: 4740, jalan: function (m) {
      if (!m.v.M) {
        m.v['B$'] =
          'YOU SEEM TO HAVE AVOIDED SPEAKING OF YOUR PARENTS ALTOGETHER.';
        m.v.M = 1; m.kembali();
      } else if (!m.v.SX) {
        m.v['B$'] = "I NOTICE THAT YOU HAVEN'T DISCUSSED SEX AT ALL.";
        m.v.SX = 1; m.kembali();
      } else m.v.Y7 = 5;
    } });
  T(jwb(4750, function () {
      return 'DO YOU FEEL STRONGLY ABOUT DISCUSSING SUCH THINGS?';
    }));
  T(jwb(4760, function () { return 'HOW IMPORTANT IS THAT TO YOU?'; }));
  T(jwb(4770, function () { return 'WHY DO YOU SAY THAT?'; }));
  T({ baris: 4780, jalan: function (m) { m.cls(); } });
  T({ baris: 4790, jalan: function (m) {
      if ((m.v.X || 0) === 0) {
        m.tab(18); m.bunyi();
        m.cetak(">> THERE'S NO CONVERSATION IN MEMORY <<"); m.barisBaru();
      } else m.lompat(4810);
    } });
  T({ baris: 4800, jalan: function (m) {
      m.barisBaru(); m.cetak('PLEASE CONTINUE.'); m.barisBaru();
      m.barisBaru(); m.lompat(280);
    } });
  T({ baris: 4810, bagian: [
      function (m) { m.v['B$'] = '** PLEASE ENTER A NAME UNDER WHICH **'; },
      function (m) { m.gosub(4610); }
    ] });
  T({ baris: 4815, bagian: [
      function (m) { m.v['B$'] = '      TO SAVE THE CONVERSATION'; },
      function (m) { m.gosub(4610); }
    ] });
  T({ baris: 4820, bagian: [
      function (m) { m.tab(10); },
      function (m) { m.masukan('A$', ''); }
    ] });
  T({ baris: 4830, bagian: [
      function (m) {
        if (m.v['A$'] !== '') { m.lompat(4840); return; }
        m.cls(); m.v['B$'] = m.v['S$()'][m.v.X - 1];
      },
      function (m) { m.gosub(4610); },
      function (m) { m.barisBaru(); m.lompat(280); }
    ] });
  T({ baris: 4840, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= m.v['A$'].length; m.v.I++) {
        m.v.A = MID(m.v['A$'], m.v.I, 1).charCodeAt(0);
        if (m.v.A > 96) {
          m.v['A$'] = timpa(m.v['A$'], m.v.I, m.chr(m.v.A - 32));
        }
      }
    } });
  T({ baris: 4850, jalan: function () { } });
  T({ baris: 4860, jalan: function (m) { m.bukaTulis(m.v['A$']); } });
  T({ baris: 4870, bagian: [
      function (m) { m.untuk('Q', 0, m.v.X - 1, 1, 4880); },
      function (m) { m.v['B$'] = m.v['S$()'][m.v.Q]; },
      function (m) { m.gosub(4650); },
      function (m) { if (m.v.Q % 2 === 1) m.tulisBerkas(' '); }
    ] });
  T({ baris: 4880, bagian: [
      function (m) { m.lanjutkan('Q'); },
      function (m) { m.tutup(); }
    ] });
  T({ baris: 4890, jalan: function (m) {
      m.cls();
      m.cetak('THE CURRENT CONVERSATION HAS BEEN SAVED'); m.barisBaru();
      m.cetak("        UNDER THE NAME '" + m.v['A$'] + "'"); m.barisBaru();
      m.barisBaru(); m.barisBaru(); m.barisBaru();
    } });
  T({ baris: 4900, jalan: function (m) {
      m.tab(8); m.cetak('PLEASE MAKE A SELECTION'); m.barisBaru();
      m.tab(8); m.cetak('FROM THE FOLLOWING MENU:'); m.barisBaru();
      m.barisBaru();
    } });
  T({ baris: 4910, jalan: function (m) {
      m.tab(2); m.cetak('1)  START OVER - ERASE ALL VARIABLES');
      m.barisBaru(); m.barisBaru();
    } });
  T({ baris: 4920, jalan: function (m) {
      m.tab(2); m.cetak('2)  ERASE CURRENT CONVERSATION ONLY');
      m.barisBaru(); m.barisBaru();
    } });
  T({ baris: 4930, jalan: function (m) {
      if (m.v.X === 100) {
        m.barisBaru(); m.tab(6); m.cetak('Please enter 1 or 2:      ');
        m.lompat(4960);
      }
    } });
  T({ baris: 4940, jalan: function (m) {
      m.tab(2); m.cetak('3)  CONTINUE WHERE YOU LEFT OFF');
      m.barisBaru(); m.barisBaru();
    } });
  T({ baris: 4950, jalan: function (m) {
      m.barisBaru(); m.tab(6); m.cetak('Please enter 1, 2, or 3:      ');
    } });
  T({ baris: 4960, jalan: function (m) {
      m.v['A$'] = m.inkey();
      if (m.v['A$'] === '') m.lompat(4960);
    } });
  T({ baris: 4970, jalan: function (m) {
      var a = m.v['A$'];
      if (a !== '1' && a !== '2' && a !== '3') m.lompat(4960);
    } });
  T({ baris: 4980, jalan: function (m) {
      m.v.A = parseInt(m.v['A$'], 10) || 0;
      var ke = [4990, 5000, 5010][m.v.A - 1];
      if (ke) m.lompat(ke);
    } });
  T({ baris: 4990, jalan: function (m) { m.cls(); m.jalankan('ELIZA'); } });
  T({ baris: 5000, jalan: function (m) {
      m.v['A$'] = 'CLEAR'; m.lompat(340);
    } });
  T({ baris: 5010, jalan: function (m) {
      if (m.v.X === 100) m.lompat(4960);
      else { m.cls(); m.v['A$'] = ''; m.lompat(4830); }
    } });
  T({ baris: 5020, jalan: function (m) {
      m.bunyi(); m.barisBaru();
      m.cetak('>> THE CONVERSATION BUFFER <<'); m.barisBaru();
      m.cetak('    IS COMPLETELY FILLED'); m.barisBaru();
    } });
  T({ baris: 5030, jalan: function (m) {
      m.barisBaru(); m.tab(8);
      m.cetak('DO YOU WANT TO SAVE THIS CONVERSATION?'); m.barisBaru();
    } });
  T({ baris: 5040, jalan: function (m) {
      m.barisBaru();
      m.cetak("Please enter 'Y' for 'YES'"); m.barisBaru();
      m.cetak("             'N' for 'NO'"); m.barisBaru();
      m.cetak("          or 'D' for 'DISPLAY'");
    } });
  T({ baris: 5050, jalan: function (m) {
      m.v['A$'] = m.inkey();
      if (m.v['A$'] === 'Y' || m.v['A$'] === 'y') m.lompat(4780);
    } });
  T({ baris: 5060, jalan: function (m) {
      if (m.v['A$'] === 'N' || m.v['A$'] === 'n') { m.cls(); m.lompat(4900); }
    } });
  T({ baris: 5070, jalan: function (m) {
      if (m.v['A$'] === 'D' || m.v['A$'] === 'd') {
        m.v['A$'] = 'DISPLAY'; m.cls(); m.lompat(290);
      }
    } });
  T({ baris: 5080, jalan: function (m) { m.lompat(5050); } });
  T({ baris: 5090, jalan: function (m) { m.v.I = 0; } });
  T({ baris: 5100, jalan: function (m) {
      m.v.I = m.v.I + 1;
      if (MID(m.v['A$'], m.v.I, 1) === ' ') m.lompat(5100);
    } });
  T({ baris: 5110, jalan: function (m) {
      m.v['D$'] = MID(m.v['A$'], m.v.I - 1, m.v['A$'].length - m.v.I + 1);
      m.kembali();
    } });
  T({ baris: 5120, jalan: function (m) { m.henti(); } });

  /* --- lima belas baris jawaban yang bentuknya tidak seragam ------------ */
  T(jwb(1640, function () {
      return 'WHAT DO YOU THINK MACHINES HAVE TO DO WITH YOUR PROBLEM?';
    }));
  T(jwb(1710, function () {
      return "I'VE TOLD YOU BEFORE, I DON'T CARE ABOUT NAMES - PLEASE CONTINUE.";
    }));
  T(jwb(2110, function () {
      return "DON'T YOU BELIEVE THAT DREAM HAS SOMETHING TO DO WITH YOUR PROBLEM?";
    }));
  T(jwb(3040, function (m) {
      return 'WHETHER OR NOT YOU CAN' + m.v['D$'] +
             ' DEPENDS ON YOU MORE THAN ON ME.';
    }));
  T(jwb(3930, function (m) {
      return 'WHAT DOES WANTING' + m.v['D$'] +
             ' HAVE TO DO WITH THIS DISCUSSION?';
    }));
  /* 1940 dan 1970: kalau tidak ada penggal kalimat yang bisa dikutip, ELIZA
     memakai kata "IT" — jawaban yang tetap masuk akal tanpa bahan apa pun. */
  T({ baris: 1940, jalan: function (m) {
      if (m.v.A === 0) m.v['D$'] = ' IT';
    } });
  T({ baris: 1970, jalan: function (m) {
      if (m.v.A === 0) m.v['D$'] = ' IT';
    } });
  /* 2050 dan 2120 menyetel `A=0` — "kata kunci ini menyerah, coba yang
     berikutnya". Slot jawaban yang justru menolak menjawab. */
  T({ baris: 2050, jalan: function (m) { m.v.A = 0; m.kembali(); } });
  T({ baris: 2120, jalan: function (m) { m.v.A = 0; m.kembali(); } });
  /* 2410, 2530, 2580, 3430: SLOT YANG MEMUNDURKAN PENCACAHNYA SENDIRI.
     Kalau bahan kalimatnya kosong, jawaban ini tidak bisa dipakai — jadi
     pencacahnya digeser ke slot lain, dan giliran berikutnya melewatinya. */
  T({ baris: 2410, jalan: function (m) {
      if (m.v.A === 0) { m.v.XA = 6; m.kembali(); return; }
      m.v['B$'] = 'WHAT DOES ' + m.chr(34) + m.v['D$'].slice(1) +
                  m.chr(34) + ' SUGGEST TO YOU?';
      m.kembali();
    } });
  T({ baris: 2530, jalan: function (m) {
      if (m.v.A === 0) { m.v.XC = 3; m.lompat(2540); return; }
      m.v['B$'] = 'WHO ELSE IN YOUR FAMILY' + m.v['D$'] + '?';
      m.kembali();
    } });
  T({ baris: 2580, jalan: function (m) {
      if (m.v.A === 0) { m.v.XD = 2; m.lompat(2590); return; }
      m.v['B$'] = 'YOUR' + m.v['D$'] + " - THAT'S INTERESTING.";
      m.kembali();
    } });
  T({ baris: 3430, jalan: function (m) {
      if (m.v.A === 0) { m.v.XQ = 3; m.lompat(3440); return; }
      m.v['B$'] = 'OH, I' + m.v['D$'] + '?';
      m.kembali();
    } });
  /* 2880 satu-satunya kelompok yang cuma punya DUA jawaban, dan ia
     membaliknya dengan bendera nol-satu, bukan pencacah berputar. */
  T({ baris: 2880, jalan: function (m) {
      if (!m.v.XI) {
        m.v.XI = 1;
        m.v['B$'] = 'WHY DO YOU SAY ' + m.chr(34) + 'AM' + m.chr(34) + '?';
      } else {
        m.v.XI = 0;
        m.v['B$'] = "I DON'T UNDERSTAND THAT.";
      }
    } });
  /* 4460 MENGGALI INGATAN: ambil yang paling lama dari tumpukan, geser
     sisanya ke depan, lalu susun jawaban dari situ. */
  T({ baris: 4460, bagian: [
      function (m) {
        m.v['D$'] = m.v['M$()'][1];
        for (m.v.I = 1; m.v.I <= m.v.S - 1; m.v.I++) {
          m.v['M$()'][m.v.I] = m.v['M$()'][m.v.I + 1];
        }
        m.v.S = m.v.S - 1;
      },
      function (m) { m.gosub(4470); },
      function (m) { m.gosub(4600); },
      function (m) { m.lompat(640); }
    ] });

  function panggil(n, ke) {
    return { baris: n, bagian: [
      function (m) { m.gosub(ke); },
      function (m) { m.lompat(4600); }
    ] };
  }

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['ELIZA'] = {
    nama: 'ELIZA',
    judul: 'Eliza 3.0 (Steve Grumette, 1981) — dari Weizenbaum, 1966',
    sumber: 'ELIZA',
    berkas: 'run/ELIZA.BAS',
    tabel: tabel,
    data: [83, 72, 73, 84, 70, 85, 67, 75],
    disketAwal: { 'STRINGS.FIL': STRINGS },
    benih: 97,

    arsitektur: {
      judul: 'Alur ELIZA.BAS',
      simpul: [
        { id: 'muat', baris: '150-240', jenis: 'mulai',
          teks: ['Baca STRINGS.FIL:', '22 aturan, 27 frasa, 44 kata kunci'] },
        { id: 'nol', baris: '180-230',
          teks: ['Sisipkan BITA NOL ke', 'kata pengganti dan kata kunci'] },
        { id: 'baca', baris: '280-410',
          teks: ['LINE INPUT, huruf jadi besar,', 'diapit spasi'] },
        { id: 'tukar', baris: '420-480',
          teks: ['I<->YOU, MY<->YOUR;', 'bintang jadi Y di ujung'] },
        { id: 'potong', baris: '500-540',
          teks: ['Potong di tiap titik;', 'tiap penggal diperiksa sendiri'] },
        { id: 'cari', baris: '560-620', jenis: 'putusan',
          teks: ['44 kata kunci; 1-20 langsung,', '21+ yang paling kiri menang'] },
        { id: 'jawab', baris: '1600-4580', jenis: 'subrutin',
          teks: ['46 kelompok jawaban,', 'masing-masing BERGILIR'] },
        { id: 'ingat', baris: '890-900, 4460',
          teks: ['Simpan penggal tentang keluarga;', 'gali lagi sesudah 5 giliran sepi'] },
        { id: 'cetak', baris: '4600-4640', jenis: 'keluar',
          teks: ['Cabut semua bita nol,', 'lalu penggal per lebar layar'] }
      ],
      panah: [
        { dari: 'muat', ke: 'nol' },
        { dari: 'nol', ke: 'baca' },
        { dari: 'baca', ke: 'tukar' },
        { dari: 'tukar', ke: 'potong' },
        { dari: 'potong', ke: 'cari' },
        { dari: 'cari', ke: 'jawab', label: 'ketemu' },
        { dari: 'cari', ke: 'ingat', label: 'tak ada yang cocok' },
        { dari: 'jawab', ke: 'ingat', label: 'kata keluarga' },
        { dari: 'jawab', ke: 'cetak' },
        { dari: 'ingat', ke: 'cetak' },
        { dari: 'cetak', ke: 'baca', label: 'giliran berikutnya' }
      ]
    },

    pseudokode: [
      { baris: 160, tingkat: 0, teks: 'seluruh kosakatanya dibaca dari <b>berkas terpisah</b>, bukan dari program' },
      { baris: 180, tingkat: 0, teks: 'kata pengganti disisipi <b>bita nol</b>: <code>" YO"+CHR$(0)+"U "</code>' },
      { baris: 440, tingkat: 1, teks: '&hellip;jadi aturan berikutnya <b>tidak mengenalinya</b> dan tidak membalikkannya' },
      { baris: 4600, tingkat: 1, teks: '&hellip;dan semua nol dicabut <b>tepat sebelum dicetak</b>' },
      { baris: 480, tingkat: 0, teks: 'penanda kedua: <code>*</code> di berkas data, jadi <code>Y</code> sesudah semua tukar selesai' },
      { baris: 570, tingkat: 0, teks: 'kata kunci 1&ndash;20 <b>langsung menang</b>; 21+ bersaing, yang paling kiri dipakai' },
      { baris: 630, tingkat: 0, teks: '<code>A</code> membawa <b>tiga arti</b>: 0 = coba kunci lain, &minus;1 = menyerah, lain = sudah dijawab' },
      { baris: 1600, tingkat: 0, teks: 'jawaban <b>bergilir</b>, bukan diundi &mdash; 46 pencacah, nol <code>RND</code>' },
      { baris: 1500, tingkat: 0, teks: 'lima giliran tanpa kata kunci &rarr; gali kembali sesuatu dari ingatannya' },
      { baris: 4740, tingkat: 0, teks: 'dua teguran yang <b>hanya bisa keluar sekali</b> seumur percakapan' }
    ],

    perintahAsli: 'run\\ELIZA.bat',
    catatanAsli: 'Ketik kalimat biasa lalu Enter. Perintah khusus: DISPLAY ' +
      'menampilkan ulang percakapan, SAVE menyimpannya, CLEAR mengosongkan, ' +
      'RESTART mengulang dari awal. Berkas STRINGS.FIL harus ada di ' +
      'direktori yang sama.',

    penyimpangan: [
      '<b><code>STRINGS.FIL</code> dimuat sebagai disket dalam memori</b> ' +
      '&mdash; 159 nilai, persis isi berkas aslinya sepanjang 1.274 bita. ' +
      'Baris 160-230 benar-benar membacanya lewat <code>OPEN</code> dan ' +
      '<code>INPUT#</code>, jadi alurnya utuh.',

      '<b>Lebar layar dipatok 80.</b> Baris 30-55 membacanya dari BIOS di ' +
      'alamat 0040:004A, yang menyimpan jumlah kolom layar sekarang. Konsol ' +
      'penelusur selalu 80 kolom.',

      '<b>Menyimpan percakapan menulis ke disket dalam memori</b>, bukan ke ' +
      'cakram sungguhan. Isinya tetap bisa dibaca kembali di sesi yang sama.',

      '<b><code>RUN</code> (baris 330 dan 4990) memuat ulang program yang ' +
      'sama</b>, sesuai artinya di BASIC.'
    ],

    pelajaran: {
      ringkas: 'ELIZA dengan kosakatanya di berkas terpisah &mdash; dan ' +
        'sebuah bita nol yang disisipkan ke tengah kata supaya aturan ' +
        'berikutnya tidak membalikkan pekerjaan aturan sebelumnya.',
      pelajari: [
        ['Bita nol sebagai penanda "sudah diubah"',
         'Baris 420-450 menjalankan dua puluh dua aturan penukaran ' +
         'berturut-turut. Aturan ke-12 mengubah " I " jadi " YOU ". Aturan ' +
         'ke-13 mengubah " YOU " jadi " I ". Kalau yang pertama menulis ' +
         '"YOU" apa adanya, yang kedua akan menemukannya dan ' +
         '<b>membalikkannya kembali</b> dalam putaran yang sama.',
         'Jawabannya di baris 180: penggantinya ditulis ' +
         '<code>" YO"+CHR$(0)+"U "</code>. Bita nol di tengah kata membuatnya ' +
         'tidak pernah cocok dengan pola <code>" YOU "</code>. Dan baris ' +
         '4600-4605 mencabut semua nol tepat sebelum jawabannya dicetak.',
         'Yang membuat trik ini rapi: <b>penandanya tidak terlihat</b>. Ia ' +
         'tidak menambah panjang yang terasa, tidak muncul di layar, dan ' +
         'tidak bisa diketik pemakainya. Sebuah keadaan yang dibawa di dalam ' +
         'datanya sendiri, bukan di variabel terpisah.'],
        ['Penanda kedua, untuk masalah yang sama',
         'Berkas datanya menulis <code>" MY "," *OUR "</code>. Bintangnya ' +
         'mencegah aturan " YOUR " mengenalinya, dan baris 480 mengubah tiap ' +
         'bintang jadi huruf Y sesudah seluruh penukaran selesai.',
         'Kenapa dua cara? Karena bintang hanya bisa menggantikan aksara ' +
         '<b>pertama</b>, dan kebetulan huruf itu Y untuk YOUR, YOU\'RE, dan ' +
         'YOURSELF. Untuk " ARE " dan " YOU " &mdash; yang harus disamarkan ' +
         'di <b>tengah</b> &mdash; bintang tidak bisa dipakai, dan nol bisa.'],
        ['Kosakata yang bisa diganti tanpa menyentuh program',
         'Dua puluh dua aturan penukaran, 27 penggal frasa, dan 44 kata kunci ' +
         '&mdash; semuanya di <code>STRINGS.FIL</code>, 1.274 bita. Program ' +
         'BASIC-nya tidak memuat satu pun kata Inggris yang bisa dikenali ' +
         'sebagai kosakata.',
         'Itu berarti seseorang bisa menerjemahkan seluruh ELIZA ke bahasa ' +
         'lain dengan menyunting satu berkas teks. Pemisahan program dan ' +
         'datanya, 1981, di sebuah disket.'],
        ['Dua tingkat prioritas kata kunci',
         'Baris 570: <code>IF Z&lt;21 THEN 620</code> &mdash; kata kunci nomor ' +
         '1 sampai 20 <b>langsung dipakai</b> begitu ketemu. Itu kata yang ' +
         'kuat: COMPUTER, DREAM, MOTHER, SORRY.',
         'Nomor 21 ke atas cuma dicatat, dan yang <b>posisinya paling kiri</b> ' +
         'di kalimat yang menang (baris 580). Itu kata yang lemah: WHY, WHAT, ' +
         'MAYBE, NO.',
         'Prioritasnya tidak ditulis di mana pun sebagai angka. Ia ' +
         '<b>urutan baris di berkas data</b>, dan satu perbandingan.'],
        ['Jawaban yang bergilir, bukan diundi',
         'Tidak ada satu <code>RND</code> pun di seluruh berkas ini. Tiap ' +
         'kelompok jawaban punya pencacahnya sendiri: <code>X0=X0+1:IF X0=7 ' +
         'THEN X0=1</code>. Empat puluh enam pencacah, masing-masing berputar ' +
         'di panjangnya sendiri.',
         'Akibatnya ELIZA <b>tidak pernah mengulang jawaban yang sama dua ' +
         'kali berturut-turut</b> untuk kata kunci yang sama &mdash; sesuatu ' +
         'yang tidak bisa dijamin oleh undian. Ia juga bisa diulang persis: ' +
         'percakapan yang sama menghasilkan jawaban yang sama.'],
        ['Ingatan yang digali saat percakapan buntu',
         'Tiap kali pemakainya menyebut anggota keluarga, baris 900 menyimpan ' +
         'penggal kalimatnya di <code>M$(S)</code>. Kalau lima giliran ' +
         'berturut-turut lewat tanpa satu kata kunci pun cocok (baris 1500), ' +
         'ELIZA menarik yang paling lama dari tumpukan itu: <i>"EARLIER YOU ' +
         'SAID YOUR&hellip;"</i>.',
         'Itu mekanisme MEMORY milik Weizenbaum yang asli, dan ia yang ' +
         'membuat percakapannya terasa punya benang.'],
        ['Satu variabel dengan tiga arti',
         'Sesudah tiap penangan kata kunci, baris 630 memeriksa <code>A</code>: ' +
         'nol berarti "coba kata kunci berikutnya"; minus satu berarti ' +
         '"menyerah, coba kalimat berikutnya"; nilai lain berarti "jawaban ' +
         'sudah dicetak". Nilai kembalian bertiga arah, tanpa satu pun cara ' +
         'resmi mengembalikan nilai dari sebuah <code>GOSUB</code>.']
      ],
      hindari: [
        ['Slot jawaban kosong yang harus diperiksa dari luar',
         'Beberapa daftar jawaban punya sasaran yang isinya cuma ' +
         '<code>RETURN</code> &mdash; misalnya baris 1960, 2040, 2420, 2740. ' +
         'Slot itu tidak menyusun <code>B$</code> sama sekali.',
         'Kalau pemanggilnya langsung mencetak, yang keluar adalah jawaban ' +
         '<b>sebelumnya</b>, terulang. Jadi tiap pemanggil harus memeriksa ' +
         'pencacahnya sendiri: <code>IF X4=4 THEN 1100</code>, ' +
         '<code>IF XA=6 THEN 1100</code>, <code>IF XF=5 THEN 1100</code>&hellip; ' +
         'sembilan kali di berkas ini, masing-masing dengan angka yang ' +
         'berbeda.',
         'Sebuah nilai penanda yang <b>tidak bisa dilihat dari tempat ia ' +
         'dipakai</b>. Menambah satu jawaban ke daftar mana pun akan menggeser ' +
         'nomornya, dan pemeriksa di luar sana tidak ikut berubah.'],
        ['Empat baris yang ditulis dua kali',
         'Baris 4610-4640 memenggal baris untuk layar. Baris 4650-4680 ' +
         'melakukan hal yang <b>persis sama</b> untuk berkas &mdash; satu ' +
         'satunya bedanya <code>PRINT</code> lawan <code>PRINT#1</code>.',
         'BASIC tidak punya cara menjadikan "cetak ke mana" sebagai parameter, ' +
         'jadi salinan itu memang tidak terhindarkan. Tapi ia tetap dua ' +
         'tempat yang harus diperbaiki bersamaan.'],
        ['Baris yang tidak bisa dicapai',
         'Baris <b>830</b> (<code>PRINT B$:RETURN</code>) tidak dituju satu ' +
         'lompatan pun, dan baris 820 di atasnya berakhir dengan ' +
         '<code>GOTO 4600</code>. Ia tidak akan pernah dijalankan.'],
        ['Kata kotor yang disembunyikan sebagai angka',
         'Baris 1510: <code>DATA 83,72,73,84,70,85,67,75</code>. Delapan ' +
         'bilangan yang dirakit jadi dua kata di baris 250-260, lalu dipakai ' +
         'baris 460 untuk menegur pemakainya.',
         'Ditulis begitu supaya kata-katanya <b>tidak terbaca</b> oleh siapa ' +
         'pun yang mencetak daftar programnya &mdash; termasuk oleh anak-anak ' +
         'yang memakai disket ini di sekolah. Penyamaran yang sopan, dan ' +
         'sekaligus penyamaran yang membuat siapa pun yang ingin menambah ' +
         'kata ketiga harus menghitung kode ASCII dengan tangan.'],
        ['Bendera yang dinyalakan dan tidak pernah dimatikan',
         '<code>T=1</code> di baris 140 menyalakan pengubahan huruf kecil jadi ' +
         'besar di baris 380. Tidak ada satu baris pun di seluruh berkas yang ' +
         'menyetelnya kembali ke nol &mdash; jadi cabang <code>IF T=0</code> ' +
         'itu tidak pernah diambil. Kemungkinan besar sisa dari versi yang ' +
         'bisa dimatikan.']
      ]
    },

    penjelasan: [
      { judul: 'Bita yang tidak bisa diketik siapa pun',
        isi: [
          'Bagian tersulit dari ELIZA bukan menjawab. Bagian tersulitnya ' +
          'adalah <b>membalik kata ganti</b>.',
          'Kalau pemakainya menulis <i>"I think you hate me"</i>, ELIZA harus ' +
          'menjawabnya sebagai <i>"you think I hate you"</i> &mdash; artinya ' +
          '"I" jadi "you", "you" jadi "I", dan "me" jadi "you". Tiga ' +
          'penukaran, dan dua di antaranya saling membalikkan.',
          'Program ini menjalankan aturannya satu per satu, dua puluh dua ' +
          'kali, dari atas ke bawah:',
          '<code>420 FOR I=1 TO 22</code><br>' +
          '<code>440 A=INSTR(B,A$,OW$(I)):IF A&lt;&gt;0 THEN A$=LEFT$(A$,A-1)+RW$(I)+&hellip;</code>',
          'Aturan ke-12 mengubah " I " jadi " YOU ". Aturan ke-13 mengubah ' +
          '" YOU " jadi " I ". Kalau yang pertama menulis "YOU" apa adanya, ' +
          'yang kedua akan menemukannya sepuluh mikrodetik kemudian dan ' +
          'mengubahnya kembali jadi "I".',
          'Jawaban yang biasa: tandai bagian yang sudah diubah, di larik lain, ' +
          'dengan posisi awal dan akhirnya. Itu berarti larik tambahan, ' +
          'perhitungan pergeseran tiap kali panjang string berubah, dan kode ' +
          'yang panjangnya berlipat.',
          'Yang dilakukan berkas ini, di baris 180:',
          '<code>RW$(12)=" YO"+CHR$(0)+"U "</code>',
          'Sebuah <b>bita nol di tengah kata</b>. " YO&#x2400;U " tidak cocok ' +
          'dengan pola " YOU ", jadi aturan ke-13 melewatinya. Dan tepat ' +
          'sebelum jawabannya dicetak, baris 4600-4605 mencabut semua nol:',
          '<code>4600 ZZ=INSTR(B$,CHR$(0))</code><br>' +
          '<code>4605 IF ZZ THEN B$=LEFT$(B$,ZZ-1)+MID$(B$,ZZ+1):GOTO 4600</code>',
          'Penandanya tidak menambah larik, tidak butuh perhitungan posisi, ' +
          'dan <b>ikut ke mana pun stringnya pergi</b> &mdash; disalin, ' +
          'dipotong, disambung. Ia bagian dari datanya, bukan catatan tentang ' +
          'datanya.',
          'Percobaan bandingnya bisa dijalankan di penelusur ini. Ketik ' +
          '<i>"I THINK YOU HATE ME"</i>:',
          '<b>Dengan</b> bita nol, isi <code>A$</code> sesudah baris 480 ' +
          'adalah <code>"  YO&#x2400;U THINK I HATE YOU "</code>, dan ' +
          'jawabannya <i>"WHY DO YOU THINK I HATE YOU?"</i>',
          '<b>Tanpa</b> bita nol &mdash; ganti saja isi ' +
          '<code>RW$(12)</code> jadi <code>" YOU "</code> biasa &mdash; ' +
          'hasilnya <code>"  I THINK I HATE YOU "</code>, dan jawabannya ' +
          '<i>"WHY DO YOU THINK I THINK I HATE YOU?"</i>',
          'Kata "I" pertama diubah jadi "YOU" oleh aturan ke-12, lalu ' +
          '<b>diubah kembali jadi "I"</b> oleh aturan ke-13 dalam putaran ' +
          'yang sama. Satu bita, dan seluruh kalimatnya selamat.',
          'Satu-satunya syaratnya: bita itu tidak boleh bisa diketik ' +
          'pemakainya, dan tidak boleh muncul di layar. Nol memenuhi keduanya.',
          'Dan konsekuensinya menjalar dengan rapi. Kata <b>kunci</b> di baris ' +
          '230 juga harus memakai bentuk bernol &mdash; karena yang dicari di ' +
          'baris 570 adalah teks yang <i>sudah</i> ditukar, dan teks itu penuh ' +
          'bita nol. Penulisnya menyadari itu, dan memperbaiki dua entri yang ' +
          'perlu.'
        ] },
      { judul: 'Empat puluh enam pencacah dan tidak satu pun undian',
        isi: [
          'ELIZA punya ratusan jawaban. Cara yang paling gampang memilihnya ' +
          'adalah <code>RND</code>.',
          'Berkas ini tidak memakai <code>RND</code> sama sekali. Tiap ' +
          'kelompok jawaban punya pencacahnya sendiri yang <b>berputar</b>:',
          '<code>1600 X0=X0+1:IF X0=7 THEN X0=1</code><br>' +
          '<code>1610 ON X0 GOTO 1620,1630,1640,1650,1660,1670</code>',
          'Enam jawaban tentang komputer, bergilir. Delapan tentang kemiripan. ' +
          'Sembilan tentang pertanyaan. Empat puluh enam kelompok, dengan ' +
          'panjang yang berbeda-beda, masing-masing dengan variabelnya sendiri ' +
          '&mdash; <code>X0</code> sampai <code>X9</code>, <code>XA</code> ' +
          'sampai <code>XZ</code>, lalu <code>Y0</code> sampai <code>Y9</code>.',
          'Kenapa bukan undian?',
          'Karena undian bisa mengulang. Menanyakan hal yang sama dua kali ' +
          'berturut-turut adalah cara tercepat menghancurkan ilusi bahwa ada ' +
          'seseorang di seberang sana. Bergilir <b>menjamin</b> itu tidak ' +
          'terjadi, dan jaminannya gratis &mdash; satu penambahan dan satu ' +
          'perbandingan.',
          'Ada harga yang dibayar, dan ia terlihat di baris seperti ini:',
          '<code>740 GOSUB 1900:IF X4=4 THEN 1100 ELSE 4600</code>',
          'Slot keempat di kelompok itu isinya <code>RETURN</code> telanjang ' +
          '&mdash; sebuah "lewati saya". Tapi pencacahnya di dalam subrutin, ' +
          'dan yang harus tahu artinya adalah pemanggilnya, di luar. Sembilan ' +
          'baris di berkas ini melakukan pemeriksaan semacam itu, masing ' +
          'masing dengan angka yang berbeda dan tanpa satu <code>REM</code> ' +
          'pun yang menyebutkan kenapa.',
          'Menambah satu jawaban ke daftar mana pun akan menggeser nomor slot ' +
          'kosongnya &mdash; dan pemeriksa di luar sana tidak akan ikut ' +
          'berubah. Itu jenis kaitan yang tidak bisa dilihat dari kedua ' +
          'ujungnya sekaligus.'
        ] }
    ]
  };
})(window);
