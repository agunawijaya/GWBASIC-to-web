/* ===========================================================================
   BUSFOUR.js — porting minimalis BUSFOUR.BAS sebagai tabel baris.

   Langkah keenam: NERACA SALDO. Dan berkas ini berbeda dari saudara-saudaranya
   dalam satu hal yang layak ditelusuri:

   TABELNYA DIRAKIT DULU SEBAGAI STRING, BARU DICETAK.

   Baris 80-350 tidak mencetak apa pun. Ia menyusun enam belas variabel string
   — JA sampai JP — berisi baris demi baris tabelnya, lengkap dengan aksara
   kotak di persimpangannya:

       80  JA=CHR$(201):FOR I=1 TO 6:JA=JA+"═":NEXT
       90  JA=JA+"╦":FOR I=1 TO 30:JA=JA+"═":NEXT

   Baru di baris 570-620 keenam belasnya dicetak berurutan. Bandingkan
   BUSNINE.BAS, yang menggambar garis tabelnya SATU AKSARA PER `LOCATE`
   sesudah angkanya dicetak. Dua cara, dua berkas, keluarga yang sama.

   `DEFSTR J,L` di baris 10 yang membuat JA..JP bertipe string tanpa tanda $.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 40) dijadikan pembuang penyangga tombol, karena
     dipasangkan dengan gelung pembuang `IF INKEY$<>""` di baris 50.
   - Berakhir dengan `RUN"BUSFIVE"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var DATAR = 196, TEGAK = 179,
      KIRI_ATAS = 218, KANAN_ATAS = 191, KANAN_BAWAH = 217, KIRI_BAWAH = 192;

  /* Aksara kotak garis ganda yang dipakai merakit tabelnya. */
  var G = { ka: 201, kn: 187, ba: 200, bn: 188, d: 205, t: 186,
            ta: 203, tb: 202, sk: 204, sn: 185, x: 206,
            sbk: 199, sbn: 182, sbx: 215 };

  function ulang(kode, n) {
    var s = String.fromCharCode(kode), k = '', i;
    for (i = 0; i < n; i++) k += s;
    return k;
  }
  function c(kode) { return String.fromCharCode(kode); }

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.jebakan(10, true); m.pasangJebakan(10, 660);
      } },
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.jebakan(m.v.A, true); m.pasangJebakan(m.v.A, 70);
        }
      } },
    { baris: 30, jalan: function (m) { m.lompat(80); } },

    { baris: 40, jalan: function (m) { m.kosongkanPenyangga(); } },
    { baris: 50, jalan: function (m) { if (m.inkey() !== '') m.lompat(40); } },
    { baris: 60, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(60);
      } },
    { baris: 70, jalan: function (m) { m.kembali(); } },

    /* --- 80-350: merakit tabelnya sebagai string -------------------------- */
    /* Gelung `FOR I=1 TO 6:JA=JA+"═":NEXT` di sini ditulis sebagai satu
       pemanggilan `ulang()`. Gelungnya tidak punya percabangan dan tidak ada
       yang bisa disorot di dalamnya. */
    { baris: 80, jalan: function (m) { m.v.JA = c(G.ka) + ulang(G.d, 6); } },
    { baris: 90, jalan: function (m) { m.v.JA += c(G.ta) + ulang(G.d, 30); } },
    { baris: 100, jalan: function (m) { m.v.JA += c(G.ta) + ulang(G.d, 23); } },
    { baris: 110, jalan: function (m) { m.v.JA += c(G.kn); } },
    { baris: 120, jalan: function (m) {
        m.v.JB = c(G.t) + ' ACCT ' + c(G.t) + '        ACCOUNT NAME          ' +
                 c(G.t) + '     TRIAL BALANCE     ' + c(G.t);
      } },
    { baris: 130, jalan: function (m) {
        m.v.JC = c(G.t) + '      ' + c(G.t) + '                              ' +
                 c(G.t) + '  DEBIT       CREDIT   ' + c(G.t);
      } },
    { baris: 140, jalan: function (m) { m.v.JD = c(G.sk) + ulang(G.d, 6); } },
    { baris: 150, jalan: function (m) { m.v.JD += c(G.x) + ulang(G.d, 30); } },
    { baris: 160, jalan: function (m) { m.v.JD += c(G.x) + ulang(G.d, 11); } },
    { baris: 170, jalan: function (m) { m.v.JD += c(G.ta) + ulang(G.d, 11); } },
    { baris: 180, jalan: function (m) { m.v.JD += c(G.sn); } },

    /* 190-270 SEMBILAN akun, seluruhnya teks harfiah — sama seperti di
       BUSTWO.BAS dan BUSNINE.BAS. Tidak ada satu pun perhitungan. */
    akun(190, 'JE', '║  11  ║   CASH                       ║ 14,240.00 ║           ║'),
    akun(200, 'JF', '║  12  ║   ACCOUNTS RECEIVABLE        ║  1,695.00 ║           ║'),
    akun(210, 'JG', '║  14  ║   SUPPLIES                   ║  5,655.00 ║           ║'),
    akun(220, 'JH', '║  21  ║   ACCOUNTS PAYABLE           ║           ║  3,500.00 ║'),
    akun(230, 'JI', '║  31  ║   OWNER CAPITAL              ║           ║ 14,700.00 ║'),
    akun(240, 'JJ', '║  32  ║   OWNER CAPITAL, WITHDRAWAL  ║    860.00 ║           ║'),
    akun(250, 'JK', '║  41  ║   SALES                      ║           ║ 12,045.00 ║'),
    akun(260, 'JL', '║  51  ║   SALARY EXPENSE             ║  1,750.00 ║           ║'),
    akun(270, 'JM', '║  52  ║   SUPPLIES EXPENSE           ║  6,045.00 ║           ║'),

    { baris: 280, jalan: function (m) {
        m.v.JO = c(G.t) + '      ' + c(G.t) + '                              ' +
                 c(G.sbk);
      } },
    { baris: 290, jalan: function (m) { m.v.JO += ulang(DATAR, 11) + c(G.sbx); } },
    { baris: 300, jalan: function (m) { m.v.JO += ulang(DATAR, 11) + c(G.sbn); } },
    /* 310 baris total. Perhatikan `30245.00` DITULIS TANPA KOMA, sementara
       kesembilan angka di atasnya memakai koma ribuan. */
    akun(310, 'JP', '║      ║                              ║  30245.00 ║  30245.00 ║'),
    { baris: 320, jalan: function (m) { m.v.JN = c(G.ba) + ulang(G.d, 6); } },
    { baris: 330, jalan: function (m) { m.v.JN += c(G.tb) + ulang(G.d, 30); } },
    { baris: 340, jalan: function (m) { m.v.JN += c(G.tb) + ulang(G.d, 11); } },
    { baris: 350, jalan: function (m) {
        m.v.JN += c(G.tb) + ulang(G.d, 11) + c(G.bn);
      } },
    { baris: 360, jalan: function (m) { m.lompat(460); } },

    /* --- 370-450: kepala halaman ------------------------------------------ */
    { baris: 370, jalan: function (m) {
        m.cls(); m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
      } },
    { baris: 380, jalan: function (m) { m.warna(11, 0); } },
    { baris: 390, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.H = 20; m.v.H <= 62; m.v.H++) {
            m.locate(m.v.I, m.v.H, 0); m.cetak(m.chr(DATAR)); m.barisBaru();
          }
        }
      } },
    { baris: 400, jalan: function (m) {
        sudut(m, 1, 19, KIRI_ATAS); sudut(m, 1, 63, KANAN_ATAS);
        sudut(m, 3, 63, KANAN_BAWAH); sudut(m, 3, 19, KIRI_BAWAH);
      } },
    { baris: 410, jalan: function (m) {
        m.locate(2, 19); m.cetak(m.chr(TEGAK)); m.spc(43);
        m.cetak(m.chr(TEGAK)); m.barisBaru();
      } },
    { baris: 420, jalan: function (m) { m.warna(0, 7); } },
    { baris: 430, jalan: function (m) {
        m.locate(2, 22);
        m.cetak(' B U S I N E S S   S I M U L A T I O N '); m.barisBaru();
      } },
    { baris: 440, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 30);
        m.cetak('STEP VI. TRIAL BALANCE'); m.barisBaru();
        m.tab(30); m.cetak('----------------------'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 450, jalan: function (m) { m.kembali(); } },

    /* --- 460-650: dua layar ----------------------------------------------- */
    { baris: 460, jalan: function (m) { m.gosub(370); } },
    { baris: 470, jalan: function (m) {
        m.locate(7, 18);
        m.cetak('The purpose of the trial balance is not to provide');
        m.barisBaru();
      } },
    naskah(480, 13, 'complete proof of accuracy,  but instead to insure that'),
    naskah(490, 13, 'the debits and the credits are equal. An addition error'),
    naskah(500, 13, 'will show up but an error such as posting a transaction'),
    naskah(510, 13, 'twice or failing to post it all together or posting one'),
    naskah(520, 13, 'to the wrong accounts will not be detected on the Trial'),
    naskah(530, 13, 'Balance.'),
    { baris: 540, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 16);
        m.cetak('***** Strike Any Key For The Trial Balance *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 550, jalan: function (m) { m.gosub(40); } },
    { baris: 560, jalan: function (m) { m.gosub(370); } },
    { baris: 570, jalan: function (m) {
        m.locate(7, 8); m.cetak(m.v.JA); m.barisBaru();
        m.tab(8); m.cetak(m.v.JB); m.barisBaru();
        m.tab(8); m.cetak(m.v.JC); m.barisBaru();
      } },
    cetakTiga(580, 'JD', 'JE', 'JF'),
    cetakTiga(590, 'JG', 'JH', 'JI'),
    cetakTiga(600, 'JJ', 'JK', 'JL'),
    cetakTiga(610, 'JM', 'JO', 'JP'),
    { baris: 620, jalan: function (m) {
        m.tab(8); m.cetak(m.v.JN); m.barisBaru();
      } },
    { baris: 630, jalan: function (m) {
        m.warna(11, 0); m.locate(23, 15);
        m.cetak('***** Strike Any Key To Prepare The Worksheet *****');
        m.barisBaru(); m.warna(7, 0);
      } },
    { baris: 640, jalan: function (m) { m.gosub(40); } },
    { baris: 650, jalan: function (m) { m.jalankan('BUSFIVE'); } },
    { baris: 660, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function akun(nomor, nama, isi) {
    /* Teks tabelnya ditulis dengan aksara Unicode di berkas ini supaya
       terbaca; konsol menerjemahkannya ke CP437 lewat pemetaan yang sama. */
    return { baris: nomor, jalan: function (m) { m.v[nama] = keBita(isi); } };
  }
  function naskah(nomor, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.tab(kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  /* Baris 580-610 masing-masing memuat TIGA pernyataan PRINT — tiga baris
     tabel per baris program. */
  function cetakTiga(nomor, a, b, d) {
    return { baris: nomor, jalan: function (m) {
      m.tab(8); m.cetak(m.v[a]); m.barisBaru();
      m.tab(8); m.cetak(m.v[b]); m.barisBaru();
      m.tab(8); m.cetak(m.v[d]); m.barisBaru();
    } };
  }
  function sudut(m, b, k, kode) {
    m.locate(b, k); m.cetak(m.chr(kode)); m.barisBaru();
  }

  /* Balikkan glif kotak Unicode ke bita CP437-nya, supaya string di dalam
     program tetap berisi BITA seperti di GW-BASIC. */
  var PETA = { '║': 186, '═': 205, '╔': 201, '╗': 187,
               '╚': 200, '╝': 188, '╠': 204, '╣': 185,
               '╦': 203, '╩': 202, '╬': 206, '─': 196,
               '│': 179, '╟': 199, '╢': 182, '╫': 215 };
  function keBita(s) {
    var keluar = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      keluar += PETA[ch] !== undefined ? String.fromCharCode(PETA[ch]) : ch;
    }
    return keluar;
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BUSFOUR'] = {
    nama: 'BUSFOUR',
    judul: 'Business Simulation VI — neraca saldo',
    sumber: 'BUSFOUR',
    berkas: 'run/BUSFOUR.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSFOUR.BAS',
      simpul: [
        { id: 'jebak', baris: '10-30', jenis: 'mulai',
          teks: ['F10 ke menu;', 'F1-F9 dijebak jadi tak berbunyi'] },
        { id: 'rakit', baris: '80-350',
          teks: ['Rakit 16 baris tabel', 'sebagai string — belum dicetak'] },
        { id: 'kepala', baris: '370-450', jenis: 'subrutin',
          teks: ['Kotak judul', 'STEP VI'] },
        { id: 'naskah', baris: '470-540',
          teks: ['Apa gunanya neraca saldo,', 'dan apa yang TIDAK ketahuan'] },
        { id: 'tunggu', baris: '40-70', jenis: 'subrutin',
          teks: ['Buang penyangga,', 'tunggu satu tombol'] },
        { id: 'cetak', baris: '570-620',
          teks: ['Cetak keenam belas', 'string itu berurutan'] },
        { id: 'lanjut', baris: '650', jenis: 'keluar',
          teks: ['RUN "BUSFIVE"'] }
      ],
      panah: [
        { dari: 'jebak', ke: 'rakit' },
        { dari: 'rakit', ke: 'kepala' },
        { dari: 'kepala', ke: 'naskah' },
        { dari: 'naskah', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'kepala', label: 'digambar ulang' },
        { dari: 'kepala', ke: 'cetak' },
        { dari: 'cetak', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'lanjut' }
      ]
    },

    pseudokode: [
      { baris: 10, tingkat: 0, teks: '<code>DEFSTR J,L</code> &mdash; JA sampai JP bertipe string tanpa tanda <code>$</code>' },
      { baris: 80, tingkat: 0, teks: '<b>rakit</b> enam belas baris tabel sebagai string, tanpa mencetak apa pun' },
      { baris: 190, tingkat: 1, teks: 'sembilan akun, seluruhnya teks harfiah' },
      { baris: 310, tingkat: 1, teks: 'baris total <code>30245.00</code> &mdash; <b>tanpa koma ribuan</b>, tidak seperti yang lain' },
      { baris: 470, tingkat: 0, teks: 'layar 1: apa gunanya neraca saldo &mdash; dan apa yang tidak ketahuan darinya' },
      { baris: 570, tingkat: 0, teks: 'layar 2: cetak keenam belas string itu berurutan' },
      { baris: 650, tingkat: 0, teks: '<code>RUN "BUSFIVE"</code>' }
    ],

    perintahAsli: 'run\\BUSFOUR.bat',
    catatanAsli: 'Langkah keenam dari rangkaian BUSONE sampai BUSTEN.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 40), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris 50.',

      '<b>Gelung perakit garis ditulis sebagai satu pemanggilan.</b> ' +
      '<code>FOR I=1 TO 6:JA=JA+"═":NEXT</code> tidak punya percabangan dan ' +
      'tidak ada apa pun di dalamnya yang bisa disorot, jadi ia ditulis ' +
      'sebagai satu langkah. Hasil stringnya identik.',

      '<b>Aksara kotak ditulis sebagai glif di berkas port</b> supaya terbaca, ' +
      'lalu dibalikkan ke bita CP437 sebelum dipakai &mdash; jadi string di ' +
      'dalam program tetap berisi bita, seperti di GW-BASIC.',

      '<b>Berakhir dengan <code>RUN"BUSFIVE"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Neraca saldo yang tabelnya dirakit dulu sebagai string baru ' +
        'dicetak &mdash; kebalikan dari cara BUSNINE.BAS, di keluarga program ' +
        'yang sama.',
      pelajari: [
        ['Merakit tampilan sebelum mencetaknya',
         'Baris 80&ndash;350 tidak menampilkan apa pun. Ia menyusun enam belas ' +
         'string berisi baris demi baris tabelnya, lengkap dengan aksara kotak ' +
         'di tiap persimpangan. Baru baris 570&ndash;620 mencetak semuanya. ' +
         '<b>Memisahkan "menyusun" dari "menampilkan"</b> &mdash; yang di ' +
         'antarmuka modern disebut membangun pohon dulu, menggambar ' +
         'belakangan.'],
        ['Aksara persimpangan yang tepat',
         'Tabel garis ganda punya aksara berbeda untuk tiap bentuk sambungan: ' +
         '<code>203</code> cabang ke bawah, <code>202</code> ke atas, ' +
         '<code>206</code> silang, <code>204</code>/<code>185</code> sambungan ' +
         'kiri dan kanan. Baris 140&ndash;180 memakai keempatnya dalam satu ' +
         'baris pemisah.'],
        ['DEFSTR untuk sekelompok variabel',
         '<code>DEFSTR J,L</code> membuat setiap variabel berawalan J atau L ' +
         'bertipe string tanpa perlu menulis <code>$</code>. Untuk enam belas ' +
         'variabel bernama JA sampai JP, itu enam belas tanda dolar yang ' +
         'tidak perlu diketik &mdash; dan enam belas kesempatan salah ketik ' +
         'yang hilang.']
      ],
      hindari: [
        ['Total yang bentuknya beda sendiri',
         'Kesembilan angka di tabelnya ditulis <code>14,240.00</code>, ' +
         '<code>1,695.00</code>, <code>12,045.00</code> &mdash; dengan koma ' +
         'ribuan. Baris totalnya di 310 ditulis <code>30245.00</code>, ' +
         '<b>tanpa koma</b>. Angkanya benar (jumlah keduanya memang 30.245), ' +
         'tapi ia satu-satunya angka di layar yang bentuknya berbeda.'],
        ['Nama variabel yang melompat',
         'Urutan pendefinisiannya JE, JF, JG, JH, JI, JJ, JK, JL, JM, lalu ' +
         '<b>JO</b>, <b>JP</b>, baru <b>JN</b> di baris 320. Huruf N terlewat ' +
         'lalu dipakai belakangan untuk baris paling bawah. Enam belas nama ' +
         'yang satu-satunya artinya adalah urutan abjad, dan urutannya sendiri ' +
         'sudah tidak dipatuhi.'],
        ['Angka yang tidak pernah dijumlahkan',
         'Sama seperti BUSTWO dan BUSNINE: 14.240 + 1.695 + 5.655 + 860 + ' +
         '1.750 + 6.045 = 30.245 di sisi debit, 3.500 + 14.700 + 12.045 = ' +
         '30.245 di sisi kredit. Benar, dan <b>dijumlahkan manusia</b> sebelum ' +
         'diketik.']
      ]
    },

    penjelasan: [
      { judul: 'Dua cara menggambar tabel, di keluarga program yang sama',
        isi: [
          'BUSNINE.BAS menggambar tabelnya <b>sesudah</b> angkanya: ' +
          'angka dicetak dulu di baris 370&ndash;420, lalu garis kolomnya ' +
          'ditimpakan satu aksara per <code>LOCATE</code> di baris ' +
          '430&ndash;500.',
          'BUSFOUR.BAS melakukan kebalikannya. Baris 80&ndash;350 merakit ' +
          '<b>seluruh tabelnya</b> sebagai enam belas string &mdash; garis, ' +
          'persimpangan, angka, semuanya &mdash; tanpa menyentuh layar sama ' +
          'sekali. Baru baris 570&ndash;620 mencetaknya berurutan.',
          'Cara kedua lebih baik, dan alasannya bukan selera. Tabel yang ' +
          'sudah utuh sebagai string bisa dicetak ke mana saja: layar, ' +
          'printer, berkas. Tabel yang digambar dengan <code>LOCATE</code> ' +
          'cuma bisa ke satu tempat, dan urutan penggambarannya jadi bagian ' +
          'dari hasilnya.',
          'Yang menarik: keduanya ditulis untuk rangkaian yang sama, ' +
          'kemungkinan besar oleh orang yang sama, dan tidak ada satu pun ' +
          'petunjuk mana yang lebih dulu.'
        ] },
      { judul: 'Naskah yang mengaku apa yang tidak bisa dilakukannya',
        isi: [
          'Baris 470&ndash;530 layak dibaca sampai habis, karena isinya jujur ' +
          'dengan cara yang jarang:',
          '<i>"tujuan neraca saldo bukan memberi bukti lengkap ketelitian, ' +
          'melainkan memastikan debit dan kredit sama. Kesalahan penjumlahan ' +
          'akan terlihat, tapi kesalahan seperti mencatat transaksi dua kali, ' +
          'atau tidak mencatatnya sama sekali, atau mencatatnya ke akun yang ' +
          'salah, TIDAK akan ketahuan."</i>',
          'Itu penjelasan yang tepat tentang <b>apa yang bisa dan tidak bisa ' +
          'dijamin sebuah pemeriksaan</b>. Neraca saldo adalah <i>checksum</i>: ' +
          'ia menangkap kesalahan aritmetika, dan buta terhadap kesalahan ' +
          'makna.',
          'Setiap pemeriksaan otomatis punya bentuk yang sama. Uji yang lulus ' +
          'membuktikan satu hal, dan orang yang membacanya sering ' +
          'menyimpulkan hal lain. Naskah 1982 ini mengatakannya lebih jelas ' +
          'daripada kebanyakan dokumentasi hari ini.'
        ] }
    ]
  };
})(window);
