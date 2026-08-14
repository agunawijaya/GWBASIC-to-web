
  tabel.sort(function (a, b) { return a.baris - b.baris; });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['XWING'] = {
    nama: 'XWING',
    judul: 'Star Pilot / X-Wing Fighter (George Blank 1978, port PC 1982)',
    sumber: 'XWING',
    berkas: 'run/XWING.BAS',
    tabel: tabel,
    benih: 77,

    /* Enam bingkai ledakan, dalam urutan DATA-nya di baris 1800-1900. Tiap
       satu sembilan belas bilangan bulat: lebar dalam bit, tinggi, lalu
       pikselnya dipadatkan — format `GET` apa adanya. */
    data: [].concat(
      [22, 11, 0, 0, 0, 8194, 0, -32608, -22006, 2560, -32598, -22006, 128, 168, 8706, 0, 0, 0, 0],
      [22, 11, -30720, 2048, 136, -30718, -24544, -32608, -22006, -21848, -22358, -22006, -23936, 10274, -30206, 2048, -32632, -30720, 0],
      [22, 11, -30712, 512, 136, 8194, -32760, -24416, -21974, -21976, -22358, -21974, -32608, 2216, -30206, 512, 138, -30712, 128],
      [22, 11, -30712, 2048, 136, 8194, -24536, -32608, -22006, -21976, -22358, -22006, -24448, 10408, 8706, 2048, -32632, -30712, 128],
      [22, 11, -30688, 2048, 2080, 8194, -32736, -32608, -21974, -22008, -22358, -22006, -24448, 10408, 8706, 2048, -32632, -30688, 32],
      [22, 11, -30688, 2048, 2184, -30718, -24544, -32608, -22006, -21848, -22358, -22006, -23936, 10274, -30206, 2048, -32632, -30688, 32]),

    arsitektur: {
      judul: 'Alur XWING.BAS',
      simpul: [
        { id: 'kop', baris: '10-280', jenis: 'mulai',
          teks: ['Kop surat klub TPCUG,', 'ditempel di depan program', 'yang bukan miliknya'] },
        { id: 'gambar', baris: '1330-2030',
          teks: ['Tiga sasaran digambar DRAW,', 'dipungut GET tiga-empat ukuran;', '13 gambar lain DIKETIK'] },
        { id: 'jebak', baris: '1320',
          teks: ['Enam ON KEY: F1, F2,', 'dan empat panah'] },
        { id: 'panel', baris: '2160-2300',
          teks: ['Garis bidik dengan LUBANG', 'di tengahnya'] },
        { id: 'utama', baris: '2320-2460',
          teks: ['Jarak = target - jarak tempuh;', 'S bertambah Q*100 tiap putaran'] },
        { id: 'dekat', baris: '2490-2510',
          teks: ['Tiap ambang jarak menyalin', 'gambar yang lebih besar', 'DAN jangkauan tembak'] },
        { id: 'elak', baris: '2520-2590', jenis: 'putusan',
          teks: ['BYPASS mengatur seberapa', 'sering musuh mengelak'] },
        { id: 'tembak', baris: '5350-5740', jenis: 'putusan',
          teks: ['F1: kena kalau jaraknya', 'lebih kecil dari jangkauan'] },
        { id: 'torpedo', baris: '5750-6090', jenis: 'putusan',
          teks: ['F2: POINT(38,21) membaca', 'LAYAR untuk tahu ada apa', 'di garis bidik'] },
        { id: 'usai', baris: '6100-6920', jenis: 'keluar',
          teks: ['Menang, tertembak,', 'menabrak, atau kehabisan waktu'] }
      ],
      panah: [
        { dari: 'kop', ke: 'gambar' },
        { dari: 'gambar', ke: 'jebak' },
        { dari: 'jebak', ke: 'panel' },
        { dari: 'panel', ke: 'utama' },
        { dari: 'utama', ke: 'dekat' },
        { dari: 'dekat', ke: 'elak' },
        { dari: 'elak', ke: 'utama' },
        { dari: 'jebak', ke: 'tembak', label: 'F1' },
        { dari: 'jebak', ke: 'torpedo', label: 'F2' },
        { dari: 'tembak', ke: 'utama' },
        { dari: 'torpedo', ke: 'usai', label: 'kena' },
        { dari: 'elak', ke: 'usai', label: 'waktu habis' }
      ]
    },

    pseudokode: [
      { baris: 1350, tingkat: 0, teks: 'tiga belas gambar <b>diketik</b> sebagai penugasan larik' },
      { baris: 1360, tingkat: 1, teks: '&hellip;<code>-32768!</code> butuh akhiran <code>!</code> supaya tidak melimpah' },
      { baris: 2860, tingkat: 0, teks: 'ambang jarak menyalin gambar yang lebih besar &mdash; <b>dan jangkauan tembaknya</b>' },
      { baris: 5420, tingkat: 1, teks: '&hellip;jadi sasaran yang lebih dekat lebih mudah kena, tanpa satu perhitungan' },
      { baris: 5840, tingkat: 0, teks: '<code>POINT(38,21)</code> &mdash; torpedo bertanya pada <b>layar</b> ada apa di bidikan' },
      { baris: 1180, tingkat: 0, teks: '<code>KEY(n) STOP</code> berpasangan mengapit tiap bagian yang tak boleh disela' },
      { baris: 5700, tingkat: 0, teks: 'Vader jatuh &rarr; gambarnya <b>diganti pesawat biasa</b>, pesannya ikut' },
      { baris: 5230, tingkat: 0, teks: 'menit dihitung dari <b>berapa kali detik melompat mundur</b>' },
      { baris: 2110, tingkat: 0, teks: 'tingkat 3 tidak menyetel <code>BYPASS</code>; nol berarti mengelak tiap putaran' },
      { baris: 6130, tingkat: 0, teks: '<code>S=SCALE;</code> di dalam DRAW &rarr; X-wing membesar dari 1 ke 24' },
      { baris: 5300, tingkat: 0, teks: 'dua baris yang <b>tidak pernah dijalankan</b> &mdash; sisa rancangan yang batal' }
    ],

    perintahAsli: 'run\\XWING.bat',
    catatanAsli: 'Jawab N untuk melewati petunjuknya, lalu pilih tingkat 0. ' +
      'Angka 1-9 mengatur kecepatan, panah menggeser kapal, F1 meriam, F2 ' +
      'torpedo. Perhatikan sasarannya membesar bertahap &mdash; dan makin ' +
      'besar, makin mudah kena.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b> Yang hilang lebih ' +
      'banyak daripada biasanya: tema Star Wars di baris 1250-1260 dan ' +
      '6360-6370 ditulis sebagai <b>frekuensi mentah</b> (525.25, 783.99, ' +
      '698.46&hellip;) dengan lama nada dalam satuan detak 18,2 per detik, ' +
      'bukan sebagai makro <code>PLAY</code>.',

      '<b><code>TIME$</code> dan <code>RANDOMIZE</code> diganti nilai tetap</b>, ' +
      'jadi penghitung waktu di baris 5200-5270 tidak berjalan dan batas ' +
      'waktunya tidak pernah habis.',

      '<b>Larik gambar disalin utuh, bukan unsur demi unsur.</b> Di berkas ' +
      'aslinya <code>IM(0)=IM2(0):IM(1)=IM2(1):IM(2)=IM2(2):IM(3)=IM2(3)</code> ' +
      'menyalin SELURUH isi <code>IM2</code> &mdash; empat unsur memang seluruh ' +
      'gambarnya. Akibatnya sama.',

      '<b><code>POKE &amp;H410</code> (baris 1070) diabaikan.</b>',

      '<b>Kop surat klub di baris 40-230 memakai aksara blok CP437</b> ' +
      '(&#x2591;, &#x2584;, &#x2588;) yang digambar konsol penelusur apa adanya.'
    ],

    pelajaran: {
      ringkas: 'Perspektif dibangun dari beberapa gambar dan satu bendera — ' +
        'dan jangkauan tembaknya ikut membesar bersama gambarnya.',
      pelajari: [
        ['Jarak yang mengubah tiga hal sekaligus',
         '<code>2860 IF G-S&lt;20000 AND IMPFIGH2=0 THEN IMPFIGH2=1:IMFLAG=1:' +
         'IM(0)=IM2(0):&hellip;:IMX=37:IMY=20:IMR1=2:IMR2=2</code>',
         'Satu ambang jarak, dan yang berubah: <b>gambarnya</b> (disalin dari ' +
         '<code>IM2</code>), <b>titik bidiknya</b> (<code>IMX,IMY</code> ' +
         'bergeser karena gambarnya lebih besar dan titik acuannya di sudut ' +
         'kiri atas), dan <b>jangkauan tembaknya</b> (<code>IMR1,IMR2</code>).',
         'Yang terakhir itu yang paling halus. Baris 5420 menguji kena dengan ' +
         '<code>ABS(IMX-E)&lt;IMR1</code> &mdash; jarak dari titik bidik lebih ' +
         'kecil daripada jangkauan. Karena jangkauannya ikut membesar, sasaran ' +
         'yang lebih dekat otomatis lebih mudah kena.',
         'Tidak ada satu baris pun yang menghitung "sasaran besar lebih mudah ' +
         'kena". Itu akibat dari menaruh ukuran dan jangkauan di baris yang ' +
         'sama.',
         'Dan <code>IMFLAG</code> mengingat gambar MANA yang sedang dipakai, ' +
         'supaya baris 2990-3000 bisa menghapus jejak lamanya dengan gambar ' +
         'yang benar. Mengganti gambar di tengah animasi XOR menuntut ingatan ' +
         'tentang apa yang tadi digambar.'],
        ['Satu DRAW, tiga ukuran, tiga GET',
         '<code>1330 &hellip;DRAW "C2;BM145,59;M+0,0;BM+10,1;&hellip;"</code>',
         '<code>1340 &hellip;GET (145,59)-(145,59),IM1:GET (155,58)-(157,60),IM2:' +
         'GET (167,57)-(173,61),IM3</code>',
         'Satu perintah DRAW menggambar ketiga ukuran pesawat berjajar ke ' +
         'kanan di layar, lalu tiga <code>GET</code> memungut masing-masing ' +
         'dari petak yang berbeda.',
         'Yang paling kecil <code>GET (145,59)-(145,59)</code> &mdash; satu ' +
         'piksel. Itu pesawat yang masih terlalu jauh untuk berbentuk apa pun, ' +
         'dan ia tetap sebuah sprite penuh, dengan kepala dan semuanya.',
         'Dan gambar aslinya tidak dihapus: ia tetap terlihat di layar ' +
         'petunjuk sebagai contoh, di sebelah tulisan "IMPERIAL FIGHTER:". ' +
         'Bahan dan pajangan sekaligus.'],
        ['Jebakan yang ditunda berpasangan',
         'Baris 1180 menyalakan keenam jebakan tombol; baris 1190 menundanya. ' +
         'Keduanya dipanggil BERPASANGAN, mengapit tiap bagian yang tidak boleh ' +
         'disela &mdash; menggambar sasaran, menghapus jejaknya, memperbarui ' +
         'panel.',
         'Yang dipakai <code>KEY(n) STOP</code>, bukan <code>OFF</code>. ' +
         'Bedanya menentukan: tombol yang ditekan selama penundaan tetap ' +
         '<b>diingat</b>, dan dijemput begitu jebakannya menyala lagi. Pemain ' +
         'tidak pernah kehilangan tembakan.',
         'Tiga keadaan &mdash; nyala, tunda, mati &mdash; dan program ini ' +
         'memakai ketiganya: <code>OFF</code> baru dipakai saat permainannya ' +
         'benar-benar berakhir.'],
        ['Musuh yang diganti sesudah mati',
         'Kalau Darth Vader ditembak jatuh, baris 5700 menyalin gambar pesawat ' +
         'kekaisaran ke dalam slot gambar Vader, dan baris 5670 mengganti ' +
         'tulisan di panel jadi "KM TO IMPERIAL FIGHTER".',
         'Sesudah itu <code>DVGONE</code> menyala, dan setiap pesan, setiap ' +
         'gambar tembakan, dan setiap kalimat kekalahan memeriksanya untuk ' +
         'memilih kata yang benar.',
         'Satu bendera, dan seluruh peran yang tadi dipegang Vader diambil alih ' +
         'pesawat biasa &mdash; termasuk jaraknya, yang di-<i>reset</i> ke ' +
         '25.000 km seperti musuh baru.']
      ],
      hindari: [
        ['Tiga belas gambar yang diketik dengan tangan',
         'Baris 1350-2030 berisi ratusan penugasan seperti ' +
         '<code>IM6(12)=-32760</code>. Tidak ada satu pun komentar yang ' +
         'mengatakan gambar apa itu, berapa ukurannya, atau dari mana angkanya ' +
         'datang.',
         'Angka-angka itu keluaran <code>GET</code> dari sesi lain yang tidak ' +
         'ada lagi &mdash; seseorang menggambar ledakannya, memungutnya, ' +
         'mencetak isinya, lalu mengetikkannya kembali ke dalam program.',
         'Satu salah ketik di antara ratusan bilangan itu tidak akan pernah ' +
         'ketahuan sampai gambarnya muncul di layar, dan bahkan kemudian yang ' +
         'terlihat cuma satu piksel yang salah warna.',
         'LANDER.BAS memilih jalan lain untuk persoalan yang sama, dan yang ' +
         'membedakan keduanya bukan kepintaran melainkan berapa banyak berkas ' +
         'yang mau dibawa di disket.'],
        ['Dua baris yang tidak pernah dijalankan',
         '<code>5280 GOTO 2320</code>',
         '<code>5290 REM * DISPLAY SKY FIGHTER *</code>',
         '<code>5300 IF J-S&lt;10000 THEN A=3</code>',
         'Baris 5280 selalu melompat, dan tidak ada satu pun lompatan ke 5290 ' +
         'atau 5300 di seluruh 732 baris. Judulnya menyebut musuh ketiga ' +
         '&mdash; "SKY FIGHTER" &mdash; yang tidak pernah dibangun, dan ' +
         'satu-satunya sisanya penugasan <code>A=3</code> ke variabel yang ' +
         'tidak dibaca siapa pun.',
         'Dan nama itu muncul sekali lagi, di baris 3670: "YOU HAVE JUST BEEN ' +
         'SHOT DOWN BY AN IMPERIAL SKY FIGHTER!" &mdash; kalimat kekalahan ' +
         'untuk musuh yang tidak ada, dipakai untuk musuh yang ada.'],
        ['Tingkat kesulitan yang lupa satu nilai',
         '<code>2110 IF SKILL=0 THEN A1=5:A2=0:BYPASS=3</code>',
         '<code>2140 IF SKILL=3 THEN A1=2:A2=30</code>',
         'Tiga tingkat pertama menyetel <code>BYPASS</code>; yang keempat ' +
         'tidak. Nilainya tetap nol dari <code>CLEAR</code> di baris 1300.',
         'Dan nol punya arti: baris 2520 menguji ' +
         '<code>IF FLAG1&lt;&gt;BYPASS</code>, jadi dengan BYPASS=0 syaratnya ' +
         'langsung salah dan musuhnya mengelak SETIAP putaran.',
         'Kebetulan itu benar &mdash; tingkat 3 memang yang tersulit. Tapi ' +
         'yang membuatnya tersulit bukan angka yang dipilih melainkan angka ' +
         'yang <b>tidak ditulis</b>, dan tidak ada apa pun di baris 2140 yang ' +
         'mengatakannya.'],
        ['Sembilan belas pesan yang ditulis lima kali',
         'Pola ini muncul sembilan kali di berkas ini, tiap kali tujuh baris:',
         '<code>FOR K=1 TO 2 : LOCATE 24,1:PRINT "pesan"; : PLAY "L2 N0" : ' +
         'LOCATE 24,1:PRINT "spasi"; : PLAY "L16 N0" : NEXT K</code>',
         'lalu pesannya dicetak sekali lagi, dijeda dua kali, dan dihapus.',
         'Enam puluh tiga baris untuk sesuatu yang bisa jadi satu subrutin ' +
         'dengan satu argumen string. Dan karena disalin, pesannya sendiri ' +
         'harus ditulis DUA KALI di tiap salinan &mdash; sekali sebagai teks, ' +
         'sekali sebagai spasi sepanjang teks itu.',
         'Baris 3090 menghapus 34 spasi untuk pesan 33 aksara. Satu kelebihan, ' +
         'tidak berakibat apa-apa, dan tidak mungkin ketahuan tanpa menghitung.']
      ]
    },

    penjelasan: [
      { judul: 'Torpedo yang bertanya pada layar',
        isi: [
          'Meriam laser di baris 5420-5430 menguji kena dengan aritmetika: ' +
          'jarak antara titik bidik dan letak sasaran, dibandingkan dengan ' +
          'jangkauan tembak.',
          'Torpedo tidak. Baris 5840:',
          '<code>5840 IF POINT(38,21)&lt;&gt;3 THEN 5880</code>',
          'Titik (38,21) adalah pusat garis bidik. <code>POINT</code> membaca ' +
          'WARNA piksel di layar. Dan warna 3 adalah warna Bintang Kematian.',
          'Jadi pertanyaannya bukan "di mana Bintang Kematian?" melainkan ' +
          '<i>"apakah ada bagian Bintang Kematian tepat di tengah bidikan ' +
          'saya?"</i> &mdash; dan yang menjawabnya layar itu sendiri.',
          'Bedanya bukan gaya. Bintang Kematian bukan titik: pada jarak ' +
          'terdekat ia gambar 7&times;7 piksel dengan lekuk dan lubang. ' +
          'Menguji "apakah bidikan mengenai bagian yang padat" dengan ' +
          'aritmetika menuntut menyimpan bentuknya. Menanyakannya pada layar ' +
          'tidak menuntut apa pun &mdash; bentuknya sudah ada di sana, ' +
          'digambar oleh <code>PUT</code> beberapa baris sebelumnya.',
          'Dan petunjuknya di baris 7650 menjelaskannya dengan kata-kata yang ' +
          'sama: <i>"some part of the space station in the center of the cross ' +
          'hairs"</i>. Bagian. Bukan pesawatnya, bagiannya.',
          'Ini pemakaian kesembilan "layar sebagai struktur data" di koleksi ' +
          'ini, dan yang paling ketat: yang dibaca bukan aksara melainkan satu ' +
          'piksel, dan yang bergantung padanya bukan tampilan melainkan syarat ' +
          'menang.',
          'Sesudah lolos uji itu pun masih ada dua lapis lagi &mdash; baris ' +
          '5850 memberi tingkat 0 kemenangan cuma-cuma, dan baris 5860-5870 ' +
          'melempar dadu untuk tingkat lainnya. Bidikan yang tepat bukan ' +
          'jaminan; ia cuma tiket untuk ikut undian.'
        ] },
      { judul: 'Kop surat di depan program orang lain',
        isi: [
          'Berkas ini dimulai dengan dua ratus delapan puluh baris yang tidak ' +
          'ada hubungannya dengan permainannya:',
          '<code>40 PRINT"&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&#x2591;&hellip;"</code>',
          '<code>110 PRINT"&#x2591;&#x2502; BROUGHT TO YOU BY THE MEMBERS OF  &#x2502;&#x2591;"</code>',
          '<code>180 PRINT"&#x2591;&#x2502;      International PC Owners      &#x2502;&#x2591;"</code>',
          '<code>200 PRINT"&#x2591;&#x2502;P.O. Box 10426, Pittsburgh PA 15234&#x2502;&#x2591;"</code>',
          'Sebuah kotak berbingkai aksara blok CP437, dengan huruf TPCUG ' +
          'digambar dari aksara &#x2584; dan &#x2588; setinggi lima baris, dan ' +
          'sebuah kotak pos di Pittsburgh.',
          'Lalu baris 260 menunggu tombol, baris 280 membersihkan layar, dan ' +
          'baris 1000 memulai program yang sebenarnya &mdash; yang kepalanya ' +
          'menyebut tiga nama lain dan dua kota lain:',
          '<code>1010  REM * WRITTEN BY GEORGE BLANK, LEECHBURG, PA. *</code>',
          '<code>1040  REM * MODIFIED TO RUN ON THE IBM PC BY ERNEST *</code>',
          '<code>1050  REM * SMITH AND RAYMOND ROGERS, HOUSTON, TEXAS *</code>',
          'Tiga lapis kepemilikan, ditumpuk menurut urutan waktunya, dan tidak ' +
          'satu pun menghapus yang di bawahnya. Klub yang menyebarkannya ' +
          'menempelkan kopnya <b>di depan</b>, bukan menggantikan.',
          'Nomor barisnya sendiri yang menceritakannya: 10-280 untuk kop ' +
          'suratnya, lalu lompat ke 1000. Seribu adalah nomor yang dipilih ' +
          'orang yang tahu ia sedang menyisipkan sesuatu di depan program yang ' +
          'sudah jadi, dan tidak mau menyentuh penomorannya.',
          'Dan di antara ketiganya ada satu kalimat lagi, baris 1020, yang ' +
          'mengurus perizinan seluruh permainan ini dalam sembilan kata:',
          '<code>1020  REM * FOR  PUBLIC DOMAIN UNLESS MOVIEMAKERS OBJECT *</code>',
          'September 1978. Film itu baru setahun.'
        ] }
    ]
  };
})(window);
