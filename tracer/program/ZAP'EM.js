/* ===========================================================================
   ZAP'EM.js — porting minimalis ZAP'EM.BAS sebagai tabel baris.

   Seratus tiga puluh tujuh baris, Februari 1982. Penembak sisi: pemain adalah
   sebuah panah kiri (CHR$(27)) di kolom 2, kapal Horde datang dari kanan, F1
   menembak, panah atas/bawah bergerak.

   DAN PETUNJUKNYA MENJELASKAN SEBUAH CACAT SEBAGAI FITUR.

       1280 "The Horde ships are unpredictable. Some are Ghost ships. These
             will take more than one hit or will vanish upon being hit
             without a score increment."

   Baris 1140 mengatakan penyebabnya:

       1140 ... A(Z)=0:B(LL)=0 ...

       `Z` adalah nomor kapal yang kena. `LL` adalah KOLOM tempat pelurunya
       bertemu. Jadi `A(Z)=0` mematikan kapal yang benar, tapi `B(LL)=0`
       mengosongkan slot kapal bernomor LL — kapal yang sama sekali lain,
       yang kebetulan bernomor sama dengan kolom itu.

   Kapal yang tak bersalah itu lenyap tanpa menambah skor. Persis seperti
   yang dijanjikan petunjuknya. Yang seharusnya ditulis `B(Z)=0`.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom. Lapangan
     aslinya 38 kolom, jadi di sini ia menempati separuh kiri layar.
   - `SOUND` dan `BEEP` diam.
   - Gelung tunda habis seketika.
   - `RANDOMIZE R` memasang benih tetap.
   - Berkas skor `METEOR.DAT` disimpan di disket dalam memori penelusur, dan
     diisi sepuluh baris awal supaya `OPEN ... FOR INPUT` di baris 1390 tidak
     langsung gagal. Di disket aslinya berkas itu memang sudah ada.
   =========================================================================== */

(function (global) {
  'use strict';

  var KAPAL = 27,        /* CHR$(27) = panah kiri di CP437 — pesawat pemain */
      HORDE = 254;       /* CHR$(254) = kotak kecil padat — kapal Horde     */

  function basic(n) {
    if (n === undefined || n === null) n = 0;
    return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
  }

  var tabel = [

    /* Nomor baris berkas ini mulai dari 230. Dua ratus dua puluh nomor
       pertama tidak pernah ditulis — ruang yang dipesan lalu dilupakan,
       sama seperti di SERPENT.BAS. */
    { baris: 230, jalan: function (m) { m.cls(); } },
    { baris: 240, jalan: function (m) {
        m.warna(15, 0); m.cls();
        m.locate(5, 19); m.cetak('IBM'); m.barisBaru();
      } },
    { baris: 250, jalan: function (m) {
        m.locate(7, 8, 0); m.cetak('General  utility  programs'); m.barisBaru();
      } },
    { baris: 260, jalan: function (m) {
        m.warna(9, 0); m.locate(10, 9, 0);
        m.cetak(m.chr(213) + m.ulang(21, 205) + m.chr(184)); m.barisBaru();
      } },
    { baris: 270, jalan: function (m) {
        m.locate(11, 9, 0);
        m.cetak(m.chr(179) + "       ZAP'EM        " + m.chr(179));
        m.barisBaru();
      } },
    { baris: 280, jalan: function (m) {
        m.locate(12, 9, 0);
        m.cetak(m.chr(179) + m.ulang(21, 32) + m.chr(179)); m.barisBaru();
      } },
    { baris: 290, jalan: function (m) {
        m.warna(9, 0); m.locate(13, 9, 0);
        m.cetak(m.chr(179) + '     Version  1B     ' + m.chr(179));
        m.barisBaru();
      } },
    { baris: 300, jalan: function (m) { m.bunyi(); } },
    { baris: 310, jalan: function (m) {
        m.locate(14, 9, 0);
        m.cetak(m.chr(212) + m.ulang(21, 205) + m.chr(190)); m.barisBaru();
      } },
    { baris: 320, jalan: function (m) {
        m.warna(15, 0); m.locate(17, 7, 0);
        m.cetak('FEBRUARY 03,1982   MAV-5-5-K '); m.barisBaru();
      } },
    { baris: 330, jalan: function (m) {
        m.warna(9, 0); m.locate(23, 6, 0);
        m.cetak('Press space bar to continue...'); m.barisBaru();
      } },
    { baris: 340, jalan: function (m) { if (m.inkey() !== '') m.lompat(340); } },
    { baris: 350, jalan: function (m) { m.v['CMD$'] = m.inkey(); } },
    { baris: 360, jalan: function (m) { if (m.v['CMD$'] === '') m.lompat(350); } },
    { baris: 370, jalan: function (m) {
        if (m.v['CMD$'] === m.chr(27)) m.lompat(390);
      } },
    { baris: 380, jalan: function (m) {
        if (m.v['CMD$'] !== ' ') m.lompat(350);
      } },
    { baris: 390, bagian: [
        function (m) { m.cls(); },
        function (m) { m.masukan('IN$', 'DO YOU WANT INSTRUCTIONS? '); }
      ] },
    { baris: 400, jalan: function (m) {
        var s = m.v['IN$'];
        if (s === 'Y' || s === 'YES' || s === 'y' || s === 'yes') m.gosub(1230);
      } },
    { baris: 410, jalan: function () { } },
    { baris: 420, jalan: function () { } },
    { baris: 430, jalan: function () { } },
    { baris: 440, jalan: function (m) { m.cls(); } },
    /* 450 `CLEAR ,,21000` membuang seluruh variabel dan menyetel ukuran
       tumpukan. Yang penting di sini bagian pertamanya: bermain lagi
       benar-benar mulai dari kosong. */
    { baris: 450, jalan: function (m) {
        var d = m.v;
        Object.keys(d).forEach(function (k) { delete d[k]; });
      } },
    /* 460 `R` adalah skor pemain di permainan SEBELUMNYA, dan baris 550
       memakainya sebagai benih acak. Pemain menentukan pola serangannya
       sendiri, tanpa tahu. */
    { baris: 460, bagian: [
        function (m) { m.masukan('NME$', 'AH....YOUR NAME PLEASE ? '); },
        function (m) { m.locate(15, 1); },
        function (m) {
          m.masukan(function (s) { m.v.R = parseFloat(s) || 0; },
                    'YOUR LAST SCORE ? ');
        }
      ] },
    { baris: 470, jalan: function (m) { m.dim('A()', 250); m.dim('B()', 250); } },
    { baris: 480, jalan: function (m) { m.v.FUEL = 150; } },
    { baris: 490, jalan: function (m) { m.v.SHIP = 3; } },
    { baris: 500, jalan: function (m) { m.v.V = 7; } },
    { baris: 510, jalan: function (m) { m.v.T1 = 6; } },
    { baris: 520, jalan: function (m) { m.v.X = 10; m.v.Y = 20; } },
    { baris: 530, jalan: function () { } },
    { baris: 540, jalan: function (m) { m.warna(7, 0); } },
    { baris: 550, jalan: function (m) { m.semaiCampur(m.v.R); } },
    { baris: 560, jalan: function (m) { m.cls(); } },
    { baris: 570, jalan: function (m) { m.warna(1, null); } },
    { baris: 580, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 23; m.v.I++) {
          m.locate(m.v.I, 1); m.cetak(m.chr(186)); m.barisBaru();
          m.locate(m.v.I, 38); m.cetak(m.chr(186)); m.barisBaru();
        }
      } },
    { baris: 590, jalan: function (m) {
        sudut(m, 1, 1, 201); sudut(m, 1, 38, 187);
        sudut(m, 23, 1, 200); sudut(m, 23, 38, 188);
      } },
    { baris: 600, jalan: function (m) {
        for (m.v.I = 2; m.v.I <= 37; m.v.I++) {
          m.locate(1, m.v.I); m.cetak(m.chr(205)); m.barisBaru();
          m.locate(23, m.v.I); m.cetak(m.chr(205)); m.barisBaru();
        }
      } },
    { baris: 610, jalan: function (m) {
        m.locate(4, 1); m.cetak(m.chr(204)); m.barisBaru();
        m.locate(4, 38); m.cetak(m.chr(185)); m.barisBaru();
        for (m.v.O = 2; m.v.O <= 37; m.v.O++) {
          m.locate(4, m.v.O); m.cetak(m.chr(205)); m.barisBaru();
        }
      } },

    /* 620-670 jebakan dipasang ULANG tiap bingkai — baris 960 kembali ke
       620. Tidak berbahaya, cuma enam pernyataan yang terbuang tiap putaran. */
    { baris: 620, jalan: function (m) { m.jebakan(14, true); } },
    { baris: 630, jalan: function (m) { m.pasangJebakan(14, 970); } },
    { baris: 640, jalan: function (m) { m.jebakan(11, true); } },
    { baris: 650, jalan: function (m) { m.pasangJebakan(11, 980); } },
    { baris: 660, jalan: function (m) { m.jebakan(1, true); } },
    { baris: 670, jalan: function (m) { m.pasangJebakan(1, 990); } },
    { baris: 680, jalan: function () { } },
    { baris: 690, jalan: function (m) {
        m.locate(2, 15); m.cetak(basic(m.v.SHIP)); m.barisBaru();
      } },
    /* 700 `FUEL=0` tidak pernah benar: bahan bakar berkurang 1,2 tiap
       bingkai, jadi ia melewati nol tanpa menyentuhnya. Yang benar-benar
       mengakhiri permainan karena bahan bakar adalah baris 890. */
    { baris: 700, jalan: function (m) {
        if (m.v.SHIP === 0 || m.v.FUEL === 0) {
          for (m.v.H1 = 1; m.v.H1 <= 13; m.v.H1++) {
            m.cetak('GAME OVER'); m.barisBaru();
          }
          m.lompat(1330);
        }
      } },
    { baris: 710, jalan: function (m) {
        m.locate(m.v.X, 2); m.cetak(m.chr(KAPAL));
      } },
    /* 720 `RND(2)` — di GW-BASIC argumen RND diabaikan selama positif.
       Penulisnya memakai 2, 3, dan 4 seolah masing-masing aliran acak yang
       berbeda; ketiganya aliran yang sama. Dan hasilnya bisa NOL, sementara
       gelung di baris 740 mulai dari 1 — slot 0 tak pernah terlihat. */
    { baris: 720, jalan: function (m) {
        m.v.RR = Math.trunc(m.acak() * 10);
      } },
    { baris: 730, jalan: function (m) {
        if (m.v['B()'][m.v.RR] === 0) {
          m.v['A()'][m.v.RR] = Math.trunc(m.acak() * 16) + 5;
          m.v['B()'][m.v.RR] = Math.trunc(m.acak() * 7) + 30;
        }
      } },

    /* --- 740-810: gerakkan tiap kapal Horde satu langkah ke kiri ---------- */
    { baris: 740, jalan: function (m) { m.untuk('F', 1, m.v.T1, 1, 820); } },
    { baris: 750, jalan: function (m) {
        if (m.v['A()'][m.v.F] === 0 || m.v['B()'][m.v.F] === 0) m.lompat(810);
      } },
    { baris: 760, jalan: function (m) {
        if (m.v['A()'][m.v.F] === m.v.X && m.v['B()'][m.v.F] === 2) {
          m.v.SHIP = m.v.SHIP - 1;
          m.locate(m.v.X, 2); m.cetak('OUCH');
          for (m.v.VV = 1; m.v.VV <= 300; m.v.VV++) { /* jeda */ }
          m.locate(m.v.X, 2); m.cetak('      ');
          m.locate(2, 15); m.cetak(basic(m.v.SHIP));
        }
      } },
    { baris: 770, jalan: function (m) {
        if (m.v['A()'][m.v.F] === 0) m.lompat(810);
      } },
    /* 780 kapal yang lolos sampai tepi kiri: skor DIKURANGI 150. */
    { baris: 780, jalan: function (m) {
        if (m.v['B()'][m.v.F] < 3) {
          m.locate(m.v['A()'][m.v.F], m.v['B()'][m.v.F]); m.cetak(' ');
          m.v['B()'][m.v.F] = 0; m.v['A()'][m.v.F] = 0;
          m.v.SCORE = (m.v.SCORE || 0) - 150;
          m.lompat(810);
        }
      } },
    { baris: 790, jalan: function (m) {
        m.locate(m.v['A()'][m.v.F], m.v['B()'][m.v.F]); m.cetak(' ');
        m.v['B()'][m.v.F] = m.v['B()'][m.v.F] - 1;
      } },
    { baris: 800, jalan: function (m) {
        m.warna(14, null);
        m.locate(m.v['A()'][m.v.F], m.v['B()'][m.v.F]); m.cetak(m.chr(HORDE));
        m.warna(7, null);
      } },
    { baris: 810, jalan: function (m) { m.lanjutkan('F'); } },
    /* 820 `M` TIDAK PERNAH DIBERI NILAI di mana pun, jadi `Y` tetap 20 —
       dan `Y` sendiri tidak pernah dipakai lagi. Dua variabel mati dalam
       satu baris. */
    { baris: 820, jalan: function (m) { m.v.Y = m.v.Y + (m.v.M || 0); } },
    { baris: 830, jalan: function (m) {
        if (m.v.X > 21) { m.locate(22, 2); m.cetak('   '); m.v.X = 6; }
      } },
    { baris: 840, jalan: function (m) {
        if (m.v.X < 6) { m.locate(5, 2); m.cetak('   '); m.v.X = 21; }
      } },
    { baris: 850, jalan: function (m) { m.v.FUEL = m.v.FUEL - 1.2; } },
    /* 860 bahan bakar di bawah 50: warna pemain berubah jadi 31 — yaitu 15
       ditambah bit KEDIP. Peringatan yang disampaikan lewat atribut layar. */
    { baris: 860, jalan: function (m) { if (m.v.FUEL < 50) m.v.V = 31; } },
    { baris: 870, jalan: function (m) {
        m.warna(7, null); m.locate(2, 24);
        m.cetak('SCORE: ' + basic(m.v.SCORE || 0));
      } },
    { baris: 880, jalan: function (m) { m.warna(m.v.V, null); } },
    { baris: 890, jalan: function (m) {
        if (m.v.FUEL < 1) {
          m.warna(7, null); m.locate(3, 3);
          for (m.v.U = 1; m.v.U <= 10; m.v.U++) {
            m.cetak('GAME OVER'); m.barisBaru();
          }
          m.lompat(1330);
        }
      } },
    { baris: 900, jalan: function (m) {
        m.v.RR = Math.trunc(m.acak() * m.v.T1);
      } },
    { baris: 910, jalan: function (m) {
        if (m.v['B()'][m.v.RR] === 0) {
          m.v['A()'][m.v.RR] = Math.trunc(m.acak() * 16) + 5;
          m.v['B()'][m.v.RR] = Math.trunc(m.acak() * 7) + 30;
          if (m.v['A()'][m.v.RR] < 6) m.v['A()'][m.v.RR] = 7;
        }
      } },
    { baris: 920, jalan: function (m) {
        if (m.v['A()'][m.v.RR] === 0) {
          m.v['A()'][m.v.RR] = Math.trunc(m.acak() * 16) + 5;
          m.v['B()'][m.v.RR] = Math.trunc(m.acak() * 7) + 30;
          if (m.v['A()'][m.v.RR] < 6) m.v['A()'][m.v.RR] = 7;
        }
      } },
    { baris: 930, jalan: function (m) {
        m.locate(2, 3);
        m.cetak('FUEL: ' + basic(Math.trunc(m.v.FUEL)));
      } },
    { baris: 940, jalan: function (m) {
        m.locate(m.v.X, 2); m.cetak(m.chr(KAPAL));
      } },
    { baris: 950, jalan: function (m) { m.warna(7, null); } },
    { baris: 960, jalan: function (m) { m.lompat(620); } },

    /* --- 970-1040: gerak pemain ------------------------------------------- */
    { baris: 970, bagian: [
        function (m) { m.gosub(1010); },
        function (m) { m.v.X = m.v.X + 1; m.lompat(680); }
      ] },
    { baris: 980, bagian: [
        function (m) { m.gosub(1010); },
        function (m) { m.v.X = m.v.X - 1; m.lompat(680); }
      ] },
    { baris: 990, jalan: function (m) { m.gosub(1050); } },
    { baris: 1000, jalan: function (m) { m.lompat(620); } },
    { baris: 1010, jalan: function (m) { if (m.v.X > 22) m.v.X = 2; } },
    { baris: 1020, jalan: function (m) { if (m.v.X < 2) m.v.X = 22; } },
    { baris: 1030, jalan: function (m) {
        m.locate(m.v.X, 2); m.cetak(' '); m.barisBaru();
      } },
    { baris: 1040, jalan: function (m) { m.kembali(); } },

    /* --- 1050-1180: menembak ---------------------------------------------- */
    { baris: 1050, jalan: function (m) {
        m.locate(m.v.X, 2); m.cetak(m.chr(KAPAL));
      } },
    { baris: 1060, jalan: function (m) { m.warna(4, null); } },
    /* 1070-1090 cari kapal yang sebaris dengan pemain. Yang dicari cuma
       BARISNYA — jadi kalau ada dua kapal sebaris, yang ketemu selalu yang
       bernomor terkecil, bukan yang terdekat. */
    { baris: 1070, jalan: function (m) { m.untuk('Z', 1, m.v.T1, 1, 1100); } },
    { baris: 1080, jalan: function (m) {
        if (m.v.X === m.v['A()'][m.v.Z]) m.lompat(1120);
      } },
    { baris: 1090, jalan: function (m) { m.lanjutkan('Z'); } },
    /* 1100 tidak ada yang sebaris: peluru digambar lalu dihapus sampai kolom
       24, dan tidak terjadi apa-apa. */
    { baris: 1100, jalan: function (m) {
        for (m.v.CC = 3; m.v.CC <= 24; m.v.CC++) {
          m.locate(m.v.X, m.v.CC); m.cetak('-');
          m.locate(m.v.X, m.v.CC); m.cetak(' ');
        }
      } },
    { baris: 1110, jalan: function (m) { m.warna(7, null); m.lompat(620); } },
    { baris: 1120, jalan: function (m) { m.untuk('LL', 3, 24, 1, 1170); } },
    { baris: 1130, jalan: function (m) {
        m.locate(m.v.X, m.v.LL); m.cetak('-');
      } },
    /* 1140 KENA — DAN DI SINILAH CACATNYA. `A(Z)=0` mematikan kapal yang
       benar, tapi `B(LL)=0` mengosongkan slot bernomor LL, yaitu KOLOM
       tempat pertemuannya. Kapal bernomor LL lenyap tanpa menambah skor.
       Petunjuk di baris 1280 menyebutnya "Ghost ships". Seharusnya `B(Z)=0`. */
    { baris: 1140, bagian: [
        function (m) {
          if (m.v.LL !== m.v['B()'][m.v.Z]) { m.lompat(1150); return; }
          m.locate(m.v.X, m.v.LL); m.cetak('*');
        },
        function (m) { m.gosub(1190); },
        function (m) {
          m.locate(m.v.X, m.v.LL); m.cetak(' ');
          m.v['A()'][m.v.Z] = 0;
          m.v['B()'][m.v.LL] = 0;          /* <- seharusnya B(Z) */
          m.v.SCORE = (m.v.SCORE || 0) + 100;
          m.lompat(680);
        }
      ] },
    { baris: 1150, jalan: function (m) {
        m.locate(m.v.X, m.v.LL); m.cetak(' '); m.barisBaru();
      } },
    { baris: 1160, jalan: function (m) { m.lanjutkan('LL'); } },
    { baris: 1170, jalan: function (m) { m.warna(7, null); } },
    { baris: 1180, jalan: function (m) { m.lompat(620); } },
    /* 1190-1220 bunyi ledakan, dan tempat kembalinya ledakan itu menyelesaikan
       urusan kena: lihat catatan di baris 1140. */
    { baris: 1190, jalan: function (m) { m.untuk('OO', 300, 315, 1, 1220); } },
    { baris: 1200, jalan: function () { /* SOUND: diam */ } },
    { baris: 1210, jalan: function (m) { m.lanjutkan('OO'); } },
    { baris: 1220, jalan: function (m) { m.kembali(); } },

    /* --- 1230-1320: petunjuk ---------------------------------------------- */
    { baris: 1230, jalan: function (m) { m.cls(); } },
    /* 1240 "Press any key to start game" dicetak di baris 25 SEBELUM
       petunjuknya. Sepuluh baris kemudian ia sudah tergulung keluar layar. */
    { baris: 1240, jalan: function (m) {
        m.locate(25, 1); m.cetak('Press any key to start game...');
        m.barisBaru();
      } },
    { baris: 1250, jalan: function (m) {
        m.cetak('               Zap\'em'); m.barisBaru();
      } },
    petunjuk(1260, '  You are the reverse arrow (It is      supposed to be a fighter with rakish    inverse swept wings).'),
    petunjuk(1270, '  Your mission is to zap the invading   Horde ships in your path. The Horde is  a huge mass of drone ships that is try- ing to get past the imperial fleet and  into the rich homeworld systems.'),
    petunjuk(1280, '  The Horde ships are unpredictable.    Some are Ghost ships. These will take   more than one hit or will vanish upon   being hit without a score increment.'),
    petunjuk(1290, '  The controls are simple: up and down  cursor control arrow keys for up and    down movement. F1 to fire.'),
    petunjuk(1300, '  Good hunting'),
    { baris: 1310, jalan: function (m) {
        m.v['X$'] = m.inkey();
        if (m.v['X$'] === '') m.tunggu(); else m.kembali();
      } },
    /* 1320 tidak pernah tercapai: `INPUT$(1)` selalu memberi satu aksara. */
    { baris: 1320, jalan: function (m) { m.lompat(1310); } },

    /* --- 1330-1590: papan skor tertinggi ---------------------------------- */
    { baris: 1330, jalan: function () { } },
    { baris: 1340, jalan: function (m) { m.cls(); } },
    { baris: 1350, jalan: function (m) {
        m.locate(2, 2); m.cetak('HIGH SCORES....'); m.barisBaru();
      } },
    { baris: 1360, jalan: function (m) {
        m.locate(3, 1);
        m.cetak('_______________________________________'); m.barisBaru();
      } },
    { baris: 1370, jalan: function (m) { m.locate(5, 1); } },
    { baris: 1380, jalan: function (m) {
        m.dim('NME$()', 50); m.dim('SCORE()', 50);
      } },
    /* 1390 BERKASNYA BERNAMA METEOR.DAT — nama permainan yang lain. Sisa
       salin-tempel dari METEOR.BAS, yang juga ada di koleksi ini. */
    { baris: 1390, jalan: function (m) { m.bukaBaca('METEOR.DAT'); } },
    { baris: 1400, jalan: function (m) { m.untuk('I', 1, 10, 1, 1440); } },
    { baris: 1410, jalan: function (m) {
        m.v['NME$()'][m.v.I] = m.bacaBerkas();
        m.v['SCORE()'][m.v.I] = Number(m.bacaBerkas()) || 0;
      } },
    { baris: 1420, jalan: function (m) {
        m.cetak(m.v['NME$()'][m.v.I]); m.tab(15);
        m.cetak(basic(m.v['SCORE()'][m.v.I])); m.barisBaru();
      } },
    { baris: 1430, jalan: function (m) { m.lanjutkan('I'); } },
    /* 1440 skor pemain SELALU ditaruh di slot kesepuluh, menimpa apa pun
       yang ada di sana — bahkan kalau skornya lebih tinggi dari yang lain. */
    { baris: 1440, jalan: function (m) {
        m.v['NME$()'][10] = m.v['NME$'];
        m.v['SCORE()'][10] = m.v.SCORE || 0;
      } },
    { baris: 1450, jalan: function (m) { m.tutup(); } },
    { baris: 1460, jalan: function (m) {
        if (m.v['SCORE()'][10] < m.v['SCORE()'][9]) m.lompat(1520);
      } },
    /* 1470-1490 gelembung: satu sapuan, lalu diulang selama masih ada yang
       tertukar. Perhatikan gelungnya sampai I=10 dan menyentuh I+1 = 11 —
       satu slot di luar sepuluh yang dipakai. */
    { baris: 1470, jalan: function (m) { m.untuk('I', 1, 10, 1, 1500); } },
    { baris: 1480, jalan: function (m) {
        var S = m.v['SCORE()'], N = m.v['NME$()'], i = m.v.I;
        if ((S[i] || 0) < (S[i + 1] || 0)) {
          var t = S[i]; S[i] = S[i + 1]; S[i + 1] = t;
          var u = N[i]; N[i] = N[i + 1]; N[i + 1] = u;
          m.v.F = 1;
        }
      } },
    { baris: 1490, bagian: [
        function (m) { m.lanjutkan('I'); },
        function (m) { if (m.v.F === 1) { m.v.F = 0; m.lompat(1470); } }
      ] },
    { baris: 1500, jalan: function (m) { m.bukaTulis('METEOR.DAT'); } },
    { baris: 1510, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 10; m.v.I++) {
          m.tulisBerkas(m.v['NME$()'][m.v.I] || '', m.v['SCORE()'][m.v.I] || 0);
        }
        m.tutup();
      } },
    { baris: 1520, jalan: function (m) { m.locate(5, 1); } },
    /* 1530 yang ditampilkan cuma SEMBILAN. Slot kesepuluh selalu ada di
       berkas tapi tidak pernah terlihat. */
    { baris: 1530, jalan: function (m) { m.untuk('I', 1, 9, 1, 1560); } },
    { baris: 1540, jalan: function (m) {
        m.cetak(m.v['NME$()'][m.v.I] || ''); m.tab(15);
        m.cetak(basic(m.v['SCORE()'][m.v.I])); m.barisBaru();
      } },
    { baris: 1550, jalan: function (m) { m.lanjutkan('I'); } },
    { baris: 1560, jalan: function (m) {
        m.locate(17, 1);
        m.cetak('YOUR SCORE, ' + m.v['NME$'] + ', WAS' + basic(m.v.SCORE || 0));
        m.barisBaru();
      } },
    { baris: 1570, bagian: [
        function (m) { m.locate(22, 1); },
        function (m) { m.masukan('PLY$', 'PLAY AGAIN (Y OR N)? '); }
      ] },
    { baris: 1580, jalan: function (m) {
        if (m.v['PLY$'] === 'Y') m.lompat(420);
      } },
    { baris: 1590, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function sudut(m, b, k, kode) {
    m.locate(b, k); m.cetak(m.chr(kode)); m.barisBaru();
  }
  function petunjuk(nomor, isi) {
    return { baris: nomor, jalan: function (m) {
      m.barisBaru(); m.cetak(isi); m.barisBaru();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM["ZAP'EM"] = {
    nama: "ZAP'EM",
    judul: "Zap'em (dan cacat yang jadi fitur)",
    sumber: "ZAP'EM",
    berkas: "run/ZAP'EM.BAS",
    tabel: tabel,
    benih: 23,
    /* Papan skor yang sudah ada di disket aslinya, supaya `OPEN ... FOR
       INPUT` di baris 1390 tidak langsung gagal. */
    disketAwal: {
      'METEOR.DAT': [
        'ORDMAN', 4200, 'SCHLICH', 3800, 'MAV', 3100, 'STEVE', 2600,
        'PHIL', 2200, 'TOM', 1700, 'HOMER', 1300, 'ANA', 900,
        'BUDI', 500, 'SITI', 100
      ]
    },

    arsitektur: {
      judul: "Alur ZAP'EM.BAS",
      simpul: [
        { id: 'judul', baris: '230-400', jenis: 'mulai',
          teks: ['Layar judul IBM,', 'lalu tawaran petunjuk'] },
        { id: 'siap', baris: '440-610',
          teks: ['Nama, skor lalu (jadi benih),', 'gambar lapangan'] },
        { id: 'jebak', baris: '620-670',
          teks: ['Pasang jebakan panah', 'dan F1 - tiap bingkai'] },
        { id: 'horde', baris: '720-810',
          teks: ['Munculkan dan majukan', 'kapal Horde ke kiri'] },
        { id: 'bahan', baris: '850-930', jenis: 'putusan',
          teks: ['Bahan bakar -1,2;', 'di bawah 50 warna berkedip'] },
        { id: 'gerak', baris: '970-1040', jenis: 'subrutin',
          teks: ['Panah atas/bawah:', 'geser pemain'] },
        { id: 'tembak', baris: '1050-1220', jenis: 'subrutin',
          teks: ['F1: cari kapal sebaris,', 'peluru menyusuri kolom'] },
        { id: 'hantu', baris: '1140, 1220', jenis: 'galat',
          teks: ['B(LL)=0 - kapal LAIN', 'ikut lenyap tanpa skor'] },
        { id: 'skor', baris: '1330-1590', jenis: 'keluar',
          teks: ['Papan skor METEOR.DAT,', 'urut gelembung, main lagi?'] }
      ],
      panah: [
        { dari: 'judul', ke: 'siap' },
        { dari: 'siap', ke: 'jebak' },
        { dari: 'jebak', ke: 'horde' },
        { dari: 'horde', ke: 'bahan' },
        { dari: 'bahan', ke: 'jebak', label: 'bingkai berikutnya' },
        { dari: 'jebak', ke: 'gerak', label: 'panah ditekan' },
        { dari: 'gerak', ke: 'horde' },
        { dari: 'jebak', ke: 'tembak', label: 'F1 ditekan' },
        { dari: 'tembak', ke: 'hantu', label: 'kena', jenis: 'galat' },
        { dari: 'hantu', ke: 'horde' },
        { dari: 'bahan', ke: 'skor', label: 'bahan bakar / nyawa habis' },
        { dari: 'skor', ke: 'siap', label: 'main lagi' }
      ]
    },

    pseudokode: [
      { baris: 460, tingkat: 0, teks: 'tanya nama, dan <b>skor permainan sebelumnya</b>' },
      { baris: 550, tingkat: 1, teks: '&hellip;lalu <code>RANDOMIZE R</code> &mdash; pemain menyemai polanya sendiri' },
      { baris: 620, tingkat: 0, teks: '<b>ULANG:</b> pasang ulang jebakan panah dan F1 (tiap bingkai)' },
      { baris: 730, tingkat: 1, teks: 'slot kapal yang kosong diisi di kolom 30&ndash;36, baris acak' },
      { baris: 790, tingkat: 1, teks: 'tiap kapal maju satu kolom ke kiri' },
      { baris: 780, tingkat: 2, teks: 'sampai tepi kiri &rarr; skor <b>&minus;150</b>' },
      { baris: 760, tingkat: 2, teks: 'menabrak pemain &rarr; nyawa berkurang' },
      { baris: 850, tingkat: 1, teks: '<code>FUEL = FUEL &minus; 1.2</code>; di bawah 50 warna jadi <b>berkedip</b>' },
      { baris: 1070, tingkat: 0, teks: 'F1: cari kapal yang <b>sebaris</b> dengan pemain' },
      { baris: 1140, tingkat: 1, teks: 'kena &rarr; skor +100, <code>A(Z)=0</code>&hellip; dan <b><code>B(LL)=0</code></b>' },
      { baris: 1280, tingkat: 2, teks: '&hellip;yang petunjuknya sebut <i>"Ghost ships"</i>' }
    ],

    perintahAsli: "run\\ZAP'EM.bat",
    catatanAsli: 'Kemudikan dengan panah atas/bawah, F1 menembak. Isi "YOUR ' +
      'LAST SCORE" dengan angka yang sama untuk mendapat pola serangan yang ' +
      'sama persis.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol tetap 80 kolom. ' +
      'Lapangan aslinya 38 kolom, jadi di sini ia menempati separuh kiri ' +
      'layar.',

      '<b><code>SOUND</code> dan <code>BEEP</code> diam.</b>',

      '<b>Gelung tunda habis seketika</b>, jadi kapal Horde bergerak secepat ' +
      'penelusuran. Pakai penggeser laju di atas layar.',

      '<b><code>RANDOMIZE R</code> memasang benih tetap</b> di penelusur.',

      '<b>Berkas <code>METEOR.DAT</code> disimpan di disket dalam memori ' +
      'penelusur</b>, dan diisi sepuluh baris awal supaya <code>OPEN &hellip; ' +
      'FOR INPUT</code> di baris 1390 tidak langsung gagal. Di disket aslinya ' +
      'berkas itu memang sudah ada. Isinya bertahan melewati "main lagi", ' +
      'dan hilang begitu halaman disegarkan.',

      '<b>Warna 31 (baris 860) tidak berkedip.</b> Nilai 31 adalah 15 + bit ' +
      'kedip; peringatan bahan bakar rendah seharusnya berkedip.'
    ],

    pelajaran: {
      ringkas: 'Penembak sisi 1982 yang petunjuknya menjelaskan sebuah salah ' +
        'indeks sebagai fitur &mdash; "Ghost ships" &mdash; dan menyemai ' +
        'acaknya dari skor pemain sendiri.',
      pelajari: [
        ['Benih acak dari skor pemain',
         'Baris 460 menanyakan "YOUR LAST SCORE", dan baris 550 memakainya ' +
         'sebagai <code>RANDOMIZE R</code>. Artinya pola serangan sebuah ' +
         'permainan ditentukan oleh skor permainan sebelumnya &mdash; main ' +
         'bagus, dapat pola lain. Dan dua orang yang memasukkan angka yang ' +
         'sama mendapat lapangan yang sama persis. <b>Benih sebagai kata ' +
         'sandi lapangan</b>, dua puluh tahun sebelum <i>seed</i> Minecraft.'],
        ['Slot kapal, bukan daftar kapal',
         'Tidak ada daftar kapal yang tumbuh dan menyusut. Yang ada dua larik ' +
         'sepanjang enam, dan sebuah slot dianggap <b>kosong</b> kalau ' +
         '<code>A()</code> atau <code>B()</code>-nya nol. Memunculkan kapal ' +
         'baru = mencari slot kosong (baris 730, 910); menghancurkan kapal = ' +
         'menolkannya. Pola <i>object pool</i>, sebelum ada namanya.'],
        ['Peringatan lewat atribut layar',
         'Baris 860: <code>IF FUEL&lt;50 THEN V=31</code>. Nilai 31 adalah ' +
         '15 (putih terang) ditambah bit kedip. Jadi pesawat pemain mulai ' +
         '<b>berkedip</b> saat bahan bakar menipis &mdash; tanpa satu kata ' +
         'pun, tanpa memakan ruang layar.']
      ],
      hindari: [
        ['Salah indeks yang jadi bagian dari cerita',
         'Baris 1140 menulis <code>B(LL)=0</code>, padahal <code>LL</code> ' +
         'adalah <b>kolom</b> tempat peluru bertemu kapal, sementara nomor ' +
         'kapalnya <code>Z</code>. Akibatnya slot kapal bernomor sama dengan ' +
         'kolom itu ikut dikosongkan &mdash; kapal lain, yang tak bersalah, ' +
         'lenyap tanpa menambah skor. Dan petunjuk di baris 1280 ' +
         '<b>menjelaskannya sebagai fitur</b>: <i>"Some are Ghost ships. ' +
         'These will&hellip; vanish upon being hit without a score ' +
         'increment."</i> Seharusnya <code>B(Z)=0</code>.'],
        ['RND dengan argumen yang dikira berarti',
         'Baris 720&ndash;730 memakai <code>RND(2)</code>, <code>RND(3)</code>, ' +
         'dan <code>RND(4)</code>. Di GW-BASIC argumen <code>RND</code> ' +
         'diabaikan selama positif &mdash; ketiganya aliran acak yang sama ' +
         'persis. Penulisnya mengira sedang memakai tiga sumber berbeda.'],
        ['Empat slot yang tidak pernah terlihat',
         'Baris 720 memakai <code>INT(RND*10)</code> &mdash; slot <b>0 sampai ' +
         '9</b>. Baris 900 memakai <code>INT(RND*T1)</code> &mdash; slot 0 ' +
         'sampai 5. Tapi gelung penggeraknya di baris 740 cuma menjalani ' +
         '<b>1 sampai 6</b>. Kapal yang mendarat di slot 0, 7, 8, atau 9 tidak ' +
         'pernah bergerak, tidak pernah digambar, dan tidak pernah bisa ' +
         'ditembak &mdash; sekaligus <b>menutup slotnya selamanya</b>, karena ' +
         'baris 730 cuma mengisi slot yang <code>B()</code>-nya nol. Empat ' +
         'dari sepuluh slot bisa mati tanpa gejala apa pun.'],
        ['Dua variabel mati dalam satu baris',
         'Baris 820: <code>Y=Y+M</code>. <code>M</code> tidak pernah diberi ' +
         'nilai di mana pun, jadi <code>Y</code> tetap 20 &mdash; dan ' +
         '<code>Y</code> sendiri tidak pernah dibaca lagi.'],
        ['Syarat yang tidak pernah benar',
         'Baris 700 menguji <code>FUEL=0</code>. Bahan bakar berkurang ' +
         '<b>1,2</b> tiap bingkai, jadi ia melewati nol tanpa pernah ' +
         'menyentuhnya. Yang benar-benar mengakhiri permainan adalah baris ' +
         '890 (<code>FUEL&lt;1</code>).'],
        ['Berkas skor bernama permainan lain',
         'Baris 1390 membuka <code>METEOR.DAT</code>. METEOR.BAS ada di ' +
         'koleksi yang sama, dan tidak punya papan skor sama sekali. Jadi ' +
         'nama itu sisa salin-tempel &mdash; dan kalau suatu hari METEOR ' +
         'diberi papan skor, keduanya akan berebut berkas yang sama.'],
        ['Skor pemain selalu ditaruh di slot terakhir',
         'Baris 1440 <code>SCORE(10)=SCORE</code> menimpa apa pun yang ada di ' +
         'slot kesepuluh, lalu baris 1460 menolak menyimpan kalau skornya ' +
         'lebih kecil dari slot kesembilan. Dan baris 1530 cuma menampilkan ' +
         '<b>sembilan</b>. Slot kesepuluh ada di berkas, dipakai sebagai ' +
         'tempat singgah, dan tidak pernah terlihat.']
      ]
    },

    penjelasan: [
      { judul: 'Cacat yang naik pangkat jadi fitur',
        isi: [
          'Petunjuk di baris 1280 berbunyi:',
          '<i>"The Horde ships are unpredictable. Some are Ghost ships. These ' +
          'will take more than one hit or will vanish upon being hit without ' +
          'a score increment."</i>',
          'Kalimat itu terdengar seperti rancangan. Kapal hantu, sulit ' +
          'ditebak, sebagian tahan tembakan &mdash; menambah ketegangan.',
          'Baris 1140 mengatakan yang sebenarnya:',
          '<code>1140 IF LL=B(Z) THEN &hellip; A(Z)=0:B(LL)=0:SCORE=SCORE+100</code>',
          '<code>Z</code> adalah nomor kapal yang kena. <code>LL</code> adalah ' +
          '<b>kolom</b> tempat peluru bertemu kapal itu &mdash; angka antara 3 ' +
          'dan 24. Keduanya sama sekali tidak berhubungan.',
          '<code>A(Z)=0</code> benar: kapal yang kena dimatikan. Tapi ' +
          '<code>B(LL)=0</code> mengosongkan kolom milik kapal bernomor ' +
          '<code>LL</code>. Karena slot kapalnya cuma 1 sampai 6, tembakan ' +
          'yang kena di kolom 3, 4, 5, atau 6 akan <b>ikut menghapus kapal ' +
          'bernomor itu</b> &mdash; diam-diam, tanpa skor, tanpa ledakan.',
          'Itu persis "vanish upon being hit without a score increment".',
          'Yang tidak bisa dipastikan: apakah penulisnya tahu. Dua ' +
          'kemungkinan sama masuk akalnya &mdash; ia menemukan gejalanya, ' +
          'tidak menemukan sebabnya, dan menuliskannya sebagai cerita; atau ' +
          'ia memang merancangnya dan kebetulan menulis indeks yang salah.',
          'Yang bisa dipastikan: <b>sekali sebuah cacat masuk ke ' +
          'dokumentasi, ia berhenti jadi cacat.</b> Tidak ada lagi yang akan ' +
          'melaporkannya, karena perilakunya sudah tertulis. Dan tidak ada ' +
          'lagi yang akan memperbaikinya, karena memperbaikinya berarti ' +
          'melanggar dokumentasi.'
        ] },
      { judul: 'Benih yang diminta dari pemain',
        isi: [
          'Baris 460 menanyakan dua hal: nama, dan <b>skor permainan ' +
          'sebelumnya</b>. Yang kedua terdengar seperti basa-basi papan skor. ' +
          'Ternyata bukan:',
          '<code>550 RANDOMIZE R</code>',
          'Angka itu jadi benih pengacak. Seluruh pola serangan &mdash; di ' +
          'baris mana kapal muncul, dari kolom berapa, berapa cepat ' +
          'berikutnya datang &mdash; ditentukan olehnya.',
          'Akibatnya ada dua, dan keduanya menarik.',
          'Pertama: <b>main bagus berarti lapangan berikutnya berbeda</b>. ' +
          'Skor tinggi, benih tinggi, pola lain. Tidak ada hubungan sebab ' +
          'akibat yang masuk akal, tapi ada hubungan.',
          'Kedua: <b>dua orang yang mengetik angka yang sama mendapat ' +
          'lapangan yang sama persis</b>. Angka itu, tanpa disebut begitu, ' +
          'adalah <i>kode lapangan</i> &mdash; hal yang baru punya nama ' +
          'dua puluh tahun kemudian, waktu pemain Minecraft mulai bertukar ' +
          '<i>seed</i>.',
          'Dan ada satu akibat yang mungkin tidak disengaja: mengetik ' +
          '<b>0</b> tiap kali membuat setiap permainan identik. Cara paling ' +
          'mudah menghafal lapangan, disediakan tanpa sadar oleh baris yang ' +
          'menanyakan skor lama.'
        ] }
    ]
  };
})(window);
