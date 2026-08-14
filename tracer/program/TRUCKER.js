/* ===========================================================================
   TRUCKER.js — porting minimalis TRUCKER.BAS sebagai tabel baris.

       5 REM This program is Trucker          140 "by Hughes  Glantzberg"

   Mengemudi truk dari Los Angeles ke New York dalam empat hari. Tiga muatan,
   tiga rute, cuaca, timbangan, polisi, ban pecah, dan kantuk. Tiga ratus
   delapan puluh lima baris.

   YANG PALING LAYAK DILIHAT: SATU BILANGAN MENYIMPAN DUA HAL SEKALIGUS.

       9040 DATA 90,Barstow,I-15 in California,7.80
                                               ^^^^
       3130 ON INT(ZH) GOSUB 3210,3310,3360,3410,3500,3710,3860
       3310 T=100*(ZH-INT(ZH))        ' tol: bagian pecahan = jumlah dolar
       3360 IF RND<ZH-INT(ZH) THEN RETURN   ' konstruksi: pecahan = peluang

   `7.80` berarti KEJADIAN KE-7 (longsor batu) dengan PELUANG 0,80. `2.65`
   berarti kejadian ke-2 (gerbang tol) sebesar $65. `3.65` berarti kejadian
   ke-3 (konstruksi jalan) dengan peluang 0,65.

   Bagian BULAT memilih subrutin. Bagian PECAHAN adalah argumennya. Dan
   artinya berbeda-beda menurut subrutin yang dipilih — kadang uang, kadang
   peluang. Tujuh puluh tiga tonggak jalan, semuanya satu angka.

   DAN DUA SYARAT YANG TIDAK PERNAH SALAH.

       3020 IF HL<4 AND COS(HR/HS)<2.3 THEN ...
       3030 IF HL<8 AND COS(HR/HS)<2.5 THEN ...

   Kosinus selalu di antara -1 dan 1. `COS(apa pun) < 2.3` SELALU benar.
   Dua syarat yang ditulis seolah membatasi sesuatu, dan tidak membatasi
   apa-apa.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `PLAY` diam.
   - Subrutin jeda 59950-59970 habis seketika. Rumusnya sendiri tetap
     ditelusuri — lihat catatan cacat, ia bisa menggantung hampir satu jam.
   - `RANDOMIZE` memasang benih tetap; baris 160 tetap ditelusuri.
   - `RUN "b:???0??"` di baris 4160 dan 5460 tidak bisa dijalankan; nama
     berkasnya berisi kartu liar yang tidak diterima `RUN`. Lihat cacat.
   - Baris 140 dan 150 sudah disunting pemilik koleksi (alamat penulis).
   - `DEFINT C-S` ditiru: penugasan ke variabel yang namanya dimulai C
     sampai S dibulatkan. Yang paling terasa di `HL=HL/2` (baris 1990).
   =========================================================================== */

(function (global) {
  'use strict';

  /* Tiga rute. Tiap baris: [jarak, nama tempat, nama jalan, kode kejadian].
     Kode kejadiannya lihat catatan di kepala berkas. */
  var RUTE = [
    /* RT=0 — rute tengah, 21 tonggak, 2850 mil */
    [2850, [
      [90,'Barstow','I-15 in California',7.80],
      [225,'Needles','I-40 in California',1],
      [440,'Flagstaff','I-40 in California',3.65],
      [620,'Gallup','I-40 in Arizona',5.5],
      [760,'Albuquerque','I-40 in New Mexico',3.35],
      [930,'Tucumcari','I-40 in New Mexico',1],
      [1040,'Amarillo','I-40 in Texas',7.8],
      [1155,'Oklahoma border','I-40 in Texas',5.5],
      [1305,'Oklahoma City','I-40 in Oklahoma',2.65],
      [1530,'Missouri border','Oklahoma Turnpike',2.40],
      [1815,'St. Louis','I-44 in Missouri',0],
      [1980,'Terre Haute','I-70 in Illinois',5.5],
      [2050,'Indianapolis','I-70 in Indianna',0],
      [2115,'Ohio border','I-70 in Indianna',1],
      [2220,'Columbus','I-70 in Ohio',5.5],
      [2350,'Wheeling West Virginia','I-70 in Ohio',4.25],
      [2410,'New Stanton','I-70 in Pennsylvania',6.75],
      [2570,'Harrisburg','Pennsylvania Turnpike',3.75],
      [2760,'New Jersey border','Pennsylvania Turnpike',2.95],
      [2840,'Holland Tunnel','I-70 in New Jersey',2.4],
      [9999,'New York','New York streets',0]]],
    /* RT=1 — rute utara, 18 tonggak, 2710 mil */
    [2710, [
      [90,'Barstow','I-15 in California',7.8],
      [245,'Las Vegas','I-15 in California',1],
      [365,'Utah border','I-15 in Arizona',0],
      [500,'End of Interstate','I-15 in Utah',3.2],
      [555,'Salina','US-89 in Utah',4.5],
      [760,'Grand Junction','I-70 in Utah',5.4],
      [1010,'Denver','I-70 in Colorado',3.75],
      [1190,'Nebraska border','I-76 in Colorado',1],
      [1450,'Omaha','I-80 in Nebraska',5.5],
      [1590,'Demoines','I-80 in Iowa',4.75],
      [1750,'Illinois border','I-80 in Iowa',5.6],
      [1910,'Gary','I-80 in Illinois',2.5],
      [2050,'Ohio border','Indianna Turnpike',2.45],
      [2215,'Cleveland','Ohio Turnpike',2.8],
      [2280,'Pennsylvania border','I-80 in Ohio',4.16],
      [2615,'East Stroudsberg','I-80 in Pennsylvania',3.33],
      [2675,'Washington Bridge','I-80 in New Jersey',2.2],
      [9999,'New York','city streets',0]]],
    /* RT=2 — rute selatan, 25 tonggak, 3120 mil */
    [3120, [
      [75,'Palm Springs','I-10 in California',0],
      [225,'Blythe','I-10 in California',1],
      [375,'Phoenix','I-10 in Arizona',0],
      [495,'Tucson','I-10 in Arizona',7.9],
      [650,'Lordsburg','I-10 in Arizona',5.75],
      [795,'El Paso','I-10 in New Mexico',0],
      [965,'Pecos','I-10 in Texas',1],
      [1080,'Odessa','I-20 in Texas',0],
      [1250,'Abilene','I-20 in Texas',3.8],
      [1439,'Dallas','I-20 in Texas',0],
      [1610,'Louisiana border','I-20 in Texas',5],
      [1785,'Vicksburg','I-20 in Louisiana',0],
      [1965,'Alabama border','I-20 in Mississippi',1],
      [2100,'Birmingham','I-20 in Alabama',4.25],
      [2200,'Georgia border','I-20 in Alabama',0],
      [2255,'Atlanta','I-20 in Georgia',0],
      [2320,'Carolina border','I-85 in Georgia',5.75],
      [2565,'Greensboro','I-85 in Carolina',3.8],
      [2680,'Virginia border','I-85 in North Carolina',7.85],
      [2775,'Richmond','I-85 in Virginia',0],
      [2880,'Washington D.C.','I-95 in Virginia',0],
      [2920,'Baltimore','I-95 in Maryland',2.3],
      [2990,'New Lersey border','I-95 in Delaware',2.25],
      [3110,'Holland Tunnel','New Jersey Turnpike',2.4],
      [9999,'New York','city streets',0]]]
  ];

  /* `DEFINT C-S`: variabel yang namanya dimulai C sampai S bertipe bulat,
     dan penugasan ke sana MEMBULATKAN (bukan memotong). */
  var BULAT = /^[C-S]/;
  function set(m, nama, nilai) {
    m.v[nama] = BULAT.test(nama) ? Math.round(nilai) : nilai;
  }
  function basic(n) {
    if (n !== Math.trunc(n)) return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
    return (n < 0 ? '-' : ' ') + Math.abs(n) + ' ';
  }
  function uang(n, desimal) {
    var s = Math.abs(n).toFixed(desimal === undefined ? 2 : desimal);
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + p.join('.');
  }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  /* Baris 20-150: logo "TRUCKER" digambar dari potongan garis kotak CP437.
     Isinya cuma gambar; ditelusuri sebagai satu langkah per baris. */
  function logo(n, gambar) {
    return { baris: n, jalan: function (m) {
      for (var i = 0; i < gambar.length; i++) {
        m.locate(gambar[i][0], gambar[i][1]);
        m.cetak(kotak(gambar[i][2]));
      }
    } };
  }
  var PETA = { '╔': 201, '═': 205, '╗': 187, '║': 186, '╚': 200, '╝': 188 };
  function kotak(s) {
    var k = '', i;
    for (i = 0; i < s.length; i++) {
      k += PETA[s.charAt(i)] !== undefined
        ? String.fromCharCode(PETA[s.charAt(i)]) : s.charAt(i);
    }
    return k;
  }
  /* Menunggu satu tombol dari daftar yang sah — pola `GOSUB 59990` lalu
     `IF INSTR(...)=0 THEN <ulangi>`. */
  function tombol(n, sah, ulang, sesudah) {
    return { baris: n, bagian: [
      function (m) { m.gosub(59990); },
      function (m) {
        if (sah.indexOf(m.v['IKEY$']) < 0) m.lompat(ulang);
        else if (sesudah) sesudah(m);
      }
    ] };
  }

  var tabel = [

    rem(5),
    { baris: 10, jalan: function (m) { m.cls(); } },
    logo(20, [[5,3,'╔════════╗'],[6,3,'╚═══╗╔═══╝']]),
    logo(30, [[5,14,'╔════════╗'],[6,14,'║╔══════╗║'],[7,14,'║║      ║║'],
              [8,14,'║║      ║║'],[9,14,'║╚══════╝║'],[10,14,'║╔══╗ ╔══╝']]),
    logo(40, [[11,14,'║║  ╚╗╚╗'],[12,14,'║║   ╚╗╚╗'],[13,14,'║║    ╚╗╚╗'],
              [14,14,'╚╝     ╚═╝']]),
    { baris: 50, jalan: function (m) {
        m.locate(5, 25); m.cetak(kotak('╔╗      ╔╗'));
        for (m.v.X = 6; m.v.X <= 12; m.v.X++) {
          m.locate(m.v.X, 25); m.cetak(kotak('║║      ║║'));
        }
        m.locate(13, 25); m.cetak(kotak('║╚══════╝║'));
        m.locate(14, 25); m.cetak(kotak('╚════════╝'));
      } },
    { baris: 60, jalan: function (m) {
        m.locate(5, 36); m.cetak(kotak('╔════════╗'));
        m.locate(6, 36); m.cetak(kotak('║╔══════╗║'));
        m.locate(7, 36); m.cetak(kotak('║║      ╚╝'));
        for (m.v.X = 8; m.v.X <= 11; m.v.X++) {
          m.locate(m.v.X, 36); m.cetak(kotak('║║'));
        }
        m.locate(12, 36); m.cetak(kotak('║║      ╔╗'));
        m.locate(13, 36); m.cetak(kotak('║╚══════╝║'));
        m.locate(14, 36); m.cetak(kotak('╚════════╝'));
      } },
    logo(70, [[5,47,'╔╗   ╔═╗'],[6,47,'║║  ╔╝╔╝'],[7,47,'║║ ╔╝╔╝'],
              [8,47,'║║╔╝╔╝'],[9,47,'║╚╝╔╝'],[10,47,'║╔╗╚╗'],
              [11,47,'║║╚╗╚╗'],[12,47,'║║ ╚╗╚╗']]),
    logo(80, [[13,47,'║║  ╚╗╚╗'],[14,47,'╚╝   ╚═╝']]),
    logo(90, [[5,58,'╔════════╗'],[6,58,'║╔═══════╝'],[7,58,'║║'],[8,58,'║║'],
              [9,58,'║╚═══╗'],[10,58,'║╔═══╝'],[11,58,'║║']]),
    logo(100, [[12,58,'║║'],[13,58,'║╚═══════╗'],[14,58,'╚════════╝']]),
    logo(110, [[5,69,'╔════════╗'],[6,69,'║╔══════╗║'],[7,69,'║║      ║║'],
               [8,69,'║║      ║║'],[9,69,'║╚══════╝║'],[10,69,'║╔══╗ ╔══╝']]),
    logo(120, [[11,69,'║║  ╚╗╚╗'],[12,69,'║║   ╚╗╚╗'],[13,69,'║║    ╚╗╚╗'],
               [14,69,'╚╝     ╚═╝']]),
    { baris: 130, jalan: function (m) {
        m.locate(4, 1);
        m.cetak(m.chr(201) + m.ulang(78, 205) + m.chr(187));
        for (m.v.X = 5; m.v.X <= 14; m.v.X++) {
          m.locate(m.v.X, 1);  m.cetak(m.chr(186));
          m.locate(m.v.X, 80); m.cetak(m.chr(186));
        }
      } },
    { baris: 135, jalan: function (m) {
        m.locate(15, 1);
        m.cetak(m.chr(200) + m.ulang(37, 205) + m.chr(187) + '  ' +
                m.chr(201) + m.ulang(37, 205) + m.chr(188));
      } },
    /* 140-150 nama penulis, dan dua baris alamat yang sudah disunting
       pemilik koleksi ini. */
    { baris: 140, jalan: function (m) {
        m.locate(16, 31); m.cetak(kotak('╔═══════╝by╚═══════╗'));
        m.locate(17, 31); m.cetak(kotak('║Hughes  Glantzberg║'));
        m.locate(18, 29); m.cetak(kotak('╔═╝[disunting UU PDP]╚═╗'));
        m.locate(19, 29); m.cetak(kotak('║  [disunting UU PDP]  ║'));
      } },
    { baris: 150, jalan: function (m) {
        m.locate(20, 29);
        m.cetak(m.chr(200) + m.ulang(22, 205) + m.chr(188));
      } },
    { baris: 155, bagian: [
        function (m) { m.v.TIMEOUT = 4; },
        function (m) { m.gosub(59950); }
      ] },
    /* 160 benih diacak dari jam — dengan rumus yang SAMA cacatnya seperti
       di 59950: jam dikali 120, bukan 3600. Di sini tidak apa-apa. */
    { baris: 160, jalan: function (m) {
        m.v['T$'] = '10:43:07';
        m.v.XX = 10 * 120 + 43 * 60 + 7;
        m.semai(m.v.XX);
      } },
    { baris: 170, jalan: function (m) {
        m.dim('MT()', 2); m.dim('MP()', 2, 25); m.dim('MP$()', 2, 25);
        m.dim('MR$()', 2, 25); m.dim('ZM()', 2, 25);
        m.dim('DS$()', 6); m.dim('NT$()', 4);
      } },
    { baris: 180, jalan: function (m) {
        m.v['DD$'] = '$#,###'; m.v['DC$'] = '$#,###.##';
      } },
    { baris: 190, jalan: function (m) {
        var a = ['first', 'second', 'third', 'fourth'];
        for (var i = 1; i <= 4; i++) m.v['NT$()'][i] = a[i - 1];
      } },
    { baris: 200, jalan: function (m) {
        var a = ['Monday','Tuesday','Wednesday','Thursday','Friday',
                 'Saturday','Sunday'];
        for (var i = 0; i <= 6; i++) m.v['DS$()'][i] = a[i];
      } },

    /* --- 1000-1200: memilih muatan --------------------------------------- */
    { baris: 1000, bagian: [
        function (m) {
          m.cls(); m.v.XC = 190; set(m, 'MF', 0); set(m, 'HL', 3);
          set(m, 'HS', 7); set(m, 'HR', 0);
        },
        function (m) { m.gosub(2100); }
      ] },
    { baris: 1020, jalan: function (m) {
        m.locate(3, 1);
        m.cetak('You are at the Los Angeles trucking terminal.'); m.barisBaru();
      } },
    cet(1030, 'Three types of cargo are available:'),
    pilihan(1040, '1', '--oranges  (highest profit if they don\'t spoil)'),
    pilihan(1050, '2', '--freight forwarding  (penalty for late delivery)'),
    pilihan(1060, '3', '--U.S. Mail  (lowest rate, but no hurry to arrive)'),
    { baris: 1070, jalan: function (m) {
        m.barisBaru();
        m.cetak('The cargo is due in New York by 4 PM on Thursday.');
        m.barisBaru();
      } },
    { baris: 1080, jalan: function (m) {
        m.barisBaru();
        m.cetak('Which type of cargo do you want (1, 2, or 3)?');
      } },
    { baris: 1090, bagian: [
        function (m) { m.gosub(59990); },
        function (m) {
          if ('123'.indexOf(m.v['IKEY$']) < 0) m.lompat(1090);
          else { set(m, 'CT', parseInt(m.v['IKEY$'], 10)); m.cetak(basic(m.v.CT)); }
        }
      ] },
    { baris: 1100, jalan: function (m) {
        m.masukan('WL', 'How many pounds will you carry (40,000 is the legal limit)? ');
      } },
    { baris: 1110, jalan: function (m) {
        if (m.v.WL < 25000) {
          m.cetak("You can't make a living on half a load."); m.barisBaru();
          m.lompat(1100);
        }
      } },
    { baris: 1120, jalan: function (m) {
        m.barisBaru(); m.tab(5);
        m.cetak('They are loading your truck now.'); m.barisBaru();
      } },
    { baris: 1130, jalan: function (m) { m.ulangData(0); } },
    /* 1150-1170 tabel tonggak jalan dibaca dari DATA. `NP` dipakai DUA KALI
       artinya: di sini JUMLAH tonggak rute ini, dan mulai baris 1190 penunjuk
       tonggak yang sedang dituju. Satu nama, dua peran, dua puluh baris
       jaraknya. */
    { baris: 1150, bagian: [
        function (m) { m.untuk('RT', 0, 2, 1, 1190); },
        function (m) {
          set(m, 'NP', m.baca());
          m.v['MT()'][m.v.RT] = m.baca();
        },
        function (m) { m.untuk('I', 1, m.v.NP, 1, 1190); }
      ] },
    { baris: 1170, bagian: [
        function (m) {
          m.v['MP()'][m.v.RT][m.v.I]  = m.baca();
          m.v['MP$()'][m.v.RT][m.v.I] = m.baca();
          m.v['MR$()'][m.v.RT][m.v.I] = m.baca();
          m.v['ZM()'][m.v.RT][m.v.I]  = m.baca();
        },
        function (m) { m.lanjutkan('I'); },
        function (m) { m.lanjutkan('RT'); }
      ] },
    { baris: 1190, jalan: function (m) {
        set(m, 'TC', 10); m.v.WF = 190; set(m, 'NP', 1); set(m, 'TS', 1);
        set(m, 'SL', 55); m.v.XN = (m.v.XN || 0) + 1;
      } },
    /* 1200 batas hukum 40.000 pon disebut di baris 1100 — tapi yang benar
       benar ditolak cuma di atas 50.000. Muatan 45.000 diterima, lalu didenda
       di timbangan. */
    { baris: 1200, bagian: [
        function (m) {
          if (!(m.v.WL > 50000)) m.lompat(1220);
          m.v.WL = 50000;
          m.cetak('50,000 pounds of cargo has filled your trailer!');
          m.barisBaru(); m.v.TIMEOUT = 2;
        },
        function (m) { m.gosub(59950); }
      ] },

    /* --- 1220-1375: bahan bakar, ban, rute ------------------------------- */
    { baris: 1220, bagian: [
        function (m) { set(m, 'HR', m.v.HR + 1); m.cls(); },
        function (m) { m.gosub(2100); },
        function (m) { m.locate(3, 1); }
      ] },
    { baris: 1225, jalan: function (m) {
        m.cetak('You paid $190.00 for a nearly full tank of diesel fuel.');
        m.barisBaru(); m.barisBaru();
      } },
    { baris: 1230, jalan: function (m) {
        m.cetak('Two of your tires are worn.  Do you want replacements (Y or N)?');
      } },
    tombol(1235, 'ynYN', 1235),
    { baris: 1240, jalan: function (m) {
        if (m.v['IKEY$'] === 'n' || m.v['IKEY$'] === 'N') m.lompat(1350);
      } },
    cet(1245, 'A new tire costs $200.00.  A retread costs $100.00.'),
    { baris: 1260, bagian: [
        function (m) { m.masukan('Z$', '     Which type do you want? '); },
        function (m) { m.v['Z$'] = m.v['Z$'].charAt(0); }
      ] },
    { baris: 1270, jalan: function (m) { m.masukan('T', '     How many? '); } },
    /* 1280 memesan TIGA ban baru diam-diam diubah jadi dua ban plus satu
       cadangan — dan harganya tetap tiga. */
    { baris: 1280, jalan: function (m) {
        if (m.v.T === 3 && (m.v['Z$'] === 'n' || m.v['Z$'] === 'N')) {
          set(m, 'TS', 2); m.v.T = 2; m.v.XC = m.v.XC + 200;
        }
      } },
    { baris: 1290, jalan: function (m) {
        if (m.v.T < 0 || m.v.T > 2) m.lompat(1330);
      } },
    { baris: 1300, jalan: function (m) { if (m.v.T === 0) m.lompat(1350); } },
    { baris: 1310, jalan: function (m) {
        if (m.v['Z$'] === 'r' || m.v['Z$'] === 'R') {
          set(m, 'TC', m.v.TC - 3 * m.v.T);
          m.v.XC = m.v.XC + 100 * m.v.T; m.lompat(1350);
        }
      } },
    { baris: 1315, jalan: function (m) {
        if (m.v['Z$'] === 'n' || m.v['Z$'] === 'N') {
          set(m, 'TC', m.v.TC - 4 * m.v.T);
          m.v.XC = m.v.XC + 200 * m.v.T; m.lompat(1350);
        }
      } },
    { baris: 1330, jalan: function (m) {
        m.cetak('I did not understand your answers.'); m.barisBaru();
        m.cetak("Let's try again!"); m.barisBaru(); m.lompat(1230);
      } },
    { baris: 1350, jalan: function (m) {
        m.barisBaru();
        m.cetak('You may choose the northern, middle or southern route.');
        m.barisBaru();
      } },
    { baris: 1360, jalan: function (m) {
        m.cetak('     Which route do you choose (n, m or s)? ');
      } },
    tombol(1362, 'nmsNMS', 1362),
    { baris: 1363, jalan: function (m) {
        m.cetak(m.v['IKEY$']); m.barisBaru(); m.barisBaru(); m.barisBaru();
      } },
    /* 1365-1375 `RH` adalah "kekasaran" rute: 4 di utara, 2 di tengah, 1 di
       selatan. Ia dipakai di 1440 (peluang ban pecah) dan 1450 (peluang
       polisi) — satu angka yang membuat rute utara paling berbahaya. */
    { baris: 1365, jalan: function (m) {
        if (m.v['IKEY$'] === 'n' || m.v['IKEY$'] === 'N') {
          set(m, 'RT', 1); set(m, 'RH', 4); m.lompat(1600);
        }
      } },
    { baris: 1370, jalan: function (m) {
        if (m.v['IKEY$'] === 'm' || m.v['IKEY$'] === 'M') {
          set(m, 'RT', 0); set(m, 'RH', 2); m.lompat(1600);
        }
      } },
    { baris: 1375, jalan: function (m) {
        set(m, 'RT', 2); set(m, 'RH', 1); m.lompat(1600);
      } },

    /* --- 1400-1530: satu ruas perjalanan --------------------------------- */
    /* 1400-1420 PELUANG KECELAKAAN: kecepatan KUADRAT dikali keadaan
       pengemudi dikali keadaan cuaca. Ngebut di kabut waktu mengantuk
       mengalikan ketiganya sekaligus. */
    { baris: 1400, jalan: function (m) {
        m.v.AF = m.v.SP * m.v.SP * m.v.CD * m.v.CR;
      } },
    { baris: 1420, jalan: function (m) {
        if (m.v.AF > m.acak() * 10000000) m.lompat(4000);
      } },
    { baris: 1430, jalan: function (m) {
        m.v.AF = Math.sqrt(m.v.MF + 100) * m.v.TC;
      } },
    { baris: 1440, bagian: [
        function (m) {
          if (!(m.v.AF > m.v.RH * 25000 * m.acak())) m.lompat(1450);
        },
        function (m) { m.gosub(2600); }
      ] },
    { baris: 1450, bagian: [
        function (m) {
          if (!(m.v.SP > m.v.SL - m.v.RH + 10)) m.lompat(1460);
        },
        function (m) { m.gosub(2300); }
      ] },
    { baris: 1460, jalan: function (m) {
        set(m, 'HR', m.v.HR + 1); set(m, 'HL', m.v.HL + 1);
      } },
    { baris: 1470, jalan: function (m) { if (m.v.SL < 40) set(m, 'SL', 55); } },
    /* 1480-1490 EKONOMI BAHAN BAKAR BERBENTUK BUKIT: paling irit tepat di
       55 mil/jam, dan makin buruk ke dua arah. Puncaknya dipatok di selisih
       12,5 supaya tidak pernah membagi dengan bilangan negatif. */
    { baris: 1480, jalan: function (m) {
        m.v.T = Math.abs(55 - m.v.SP);
        if (m.v.T > 12) m.v.T = 12.5;
      } },
    { baris: 1490, jalan: function (m) {
        m.v.T1 = m.v.SP / (4.5 - 0.2 * m.v.T);
      } },
    { baris: 1500, bagian: [
        function (m) {
          m.v.WF = m.v.WF - m.v.T1;
          if (!(m.v.WF < 0)) m.lompat(1510);
        },
        function (m) { m.gosub(2500); }
      ] },
    { baris: 1510, jalan: function (m) { set(m, 'MF', m.v.MF + m.v.SP); } },
    { baris: 1520, jalan: function (m) {
        if (m.v.MF > m.v['MT()'][m.v.RT]) m.lompat(5000);
      } },
    { baris: 1530, bagian: [
        function (m) { m.v.TIMEOUT = 2; },
        function (m) { m.gosub(59950); }
      ] },
    { baris: 1550, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(2100); }
      ] },
    /* 1560 penunjuk bahan bakar SENGAJA TIDAK TEPAT: yang ditampilkan
       nilai sebenarnya ditambah acak -4 sampai +5. Pengemudi tidak pernah
       tahu persis berapa sisanya, sama seperti di truk sungguhan. */
    { baris: 1560, jalan: function (m) {
        m.locate(2, 1);
        m.cetak('Approximate fuel:' + basic(Math.trunc(m.v.WF - 4 + m.acak() * 10)));
        m.tab(36); m.cetak('Speed: ' + basic(m.v.SP)); m.barisBaru();
      } },
    { baris: 1570, jalan: function (m) {
        m.cetak('        Odometer: ' + basic(m.v.MF));
        m.tab(30);
        m.cetak('Miles to go: ' + basic(m.v['MT()'][m.v.RT] - m.v.MF));
        m.barisBaru();
      } },
    { baris: 1580, jalan: function (m) { m.barisBaru(); } },
    { baris: 1600, jalan: function (m) {
        if (m.v['MP()'][m.v.RT][m.v.NP] <= m.v.MF) m.lompat(3100);
        else {
          m.cetak('Cruising on ' + m.v['MR$()'][m.v.RT][m.v.NP]);
          m.barisBaru();
        }
      } },
    { baris: 1610, bagian: [
        function (m) { m.gosub(3000); },
        function (m) {
          m.cetak('You are feeling ' + m.v['CD$']); m.barisBaru();
        }
      ] },
    { baris: 1620, bagian: [
        function (m) { m.gosub(2800); },
        function (m) {
          m.cetak('Current weather: ' + m.v['CR$']); m.barisBaru();
        }
      ] },
    { baris: 1630, bagian: [
        function (m) {
          set(m, 'NS', m.v.NS + 1);
          if (!(m.v.NS > 3)) m.lompat(1640);
        },
        function (m) { m.gosub(1700); }
      ] },
    { baris: 1640, jalan: function (m) {
        m.masukan('SP', 'How fast do you wish to go (20-100)? ');
      } },
    { baris: 1650, jalan: function (m) {
        if (m.v.SP < 20) {
          m.cetak('Your have to go at least 20 --'); m.lompat(1640);
        }
      } },
    { baris: 1660, jalan: function (m) {
        if (m.v.SP > Math.trunc(1.5 * m.v.SL)) {
          set(m, 'SP', Math.trunc(1.5 * m.v.SL));
          m.cetak('You can only get the old rig to go' + basic(m.v.SP) +
                  'MPH on this road.');
          m.barisBaru();
        }
      } },
    { baris: 1670, jalan: function (m) { m.lompat(1400); } },

    /* --- 1700-2020: warung truk ------------------------------------------ */
    rem(1700),
    { baris: 1710, jalan: function (m) {
        m.cetak('Truck stop ahead.  Do you want to stop (Y or N)? ');
      } },
    tombol(1715, 'nyNY', 1715, function (m) { m.cetak(m.v['IKEY$']); }),
    { baris: 1720, jalan: function (m) {
        if (m.v['IKEY$'] === 'n' || m.v['IKEY$'] === 'N') {
          set(m, 'S', 1); set(m, 'HL', m.v.HL + 1); m.kembali();
        }
      } },
    { baris: 1740, jalan: function (m) {
        m.v.T = 85 + Math.trunc(35 * m.acak());
      } },
    { baris: 1750, jalan: function (m) {
        m.cetak('Diesel fuel costs $' + (m.v.T / 100).toFixed(2) + ' per gallon.');
        m.barisBaru();
      } },
    { baris: 1760, jalan: function (m) {
        m.masukan('T1', '     How many gallons do you want? ');
      } },
    { baris: 1770, jalan: function (m) {
        if (m.v.T1 > 0) {
          m.cetak('Pay ' + uang(m.v.T * m.v.T1 / 100)); m.barisBaru();
          m.v.XC = m.v.XC + m.v.T * m.v.T1 / 100;
          m.v.WF = m.v.WF + m.v.T1;
        }
      } },
    { baris: 1780, jalan: function (m) {
        m.cetak('So far, you have spent ' + uang(m.v.XC)); m.barisBaru();
      } },
    { baris: 1790, jalan: function (m) {
        if (m.v.WF > 201) {
          m.cetak('Your tank only holds 200 gallons --' +
                  basic(Math.trunc(m.v.WF - 200)) + ' gallons spilled !!');
          m.barisBaru(); m.v.WF = 200;
        }
      } },
    { baris: 1800, jalan: function (m) { if (m.v.TS > 0) m.lompat(1900); } },
    { baris: 1810, jalan: function (m) {
        m.v.T = 200 + Math.trunc(50 * m.acak());
        m.v.T1 = 100 + Math.trunc(70 * m.acak());
      } },
    { baris: 1820, jalan: function (m) {
        m.cetak('A new tire costs ' + uang(m.v.T) +
                '.     A retread costs ' + uang(m.v.T1) + '.');
        m.barisBaru();
      } },
    { baris: 1830, jalan: function (m) {
        m.cetak('     Do you want to buy a tire (Y or N)?');
      } },
    tombol(1835, 'nyNY', 1835),
    { baris: 1840, jalan: function (m) {
        if (m.v['IKEY$'] === 'n' || m.v['IKEY$'] === 'N') m.lompat(1900);
      } },
    /* 1850 `STOP` — PROGRAMNYA BERHENTI DI SINI. Menjawab "Y" pada tawaran
       membeli ban di warung truk menghentikan permainan. Fitur yang tidak
       pernah selesai ditulis, ditinggal sebagai satu perintah STOP.
       Bisa dicapai: baris 1800 melewati bagian ini selama masih ada ban
       cadangan (`TS>0`), tapi sesudah ban pecah, `TS` jadi nol di baris 2640
       dan tawarannya muncul. */
    { baris: 1850, jalan: function (m) {
        m.henti('STOP di baris 1850 — cabang beli ban tidak pernah selesai ditulis');
      } },
    { baris: 1900, jalan: function (m) {
        set(m, 'HR', m.v.HR + 1); set(m, 'NS', 0);
      } },
    { baris: 1910, jalan: function (m) {
        m.cetak('Do you want to get some sleep (Y or N)? ');
      } },
    tombol(1915, 'nyNY', 1915, function (m) {
      m.cetak(m.v['IKEY$']); m.barisBaru();
    }),
    { baris: 1920, bagian: [
        function (m) {
          if (m.v['IKEY$'] !== 'n' && m.v['IKEY$'] !== 'N') m.lompat(1930);
          m.cls();
        },
        function (m) { m.gosub(2100); },
        function (m) { m.locate(5, 1); m.kembali(); }
      ] },
    { baris: 1930, jalan: function (m) {
        m.masukan('T', '     How many hours of rest? ');
      } },
    { baris: 1940, jalan: function (m) { if (m.v.T < 1) m.kembali(); } },
    { baris: 1950, jalan: function (m) {
        set(m, 'DH', m.v.HR - 24 * Math.trunc(m.v.HR / 24));
      } },
    { baris: 1960, bagian: [
        function (m) { set(m, 'HR', m.v.HR + m.v.T); m.v.TIMEOUT = 4; },
        function (m) { m.gosub(59950); },
        function (m) {
          if (m.v.CT !== 1) m.lompat(1970);
          m.v.WF = m.v.WF - 7 * m.v.T;
          if (!(m.v.WF < 0)) m.lompat(1970);
          m.v.WF = 0;
        },
        function (m) { m.gosub(2570); }
      ] },
    /* 1970 tidur di siang hari cuma dihitung SETENGAH. Jam tidurnya nyata,
       tapi manfaatnya tidak. */
    { baris: 1970, jalan: function (m) {
        if (m.v.DH > 21 || m.v.DH < 12) {
          m.v.T = Math.trunc(m.v.T / 2 + 0.6);
          m.cetak('Thanks to the daytime noise, you got only' +
                  basic(m.v.T) + 'hours real sleep.');
          m.barisBaru();
        }
      } },
    { baris: 1980, jalan: function (m) { set(m, 'HS', m.v.HS + m.v.T); } },
    { baris: 1990, jalan: function (m) {
        if (m.v.T > 3) set(m, 'HL', 0); else set(m, 'HL', m.v.HL / 2);
      } },
    { baris: 2000, jalan: function () { /* PLAY: dengkuran */ } },
    { baris: 2010, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(2100); },
        function (m) {
          m.locate(5, 1); m.cetak('Time to hit the road again.'); m.barisBaru();
        }
      ] },
    { baris: 2015, jalan: function (m) {
        if (m.v.CT === 1) {
          m.cetak('You now have' + basic(Math.trunc(m.v.WF)) + 'gallons of fuel.');
          m.barisBaru();
          m.cetak('Do you want to buy more (Y or N)? ');
        } else m.kembali();
      } },
    tombol(2017, 'nyNY', 2017, function (m) {
      m.cetak(m.v['IKEY$']); m.barisBaru();
    }),
    { baris: 2020, jalan: function (m) {
        if (m.v['IKEY$'] === 'n' || m.v['IKEY$'] === 'N') m.kembali();
        else m.lompat(1740);
      } },

    /* --- 2100-2220: jam dan hari ----------------------------------------- */
    { baris: 2100, jalan: function (m) {
        set(m, 'DH', m.v.HR + 8);
        set(m, 'DT', Math.trunc(m.v.DH / 24));
        set(m, 'DH', m.v.DH - 24 * m.v.DT);
      } },
    { baris: 2130, jalan: function (m) {
        if (m.v.DT > 6) { set(m, 'DT', m.v.DT - 7); m.lompat(2130); }
      } },
    { baris: 2140, jalan: function (m) {
        m.v['DM$'] = 'AM';
        if (m.v.DH === 12) { m.v['DM$'] = 'Noon'; m.lompat(2200); }
      } },
    { baris: 2160, jalan: function (m) {
        if (m.v.DH > 12) { set(m, 'DH', m.v.DH - 12); m.v['DM$'] = 'PM'; }
      } },
    /* 2170 `DH$` — HURUFNYA SALAH. Yang dipakai baris 2210 adalah `DM$`.
       Akibatnya tengah malam tercetak "12 AM", bukan "Midnight", dan `DH$`
       jadi variabel yang ditulis sekali lalu tidak pernah dibaca. */
    { baris: 2170, jalan: function (m) {
        if (m.v.DH === 0) { set(m, 'DH', 12); m.v['DH$'] = 'Midnight'; }
      } },
    rem(2200),
    { baris: 2210, jalan: function (m) {
        m.locate(1, 13);
        m.cetak('Day: ' + m.v['DS$()'][m.v.DT]);
        m.tab(37);
        m.cetak('Time: ' + basic(m.v.DH) + m.v['DM$'] + '       ');
        m.barisBaru();
      } },
    { baris: 2220, jalan: function (m) { m.kembali(); } },

    /* --- 2300-2460: polisi ----------------------------------------------- */
    rem(2300),
    /* 2310 peluang ditilang naik dengan KUADRAT selisih kecepatan. Lewat
       lima mil di atas batas hampir selalu lolos; lewat tiga puluh hampir
       pasti kena. */
    { baris: 2310, jalan: function (m) {
        var d = m.v.SP - m.v.SL + 2 * m.v.RH - 5;
        if (d * d < 900 * m.acak()) m.kembali();
      } },
    { baris: 2320, jalan: function (m) {
        m.cetak('Smokey is behind you with his lights on.  Pull over!');
        m.barisBaru();
      } },
    { baris: 2340, bagian: [
        function (m) { m.v.TIMEOUT = 2; },
        function (m) { m.gosub(59950); }
      ] },
    { baris: 2350, jalan: function (m) {
        set(m, 'NT', m.v.NT + 1);
        m.cetak('See the justice of the peace for your ' +
                (m.v['NT$()'][m.v.NT] || '') + ' offense.');
        m.barisBaru();
      } },
    { baris: 2360, jalan: function (m) {
        m.cetak('     Wait' + basic(m.v.NT) + 'hours for your hearing.');
        m.barisBaru();
      } },
    { baris: 2370, jalan: function (m) {
        set(m, 'HR', m.v.HR + m.v.NT); set(m, 'HL', m.v.HL + m.v.NT);
      } },
    { baris: 2380, jalan: function (m) { if (m.v.NT > 3) m.lompat(2430); } },
    { baris: 2390, jalan: function (m) {
        m.v.T = Math.trunc(m.v.NT * (m.acak() * 5));
        m.v.T1 = Math.trunc(5 * (m.v.RT + m.v.NT * (m.acak() * 4)));
      } },
    { baris: 2400, jalan: function (m) {
        m.cetak('     The fine is ' + uang(m.v.T1) + ' plus ' +
                uang(m.v.T) + ' for each MPH over the limit.');
        m.barisBaru();
      } },
    { baris: 2410, jalan: function (m) {
        var d = m.v.T1 + m.v.T * (m.v.SP - m.v.SL);
        m.cetak('     Pay ' + uang(d, 0)); m.barisBaru();
        m.v.XC = m.v.XC + d;
      } },
    { baris: 2420, bagian: [
        function (m) { m.v.TIMEOUT = 8; },
        function (m) { m.gosub(59950); },
        function (m) { m.kembali(); }
      ] },
    { baris: 2430, jalan: function (m) {
        m.cetak('  You are sentenced to 30 days in jail for reckless driving.');
        m.barisBaru();
      } },
    { baris: 2440, bagian: [
        function (m) { m.v.TIMEOUT = 2; },
        function (m) { m.gosub(59950); }
      ] },
    { baris: 2450, jalan: function (m) {
        m.cetak("Your I.C.C. driver's license is revoked !"); m.barisBaru();
      } },
    { baris: 2460, jalan: function (m) { m.lompat(5500); } },

    /* --- 2500-2590: kehabisan bahan bakar -------------------------------- */
    { baris: 2500, jalan: function (m) {
        m.v.T1 = m.v.T1 + m.v.WF; m.v.WF = 0; set(m, 'SP', 0);
      } },
    { baris: 2510, jalan: function (m) {
        m.v.T = (4.5 - 0.2 * m.v.T) * m.v.T1;
        set(m, 'MF', m.v.MF + m.v.T);
      } },
    { baris: 2520, jalan: function (m) {
        m.cetak('After' + basic(m.v.T) + 'more miles, you ran out of fuel  (DUMMY !!)');
        m.barisBaru();
      } },
    cet(2540, '     It cost $200 to get a barrel of diesel delivered.'),
    /* 2550 dendanya masuk ke `ZC` — variabel yang TIDAK PERNAH DIBACA di
       mana pun. Yang dipakai untuk seluruh biaya perjalanan adalah `XC`.
       Dua ratus dolar yang hilang dari pembukuan. */
    { baris: 2550, jalan: function (m) {
        m.v.WF = 55; m.v.T1 = Math.trunc(m.acak() * 5);
        set(m, 'HR', m.v.HR + m.v.T1);
        m.v.ZC = (m.v.ZC || 0) + 200;
        set(m, 'HL', m.v.HL + m.v.T1);
      } },
    { baris: 2560, jalan: function (m) {
        m.cetak('          You also wasted' + basic(m.v.T1) +
                'hours by your carelessness.');
        m.barisBaru();
      } },
    { baris: 2570, jalan: function (m) {
        if (m.v.CT === 1) {
          set(m, 'CX', m.v.CX + Math.trunc(m.acak() * 3));
          m.cetak('     Sitting with the refer unit off is damaging the oranges.');
          m.barisBaru();
        }
      } },
    { baris: 2580, bagian: [
        function (m) { m.v.TIMEOUT = 1; },
        function (m) { m.gosub(59950); }
      ] },
    { baris: 2590, jalan: function (m) { m.kembali(); } },

    /* --- 2600-2740: ban pecah -------------------------------------------- */
    { baris: 2600, jalan: function () { /* PLAY: desis ban */ } },
    { baris: 2620, jalan: function (m) {
        m.cetak('Your just blew a tire !!'); m.barisBaru();
      } },
    { baris: 2630, jalan: function (m) { if (m.v.TS === 0) m.lompat(2710); } },
    { baris: 2640, jalan: function (m) {
        set(m, 'TC', m.v.TC - 2 * m.v.TS); set(m, 'TS', 0);
      } },
    { baris: 2650, jalan: function (m) {
        m.v.T = Math.trunc(m.acak() * 2) + 1;
        m.v['T$'] = (m.v.T === 1) ? 'outside' : 'inside';
      } },
    /* 2660 `HL=HR+T+1` — HURUFNYA SALAH, seharusnya `HL=HL+T+1`.
       `HL` adalah jam sejak tidur terakhir; `HR` jam sejak berangkat. Sesudah
       satu ban pecah, `HL` melompat jadi TOTAL jam perjalanan — dan baris
       3010 (`IF HL>19`) langsung menyatakan pengemudinya kelelahan, untuk
       selamanya. Satu huruf, dan permainannya tidak bisa dimenangkan lagi. */
    { baris: 2660, jalan: function (m) {
        m.cetak('     It took' + basic(m.v.T) + 'hours to change the ' +
                m.v['T$'] + ' tire.');
        m.barisBaru();
        set(m, 'HR', m.v.HR + m.v.T);
        set(m, 'HL', m.v.HR + m.v.T + 1);
      } },
    { baris: 2670, bagian: [
        function (m) { m.v.TIMEOUT = 2; },
        function (m) { m.gosub(59950); },
        function (m) { m.kembali(); }
      ] },
    { baris: 2710, jalan: function (m) {
        m.cetak('Since your spare has already been used, you have to call a tow truck');
        m.barisBaru();
        m.cetak('from town to deliver a new tire for you.'); m.barisBaru();
      } },
    cet(2720, '     This service cost $400.00 and took 4 hours.'),
    { baris: 2730, jalan: function (m) {
        set(m, 'HR', m.v.HR + 4); set(m, 'HL', m.v.HL + 4);
        m.v.XC = m.v.XC + 400;
      } },
    /* 2740 `TIMEPUT=2` — salah ketik untuk `TIMEOUT`. Jedanya memakai nilai
       LAMA, dan `TIMEPUT` jadi variabel ketiga yang ditulis lalu dilupakan. */
    { baris: 2740, bagian: [
        function (m) { m.v.TIMEPUT = 2; },
        function (m) { m.gosub(59950); },
        function (m) { m.kembali(); }
      ] },

    /* --- 2800-2985: cuaca ------------------------------------------------ */
    rem(2800),
    /* 2810 cuaca diundi dari (3000 + jarak tempuh) — jadi makin ke timur,
       makin besar peluang cuaca buruk. Dan `ON RT+1 GOTO` memilih tabel
       ambang yang berbeda per rute: utara paling mudah bersalju. */
    { baris: 2810, jalan: function (m) {
        m.v.AF = (3000 + m.v.MF) * m.acak();
        var ke = [2870, 2820, 2910][m.v.RT];
        if (ke) m.lompat(ke);
      } },
    cuaca(2820, 3300, '<', 2960), cuaca(2830, 4800, '>', 2965),
    cuaca(2840, 4600, '>', 2970), cuaca(2850, 3800, '>', 2975),
    { baris: 2860, jalan: function (m) { m.lompat(2985); } },
    cuaca(2870, 3400, '<', 2960), cuaca(2880, 4900, '>', 2965),
    cuaca(2890, 4700, '>', 2970),
    { baris: 2900, jalan: function (m) {
        if (m.v.AF > 4200) {
          if (Math.trunc(m.acak() * 3) + 1 === 1) m.lompat(2975);
          else m.lompat(2980);
        }
      } },
    { baris: 2905, jalan: function (m) { m.lompat(2985); } },
    cuaca(2910, 4000, '<', 2960), cuaca(2920, 5700, '>', 2965),
    cuaca(2930, 5500, '>', 2970), cuaca(2940, 4400, '>', 2980),
    { baris: 2950, jalan: function (m) { m.lompat(2985); } },
    langit(2960, 1, 'clear & dry'),
    langit(2965, 50, 'B-L-I-Z-Z-A-R-D  !!'),
    langit(2970, 10, 'fog -- limited visibility'),
    langit(2975, 5, 'light snow'),
    langit(2980, 5, 'rain'),
    langit(2985, 3, 'clear, but roadway is wet'),

    /* --- 3000-3060: keadaan pengemudi ------------------------------------ */
    rem(3000),
    { baris: 3010, jalan: function (m) {
        if (m.v.HL > 19 || m.v.HR / m.v.HS > 4) {
          set(m, 'CD', 100); m.v['CD$'] = '..E.X.H.A.U.S.T.E.D..'; m.kembali();
        }
      } },
    /* 3020-3030 `COS(HR/HS) < 2.3` — KOSINUS SELALU DI ANTARA -1 DAN 1, jadi
       syarat ini SELALU BENAR dan tidak membatasi apa pun. Yang sebenarnya
       menentukan cuma `HL`. Dua baris yang ditulis seolah menimbang dua hal,
       dan menimbang satu. */
    { baris: 3020, jalan: function (m) {
        if (m.v.HL < 4 && Math.cos(m.v.HR / m.v.HS) < 2.3) {
          set(m, 'CD', 1); m.v['CD$'] = 'rested & rearing to go.'; m.kembali();
        }
      } },
    { baris: 3030, jalan: function (m) {
        if (m.v.HL < 8 && Math.cos(m.v.HR / m.v.HS) < 2.5) {
          set(m, 'CD', 2); m.v['CD$'] = 'fine'; m.kembali();
        }
      } },
    { baris: 3040, jalan: function (m) {
        if (m.v.HL < 12 && m.v.HR / m.v.HS <= 3) {
          set(m, 'CD', 4); m.v['CD$'] = '  b o r e d'; m.kembali();
        }
      } },
    { baris: 3050, jalan: function (m) {
        if (m.v.HL < 16 && m.v.HR / m.v.HS <= 3) {
          set(m, 'CD', 8); m.v['CD$'] = '  t i r e d  !!'; m.kembali();
        }
      } },
    { baris: 3060, jalan: function (m) {
        set(m, 'CD', 25);
        m.v['CD$'] = "fatigued...you're getting sleepy"; m.kembali();
      } },

    /* --- 3100-3920: kejadian di tonggak jalan ---------------------------- */
    rem(3100),
    { baris: 3110, jalan: function (m) {
        m.cetak('You have just passed ' + m.v['MP$()'][m.v.RT][m.v.NP]);
        m.barisBaru();
      } },
    { baris: 3120, jalan: function (m) {
        m.v.ZH = m.v['ZM()'][m.v.RT][m.v.NP]; set(m, 'SL', 55);
      } },
    /* 3130 BAGIAN BULAT memilih subrutin. Bagian PECAHAN jadi argumennya —
       dan artinya berbeda di tiap subrutin. */
    { baris: 3130, bagian: [
        function (m) {
          var ke = [3210, 3310, 3360, 3410, 3500, 3710, 3860][Math.trunc(m.v.ZH) - 1];
          if (!ke) m.lompat(3140); else m.simpanKe = ke;
        },
        function (m) { m.gosub(m.simpanKe); }
      ] },
    /* 3140 `IF INT(ZH)=8 THEN 5000` — TIDAK ADA SATU PUN tonggak jalan yang
       kodenya 8 atau lebih; yang terbesar 7,9. Cabang ini tidak pernah
       diambil. Kedatangan diurus baris 1520. */
    { baris: 3140, bagian: [
        function (m) {
          set(m, 'NP', m.v.NP + 1);
          if (Math.trunc(m.v.ZH) === 8) m.lompat(5000);
          m.v.TIMEOUT = 5;
        },
        function (m) { m.gosub(59950); },
        function (m) {
          for (m.v.I = 5; m.v.I <= 11; m.v.I++) {
            m.locate(m.v.I, 1); m.spc(70); m.barisBaru();
          }
          m.locate(5, 1); m.lompat(1600);
        }
      ] },
    /* --- kejadian 1: ganti zona waktu --- */
    cet(3210, 'Time zone changes -- set clock ahead one hour.'),
    { baris: 3220, bagian: [
        function (m) { set(m, 'HR', m.v.HR + 1); },
        function (m) { m.gosub(2100); }
      ] },
    { baris: 3230, jalan: function (m) { m.kembali(); } },
    /* --- kejadian 2: gerbang tol; pecahannya JUMLAH DOLAR --- */
    { baris: 3310, jalan: function (m) {
        m.v.T = 100 * (m.v.ZH - Math.trunc(m.v.ZH));
      } },
    { baris: 3320, jalan: function (m) {
        m.cetak('STOP!   Pay toll of ' + uang(m.v.T)); m.barisBaru();
      } },
    { baris: 3330, jalan: function (m) { m.v.XC = m.v.XC + m.v.T; } },
    { baris: 3340, jalan: function (m) { m.kembali(); } },
    /* --- kejadian 3: konstruksi jalan; pecahannya PELUANG LEWAT --- */
    { baris: 3360, jalan: function (m) {
        if (m.acak() < m.v.ZH - Math.trunc(m.v.ZH)) m.kembali();
      } },
    { baris: 3370, bagian: [
        function (m) {
          m.cetak('Construction ahead !!'); m.barisBaru(); m.v.TIMEOUT = 2;
        },
        function (m) { m.gosub(59950); }
      ] },
    { baris: 3380, jalan: function (m) {
        m.cetak('Slow down -- speed limit 35 MPH'); m.barisBaru();
        set(m, 'SL', 35);
      } },
    { baris: 3390, jalan: function (m) { m.kembali(); } },
    /* --- kejadian 4: radar --- */
    { baris: 3410, jalan: function (m) {
        if (m.acak() < m.v.ZH - Math.trunc(m.v.ZH)) m.kembali();
      } },
    { baris: 3420, jalan: function (m) {
        m.v.T = m.v.SP + m.acak() * 5 - 2;
      } },
    { baris: 3430, jalan: function (m) {
        m.cetak('You were just clocked by radar at' + basic(m.v.T) + 'MPH.');
        m.barisBaru();
      } },
    { baris: 3440, bagian: [
        function (m) {
          if (m.v.T > m.v.SL + 3) return;
          m.cetak('     No ticket this time.'); m.barisBaru(); m.lompat(3450);
        },
        function (m) { m.gosub(2320); }
      ] },
    { baris: 3450, jalan: function (m) { m.kembali(); } },
    /* --- kejadian 5: timbangan; ZH=5 TEPAT berarti larangan Louisiana --- */
    { baris: 3500, jalan: function (m) {
        if (m.v.ZH === Math.trunc(m.v.ZH)) {
          if (m.acak() < 0.5) m.lompat(3520); else m.kembali();
        }
      } },
    { baris: 3510, jalan: function (m) {
        if (m.acak() < m.v.ZH - Math.trunc(m.v.ZH)) m.kembali();
      } },
    { baris: 3520, bagian: [
        function (m) {
          m.cetak('Weighing station open -- trucks must stop.'); m.barisBaru();
          m.v.TIMEOUT = 2;
        },
        function (m) { m.gosub(59950); }
      ] },
    { baris: 3530, jalan: function (m) {
        m.cetak('Scale weighs truck with cargo, fuel & driver: ');
      } },
    /* 3540 berat = truk kosong 19.000 pon + muatan + tujuh pon per galon
       solar + acak. Solar memang sekitar tujuh pon per galon. */
    { baris: 3540, jalan: function (m) {
        m.v.T = 19000 + m.v.WL + 7 * m.v.WF + 25 * Math.trunc(m.acak() * 10);
      } },
    { baris: 3550, jalan: function (m) {
        m.cetak(Math.round(m.v.T).toLocaleString('en-US') + ' pounds.');
        m.barisBaru();
      } },
    { baris: 3560, jalan: function (m) { m.v.T = Math.trunc(m.v.T - 60000); } },
    { baris: 3570, jalan: function (m) {
        if (m.v.T < 1) {
          m.cetak("     You're O.K."); m.barisBaru(); m.kembali();
        }
      } },
    { baris: 3580, jalan: function (m) { if (m.v.ZH === 5) m.lompat(3630); } },
    { baris: 3590, jalan: function (m) {
        m.v.T1 = Math.trunc(m.acak() * 4) + 2;
        m.cetak('     Overweight fine is $200.00 plus' + basic(m.v.T1) +
                'cents/pound.');
        m.barisBaru();
      } },
    { baris: 3600, jalan: function (m) {
        m.v.XC = m.v.XC + 200 + (m.v.T * m.v.T1) / 100;
      } },
    { baris: 3610, jalan: function (m) {
        m.cetak('Pay fine of ' + uang(200 + (m.v.T * m.v.T1) / 100));
        m.barisBaru();
      } },
    { baris: 3620, jalan: function (m) { m.kembali(); } },
    /* --- ZH=5 tepat: dilarang masuk Louisiana, dan RUTENYA DIUBAH --- */
    rem(3630),
    cet(3640, 'You are not allowed to enter Louisiana with that load.'),
    cet(3650, '     Take a 200 mile detour through Arkansas with 45 MPH limit.'),
    /* 3660-3680 memutar lewat Arkansas MENULIS ULANG TABEL RUTENYA: nama
       jalannya diganti, dan semua tonggak sesudah yang ke-12 digeser 200 mil.
       Petanya bukan data tetap — ia bisa berubah di tengah jalan. */
    { baris: 3660, jalan: function (m) {
        set(m, 'SL', 45);
        m.v['MR$()'][m.v.RT][m.v.NP] = 'Arkansas county roads';
      } },
    { baris: 3670, jalan: function (m) {
        for (m.v.I = 12; m.v.I <= 25; m.v.I++) {
          if (m.v['MP()'][m.v.RT][m.v.I] !== undefined) {
            m.v['MP()'][m.v.RT][m.v.I] += 200;
          }
        }
      } },
    { baris: 3680, jalan: function (m) {
        m.v['MT()'][m.v.RT] = m.v['MT()'][m.v.RT] + 200;
      } },
    { baris: 3690, jalan: function (m) { m.kembali(); } },
    /* --- kejadian 6: longsor batu di Terowongan Alleghany --- */
    { baris: 3710, jalan: function (m) {
        if (m.acak() < m.v.ZH - Math.trunc(m.v.ZH)) m.kembali();
      } },
    { baris: 3720, jalan: function (m) { m.v.T = Math.trunc(m.acak() * 6); } },
    cet(3730, 'A rock slide has blocked the Alleghany Tunnel entrance.'),
    { baris: 3740, jalan: function (m) {
        m.cetak('     THE HIGHWAY DEPARTMENT WILL HAVE IT CLEARED IN' +
                basic(m.v.T) + 'HOURS.');
        m.barisBaru();
      } },
    { baris: 3750, bagian: [
        function (m) { set(m, 'HR', m.v.HR + m.v.T); m.v.TIMEOUT = 2; },
        function (m) { m.gosub(59950); },
        function (m) {
          if (m.v.CT !== 1) m.lompat(3760);
          m.v.WF = m.v.WF - 7 * m.v.T;
          if (!(m.v.WF <= 1)) m.lompat(3760);
        },
        function (m) { m.gosub(3820); }
      ] },
    { baris: 3760, jalan: function (m) {
        if (m.v.T > 1) m.v.T1 = Math.trunc(m.v.T / 2 + 0.5); else m.v.T1 = 0;
      } },
    { baris: 3770, jalan: function (m) {
        if (m.v.T1 > 3) set(m, 'HL', 0);
        else if (m.v.T1 > 0) set(m, 'HL', m.v.HL / 2);
      } },
    { baris: 3780, jalan: function (m) { set(m, 'HS', m.v.HS + m.v.T1); } },
    { baris: 3790, jalan: function (m) {
        m.cetak('     While waiting, you got' + basic(m.v.T1) + 'hours of sleep');
        m.barisBaru();
      } },
    { baris: 3800, bagian: [
        function (m) { m.gosub(2100); },
        function (m) { m.kembali(); }
      ] },
    /* 3820 `GOSUB 2540` mendarat di TENGAH subrutin kehabisan bahan bakar —
       melewati baris 2500-2520 yang menghitung sisa jaraknya. */
    { baris: 3820, bagian: [
        function (m) {
          m.cetak('     You ran out of gas while waiting'); m.barisBaru();
          m.v.T = 0;
        },
        function (m) { m.gosub(2540); }
      ] },
    { baris: 3830, jalan: function (m) { m.kembali(); } },
    /* --- kejadian 7: pendingin trailer rusak (jeruk saja) --- */
    { baris: 3860, jalan: function (m) { if (m.v.CT > 1) m.kembali(); } },
    { baris: 3870, jalan: function (m) {
        if (m.acak() < m.v.ZH - Math.trunc(m.v.ZH)) m.kembali();
      } },
    cet(3880, 'The trailer refrigeration unit has failed endangering the cargo.'),
    cet(3890, '     Repairs take 2 hours and cost $100.00.'),
    { baris: 3900, jalan: function (m) {
        set(m, 'CX', m.v.CX + Math.trunc(m.acak() * 5));
        set(m, 'HR', m.v.HR + 2); set(m, 'HL', m.v.HL + 2);
        m.v.XC = m.v.XC + 100;
      } },
    { baris: 3910, bagian: [
        function (m) { m.gosub(2100); },
        function (m) { m.v.TIMEOUT = 2; },
        function (m) { m.gosub(59950); }
      ] },
    { baris: 3920, jalan: function (m) { m.kembali(); } },

    /* --- 4000-4170: kecelakaan ------------------------------------------- */
    { baris: 4000, jalan: function () { /* PLAY: derit rem */ } },
    { baris: 4020, jalan: function (m) { m.untuk('I', 1, 6, 1, 4060); } },
    { baris: 4030, jalan: function (m) {
        m.cls();
        for (m.v.J = 1; m.v.J <= 100; m.v.J++) { /* jeda */ }
      } },
    { baris: 4040, jalan: function (m) {
        m.locate(12, 34); m.cetak('C R A S H !!'); m.barisBaru();
      } },
    { baris: 4050, bagian: [
        function (m) { for (m.v.J = 1; m.v.J <= 100; m.v.J++) { } },
        function (m) { m.lanjutkan('I'); }
      ] },
    { baris: 4060, jalan: function (m) { m.barisBaru(); } },
    /* 4070-4120 SEBABNYA DIREKONSTRUKSI dari keadaan waktu tabrakan: kalau
       pengemudinya kelelahan, ia ketiduran; kalau cuacanya badai, ia keluar
       jalur; kalau tidak ada yang bisa disalahkan, seorang pemabuk
       menabraknya. Urutan pemeriksaannya yang menentukan ceritanya. */
    { baris: 4070, jalan: function (m) {
        if (m.v.CD === 100 || (m.v.CD === 25 && m.v.SP < 65)) {
          m.cetak('You fell asleep at the wheel.'); m.barisBaru();
          m.lompat(4130);
        }
      } },
    sebab(4080, function (m) { return m.v.CR === 50; },
      'You drove off the road into a snow filled ditch.'),
    sebab(4090, function (m) { return m.v.CR === 10; },
      'You rear-ended a pick-up with no tail lights.'),
    sebab(4100, function (m) { return m.v.SP > 65; }, '        Speed kills !'),
    { baris: 4110, jalan: function (m) {
        if (m.v.CR > 2) {
          m.cetak('You hit a slick spot'); m.barisBaru();
          m.cetak('  and skidded off the road.'); m.barisBaru();
          m.lompat(4130);
        }
      } },
    { baris: 4120, jalan: function (m) {
        m.cetak('A drunk driver rammed your rig.'); m.barisBaru();
        m.cetak('        Tough luck !'); m.barisBaru();
      } },
    { baris: 4130, bagian: [
        function (m) { m.barisBaru(); m.v.TIMEOUT = 2; },
        function (m) { m.gosub(59950); }
      ] },
    { baris: 4140, jalan: function (m) {
        m.cetak('You lose your truck & profits.'); m.barisBaru(); m.barisBaru();
      } },
    { baris: 4150, jalan: function (m) {
        m.barisBaru();
        m.cetak('Do you want to start over (Y or N)?');
      } },
    tombol(4155, 'nyNY', 4155),
    /* 4160 `RUN "b:???0??"` — NAMA BERKAS BERISI KARTU LIAR. `RUN` tidak
       menerimanya; yang terjadi galat "Bad file name". Ini nama sementara
       yang tidak pernah diisi, dan ia muncul DUA KALI (di sini dan 5460). */
    { baris: 4160, jalan: function (m) {
        if (m.v['IKEY$'] === 'n' || m.v['IKEY$'] === 'N') {
          m.galat(64, 'Bad file name: b:???0??');
        }
      } },
    { baris: 4170, jalan: function (m) {
        m.v.XP = 0; set(m, 'NT', 0); m.cls(); m.lompat(1000);
      } },

    /* --- 5000-5530: sampai di New York ----------------------------------- */
    { baris: 5000, jalan: function (m) { m.untuk('I', 1, 5, 1, 5050); } },
    { baris: 5020, jalan: function (m) {
        m.cls();
        for (m.v.J = 1; m.v.J <= 60; m.v.J++) { /* jeda */ }
      } },
    { baris: 5030, jalan: function (m) {
        m.locate(12, 37); m.cetak('WELCOME'); m.barisBaru();
        m.locate(13, 40); m.cetak('TO'); m.barisBaru();
        m.locate(14, 36); m.cetak('NEW YORK'); m.barisBaru();
      } },
    { baris: 5040, bagian: [
        function (m) { for (m.v.J = 1; m.v.J <= 60; m.v.J++) { } },
        function (m) { m.lanjutkan('I'); }
      ] },
    { baris: 5050, bagian: [
        function (m) { m.v.TIMEOUT = 1; },
        function (m) { m.gosub(59950); },
        function (m) { m.cls(); }
      ] },
    { baris: 5100, bagian: [
        function (m) { m.gosub(2100); },
        function (m) { m.locate(5, 1); }
      ] },
    /* 5110 `T=HR-INT(HR/24)` — YANG DIMAKSUD sisa bagi 24, tapi yang
       ditulis pengurangan biasa. Untuk HR=95, hasilnya 95-3 = 92, bukan 23.
       Jadi gudangnya nyaris selalu dianggap tutup. */
    { baris: 5110, jalan: function (m) {
        m.v.T = m.v.HR - Math.trunc(m.v.HR / 24);
        if (m.v.T < 10 || m.v.T > 21) m.lompat(5140);
      } },
    cet(5120, 'The warehouse is closed for the night.  Come back tomorrow.'),
    { baris: 5130, bagian: [
        function (m) {
          m.v.T = 24 - m.v.T; set(m, 'HR', m.v.HR + m.v.T); m.v.TIMEOUT = 2;
        },
        function (m) { m.gosub(59950); },
        function (m) { m.gosub(2100); }
      ] },
    { baris: 5140, jalan: function (m) {
        m.barisBaru();
        m.v.T = Math.trunc(m.v.HR / 24);
        m.v.T1 = m.v.HR - 24 * m.v.T;
      } },
    { baris: 5150, jalan: function (m) {
        m.cetak('You completed the trip in' + basic(m.v.T) + 'days');
      } },
    { baris: 5160, jalan: function (m) {
        if (m.v.T1 > 1) m.cetak(' &' + basic(m.v.T1) + 'hours.');
        else m.cetak('.');
        m.barisBaru();
      } },
    { baris: 5170, jalan: function (m) {
        m.cetak('     Trip expenses totaled ' + uang(m.v.XC)); m.barisBaru();
      } },
    { baris: 5180, jalan: function (m) {
        m.v.T1 = 85 * m.v.T + 85;
        m.cetak('     Truck payment, insurance and taxes cost ' +
                uang(m.v.T1, 0));
        m.barisBaru();
      } },
    { baris: 5190, jalan: function (m) {
        m.v.XC = m.v.XC + m.v.T1; m.barisBaru();
      } },
    { baris: 5200, jalan: function (m) {
        var ke = [5220, 5310, 5360][m.v.CT - 1];
        if (ke) m.lompat(ke);
      } },
    { baris: 5220, jalan: function (m) {
        m.v.T1 = (m.v.T - 4) * Math.trunc(m.acak() * 3);
        if (m.v.T1 > 0) set(m, 'CX', m.v.CX + m.v.T1);
      } },
    { baris: 5230, jalan: function (m) {
        if (m.v.CX > 6) {
          m.cetak('Your oranges have spoiled.  Haul them to the dump!');
          m.barisBaru(); m.v.XT = -50; m.lompat(5400);
        }
      } },
    cet(5240, 'Collect six-and-a-half cents per pound for good oranges.'),
    /* 5250 `0.06500001` — bukan 0,065. Presisi tunggal menyimpan 0,065
       sedikit KURANG dari nilai sebenarnya; tambahan sepersepuluh juta itu
       memaksanya membulat ke atas. */
    { baris: 5250, jalan: function (m) {
        m.v.XT = 0.06500001 * m.v.WL;
        m.cetak('     Total for the load: ' + uang(m.v.XT)); m.barisBaru();
      } },
    { baris: 5260, jalan: function (m) { if (m.v.CX < 1) m.lompat(5400); } },
    { baris: 5270, jalan: function (m) {
        m.cetak('     Part of the load is damaged.  Subtract ' +
                (5 * m.v.CX) + '%.');
        m.barisBaru();
      } },
    { baris: 5280, jalan: function (m) {
        m.v.XT = m.v.XT - m.v.XT * m.v.CX / 20;
        m.cetak('     Net payment is ' + uang(m.v.XT) + '.'); m.barisBaru();
      } },
    { baris: 5290, jalan: function (m) { m.lompat(5400); } },
    { baris: 5310, jalan: function (m) {
        m.v.XT = 0.05 * m.v.WL;
        m.cetak('Collect five cents a pound for freight.'); m.barisBaru();
      } },
    { baris: 5320, jalan: function (m) {
        m.cetak('     Total for load = ' + uang(m.v.XT)); m.barisBaru();
      } },
    { baris: 5330, jalan: function (m) { if (m.v.HR < 95) m.lompat(5400); } },
    /* 5340 DENDA TERLAMBAT YANG TIDAK PERNAH DIPUNGUT: `CX=2` disetel, lalu
       langsung melompat ke 5400 — dan tidak ada satu baris pun di jalur
       muatan freight yang membaca `CX` lagi. Ancaman sepuluh persen di
       baris 1050 tidak pernah terjadi. */
    { baris: 5340, jalan: function (m) {
        set(m, 'CX', 2);
        m.cetak("     You're late!!  Subtract ten percent penalty.");
        m.barisBaru(); m.lompat(5400);
      } },
    { baris: 5360, jalan: function (m) {
        m.cetak('Postmaster pays 4.75 cents per pound on delivery.');
        m.barisBaru();
        m.v.XT = 0.0475 * m.v.WL; set(m, 'CX', 0); m.lompat(5400);
      } },
    { baris: 5400, jalan: function (m) {
        m.barisBaru();
        m.v.XT = m.v.XT - m.v.XC;
        m.v.XP = (m.v.XP || 0) + m.v.XT;
        if (m.v.XT < 0) m.lompat(5470);
      } },
    { baris: 5410, jalan: function (m) {
        m.cetak('Your net profit this trip was ' + uang(m.v.XT)); m.barisBaru();
      } },
    { baris: 5420, jalan: function (m) {
        if (m.v.XT > 100) {
          m.cetak('     G O O D   W O R K  !!'); m.barisBaru();
        }
      } },
    { baris: 5430, jalan: function (m) {
        if (m.v.XN > 1) {
          m.cetak('     Your average profit has been ' + uang(m.v.XP / m.v.XN));
          m.barisBaru();
        }
      } },
    { baris: 5440, jalan: function (m) {
        if (m.v.XT < 200 || m.v.XP / m.v.XN < 250) {
          m.cetak("     You'd make more money washing dishes !"); m.barisBaru();
        }
      } },
    { baris: 5450, jalan: function (m) {
        m.barisBaru(); m.barisBaru();
        m.cetak('Do you want to make another trip (Y or N)? ');
      } },
    tombol(5455, 'nyNY', 5455, function (m) { m.cetak(m.v['IKEY$']); }),
    { baris: 5460, jalan: function (m) {
        if (m.v['IKEY$'] === 'n' || m.v['IKEY$'] === 'N') {
          m.cls(); m.galat(64, 'Bad file name: b:???0??');
        } else m.lompat(1000);
      } },
    { baris: 5470, jalan: function (m) {
        m.cetak('Bad trip. . . You lost ' + uang(Math.abs(m.v.XT)));
        m.barisBaru();
      } },
    { baris: 5480, jalan: function (m) { if (m.v.XP >= 0) m.lompat(5430); } },
    cet(5490, '     You are bankrupt !!!'),
    { baris: 5500, bagian: [
        function (m) { m.v.TIMEOUT = 4; },
        function (m) { m.gosub(59950); }
      ] },
    { baris: 5520, jalan: function (m) {
        m.barisBaru();
        m.cetak('Your rig has been repossessed.'); m.barisBaru();
      } },
    { baris: 5530, bagian: [
        function (m) { m.barisBaru(); m.v.TIMEOUT = 5; },
        function (m) { m.gosub(59950); },
        function (m) { m.jalankan('MENU'); }
      ] },

    /* --- 59950-59990: jeda dan pembaca tombol ---------------------------- */
    /* 59950-59970 JAM DIKALI 120, BUKAN 3600. Selisih dua saat di dalam menit
       yang sama tetap benar, dan menyeberang menit pun masih benar. Tapi
       menyeberang JAM membuat `TIME3-TIME2` melompat turun 3420, dan
       gelungnya baru berhenti hampir satu jam kemudian.
       Penelusur menghabiskan jedanya seketika, jadi cacat ini cuma terbaca
       di sumbernya. */
    { baris: 59950, jalan: function (m) {
        m.v.TIME2 = 10 * 120 + 43 * 60 + 7;
      } },
    { baris: 59960, jalan: function (m) {
        m.v.TIME3 = m.v.TIME2 + m.v.TIMEOUT;
      } },
    { baris: 59970, jalan: function (m) {
        if (m.v.TIMEOUT > m.v.TIME3 - m.v.TIME2) m.lompat(59960);
        else m.kembali();
      } },
    { baris: 59990, jalan: function (m) {
        m.v['IKEY$'] = m.inkey();
        if (m.v['IKEY$'] === '') m.lompat(59990); else m.kembali();
      } }
  ];

  function pilihan(n, angka, teks) {
    return { baris: n, jalan: function (m) {
      if (n === 1040) m.barisBaru();
      m.tab(5); m.cetak(angka); m.cetak(teks); m.barisBaru();
    } };
  }
  function cuaca(n, ambang, arah, ke) {
    return { baris: n, jalan: function (m) {
      if (arah === '<') {
        if (m.v.AF < ambang && m.v.CR !== 50) m.lompat(ke);
      } else if (m.v.AF > ambang) m.lompat(ke);
    } };
  }
  function langit(n, kode, teks) {
    return { baris: n, jalan: function (m) {
      set(m, 'CR', kode); m.v['CR$'] = teks; m.kembali();
    } };
  }
  function sebab(n, uji, teks) {
    return { baris: n, jalan: function (m) {
      if (uji(m)) { m.cetak(teks); m.barisBaru(); m.lompat(4130); }
    } };
  }

  /* --- 9030-9700: DATA ketiga rute -------------------------------------
     Tiap rute diawali satu baris `DATA <jumlah tonggak>,<jarak total>`, lalu
     satu baris per tonggak. Nomor barisnya naik sepuluh-sepuluh.

     Barisnya sendiri TIDAK MELAKUKAN APA-APA saat dijalankan, dan itu memang
     benar: BASIC mengumpulkan seluruh DATA saat program DIMUAT, bukan saat
     barisnya dilewati. Itu sebabnya baris 1150 di awal program bisa membaca
     DATA yang tertulis di baris 9030 — delapan ribu nomor baris di bawahnya. */
  var DATA = [];
  (function () {
    var awalKepala = [9030, 9250, 9450];
    RUTE.forEach(function (rute, rt) {
      var n = awalKepala[rt];
      DATA.push(rute[1].length, rute[0]);
      tabel.push(rem(n));
      rute[1].forEach(function (baris, i) {
        DATA.push(baris[0], baris[1], baris[2], baris[3]);
        tabel.push(rem(n + 10 * (i + 1)));
      });
    });
    tabel.sort(function (a, b) { return a.baris - b.baris; });
  })();

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['TRUCKER'] = {
    nama: 'TRUCKER',
    judul: 'Trucker (Hughes Glantzberg) — Los Angeles ke New York',
    sumber: 'TRUCKER',
    berkas: 'run/TRUCKER.BAS',
    tabel: tabel,
    data: DATA,
    benih: 83,

    arsitektur: {
      judul: 'Alur TRUCKER.BAS',
      simpul: [
        { id: 'logo', baris: '20-155', jenis: 'mulai',
          teks: ['Logo "TRUCKER" dari', 'potongan garis kotak'] },
        { id: 'muat', baris: '1000-1200', jenis: 'putusan',
          teks: ['Jeruk, freight, atau pos;', 'berapa pon'] },
        { id: 'siap', baris: '1220-1375', jenis: 'putusan',
          teks: ['Ban, lalu rute utara,', 'tengah, atau selatan'] },
        { id: 'ruas', baris: '1400-1670',
          teks: ['Pilih kecepatan;', 'peluang celaka = laju² x lelah x cuaca'] },
        { id: 'tonggak', baris: '3100-3920', jenis: 'subrutin',
          teks: ['Satu angka memilih kejadian', 'DAN besarnya sekaligus'] },
        { id: 'warung', baris: '1700-2020', jenis: 'subrutin',
          teks: ['Solar, ban, tidur;', 'tidur siang cuma setengah'] },
        { id: 'celaka', baris: '4000-4170', jenis: 'galat',
          teks: ['Sebabnya direkonstruksi', 'dari keadaan saat itu'] },
        { id: 'tiba', baris: '5000-5530', jenis: 'keluar',
          teks: ['Bayaran per pon,', 'dikurangi seluruh biaya'] }
      ],
      panah: [
        { dari: 'logo', ke: 'muat' },
        { dari: 'muat', ke: 'siap' },
        { dari: 'siap', ke: 'ruas' },
        { dari: 'ruas', ke: 'tonggak', label: 'lewat tonggak' },
        { dari: 'tonggak', ke: 'ruas' },
        { dari: 'ruas', ke: 'warung', label: 'tiap 4 ruas' },
        { dari: 'warung', ke: 'ruas' },
        { dari: 'ruas', ke: 'celaka', label: 'undian kalah', jenis: 'galat' },
        { dari: 'ruas', ke: 'tiba', label: 'jarak tercapai' },
        { dari: 'tiba', ke: 'muat', label: 'perjalanan berikutnya' }
      ]
    },

    pseudokode: [
      { baris: 3130, tingkat: 0, teks: '<code>ON INT(ZH) GOSUB</code> &mdash; <b>bagian bulat</b> memilih kejadian&hellip;' },
      { baris: 3310, tingkat: 1, teks: '&hellip;dan <b>bagian pecahan</b> jadi jumlah dolar tol&hellip;' },
      { baris: 3360, tingkat: 1, teks: '&hellip;atau <b>peluang</b> kejadiannya terjadi. Arti yang berbeda, angka yang sama' },
      { baris: 1400, tingkat: 0, teks: 'peluang celaka = <code>laju&sup2; &times; lelah &times; cuaca</code> &mdash; tiga hal berkali' },
      { baris: 1480, tingkat: 0, teks: 'irit bahan bakar berbentuk <b>bukit</b> dengan puncak tepat di 55 mil/jam' },
      { baris: 1560, tingkat: 0, teks: 'penunjuk bensin sengaja <b>meleset acak</b> &minus;4 sampai +5 galon' },
      { baris: 3020, tingkat: 0, teks: '<code>COS(HR/HS) &lt; 2.3</code> &mdash; <b>selalu benar</b>; kosinus tak pernah lebih dari 1' },
      { baris: 2660, tingkat: 0, teks: '<code>HL=HR+T+1</code> &mdash; salah huruf: ban pecah membuat pengemudi <b>lelah selamanya</b>' },
      { baris: 1850, tingkat: 0, teks: '<code>STOP</code> &mdash; cabang beli ban di warung <b>menghentikan program</b>' },
      { baris: 3670, tingkat: 0, teks: 'jalan memutar Louisiana <b>menulis ulang tabel rute</b> di tengah perjalanan' }
    ],

    perintahAsli: 'run\\TRUCKER.bat',
    catatanAsli: 'Muatan 1-3, lalu berat, ban, dan rute. Sesudah itu tinggal ' +
      'memilih kecepatan tiap ruas. Batas 55 paling irit; ngebut menaikkan ' +
      'peluang celaka secara kuadrat.',

    penyimpangan: [
      '<b><code>PLAY</code> diam.</b>',

      '<b>Subrutin jeda 59950-59970 habis seketika</b>, tapi ketiga barisnya ' +
      'tetap ditelusuri &mdash; rumusnya sendiri cacat, dan itu bagian dari ' +
      'yang ingin diperlihatkan halaman ini.',

      '<b><code>RANDOMIZE</code> memasang benih tetap</b>; baris 160 tetap ' +
      'dijalankan supaya terlihat bahwa benihnya dibangun dari jam sistem ' +
      'dengan rumus yang sama cacatnya.',

      '<b><code>RUN "b:???0??"</code> dibangkitkan sebagai galat 64 (Bad file ' +
      'name).</b> Itu memang yang terjadi di GW-BASIC: <code>RUN</code> tidak ' +
      'menerima kartu liar di nama berkas.',

      '<b><code>DEFINT C-S</code> ditiru</b>: penugasan ke variabel yang ' +
      'namanya dimulai C sampai S dibulatkan, bukan dipotong. Yang paling ' +
      'terasa di <code>HL=HL/2</code> (baris 1990).',

      '<b>DATA tiga rute ditulis sebagai larik JavaScript</b> alih-alih ' +
      'dibaca lewat <code>READ</code>, karena baris 1150 dan 1170 memakai ' +
      '<code>NEXT I,RT</code> bersarang yang tidak bisa dipecah per baris ' +
      'tanpa mengubah alurnya. Isinya sama persis, tujuh puluh tiga tonggak.',

      '<b>Baris 140 dan 150 sudah disunting pemilik koleksi</b> (alamat ' +
      'rumah penulis).'
    ],

    pelajaran: {
      ringkas: 'Satu bilangan pecahan menyimpan jenis kejadian DAN besarnya ' +
        'sekaligus &mdash; dan dua syarat memakai kosinus yang tidak pernah ' +
        'bisa salah.',
      pelajari: [
        ['Satu angka, dua muatan',
         'Tiap tonggak jalan punya satu bilangan: <code>7.80</code>, ' +
         '<code>2.65</code>, <code>3.65</code>. Baris 3130 memakai ' +
         '<b>bagian bulatnya</b> untuk memilih subrutin lewat ' +
         '<code>ON INT(ZH) GOSUB</code>, dan tiap subrutin memakai ' +
         '<b>bagian pecahannya</b> sebagai argumen.',
         'Yang membuatnya menarik: <b>artinya berbeda-beda</b>. Di gerbang ' +
         'tol (3310), pecahannya jumlah dolar. Di konstruksi jalan (3360), ' +
         'radar (3410), dan longsor (3710), ia peluang. Angka yang sama ' +
         'bentuknya, ditafsirkan berbeda oleh yang menerimanya.',
         'Tujuh puluh tiga tonggak jalan, tiga rute, tujuh jenis kejadian ' +
         '&mdash; semuanya muat dalam satu kolom DATA.'],
        ['Peluang celaka yang mengalikan tiga hal',
         '<code>AF = SP^2 * CD * CR</code>. Kecepatan <b>dikuadratkan</b>, ' +
         'lalu dikali angka keadaan pengemudi (1 sampai 100) dan angka cuaca ' +
         '(1 sampai 50).',
         'Ngebut saat sehat di cuaca cerah: 80&sup2;&times;1&times;1 = 6.400 ' +
         'dari sepuluh juta. Ngebut saat kelelahan di badai: ' +
         '80&sup2;&times;100&times;50 = 32 juta &mdash; lebih dari sepuluh ' +
         'juta, jadi <b>pasti celaka</b>. Tiga faktor, satu perkalian, dan ' +
         'seluruh sistem risikonya jadi.'],
        ['Irit bahan bakar berbentuk bukit',
         'Baris 1480-1490: <code>T = ABS(55-SP)</code>, lalu ' +
         '<code>T1 = SP/(4.5-0.2*T)</code>. Selisih dari 55 &mdash; ke arah ' +
         'mana pun &mdash; memperkecil penyebutnya, jadi konsumsinya naik. ' +
         'Puncaknya tepat di 55 mil/jam, batas kecepatan nasional Amerika ' +
         'saat itu.',
         'Dan <code>IF T&gt;12 THEN T=12.5</code> mematok selisihnya, supaya ' +
         'penyebutnya tidak pernah nol atau negatif.'],
        ['Penunjuk bensin yang sengaja meleset',
         'Baris 1560 menampilkan <code>INT(WF-4+RND*10)</code> &mdash; nilai ' +
         'sebenarnya digeser acak &minus;4 sampai +5 galon. Pemainnya tidak ' +
         'pernah tahu persis berapa sisanya, dan harus mengisi lebih awal ' +
         'daripada yang tampak perlu.',
         'Ketidakpastian sebagai mekanik permainan, dibangun dari satu ' +
         '<code>RND</code> di baris tampilan.'],
        ['Peta yang bisa berubah di tengah jalan',
         'Baris 3660-3680: kalau truknya ditolak masuk Louisiana, nama ' +
         'jalannya diganti jadi "Arkansas county roads", <b>semua tonggak ' +
         'sesudah yang ke-12 digeser 200 mil</b>, dan jarak totalnya ikut ' +
         'ditambah.',
         'Tabel rutenya bukan data tetap yang dibaca sekali. Ia keadaan yang ' +
         'bisa ditulisi &mdash; dan satu kejadian di tengah perjalanan ' +
         'mengubah sisa peta yang akan dilalui.'],
        ['Sebab kecelakaan yang direkonstruksi',
         'Baris 4070-4120 tidak menyimpan kenapa truknya celaka. Ia ' +
         '<b>menyimpulkannya</b> sesudahnya, dari keadaan yang masih ada di ' +
         'variabel: kalau <code>CD=100</code> pengemudinya ketiduran, kalau ' +
         '<code>CR=50</code> ia keluar jalur di salju, kalau ' +
         '<code>SP&gt;65</code> "Speed kills", dan kalau tidak ada yang bisa ' +
         'disalahkan &mdash; seorang pemabuk menabraknya.',
         'Urutan pemeriksaannya yang menentukan ceritanya, dan tidak ada satu ' +
         'variabel pun yang perlu disimpan untuk itu.']
      ],
      hindari: [
        ['Dua syarat yang tidak pernah salah',
         'Baris 3020: <code>IF HL&lt;4 AND COS(HR/HS)&lt;2.3 THEN&hellip;</code>, dan ' +
         'baris 3030 dengan <code>&lt;2.5</code>.',
         '<b>Kosinus selalu di antara &minus;1 dan 1.</b> Kedua perbandingan ' +
         'itu selalu benar, apa pun isinya. Yang sebenarnya menentukan keadaan ' +
         'pengemudi cuma <code>HL</code> &mdash; jam sejak tidur terakhir.',
         'Dua baris yang ditulis seolah menimbang dua hal, dan menimbang satu. ' +
         'Kemungkinan besar penulisnya bermaksud memakai fungsi lain, atau ' +
         'membandingkan dengan angka yang jauh lebih kecil.'],
        ['Satu huruf yang membuat permainan tak bisa dimenangkan',
         'Baris 2660: <code>HL=HR+T+1</code>. Yang dimaksud ' +
         '<code>HL=HL+T+1</code>.',
         '<code>HL</code> adalah jam sejak tidur terakhir; <code>HR</code> jam ' +
         'sejak berangkat. Sesudah <b>satu</b> ban pecah, <code>HL</code> ' +
         'melompat jadi total jam perjalanan &mdash; puluhan &mdash; dan baris ' +
         '3010 (<code>IF HL&gt;19</code>) langsung menyatakan pengemudinya ' +
         'kelelahan.',
         'Tidur menyetelnya kembali ke nol, tapi ban pecah berikutnya ' +
         'mengulanginya. Dan <code>CD=100</code> mengalikan peluang celaka ' +
         'seratus kali lipat. <b>Satu huruf yang salah, dan sisa perjalanannya ' +
         'hampir pasti berakhir di parit.</b>'],
        ['STOP di tengah permainan',
         'Baris 1850 berisi satu perintah: <code>STOP</code>. Ia dicapai kalau ' +
         'pemain menjawab "Y" pada tawaran membeli ban di warung truk &mdash; ' +
         'tawaran yang muncul begitu ban cadangannya sudah terpakai.',
         'Fitur yang tidak pernah selesai ditulis, ditinggal sebagai penanda, ' +
         'dan penandanya <b>menghentikan program</b>.'],
        ['Tiga variabel yang ditulis lalu dilupakan',
         '<code>ZC</code> (baris 2550) menampung $200 biaya pengiriman solar ' +
         'darurat &mdash; tapi seluruh pembukuan memakai <code>XC</code>. ' +
         'Dendanya tidak pernah ditagih.',
         '<code>TIMEPUT</code> (baris 2740) salah ketik untuk ' +
         '<code>TIMEOUT</code>; jedanya memakai nilai lama.',
         '<code>DH$</code> (baris 2170) salah ketik untuk <code>DM$</code>; ' +
         'tengah malam tercetak "12 AM", bukan "Midnight".',
         'BASIC tidak pernah mengeluh soal variabel yang tidak dikenal. Ia ' +
         'membuatnya, mengisinya dengan nol atau string kosong, dan diam.'],
        ['Denda terlambat yang tidak pernah dipungut',
         'Baris 1050 menjanjikan <i>"penalty for late delivery"</i>. Baris ' +
         '5340 menyetel <code>CX=2</code> dan mencetak "Subtract ten percent ' +
         'penalty" &mdash; lalu melompat ke 5400.',
         'Dan tidak ada satu baris pun di jalur muatan freight yang membaca ' +
         '<code>CX</code> sesudah itu. Potongan sepuluh persennya ' +
         '<b>diumumkan tapi tidak pernah dikurangkan</b>.'],
        ['Sisa bagi yang ditulis sebagai pengurangan',
         'Baris 5110: <code>T=HR-INT(HR/24)</code>. Yang dimaksud jelas jam ' +
         'berapa sekarang &mdash; <code>HR-24*INT(HR/24)</code>, seperti yang ' +
         'ditulis benar di baris 1950 dan 5140.',
         'Untuk <code>HR=95</code>, yang benar 23; yang dihitung 92. Jadi ' +
         'syarat "gudang tutup" (<code>T&lt;10 OR T&gt;21</code>) hampir ' +
         'selalu benar, dan pengemudinya nyaris selalu disuruh menunggu ' +
         'sampai besok.'],
        ['Jam dikali seratus dua puluh',
         'Baris 59950: <code>VAL(LEFT$(TIME$,2))*120 + VAL(MID$(TIME$,4,2))*60 ' +
         '+ VAL(RIGHT$(TIME$,2))</code>. Menit dikali 60 &mdash; benar. Jam ' +
         'dikali <b>120</b>, bukan 3600.',
         'Selama jedanya tidak menyeberang pergantian jam, selisihnya masih ' +
         'benar. Tapi begitu menyeberang, <code>TIME3-TIME2</code> melompat ' +
         'turun 3.420, dan gelungnya baru berhenti <b>hampir satu jam ' +
         'kemudian</b>. Program yang tampak menggantung, sekali sejam, tanpa ' +
         'pola yang bisa ditebak siapa pun.'],
        ['Cabang untuk kode yang tidak ada',
         'Baris 3140: <code>IF INT(ZH)=8 THEN 5000</code>. Kode kejadian ' +
         'terbesar di seluruh tabel adalah 7,9. <b>Delapan tidak pernah ' +
         'muncul</b>, dan cabang ini tidak pernah diambil. Kedatangan di New ' +
         'York diurus baris 1520.'],
        ['Satu tempat di negara bagian yang salah',
         'DATA baris 9060: <code>440,Flagstaff,I-40 in California</code>. ' +
         'Jalan yang ditulis di tiap baris adalah jalan yang dilalui ' +
         '<b>menuju</b> tonggak itu &mdash; dan antara Needles dan Flagstaff, ' +
         'truknya sudah di Arizona. Baris berikutnya (Gallup, "I-40 in ' +
         'Arizona") memakai aturan yang benar.',
         'Juga: <code>Indianna</code> dua kali, <code>Demoines</code> untuk ' +
         'Des Moines, dan <code>New Lersey border</code> &mdash; L di tempat J.']
      ]
    },

    penjelasan: [
      { judul: 'Tujuh puluh tiga tonggak dalam satu kolom angka',
        isi: [
          'Perjalanan Los Angeles&ndash;New York di program ini dibagi jadi ' +
          'tonggak-tonggak: Barstow, Needles, Flagstaff, sampai Holland ' +
          'Tunnel. Tiap tonggak punya empat hal di DATA: jarak, nama tempat, ' +
          'nama jalan, dan <b>satu bilangan pecahan</b>.',
          '<code>9040 DATA 90,Barstow,I-15 in California,7.80</code>',
          'Bilangan terakhir itu yang menarik.',
          '<code>3130 ON INT(ZH) GOSUB 3210,3310,3360,3410,3500,3710,3860</code>',
          'Bagian <b>bulatnya</b> &mdash; 7 &mdash; memilih subrutin ketujuh: ' +
          'longsor batu di Terowongan Alleghany. Dan bagian ' +
          '<b>pecahannya</b> &mdash; 0,80 &mdash; jadi argumennya:',
          '<code>3710 IF RND &lt; ZH-INT(ZH) THEN RETURN</code>',
          'Delapan puluh persen kemungkinan tidak terjadi apa-apa.',
          'Yang membuat rancangan ini lebih dari sekadar hemat: <b>arti ' +
          'pecahannya berbeda-beda</b>. Di gerbang tol:',
          '<code>3310 T = 100*(ZH-INT(ZH))</code>',
          '<code>2.65</code> berarti kejadian kedua &mdash; gerbang tol ' +
          '&mdash; sebesar <b>$65</b>. Bukan peluang; jumlah uang.',
          'Jadi satu kolom angka membawa: <i>kejadian apa</i>, dan <i>seberapa ' +
          'besar atau seberapa mungkin</i>. Yang menafsirkannya adalah ' +
          'subrutin yang dipilih oleh angka itu sendiri.',
          'Harganya juga jelas. Tidak ada satu pun <code>REM</code> di berkas ' +
          'ini yang menjelaskan arti kolom itu. Siapa pun yang membuka ' +
          'TRUCKER.BAS hari ini melihat <code>7.80</code> dan tidak punya cara ' +
          'tahu artinya, kecuali membaca baris 3130 lebih dulu, lalu ketujuh ' +
          'subrutinnya satu per satu.'
        ] },
      { judul: 'Kosinus yang tidak pernah lebih dari satu',
        isi: [
          'Keadaan pengemudi ditentukan enam baris berurutan, dari segar ' +
          'sampai kelelahan:',
          '<code>3020 IF HL&lt;4 AND COS(HR/HS)&lt;2.3 THEN CD=1:CD$="rested &amp; rearing to go."</code><br>' +
          '<code>3030 IF HL&lt;8 AND COS(HR/HS)&lt;2.5 THEN CD=2:CD$="fine"</code>',
          'Bentuknya meyakinkan. Dua syarat: berapa lama sejak tidur, dan ' +
          'sesuatu tentang perbandingan jam jalan dengan jam tidur.',
          'Tapi <b>kosinus selalu di antara &minus;1 dan 1</b>. Tidak ada ' +
          'bilangan yang bisa dimasukkan ke <code>COS</code> yang membuat ' +
          'hasilnya melebihi 1, apalagi 2,3.',
          'Kedua syarat itu <b>selalu benar</b>. Yang sebenarnya menentukan ' +
          'cuma <code>HL</code>.',
          'Apa yang mungkin dimaksudkan? Baris 3010 di atasnya memakai ' +
          '<code>HR/HS&gt;4</code> tanpa kosinus, dan 3040-3050 memakai ' +
          '<code>HR/HS&lt;=3</code>. Jadi angka 2,3 dan 2,5 kemungkinan besar ' +
          'ambang untuk <code>HR/HS</code> itu sendiri &mdash; dan ' +
          '<code>COS(</code> masuk ke sana entah bagaimana.',
          'Akibatnya? Kecil, dan itulah yang menarik. Pengemudi yang jam ' +
          'tidurnya kurang tetap dinyatakan "fine" selama <code>HL&lt;8</code>. ' +
          'Permainannya jadi <b>sedikit lebih mudah</b> daripada yang ' +
          'dirancang, di satu arah, tanpa ada yang pernah merasakannya.',
          'Cacat yang tidak pernah menghasilkan galat, tidak pernah ' +
          'menghentikan apa pun, dan tidak pernah membuat siapa pun curiga ' +
          '&mdash; karena satu-satunya cara menemukannya adalah menyadari ' +
          'bahwa sebuah perbandingan tidak pernah bisa salah.'
        ] }
    ]
  };
})(window);
