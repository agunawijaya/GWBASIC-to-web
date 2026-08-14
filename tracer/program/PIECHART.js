/* ===========================================================================
   PIECHART.js — porting minimalis PIECHART.BAS sebagai tabel baris.

       940 REM The IBM Personal Computer Piechart
       950 REM Version 1.10 (C)Copyright IBM Corp 1981, 1982

   Diagram lingkaran dari angka yang diketik pemakainya. Tujuh puluh tujuh
   baris, dan sama seperti SPACE.BAS, empat puluh empat di antaranya adalah
   KERANGKA CONTOH IBM — dibangun oleh `kerangka()` di SPACE.js, bukan
   ditulis ulang di sini. Lihat halaman SPACE untuk ceritanya.

   YANG PALING LAYAK DILIHAT: SATU PERSERIBU YANG MENGHINDARI TABRAKAN ARTI.

       1620 CIRCLE (CX,CY),SR,1,-A1-0.001,-A2,5/6

   Sudut MINUS di CIRCLE berarti "gambar juga jari-jarinya" — itulah cara
   BASIC membuat potongan pai, bukan busur telanjang. Tapi minus nol tetap
   nol, dan nol tidak bisa dibedakan dari "sudut tidak diberikan".

   Jadi potongan pertama — yang mulai tepat di sudut nol — akan kehilangan
   satu jari-jarinya. Tambahan 0,001 memaksa sudutnya jadi bilangan negatif
   yang sebenarnya.

   Sepersepuluh derajat, disisipkan untuk menghindari tabrakan arti di dalam
   sistem bilangan itu sendiri.

   DAN POTONGANNYA MELEDAK KELUAR.

       1600 CX=160+COS(AA)*(LR-SR)
       1610 CY=100-SIN(AA)*(LR-SR)

   Tiap potongan digambar dari PUSAT YANG BERBEDA, digeser enam piksel
   sepanjang garis bagi sudutnya sendiri. Hasilnya diagram pai yang seluruh
   irisannya merenggang — dan tidak ada satu baris pun yang khusus untuk itu.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - Kerangka 940-1299 dibangun oleh SPACE.js. Penyimpangannya sama:
     `PLAY` diam, `PEEK(&H410)` selalu menjawab "ada kartu warna", dan
     `CHAIN "samples"` tidak pernah dicapai.
   - `A$` skalar dan `A$()` larik hidup berdampingan; lihat catatan cacat.
   =========================================================================== */

(function (global) {
  'use strict';

  var C = global.CONTOH_IBM;
  var rem = C.rem, cet = C.cet, bas = C.bas;

  var tabel = C.kerangka('      PIECHART       ', 'Piechart', false);

  /* --- 1300-1750: programnya sendiri ------------------------------------- */
  /* 1300 `A$()` larik nama potongan — dan `A$` skalar dipakai baris 1710
     untuk membaca tombol. Dua variabel berbeda dengan nama yang sama, sama
     seperti `I`/`I()` di SPACE.BAS. */
  tabel.push({ baris: 1300, jalan: function (m) {
      m.dim('R()', 100); m.dim('A$()', 100);
    } });
  tabel.push({ baris: 1400, jalan: function (m) { m.cls(); } });
  tabel.push({ baris: 1420, jalan: function (m) {
      m.layar(1); m.warna(8, 0);
    } });
  /* 1440 `LR` jari-jari tata letak, `SR` jari-jari potongan. Selisihnya —
     enam piksel — yang membuat potongannya meledak keluar dari pusat. */
  tabel.push({ baris: 1440, jalan: function (m) {
      m.v.LR = 50; m.v.SR = 44;
    } });
  tabel.push({ baris: 1450, jalan: function (m) {
      m.masukan('T$', 'title of chart? ');
    } });
  tabel.push({ baris: 1460, jalan: function (m) {
      m.masukan('N', 'how many items in chart? ');
    } });
  tabel.push({ baris: 1470, jalan: function (m) { m.v.S = 0; } });
  tabel.push({ baris: 1480, jalan: function (m) { m.untuk('I', 1, m.v.N, 1, 1510); } });
  tabel.push({ baris: 1490, bagian: [
      function (m) {
        var i = m.v.I;
        m.masukan(function (x) { m.v['R()'][i] = parseFloat(x) || 0; },
                  'numeric value ,name? ');
      },
      function (m) {
        var i = m.v.I;
        m.masukan(function (x) { m.v['A$()'][i] = x; }, '? ');
      }
    ] });
  tabel.push({ baris: 1500, jalan: function (m) {
      m.v.S = m.v.S + m.v['R()'][m.v.I];
    } });
  tabel.push({ baris: 1510, jalan: function (m) { m.lanjutkan('I'); } });
  /* 1520 nilai diubah jadi PECAHAN dari totalnya. Sesudah baris ini
     satuannya hilang — yang tersisa cuma perbandingan. */
  tabel.push({ baris: 1520, jalan: function (m) {
      for (m.v.I = 1; m.v.I <= m.v.N; m.v.I++) {
        m.v['R()'][m.v.I] = m.v['R()'][m.v.I] / m.v.S;
      }
    } });
  tabel.push({ baris: 1530, jalan: function (m) { m.v.A2 = 0; } });
  tabel.push({ baris: 1540, jalan: function (m) { m.cls(); } });
  /* 1550 judul dipusatkan dengan menghitung sendiri: kolom tengah 20
     dikurangi separuh panjang judulnya. */
  tabel.push({ baris: 1550, jalan: function (m) {
      var t = m.v['T$'] || '';
      m.locate(2, Math.round(20 - t.length / 2));
      m.cetak(t); m.barisBaru();
    } });
  /* 1560 kotak di sekeliling judul, dengan koordinat PIKSEL yang dihitung
     dari panjang teksnya: satu sel aksara SCREEN 1 lebarnya delapan piksel.
     Di berkas aslinya ada satu aksara TAB nyasar di tengah baris ini,
     tepat sebelum `,16` — GW-BASIC memperlakukannya seperti spasi. */
  tabel.push({ baris: 1560, jalan: function (m) {
      var p = (m.v['T$'] || '').length;
      m.garis(8 * (19.5 - p / 2) - 8, 7, 8 * (19.5 + p / 2), 16, 3, 'B');
    } });
  tabel.push({ baris: 1570, jalan: function (m) { m.untuk('C', 1, m.v.N, 1, 1680); } });
  /* 1580 sudut berjalan: ujung potongan sebelumnya jadi pangkal berikutnya. */
  tabel.push({ baris: 1580, jalan: function (m) {
      m.v.A1 = m.v.A2;
      m.v.A2 = m.v.A2 + m.v['R()'][m.v.C] * 2 * 3.1415926;
    } });
  tabel.push({ baris: 1590, jalan: function (m) {
      m.v.AA = (m.v.A1 + m.v.A2) / 2;
    } });
  /* 1600-1610 PUSAT TIAP POTONGAN DIGESER enam piksel sepanjang garis bagi
     sudutnya. Itu seluruh mekanisme "pai yang meledak". */
  tabel.push({ baris: 1600, jalan: function (m) {
      m.v.CX = 160 + Math.cos(m.v.AA) * (m.v.LR - m.v.SR);
    } });
  tabel.push({ baris: 1610, jalan: function (m) {
      m.v.CY = 100 - Math.sin(m.v.AA) * (m.v.LR - m.v.SR);
    } });
  /* 1620 sudut NEGATIF berarti "gambar jari-jarinya juga". Dan `-A1-0.001`
     memaksa sudut pertama jadi negatif sungguhan — lihat catatan di kepala. */
  tabel.push({ baris: 1620, jalan: function (m) {
      m.lingkaran(m.v.CX, m.v.CY, m.v.SR, 1,
                  -m.v.A1 - 0.001, -m.v.A2, 5 / 6);
    } });
  /* 1630 `C MOD 4` — warna isi berputar 1,2,3,0,1,... dan nol adalah warna
     LATAR. Potongan keempat, kedelapan, dan seterusnya jadi tak terlihat. */
  tabel.push({ baris: 1630, jalan: function (m) {
      m.cat(m.v.CX + Math.cos(m.v.AA) * 0.8 * m.v.SR,
            m.v.CY - Math.sin(m.v.AA) * 0.8 * m.v.SR,
            m.v.C % 4, 1);
    } });
  tabel.push({ baris: 1640, jalan: function (m) {
      var n = (m.v['A$()'][m.v.C] || '').length;
      m.v.LX = m.v.CX + Math.cos(m.v.AA) * (16 + m.v.SR) - 4 * n;
      m.v.LY = m.v.CY - Math.sin(m.v.AA) * (m.v.SR + 16);
    } });
  /* 1650 koordinat PIKSEL diubah jadi koordinat SEL dengan bagi-bulat
     delapan. Grafik dan teks di layar yang sama, dijembatani satu operator. */
  tabel.push({ baris: 1650, jalan: function (m) {
      m.locate(1 + Math.trunc(m.v.LY / 8), 1 + Math.trunc(m.v.LX / 8));
      m.cetak(m.v['A$()'][m.v.C] || '');
    } });
  tabel.push({ baris: 1660, jalan: function (m) {
      var n = (m.v['A$()'][m.v.C] || '').length;
      var kx = Math.trunc(m.v.LX / 8), ky = Math.trunc(m.v.LY / 8);
      m.garis(kx * 8, 8 * (ky + 1), kx * 8 + 8 * n, 8 * (ky + 1), 1);
    } });
  tabel.push({ baris: 1670, jalan: function (m) { m.lanjutkan('C'); } });
  tabel.push({ baris: 1680, jalan: function (m) { m.locate(23, 1); } });
  tabel.push({ baris: 1700, jalan: function (m) {
      m.cetak('Another Chart? (Y or N)');
    } });
  tabel.push({ baris: 1710, jalan: function (m) {
      m.v['A$'] = m.inkey();
      if (m.v['A$'] === '') m.lompat(1710);
    } });
  tabel.push({ baris: 1730, jalan: function (m) {
      if (m.v['A$'] === 'N' || m.v['A$'] === 'n') m.lompat(1298);
    } });
  tabel.push({ baris: 1740, jalan: function (m) {
      if (m.v['A$'] === 'Y' || m.v['A$'] === 'y') m.lompat(1400);
    } });
  tabel.push({ baris: 1750, jalan: function (m) { m.lompat(1680); } });

  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['PIECHART'] = {
    nama: 'PIECHART',
    judul: 'Piechart (contoh IBM, 1982)',
    sumber: 'PIECHART',
    berkas: 'run/PIECHART.BAS',
    tabel: tabel,
    benih: 131,

    arsitektur: {
      judul: 'Alur PIECHART.BAS',
      simpul: [
        { id: 'judul', baris: '1010-1296', jenis: 'mulai',
          teks: ['Kerangka contoh IBM:', 'judul, uji kartu, uji BASICA'] },
        { id: 'tanya', baris: '1450-1510', jenis: 'putusan',
          teks: ['Judul, jumlah item,', 'lalu nilai dan nama tiap item'] },
        { id: 'bagi', baris: '1520',
          teks: ['Nilai jadi PECAHAN;', 'satuannya dibuang'] },
        { id: 'judulGbr', baris: '1550-1560',
          teks: ['Judul dipusatkan,', 'kotaknya dihitung dari panjangnya'] },
        { id: 'potong', baris: '1570-1630',
          teks: ['Tiap potongan dari pusatnya', 'SENDIRI — pai yang meledak'] },
        { id: 'label', baris: '1640-1660',
          teks: ['Nama ditaruh di luar busur;', 'piksel dibagi delapan jadi sel'] },
        { id: 'ulang', baris: '1680-1750', jenis: 'keluar',
          teks: ['Y ulangi, N kembali'] }
      ],
      panah: [
        { dari: 'judul', ke: 'tanya' },
        { dari: 'tanya', ke: 'bagi' },
        { dari: 'bagi', ke: 'judulGbr' },
        { dari: 'judulGbr', ke: 'potong' },
        { dari: 'potong', ke: 'label' },
        { dari: 'label', ke: 'potong', label: 'potongan berikutnya' },
        { dari: 'label', ke: 'ulang', label: 'semua tergambar' },
        { dari: 'ulang', ke: 'tanya', label: 'Y' }
      ]
    },

    pseudokode: [
      { baris: 1620, tingkat: 0, teks: 'sudut <b>negatif</b> di CIRCLE = gambar jari-jarinya juga &rarr; potongan pai' },
      { baris: 1620, tingkat: 1, teks: '&hellip;dan <code>-A1-0.001</code> memaksa sudut <b>nol</b> tetap terbaca negatif' },
      { baris: 1600, tingkat: 0, teks: 'pusat tiap potongan <b>digeser</b> sepanjang garis bagi sudutnya' },
      { baris: 1610, tingkat: 1, teks: '&hellip;selisih <code>LR-SR</code> = enam piksel: itu seluruh "pai yang meledak"' },
      { baris: 1520, tingkat: 0, teks: 'nilai diubah jadi <b>pecahan dari total</b>; satuannya dibuang' },
      { baris: 1630, tingkat: 0, teks: '<code>C MOD 4</code> &rarr; potongan keempat dicat dengan <b>warna latar</b>' },
      { baris: 1650, tingkat: 0, teks: 'koordinat piksel dibagi <b>delapan</b> jadi koordinat sel teks' },
      { baris: 1560, tingkat: 0, teks: 'kotak judul dihitung dari <b>panjang teksnya</b>, dalam piksel' }
    ],

    perintahAsli: 'run\\PIECHART.bat',
    catatanAsli: 'Ketik judul diagram, lalu jumlah item, lalu nilai dan nama ' +
      'tiap item dipisah koma. Coba dengan empat item atau lebih dan ' +
      'perhatikan potongan keempatnya.',

    penyimpangan: [
      '<b>Kerangka 940-1299 dibangun oleh SPACE.js.</b> Penyimpangannya sama ' +
      'persis: <code>PLAY</code> diam, <code>PEEK(&amp;H410)</code> selalu ' +
      'menjawab "ada kartu warna", dan <code>CHAIN "samples"</code> tidak ' +
      'pernah dicapai.',

      '<b>Satu aksara TAB nyasar di baris 1560</b> berkas aslinya, tepat ' +
      'sebelum <code>,16</code>. GW-BASIC memperlakukannya seperti spasi, ' +
      'jadi tidak ada akibatnya &mdash; tapi ia ada di sana.',

      '<b><code>INPUT "numeric value ,name";R(I),A$(I)</code> dipecah jadi ' +
      'dua permintaan</b> di penelusur, karena satu <code>INPUT</code> yang ' +
      'mengisi dua variabel sekaligus tidak punya padanan langsung.'
    ],

    pelajaran: {
      ringkas: 'Diagram pai yang seluruh irisannya merenggang tanpa satu ' +
        'baris pun yang khusus untuk itu &mdash; dan satu perseribu yang ' +
        'disisipkan untuk menghindari tabrakan arti.',
      pelajari: [
        ['Pai yang meledak, dari satu pengurangan',
         '<code>LR=50</code> jari-jari tata letak, <code>SR=44</code> ' +
         'jari-jari potongan. Selisihnya enam.',
         'Baris 1600-1610 memakai selisih itu untuk menggeser <b>pusat</b> ' +
         'tiap potongan enam piksel sepanjang garis bagi sudutnya sendiri. ' +
         'Potongan yang mengarah ke kanan bergeser ke kanan, yang ke atas ' +
         'bergeser ke atas.',
         'Hasilnya diagram pai yang irisannya merenggang dari tengah &mdash; ' +
         'dan tidak ada satu baris pun yang mengurus "perenggangan". Ia ' +
         'akibat dari menghitung pusat per potongan, bukan sekali untuk ' +
         'semua.'],
        ['Sudut negatif sebagai penanda bentuk',
         'Di GW-BASIC, <code>CIRCLE</code> dengan sudut awal dan akhir ' +
         'menggambar <b>busur</b>. Kalau sudutnya ditulis <b>negatif</b>, ia ' +
         'juga menggambar jari-jari dari pusat ke kedua ujungnya &mdash; ' +
         'menjadikannya potongan pai.',
         'Tandanya membawa arti yang tidak ada hubungannya dengan besarnya. ' +
         'Padat, dan itulah yang melahirkan cacat di butir berikutnya.'],
        ['Menjembatani piksel dan sel dengan satu pembagian',
         'Baris 1650: <code>LOCATE 1+(LY\\8),1+(LX\\8)</code>. Satu sel aksara ' +
         'di SCREEN 1 lebarnya delapan piksel dan tingginya delapan piksel, ' +
         'jadi bagi-bulat delapan mengubah koordinat gambar jadi koordinat ' +
         'teks.',
         'Dan baris 1660 melakukan kebalikannya &mdash; mengalikan kembali ' +
         'jadi piksel untuk menggarisbawahi namanya. Dua sistem koordinat di ' +
         'satu layar, dijembatani satu operator.']
      ],
      hindari: [
        ['Nol yang tidak bisa dibedakan dari "tidak ada"',
         'Baris 1620 menulis <code>-A1-0.001</code>, bukan <code>-A1</code>.',
         'Sebabnya: potongan pertama mulai di sudut <b>nol</b>, dan minus nol ' +
         'tetap nol. GW-BASIC tidak bisa membedakan "sudut nol, gambar ' +
         'jari-jarinya" dari "sudut tidak diberikan" &mdash; jadi potongan ' +
         'pertama akan kehilangan satu sisinya.',
         'Tambahan sepersepuluh derajat memaksanya jadi bilangan negatif yang ' +
         'sebenarnya. Angkanya sengaja sekecil mungkin supaya tidak terlihat.',
         'Ini jenis tambalan yang benar dan sekaligus rapuh: ia bekerja, ' +
         'tapi tidak ada satu <code>REM</code> pun yang menjelaskannya, dan ' +
         'siapa pun yang merapikan angka "aneh" itu akan mematahkan potongan ' +
         'pertamanya.'],
        ['Warna yang berputar melewati warna latar',
         'Baris 1630: <code>PAINT (...), C MOD 4, 1</code>. Dengan empat warna ' +
         'di SCREEN 1, sisa bagi empat menghasilkan 1, 2, 3, <b>0</b>, 1, ' +
         '2, 3, 0&hellip;',
         'Dan nol adalah <b>warna latar</b>. Potongan keempat, kedelapan, dan ' +
         'seterusnya dicat dengan warna yang sama dengan latarnya &mdash; ' +
         'jadi tidak terlihat sama sekali, cuma garis tepinya.',
         'Yang benar <code>1+(C-1) MOD 3</code>: berputar di 1, 2, 3 saja. ' +
         'Kesalahannya cuma terlihat kalau diagramnya punya empat item atau ' +
         'lebih &mdash; dan contoh di manualnya kemungkinan besar tiga.'],
        ['Nama yang dipakai dua kali, lagi',
         '<code>A$(100)</code> menyimpan nama potongan; <code>A$</code> tanpa ' +
         'kurung dipakai baris 1710 untuk membaca tombol. Di BASIC keduanya ' +
         'variabel berbeda, jadi programnya benar &mdash; tapi ini tabrakan ' +
         'yang ketiga di koleksi ini, sesudah BOWLING dan SPACE.'],
        ['Seratus item yang tidak bisa muat',
         '<code>DIM R(100),A$(100)</code>. Tapi label potongan ditaruh dengan ' +
         '<code>LOCATE</code> di layar 40&times;25, dan warna isinya cuma ' +
         'punya tiga nilai yang terlihat. Diagram dengan sepuluh item saja ' +
         'sudah bertumpuk labelnya.',
         'Batas larik dan batas yang sebenarnya berjarak jauh, dan yang ' +
         'diberitahukan ke pemakainya cuma yang pertama.']
      ]
    },

    penjelasan: [
      { judul: 'Sepersepuluh derajat yang menyelamatkan potongan pertama',
        isi: [
          'Baris 1620 adalah baris yang menggambar tiap potongan:',
          '<code>1620 CIRCLE (CX,CY),SR,1,-A1-0.001,-A2,5/6</code>',
          'Dua argumen di tengah itu sudut awal dan sudut akhir. Keduanya ' +
          'ditulis <b>negatif</b>, dan tanda minusnya bukan soal arah.',
          'Di GW-BASIC, sudut negatif pada <code>CIRCLE</code> berarti: ' +
          '<i>gambar busurnya, DAN gambar jari-jari dari pusat ke kedua ' +
          'ujungnya.</i> Tanpa minus yang keluar cuma lengkung melayang; ' +
          'dengan minus ia jadi potongan pai.',
          'Tandanya membawa arti yang tidak ada hubungannya dengan besar ' +
          'sudutnya. Dan di situlah masalahnya.',
          'Potongan <b>pertama</b> mulai di <code>A1 = 0</code>. Dan minus nol ' +
          'tetap nol. Penafsirnya melihat angka nol dan tidak punya cara tahu ' +
          'apakah itu "sudut nol, tolong gambar jari-jarinya" atau "sudut ' +
          'tidak diberikan sama sekali".',
          'Akibatnya potongan pertama akan kehilangan satu sisinya &mdash; ' +
          'satu-satunya irisan di seluruh diagram yang terbuka.',
          'Tambalannya: <code>-A1-0.001</code>. Kurangi seperseribu radian ' +
          '&mdash; sekitar sepertujuh belas derajat &mdash; supaya angkanya ' +
          'benar-benar negatif.',
          'Kecil sekali. Di lingkaran berjari-jari 44 piksel, seperseribu ' +
          'radian menggeser ujungnya kurang dari setengah piksel. Tidak ada ' +
          'yang bisa melihatnya.',
          'Yang dibelinya bisa dihitung. Digambar di permukaan grafik ' +
          'penelusur, satu potongan sepanjang satu radian menghasilkan:',
          '<code>CIRCLE (160,100),44,1,0.001,1 &nbsp; &rarr; &nbsp; 48 ' +
          'piksel &nbsp; (busur telanjang)</code>',
          '<code>CIRCLE (160,100),44,1,-0,-1 &nbsp;&nbsp;&nbsp; &rarr; ' +
          '&nbsp; 81 piksel &nbsp; (busur + SATU jari-jari)</code>',
          '<code>CIRCLE (160,100),44,1,-0.001,-1 &rarr; &nbsp; 122 piksel ' +
          '&nbsp; (busur + dua jari-jari)</code>',
          'Empat puluh satu piksel. Itu harga dari seperseribu radian, dan ' +
          'itu satu sisi utuh potongan pertama.',
          'Yang membuat tambalan ini layak dicatat bukan kepintarannya, ' +
          'melainkan <b>ketidakterlihatannya</b>. Tidak ada satu ' +
          '<code>REM</code> pun di berkas ini yang menjelaskan kenapa ada ' +
          'angka 0.001 di sana. Siapa pun yang membaca baris itu hari ini ' +
          'akan menyangkanya sisa dari eksperimen, dan siapa pun yang ' +
          'merapikannya akan mematahkan potongan pertama &mdash; satu ' +
          'potongan, di satu tempat, yang mungkin baru ketahuan berbulan-bulan ' +
          'kemudian.',
          'Tambalan yang benar dan tidak dijelaskan adalah ranjau yang ' +
          'ditanam dengan niat baik.'
        ] },
      { judul: 'Potongan yang tidak pernah terlihat',
        isi: [
          'Baris 1630 memilih warna isi tiap potongan:',
          '<code>1630 PAINT (CX+COS(AA)*0.8*SR,CY-SIN(AA)*0.8*SR),C MOD 4,1</code>',
          'Titik yang dicat dihitung dengan rapi &mdash; delapan persepuluh ' +
          'jari-jari sepanjang garis bagi sudutnya, jadi selalu jatuh di ' +
          'dalam potongan yang benar, sejauh mungkin dari kedua tepinya. Itu ' +
          'bagian yang dipikirkan.',
          'Warnanya <code>C MOD 4</code>.',
          'SCREEN 1 punya empat warna: 0, 1, 2, 3. Dan warna <b>0 adalah ' +
          'warna latar</b>. Sisa bagi empat dari nomor potongan menghasilkan:',
          '<code>potongan 1 &rarr; 1 &nbsp; 2 &rarr; 2 &nbsp; 3 &rarr; 3 ' +
          '&nbsp; 4 &rarr; 0 &nbsp; 5 &rarr; 1 &nbsp; &hellip;</code>',
          'Potongan keempat dicat dengan warna latar. Ia tidak hilang ' +
          '&mdash; garis tepinya tetap tergambar &mdash; tapi bagian dalamnya ' +
          'sama hitamnya dengan sisa layar. Begitu juga potongan kedelapan, ' +
          'kedua belas, dan seterusnya.',
          'Yang benar cukup <code>1+(C-1) MOD 3</code>, yang berputar di 1, ' +
          '2, 3 saja.',
          'Kenapa tidak ketahuan? Karena diagram dengan tiga item bekerja ' +
          'sempurna. Dan tiga item adalah jumlah yang paling mungkin dipakai ' +
          'orang yang mencoba program contoh sebentar.',
          'Cacat yang bersembunyi di balik <b>cara program itu biasanya ' +
          'dicoba</b>, bukan di balik kerumitan kodenya.'
        ] }
    ]
  };
})(window);
