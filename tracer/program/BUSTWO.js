/* ===========================================================================
   BUSTWO.js — porting minimalis BUSTWO.BAS sebagai tabel baris.

   Langkah kedua dari dua belas pelajaran akuntansi (BUSONE..BUSTEN):
   menyusun BAGAN AKUN. Bentuknya sama seperti seluruh keluarga ini — mesin
   presentasi yang ditulis sebagai kode lurus, satu `PRINT` per baris naskah.

   Yang layak diperhatikan di berkas ini: DI SINILAH ANGKA AWALNYA DITETAPKAN.

       11  Cash                    $8000    Asset
       14  Supplies                $6700    Asset
       31  Homer Jones, Capital   $14700    Capital

   8000 + 6700 = 14700. Neraca pembukanya SEIMBANG — dan tidak ada satu pun
   baris kode yang menghitungnya. Ketiga angka itu teks yang diketik tangan
   pada 1982 oleh orang yang menjumlahkannya sendiri lebih dulu.

   Sepuluh berkas kemudian, BUSNINE menutup buku di 19.840 — juga seimbang,
   juga diketik tangan. Seluruh "sistem akuntansi" ini tidak pernah menghitung
   apa pun.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 50) dijadikan pembuang penyangga tombol, mengikuti
     BUSONE.BAS dan CHECK.BAS: di sini ia dipasangkan dengan gelung pembuang
     `IF INKEY$<>""` di baris 60, yang memang bentuk pemakaian itu.
   - Program ini berakhir dengan `RUN"BUSTHREE"`; kalau BUSTHREE belum punya
     tabel baris, penelusuran berhenti di sana dan mengatakannya.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Aksara kotak CP437, disimpan sebagai BITA seperti yang dilakukan CHR$. */
  var DATAR = 196, TEGAK = 179,
      KIRI_ATAS = 218, KANAN_ATAS = 191, KANAN_BAWAH = 217, KIRI_BAWAH = 192;

  var tabel = [

    { baris: 10, jalan: function (m) { m.jebakan(10, true); } },
    /* 20 SEMBILAN tombol fungsi dijebak, dan semuanya diarahkan ke baris 80
       yang isinya cuma RETURN. Itu bukan kelalaian: menjebak sebuah tombol
       lalu langsung kembali adalah cara MEMATIKANNYA, supaya F1-F9 tidak
       mengganggu presentasi. */
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.jebakan(m.v.A, true); m.pasangJebakan(m.v.A, 80);
        }
      } },
    { baris: 30, jalan: function (m) { m.pasangJebakan(10, 590); } },
    { baris: 40, jalan: function (m) { m.lompat(90); } },

    /* 50-80 tunggu satu tombol, dengan dua tahap pembuangan. */
    { baris: 50, jalan: function (m) { m.kosongkanPenyangga(); } },
    { baris: 60, jalan: function (m) { if (m.inkey() !== '') m.lompat(50); } },
    { baris: 70, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(70);
      } },
    /* 80 RETURN — penutup 50-70 SEKALIGUS badan jebakan F1-F9. */
    { baris: 80, jalan: function (m) { m.kembali(); } },

    { baris: 90, jalan: function (m) { m.gosub(490); } },
    naskah(100, 17, 'The first thing that must be done in automating your'),
    naskah(110, 12, 'bookkeeping procedures is the setting up of your chart of'),
    naskah(120, 12, 'accounts. In order to do this you must determine the type'),
    naskah(130, 12, 'of transactions you will be making daily.  Can a customer'),
    naskah(140, 12, 'charge his bill?  Do you always pay for your purchases in'),
    naskah(150, 12, 'cash or do you sometimes charge them? Is your income from'),
    naskah(160, 12, 'sales or service?'),
    naskah(170, 17, 'These are the questions you must ask your self.  The'),
    naskah(180, 12, 'level of detail to which you break down  your accounts is'),
    naskah(190, 12, 'your decision.  You can make them as simple or as complex'),
    naskah(200, 12, 'as you desire.'),
    { baris: 210, jalan: function (m) {
        m.tab(17); m.cetak('Some examples of accounts are ');
        m.warna(11, 0);
        m.cetak('CASH, ACCOUNTS PAYABLE'); m.barisBaru();
      } },
    naskah(220, 12, 'ACCOUNTS RECEIVABLE , RENT EXPENSE , SUPPLIES EXPENSE AND'),
    { baris: 230, jalan: function (m) {
        m.tab(12); m.cetak('REVENUE FROM SALES.'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 240, jalan: function (m) {
        m.warna(11, 0); m.locate(24, 19, 0);
        m.cetak('***** Strike Any Key To Set Up Accounts *****');
      } },
    { baris: 250, jalan: function (m) { m.gosub(50); } },
    { baris: 260, jalan: function (m) { m.gosub(490); } },
    { baris: 270, jalan: function (m) { m.locate(7, 1); } },
    naskah(280, 8, 'On the 1st of June,  Homer Jones opened up the ABC Hardware Company.'),
    naskah(290, 5, 'Below is a list of all the accounts he set up, along with the beginning'),
    naskah(300, 5, 'balances.  These are the only accounts that we will be using during our'),
    naskah(310, 5, 'business walk through.'),
    { baris: 320, jalan: function (m) { m.barisBaru(); m.warna(11, 0); } },
    naskah(330, 9, 'ACCOUNT NO     ACCOUNT NAME            BALANCE      ACCOUNT TYPE'),
    { baris: 340, jalan: function (m) {
        m.tab(9);
        m.cetak('----------   --------------------      -------      ------------');
        m.barisBaru(); m.warna(7, 0);
      } },

    /* 350-430 SELURUH bagan akunnya adalah teks harfiah. Tidak ada larik,
       tidak ada DATA, tidak ada penjumlahan. Perhatikan angkanya:
       8000 + 6700 = 14700 — neracanya seimbang, dan yang menyeimbangkannya
       manusia, sekali, pada 1982. */
    naskah(350, 13, '11       Cash                        $8000        Asset'),
    naskah(360, 13, '12       Accounts Receivable            $0        Asset'),
    naskah(370, 13, '14       Supplies                    $6700        Asset'),
    naskah(380, 13, '21       Accounts Payable               $0        Liability'),
    naskah(390, 13, '31       Homer Jones, Capital       $14700        Capital'),
    naskah(400, 13, '32       Homer Jones, Drawing           $0        Capital'),
    naskah(410, 13, '41       Sales                          $0        Revenue'),
    naskah(420, 13, '51       Salary Expense                 $0        Expense'),
    naskah(430, 13, '52       Supplies Expense               $0        Expense'),
    { baris: 440, jalan: function (m) { m.barisBaru(); } },
    { baris: 450, jalan: function (m) {
        m.warna(11, 0); m.locate(24, 17);
        m.cetak('***** Strike Any Key To Start Transactions *****');
        m.warna(7, 0);
      } },
    { baris: 460, jalan: function (m) { m.gosub(50); } },
    { baris: 470, jalan: function (m) { m.jalankan('BUSTHREE'); } },
    /* 480 END yang tidak pernah tercapai: baris 470 sudah pergi. */
    { baris: 480, jalan: function (m) { m.henti('END di baris 480.'); } },

    /* --- 490-580: kepala halaman, dipanggil dua kali --------------------- */
    { baris: 490, jalan: function (m) {
        m.cls(); m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
      } },
    { baris: 500, jalan: function (m) { m.warna(11, 0); } },
    /* 510 dua baris datar digambar SATU AKSARA PER LOCATE — 86 kali cetak
       untuk sesuatu yang bisa ditulis dengan satu STRING$(43,196). */
    { baris: 510, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.J = 20; m.v.J <= 62; m.v.J++) {
            m.locate(m.v.I, m.v.J, 0); m.cetak(m.chr(DATAR)); m.barisBaru();
          }
        }
      } },
    { baris: 520, jalan: function (m) {
        sudut(m, 1, 19, KIRI_ATAS); sudut(m, 1, 63, KANAN_ATAS);
        sudut(m, 3, 63, KANAN_BAWAH); sudut(m, 3, 19, KIRI_BAWAH);
      } },
    { baris: 530, jalan: function (m) {
        m.locate(2, 19); m.cetak(m.chr(TEGAK)); m.spc(43);
        m.cetak(m.chr(TEGAK)); m.barisBaru();
      } },
    { baris: 540, jalan: function (m) { m.warna(0, 7); } },
    { baris: 550, jalan: function (m) {
        m.locate(2, 22);
        m.cetak(' B U S I N E S S   S I M U L A T I O N ');
        m.barisBaru();
      } },
    { baris: 560, jalan: function (m) {
        m.warna(11, 0); m.locate(5, 24);
        m.cetak('STEP II. SET UP CHART OF ACCOUNTS'); m.barisBaru();
      } },
    { baris: 570, jalan: function (m) {
        m.tab(24); m.cetak('---------------------------------'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 580, jalan: function (m) { m.kembali(); } },
    { baris: 590, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function naskah(nomor, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.tab(kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function sudut(m, b, k, kode) {
    m.locate(b, k); m.cetak(m.chr(kode)); m.barisBaru();
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BUSTWO'] = {
    nama: 'BUSTWO',
    judul: 'Business Simulation II — bagan akun',
    sumber: 'BUSTWO',
    berkas: 'run/BUSTWO.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSTWO.BAS',
      simpul: [
        { id: 'jebak', baris: '10-40', jenis: 'mulai',
          teks: ['F10 ke menu;', 'F1-F9 dijebak jadi tak berbunyi'] },
        { id: 'kepala', baris: '490-580', jenis: 'subrutin',
          teks: ['Kotak judul', '"BUSINESS SIMULATION"'] },
        { id: 'teks', baris: '100-230',
          teks: ['Empat belas baris naskah:', 'apa itu bagan akun'] },
        { id: 'tunggu', baris: '50-80', jenis: 'subrutin',
          teks: ['Buang penyangga,', 'tunggu satu tombol'] },
        { id: 'bagan', baris: '350-430',
          teks: ['Sembilan akun,', 'seluruhnya teks harfiah'] },
        { id: 'lanjut', baris: '470', jenis: 'keluar',
          teks: ['RUN "BUSTHREE"'] }
      ],
      panah: [
        { dari: 'jebak', ke: 'kepala' },
        { dari: 'kepala', ke: 'teks' },
        { dari: 'teks', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'kepala', label: 'digambar ulang' },
        { dari: 'kepala', ke: 'bagan' },
        { dari: 'bagan', ke: 'tunggu' },
        { dari: 'tunggu', ke: 'lanjut' }
      ]
    },

    pseudokode: [
      { baris: 20, tingkat: 0, teks: 'jebak F1&ndash;F9 ke sebuah <code>RETURN</code> &mdash; <b>cara mematikan tombol</b>' },
      { baris: 30, tingkat: 0, teks: 'jebak F10 ke <code>RUN "menu"</code>' },
      { baris: 490, tingkat: 0, teks: 'gambar kotak judul dan tulis nomor langkahnya' },
      { baris: 100, tingkat: 0, teks: 'cetak empat belas baris naskah, satu <code>PRINT</code> per baris' },
      { baris: 250, tingkat: 0, teks: 'tunggu satu tombol' },
      { baris: 260, tingkat: 0, teks: 'gambar ulang kotak judul, lalu cetak <b>bagan akunnya</b>' },
      { baris: 350, tingkat: 1, teks: 'sembilan akun &mdash; <b>teks harfiah, tidak ada satu pun perhitungan</b>' },
      { baris: 470, tingkat: 0, teks: '<code>RUN "BUSTHREE"</code>' }
    ],

    perintahAsli: 'run\\BUSTWO.bat',
    catatanAsli: 'Bagian dari rangkaian BUSONE sampai BUSTEN; tiap berkas ' +
      'memanggil berikutnya dengan RUN, jadi menjalankan BUSONE akan sampai ' +
      'ke sini sendiri.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 50), mengikuti BUSONE.BAS dan CHECK.BAS: di sini ia dipasangkan ' +
      'dengan gelung pembuang <code>IF INKEY$&lt;&gt;""</code> di baris 60, ' +
      'yang memang bentuk pemakaian itu. Bandingkan DRAW.BAS, tempat poke yang ' +
      'sama BUKAN pembuang penyangga.',

      '<b>Program berakhir dengan <code>RUN"BUSTHREE"</code>.</b> Kalau ' +
      'BUSTHREE belum punya tabel baris, penelusuran berhenti di sana dan ' +
      'mengatakannya.'
    ],

    pelajaran: {
      ringkas: 'Pelajaran akuntansi yang menetapkan angka pembukanya sebagai ' +
        'teks yang diketik tangan &mdash; seimbang, tapi tidak ada satu baris ' +
        'pun yang menghitungnya.',
      pelajari: [
        ['Menjebak tombol untuk mematikannya',
         'Baris 20 memasang penangan untuk F1 sampai F9, dan seluruhnya ' +
         'menunjuk baris 80 yang isinya cuma <code>RETURN</code>. Itu bukan ' +
         'kelalaian: <b>menjebak sebuah tombol lalu langsung kembali adalah ' +
         'cara membuatnya tidak berbuat apa-apa</b>, supaya presentasi tidak ' +
         'terganggu. Hanya F10 yang punya arti.'],
        ['Satu subrutin kepala halaman, dipanggil tiap layar',
         'Baris 490&ndash;580 menggambar kotak judul dan nomor langkahnya. ' +
         'Dipanggil dua kali di sini, dan versi yang hampir sama ada di ' +
         'sepuluh berkas lain keluarga ini. <b>Satu-satunya yang berbeda antar ' +
         'berkas cuma dua baris teks judulnya.</b>'],
        ['Naskah sebagai kode lurus',
         'Empat belas <code>PRINT TAB(12)</code> berturut-turut. Tidak ada ' +
         'larik teks, tidak ada <code>DATA</code>, tidak ada gelung. Tiap ' +
         'baris naskah adalah satu baris program. Bentuk yang tidak akan ' +
         'ditulis siapa pun hari ini, tapi bisa dibaca dari atas ke bawah ' +
         'seperti naskah pidato.']
      ],
      hindari: [
        ['Angka yang seimbang karena diketik seimbang',
         '<code>$8000</code> + <code>$6700</code> = <code>$14700</code>. ' +
         'Neraca pembukanya benar &mdash; dan <b>tidak ada satu pun baris kode ' +
         'yang menghitungnya</b>. Ketiganya teks di dalam <code>PRINT</code>. ' +
         'Ubah satu angka dan tidak ada apa pun yang akan memberi tahu bahwa ' +
         'neracanya sudah tidak seimbang. Sepuluh berkas kemudian BUSNINE ' +
         'menutup buku di 19.840 &mdash; juga seimbang, juga diketik tangan.'],
        ['Menggambar garis satu aksara per LOCATE',
         'Baris 510 memutar 86 kali <code>LOCATE</code>+<code>PRINT</code> ' +
         'untuk menggambar dua garis datar. <code>STRING$(43,196)</code> ' +
         'melakukannya dengan dua baris. Bentuk yang sama diulang di sepuluh ' +
         'berkas keluarga ini.'],
        ['END yang tidak pernah tercapai',
         'Baris 480 <code>END</code> berada tepat sesudah baris 470 ' +
         '<code>RUN"BUSTHREE"</code>. <code>RUN</code> tidak pernah kembali, ' +
         'jadi baris itu mati sejak ditulis.']
      ]
    },

    penjelasan: [
      { judul: 'Sebuah sistem akuntansi yang tidak menghitung apa pun',
        isi: [
          'Baris 350&ndash;430 memperlihatkan bagan akun ABC Hardware Company ' +
          'lengkap dengan saldo pembukanya. Bacalah sebagai akuntan dan ' +
          'semuanya benar: aset 8000 + 0 + 6700 = 14.700, kewajiban 0, modal ' +
          '14.700 + 0. Aset = kewajiban + modal. Seimbang.',
          'Bacalah sebagai pemrogram dan tidak ada apa-apa di sana. Sembilan ' +
          'baris <code>PRINT TAB(13)"..."</code>. Tidak ada larik akun, tidak ' +
          'ada <code>DATA</code>, tidak ada penjumlahan, tidak ada satu pun ' +
          'variabel yang menyimpan angka.',
          'Yang menyeimbangkan neraca itu <b>manusia</b>, sekali, pada 1982, ' +
          'sebelum mengetiknya.',
          'Dan itu berlaku untuk seluruh dua belas berkasnya. BUSNINE menutup ' +
          'buku di 19.840 di kedua sisi &mdash; 12.490 + 1.695 + 5.655 di kiri, ' +
          '3.500 + 16.340 di kanan &mdash; juga tanpa satu pun perhitungan. ' +
          'Selisih 5.140 antara pembukaan dan penutupan adalah laba sebulan ' +
          'ABC Hardware, dan angka itu pun diketik.',
          'Ini bukan kritik terhadap penulisnya: rangkaian ini memang ' +
          '<b>presentasi</b>, bukan perangkat lunak akuntansi. Yang menarik ' +
          'justru itu &mdash; ia demo yang berbentuk program, di zaman ketika ' +
          'satu-satunya cara memperlihatkan apa yang bisa dilakukan komputer ' +
          'adalah menulis program yang berpura-pura melakukannya.',
          'Pilih <b>BUSTEN</b> di daftar program untuk melihat penulisnya ' +
          'mengakuinya sendiri di layar terakhir.'
        ] }
    ]
  };
})(window);
