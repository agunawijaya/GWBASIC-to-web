/* ===========================================================================
   DRAW.js — porting minimalis DRAW.BAS sebagai tabel baris.

   Program kelima belas, dan satu-satunya di koleksi ini yang BUKAN permainan:
   ini penyunting gambar layar penuh. Yang membuatnya layak dipelajari adalah
   gagasan di baris 2310-2320:

       HURUF BESAR = potongan garis "pembuka", huruf kecil = "penutup".

       A = CHR$(201) = tepi kiri-atas      a = CHR$(200) = tepi kiri-bawah
       B = CHR$(187) = tepi kanan-atas     b = CHR$(188) = tepi kanan-bawah
       C = CHR$(205) = garis mendatar      c = CHR$(186) = garis tegak

   Papan ketik disulap jadi papan gambar. Mengetik `ACCB` menghasilkan tepi
   atas sebuah kotak.

   ---------------------------------------------------------------------------
   DUA HAL YANG HARUS DIBACA SEBELUM PERCAYA PADA PENELUSURAN INI
   ---------------------------------------------------------------------------

   (1) `DRAW.EXE` TIDAK ADA di koleksi ini. Baris 50 memuatnya
       (`BLOAD "DRAW.EXE",0`) dan baris 400/2220 memanggil kode mesin di
       dalamnya. Karena `ON ERROR` baru dipasang di baris 70, GW-BASIC yang
       sungguhan BERHENTI di baris 50 dengan galat 53 — jadi `run\DRAW.bat`
       tidak akan jalan, satu-satunya program di koleksi yang begitu.

       Penelusur menggantikan kedua rutin itu dengan tafsiran, bukan dengan
       fakta. Tafsirannya: rutin di offset 0 MENYIMPAN layar, rutin di offset
       &H40 MENGEMBALIKANNYA. Dasarnya lima tempat pemanggilan — 400 (saat
       mulai), 2330 (sebelum CLS, sebelum menyimpan, sebelum memuat), dan 2200
       (F2, yang di menunya tertulis "Runs Previous Picture (memory)").
       Cocok di kelimanya, tapi TIDAK TERBUKTI, dan tidak bisa dibuktikan
       selama berkasnya hilang.

   (2) Uji disket di baris 85 dan 130 logikanya TERBALIK: menemukan `MENU.BAS`
       berarti GAGAL. Penjelasannya di bawah, di baris 86.

   Penyimpangan lain yang berlaku di seluruh berkas ini:

   - Disketnya ada di memori penelusur saja. Gambar yang disimpan hilang
     begitu halaman disegarkan.
   - `POKE`, `PEEK`, `DEF SEG` tidak punya makna di sini; yang ditiru cuma
     akibatnya (mis. `POKE 106,0` = buang tombol tertunda).
   - Gelung tunda habis seketika.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Alamat BSAVE gambar: mulai bita 480, sepanjang 3040 bita. Lihat catatan
     panjang di konsol.js — itu tepat baris 4 sampai 22. */
  var AWAL = 480, PANJANG = 3040;

  var tabel = [

    rem(1),
    /* 10 `DEF SEG:POKE 106,0` muncul lima kali di program ini, dan di sini
       ia ditulis sebagai TIDAK BERBUAT APA-APA. Alasannya dua, dan keduanya
       datang dari programnya sendiri:

       (1) Baris 430 melakukan poke yang sama DI DALAM gelung tunggu-tombol,
           tepat sebelum `INKEY$` di baris 440. Kalau poke itu membuang tombol
           yang tertunda, tak satu pun tombol akan pernah terbaca.
       (2) Baris 1321, 1370, dan 1780 memasangkan poke itu dengan gelung
           `IF INKEY$<>"" THEN <ulang>` — cara BAKU membuang ketikan
           mendahului. Gelung itu mubazir kalau poke-nya sudah membuang.

       Jadi offset 106 di segmen data GW-BASIC agaknya mencatat sisa
       PENJABARAN TOMBOL FUNGSI, bukan isi penyangga papan ketik BIOS — dan
       penelusur memang tidak meniru penjabaran tombol fungsi sama sekali.
       Tafsiran, bukan fakta. */
    { baris: 10, jalan: function (m) { m.warna(7, 0); m.cls(); } },
    /* 15 membersihkan bendera papan ketik kecuali bit 6 (CapsLock) — tidak
       ada padanannya di penelusur. */
    { baris: 15, jalan: function () { } },
    /* 20 FRE(0) = sisa memori bebas. Penelusur selalu punya cukup. */
    { baris: 20, jalan: function () { } },
    { baris: 30, jalan: function (m) {
        m.pasangJebakan(10, 10000); m.jebakan(10, true);
      } },
    { baris: 40, jalan: function () { } },
    /* 50 — di sinilah GW-BASIC yang sungguhan berhenti. Lihat kepala berkas. */
    { baris: 50, jalan: function (m) {
        m.v.SIMPANAN = null;      /* penampung "gambar sebelumnya" */
        m.v.DISKET = {};          /* nama .pic -> salinan baris 4..22 */
        m.v.KATALOG = [];         /* isi PICTURE.FLE, urut tulis */
      } },
    { baris: 60, jalan: function () { /* DEFSTR Z */ } },
    { baris: 70, jalan: function (m) { m.penangkapGalat = 1150; } },
    { baris: 80, jalan: function (m) { m.cls(); m.dim('NAMES$', 1); } },
    /* 85 FILES "menu.bas" — bukan untuk menampilkan daftar berkas, tapi
       untuk MENGUJI keberadaannya. Kalau berkasnya tidak ada, GW-BASIC
       melempar galat 53, dan baris 1170 menangkapnya. */
    { baris: 85, jalan: function (m) { m.locate(14, 35); ujiDisket(m); } },
    /* 86 Dan di sinilah logikanya terbalik: `F` bernilai 1 hanya kalau
       MENU.BAS TIDAK ketemu. Jadi "berkas tidak ada" = "lanjut ke penyunting",
       dan "berkas ada" = "salah disket".

       Sebabnya: MENU.BAS ada di disket PROGRAM. Yang diminta program ini
       adalah disket DATA — disket kosong tempat gambar bisa ditulis. Menemukan
       MENU.BAS artinya pemakainya masih memakai disket program, yang tidak
       boleh ditulisi. */
    { baris: 86, jalan: function (m) { if (m.v.F) m.lompat(200); } },
    pesan(90,  5, 22, 'You Must Use A Data  Diskette With This'),
    pesan(100, 6, 22, 'Program. Insert A Formatted Diskette In'),
    pesan(110, 7, 22, 'Drive A and  Strike Any Key To Continue'),
    { baris: 115, jalan: function (m) {
        m.locate(25, 25); m.warna(0, 7);
        m.cetak(' Strike <F10> To Return To Menu '); m.warna(7, 0);
      } },
    { baris: 120, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(120);
      } },
    { baris: 130, jalan: function (m) { m.locate(14, 35); ujiDisket(m); } },
    { baris: 140, jalan: function (m) { if (m.v.F) m.lompat(170); } },
    { baris: 150, jalan: function (m) {
        m.cls(); m.locate(5, 26); m.warna(31, 0);
        m.cetak('You MUST Use A Data Diskette'); m.warna(3, 0);
      } },
    { baris: 160, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 4000; m.v.A++) { /* jeda */ }
        m.cls(); m.lompat(90);
      } },
    { baris: 170, jalan: function () { } },
    /* 180-190 program ini MENYALIN DIRINYA SENDIRI ke disket data: kode
       mesinnya lewat BSAVE, lalu sumbernya sendiri lewat `SAVE "DRAW.BAS",P`.
       Sesudah itu disket data bisa dipakai sendirian. */
    { baris: 180, jalan: function () { } },
    { baris: 190, jalan: function () { } },
    trap(200, 1, 1950), trap(210, 2, 2190), trap(220, 3, 1930),
    trap(230, 4, 1940), trap(240, 5, 2150), trap(250, 6, 2780),
    trap(260, 7, 2180), trap(270, 8, 2180), trap(280, 9, 2180),
    trap(290, 10, 2690),
    { baris: 300, jalan: function () { } },
    /* 310 bita perlengkapan BIOS: bit 4-5 bernilai 11 berarti kartu monokrom.
       Penelusur selalu menjawab kartu warna. */
    { baris: 310, jalan: function (m) { m.v.SEGMENT = 0xB800; } },
    { baris: 320, jalan: function (m) { m.tutup(); m.tutup(); } },
    { baris: 330, jalan: function (m) { m.locate(null, null, 1); } },
    { baris: 340, jalan: function (m) { m.gosub(2280); } },
    { baris: 350, jalan: function (m) { m.warna(7, 0); } },
    { baris: 360, jalan: function (m) { m.gosub(830); } },
    { baris: 370, jalan: function (m) { m.gosub(720); } },
    { baris: 380, jalan: function () { } },
    { baris: 390, jalan: function (m) { m.v.CODE = 0; } },
    { baris: 400, jalan: function (m) { panggilKode(m); } },
    { baris: 410, jalan: function (m) {
        m.v.X = 12; m.v.Y = 40; m.locate(12, 40, 1);
      } },
    { baris: 420, jalan: function (m) {
        for (m.v.SS = 1; m.v.SS <= 10; m.v.SS++) m.jebakan(m.v.SS, true);
      } },
    { baris: 430, jalan: function () { /* POKE 106,0 — lihat catatan baris 10 */ } },
    { baris: 440, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(420);
      } },
    { baris: 450, jalan: function (m) {
        m.v.Z1 = m.v.Z.substr(1, 1);
        if (m.v.Z.length > 1) m.lompat(520);
      } },
    /* 460 modus alfanumerik: hurufnya dicetak apa adanya. */
    { baris: 460, bagian: [
        function (m) { if (m.v.FLAG) { m.cetak(m.v.Z); m.v.Y++; } },
        function (m) { if (m.v.FLAG) m.gosub(970); },
        function (m) { if (m.v.FLAG) m.lompat(420); }
      ] },
    { baris: 470, bagian: [
        function (m) { if (m.v.Z === ' ') { m.cetak(' '); m.v.Y++; } },
        function (m) { if (m.v.Z === ' ') m.gosub(970); },
        function (m) { if (m.v.Z === ' ') m.lompat(420); }
      ] },
    { baris: 480, jalan: function (m) {
        if (m.v.Z < 'A' || m.v.Z > 'Y') m.lompat(500);
      } },
    /* 490 huruf BESAR -> larik baris ke-1 (potongan "pembuka"). */
    { baris: 490, bagian: [
        function (m) {
          m.locate(m.v.X, m.v.Y);
          m.cetak(m.chr(m.v.ARRAY[1][m.v.Z.charCodeAt(0) - 64]));
          m.v.Y++;
        },
        function (m) { m.gosub(970); },
        function (m) { m.lompat(420); }
      ] },
    { baris: 500, jalan: function (m) {
        if (m.v.Z < 'a' || m.v.Z > 'y') m.lompat(520);
      } },
    /* 510 huruf kecil -> larik baris ke-0 (potongan "penutup"). */
    { baris: 510, bagian: [
        function (m) {
          m.locate(m.v.X, m.v.Y);
          m.cetak(m.chr(m.v.ARRAY[0][m.v.Z.charCodeAt(0) - 96]));
          m.v.Y++;
        },
        function (m) { m.gosub(970); },
        function (m) { m.lompat(420); }
      ] },
    /* 520-610 tombol panah dan kawan-kawannya, dibaca dari kode PINDAI. */
    gerak(520, 72, function (m) { m.v.X -= 1; }),   /* panah atas       */
    gerak(530, 75, function (m) { m.v.Y -= 1; }),   /* panah kiri       */
    gerak(540, 77, function (m) { m.v.Y += 1; }),   /* panah kanan      */
    gerak(550, 80, function (m) { m.v.X += 1; }),   /* panah bawah      */
    gerak(560, 115, function (m) { m.v.Y -= 10; }), /* Ctrl+kiri        */
    gerak(570, 116, function (m) { m.v.Y += 10; }), /* Ctrl+kanan       */
    gerak(580, 73, function (m) { m.v.X -= 5; }),   /* PgUp             */
    gerak(590, 81, function (m) { m.v.X += 5; }),   /* PgDn             */
    gerak(600, 71, function (m) { m.v.X = 1; m.v.Y = 1; }),  /* Home    */
    gerak(610, 79, function (m) { m.v.Y = 80; }),   /* End              */
    /* 620 Ctrl+Home: simpan layar dulu, baru bersihkan. */
    jikaKode(620, 119,
      function (m) { m.gosub(2330); },
      function (m) {
        m.cls(); m.locate(12, 40, 1);
        m.v.X = m.barisKursor(); m.v.Y = m.pos();
      },
      function (m) { m.gosub(830); },
      function (m) { m.gosub(720); }),
    jikaKode(630, 31,
      function (m) { m.gosub(1420); },
      function (m) { m.gosub(m.v.FLAG ? 790 : 720); }),
    jikaKode(640, 38,
      function (m) { m.gosub(1610); },
      function (m) { m.gosub(m.v.FLAG ? 790 : 720); }),
    jikaKode(650, 37, function (m) { m.gosub(2360); }),
    jikaKode(660, 33, function (m) { m.gosub(890); }),
    jikaKode(670, 46, function (m) { m.gosub(1020); }),
    jikaKode(680, 118, function (m) { m.gosub(790); }),
    jikaKode(690, 132, function (m) { m.gosub(720); }),
    { baris: 700, jalan: function (m) {
        if (m.v.Z === m.chr(8)) {
          m.cetak(m.chr(29) + ' ' + m.chr(29));
          m.v.Y -= 1;
        }
      } },
    { baris: 710, bagian: [
        function (m) { m.gosub(970); },
        function (m) { m.locate(m.v.X, m.v.Y, 1); },
        function (m) { m.lompat(420); }
      ] },

    /* --- 720-780: papan bantu di kaki layar --------------------------------
       Tiga baris: potongan huruf besar, hurufnya, potongan huruf kecil —
       tersusun tegak lurus supaya terbaca sebagai tabel terjemahan. */
    { baris: 720, jalan: function (m) {
        m.locate(23, 1); m.spc(79);
        m.locate(23, 1); m.cetak('UPPER' + m.chr(29));
      } },
    { baris: 730, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 25; m.v.A++) {
          m.locate(null, m.pos() + 2);
          m.cetak(m.chr(m.v.ARRAY[1][m.v.A]));
        }
      } },
    { baris: 740, jalan: function (m) {
        m.locate(24, 1); m.spc(79); m.locate(24, 5);
      } },
    { baris: 750, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 25; m.v.A++) {
          m.locate(null, m.pos() + 2);
          m.cetak(m.chr(m.v.A + 64));
        }
      } },
    { baris: 760, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.locate(25, 1); m.cetak('LOWER' + m.chr(29));
      } },
    { baris: 770, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 25; m.v.A++) {
          m.locate(null, m.pos() + 2);
          m.cetak(m.chr(m.v.ARRAY[0][m.v.A]));
        }
      } },
    { baris: 780, jalan: function (m) { m.v.FLAG = 0; m.kembali(); } },

    hapusBaris(790, 23), hapusBaris(800, 24), hapusBaris(810, 25),
    { baris: 820, jalan: function (m) {
        m.locate(25, 22);
        m.cetak('You Are In AlphaNumeric Character Set');
        m.v.FLAG = 1; m.kembali();
      } },

    /* 830-880 bilah menu di puncak layar. */
    { baris: 830, jalan: function (m) { m.cls(); m.warna(0, 7); } },
    bilah(840, 1, ' <F1> Instructions And Picture Files           <F4> Saves This Picture  To Disk '),
    bilah(850, 2, ' <F2> Runs Previous Picture (memory)           <F5> Alternates Graphics/Letters '),
    bilah(860, 3, ' <F3> Loads a Picture From Disk    <F6> Clear Screen   <F10> Leave This Program '),
    { baris: 870, jalan: function (m) { m.warna(7, 0); } },
    { baris: 880, jalan: function (m) { m.kembali(); } },

    /* 890-960 daftar nama gambar, dibaca dari PICTURE.FLE. WHILE/WEND-nya
       ditulis apa adanya: uji di 920, badan di 930, lompat balik di 940. */
    { baris: 890, jalan: function (m) { m.v.F = 0; } },
    { baris: 900, jalan: function (m) { m.locate(null, 1); } },
    { baris: 910, jalan: function (m) { m.tutup(); m.v.FP = 0; } },
    { baris: 920, jalan: function (m) {
        if (m.v.FP >= m.v.KATALOG.length) m.lompat(950);
      } },
    { baris: 930, jalan: function (m) {
        m.v.ZA = m.v.KATALOG[m.v.FP++];
        m.cetak(m.v.ZA.slice(0, 8)); zona(m);
      } },
    { baris: 940, jalan: function (m) { m.lompat(920); } },
    { baris: 950, jalan: function (m) { m.tutup(); } },
    { baris: 960, jalan: function (m) { m.kembali(); } },

    /* 970-1010 mengunci kursor di dalam kanvas: baris 4..22, kolom 1..80,
       dengan pembungkusan ke baris berikutnya kalau kolomnya lewat 80. */
    { baris: 970, jalan: function (m) { if (m.v.X > 22) m.v.X = 22; } },
    { baris: 980, jalan: function (m) { if (m.v.X < 4) m.v.X = 4; } },
    { baris: 990, jalan: function (m) {
        if (m.v.Y > 80) {
          if (m.v.X < 22) { m.v.X += 1; m.v.Y -= 80; } else { m.v.Y = 80; }
          m.lompat(1010);
        }
      } },
    { baris: 1000, jalan: function (m) {
        if (m.v.Y < 1) {
          if (m.v.X > 4) { m.v.X -= 1; m.v.Y += 80; } else { m.v.Y = 1; }
          m.lompat(1010);
        }
      } },
    { baris: 1010, jalan: function (m) { m.kembali(); } },

    /* 1020-1140 perintah warna (Alt+C): dua angka dipisah koma. */
    hapusBaris(1020, 25), hapusBaris(1030, 24), hapusBaris(1040, 23),
    { baris: 1050, jalan: function (m) {
        m.locate(25, 1);
        m.cetak('WHAT COLORS WOULD YOU LIKE? <No,No>');
      } },
    { baris: 1060, jalan: function (m) { m.v.Z1 = ''; m.v.Z = ''; } },
    { baris: 1070, jalan: function (m) {
        m.v.Z1 = m.inkey();
        if (m.v.Z1 === '') m.lompat(1070);
      } },
    /* 1080 koma = "angka pertama selesai". Lalu GOTO 1060 mengosongkan Z
       supaya angka kedua terkumpul dari nol lagi. */
    { baris: 1080, jalan: function (m) {
        if (m.v.Z1 === ',') {
          m.v.F = parseInt(m.v.Z, 10) || 0;
          m.cetak(','); m.lompat(1060);
        }
      } },
    { baris: 1090, jalan: function (m) {
        if (m.v.Z1 === m.chr(13)) m.lompat(1140);
      } },
    { baris: 1100, jalan: function (m) {
        if (m.v.Z1.substr(1, 1) === m.chr(75)) m.lompat(1130);
      } },
    { baris: 1110, jalan: function (m) {
        if (m.v.Z1 === m.chr(8)) m.lompat(1130);
      } },
    { baris: 1120, jalan: function (m) {
        m.v.Z = m.v.Z + m.v.Z1; m.cetak(m.v.Z1); m.lompat(1070);
      } },
    { baris: 1130, jalan: function (m) {
        if (m.v.Z.length < 1) { m.lompat(1070); return; }
        m.cetak(m.chr(29) + ' ' + m.chr(29));
        m.v.Z = m.v.Z.slice(0, m.v.Z.length - 1);
        m.lompat(1070);
      } },
    { baris: 1140, bagian: [
        function (m) { m.v.F1 = parseInt(m.v.Z, 10) || 0; },
        function (m) { m.gosub(720); },
        function (m) { m.warna(m.v.F, m.v.F1); m.kembali(); }
      ] },

    /* --- 1150-1410: satu penangan galat untuk sebelas keadaan -------------- */
    galatBila(1150, 61, null, 'Diskette Is Full', 1330),
    { baris: 1160, jalan: function (m) {
        if (m.err === 53 && m.erl === 1910) {
          m.v['ER$'] = 'Insert A FriendlyWare Diskette'; m.lompat(1280);
        }
      } },
    /* 1170 RESUME NEXT: kembali ke pernyataan SESUDAH yang gagal. Karena
       galatnya selalu di penggal terakhir barisnya, itu berarti baris
       berikutnya — 86 untuk galat di 85, dan 140 untuk galat di 130. */
    { baris: 1170, jalan: function (m) {
        if (m.err === 53 && (m.erl === 130 || m.erl === 85)) {
          m.v.F = 1;
          m.lanjut(m.erl === 85 ? 86 : 140);
        }
      } },
    galatBila(1180, 53, null, 'File Was Not Found', 1330),
    galatBila(1190, 64, null, 'Bad File Name', 1330),
    galatBila(1200, 67, null, 'Too Many Diskette Files', 1330),
    galatBila(1210, 70, null, 'Diskette Is Write Protected', 1330),
    galatBila(1220, 71, null, 'Close Disk Drive Cover', 1330),
    galatBila(1230, 72, null, 'Disk Media Error', 1330),
    galatBila(1240, 52, null, 'Bad File Name', 1330),
    { baris: 1250, jalan: function (m) {
        if (m.err === 3 && m.erl === 1410) m.lanjut(180);
      } },
    { baris: 1260, jalan: function (m) { m.penangkapGalat = 0; } },
    { baris: 1270, jalan: function (m) { m.henti('END di baris 1270'); } },
    hapusBaris(1280, 24), hapusBaris(1290, 23),
    { baris: 1300, jalan: function (m) {
        m.locate(24, 30); m.cetak(m.v['ER$']);
      } },
    hapusBaris(1310, 25),
    { baris: 1320, jalan: function (m) {
        m.locate(25, 30); m.cetak('And Strike Any Key To Continue');
      } },
    { baris: 1321, jalan: function (m) {
        if (m.inkey() !== '') m.lompat(1321);
      } },
    { baris: 1322, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1322); else m.lanjut(1910);
      } },
    hapusBaris(1330, 24),
    { baris: 1340, jalan: function (m) {
        m.locate(24, 30); m.cetak(m.v['ER$']);
      } },
    hapusBaris(1350, 25),
    { baris: 1360, jalan: function (m) {
        m.locate(25, 15);
        m.cetak('Your Command Was Aborted. Strike Any Key To Try Again.');
      } },
    { baris: 1370, jalan: function (m) {
        if (m.inkey() !== '') m.lompat(1370);
      } },
    { baris: 1380, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1370);
      } },
    { baris: 1390, jalan: function (m) { m.v.F = 1; } },
    { baris: 1400, jalan: function (m) { m.lanjut(1410); } },
    /* 1410 RETURN yang dipakai penangan galat untuk "kembali ke pemanggil".
       Kalau ternyata tidak ada GOSUB yang menunggu, GW-BASIC melempar galat 3
       — dan baris 1250 menangkap justru keadaan itu. Penanganan galat yang
       memakai galat sebagai alat kendali. */
    { baris: 1410, jalan: function (m) { m.kembali(); } },

    /* --- 1420-1600: simpan gambar ke disket -------------------------------- */
    rem(1420),
    { baris: 1430, jalan: function (m) { m.gosub(2330); } },
    hapusBaris(1440, 23), hapusBaris(1450, 24), hapusBaris(1460, 25),
    { baris: 1470, jalan: function (m) {
        m.locate(24, 10); m.cetak('And Then Strike The Enter Key ');
      } },
    { baris: 1480, jalan: function (m) {
        m.locate(23, 10);
        m.cetak('Please Enter A Name For This Picture ');
      } },
    { baris: 1490, bagian: [
        function (m) { m.gosub(1770); },
        function (m) { if (m.v.ZA === '        ') m.lompat(1440); }
      ] },
    { baris: 1500, jalan: function (m) { m.v['KEEP$'] = m.v.ZA + '.pic'; } },
    { baris: 1510, jalan: function () { } },
    { baris: 1520, jalan: function (m) {
        m.v.DISKET[m.v['KEEP$']] = m.simpanLayar(AWAL, PANJANG);
      } },
    { baris: 1530, jalan: function (m) { m.tutup(); m.v.FP = 0; } },
    { baris: 1540, jalan: function (m) {
        if (m.v.FP >= m.v.KATALOG.length) m.lompat(1580);
      } },
    { baris: 1550, jalan: function (m) { m.v.ZA = m.v.KATALOG[m.v.FP++]; } },
    { baris: 1560, jalan: function (m) {
        if (m.v['KEEP$'] === m.v.ZA) m.lompat(1600);
      } },
    { baris: 1570, jalan: function (m) { m.lompat(1540); } },
    { baris: 1580, jalan: function (m) { m.tutup(); } },
    { baris: 1590, jalan: function (m) { m.v.KATALOG.push(m.v['KEEP$']); } },
    { baris: 1600, bagian: [
        function (m) { m.tutup(); },
        function (m) { m.gosub(830); },
        function (m) { m.kembali(); }
      ] },

    /* --- 1610-1760: muat gambar dari disket -------------------------------- */
    { baris: 1610, jalan: function (m) { m.gosub(2330); } },
    hapusBaris(1620, 25), hapusBaris(1630, 24), hapusBaris(1640, 23),
    { baris: 1650, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(830); },
        function (m) { m.locate(4, 1); }
      ] },
    { baris: 1660, jalan: function (m) { m.tutup(); m.v.FP = 0; } },
    { baris: 1670, jalan: function (m) {
        if (m.v.FP >= m.v.KATALOG.length) m.lompat(1700);
      } },
    { baris: 1680, jalan: function (m) {
        m.v['LO$'] = m.v.KATALOG[m.v.FP++];
        m.cetak(m.v['LO$'].slice(0, 8)); zona(m);
        m.lompat(1670);
      } },
    { baris: 1690, jalan: function (m) { m.lompat(1670); } },
    { baris: 1700, jalan: function (m) {
        m.locate(24, 10); m.cetak('And Then Strike The Enter Key ');
      } },
    { baris: 1710, jalan: function (m) {
        m.locate(23, 10);
        m.cetak("Please Enter The Name Of The Picture You'd Like To See ");
      } },
    { baris: 1720, jalan: function (m) { m.gosub(1770); } },
    { baris: 1730, jalan: function (m) { m.v['KEEP$'] = m.v.ZA + '.pic'; } },
    { baris: 1740, jalan: function () { } },
    { baris: 1750, jalan: function (m) {
        var g = m.v.DISKET[m.v['KEEP$']];
        if (!g) { m.galat(53, 'File not found: ' + m.v['KEEP$']); return; }
        m.pulihkanLayar(g, AWAL);
      } },
    { baris: 1760, jalan: function (m) { m.kembali(); } },

    /* --- 1770-1880: penyunting nama berkas, tombol demi tombol ------------- */
    { baris: 1770, jalan: function (m) { m.v.ZH = ''; } },
    { baris: 1780, jalan: function (m) {
        if (m.inkey() !== '') m.lompat(1780);
      } },
    { baris: 1790, jalan: function (m) {
        m.v.ZI = m.inkey();
        if (m.v.ZI === '') m.lompat(1790);
      } },
    /* 1800 LSET ke medan 8 aksara: nama pendek dirapatkan ke kiri dan
       sisanya spasi. Itu sebabnya baris 1490 mengujinya dengan delapan
       spasi, bukan dengan string kosong. */
    { baris: 1800, jalan: function (m) {
        if (m.v.ZI === m.chr(13)) {
          m.v.ZA = (m.v.ZH + '        ').slice(0, 8);
          m.kembali();
        }
      } },
    { baris: 1810, jalan: function (m) {
        if (m.v.ZI === m.chr(8)) m.lompat(1870);
      } },
    { baris: 1820, jalan: function (m) {
        if (m.v.ZI.length > 1) {
          m.lompat(m.v.ZI.slice(-1) === m.chr(75) ? 1870 : 1780);
        }
      } },
    { baris: 1830, jalan: function (m) {
        if (m.v.ZH.length > 7) m.lompat(1790);
      } },
    { baris: 1840, jalan: function (m) {
        if (m.v.ZI < 'a' || m.v.ZI > 'z') m.lompat(1860);
      } },
    { baris: 1850, jalan: function (m) {
        m.v.ZI = m.chr(m.v.ZI.charCodeAt(0) - 32);
      } },
    { baris: 1860, jalan: function (m) {
        m.v.ZH = m.v.ZH + m.v.ZI; m.cetak(m.v.ZI); m.lompat(1790);
      } },
    { baris: 1870, jalan: function (m) {
        if (m.v.ZH.length < 1) m.lompat(1790);
      } },
    { baris: 1880, jalan: function (m) {
        m.cetak(m.chr(29) + ' ' + m.chr(29));
        m.v.ZH = m.v.ZH.slice(0, m.v.ZH.length - 1);
        m.lompat(1790);
      } },

    /* 1890-1910 keluar. Perhatikan bentuknya: GOSUB ke baris BERIKUTNYA, dan
       subrutin itu tidak pernah RETURN — ia jatuh ke 1910 yang menjalankan
       MENU. Tiap putaran menumpuk satu alamat kembali yang tak akan dipakai.
       GOSUB yang dipakai sebagai GOTO. */
    { baris: 1890, jalan: function (m) { m.gosub(1900); } },
    { baris: 1900, jalan: function (m) {
        if (m.v.F === 1) { m.v.F = 0; m.lompat(1890); }
      } },
    { baris: 1910, jalan: function (m) { m.jalankan('MENU'); } },
    /* 1920 penangan yang TIDAK PERNAH DIPASANG: tidak ada satu pun
       `ON KEY(n) GOSUB 1920` di seluruh program. Kode mati yang ikut
       terkirim. */
    { baris: 1920, jalan: function (m) {
        m.jebakan(1, false); m.jebakan(3, false); m.jebakan(4, false);
        m.v.Z = m.chr(0) + m.chr(33);
        m.kembali(450);
      } },
    /* 1930-1940 F3 dan F4. Keduanya tidak mengerjakan apa-apa sendiri: mereka
       MEMALSUKAN sebuah penekanan tombol lalu masuk kembali ke penyalur di
       baris 450. Jadi cuma ada SATU tempat yang memutuskan arti tiap
       perintah, dan tombol fungsi hanyalah jalan pintas ke sana. */
    palsu(1930, 2, 10, 38),   /* F3 -> Alt+L, memuat gambar   */
    palsu(1940, 2, 10, 31),   /* F4 -> Alt+S, menyimpan       */

    /* --- 1950-2140: F1, layar petunjuk ------------------------------------- */
    { baris: 1950, bagian: [
        function (m) {
          for (m.v.A = 2; m.v.A <= 10; m.v.A++) m.jebakan(m.v.A, false);
        },
        function () { }
      ] },
    { baris: 1960, jalan: function (m) {
        m.v.DISKET['tempory.tmp'] = m.simpanLayar(AWAL, PANJANG);
      } },
    { baris: 1970, jalan: function (m) { m.cls(); } },
    ajar(1980,  1, 18, '          DRAW COMMANDS and CONTROLS'),
    ajar(1990,  2, 18, 'Alt & K.............To Erase A Picture From Files'),
    ajar(2000,  3, 18, 'Cursor Arrows.......Moves Cursor In Any Direction'),
    ajar(2010,  4, 18, 'Ctrl & Arrow Left...Moves Cursor Left  10  spaces'),
    ajar(2020,  5, 18, 'Ctrl & Arrow Right..Moves Cursor Right 10  spaces'),
    ajar(2030,  6, 18, 'PgUp................Moves Cursor  Up    5   Lines'),
    ajar(2040,  7, 18, 'PgDn................Moves Cursor Down   5   Lines'),
    ajar(2050,  8, 18, 'End.................Moves Cursor To End  Of  Line'),
    ajar(2060,  9, 18, 'Home................Moves Cursor Home, Upper Left'),
    ajar(2070, 10, 18, 'Alt & C.............Color Command, Enter No. , No.'),
    ajar(2071, 11, 18, '(The First Is Foreground And Second Is Background)'),
    ajar(2080, 13, 18, 'The Following Names Are Pictures On This Diskette:'),
    { baris: 2090, bagian: [
        function (m) { m.locate(15, 1); },
        function (m) { m.gosub(890); }
      ] },
    { baris: 2100, jalan: function (m) {
        m.locate(25, 27); m.cetak('Strike Any Key To Continue');
      } },
    { baris: 2110, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(2110);
      } },
    { baris: 2120, bagian: [
        function (m) { m.gosub(830); },
        function (m) { m.gosub(720); }
      ] },
    { baris: 2130, jalan: function (m) {
        m.pulihkanLayar(m.v.DISKET['tempory.tmp'], AWAL);
      } },
    { baris: 2140, jalan: function (m) {
        m.locate(m.v.X, m.v.Y, 1); m.kembali();
      } },

    /* 2150-2170 F5: berganti antara papan gambar dan papan huruf biasa. */
    { baris: 2150, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10; m.v.A++) m.jebakan(m.v.A, false);
      } },
    { baris: 2160, jalan: function (m) { m.gosub(m.v.FLAG ? 720 : 790); } },
    { baris: 2170, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10; m.v.A++) m.jebakan(m.v.A, true);
        m.locate(m.v.X, m.v.Y, 1); m.kembali();
      } },
    /* 2180 penangan F7, F8, dan F9 sekaligus: langsung pulang. Tiga tombol
       yang sengaja dibuat tidak berbuat apa-apa — supaya menekannya tidak
       merusak gambar. */
    { baris: 2180, jalan: function (m) { m.kembali(); } },

    /* 2190-2230 F2: gambar ulang dari simpanan di memori. */
    { baris: 2190, jalan: function (m) { m.cls(); } },
    { baris: 2200, jalan: function () { } },
    { baris: 2210, jalan: function (m) { m.v.CODE = 0x40; } },
    { baris: 2220, jalan: function (m) { panggilKode(m); } },
    { baris: 2230, jalan: function (m) {
        m.locate(m.v.X, m.v.Y); m.kembali();
      } },

    /* 2240-2270 memori kurang dari 64K. Tidak pernah tercapai di penelusur. */
    { baris: 2240, jalan: function (m) { m.cls(); } },
    ajar(2250, 4, 20, 'Sorry But You Must Have At Least 64K Of Memory'),
    ajar(2260, 5, 20, '           To Use This Program'),
    { baris: 2270, bagian: [
        function (m) {
          for (m.v.A = 1; m.v.A <= 5000; m.v.A++) { /* jeda */ }
        },
        function (m) { m.gosub(1890); },
        function (m) { m.lompat(2270); }
      ] },

    /* 2280-2320 dua baris DATA yang memuat seluruh gagasan program ini. */
    { baris: 2280, jalan: function (m) { m.dim('ARRAY', 1, 25); } },
    { baris: 2290, jalan: function (m) {
        for (m.v.A = 0; m.v.A <= 1; m.v.A++) {
          for (m.v.B = 1; m.v.B <= 25; m.v.B++) {
            m.v.ARRAY[m.v.A][m.v.B] = m.baca();
          }
        }
      } },
    { baris: 2300, jalan: function (m) { m.kembali(); } },
    { baris: 2310, jalan: function () { /* DATA potongan "penutup" (a-y) */ } },
    { baris: 2320, jalan: function () { /* DATA potongan "pembuka" (A-Y) */ } },

    { baris: 2330, jalan: function () { } },
    { baris: 2340, jalan: function (m) { m.v.CODE = 0; } },
    { baris: 2350, jalan: function (m) { panggilKode(m); m.kembali(); } },

    /* --- 2360-2680: Alt+K, hapus sebuah gambar ----------------------------- */
    { baris: 2360, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) m.jebakan(m.v.A, false);
      } },
    { baris: 2370, bagian: [
        function (m) { m.gosub(2330); },
        function (m) { m.cls(); },
        function (m) { m.gosub(830); },
        function (m) { m.locate(5, 1); }
      ] },
    { baris: 2380, jalan: function (m) { m.tutup(); m.v.FP = 0; } },
    { baris: 2390, jalan: function (m) { m.dim('NAMES$', 50); } },
    { baris: 2400, jalan: function (m) { m.v.A = 0; } },
    { baris: 2410, jalan: function (m) {
        if (m.v.FP >= m.v.KATALOG.length) m.lompat(2440);
      } },
    { baris: 2420, jalan: function (m) {
        m.v['NAMES$'][m.v.A] = m.v.KATALOG[m.v.FP++];
        m.cetak(m.v['NAMES$'][m.v.A].slice(0, 8) + '  ');
        m.v.A = m.v.A + 1;
      } },
    { baris: 2430, jalan: function (m) { m.lompat(2410); } },
    hapusBaris(2440, 23), hapusBaris(2450, 24), hapusBaris(2460, 25),
    { baris: 2470, jalan: function (m) {
        m.locate(24, 10); m.cetak('And Then Strike The Enter Key ');
      } },
    { baris: 2480, jalan: function (m) {
        m.locate(23, 10);
        m.cetak('Please Enter Name Of Picture That You Wish To Erase ');
      } },
    { baris: 2490, bagian: [
        function (m) { m.gosub(1770); },
        function (m) { m.v.B = 0; }
      ] },
    { baris: 2500, jalan: function (m) {
        if (m.v.B === m.v.A) m.lompat(2540);
      } },
    { baris: 2510, jalan: function (m) {
        if (m.v.ZA === m.v['NAMES$'][m.v.B].slice(0, 8)) m.lompat(2590);
      } },
    { baris: 2520, jalan: function (m) { m.v.B = m.v.B + 1; } },
    { baris: 2530, jalan: function (m) { m.lompat(2500); } },
    hapusBaris(2540, 23), hapusBaris(2550, 24), hapusBaris(2560, 25),
    { baris: 2570, jalan: function (m) {
        m.locate(23, 10); m.cetak('No Such File Name. ');
      } },
    /* 2580 gelung tunda yang memakai A — variabel yang barusan menyimpan
       CACAH NAMA. Sesudah baris ini cacahnya hilang. Kebetulan tidak ada
       yang membacanya lagi, jadi cacatnya tak pernah terlihat. */
    { baris: 2580, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 4000; m.v.A++) { /* jeda */ }
        m.lompat(2670);
      } },
    { baris: 2590, jalan: function (m) {
        var nama = m.v['NAMES$'][m.v.B];
        delete m.v.DISKET[nama];
      } },
    { baris: 2600, jalan: function (m) { m.v['NAMES$'][m.v.B] = ''; } },
    { baris: 2610, jalan: function (m) {
        m.tutup(); m.v.KATALOG = [];
      } },
    { baris: 2620, jalan: function (m) { m.v.B = 0; } },
    { baris: 2630, jalan: function (m) {
        if (m.v.B === m.v.A) m.lompat(2670);
      } },
    { baris: 2640, jalan: function (m) {
        if (m.v['NAMES$'][m.v.B] !== '') m.v.KATALOG.push(m.v['NAMES$'][m.v.B]);
      } },
    { baris: 2650, jalan: function (m) { m.v.B = m.v.B + 1; } },
    { baris: 2660, jalan: function (m) { m.lompat(2630); } },
    { baris: 2670, jalan: function (m) { m.gosub(m.v.FLAG ? 790 : 720); } },
    { baris: 2680, bagian: [
        function (m) { m.gosub(2190); },
        function (m) {
          for (m.v.A = 1; m.v.A <= 9; m.v.A++) m.jebakan(m.v.A, true);
          m.kembali();
        }
      ] },

    /* --- 2690-2770: F10, keluar ------------------------------------------- */
    { baris: 2690, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10; m.v.A++) m.jebakan(m.v.A, false);
      } },
    { baris: 2700, jalan: function (m) {
        m.v.XLIN = m.barisKursor(); m.v.XPOS = m.pos();
        m.locate(25, 1); m.spc(79);
      } },
    { baris: 2710, jalan: function (m) {
        m.locate(25, 21);
        m.cetak('Do You Wish To Leave This Program? <Y/N>');
      } },
    { baris: 2720, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(2720);
      } },
    { baris: 2730, jalan: function (m) {
        if (m.v.Z === 'y' || m.v.Z === 'Y') m.lompat(2770);
      } },
    { baris: 2740, jalan: function (m) {
        if (m.v.Z !== 'n' && m.v.Z !== 'N') m.lompat(2720);
      } },
    { baris: 2750, jalan: function (m) { m.gosub(m.v.FLAG ? 790 : 720); } },
    { baris: 2760, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 10; m.v.A++) m.jebakan(m.v.A, true);
        m.kembali();
      } },
    { baris: 2770, jalan: function (m) { m.kembali(1890); } },
    palsu(2780, 1, 9, 119),  /* F6 -> Ctrl+Home, bersihkan kanvas */

    { baris: 10000, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function rem(nomor) { return { baris: nomor, jalan: function () { } }; }

  function pesan(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }
  function ajar(nomor, b, k, isi) { return pesan(nomor, b, k, isi); }

  function bilah(nomor, b, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, 1); m.cetak(isi); m.barisBaru();
    } };
  }

  function hapusBaris(nomor, b) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, 1); m.spc(79);
    } };
  }

  function trap(nomor, tombol, tujuan) {
    return { baris: nomor, jalan: function (m) {
      m.pasangJebakan(tombol, tujuan);
    } };
  }

  /* Satu baris `IF Z1=CHR$(k) THEN <geser kursor>`. */
  function gerak(nomor, kode, fn) {
    return { baris: nomor, jalan: function (m) {
      if (m.v.Z1 === m.chr(kode)) fn(m);
    } };
  }

  /* Satu baris `IF Z1=CHR$(k) THEN a:b:c` — tiap penggal jadi bagiannya
     sendiri supaya sorotannya berhenti di tempat yang benar, dan syaratnya
     diuji ulang di tiap bagian (Z1 tidak berubah di dalamnya). */
  function jikaKode(nomor, kode) {
    var fns = Array.prototype.slice.call(arguments, 2);
    return { baris: nomor, bagian: fns.map(function (fn) {
      return function (m) { if (m.v.Z1 === m.chr(kode)) fn(m); };
    }) };
  }

  /* Penangan tombol fungsi yang memalsukan penekanan tombol lalu masuk
     kembali ke penyalur di baris 450. */
  function palsu(nomor, dari, sampai, kode) {
    return { baris: nomor, jalan: function (m) {
      for (m.v.A = dari; m.v.A <= sampai; m.v.A++) m.jebakan(m.v.A, false);
      m.v.Z = m.chr(0) + m.chr(kode);
      m.kembali(450);
    } };
  }

  /* Koma di ujung `PRINT` memindah kursor ke zona cetak berikutnya. Zona
     GW-BASIC lebarnya 14 kolom: 1, 15, 29, 43, 57, 71. */
  function zona(m) {
    var k = m.pos();
    var berikut = Math.floor((k - 1) / 14 + 1) * 14 + 1;
    if (berikut > 71) { m.barisBaru(); return; }
    m.locate(null, berikut);
  }

  function galatBila(nomor, kode, erl, pesanGalat, tujuan) {
    return { baris: nomor, jalan: function (m) {
      if (m.err === kode && (erl === null || m.erl === erl)) {
        m.v['ER$'] = pesanGalat;
        m.lompat(tujuan);
      }
    } };
  }

  /* `FILES "menu.bas"` sebagai uji keberadaan.

     Panggilan pertama (baris 85) menjawab ADA: penelusur masih berdiri di
     disket program. Panggilan kedua (baris 130) terjadi sesudah program
     menyuruh menukar disket dan pemakai menekan tombol — jadi kali ini
     jawabannya TIDAK ADA, seolah disketnya benar-benar ditukar. Tanpa itu
     baris 90-160 berputar selamanya dan penyuntingnya tak pernah tercapai. */
  function ujiDisket(m) {
    m.v.TUKAR = (m.v.TUKAR || 0) + 1;
    if (m.v.TUKAR > 1) m.galat(53, 'File not found: MENU.BAS');
  }

  /* `CALL CODE` — kode mesin di dalam DRAW.EXE yang hilang. Tafsiran, bukan
     fakta; lihat kepala berkas. Offset 0 menyimpan kanvas, offset &H40
     mengembalikannya. */
  function panggilKode(m) {
    if (m.v.CODE === 0) m.v.SIMPANAN = m.simpanLayar(AWAL, PANJANG);
    else m.pulihkanLayar(m.v.SIMPANAN, AWAL);
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['DRAW'] = {
    nama: 'DRAW',
    judul: 'Draw (penyunting gambar layar)',
    sumber: 'DRAW',
    berkas: 'run/DRAW.BAS',
    tabel: tabel,
    /* Baris 2310 dibaca lebih dulu (A=0, potongan "penutup"), baru 2320
       (A=1, potongan "pembuka"). Urutannya yang menentukan huruf mana dapat
       potongan mana. */
    data: [
      200, 188, 186, 202, 185, 197, 192, 217, 179, 193, 180, 177, 176,
      221, 220, 17, 27, 174, 25, 249, 250, 157, 4, 5, 2,
      201, 187, 205, 203, 204, 206, 218, 191, 196, 194, 195, 219, 178,
      222, 223, 16, 26, 175, 24, 15, 248, 247, 6, 3, 1
    ],

    arsitektur: {
      judul: 'Alur DRAW.BAS',
      simpul: [
        { id: 'muat', baris: '10-50', jenis: 'mulai',
          teks: ['Siapkan layar,', 'muat DRAW.EXE'] },
        { id: 'disket', baris: '85-190', jenis: 'putusan',
          teks: ['Disket data atau disket program?', 'MENU.BAS ketemu = SALAH'] },
        { id: 'siap', baris: '200-410',
          teks: ['Pasang sepuluh jebakan tombol,', 'baca dua baris DATA jadi larik'] },
        { id: 'tunggu', baris: '420-450', jenis: 'putusan',
          teks: ['Tunggu satu tombol', 'lalu putuskan artinya'] },
        { id: 'huruf', baris: '460-510',
          teks: ['Huruf: ganti dengan', 'potongan garis dari larik'] },
        { id: 'kursor', baris: '520-610',
          teks: ['Tombol panah:', 'geser kursor'] },
        { id: 'perintah', baris: '620-690', jenis: 'subrutin',
          teks: ['Alt/Ctrl: simpan, muat,', 'hapus, warna, papan bantu'] },
        { id: 'batas', baris: '970-1010',
          teks: ['Kunci kursor di baris 4-22,', 'membungkus di kolom 80'] },
        { id: 'fungsi', baris: '1930-2780', jenis: 'subrutin',
          teks: ['Tombol fungsi memalsukan', 'penekanan tombol, RETURN 450'] },
        { id: 'keluar', baris: '1890-1910', jenis: 'keluar',
          teks: ['GOSUB yang tak pernah pulang,', 'lalu RUN "menu"'] }
      ],
      panah: [
        { dari: 'muat', ke: 'disket' },
        { dari: 'disket', ke: 'disket', label: 'disket salah', jenis: 'galat' },
        { dari: 'disket', ke: 'siap', label: 'MENU.BAS tak ada' },
        { dari: 'siap', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'huruf', label: 'A-Y / a-y' },
        { dari: 'tunggu', ke: 'kursor', label: 'panah' },
        { dari: 'tunggu', ke: 'perintah', label: 'Alt / Ctrl' },
        { dari: 'huruf', ke: 'batas' },
        { dari: 'kursor', ke: 'batas' },
        { dari: 'perintah', ke: 'batas' },
        { dari: 'batas', ke: 'tunggu', label: 'tombol berikutnya' },
        { dari: 'fungsi', ke: 'tunggu', label: 'RETURN 450' },
        { dari: 'perintah', ke: 'keluar', label: 'F10, jawab Y' }
      ]
    },

    diagramLain: [
      {
        jenis: 'keadaan',
        judul: 'Dua arti papan ketik',
        keterangan: 'Tombol yang sama, dua arti, dan satu bendera ' +
          '<code>FLAG</code> yang memilih. Yang berubah bukan alurnya ' +
          'melainkan apa yang tercetak waktu huruf ditekan — dan papan bantu ' +
          'di kaki layar ikut berganti supaya pemakainya tahu ia di mana.',
        simpul: [
          { id: 'gambar', baris: '720-780', jenis: 'mulai',
            teks: ['Papan gambar (FLAG = 0)', 'A jadi tepi kiri-atas'] },
          { id: 'teks', baris: '790-820', jenis: 'keadaan',
            teks: ['Papan huruf (FLAG = 1)', 'A tetap huruf A'] }
        ],
        panah: [
          { dari: 'gambar', ke: 'teks', label: 'F5 (baris 2160)' },
          { dari: 'teks', ke: 'gambar', label: 'F5 lagi' },
          { dari: 'teks', ke: 'gambar', label: 'Ctrl+PgUp (baris 690)' },
          { dari: 'gambar', ke: 'teks', label: 'Ctrl+End (baris 680)' }
        ]
      }
    ],

    pseudokode: [
      { baris: 50, tingkat: 0, teks: 'muat <code>DRAW.EXE</code> &mdash; <b>berkas ini tidak ada di koleksi</b>' },
      { baris: 85, tingkat: 0, teks: 'cari <code>MENU.BAS</code>; <b>ketemu = disketnya salah</b>' },
      { baris: 90, tingkat: 1, teks: 'minta pemakai menukar ke disket data, lalu cari lagi' },
      { baris: 180, tingkat: 1, teks: 'salin diri sendiri ke disket data itu' },
      { baris: 2290, tingkat: 0, teks: 'baca dua baris DATA: 25 potongan garis untuk huruf besar, 25 untuk huruf kecil' },
      { baris: 420, tingkat: 0, teks: '<b>ULANG selamanya:</b>' },
      { baris: 440, tingkat: 1, teks: 'tunggu satu tombol' },
      { baris: 490, tingkat: 1, teks: 'huruf besar A&ndash;Y &rarr; cetak <code>ARRAY%(1, huruf&minus;64)</code>' },
      { baris: 510, tingkat: 1, teks: 'huruf kecil a&ndash;y &rarr; cetak <code>ARRAY%(0, huruf&minus;96)</code>' },
      { baris: 520, tingkat: 1, teks: 'panah / PgUp / Home &rarr; geser kursor' },
      { baris: 630, tingkat: 1, teks: 'Alt+S simpan, Alt+L muat, Alt+K hapus, Alt+C warna' },
      { baris: 970, tingkat: 1, teks: 'kunci kursor di baris 4&ndash;22; lewat kolom 80 pindah baris' },
      { baris: 1930, tingkat: 0, teks: 'tombol fungsi <b>memalsukan penekanan tombol</b> lalu <code>RETURN 450</code>' }
    ],

    perintahAsli: 'run\\DRAW.bat',
    catatanAsli: 'Perhatian: di DOSBox-X program ini BERHENTI di baris 50 ' +
      'dengan galat 53, karena DRAW.EXE tidak ada di koleksi ini. Satu-satunya ' +
      'program yang begitu.',

    penyimpangan: [
      '<b><code>DRAW.EXE</code> tidak ada di koleksi</b>, dan dua rutin kode ' +
      'mesinnya digantikan <b>tafsiran</b>: offset 0 menyimpan kanvas, offset ' +
      '<code>&amp;H40</code> mengembalikannya. Dasarnya kelima tempat ' +
      'pemanggilan (baris 400, 2330 &times; 3, dan 2200 yang di menunya ' +
      'tertulis "Runs Previous Picture (memory)"). <b>Cocok, tapi tidak ' +
      'terbukti</b> &mdash; dan tidak bisa dibuktikan selama berkasnya hilang. ' +
      'Seluruh sisa program adalah BASIC biasa dan diterjemahkan apa adanya.',

      '<b>GW-BASIC yang sungguhan berhenti di baris 50.</b> ' +
      '<code>ON ERROR</code> baru dipasang di baris 70, jadi galat 53 di baris ' +
      '50 tidak tertangkap. <code>run\\DRAW.bat</code> tidak akan jalan.',

      '<b>Penelusur berpura-pura pemakainya benar-benar menukar disket.</b> ' +
      'Uji di baris 85 menjawab "MENU.BAS ada" (disket program), uji di baris ' +
      '130 menjawab "tidak ada" (disket data). Tanpa itu baris 90&ndash;160 ' +
      'berputar selamanya dan penyuntingnya tak pernah tercapai.',

      '<b>Disketnya cuma ada di memori.</b> Gambar yang disimpan lewat Alt+S ' +
      'bisa dimuat lagi lewat Alt+L dalam sesi yang sama, tapi hilang begitu ' +
      'halaman disegarkan. <code>KILL</code> menghapus dari memori itu juga.',

      '<b><code>POKE</code>, <code>PEEK</code>, dan <code>DEF SEG</code> ' +
      'tidak berbuat apa-apa.</b> Termasuk <code>POKE 106,0</code>, yang ' +
      'kelihatannya <b>bukan</b> pembuang isi penyangga papan ketik: baris 430 ' +
      'melakukannya di dalam gelung tunggu-tombol (kalau ia membuang, tak satu ' +
      'tombol pun akan terbaca), dan baris 1321/1370/1780 memasangkannya ' +
      'dengan gelung <code>IF INKEY$&lt;&gt;""</code> yang justru itulah cara ' +
      'baku membuangnya. Uji kartu monokrom di baris 310 selalu menjawab ' +
      '"kartu warna".'
    ],

    pelajaran: {
      ringkas: 'Penyunting gambar layar penuh &mdash; satu-satunya program ' +
        'bukan-permainan di koleksi ini. Yang layak dipelajari: papan ketik ' +
        'yang disulap jadi papan gambar, dan tombol fungsi yang memalsukan ' +
        'penekanan tombol supaya cuma ada satu tempat yang memutuskan arti.',
      pelajari: [
        ['Papan ketik sebagai papan gambar',
         'Dua baris <code>DATA</code> di 2310-2320 memetakan 25 huruf ke 25 ' +
         'potongan garis CP437, dan pembagiannya punya logika: <b>huruf besar ' +
         'adalah potongan "pembuka", huruf kecil "penutup"</b>. ' +
         '<code>A</code>=&#9556; <code>a</code>=&#9562;, ' +
         '<code>B</code>=&#9559; <code>b</code>=&#9565;, ' +
         '<code>C</code>=&#9552; <code>c</code>=&#9553;. Mengetik ' +
         '<code>ACCB</code> menggambar tepi atas kotak. Antarmuka yang ' +
         'seluruhnya ada di dalam sebuah tabel.'],
        ['Tombol fungsi yang memalsukan penekanan tombol',
         'Baris 1930, 1940, dan 2780 tidak mengerjakan perintahnya sendiri. ' +
         'Mereka mengisi <code>Z</code> dengan kode tombol palsu lalu ' +
         '<code>RETURN 450</code> &mdash; masuk kembali ke penyalur. Jadi ' +
         'F3 dan Alt+L benar-benar <b>kode yang sama</b>, bukan dua salinan ' +
         'yang harus dijaga tetap sama.'],
        ['Papan bantu yang ikut berganti',
         'Baris 720-770 menggambar tiga baris sejajar di kaki layar: potongan ' +
         'huruf besar, hurufnya, potongan huruf kecil. Tabel terjemahan yang ' +
         'selalu kelihatan &mdash; dan begitu F5 mengubah modus, baris ' +
         '790-820 menggantinya dengan satu kalimat. <b>Tampilan yang ' +
         'memberitahu keadaan.</b>'],
        ['Menyimpan gambar = menyalin RAM layar',
         '<code>BSAVE nama,480,3040</code> menyalin RAM layar mentah-mentah. ' +
         'Angkanya bicara sendiri: dua bita per sel, jadi 480 bita = sel ' +
         'ke-240 dan 3040 bita = 1520 sel &mdash; <b>baris 4 sampai 22</b>, ' +
         'persis kanvasnya. Tidak ada format berkas yang perlu dirancang.']
      ],
      hindari: [
        ['Uji yang artinya terbalik tanpa satu kata penjelasan',
         'Baris 86: <code>IF F THEN 200</code>. <code>F</code> bernilai 1 ' +
         'hanya kalau <code>MENU.BAS</code> <b>tidak</b> ketemu. Jadi ' +
         '"berkas tidak ada" = "semuanya beres". Masuk akal kalau sudah tahu ' +
         'ceritanya (disket data harus kosong), mustahil ditebak kalau belum ' +
         '&mdash; dan tidak ada satu pun <code>REM</code> yang menjelaskannya.'],
        ['GOSUB yang tidak pernah RETURN',
         'Baris 1890 memanggil 1900, dan 1900 kalau perlu melompat balik ke ' +
         '1890 &mdash; yang memanggil 1900 lagi. Tiap putaran menumpuk satu ' +
         'alamat kembali yang tak akan pernah dipakai, dan akhirnya jatuh ke ' +
         '1910 yang menjalankan MENU. <code>GOSUB</code> yang dipakai sebagai ' +
         '<code>GOTO</code>.'],
        ['Penangan galat yang mengandalkan galat',
         'Baris 1400 <code>RESUME 1410</code>, dan 1410 <code>RETURN</code>. ' +
         'Kalau tidak ada <code>GOSUB</code> yang menunggu, itu galat 3 ' +
         '&mdash; dan baris 1250 menangkap justru keadaan itu untuk melompat ' +
         'ke 180. Bekerja, tapi tidak ada yang bisa membacanya sekali lewat.'],
        ['Kode mati yang ikut terkirim',
         'Baris 1920 adalah penangan tombol fungsi yang lengkap, dan tidak ada ' +
         'satu pun <code>ON KEY(n) GOSUB 1920</code> di seluruh program.'],
        ['Satu variabel untuk dua tugas',
         'Baris 2400-2420 memakai <code>A</code> sebagai <b>cacah nama</b>; ' +
         'baris 2580 memakainya lagi sebagai <b>pencacah gelung tunda</b> dan ' +
         'menghancurkan cacahnya. Kebetulan tidak ada yang membacanya lagi ' +
         'sesudah itu.']
      ]
    },

    penjelasan: [
      { judul: 'Papan ketik yang disulap jadi papan gambar',
        isi: [
          'Layar teks IBM PC punya 256 aksara, dan sekitar empat puluh di ' +
          'antaranya adalah potongan garis: sudut, siku, palang, garis tunggal, ' +
          'garis ganda. Dengan itu orang bisa menggambar kotak, tabel, dan ' +
          'diagram &mdash; asal tahu nomornya.',
          'Tidak ada yang hafal nomornya. Maka program ini memetakannya ke ' +
          'papan ketik, dan pemetaannya punya logika:',
          '<b>huruf besar = potongan pembuka, huruf kecil = potongan penutup.</b>',
          '<code>A</code> tepi kiri-<b>atas</b>, <code>a</code> tepi ' +
          'kiri-<b>bawah</b>. <code>B</code> kanan-atas, <code>b</code> ' +
          'kanan-bawah. <code>C</code> garis mendatar, <code>c</code> garis ' +
          'tegak. Jadi menggambar kotak berarti mengetik <code>ACCCB</code>, ' +
          'turun, <code>c</code>, dan seterusnya.',
          'Seluruh pemetaannya cuma dua baris <code>DATA</code> di ujung ' +
          'program (2310 dan 2320) dan satu larik dua baris kali 25 kolom. ' +
          'Baris 490 dan 510 yang memakainya:',
          '<code>PRINT CHR$(ARRAY%(1, ASC(Z)-64))</code> untuk huruf besar, ' +
          '<code>ARRAY%(0, ...)</code> untuk huruf kecil.',
          'Dan supaya tak perlu dihafal, baris 720-770 menggambar tabelnya di ' +
          'kaki layar &mdash; tiga baris sejajar, potongan di atas hurufnya.'
        ] },
      { judul: 'Satu penyalur, banyak jalan masuk',
        isi: [
          'Program ini punya sepuluh tombol fungsi, sembilan perintah Alt/Ctrl, ' +
          'dan sepuluh gerakan kursor. Godaannya: tulis penangan untuk ' +
          'masing-masing.',
          'Yang dilakukannya lain. Semua perintah diputuskan di <b>satu</b> ' +
          'tempat &mdash; rantai <code>IF</code> di baris 520 sampai 700 yang ' +
          'membaca kode pindai tombol. Lalu tombol fungsinya, yang datang lewat ' +
          'jalur berbeda (<code>ON KEY</code>), <b>memalsukan sebuah penekanan ' +
          'tombol</b>:',
          '<code>1940 ... Z=CHR$(0)+CHR$(31):RETURN 450</code>',
          'F4 mengisi <code>Z</code> dengan kode Alt+S, lalu ' +
          '<code>RETURN 450</code> &mdash; pulang bukan ke pemanggilnya, ' +
          'melainkan ke <b>tengah penyalur</b>. Dari situ jalannya sama persis ' +
          'seperti kalau pemakainya menekan Alt+S sendiri.',
          'Akibatnya: F4 dan Alt+S tidak mungkin berbeda perilaku, karena ' +
          'keduanya kode yang sama. Ini kerabat dekat <code>U</code> di ' +
          'OTHELLO.BAS dan <code>P</code> di CRAPS.BAS &mdash; tapi arahnya ' +
          'terbalik: bukan satu kode yang berubah arti, melainkan banyak jalan ' +
          'masuk yang dipaksa bertemu di satu kode.'
        ] },
      { judul: 'Kenapa program ini menolak jalan',
        isi: [
          'Dua hal menghalangi, dan keduanya perlu dikatakan terus terang.',
          '<b>Pertama, <code>DRAW.EXE</code> tidak ada di koleksi ini.</b> ' +
          'Baris 50 memuatnya dan baris 400 memanggilnya. Karena ' +
          '<code>ON ERROR</code> baru dipasang di baris 70, GW-BASIC yang ' +
          'sungguhan berhenti di baris 50 dengan galat 53. Penelusur ' +
          'menggantikan kedua rutinnya dengan <b>tafsiran</b> &mdash; simpan ' +
          'kanvas dan kembalikan kanvas &mdash; yang cocok di kelima tempat ' +
          'pemanggilan tapi tidak bisa dibuktikan. Sisanya BASIC biasa, ' +
          'diterjemahkan apa adanya.',
          '<b>Kedua, uji disketnya terbalik.</b> Baris 85 mencari ' +
          '<code>MENU.BAS</code>, dan baris 86 melanjutkan ke penyunting hanya ' +
          'kalau berkasnya <b>tidak</b> ketemu.',
          'Sebabnya masuk akal begitu diketahui: <code>MENU.BAS</code> ada di ' +
          'disket <b>program</b>. Yang diminta program ini adalah disket ' +
          '<b>data</b> &mdash; disket kosong yang boleh ditulisi gambar. ' +
          'Menemukan MENU.BAS berarti pemakainya belum menukar disket.',
          'Dan kalau sudah ditukar, baris 180-190 melakukan hal yang ' +
          'mengejutkan: program itu <b>menyalin dirinya sendiri</b> ke disket ' +
          'data &mdash; kode mesinnya lewat <code>BSAVE</code>, sumbernya ' +
          'sendiri lewat <code>SAVE "DRAW.BAS",P</code>. Sesudah itu disket ' +
          'data bisa dipakai sendirian.',
          'Penelusur berpura-pura pemakainya benar-benar menukar disket saat ' +
          'diminta, jadi uji kedua menjawab "tidak ada". Tanpa itu, yang ' +
          'terlihat cuma baris 90-160 berputar selamanya.'
        ] }
    ]
  };
})(window);
