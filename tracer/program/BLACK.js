/* ===========================================================================
   BLACK.js — porting minimalis BLACK.BAS sebagai tabel baris.

       621 "Hughes J. Glantzberg"      623 "Carrollton, TX 75007"

   PENULIS YANG SAMA DENGAN TRUCKER.BAS. Dan bukan cuma namanya — tiga
   subrutin di ujung berkas ini SAMA PERSIS dengan yang ada di TRUCKER,
   sampai ke nomor barisnya:

       59950-59970  jeda sekian detik
       59980        pasang benih acak dari jam
       59990        tunggu satu tombol

   Termasuk cacatnya. Rumus waktunya mengalikan jam dengan 120, bukan 3600,
   di kedua berkas. Itu bukan salah ketik yang kebetulan berulang — itu
   sebuah PUSTAKA PRIBADI yang disalin utuh dari satu program ke program
   berikutnya, dan cacatnya ikut menumpang.

   DAN YANG PALING LAYAK DIBANDINGKAN: GAMBAR KARTU.

   Berkas ini menggambar tiga belas wajah kartu dengan EMPAT BELAS SUBRUTIN
   TERPISAH, masing-masing enam baris LOCATE/PRINT. Terhitung 98 baris (tanpa
   REM) untuk sesuatu yang di BLACKJCK.BAS — di koleksi yang sama — dikerjakan
   dalam 21 baris dengan rantai jatuh-tembus.

   Dua program, satu masalah, dan selisih hampir lima kali lipat.

   Cara ketiga melacak kartu As, pula. BJ.BAS menyembunyikan sebelasnya di
   dalam angka total; BLACKJCK.BAS memakai penghitung terpisah; berkas ini
   MENAMBAHKAN 1001 per As, jadi digit ribuannya menghitung As dan satuannya
   menyimpan nilai keras:

       2601 IF CARD=1 THEN R=1001
       5060 W=V/1000 : V=V-W*1000

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Subrutin jeda 59950-59970 habis seketika; ketiga barisnya tetap
     ditelusuri karena rumusnya sendiri yang jadi bahan.
   - `RANDOMIZE` memasang benih tetap.
   - `RUN "b:???0??"` (baris 2120) dibangkitkan sebagai galat 64 — nama
     berkas berisi kartu liar, sama seperti di TRUCKER.BAS.
   - `DEFINT A-Z` ditiru: semua penugasan angka dibulatkan.
   - Baris 622 sudah disunting pemilik koleksi (alamat penulis).
   =========================================================================== */

(function (global) {
  'use strict';

  var HEART = 3, DIAMOND = 4, CLUB = 5, SPADE = 6;

  /* `DEFINT A-Z`: SEMUA variabel angka bertipe bulat, dan penugasan ke sana
     membulatkan. Itu sebabnya `BET(1)*0.5` di baris 2920 tidak pernah
     menghasilkan pecahan. */
  function set(m, nama, nilai) { m.v[nama] = Math.round(nilai); }
  function basic(n) { return (n < 0 ? '-' : ' ') + Math.abs(n) + ' '; }
  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }
  function pet(n, baris, kolom, isi) {
    return { baris: n, jalan: function (m) {
      m.locate(baris, kolom); m.cetak(isi); m.barisBaru();
    } };
  }

  var tabel = [];
  function T(x) { tabel.push(x); return x; }

  /* --- 10-180: kepala berkas dan gelung utama --------------------------- */
  [10, 20, 30, 40, 50, 70, 80, 100, 110, 120, 130, 140, 150].forEach(function (n) {
    T(rem(n));
  });
  T({ baris: 160, jalan: function (m) { m.gosub(500); } });
  T({ baris: 170, jalan: function (m) { m.gosub(1000); } });
  /* 180 `GOTO 170` — TIDAK PERNAH DICAPAI. Subrutin 1000 masuk ke gelung
     permainan di baris 2000 dan tidak pernah RETURN. */
  T({ baris: 180, jalan: function (m) { m.lompat(170); } });

  /* --- 490-640: layar judul -------------------------------------------- */
  [490, 500, 510, 520, 530, 550, 560].forEach(function (n) { T(rem(n)); });
  /* 570 `DEFINT A-Z` juga menyiapkan larik-larik yang TIDAK PERNAH di-DIM
     di berkas ini: `NAM$()`, `BET()`, `WINNING()`, dan `T()`. BASIC membuat
     larik sebelas unsur (0 sampai 10) begitu sebuah nama dipakai dengan
     kurung tanpa DIM lebih dulu. Penelusur menyiapkannya di sini supaya
     perilakunya sama. */
  T({ baris: 570, jalan: function (m) {
      m.pasangJebakan(10, 10000); m.jebakan(10, true);
      m.dim('NAM$()', 10); m.dim('BET()', 10);
      m.dim('WINNING()', 10); m.dim('T()', 10);
    } });
  T({ baris: 580, jalan: function (m) {
      set(m, 'B', 0); set(m, 'O', 0);
    } });
  T({ baris: 590, jalan: function (m) {
      m.cls();
      set(m, 'HEART', HEART); set(m, 'DIAMOND', DIAMOND);
      set(m, 'CLUB', CLUB); set(m, 'SPADE', SPADE);
    } });
  T({ baris: 591, jalan: function (m) { m.untuk('I', 1, 12, 1, 603); } });
  /* 600-602 dua tumpuk kartu digambar DI TEMPAT YANG SAMA berulang kali —
     hati naik dari As sampai Q di kiri, sekop dari 2 sampai K di kanan.
     Animasi membalik kartu, dari satu gelung. */
  T({ baris: 600, bagian: [
      function (m) {
        set(m, 'Y', 5); set(m, 'X', 30);
        set(m, 'CARD', m.v.I); set(m, 'SUIT', HEART);
      },
      function (m) { m.gosub(20000); }
    ] });
  T({ baris: 601, bagian: [
      function (m) {
        set(m, 'Y', 5); set(m, 'X', 41);
        set(m, 'CARD', m.v.I + 1); set(m, 'SUIT', SPADE);
      },
      function (m) { m.gosub(20000); }
    ] });
  T({ baris: 602, jalan: function (m) { m.lanjutkan('I'); } });
  T({ baris: 603, bagian: [
      function (m) {
        set(m, 'Y', 5); set(m, 'X', 30);
        set(m, 'CARD', 11); set(m, 'SUIT', HEART);
      },
      function (m) { m.gosub(20000); }
    ] });
  T({ baris: 604, bagian: [
      function (m) {
        set(m, 'Y', 5); set(m, 'X', 41);
        set(m, 'CARD', 1); set(m, 'SUIT', SPADE);
      },
      function (m) { m.gosub(20000); }
    ] });
  T(pet(610, 14, 35, 'BLACKJACK'));
  T(pet(620, 16, 39, 'by'));
  T(pet(621, 17, 30, 'Hughes J. Glantzberg'));
  T(pet(622, 18, 30, ' [disunting UU PDP] '));
  T(pet(623, 19, 30, 'Carrollton, TX 75007'));
  T({ baris: 630, jalan: function (m) { m.pasangJebakan('galat', 3000); } });
  T({ baris: 635, bagian: [
      function (m) { set(m, 'TIMEOUT', 5); },
      function (m) { m.gosub(59950); }
    ] });
  T({ baris: 640, jalan: function (m) { m.kembali(); } });

  /* --- 990-1190: mulai bermain ----------------------------------------- */
  [990, 1000, 1010, 1080, 1085].forEach(function (n) { T(rem(n)); });
  T({ baris: 1100, jalan: function (m) { m.cls(); } });
  T({ baris: 1110, jalan: function (m) {
      m.locate(12, 10); m.cetak('Will there be 1 or 2 players?  ');
    } });
  T({ baris: 1120, bagian: [
      function (m) { m.gosub(59990); },
      function (m) {
        set(m, 'PLAYERS', parseInt(m.v['IKEY$'], 10) || 0);
        if (m.v.PLAYERS !== 1 && m.v.PLAYERS !== 2) m.lompat(1120);
      }
    ] });
  T({ baris: 1130, jalan: function (m) {
      m.cetak(basic(m.v.PLAYERS)); m.barisBaru();
    } });
  T({ baris: 1140, jalan: function (m) { m.untuk('I', 1, m.v.PLAYERS, 1, 1170); } });
  T({ baris: 1150, bagian: [
      function (m) {
        m.tab(10);
        m.cetak('Enter the name of player ' + basic(m.v.I) + '  ');
      },
      function (m) { m.masukan('NAM$()', '', m.v.I); }
    ] });
  T({ baris: 1160, jalan: function (m) { m.lanjutkan('I'); } });
  /* 1170 `Z=50` disetel dan TIDAK PERNAH DIBACA di mana pun. */
  T({ baris: 1170, bagian: [
      function (m) { m.gosub(59980); },
      function (m) { set(m, 'Z', 50); m.dim('A()', 64); }
    ] });
  T({ baris: 1180, jalan: function (m) {
      for (m.v.X = 1; m.v.X <= 52; m.v.X++) m.v['A()'][m.v.X] = m.v.X;
    } });
  T({ baris: 1190, bagian: [
      function (m) { m.cls(); },
      function (m) { m.gosub(1200); },
      function (m) { m.cls(); m.lompat(2000); }
    ] });

  /* --- 1200-1270: mengocok --------------------------------------------- */
  [1195, 1200, 1210, 1220, 1230].forEach(function (n) { T(rem(n)); });
  T(pet(1240, 12, 35, 'Shuffling'));
  /* 1250-1260 SERATUS LIMA PULUH ENAM KALI TUKAR ACAK — tiga kali jumlah
     kartunya. Bukan Fisher-Yates: kedua indeksnya diundi bebas, jadi
     sebarannya tidak persis seragam, tapi cukup dekat. */
  T({ baris: 1250, jalan: function (m) { m.untuk('L', 1, 156, 1, 1270); } });
  T({ baris: 1260, bagian: [
      function (m) {
        set(m, 'X', Math.trunc(m.acak() * 52) + 1);
        set(m, 'Y', Math.trunc(m.acak() * 52) + 1);
        var t = m.v['A()'][m.v.X];
        m.v['A()'][m.v.X] = m.v['A()'][m.v.Y];
        m.v['A()'][m.v.Y] = t;
      },
      function (m) { m.lanjutkan('L'); },
      function (m) { set(m, 'J', 1); }
    ] });
  T({ baris: 1270, jalan: function (m) {
      m.locate(12, 35); m.spc(9); m.kembali();
    } });

  /* --- 1300-1360: nomor kartu jadi pangkat dan lambang ------------------ */
  [1295, 1300, 1310, 1320, 1330].forEach(function (n) { T(rem(n)); });
  T({ baris: 1340, jalan: function (m) {
      set(m, 'SUIT', Math.trunc((m.v['A()'][m.v.J] - 1) / 13));
    } });
  T({ baris: 1350, jalan: function (m) {
      set(m, 'CARD', m.v['A()'][m.v.J] - m.v.SUIT * 13);
    } });
  /* 1352-1358 nomor lambang 0-3 diterjemahkan jadi KODE AKSARA CP437.
     Urutannya sengaja dari tiga ke nol, supaya penerjemahan sebelumnya
     tidak dibaca lagi oleh baris berikutnya. */
  T(lambang(1352, 3, CLUB));
  T(lambang(1354, 2, SPADE));
  T(lambang(1356, 1, DIAMOND));
  T(lambang(1358, 0, HEART));
  T({ baris: 1360, jalan: function (m) { m.kembali(); } });

  /* --- 1400-1470: tempat kartu di layar -------------------------------- */
  [1395, 1400, 1410, 1420, 1430].forEach(function (n) { T(rem(n)); });
  T({ baris: 1440, jalan: function (m) { set(m, 'X', (m.v.N - 1) * 11 + 1); } });
  T({ baris: 1450, jalan: function (m) { set(m, 'Y', (m.v.M - 1) * 8 + 1); } });
  T({ baris: 1460, jalan: function (m) { m.gosub(20000); } });
  T({ baris: 1470, jalan: function (m) { m.kembali(); } });

  /* --- 2000-2940: satu putaran ----------------------------------------- */
  [1990, 2000, 2010, 2050, 2060].forEach(function (n) { T(rem(n)); });
  T({ baris: 2070, jalan: function (m) { m.locate(25, 10); } });
  T({ baris: 2080, jalan: function (m) {
      m.cetak("Press `E' to quit playing");
    } });
  T({ baris: 2100, jalan: function (m) { m.untuk('X', 1, m.v.PLAYERS, 1, 2140); } });
  T({ baris: 2105, jalan: function (m) { m.locate(11 + m.v.X, 10); } });
  T({ baris: 2110, bagian: [
      function (m) {
        m.cetak((m.v['NAM$()'][m.v.X] || '') + ', what is your bet?  $');
      },
      function (m) { m.masukan('IN$', ''); }
    ] });
  /* 2120 nama berkas yang sama dengan TRUCKER.BAS: `b:???0??`, berisi kartu
     liar yang tidak diterima RUN. Penanda sementara yang tidak pernah diisi,
     dan ia dipakai ulang di program berikutnya. */
  T({ baris: 2120, jalan: function (m) {
      if (m.v['IN$'] === 'E' || m.v['IN$'] === 'e') {
        m.galat(64, 'Bad file name: b:???0??');
      } else m.v['BET()'][m.v.X] = Math.round(parseFloat(m.v['IN$']) || 0);
    } });
  T({ baris: 2130, jalan: function (m) { m.lanjutkan('X'); } });
  T({ baris: 2140, jalan: function (m) { m.gosub(4000); } });
  T({ baris: 2150, jalan: function (m) {
      set(m, 'X1', 0); set(m, 'X2', 0);
      if (m.v.R === 1001) m.lompat(2170);
    } });
  T({ baris: 2160, jalan: function (m) {
      if (m.v['A()'][59] === 1011) m.lompat(2300); else m.lompat(2500);
    } });
  T({ baris: 2170, bagian: [
      function (m) { m.untuk('X', 1, m.v.PLAYERS, 1, 2220); },
      function (m) {
        m.locate(25, 1); m.spc(79); m.locate(25, 1);
        m.cetak((m.v['NAM$()'][m.v.X] || '') + ', insurance (y or n)? ');
      }
    ] });
  T({ baris: 2180, bagian: [
      function (m) { m.gosub(59990); },
      function (m) { if ('YNyn'.indexOf(m.v['IKEY$']) < 0) m.lompat(2180); }
    ] });
  T(asuransi(2190, 1, 'X1'));
  T(asuransi(2200, 2, 'X2'));
  T({ baris: 2210, jalan: function (m) { m.lanjutkan('X'); } });
  T({ baris: 2220, jalan: function (m) {
      if (m.v['A()'][59] !== 1011) m.lompat(2900);
    } });
  T({ baris: 2300, bagian: [
      function (m) {
        set(m, 'H', m.v.J); set(m, 'J', 0); set(m, 'N', 1); set(m, 'M', 3);
      },
      function (m) { m.gosub(1300); },
      function (m) { m.gosub(1400); },
      function (m) { m.locate(18, 65); m.cetak('BLACKJACK'); }
    ] });
  T({ baris: 2310, jalan: function (m) { set(m, 'J', m.v.H); } });
  T({ baris: 2320, jalan: function (m) { m.lompat(5050); } });
  /* 2500 `STEP 3-PLAYERS`: dengan satu pemain langkahnya 2, jadi M jalan
     1 lalu 3 — melewati pemain kedua. Dengan dua pemain langkahnya 1. Satu
     ungkapan yang mengurus kedua kasus. */
  T({ baris: 2500, jalan: function (m) {
      m.untuk('M', 1, 2, 3 - m.v.PLAYERS, 5000);
    } });
  T({ baris: 2510, jalan: function (m) { set(m, 'N', 3); } });
  T({ baris: 2520, jalan: function (m) {
      m.locate(5, 65); m.cetak(m.v['NAM$()'][1] || '');
    } });
  T({ baris: 2530, jalan: function (m) {
      m.locate(18, 65); m.cetak('Dealer');
    } });
  T({ baris: 2540, jalan: function (m) {
      m.locate(25, 1); m.spc(70);
      if (m.v.M === 1) {
        m.locate(25, 1); m.cetak(m.v['NAM$()'][1] || ''); set(m, 'L', 2);
      } else {
        m.locate(11, 65); m.cetak(m.v['NAM$()'][2] || '');
        m.locate(25, 1); m.cetak(m.v['NAM$()'][2] || ''); set(m, 'L', 3);
      }
    } });
  T({ baris: 2550, jalan: function (m) {
      m.cetak("'s turn - 1=HIT, 2=STAND, 3=DOUBLE, 4=REVIEW CARDS");
    } });
  T({ baris: 2560, bagian: [
      function (m) { m.gosub(59990); },
      function (m) {
        if ('1234'.indexOf(m.v['IKEY$']) < 0) m.lompat(2560);
        else set(m, 'X', parseInt(m.v['IKEY$'], 10));
      }
    ] });
  /* 2570 `GOTO 2540` di ujungnya TIDAK PERNAH DICAPAI: baris 2560 sudah
     menjamin X bernilai 1 sampai 4, dan keempatnya punya sasaran. */
  T({ baris: 2570, jalan: function (m) {
      set(m, 'Q', 56 + m.v.M);
      var ke = [2600, 2660, 2800, 6000][m.v.X - 1];
      if (ke) m.lompat(ke); else m.lompat(2540);
    } });
  T({ baris: 2580, jalan: function (m) { m.lanjutkan('M'); } });
  T({ baris: 2600, bagian: [
      function (m) { m.gosub(1300); },
      function (m) { m.gosub(1400); },
      function (m) {
        set(m, 'J', m.v.J + 1);
        set(m, 'R', m.v.CARD > 9 ? 10 : m.v.CARD);
      }
    ] });
  /* 2601 KARTU AS BERNILAI 1001. Digit ribuannya jadi PENGHITUNG As, dan
     satuannya nilai keras. Cara ketiga melacak As di koleksi ini. */
  T({ baris: 2601, jalan: function (m) {
      if (m.v.CARD === 1) set(m, 'R', 1001);
    } });
  T({ baris: 2602, jalan: function (m) {
      m.v['A()'][m.v.Q] = (m.v['A()'][m.v.Q] || 0) + m.v.R;
    } });
  T({ baris: 2610, jalan: function (m) {
      var a = m.v['A()'][m.v.Q];
      if (a < 1000 && a > 21) m.lompat(2650);
    } });
  T({ baris: 2620, jalan: function (m) {
      var a = m.v['A()'][m.v.Q];
      if (a - Math.trunc(a / 1000) * 1000 > 21) m.lompat(2650);
    } });
  T({ baris: 2630, jalan: function (m) {
      set(m, 'N', m.v.N + 1);
      if (m.v.O === 99) { set(m, 'O', 0); m.lompat(2660); }
      else m.lompat(2540);
    } });
  T({ baris: 2650, jalan: function (m) {
      m.locate(25, 1); m.spc(79); m.barisBaru();
      m.locate(25, 1); m.cetak('BUST!');
      set(m, 'B', m.v.B + 1);
    } });
  /* 2660 `A(Q)=9000` — nilai ajaib untuk "blackjack". Larik yang sama
     menyimpan kartu dek (1-52), total tangan, DAN penanda seperti ini. */
  T({ baris: 2660, jalan: function (m) {
      if (m.v.N === 3 && m.v['A()'][m.v.Q] === 1011) m.v['A()'][m.v.Q] = 9000;
    } });
  T({ baris: 2670, jalan: function (m) {
      set(m, 'T', m.v.J); m.lompat(2580);
    } });
  /* 2800 DOUBLE DOWN MENGGANDAKAN `T(L)` — larik yang tidak pernah di-DIM
     dan tidak pernah dibaca di mana pun. Taruhannya `BET(X)`. Jadi
     "double" menambah satu kartu, tapi TIDAK menggandakan taruhan. */
  T({ baris: 2800, jalan: function (m) {
      if (m.v.N !== 3) m.lompat(2540);
      else {
        set(m, 'O', 99);
        m.v['T()'][m.v.L] = (m.v['T()'][m.v.L] || 0) * 2;
        m.lompat(2600);
      }
    } });
  T({ baris: 2900, jalan: function (m) {
      m.locate(25, 1); m.spc(79); m.locate(25, 1);
      m.cetak('No Blackjack!');
    } });
  T({ baris: 2910, bagian: [
      function (m) { set(m, 'TIMEOUT', 5); },
      function (m) { m.gosub(59950); }
    ] });
  /* 2920-2930 TARUHANNYA SENDIRI YANG DIPOTONG SETENGAH — bukan pembayaran
     asuransi yang dicatat terpisah. Dan jalur ini cuma dilewati kalau bandar
     TIDAK punya blackjack; kalau ia punya (2160 ke 2300), asuransinya tidak
     pernah dibayar sama sekali. */
  T(potong(2920, 'X1', 1));
  T(potong(2930, 'X2', 2));
  T({ baris: 2940, jalan: function (m) { m.lompat(2500); } });

  /* --- 3000-3100: penangan galat --------------------------------------- */
  [2990, 3000, 3010, 3060, 3070].forEach(function (n) { T(rem(n)); });
  /* 3080 galat 4 adalah "Out of DATA" — dan berkas ini TIDAK PUNYA SATU PUN
     pernyataan DATA. Penangan untuk kejadian yang tidak mungkin. */
  T({ baris: 3080, jalan: function (m) {
      if (m.v.ERR === 4) { m.ulangData(0); m.lanjut(); }
    } });
  /* 3085 galat 71 di baris 2090 — dan BARIS 2090 TIDAK ADA di berkas ini. */
  T({ baris: 3085, jalan: function (m) {
      if (m.v.ERR === 71 && m.v.ERL === 2090) m.jalankan('BLACK');
    } });
  T({ baris: 3090, jalan: function (m) {
      m.cetak('error ' + basic(m.v.ERR) + ' occurred in line ' + basic(m.v.ERL));
      m.barisBaru();
    } });
  T({ baris: 3100, jalan: function (m) { m.henti('STOP di baris 3100'); } });

  /* --- 4000-4530: membagi kartu ---------------------------------------- */
  [3990, 4000, 4010, 4020, 4030].forEach(function (n) { T(rem(n)); });
  T({ baris: 4040, jalan: function (m) { m.cls(); } });
  T({ baris: 4050, jalan: function (m) { m.untuk('N', 1, 2, 1, 4071); } });
  T({ baris: 4060, jalan: function (m) {
      m.untuk('M', 1, 3, 3 - m.v.PLAYERS, 4071);
    } });
  /* 4070 kartu PERTAMA bandar (M=3, N=1) digambar lewat 4500 — tertutup. */
  T({ baris: 4070, bagian: [
      function (m) {
        if (m.v.M === 3 && m.v.N === 1) m.gosub(4500); else m.gosub(4200);
      }
    ] });
  T({ baris: 4071, bagian: [
      function (m) { m.lanjutkan('M'); },
      function (m) { m.lanjutkan('N'); },
      function (m) { m.kembali(); }
    ] });
  T({ baris: 4200, bagian: [
      function (m) { m.gosub(1300); },
      function (m) { m.gosub(1400); },
      function (m) { set(m, 'J', m.v.J + 1); }
    ] });
  T({ baris: 4205, jalan: function (m) {
      set(m, 'R', m.v.CARD > 9 ? 10 : m.v.CARD);
    } });
  T({ baris: 4207, jalan: function (m) {
      if (m.v.CARD === 1) set(m, 'R', 1001);
    } });
  T({ baris: 4210, jalan: function (m) {
      m.v['A()'][56 + m.v.M] = (m.v['A()'][56 + m.v.M] || 0) + m.v.R;
    } });
  T({ baris: 4220, jalan: function (m) { m.kembali(); } });
  /* 4500-4520 KARTU TERTUTUP BANDAR: nilainya disimpan di `A(0)` dan
     `A(59)`, tapi `CARD` dinolkan sebelum digambar — dan kartu bernomor nol
     adalah wajah KOSONG di baris 20500. Satu variabel yang dinolkan, dan
     kartunya jadi tertutup. */
  T({ baris: 4500, bagian: [
      function (m) { set(m, 'K', m.v.J); },
      function (m) { m.gosub(1300); },
      function (m) {
        m.v['A()'][0] = m.v['A()'][m.v.J];
        set(m, 'J', m.v.J + 1);
        set(m, 'R', m.v.CARD > 9 ? 10 : m.v.CARD);
      }
    ] });
  T({ baris: 4505, jalan: function (m) {
      set(m, 'CARD', 0);
      if (m.v.R === 1) set(m, 'R', 1001);
    } });
  T({ baris: 4510, jalan: function (m) { m.gosub(1400); } });
  T({ baris: 4520, jalan: function (m) { m.v['A()'][59] = m.v.R; } });
  T({ baris: 4530, jalan: function (m) { m.kembali(); } });

  /* --- 5000-5640: giliran bandar dan pembayaran ------------------------ */
  [4990, 5000, 5010, 5020, 5030].forEach(function (n) { T(rem(n)); });
  T({ baris: 5035, jalan: function (m) { m.locate(25, 1); m.spc(79); } });
  T({ baris: 5040, bagian: [
      function (m) {
        set(m, 'N', 1); set(m, 'M', 3); set(m, 'W', m.v.J); set(m, 'J', 0);
      },
      function (m) { m.gosub(1300); },
      function (m) { m.gosub(1400); },
      function (m) { set(m, 'J', m.v.W); }
    ] });
  T({ baris: 5050, jalan: function (m) {
      set(m, 'V', m.v['A()'][59]); set(m, 'N', 3);
      if (m.v.B === m.v.PLAYERS) m.lompat(5500);
    } });
  /* 5060 DIGIT RIBUAN DIPISAH DARI SATUAN: `W` jumlah As, `V` nilai keras.
     Pembagian bulat mengerjakan seluruh pemisahannya. */
  T({ baris: 5060, jalan: function (m) {
      set(m, 'W', Math.round(m.v.V / 1000));
      set(m, 'V', m.v.V - m.v.W * 1000);
      set(m, 'X', 0);
      if (m.v.W > 0) set(m, 'X', 1);
    } });
  T({ baris: 5070, jalan: function (m) { if (m.v.V > 16) m.lompat(5500); } });
  /* 5080 bandar BERHENTI di soft 17 — kebalikan dari BLACKJCK.BAS di
     koleksi yang sama, yang menariknya. Dua program, dua aturan rumah. */
  T({ baris: 5080, jalan: function (m) {
      if (m.v.X > 0 && m.v.V + 10 > 16 && m.v.V + 10 < 22) {
        set(m, 'V', m.v.V + 10); m.lompat(5500);
      }
    } });
  T({ baris: 5090, bagian: [
      function (m) { m.gosub(1300); },
      function (m) { m.gosub(1400); },
      function (m) {
        set(m, 'J', m.v.J + 1);
        set(m, 'R', m.v.CARD > 9 ? 10 : m.v.CARD);
      }
    ] });
  T({ baris: 5100, jalan: function (m) {
      set(m, 'V', m.v.V + m.v.R + m.v.W * 1000);
      set(m, 'N', m.v.N + 1); m.lompat(5060);
    } });
  T({ baris: 5500, bagian: [
      function (m) { m.untuk('X', 1, m.v.PLAYERS, 1, 5560); },
      function (m) {
        set(m, 'U', m.v['A()'][56 + m.v.X]);
        set(m, 'Y', Math.round(m.v.U / 1000));
        set(m, 'U', m.v.U - m.v.Y * 1000);
      }
    ] });
  T({ baris: 5510, jalan: function (m) {
      if (m.v.Y > 0 && m.v.U + 10 < 22) set(m, 'U', m.v.U + 10);
      else if (m.v.U > 21) set(m, 'U', 0);
    } });
  /* 5520 bandar bust ditandai `V=1` — bukan nol, bukan negatif. Angka satu
     dipilih karena ia lebih kecil dari tangan sah mana pun, dan tetap lebih
     besar dari nol yang dipakai baris 5510 untuk pemain yang bust. */
  T({ baris: 5520, jalan: function (m) { if (m.v.V > 21) set(m, 'V', 1); } });
  T({ baris: 5530, jalan: function (m) { set(m, 'Y', (m.v.X - 1) * 6 + 5); } });
  /* 5535 blackjack dibayar DUA KALI taruhan. Aturan kasino 3:2. */
  T({ baris: 5535, jalan: function (m) {
      if (m.v['A()'][56 + m.v.X] === 9000) {
        m.locate(m.v.Y, 65); m.cetak('BLACKJACK');
        m.v['WINNING()'][m.v.X] =
          (m.v['WINNING()'][m.v.X] || 0) + m.v['BET()'][m.v.X] * 2;
        m.lompat(5550);
      }
    } });
  T({ baris: 5540, jalan: function (m) {
      var W = m.v['WINNING()'], BE = m.v['BET()'][m.v.X] || 0;
      m.locate(m.v.Y, 65);
      if (m.v.V === m.v.U) m.cetak('PUSH      ');
      else if (m.v.V > m.v.U) {
        m.cetak('LOSE      ');
        W[m.v.X] = (W[m.v.X] || 0) - BE;
      } else {
        m.cetak('WIN       ');
        W[m.v.X] = (W[m.v.X] || 0) + BE;
      }
    } });
  T({ baris: 5550, jalan: function (m) { m.lanjutkan('X'); } });
  T({ baris: 5560, jalan: function (m) {
      for (m.v.X = 55; m.v.X <= 59; m.v.X++) m.v['A()'][m.v.X] = 0;
      set(m, 'B', 0);
    } });
  T({ baris: 5570, bagian: [
      function (m) { set(m, 'TIMEOUT', 5); },
      function (m) { m.gosub(59950); }
    ] });
  T({ baris: 5580, jalan: function (m) {
      m.cls(); m.locate(3, 37); m.cetak('SO FAR'); m.barisBaru();
      set(m, 'X', 0);
    } });
  T(saldo(5590, 5, 1));
  T({ baris: 5600, jalan: function (m) { if (m.v.PLAYERS === 1) m.lompat(5620); } });
  T(saldo(5610, 6, 2));
  T({ baris: 5620, bagian: [
      function (m) { set(m, 'TIMEOUT', 5); },
      function (m) { m.gosub(59950); }
    ] });
  /* 5630 dek dikocok ulang sesudah kartu ke-42 dari 52 — sepuluh kartu
     terakhir tidak pernah dibagikan. */
  T({ baris: 5630, bagian: [
      function (m) { if (!(m.v.J > 42)) m.lompat(5640); },
      function (m) { m.gosub(1200); }
    ] });
  T({ baris: 5640, jalan: function (m) { m.lompat(2000); } });

  /* --- 6000-6160: melihat kartu yang sudah keluar ---------------------- */
  [5990, 6000, 6010, 6020, 6030].forEach(function (n) { T(rem(n)); });
  T({ baris: 6040, jalan: function (m) {
      for (m.v.X = 57; m.v.X <= 59; m.v.X++) m.v['A()'][m.v.X] = 0;
    } });
  T({ baris: 6050, jalan: function (m) {
      m.cls(); set(m, 'W', m.v.J); set(m, 'J', 0);
      m.locate(1, 10); m.cetak('HEARTS'); m.tab(30); m.cetak('DIAMONDS');
      m.tab(50); m.cetak('CLUBS'); m.tab(70); m.cetak('SPADES');
      m.barisBaru();
    } });
  T(pet(6060, 3, 1, 'ACE'));
  T({ baris: 6070, jalan: function (m) {
      for (m.v.Y = 4; m.v.Y <= 12; m.v.Y++) {
        m.locate(m.v.Y, 1); m.cetak(basic(m.v.Y - 2)); m.barisBaru();
      }
    } });
  T({ baris: 6080, jalan: function (m) {
      m.locate(13, 1); m.cetak('JACK'); m.barisBaru();
      m.locate(14, 1); m.cetak('QUEEN'); m.barisBaru();
      m.locate(15, 1); m.cetak('KING'); m.barisBaru();
    } });
  /* 6090 `J` DIPAKAI SEBAGAI PENCACAH GELUNG — dan J adalah penunjuk dek.
     Nilainya diselamatkan di `W` (baris 6050) dan dikembalikan di 6120. */
  T({ baris: 6090, bagian: [
      function (m) { m.untuk('J', 1, m.v.K - m.v.PLAYERS, 1, 6110); },
      function (m) { m.gosub(1300); },
      function (m) {
        set(m, 'E', (m.v.SUIT - 3) * 20 + 15);
        set(m, 'F', m.v.CARD + 2);
      }
    ] });
  T({ baris: 6100, bagian: [
      function (m) {
        m.locate(m.v.F, m.v.E); m.cetak(m.chr(220));
      },
      function (m) { m.lanjutkan('J'); }
    ] });
  T({ baris: 6110, bagian: [
      function (m) { set(m, 'TIMEOUT', 5); },
      function (m) { m.gosub(59950); }
    ] });
  T({ baris: 6120, bagian: [
      function (m) { m.cls(); set(m, 'J', m.v.K - m.v.PLAYERS); },
      function (m) { m.gosub(4000); },
      function (m) { set(m, 'M', 1); set(m, 'N', 3); }
    ] });
  T({ baris: 6130, jalan: function (m) {
      if (m.v.J === m.v.T) { set(m, 'M', 2); set(m, 'N', 3); }
    } });
  T({ baris: 6140, jalan: function (m) { if (m.v.J === m.v.W) m.lompat(2520); } });
  T({ baris: 6150, bagian: [
      function (m) { m.gosub(1300); },
      function (m) { m.gosub(1400); },
      function (m) { set(m, 'R', m.v.CARD > 9 ? 10 : m.v.CARD); }
    ] });
  T({ baris: 6160, jalan: function (m) {
      m.v['A()'][56 + m.v.M] = (m.v['A()'][56 + m.v.M] || 0) + m.v.R;
      set(m, 'N', m.v.N + 1); m.lompat(6130);
    } });

  T(rem(9990));
  T({ baris: 10000, jalan: function (m) { m.jalankan('MENU'); } });

  /* --- 20000-30860: menggambar kartu ----------------------------------- */
  [19990, 20000, 20010, 20020, 20030, 20040, 20050, 20060].forEach(function (n) {
    T(rem(n));
  });
  T({ baris: 20070, jalan: function (m) {
      m.locate(m.v.Y, m.v.X);
      m.cetak(m.chr(201) + m.ulang(7, 205) + m.chr(187));
    } });
  /* 20080 EMPAT BELAS SASARAN, satu per wajah kartu — dan `CARD=0` memilih
     yang pertama: kartu kosong, punggung kartu tertutup bandar. */
  T({ baris: 20080, bagian: [
      function (m) {
        var d = [20500, 30000, 30120, 30203, 30263, 30323, 30383, 30443,
                 30493, 30553, 30613, 30673, 30733, 30793];
        m._ke = d[m.v.CARD];
        if (!m._ke) m.lompat(20090);
      },
      function (m) { m.gosub(m._ke); }
    ] });
  T({ baris: 20090, jalan: function (m) {
      m.locate(m.v.Y + 7, m.v.X);
      m.cetak(m.chr(200) + m.ulang(7, 205) + m.chr(188));
    } });
  T({ baris: 20100, jalan: function (m) { m.kembali(); } });

  /* Empat belas wajah kartu. Tiap wajah enam baris `LOCATE`/`PRINT` dengan
     isi tujuh aksara, lalu satu `RETURN`. Seratus empat puluh baris untuk
     apa yang BLACKJCK.BAS kerjakan dalam dua puluh satu.

     Perhatikan dua penyimpangan penomoran yang tertinggal:
       - kartu 7 memakai 30475 di tengah 30470 dan 30480 — sebuah baris yang
         DISISIPKAN belakangan, waktu wajah tujuh dibedakan dari enam;
       - RETURN kartu K bernomor 30860, bukan 30851 seperti pola yang lain.
     Keduanya jejak penyuntingan yang tidak dirapikan. */
  var WAJAH = [
    { rem: [20495, 20500, 20510, 20520, 20530],
      no: [20550, 20560, 20570, 20580, 20590, 20600], pulang: 20610,
      isi: ['       ', '       ', '       ', '       ', '       ', '       '] },
    { rem: [29990, 30000, 30010, 30020, 30030],
      no: [30050, 30060, 30070, 30080, 30090, 30100], pulang: 30110,
      isi: ['A      ', '       ', '   S   ', '       ', '       ', '      A'] },
    { rem: [30119, 30120, 30130, 30140, 30145],
      no: [30150, 30160, 30170, 30180, 30190, 30200], pulang: 30201,
      isi: ['2      ', '   S   ', '       ', '       ', '   S   ', '      2'] },
    { rem: [30202, 30203, 30204, 30205, 30206],
      no: [30210, 30220, 30230, 30240, 30250, 30260], pulang: 30261,
      isi: ['3      ', '   S   ', '   S   ', '       ', '   S   ', '      3'] },
    { rem: [30262, 30263, 30264, 30265, 30266],
      no: [30270, 30280, 30290, 30300, 30310, 30320], pulang: 30321,
      isi: ['4      ', '  S S  ', '       ', '       ', '  S S  ', '      4'] },
    { rem: [30322, 30323, 30324, 30325, 30326],
      no: [30330, 30340, 30350, 30360, 30370, 30380], pulang: 30381,
      isi: ['5      ', '  S S  ', '   S   ', '       ', '  S S  ', '      5'] },
    { rem: [30382, 30383, 30384, 30385, 30386],
      no: [30390, 30400, 30410, 30420, 30430, 30440], pulang: 30441,
      isi: ['6      ', '  S S  ', '  S S  ', '       ', '  S S  ', '      6'] },
    { rem: [30442, 30443, 30444, 30445, 30446],
      no: [30450, 30460, 30470, 30475, 30480, 30490], pulang: 30491,
      isi: ['7      ', '  S S  ', '   S   ', '  S S  ', '  S S  ', '      7'] },
    { rem: [30492, 30493, 30494, 30495, 30496],
      no: [30500, 30510, 30520, 30530, 30540, 30550], pulang: 30551,
      isi: ['8      ', '  SSS  ', '  S S  ', '       ', '  SSS  ', '      8'] },
    { rem: [30552, 30553, 30554, 30555, 30556],
      no: [30560, 30570, 30580, 30590, 30600, 30610], pulang: 30611,
      isi: ['9      ', '  S S  ', '  SSS  ', '  S S  ', '  S S  ', '      9'] },
    { rem: [30612, 30613, 30614, 30615, 30616],
      no: [30620, 30630, 30640, 30650, 30660, 30670], pulang: 30671,
      isi: ['10     ', '  SSS  ', '  S S  ', '  S S  ', '  SSS  ', '     10'] },
    { rem: [30672, 30673, 30674, 30675, 30676],
      no: [30680, 30690, 30700, 30710, 30720, 30730], pulang: 30731,
      isi: ['J      ', '    S  ', '       ', '       ', '  S    ', '      J'] },
    { rem: [30732, 30733, 30734, 30735, 30736],
      no: [30740, 30750, 30760, 30770, 30780, 30790], pulang: 30791,
      isi: ['Q      ', '    S  ', '       ', '       ', '  S    ', '      Q'] },
    { rem: [30792, 30793, 30794, 30795, 30796],
      no: [30800, 30810, 30820, 30830, 30840, 30850], pulang: 30860,
      isi: ['K      ', '  S    ', '       ', '       ', '    S  ', '      K'] }
  ];
  WAJAH.forEach(function (w) {
    w.rem.forEach(function (n) { T(rem(n)); });
    w.no.forEach(function (n, i) {
      T({ baris: n, jalan: function (m) {
        m.locate(m.v.Y + i + 1, m.v.X);
        m.cetak(m.chr(186) +
                w.isi[i].replace(/S/g, m.chr(m.v.SUIT)) +
                m.chr(186));
      } });
    });
    T({ baris: w.pulang, jalan: function (m) { m.kembali(); } });
  });

  /* --- 59950-59990: PUSTAKA PRIBADI, sama persis dengan TRUCKER.BAS ---- */
  /* 59950-59970 jam dikali 120, bukan 3600 — cacat yang sama, di berkas
     yang berbeda, dengan nomor baris yang sama. Lihat halaman TRUCKER. */
  T({ baris: 59950, jalan: function (m) {
      set(m, 'TIME2', 10 * 120 + 43 * 60 + 7);
    } });
  T({ baris: 59960, jalan: function (m) {
      set(m, 'TIME3', m.v.TIME2 + m.v.TIMEOUT);
    } });
  T({ baris: 59970, jalan: function (m) {
      if (m.v.TIMEOUT > m.v.TIME3 - m.v.TIME2) m.lompat(59960);
      else m.kembali();
    } });
  T({ baris: 59980, jalan: function (m) {
      set(m, 'RNDVAL', 10 * 120 + 43 * 60 + 7);
      m.semai(m.v.RNDVAL); m.kembali();
    } });
  T({ baris: 59990, jalan: function (m) {
      m.v['IKEY$'] = m.inkey();
      if (m.v['IKEY$'] === '') m.lompat(59990); else m.kembali();
    } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  function lambang(n, dari, ke) {
    return { baris: n, jalan: function (m) {
      if (m.v.SUIT === dari) set(m, 'SUIT', ke);
    } };
  }
  function asuransi(n, pemain, bendera) {
    return { baris: n, jalan: function (m) {
      if (m.v.X === pemain &&
          (m.v['IKEY$'] === 'y' || m.v['IKEY$'] === 'Y')) set(m, bendera, 1);
    } };
  }
  function potong(n, bendera, pemain) {
    return { baris: n, jalan: function (m) {
      if (m.v[bendera] === 1) {
        m.v['BET()'][pemain] = Math.round(m.v['BET()'][pemain] * 0.5);
      }
    } };
  }
  function saldo(n, baris, pemain) {
    return { baris: n, jalan: function (m) {
      var w = m.v['WINNING()'][pemain] || 0;
      m.locate(baris, 30);
      m.cetak((m.v['NAM$()'][pemain] || '') + ' has $' +
              w.toFixed(2).replace(/\B(?=(\d{3})+(?!\d)\.)/g, ','));
      m.barisBaru();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BLACK'] = {
    nama: 'BLACK',
    judul: 'Blackjack (Hughes J. Glantzberg) — satu atau dua pemain',
    sumber: 'BLACK',
    berkas: 'run/BLACK.BAS',
    tabel: tabel,
    benih: 89,

    arsitektur: {
      judul: 'Alur BLACK.BAS',
      simpul: [
        { id: 'judul', baris: '570-640', jenis: 'mulai',
          teks: ['Dua tumpuk kartu dibalik', 'di tempat yang sama'] },
        { id: 'siap', baris: '1100-1190', jenis: 'putusan',
          teks: ['Satu atau dua pemain,', 'lalu namanya'] },
        { id: 'kocok', baris: '1200-1270', jenis: 'subrutin',
          teks: ['156 kali tukar acak', '— tiga kali jumlah kartunya'] },
        { id: 'bagi', baris: '4000-4530',
          teks: ['Dua kartu tiap orang;', 'kartu bandar digambar KOSONG'] },
        { id: 'gambar', baris: '20000-30860', jenis: 'subrutin',
          teks: ['14 subrutin terpisah,', '140 baris'] },
        { id: 'main', baris: '2500-2800', jenis: 'putusan',
          teks: ['1 hit, 2 stand,', '3 double, 4 lihat kartu'] },
        { id: 'bandar', baris: '5000-5100',
          teks: ['Berhenti di soft 17;', 'As disimpan di digit ribuan'] },
        { id: 'bayar', baris: '5500-5640', jenis: 'keluar',
          teks: ['WIN / LOSE / PUSH;', 'blackjack dibayar 2:1'] }
      ],
      panah: [
        { dari: 'judul', ke: 'siap' },
        { dari: 'siap', ke: 'kocok' },
        { dari: 'kocok', ke: 'bagi' },
        { dari: 'bagi', ke: 'gambar' },
        { dari: 'gambar', ke: 'main' },
        { dari: 'main', ke: 'gambar', label: 'hit' },
        { dari: 'main', ke: 'bandar', label: 'semua berhenti' },
        { dari: 'bandar', ke: 'bayar' },
        { dari: 'bayar', ke: 'main', label: 'putaran berikutnya' },
        { dari: 'bayar', ke: 'kocok', label: 'kartu ke-42' }
      ]
    },

    pseudokode: [
      { baris: 2601, tingkat: 0, teks: 'As bernilai <b>1001</b> &mdash; digit ribuan menghitung As, satuan menyimpan nilai keras' },
      { baris: 5060, tingkat: 1, teks: '<code>W=V/1000 : V=V-W*1000</code> memisahkan keduanya dengan bagi bulat' },
      { baris: 2660, tingkat: 1, teks: '<code>A(Q)=9000</code> &mdash; nilai ajaib untuk blackjack, di larik yang sama' },
      { baris: 4505, tingkat: 0, teks: '<code>CARD=0</code> &rarr; wajah <b>kosong</b>: begitulah kartu bandar ditutup' },
      { baris: 20080, tingkat: 0, teks: '<code>ON CARD+1 GOSUB</code> &mdash; <b>14 subrutin</b>, 98 baris, satu per wajah' },
      { baris: 2500, tingkat: 0, teks: '<code>STEP 3-PLAYERS</code> mengurus satu maupun dua pemain dengan satu gelung' },
      { baris: 5080, tingkat: 0, teks: 'bandar <b>berhenti</b> di soft 17 &mdash; kebalikan BLACKJCK.BAS di koleksi yang sama' },
      { baris: 2800, tingkat: 0, teks: 'double menggandakan <code>T(L)</code> &mdash; larik yang <b>tidak pernah dibaca</b>' },
      { baris: 59950, tingkat: 0, teks: 'jam &times; 120, bukan 3600 &mdash; <b>cacat yang sama persis dengan TRUCKER.BAS</b>' }
    ],

    perintahAsli: 'run\\BLACK.bat',
    catatanAsli: 'Satu atau dua pemain. 1 = ambil kartu, 2 = berhenti, ' +
      '3 = double, 4 = lihat kartu yang sudah keluar. Ketik E sebagai ' +
      'taruhan untuk keluar. F10 kembali ke menu.',

    penyimpangan: [
      '<b>Subrutin jeda 59950-59970 habis seketika</b>; ketiga barisnya tetap ' +
      'ditelusuri karena rumusnya sendiri yang jadi bahan halaman ini.',

      '<b><code>RANDOMIZE</code> memasang benih tetap.</b> Baris 59980 tetap ' +
      'dijalankan supaya terlihat bahwa benihnya dibangun dari jam sistem.',

      '<b><code>RUN "b:???0??"</code> dibangkitkan sebagai galat 64</b> ' +
      '(Bad file name) &mdash; nama berkasnya berisi kartu liar yang tidak ' +
      'diterima <code>RUN</code>. Persis sama dengan TRUCKER.BAS.',

      '<b><code>DEFINT A-Z</code> ditiru</b>: semua penugasan angka ' +
      'dibulatkan. Itu yang membuat <code>BET(1)*0.5</code> di baris 2920 ' +
      'tidak pernah menghasilkan pecahan.',

      '<b><code>ON ERROR GOTO 3000</code> dipasang tapi tidak terpicu</b> di ' +
      'jalur mana pun yang bisa dijalankan penelusur.',

      '<b>Baris 622 sudah disunting pemilik koleksi</b> (alamat rumah penulis).'
    ],

    pelajaran: {
      ringkas: 'Program kedua Hughes Glantzberg di koleksi ini &mdash; dengan ' +
        'tiga subrutin yang disalin utuh dari TRUCKER.BAS, cacatnya ikut, ' +
        'dan gambar kartu yang lima belas kali lebih panjang daripada ' +
        'tetangganya di disket yang sama.',
      pelajari: [
        ['Pustaka pribadi, dengan nomor baris yang dipesan',
         'Baris 59950 sampai 59990 di berkas ini <b>sama persis</b> dengan ' +
         '<a href="trucker.html">TRUCKER.BAS</a>: jeda, pemasang benih acak, ' +
         'dan pembaca satu tombol.',
         'Terverifikasi baris demi baris: 59950, 59960, 59970, dan 59990 ' +
         '<b>identik aksara demi aksara</b> di kedua berkas; 59980 hanya ada ' +
         'di sini.',
         'Nomor barisnya yang menarik. Lima puluh sembilan ribu &mdash; ' +
         'setinggi mungkin, sejauh mungkin dari kode program. Itu ' +
         '<b>ruang yang dipesan</b>, supaya subrutinnya bisa disalin ke ' +
         'program apa pun tanpa bentrok. Sebuah pustaka bersama, di zaman ' +
         'sebelum ada cara mengimpor apa pun.'],
        ['As disimpan di digit ribuan',
         '<code>IF CARD=1 THEN R=1001</code>. Sebuah As menambah 1001 ke ' +
         'total: satu ke satuan, dan satu ke <b>digit ribuan</b>.',
         'Baris 5060 memisahkannya kembali dengan dua operasi: ' +
         '<code>W=V/1000</code> (pembagian bulat memberi jumlah As) dan ' +
         '<code>V=V-W*1000</code> (sisanya nilai keras).',
         'Ini <b>cara ketiga</b> di koleksi ini. <a href="bj.html">BJ.BAS</a> ' +
         'menyembunyikan sebelasnya di dalam angka totalnya; ' +
         '<a href="blackjck.html">BLACKJCK.BAS</a> memakai larik penghitung ' +
         'terpisah. Tiga program, satu masalah, tiga jawaban &mdash; dan ' +
         'ketiganya benar.'],
        ['Satu larik untuk empat hal',
         '<code>A(1..52)</code> adalah dek. <code>A(57)</code> dan ' +
         '<code>A(58)</code> total tangan pemain. <code>A(59)</code> nilai ' +
         'kartu terbuka bandar. <code>A(0)</code> kartu tertutupnya. Dan ' +
         '<code>A(Q)=9000</code> penanda blackjack.',
         'Satu <code>DIM A(64)</code>, dan seluruh keadaan permainan ada di ' +
         'dalamnya. Yang membedakan artinya cuma <b>indeksnya</b> &mdash; dan ' +
         'tidak ada satu <code>REM</code> pun yang menuliskan peta itu.'],
        ['Kartu tertutup dari wajah yang kosong',
         'Baris 4505: <code>CARD=0</code>. Lalu 20080 memakai ' +
         '<code>ON CARD+1 GOSUB</code>, dan sasaran pertamanya (20500) ' +
         'menggambar kartu dengan interior kosong.',
         'Nilainya sendiri sudah disimpan di <code>A(0)</code> dan ' +
         '<code>A(59)</code> sebelum <code>CARD</code> dinolkan. Jadi ' +
         'menutup kartu bukan cabang tersendiri &mdash; ia <b>wajah nomor ' +
         'nol</b>, dan tabel lompat yang sama yang mengurusnya.'],
        ['Satu gelung untuk satu atau dua pemain',
         '<code>FOR M=1 TO 2 STEP 3-PLAYERS</code>. Dengan satu pemain, ' +
         'langkahnya 2, jadi M jalan 1 lalu 3 &mdash; melewati kursi kedua. ' +
         'Dengan dua pemain, langkahnya 1.',
         'Tidak ada percabangan. Jumlah pemainnya sendiri yang jadi langkah ' +
         'gelungnya.']
      ],
      hindari: [
        ['Sembilan puluh delapan baris untuk apa yang bisa dua puluh satu',
         'Berkas ini menggambar tiga belas wajah kartu dengan <b>empat belas ' +
         'subrutin terpisah</b>, masing-masing enam baris ' +
         '<code>LOCATE</code>/<code>PRINT</code> yang hampir sama &mdash; ' +
         '<b>98 baris</b> tanpa menghitung REM.',
         '<a href="blackjck.html">BLACKJCK.BAS</a>, di koleksi yang sama, ' +
         'mengerjakan hal yang sama dalam <b>21 baris</b> &mdash; tiap ' +
         'pangkat didefinisikan sebagai selisih dari pangkat di bawahnya, ' +
         'lewat rantai jatuh-tembus.',
         'Selisih hampir lima kali lipat. Dan yang panjang itu justru lebih ' +
         'mudah dibaca &mdash; tiap wajah kartu terlihat apa adanya di ' +
         'sumbernya. Yang pendek lebih mudah diubah, dan jauh lebih mudah ' +
         'dirusak. Tidak ada yang menang mutlak di sini; yang ada dua pilihan ' +
         'dengan harga yang berbeda.'],
        ['Cacat yang ikut disalin',
         'Rumus waktu di baris 59950 mengalikan jam dengan <b>120</b>, bukan ' +
         '3600 &mdash; dan itu sama persis di TRUCKER.BAS. Menyeberang ' +
         'pergantian jam membuat gelung jedanya berjalan hampir satu jam.',
         'Itulah harga sebuah pustaka salin-tempel: <b>satu cacat, dua ' +
         'program</b>, dan memperbaikinya di satu tempat tidak memperbaiki ' +
         'yang lain.'],
        ['Double down yang tidak menggandakan apa pun',
         'Baris 2800: <code>T(L)=T(L)*2</code>. Larik <code>T()</code> tidak ' +
         'pernah di-<code>DIM</code>, tidak pernah diisi, dan <b>tidak pernah ' +
         'dibaca di baris mana pun</b> &mdash; pencarian di seluruh berkas ' +
         'menemukan <code>T(</code> tepat sekali, di baris ini juga. ' +
         'Taruhannya disimpan di <code>BET(X)</code>.',
         'Jadi memilih "3 = DOUBLE" memberi pemain satu kartu tambahan lalu ' +
         'memaksanya berhenti &mdash; tanpa menggandakan taruhannya. ' +
         'Keuntungannya diambil, risikonya tidak.'],
        ['Asuransi yang tidak pernah dibayar',
         'Baris 2190 dan 2200 mencatat siapa yang membeli asuransi. Satu ' +
         'satunya tempat yang membacanya adalah 2920-2930 &mdash; yang ada di ' +
         'jalur "<b>No Blackjack</b>".',
         'Kalau bandar <i>benar-benar</i> punya blackjack, baris 2160 ' +
         'melompat ke 2300 dan kedua bendera itu tidak pernah dilihat lagi. ' +
         'Asuransi hanya bisa <b>merugikan</b> pemain, tidak pernah membayar.'],
        ['Dua penangan galat untuk kejadian yang mustahil',
         'Baris 3080 menangani <code>ERR=4</code> &mdash; "Out of DATA". ' +
         'Berkas ini <b>tidak punya satu pun pernyataan DATA</b>.',
         'Baris 3085 menangani <code>ERR=71</code> di <code>ERL=2090</code>. ' +
         '<b>Baris 2090 tidak ada.</b>',
         'Keduanya kemungkinan besar tertinggal dari program lain yang ' +
         'penangan galatnya disalin ke sini &mdash; sama seperti ketiga ' +
         'subrutin di ujung berkas.'],
        ['Perintah pencetak yang menyamar jadi komentar',
         'Puluhan baris berbunyi <code>REM $s2</code> atau <code>REM $pa</code>. ' +
         'Itu bukan catatan untuk pembaca &mdash; itu perintah untuk sebuah ' +
         '<b>alat pencetak daftar program</b>: "lewati dua baris" dan "ganti ' +
         'halaman".',
         'Sumbernya membawa tata letak cetakannya sendiri, di dalam ' +
         'komentar, karena tidak ada tempat lain untuk menaruhnya.'],
        ['Nomor baris yang tertinggal tidak rapi',
         'Wajah kartu tujuh memakai baris <b>30475</b>, di antara 30470 dan ' +
         '30480 &mdash; sebuah baris yang <b>disisipkan belakangan</b>, waktu ' +
         'wajah tujuh dibedakan dari enam. Dan <code>RETURN</code> kartu K ' +
         'bernomor <b>30860</b>, bukan 30851 seperti ketiga belas yang lain.',
         'Dua jejak penyuntingan yang tidak sempat dirapikan, dan keduanya ' +
         'menceritakan urutan program ini dibangun.']
      ]
    },

    penjelasan: [
      { judul: 'Nomor baris lima puluh sembilan ribu',
        isi: [
          'Tiga subrutin di ujung berkas ini &mdash; jeda, pemasang benih ' +
          'acak, dan pembaca tombol &mdash; sama persis dengan yang ada di ' +
          '<a href="trucker.html">TRUCKER.BAS</a>. Bukan mirip: <b>sama, ' +
          'sampai ke nomor barisnya</b>.',
          '<code>59950 TIMEOUT$=TIME$:TIME2=VAL(LEFT$(TIMEOUT$,2))*120+&hellip;</code><br>' +
          '<code>59980 RNDTIME$=TIME$:&hellip;:RANDOMIZE RNDVAL:RETURN</code><br>' +
          '<code>59990 IKEY$=INKEY$:IF IKEY$="" THEN 59990 ELSE RETURN</code>',
          'Kenapa 59950 dan bukan 9000, atau 5000?',
          'Karena BASIC tidak punya cara mengimpor apa pun. Satu-satunya cara ' +
          'memakai ulang kode adalah <b>menyalin barisnya</b> ke program baru ' +
          '&mdash; dan salinan itu akan bentrok kalau nomornya bertabrakan ' +
          'dengan kode yang sudah ada.',
          'Jadi penulisnya memesan wilayah. Lima puluh sembilan ribu ke atas ' +
          'adalah <b>tanah miliknya</b>: tidak ada program yang tumbuh sampai ' +
          'sana, jadi subrutinnya bisa mendarat di berkas apa pun tanpa ' +
          'menabrak apa-apa.',
          'Itu <i>namespace</i>, dibangun dari kesepakatan dengan diri sendiri.',
          'Dan seperti setiap pustaka salin-tempel, ia membawa cacatnya ke ' +
          'mana-mana. Rumus di baris 59950 mengalikan jam dengan <b>120</b>, ' +
          'bukan 3600. Selama jedanya tidak menyeberang pergantian jam, tidak ' +
          'ada yang terasa. Begitu menyeberang, gelungnya berjalan hampir ' +
          'satu jam.',
          'Dua program, satu cacat, dan tidak ada satu tempat pun untuk ' +
          'memperbaikinya.'
        ] },
      { judul: 'Sembilan baris, atau seratus empat puluh',
        isi: [
          'Di disket yang sama ada dua program blackjack yang harus ' +
          'menggambar tiga belas wajah kartu di layar teks.',
          '<b>BLACKJCK.BAS</b> mengerjakannya dalam 21 baris. Tiap ' +
          'pangkat didefinisikan sebagai selisih dari pangkat lain: sembilan ' +
          'adalah dua pip ditambah tujuh, tujuh adalah satu pip ditambah ' +
          'enam. Rantai <code>GOTO</code> dan jatuh-tembus yang menyimpan ' +
          '<i>hubungan</i> antar gambar, bukan gambarnya.',
          '<b>BLACK.BAS</b> &mdash; berkas ini &mdash; mengerjakannya dalam ' +
          '98 baris. Empat belas subrutin terpisah, masing ' +
          'masing enam <code>LOCATE</code>/<code>PRINT</code> yang menuliskan ' +
          'tiap barisnya apa adanya.',
          'Selisihnya hampir lima kali lipat, dan gampang menyimpulkan yang ' +
          'satu lebih baik. Tapi keduanya punya harga.',
          'Yang pendek <b>tidak bisa dibaca</b> tanpa menelusuri tiga ' +
          'lompatan. Menyisipkan satu baris di tempat yang salah memutus ' +
          'rantainya dan merusak empat kartu sekaligus, diam-diam.',
          'Yang panjang bisa dibaca sekilas. Wajah kartu tujuh terlihat ' +
          'persis seperti kartu tujuh, tertulis di enam baris berurutan. ' +
          'Mengubahnya tidak mengubah apa pun yang lain.',
          'Dan buktinya ada di berkas ini sendiri. Baris <b>30475</b> ' +
          'disisipkan di antara 30470 dan 30480 &mdash; seseorang menambahkan ' +
          'satu baris pip ke wajah kartu tujuh, belakangan, dan <b>tidak ada ' +
          'yang rusak</b>. Di rancangan jatuh-tembus, sisipan di tempat itu ' +
          'akan merusak enam, delapan, dan sembilan sekaligus.',
          'Yang satu hemat; yang satu bisa disunting. Disket ini menyimpan ' +
          'keduanya, berdampingan, tanpa memihak.'
        ] }
    ]
  };
})(window);
