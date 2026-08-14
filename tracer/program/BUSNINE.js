/* ===========================================================================
   BUSNINE.js — porting minimalis BUSNINE.BAS sebagai tabel baris.

   Langkah kesebelas dari dua belas: NERACA SALDO SETELAH PENUTUPAN. Buku
   ditutup, dan yang tersisa harus seimbang.

       Cash                 $12,490.00
       Accounts receivable   $1,695.00
       Supplies              $5,655.00
                            -----------
                            $19,840.00     $19,840.00
                                            ^ Accounts payable   $3,500.00
                                            ^ Homer Jones, cap.  $16,340.00

   12.490 + 1.695 + 5.655 = 19.840. 3.500 + 16.340 = 19.840. Seimbang.

   Dan sekali lagi: TIDAK ADA SATU BARIS PUN YANG MENGHITUNGNYA. Seluruh
   angkanya teks di dalam `PRINT`, termasuk baris totalnya. Bandingkan dengan
   BUSTWO.BAS, tempat neraca pembukanya (14.700) ditetapkan dengan cara yang
   sama persis. Selisih 5.140 adalah laba sebulan ABC Hardware — juga diketik.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `POKE 106,0` (baris 40) dijadikan pembuang penyangga tombol, karena
     dipasangkan dengan gelung pembuang `IF INKEY$<>""` di baris 50.
   - Berakhir dengan `RUN"BUSTEN"`.
   =========================================================================== */

(function (global) {
  'use strict';

  var DATAR = 196, TEGAK = 179,
      KIRI_ATAS = 218, KANAN_ATAS = 191, KANAN_BAWAH = 217, KIRI_BAWAH = 192,
      G_KIRI_ATAS = 201, G_DATAR = 205, G_KANAN_ATAS = 187, G_TEGAK = 186,
      G_KANAN_BAWAH = 188, G_KIRI_BAWAH = 200,
      SAMBUNG_KIRI = 199, SAMBUNG_KANAN = 182,
      CABANG_BAWAH = 194, CABANG_ATAS = 207, CABANG_KANAN = 195, SILANG = 197;

  var tabel = [

    { baris: 10, jalan: function (m) {
        m.jebakan(10, true); m.pasangJebakan(10, 530);
      } },
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.jebakan(m.v.A, true); m.pasangJebakan(m.v.A, 70);
        }
      } },
    { baris: 30, jalan: function (m) { m.lompat(80); } },

    /* 40-70 tunggu satu tombol. Baris 70 RETURN sekaligus badan jebakan
       F1-F9 — menjebak lalu langsung kembali adalah cara mematikannya. */
    { baris: 40, jalan: function (m) { m.kosongkanPenyangga(); } },
    { baris: 50, jalan: function (m) { if (m.inkey() !== '') m.lompat(40); } },
    { baris: 60, jalan: function (m) {
        m.v['RESP$'] = m.inkey();
        if (m.v['RESP$'] === '') m.lompat(60);
      } },
    { baris: 70, jalan: function (m) { m.kembali(); } },

    /* 80-90 seluruh naskah programnya: dua layar, empat pemanggilan. */
    { baris: 80, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(110); },
        function (m) { m.gosub(250); },
        function (m) { m.gosub(40); }
      ] },
    { baris: 90, bagian: [
        function (m) { m.cls(); },
        function (m) { m.gosub(110); },
        function (m) { m.gosub(200); },
        function (m) { m.gosub(330); },
        function (m) { m.gosub(40); }
      ] },
    { baris: 100, jalan: function (m) { m.jalankan('BUSTEN'); } },

    /* --- 110-190: kepala halaman ------------------------------------------ */
    { baris: 110, jalan: function (m) {
        m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
        m.warna(11, 0);
      } },
    { baris: 120, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.J = 20; m.v.J <= 62; m.v.J++) {
            m.locate(m.v.I, m.v.J, 0); m.cetak(m.chr(DATAR)); m.barisBaru();
          }
        }
      } },
    { baris: 130, jalan: function (m) {
        sudut(m, 1, 19, KIRI_ATAS); sudut(m, 1, 63, KANAN_ATAS);
        sudut(m, 3, 63, KANAN_BAWAH); sudut(m, 3, 19, KIRI_BAWAH);
      } },
    { baris: 140, jalan: function (m) {
        m.locate(2, 19, 0); m.cetak(m.chr(TEGAK)); m.spc(43);
        m.cetak(m.chr(TEGAK)); m.barisBaru();
      } },
    { baris: 150, jalan: function (m) { m.warna(0, 7); } },
    { baris: 160, jalan: function (m) {
        m.locate(2, 22, 0);
        m.cetak(' B U S I N E S S   S I M U L A T I O N '); m.barisBaru();
      } },
    { baris: 170, jalan: function (m) {
        m.warna(11, 0); m.locate(4, 24, 0);
        m.cetak('STEP XI. POST-CLOSING TRIAL BALANCE'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 180, jalan: function (m) {
        m.warna(11, 0); m.locate(5, 24, 0);
        m.cetak('-----------------------------------'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 190, jalan: function (m) { m.kembali(); } },

    /* --- 200-240: bingkai besar mengelilingi isi -------------------------- */
    /* Digambar searah jarum jam mulai dari sudut kiri atas, satu aksara per
       putaran gelung — 136 pencetakan untuk sebuah persegi panjang. */
    { baris: 200, jalan: function (m) {
        m.locate(6, 6); m.cetak(m.chr(G_KIRI_ATAS));
        for (m.v.I = 7; m.v.I <= 74; m.v.I++) m.cetak(m.chr(G_DATAR));
      } },
    { baris: 210, jalan: function (m) {
        m.locate(6, 75); m.cetak(m.chr(G_KANAN_ATAS)); m.barisBaru();
        for (m.v.I = 7; m.v.I <= 23; m.v.I++) {
          m.locate(m.v.I, 75); m.cetak(m.chr(G_TEGAK));
        }
      } },
    { baris: 220, jalan: function (m) {
        m.locate(24, 75); m.cetak(m.chr(G_KANAN_BAWAH));
        for (m.v.I = 74; m.v.I >= 7; m.v.I--) {
          m.locate(24, m.v.I); m.cetak(m.chr(G_DATAR));
        }
      } },
    { baris: 230, jalan: function (m) {
        m.locate(24, 6); m.cetak(m.chr(G_KIRI_BAWAH)); m.barisBaru();
        for (m.v.I = 23; m.v.I >= 7; m.v.I--) {
          m.locate(m.v.I, 6); m.cetak(m.chr(G_TEGAK)); m.barisBaru();
        }
      } },
    { baris: 240, jalan: function (m) { m.kembali(); } },

    /* --- 250-320: naskah penjelasan --------------------------------------- */
    { baris: 250, jalan: function (m) {
        m.locate(7, 15);
        m.cetak('      The final procedure of the accounting cycle is');
        m.barisBaru();
      } },
    naskah(260, 15, 'the Post-closing trial balance.  The purpose of this'),
    naskah(270, 15, 'step is to assure that the ledgers are in balance at'),
    naskah(280, 15, 'the beginning of the new accounting cycle. The items'),
    naskah(290, 15, 'on the post-closing trial balance  should correspond'),
    naskah(300, 15, 'exactly with those reported on the balance sheet.'),
    { baris: 310, jalan: function (m) {
        m.warna(11, 0); m.locate(25, 12);
        m.cetak('***** Strike Any Key For Post-closing Trial Balance *****');
        m.warna(7, 0);
      } },
    { baris: 320, jalan: function (m) { m.kembali(); } },

    /* --- 330-520: neraca saldo setelah penutupan -------------------------- */
    { baris: 330, jalan: function (m) {
        m.warna(11, 0); m.locate(7, 31);
        m.cetak('ABC Hardware Company'); m.barisBaru();
      } },
    { baris: 340, jalan: function (m) {
        m.locate(8, 28); m.cetak('Post-closing Trial Balance'); m.barisBaru();
      } },
    { baris: 350, jalan: function (m) {
        m.locate(9, 34); m.cetak('June 30 , 1982'); m.barisBaru();
        m.warna(7, 0);
      } },
    { baris: 360, jalan: function (m) {
        m.locate(10, 6); m.cetak(m.chr(SAMBUNG_KIRI));
        for (m.v.I = 7; m.v.I <= 74; m.v.I++) m.cetak(m.chr(DATAR));
        m.cetak(m.chr(SAMBUNG_KANAN)); m.barisBaru();
      } },

    /* 370-420 ANGKANYA TEKS HARFIAH, termasuk baris totalnya. Titik-titik
       pemandunya pun diketik satu per satu. */
    baris(370, 11, 8, 'Cash. . . . . . . . . . . . . . . . .     $12,490.00'),
    baris(380, 13, 8, 'Accounts receivable . . . . . . . . .      $1,695.00'),
    baris(390, 15, 8, 'Supplies. . . . . . . . . . . . . . .      $5,655.00'),
    baris(400, 17, 8, 'Accounts payable  . . . . . . . . . .                    $3,500.00'),
    baris(410, 19, 8, 'Homer Jones, capital  . . . . . . . .                   $16,340.00'),
    baris(420, 23, 8, '                                          $19,840.00    $19,840.00'),

    /* 430-500 garis pemisah kolom rupiahnya, digambar sesudah angkanya. */
    { baris: 430, jalan: function (m) {
        sudut(m, 10, 47, CABANG_BAWAH); sudut(m, 10, 61, CABANG_BAWAH);
      } },
    { baris: 440, jalan: function (m) {
        for (m.v.I = 11; m.v.I <= 23; m.v.I++) {
          m.locate(m.v.I, 47); m.cetak(m.chr(TEGAK)); m.barisBaru();
          m.locate(m.v.I, 61); m.cetak(m.chr(TEGAK)); m.barisBaru();
        }
      } },
    { baris: 450, jalan: function (m) {
        m.locate(24, 47); m.cetak(m.chr(CABANG_ATAS));
        m.locate(24, 61); m.cetak(m.chr(CABANG_ATAS));
      } },
    { baris: 460, jalan: function (m) { sudut(m, 21, 47, CABANG_KANAN); } },
    { baris: 470, jalan: function (m) {
        for (m.v.I = 48; m.v.I <= 60; m.v.I++) {
          m.locate(21, m.v.I); m.cetak(m.chr(DATAR)); m.barisBaru();
        }
      } },
    { baris: 480, jalan: function (m) { sudut(m, 21, 61, SILANG); } },
    { baris: 490, jalan: function (m) {
        for (m.v.I = 62; m.v.I <= 74; m.v.I++) {
          m.locate(21, m.v.I); m.cetak(m.chr(DATAR)); m.barisBaru();
        }
      } },
    { baris: 500, jalan: function (m) { sudut(m, 21, 75, SAMBUNG_KANAN); } },
    { baris: 510, jalan: function (m) {
        m.warna(11, 0); m.locate(25, 17);
        m.cetak('***** Strike Any Key For Simulation Recap *****');
        m.warna(7, 0);
      } },
    { baris: 520, jalan: function (m) { m.kembali(); } },
    { baris: 530, jalan: function (m) { m.jalankan('MENU'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  function naskah(nomor, kolom, isi) {
    return { baris: nomor, jalan: function (m) {
      m.tab(kolom); m.cetak(isi); m.barisBaru();
    } };
  }
  function baris(nomor, b, k, isi) {
    return { baris: nomor, jalan: function (m) {
      m.locate(b, k); m.cetak(isi); m.barisBaru();
    } };
  }
  function sudut(m, b, k, kode) {
    m.locate(b, k); m.cetak(m.chr(kode)); m.barisBaru();
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['BUSNINE'] = {
    nama: 'BUSNINE',
    judul: 'Business Simulation XI — neraca saldo penutup',
    sumber: 'BUSNINE',
    berkas: 'run/BUSNINE.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur BUSNINE.BAS',
      simpul: [
        { id: 'jebak', baris: '10-30', jenis: 'mulai',
          teks: ['F10 ke menu;', 'F1-F9 dijebak jadi tak berbunyi'] },
        { id: 'layar1', baris: '80',
          teks: ['Kepala + naskah,', 'lalu tunggu tombol'] },
        { id: 'layar2', baris: '90',
          teks: ['Kepala + bingkai + neraca,', 'lalu tunggu tombol'] },
        { id: 'kepala', baris: '110-190', jenis: 'subrutin',
          teks: ['Kotak judul dan', 'nomor langkahnya'] },
        { id: 'bingkai', baris: '200-240', jenis: 'subrutin',
          teks: ['Persegi panjang besar,', 'satu aksara per putaran'] },
        { id: 'neraca', baris: '330-520', jenis: 'subrutin',
          teks: ['Angka-angkanya:', 'seluruhnya teks harfiah'] },
        { id: 'lanjut', baris: '100', jenis: 'keluar',
          teks: ['RUN "BUSTEN"'] }
      ],
      panah: [
        { dari: 'jebak', ke: 'layar1' },
        { dari: 'layar1', ke: 'kepala' },
        { dari: 'layar1', ke: 'layar2' },
        { dari: 'layar2', ke: 'kepala' },
        { dari: 'layar2', ke: 'bingkai' },
        { dari: 'layar2', ke: 'neraca' },
        { dari: 'layar2', ke: 'lanjut' }
      ]
    },

    pseudokode: [
      { baris: 20, tingkat: 0, teks: 'jebak F1&ndash;F9 ke sebuah <code>RETURN</code> &mdash; <b>cara mematikan tombol</b>' },
      { baris: 80, tingkat: 0, teks: 'layar 1: kepala, naskah penjelasan, tunggu tombol' },
      { baris: 90, tingkat: 0, teks: 'layar 2: kepala, bingkai besar, <b>neraca saldo</b>, tunggu tombol' },
      { baris: 370, tingkat: 1, teks: 'Cash 12.490 + piutang 1.695 + persediaan 5.655 = <b>19.840</b>' },
      { baris: 400, tingkat: 1, teks: 'utang 3.500 + modal 16.340 = <b>19.840</b> &mdash; seimbang' },
      { baris: 420, tingkat: 1, teks: '&hellip;dan baris totalnya <b>juga teks yang diketik</b>' },
      { baris: 430, tingkat: 0, teks: 'garis kolom digambar <b>sesudah</b> angkanya, satu aksara per <code>LOCATE</code>' },
      { baris: 100, tingkat: 0, teks: '<code>RUN "BUSTEN"</code>' }
    ],

    perintahAsli: 'run\\BUSNINE.bat',
    catatanAsli: 'Langkah kesebelas dari rangkaian BUSONE sampai BUSTEN.',

    penyimpangan: [
      '<b><code>POKE 106,0</code> dijadikan pembuang penyangga tombol</b> ' +
      '(baris 40), karena dipasangkan dengan gelung pembuang ' +
      '<code>IF INKEY$&lt;&gt;""</code> di baris 50 &mdash; bentuk pemakaian ' +
      'yang sama dengan BUSONE.BAS dan CHECK.BAS.',

      '<b>Berakhir dengan <code>RUN"BUSTEN"</code>.</b>'
    ],

    pelajaran: {
      ringkas: 'Neraca penutup yang seimbang sempurna &mdash; dan seluruh ' +
        'angkanya, termasuk barisan totalnya, adalah teks yang diketik tangan.',
      pelajari: [
        ['Menggambar tabel dengan aksara kotak',
         'Baris 430&ndash;500 menyambung garis kolom memakai ' +
         '<code>CHR$</code> yang tepat di tiap persimpangan: ' +
         '<code>194</code> untuk cabang ke bawah, <code>207</code> ke atas, ' +
         '<code>197</code> untuk silang, <code>195</code> untuk cabang kanan. ' +
         'Di layar teks 1982, itu satu-satunya cara membuat sesuatu yang ' +
         'terlihat seperti laporan.'],
        ['Garis digambar sesudah isinya',
         'Angkanya dicetak lebih dulu (370&ndash;420), garis kolomnya ' +
         'menyusul (430&ndash;500). Urutan itu berarti garisnya bisa ' +
         '<b>menimpa</b> apa pun yang meleset &mdash; sebuah cara sederhana ' +
         'memastikan tabelnya selalu terlihat rapi walau isinya tidak.']
      ],
      hindari: [
        ['Total yang diketik, bukan dijumlahkan',
         'Baris 420 mencetak <code>$19,840.00</code> dua kali. Angka itu ' +
         'memang benar &mdash; 12.490 + 1.695 + 5.655 di satu sisi, 3.500 + ' +
         '16.340 di sisi lain &mdash; tapi <b>tidak ada satu pun baris kode ' +
         'yang menjumlahkannya</b>. Kalau salah satu angka di atasnya diubah, ' +
         'totalnya tetap 19.840 dan tidak ada apa pun yang memberi tahu.'],
        ['Persegi panjang dalam 136 pencetakan',
         'Baris 200&ndash;230 menggambar satu bingkai dengan empat gelung ' +
         'yang masing-masing mencetak satu aksara per putaran. ' +
         '<code>STRING$</code> ada di GW-BASIC sejak awal, dan dipakai di ' +
         'INTRO.BAS di koleksi yang sama.'],
        ['Nomor baris sebagai satu-satunya penanda urutan',
         'Baris 80 dan 90 adalah <b>seluruh naskah programnya</b>: dua baris ' +
         'yang masing-masing menyebut tiga sampai empat nomor subrutin. Untuk ' +
         'menyisipkan satu layar baru, seluruh urutannya harus dibaca ulang ' +
         'dari dua baris itu.']
      ]
    },

    penjelasan: [
      { judul: 'Neraca yang tidak pernah dihitung',
        isi: [
          'Bacalah baris 370&ndash;420 sebagai akuntan dan semuanya benar. ' +
          'Kas 12.490, piutang 1.695, persediaan 5.655 &mdash; jumlahnya ' +
          '19.840. Utang 3.500 dan modal 16.340 &mdash; jumlahnya juga 19.840. ' +
          'Buku tutup dengan seimbang, persis seperti yang dijanjikan naskah ' +
          'di baris 250&ndash;300.',
          'Bacalah sebagai pemrogram dan tidak ada apa-apa di sana. Enam baris ' +
          '<code>LOCATE</code>+<code>PRINT</code> berisi string. Termasuk ' +
          'baris 420, yang mencetak kedua totalnya sebagai teks.',
          'Bandingkan dengan BUSTWO.BAS, langkah kedua, tempat neraca ' +
          'pembukanya ditetapkan dengan cara yang sama persis: 8000 + 6700 = ' +
          '14.700. Selisih antara keduanya &mdash; 5.140 &mdash; adalah laba ' +
          'sebulan ABC Hardware. Angka itu pun diketik, bukan dihitung.',
          'Yang menarik bukan bahwa penulisnya "curang". Rangkaian ini memang ' +
          '<b>presentasi</b>, dan BUSTEN mengakuinya di layar terakhir: ' +
          '"kami ingin memperlihatkan apa yang mampu kami kerjakan supaya Anda ' +
          'memakai perangkat lunak kami di kemudian hari".',
          'Yang menarik adalah bahwa <b>satu-satunya cara memperlihatkan apa ' +
          'yang bisa dilakukan komputer, pada 1982, adalah menulis program ' +
          'yang berpura-pura melakukannya</b> &mdash; dan menjumlahkan ' +
          'angkanya sendiri lebih dulu supaya pura-puranya meyakinkan.'
        ] }
    ]
  };
})(window);
