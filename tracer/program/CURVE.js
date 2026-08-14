/* ===========================================================================
   CURVE.js — porting minimalis CURVE.BAS sebagai tabel baris.

   Delapan puluh sembilan baris dari Feldman & Rugg, 1982: PENCOCOKAN KURVA
   KUADRAT TERKECIL. Diberi sekumpulan titik, ia mencari polinom derajat
   berapa pun yang paling dekat melewatinya.

   DAN SEPARUH BAWAHNYA ADALAH SIMEQN.BAS, DISALIN UTUH.

   Baris 780 sampai 980 di sini identik dengan baris 390 sampai 590 di
   SIMEQN.BAS — nomor barisnya digeser tepat 390, sisanya sama persis:

       SIMEQN 390  IF N>1 THEN 410      CURVE 780  IF N>1 THEN 800
       SIMEQN 590  V(M)=(R(M)-Q)/...    CURVE 980  V(M)=(R(M)-Q)/...

   Termasuk cacatnya: `V(M)=...` yang tertinggal DI DALAM gelung J, dan
   pembagian tanpa pemeriksaan nol. Dua program, satu subrutin, satu
   kesalahan yang sama — sama seperti `JP` yang ikut tersalin dari
   BUSTHREE.BAS ke BUSSEVEN.BAS.

   Yang baru di berkas ini cuma bagian atasnya: menyusun PERSAMAAN NORMAL.
   Baris 450-510 mengubah "cari polinom terbaik" jadi "selesaikan sistem
   persamaan linear" — dan sesudah itu tinggal memanggil penyelesai yang
   sudah ada.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `WIDTH 40` tidak ditiru; konsol penelusur tetap 80 kolom.
   - `BEEP` diam, dan `COLOR 23` (berkedip) ditampilkan sebagai putih terang
     biasa — atribut kedip CGA tidak ditiru konsol ini.
   - Pembagian nol memberi `NaN`, bukan tak-hingga mesin.
   - `INPUT X(J),Y(J)` menerima dua angka dipisah koma dalam satu baris,
     seperti aslinya.
   =========================================================================== */

(function (global) {
  'use strict';

  function angka(s) {
    var n = parseFloat(String(s).replace(/^\s+/, ''));
    return isNaN(n) ? 0 : n;
  }
  function basic(n) {
    if (n === undefined || n === null || isNaN(n)) return ' NaN ';
    var s;
    if (n === Math.floor(n) && Math.abs(n) < 1e15) s = String(Math.abs(n));
    else s = String(Number(Math.abs(n).toPrecision(7))).replace(/^0\./, '.');
    return (n < 0 ? '-' : ' ') + s + ' ';
  }

  var tabel = [

    rem(100), rem(110), rem(120), rem(130),
    { baris: 140, jalan: function (m) { m.warna(7, 0); } },
    { baris: 150, jalan: function (m) { m.cls(); } },
    { baris: 160, jalan: function (m) { m.v.MX = 100; } },
    /* 170 `EF=999` — nilai penjaga yang menandai akhir data. Lihat catatan
       tentang penjaga yang juga bisa jadi data. */
    { baris: 170, jalan: function (m) { m.v.EF = 999; } },
    { baris: 180, jalan: function (m) { m.v.MD = 7; } },
    { baris: 190, jalan: function (m) { m.dim('X()', m.v.MX); m.dim('Y()', m.v.MX); } },
    { baris: 200, jalan: function (m) {
        m.v.Q = m.v.MD + 1;
        m.dim('A()', m.v.Q, m.v.Q); m.dim('R()', m.v.Q); m.dim('V()', m.v.Q);
      } },
    { baris: 210, jalan: function (m) {
        m.v.Q = m.v.MD * 2; m.dim('P()', m.v.Q);
      } },

    /* --- 220-310: petunjuk ------------------------------------------------ */
    { baris: 220, jalan: function (m) {
        m.cetak('   - LEAST SQUARES CURVE FITTING -'); m.barisBaru();
        m.barisBaru();
      } },
    cet(230, 'Enter a data pair in response to each'),
    cet(240, 'question mark.  Each pair is an X value'),
    { baris: 250, jalan: function (m) {
        m.cetak('and a Y value separated by a comma.'); m.barisBaru();
        m.barisBaru();
      } },
    { baris: 260, jalan: function (m) {
        m.barisBaru();
        m.cetak('After all data is entered, type'); m.barisBaru();
      } },
    { baris: 270, jalan: function (m) {
        m.spc(1); m.cetak(basic(m.v.EF) + ',' + basic(m.v.EF)); m.barisBaru();
      } },
    { baris: 280, jalan: function (m) {
        m.cetak('in response to the last question mark.'); m.barisBaru();
        m.barisBaru();
      } },
    { baris: 290, jalan: function (m) {
        m.barisBaru();
        m.cetak('The program is currently set to'); m.barisBaru();
      } },
    { baris: 300, jalan: function (m) {
        m.cetak('accept a maximum of' + basic(m.v.MX) + 'data pairs.');
        m.barisBaru();
      } },
    { baris: 310, jalan: function (m) {
        m.barisBaru(); m.barisBaru(); m.v.J = 0;
      } },

    /* --- 320-360: baca titiknya ------------------------------------------- */
    { baris: 320, bagian: [
        function (m) { m.v.J = m.v.J + 1; },
        function (m) {
          m.masukan(function (s) {
            var p = String(s).split(',');
            m.v['X()'][m.v.J] = angka(p[0]);
            m.v['Y()'][m.v.J] = angka(p.length > 1 ? p[1] : '0');
          }, 'X,Y=? ');
        }
      ] },
    { baris: 330, jalan: function (m) {
        if (m.v['X()'][m.v.J] === m.v.EF && m.v['Y()'][m.v.J] === m.v.EF) {
          m.v.J = m.v.J - 1; m.lompat(360);
        }
      } },
    { baris: 340, jalan: function (m) {
        if (m.v.J === m.v.MX) {
          m.barisBaru(); m.bunyi();
          m.cetak('No More Data Allowed'); m.barisBaru();
          m.lompat(360);
        }
      } },
    { baris: 350, jalan: function (m) { m.lompat(320); } },
    { baris: 360, jalan: function (m) { m.v.NP = m.v.J; m.barisBaru(); } },
    { baris: 370, bagian: [
        function (m) { if (m.v.NP !== 0) m.lompat(380); },
        function (m) { m.gosub(760); },
        function (m) {
          m.cetak('No data entered'); m.barisBaru();
          m.henti('STOP di baris 370: tidak ada data.');
        }
      ] },
    { baris: 380, jalan: function (m) {
        m.cetak(basic(m.v.NP) + 'data pairs entered.'); m.barisBaru();
        m.barisBaru();
      } },

    /* --- 390-440: derajat polinomnya -------------------------------------- */
    { baris: 390, bagian: [
        function (m) { m.barisBaru(); },
        function (m) {
          m.masukan(function (s) { m.v.D = angka(s); },
                    'Degree of polynomial to be fitted? ');
        },
        function (m) { m.barisBaru(); }
      ] },
    { baris: 400, bagian: [
        function (m) { if (!(m.v.D < 0)) m.lompat(410); },
        function (m) { m.gosub(740); },
        function (m) {
          m.cetak('Degree must be >= 0'); m.barisBaru();
          m.lompat(390);
        }
      ] },
    /* 410 derajat harus LEBIH KECIL dari jumlah titik. Polinom derajat n
       butuh n+1 titik untuk ditentukan; kalau titiknya kurang, sistem
       persamaannya tidak punya jawaban tunggal. */
    { baris: 410, jalan: function (m) {
        m.v.D = Math.trunc(m.v.D);
        if (m.v.D < m.v.NP) m.lompat(430);
      } },
    { baris: 420, bagian: [
        function (m) { m.gosub(740); },
        function (m) {
          m.cetak('Not enough data'); m.barisBaru();
          m.lompat(390);
        }
      ] },
    { baris: 430, bagian: [
        function (m) {
          m.v.D2 = 2 * m.v.D;
          if (!(m.v.D > m.v.MD)) m.lompat(440);
        },
        function (m) { m.gosub(740); },
        function (m) {
          m.cetak('Degree too high'); m.barisBaru();
          m.lompat(390);
        }
      ] },
    { baris: 440, jalan: function (m) { m.v.N = m.v.D + 1; } },

    /* --- 450-510: menyusun PERSAMAAN NORMAL ------------------------------- *
       Di sinilah "cari polinom terbaik" berubah jadi "selesaikan sistem
       persamaan linear". P(J) menampung jumlah X pangkat J; R(J) jumlah
       Y kali X pangkat J-1; dan A(J,K)=P(J+K-2) menyusunnya jadi matriks.  */
    { baris: 450, bagian: [
        function (m) { m.untuk('J', 1, m.v.D2, 1, 470); },
        function (m) { m.v['P()'][m.v.J] = 0; },
        function (m) { m.untuk('K', 1, m.v.NP, 1, 460); }
      ] },
    { baris: 460, bagian: [
        function (m) {
          m.v['P()'][m.v.J] += Math.pow(m.v['X()'][m.v.K], m.v.J);
        },
        function (m) { m.lanjutkan('K'); },
        function (m) { m.lanjutkan('J'); },
        function (m) { m.v['P()'][0] = m.v.NP; }
      ] },
    { baris: 470, bagian: [
        function (m) { m.v['R()'][1] = 0; },
        function (m) { m.untuk('J', 1, m.v.NP, 1, 480); },
        function (m) { m.v['R()'][1] += m.v['Y()'][m.v.J]; }
      ] },
    { baris: 480, bagian: [
        function (m) { m.lanjutkan('J'); },
        function (m) { if (m.v.N === 1) m.lompat(510); }
      ] },
    { baris: 490, bagian: [
        function (m) { m.untuk('J', 2, m.v.N, 1, 510); },
        function (m) { m.v['R()'][m.v.J] = 0; },
        function (m) { m.untuk('K', 1, m.v.NP, 1, 500); }
      ] },
    { baris: 500, bagian: [
        function (m) {
          m.v['R()'][m.v.J] += m.v['Y()'][m.v.K] *
                               Math.pow(m.v['X()'][m.v.K], m.v.J - 1);
        },
        function (m) { m.lanjutkan('K'); },
        function (m) { m.lanjutkan('J'); }
      ] },
    /* 510 matriksnya HANKEL: tiap unsur cuma bergantung pada JUMLAH indeksnya,
       jadi seluruh matriks (D+1)x(D+1) diisi dari satu larik P(). */
    { baris: 510, bagian: [
        function (m) { m.untuk('J', 1, m.v.N, 1, 520); },
        function (m) { m.untuk('K', 1, m.v.N, 1, 520); },
        function (m) {
          m.v['A()'][m.v.J][m.v.K] = m.v['P()'][m.v.J + m.v.K - 2];
        },
        function (m) { m.lanjutkan('K'); },
        function (m) { m.lanjutkan('J'); }
      ] },
    { baris: 520, jalan: function (m) { m.gosub(780); } },

    /* --- 530-560: koefisiennya -------------------------------------------- */
    { baris: 530, jalan: function (m) {
        m.barisBaru();
        m.spc(1); m.cetak('X POWER'); m.spc(6); m.cetak('COEFFICIENT');
        m.barisBaru();
      } },
    { baris: 540, jalan: function (m) {
        m.spc(1);
        for (m.v.J = 1; m.v.J <= 7; m.v.J++) m.cetak('-');
        m.spc(6);
      } },
    { baris: 550, jalan: function (m) {
        for (m.v.J = 1; m.v.J <= 11; m.v.J++) m.cetak('-');
        m.barisBaru();
      } },
    { baris: 560, bagian: [
        function (m) { m.untuk('J', 1, m.v.N, 1, 570); },
        function (m) {
          m.spc(3); m.cetak(basic(m.v.J - 1)); m.tab(15);
          m.cetak(basic(m.v['V()'][m.v.J])); m.barisBaru();
        },
        function (m) { m.lanjutkan('J'); },
        function (m) { m.barisBaru(); m.barisBaru(); }
      ] },

    /* --- 570-610: seberapa cocok ------------------------------------------ *
       T = jumlah kuadrat selisih data terhadap KURVA.
       G = jumlah kuadrat selisih data terhadap RATA-RATANYA.
       100*SQR(1-T/G) adalah koefisien korelasi dalam persen.               */
    { baris: 570, bagian: [
        function (m) {
          m.v.Q = 0;
          for (m.v.J = 1; m.v.J <= m.v.NP; m.v.J++) m.v.Q += m.v['Y()'][m.v.J];
          m.v.M = m.v.Q / m.v.NP;
          m.v.T = 0; m.v.G = 0;
        },
        function (m) { m.untuk('J', 1, m.v.NP, 1, 600); }
      ] },
    { baris: 580, jalan: function (m) {
        m.v.Q = 0;
        for (m.v.K = 1; m.v.K <= m.v.N; m.v.K++) {
          m.v.Q += m.v['V()'][m.v.K] * Math.pow(m.v['X()'][m.v.J], m.v.K - 1);
        }
        m.v.T += Math.pow(m.v['Y()'][m.v.J] - m.v.Q, 2);
      } },
    { baris: 590, bagian: [
        function (m) { m.v.G += Math.pow(m.v['Y()'][m.v.J] - m.v.M, 2); },
        function (m) { m.lanjutkan('J'); },
        function (m) { if (m.v.G === 0) { m.v.T = 100; m.lompat(610); } }
      ] },
    { baris: 600, jalan: function (m) {
        m.v.T = 100 * Math.sqrt(1 - m.v.T / m.v.G);
      } },
    { baris: 610, jalan: function (m) {
        m.cetak('Percent Goodness of Fit =' + basic(m.v.T)); m.barisBaru();
      } },

    /* --- 620-730: pilihan lanjutan ---------------------------------------- */
    { baris: 620, jalan: function (m) {
        m.barisBaru();
        m.cetak('-- Continuation Options --'); m.barisBaru();
        m.barisBaru();
      } },
    cet(630, '  1 - Determine specific points'),
    cet(640, '  2 - Fit another degree to same data'),
    { baris: 650, jalan: function (m) {
        m.cetak('  3 - End program'); m.barisBaru(); m.barisBaru();
      } },
    { baris: 660, bagian: [
        function (m) {
          m.masukan(function (s) { m.v.Q = angka(s); }, 'What next? ');
        },
        function (m) {
          m.v.Q = Math.trunc(m.v.Q);
          if (m.v.Q === 3) m.henti('END di baris 660.');
        }
      ] },
    { baris: 670, jalan: function (m) { if (m.v.Q === 2) m.lompat(390); } },
    { baris: 680, jalan: function (m) { if (m.v.Q !== 1) m.lompat(620); } },
    { baris: 690, jalan: function (m) {
        m.barisBaru(); m.barisBaru();
        m.cetak('Enter' + basic(m.v.EF) + 'to leave this mode'); m.barisBaru();
      } },
    { baris: 700, bagian: [
        function (m) { m.barisBaru(); },
        function (m) {
          m.masukan(function (s) { m.v.XV = angka(s); }, 'X=? ');
        },
        function (m) { if (m.v.XV === m.v.EF) m.lompat(620); }
      ] },
    { baris: 710, bagian: [
        function (m) { m.v.YV = 0; },
        function (m) { m.untuk('K', 1, m.v.N, 1, 720); }
      ] },
    { baris: 720, bagian: [
        function (m) {
          m.v.YV += m.v['V()'][m.v.K] * Math.pow(m.v.XV, m.v.K - 1);
        },
        function (m) { m.lanjutkan('K'); },
        function (m) { m.cetak('Y= ' + basic(m.v.YV)); m.barisBaru(); }
      ] },
    { baris: 730, jalan: function (m) { m.lompat(700); } },

    /* --- 740-770: dua pesan galat yang hampir kembar ----------------------- */
    { baris: 740, jalan: function (m) {
        m.cetak('** '); m.warna(23, 0); m.cetak('ERROR!'); m.warna(7, 0);
      } },
    { baris: 750, jalan: function (m) {
        m.cetak(' ** -- '); m.bunyi(); m.kembali();
      } },
    { baris: 760, jalan: function (m) {
        m.cetak('** '); m.warna(23, 0); m.cetak('FATAL ERROR!'); m.warna(7, 0);
      } },
    { baris: 770, jalan: function (m) {
        m.cetak(' ** -- '); m.bunyi(); m.kembali();
      } },

    /* --- 780-980: SIMEQN.BAS, DISALIN UTUH -------------------------------- *
       Identik dengan baris 390-590 di SIMEQN.BAS, nomornya digeser 390.
       Eliminasi Gauss dengan pivot parsial. Termasuk dua cacat yang ikut
       tersalin: pembagian tanpa pemeriksaan nol (890, 950, 790), dan
       `V(M)=...` yang tertinggal di dalam gelung J (980).                   */
    { baris: 780, jalan: function (m) { if (m.v.N > 1) m.lompat(800); } },
    { baris: 790, jalan: function (m) {
        m.v['V()'][1] = m.v['R()'][1] / m.v['A()'][1][1];
        m.kembali();
      } },
    { baris: 800, bagian: [
        function (m) { m.untuk('K', 1, m.v.N - 1, 1, 950); },
        function (m) { m.v.M = m.v.K + 1; }
      ] },
    { baris: 810, jalan: function (m) { m.v.L = m.v.K; } },
    { baris: 820, jalan: function (m) {
        m.v.Q = Math.abs(m.v['A()'][m.v.M][m.v.K]) -
                Math.abs(m.v['A()'][m.v.L][m.v.K]);
      } },
    { baris: 830, jalan: function (m) { if (m.v.Q > 0) m.v.L = m.v.M; } },
    { baris: 840, jalan: function (m) {
        if (m.v.M < m.v.N) { m.v.M = m.v.M + 1; m.lompat(820); }
      } },
    { baris: 850, jalan: function (m) { if (m.v.L === m.v.K) m.lompat(880); } },
    { baris: 860, bagian: [
        function (m) { m.untuk('J', m.v.K, m.v.N, 1, 870); },
        function (m) {
          var a = m.v['A()'], K = m.v.K, L = m.v.L, J = m.v.J;
          var t = a[K][J]; a[K][J] = a[L][J]; a[L][J] = t;
        },
        function (m) { m.lanjutkan('J'); }
      ] },
    { baris: 870, jalan: function (m) {
        var r = m.v['R()'], K = m.v.K, L = m.v.L;
        var t = r[K]; r[K] = r[L]; r[L] = t;
      } },
    { baris: 880, jalan: function (m) { m.v.M = m.v.K + 1; } },
    { baris: 890, jalan: function (m) {
        m.v.Q = m.v['A()'][m.v.M][m.v.K] / m.v['A()'][m.v.K][m.v.K];
        m.v['A()'][m.v.M][m.v.K] = 0;
      } },
    { baris: 900, jalan: function (m) { m.untuk('J', m.v.K + 1, m.v.N, 1, 920); } },
    { baris: 910, bagian: [
        function (m) {
          var a = m.v['A()'];
          a[m.v.M][m.v.J] = a[m.v.M][m.v.J] - m.v.Q * a[m.v.K][m.v.J];
        },
        function (m) { m.lanjutkan('J'); }
      ] },
    { baris: 920, jalan: function (m) {
        m.v['R()'][m.v.M] = m.v['R()'][m.v.M] - m.v.Q * m.v['R()'][m.v.K];
      } },
    { baris: 930, jalan: function (m) {
        if (m.v.M < m.v.N) { m.v.M = m.v.M + 1; m.lompat(890); }
      } },
    { baris: 940, jalan: function (m) { m.lanjutkan('K'); } },
    { baris: 950, jalan: function (m) {
        m.v['V()'][m.v.N] = m.v['R()'][m.v.N] / m.v['A()'][m.v.N][m.v.N];
      } },
    { baris: 960, jalan: function (m) { m.untuk('M', m.v.N - 1, 1, -1, 980); } },
    { baris: 970, bagian: [
        function (m) { m.v.Q = 0; },
        function (m) { m.untuk('J', m.v.M + 1, m.v.N, 1, 980); },
        function (m) {
          m.v.Q += m.v['A()'][m.v.M][m.v.J] * m.v['V()'][m.v.J];
        }
      ] },
    { baris: 980, bagian: [
        function (m) {
          m.v['V()'][m.v.M] =
            (m.v['R()'][m.v.M] - m.v.Q) / m.v['A()'][m.v.M][m.v.M];
        },
        function (m) { m.lanjutkan('J'); },
        function (m) { m.lanjutkan('M'); },
        function (m) { m.kembali(); }
      ] }
  ];

  function rem(n) { return { baris: n, jalan: function () { } }; }
  function cet(n, isi) {
    return { baris: n, jalan: function (m) { m.cetak(isi); m.barisBaru(); } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['CURVE'] = {
    nama: 'CURVE',
    judul: 'Curve (kuadrat terkecil, dan SIMEQN yang disalin)',
    sumber: 'CURVE',
    berkas: 'run/CURVE.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur CURVE.BAS',
      simpul: [
        { id: 'data', baris: '320-360', jenis: 'mulai',
          teks: ['Baca pasangan X,Y', 'sampai 999,999'] },
        { id: 'derajat', baris: '390-440', jenis: 'putusan',
          teks: ['Derajat polinom;', 'harus < jumlah titik'] },
        { id: 'normal', baris: '450-510',
          teks: ['Susun PERSAMAAN NORMAL:', 'jumlah pangkat X dan Y*X'] },
        { id: 'solve', baris: '780-980', jenis: 'subrutin',
          teks: ['SIMEQN.BAS disalin utuh:', 'eliminasi Gauss + pivot'] },
        { id: 'cetak', baris: '530-560',
          teks: ['Koefisien tiap pangkat X'] },
        { id: 'cocok', baris: '570-610',
          teks: ['Persen kecocokan:', '100*SQR(1 - T/G)'] },
        { id: 'pilih', baris: '620-680', jenis: 'putusan',
          teks: ['Hitung titik / derajat lain /', 'selesai'] },
        { id: 'titik', baris: '690-730',
          teks: ['Masukkan X,', 'dapatkan Y dari polinomnya'] }
      ],
      panah: [
        { dari: 'data', ke: 'derajat' },
        { dari: 'derajat', ke: 'normal' },
        { dari: 'normal', ke: 'solve' },
        { dari: 'solve', ke: 'cetak' },
        { dari: 'cetak', ke: 'cocok' },
        { dari: 'cocok', ke: 'pilih' },
        { dari: 'pilih', ke: 'titik', label: '1' },
        { dari: 'titik', ke: 'pilih', label: '999' },
        { dari: 'pilih', ke: 'derajat', label: '2: data yang sama' }
      ]
    },

    pseudokode: [
      { baris: 320, tingkat: 0, teks: 'baca pasangan <code>X,Y</code> sampai penjaga <code>999,999</code>' },
      { baris: 390, tingkat: 0, teks: 'tanya derajat polinomnya; harus &ge; 0, &lt; jumlah titik, &le; 7' },
      { baris: 450, tingkat: 0, teks: '<code>P(J)</code> = jumlah <code>X^J</code> untuk semua titik' },
      { baris: 470, tingkat: 0, teks: '<code>R(J)</code> = jumlah <code>Y*X^(J-1)</code>' },
      { baris: 510, tingkat: 0, teks: '<code>A(J,K) = P(J+K-2)</code> &mdash; matriks <b>Hankel</b> dari satu larik' },
      { baris: 520, tingkat: 0, teks: '<code>GOSUB 780</code> &mdash; <b>penyelesai SIMEQN.BAS, disalin utuh</b>' },
      { baris: 570, tingkat: 0, teks: 'T = sisa kuadrat terhadap kurva, G = terhadap rata-rata' },
      { baris: 600, tingkat: 1, teks: '<code>100*SQR(1 - T/G)</code> &mdash; koefisien korelasi dalam persen' },
      { baris: 700, tingkat: 0, teks: 'pilihan 1: masukkan X, dapatkan Y dari polinom yang baru dicocokkan' }
    ],

    perintahAsli: 'run\\CURVE.bat',
    catatanAsli: 'Coba titik yang jelas garis lurus &mdash; 1,2 lalu 2,4 lalu ' +
      '3,6 lalu 999,999 &mdash; dengan derajat 1. Jawabannya koefisien 0 dan 2, ' +
      'kecocokan 100 persen.',

    penyimpangan: [
      '<b><code>WIDTH 40</code> tidak ditiru</b>; konsol tetap 80 kolom.',

      '<b><code>BEEP</code> diam, dan <code>COLOR 23</code> tidak berkedip.</b> ' +
      'Nilai 23 adalah 7 + 16, dan bit ke-16 itulah atribut kedip CGA. Kata ' +
      '"ERROR!" di baris 740 seharusnya berkedip.',

      '<b>Pembagian nol memberi <code>NaN</code></b>, bukan tak-hingga mesin ' +
      '&mdash; sama seperti di SIMEQN.BAS, karena penyelesainya memang berkas ' +
      'yang sama.',

      '<b><code>INPUT X(J),Y(J)</code> menerima dua angka dipisah koma</b> ' +
      'dalam satu baris, seperti aslinya.'
    ],

    pelajaran: {
      ringkas: 'Pencocokan kurva kuadrat terkecil &mdash; dan separuh bawahnya ' +
        'adalah SIMEQN.BAS yang disalin utuh, lengkap dengan cacatnya.',
      pelajari: [
        ['Mengubah masalah jadi masalah yang sudah bisa diselesaikan',
         'Baris 450&ndash;510 adalah seluruh isi berkas ini yang benar-benar ' +
         'baru. Ia mengubah "cari polinom yang paling dekat melewati ' +
         'titik-titik ini" menjadi "selesaikan sistem persamaan linear ' +
         '(D+1)&times;(D+1)". Sesudah itu tinggal memanggil penyelesai yang ' +
         'sudah ada. <b>Sebagian besar pekerjaan matematika terapan berbentuk ' +
         'begini</b>: bukan menemukan cara baru, melainkan menemukan bahwa ' +
         'masalahnya adalah masalah lama yang menyamar.'],
        ['Matriks yang diisi dari satu larik',
         'Baris 510: <code>A(J,K)=P(J+K-2)</code>. Tiap unsur cuma bergantung ' +
         'pada <b>jumlah</b> indeksnya, jadi seluruh matriks (D+1)&times;(D+1) ' +
         'terisi dari satu larik P() sepanjang 2D. Bentuk seperti ini punya ' +
         'nama &mdash; matriks Hankel &mdash; dan ia muncul sendiri dari ' +
         'aljabar kuadrat terkecil, bukan dari pilihan penulisnya.'],
        ['Ukuran kecocokan yang punya arti',
         '<code>T</code> adalah jumlah kuadrat selisih data terhadap ' +
         '<b>kurvanya</b>; <code>G</code> terhadap <b>rata-ratanya</b>. Kalau ' +
         'kurvanya tidak lebih baik daripada sekadar menebak rata-rata, ' +
         'T = G dan hasilnya nol persen. Kalau kurvanya lewat tepat di semua ' +
         'titik, T = 0 dan hasilnya seratus. <code>100*SQR(1-T/G)</code> ' +
         'adalah koefisien korelasi, ditulis tanpa menyebut namanya.'],
        ['Penjagaan masukan yang berlapis',
         'Baris 400, 410, dan 430 memeriksa tiga hal berbeda tentang derajat ' +
         'yang diminta: tidak boleh negatif, harus lebih kecil dari jumlah ' +
         'titik, dan tidak boleh melebihi batas larik. Ketiganya kembali ke ' +
         'baris 390 dengan pesan yang berbeda. <b>Jarang sekali program 1982 ' +
         'seteliti ini soal masukan</b> &mdash; bandingkan SIMEQN.BAS yang ' +
         'tidak memeriksa apa pun.']
      ],
      hindari: [
        ['Cacat yang ikut tersalin',
         'Baris 780&ndash;980 identik dengan SIMEQN.BAS baris 390&ndash;590, ' +
         'nomornya digeser 390. Termasuk <b>kedua cacatnya</b>: pembagian ' +
         'tanpa pemeriksaan nol (baris 790, 890, 950), dan ' +
         '<code>V(M)=&hellip;</code> yang tertinggal di dalam gelung J di baris ' +
         '980. Menyalin subrutin berarti menyalin kesalahannya &mdash; dan ' +
         'sekarang ada dua tempat yang harus diperbaiki. Pola yang sama ada ' +
         'di keluarga BUS*, tempat <code>JP</code> ikut tersalin dari ' +
         'BUSTHREE.BAS ke BUSSEVEN.BAS.'],
        ['Penjaga yang juga bisa jadi data',
         '<code>EF=999</code> menandai akhir masukan. Tapi 999 adalah angka ' +
         'yang sangat mungkin muncul sebagai data sungguhan &mdash; harga, ' +
         'jumlah, tahun. Siapa pun yang punya titik (999, 999) tidak bisa ' +
         'memasukkannya. <b>Penjaga yang diambil dari ruang nilai yang sama ' +
         'dengan datanya selalu menutup sebagian data yang sah.</b>'],
        ['Dua subrutin yang bedanya satu kata',
         'Baris 740&ndash;750 dan 760&ndash;770 identik kecuali kata "FATAL". ' +
         'Empat baris untuk sesuatu yang bisa jadi satu subrutin dengan satu ' +
         'variabel.'],
        ['Batas yang ditulis di tiga tempat',
         '<code>MD=7</code> di baris 180 menentukan derajat tertinggi; baris ' +
         '200 dan 210 memakainya untuk mengukur larik; baris 430 memakainya ' +
         'untuk memeriksa. Benar &mdash; tapi baris 190 memakai ' +
         '<code>MX</code> dan baris 300 mencetaknya, jadi ada <b>dua</b> ' +
         'batas yang harus dijaga tetap sejalan dengan larik masing-masing.']
      ]
    },

    penjelasan: [
      { judul: 'Dua ratus baris yang sama, di dua berkas',
        isi: [
          'Baris 780 sampai 980 di berkas ini adalah baris 390 sampai 590 di ' +
          'SIMEQN.BAS, digeser tepat 390 nomor. Bukan mirip &mdash; sama ' +
          'persis, pernyataan demi pernyataan:',
          '<code>SIMEQN 390 IF N&gt;1 THEN 410</code> &nbsp;&rarr;&nbsp; ' +
          '<code>CURVE 780 IF N&gt;1 THEN 800</code><br>' +
          '<code>SIMEQN 470 FOR J=K TO N:SWAP&hellip;</code> &nbsp;&rarr;&nbsp; ' +
          '<code>CURVE 860 FOR J=K TO N:SWAP&hellip;</code><br>' +
          '<code>SIMEQN 590 V(M)=(R(M)-Q)/A(M,M):NEXT:NEXT</code> ' +
          '&nbsp;&rarr;&nbsp; <code>CURVE 980 V(M)=(R(M)-Q)/A(M,M):NEXT:NEXT</code>',
          'Ini cara memakai ulang kode di zaman tanpa pustaka: ' +
          '<code>LIST 390-590</code>, salin ke berkas lain, <code>RENUM</code>. ' +
          'Dan pada 1982 itu <b>satu-satunya cara</b> &mdash; tidak ada ' +
          '<code>#include</code>, tidak ada modul, tidak ada penaut.',
          'Harganya terlihat langsung. Kedua cacat SIMEQN.BAS ikut tersalin: ' +
          'pembagian tanpa memeriksa nol, dan penugasan yang tertinggal di ' +
          'dalam gelung. Memperbaiki satu tidak memperbaiki yang lain, dan ' +
          'tidak ada apa pun di kedua berkas yang menyebutkan bahwa mereka ' +
          'berkerabat.',
          'Yang menarik: pola ini muncul <b>tiga kali</b> di koleksi ini. ' +
          'SIMEQN &rarr; CURVE membawa dua cacat. BUSTHREE &rarr; BUSSEVEN ' +
          'membawa <code>JP</code> yang tidak pernah diisi. Dan sepuluh berkas ' +
          'BUS* membawa gelung perakit garis yang sama, yang cuma diperbaiki ' +
          'di salah satunya.',
          'Penyalinan menyebarkan yang benar dan yang salah dengan kecepatan ' +
          'yang persis sama.'
        ] },
      { judul: 'Kenapa "kuadrat terkecil" menghasilkan sistem persamaan',
        isi: [
          'Diberi sekumpulan titik, kita ingin polinom yang <b>selisihnya ' +
          'terhadap data sekecil mungkin</b>. Yang diperkecil bukan ' +
          'selisihnya, melainkan <b>jumlah kuadrat</b> selisihnya &mdash; ' +
          'karena kuadrat membuat selisih ke atas dan ke bawah sama-sama ' +
          'menghukum, dan karena kuadrat bisa diturunkan.',
          'Dan begitu diturunkan, muncul sesuatu yang rapi: syarat "jumlah ' +
          'kuadrat sekecil mungkin" ternyata setara dengan <b>sistem ' +
          'persamaan linear</b> dalam koefisien polinomnya. Persamaan itu ' +
          'punya nama: <i>persamaan normal</i>.',
          'Isinya cuma jumlah-jumlah sederhana: jumlah X, jumlah X&sup2;, ' +
          'jumlah X&sup3;&hellip; di satu sisi, dan jumlah Y, jumlah Y&middot;X, ' +
          'jumlah Y&middot;X&sup2;&hellip; di sisi lain. Itulah persisnya isi ' +
          'baris 450&ndash;500.',
          'Baris 510 menyusunnya jadi matriks, dan baris 520 memanggil ' +
          'penyelesainya. Seluruh "kecerdasan" berkas ini ada di enam baris ' +
          'itu; sisanya masukan, tampilan, dan sebuah subrutin yang disalin ' +
          'dari program lain.'
        ] }
    ]
  };
})(window);
