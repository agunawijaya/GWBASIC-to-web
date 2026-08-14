
    ],

    arsitektur: {
      judul: 'Alur TEMPLE.BAS',
      simpul: [
        { id: 'buka', baris: '10-690', jenis: 'mulai',
          teks: ['Layar grafik pembuka,', 'judul, dan kata sandi', 'rahasia ARIOCH'] },
        { id: 'isi', baris: '1420-1760',
          teks: ['512 ruang diisi: tangga,', 'monster, harta, kutukan —', 'semuanya lewat GOSUB 10450'] },
        { id: 'tokoh', baris: '2080-2920', jenis: 'putusan',
          teks: ['Bangsa jadi PENGALI sifat;', 'zirah dan senjata dari', 'perbandingan, bukan IF'] },
        { id: 'perintah', baris: '3795-3930', jenis: 'putusan',
          teks: ['Satu huruf (DR dua);', 'kebutaan jadi INDEKS', 'lewat ON BL+1 GOTO'] },
        { id: 'gerak', baris: '4310-4400',
          teks: ['Arah dari perbandingan;', 'FNB membungkus koordinat'] },
        { id: 'ruang', baris: '6370-6800',
          teks: ['Isi ruang menentukan', 'apa yang terjadi;', 'Jimat menyamar jadi warp'] },
        { id: 'lawan', baris: '8070-9520',
          teks: ['Kegesitan lawan dua dadu;', 'zirah menyerap kelebihan'] },
        { id: 'sihir', baris: '5250-6070',
          teks: ['Kolam, buku, bola kristal —', 'dan bola kristalnya BERBOHONG'] },
        { id: 'usai', baris: '9590-12200', jenis: 'keluar',
          teks: ['Mati, kehabisan giliran,', 'atau membawa Jimat pulang'] }
      ],
      panah: [
        { dari: 'buka', ke: 'isi' },
        { dari: 'isi', ke: 'tokoh' },
        { dari: 'tokoh', ke: 'perintah' },
        { dari: 'perintah', ke: 'gerak' },
        { dari: 'gerak', ke: 'ruang' },
        { dari: 'ruang', ke: 'lawan', label: 'ada monster' },
        { dari: 'ruang', ke: 'sihir', label: 'kolam / buku / bola' },
        { dari: 'lawan', ke: 'perintah' },
        { dari: 'sihir', ke: 'perintah' },
        { dari: 'lawan', ke: 'usai', label: 'sifat habis' },
        { dari: 'ruang', ke: 'usai', label: 'Jimat dibawa keluar' }
      ]
    },

    pseudokode: [
      { baris: 3090, tingkat: 0, teks: 'tiga perbandingan <b>dikalikan</b> &rarr; "pemain ada di ruang kutukan ini?"' },
      { baris: 4310, tingkat: 0, teks: 'arah gerak dari perbandingan: <code>X+(O$="N")-(O$="S")</code>' },
      { baris: 2520, tingkat: 0, teks: 'harga zirah dari tiga perkalian, tanpa satu pun <code>IF</code>' },
      { baris: 5280, tingkat: 0, teks: 'perbandingan jadi <b>INDEKS</b>: <code>ON (1-(ST&lt;1)) GOTO hidup,mati</code>' },
      { baris: 840, tingkat: 0, teks: '<code>FND</code> memetakan tiga koordinat ke satu larik 512 ruang' },
      { baris: 820, tingkat: 1, teks: '&hellip;<code>FNB</code> membungkusnya: kastilnya berbentuk <b>donat</b>' },
      { baris: 850, tingkat: 1, teks: '&hellip;<code>FNE</code> mencopot penanda <b>+100 = belum dilihat</b>' },
      { baris: 6040, tingkat: 0, teks: 'bola kristal <b>berbohong lima kali dari delapan</b>' },
      { baris: 6770, tingkat: 0, teks: 'Jimat Chaos <b>menyamar jadi warp</b> &mdash; sama seperti WIZARD.BAS' },
      { baris: 2100, tingkat: 0, teks: 'nomor bangsa langsung jadi <b>pengali</b> kekuatan dan kegesitan' },
      { baris: 4570, tingkat: 0, teks: 'dua penugasan berurutan; yang pertama <b>langsung dibuang</b>' },
      { baris: 10020, tingkat: 0, teks: 'tangga pangkat punya <b>lubang</b> antara 20.000 dan 35.000' },
      { baris: 12100, tingkat: 0, teks: 'skor penulisnya sendiri, 142.498, dan permintaan menyunting berkas lain' }
    ],

    perintahAsli: 'run\\TEMPLE.bat',
    catatanAsli: 'Jawab N pada pertanyaan grafik dan petunjuk untuk langsung ' +
      'masuk. Pilih bangsa dengan huruf pertamanya (H, E, M, D), lalu M atau ' +
      'F. Perintahnya satu huruf: N S E W U D untuk gerak, M peta, G bola ' +
      'kristal, F suar, # skor. Coba ketik ARIOCH di pertanyaan pertama.',

    penyimpangan: [
      '<b><code>PLAY</code> dan <code>SOUND</code> diam.</b> Termasuk dua lagu ' +
      'pembuka yang dipilih acak di baris 560-640, dan seluruh efek pertarungan.',

      '<b><code>RANDOMIZE VAL(MID$(TIME$,7,2))</code> diganti benih tetap</b>, ' +
      'supaya kastil yang sama bisa ditelusuri dua kali.',

      '<b><code>LPRINT</code> (baris 11100-11330) dicetak ke layar.</b> Baris ' +
      '500 di layar pembuka menyarankan pencetak; ringkasan lambang ruangnya ' +
      'hanya ada di sana.',

      '<b><code>CHAIN"TEM-INS.BAS",10</code> (baris 11570) tidak bisa ' +
      'dijalankan</b> &mdash; tapi berkasnya ada di koleksi ini dan sudah ' +
      'diport tersendiri: lihat [TEM-INS](tem-ins.md).',

      '<b>Layar grafik pembuka (baris 70-340) memakai koordinat di luar ' +
      'layar</b> (<code>LINE (360,125)-(0,360)</code> pada layar 320&times;200). ' +
      'GW-BASIC memotongnya; permukaan grafik penelusur melakukan hal yang sama.'
    ],

    pelajaran: {
      ringkas: 'Seluruh geometri kastilnya ada di lima fungsi satu baris, dan ' +
        'seluruh logikanya di perbandingan yang dipakai sebagai angka.',
      pelajari: [
        ['Lima baris yang memuat seluruh bentuk kastilnya',
         '<code>840 DEF FND(Q)=64*(Q-1)+8*(X-1)+Y</code>',
         'Delapan lantai, delapan baris, delapan kolom &mdash; 512 ruang, dan ' +
         'satu larik satu dimensi menyimpan semuanya. Fungsi ini yang ' +
         'menerjemahkan koordinat jadi indeks, dan ia dipakai lebih dari ' +
         'empat puluh kali.',
         'Perhatikan bahwa ia cuma menerima SATU argumen. X dan Y diambil dari ' +
         'variabel global &mdash; fungsi yang membaca keadaan di luar dirinya, ' +
         'yang di BASIC bukan kecerobohan melainkan satu-satunya cara: ' +
         '<code>DEF FN</code> hanya boleh punya satu baris.',
         '<code>820 DEF FNB(Q)=Q+8*((Q=9)-(Q=0))</code>',
         'Dan ini yang menentukan BENTUK kastilnya. Koordinat nol jadi ' +
         'delapan, sembilan jadi satu &mdash; keluar dari sisi barat berarti ' +
         'masuk dari sisi timur. Kastilnya berbentuk donat di kedua sumbu, dan ' +
         'seluruh topologi itu ada di satu baris yang tidak menyebut kata ' +
         '"dinding" sama sekali.'],
        ['Perbandingan sebagai bilangan, empat cara',
         'Di BASIC, perbandingan yang benar bernilai &minus;1. Program ini ' +
         'memakainya untuk empat hal yang sama sekali berbeda:',
         '<code>3090 C(Q,4)=-(C(Q,1)=X)*(C(Q,2)=Y)*(C(Q,3)=Z)</code> &mdash; ' +
         'tiga perbandingan DIKALIKAN. Hasilnya 1 hanya kalau ketiganya benar. ' +
         'Menggantikan tiga <code>IF</code> bersarang dengan satu baris.',
         '<code>4310 X=X+(O$="N")-(O$="S")</code> &mdash; arah gerak. Kedua ' +
         'arah muat di satu baris tanpa percabangan.',
         '<code>2520 AV=-3*(O$="P")-2*(O$="C")-(O$="L")</code> &mdash; harga ' +
         'zirah. Tiga perkalian menghasilkan 3, 2, 1, atau 0 tepat sesuai ' +
         'huruf yang diketik.',
         '<code>5280 ON (1-(ST&lt;1)) GOTO 2880,9120</code> &mdash; dan ini ' +
         'yang paling jauh: perbandingan jadi INDEKS. Kekuatan masih positif ' +
         'berarti indeks 1, habis berarti indeks 2, dan indeks 2 adalah layar ' +
         'kematian.'],
        ['Satu larik untuk dua kelompok',
         '<code>6420 &hellip; W$(WV+1) &hellip; W$(AV+5)</code>',
         '<code>W$</code> menyimpan delapan nama berurutan: empat senjata lalu ' +
         'empat zirah. Yang memisahkannya cuma pergeseran indeks &mdash; ' +
         '<code>+1</code> untuk senjata, <code>+5</code> untuk zirah.',
         'Dan <code>E$</code> di sebelahnya menyimpan delapan cara memasak, ' +
         'dibaca dari <code>DATA</code> yang sama, berselang-seling dengan ' +
         '<code>W$</code>. Baris 8470 menyambung nama monster dengan salah ' +
         'satunya: seratus empat kalimat dari dua puluh satu string.'],
        ['Nama monster yang dibersihkan dari kata sandangnya',
         '<code>8310 Z$=RIGHT$(C$(A+12),LEN(C$(A+12))-2)</code>',
         '<code>8320 IF LEFT$(Z$,1)=" " THEN Z$=MID$(Z$,2)</code>',
         'Nama monster disimpan lengkap: "a Kobold", "an Orc". Kalimat seperti ' +
         '<i>"You\'re confronting a Kobold!"</i> butuh bentuk itu; kalimat ' +
         'seperti <i>"Thud! The Kobold hit you!"</i> tidak.',
         'Dua baris membuang sandangnya: potong dua aksara, lalu kalau yang ' +
         'tersisa masih diawali spasi &mdash; karena sandangnya "an" dan bukan ' +
         '"a" &mdash; potong satu lagi. Dua baris, dua bentuk, satu daftar.']
      ],
      hindari: [
        ['Penugasan yang langsung dibuang',
         '<code>4570 IF Q > 99 THEN Q=Q-100:LET Q=34:REM TO HIDE ROOMS</code>',
         'Dua penugasan ke <code>Q</code> berurutan di baris yang sama, dan ' +
         'yang pertama tidak pernah berarti apa-apa: <code>Q=34</code> ' +
         'menimpanya seketika.',
         'Maksudnya jelas dari komentarnya &mdash; ruang yang belum dilihat ' +
         'digambar sebagai ruang tak dikenal. Tapi pengurangan seratusnya sisa ' +
         'dari versi sebelumnya, dan ia masih di sana, membuat pembacanya ' +
         'mengira nilai aslinya dipakai untuk sesuatu.'],
        ['Tangga pangkat yang berlubang',
         '<code>10020 IF JOHN! &lt; 20000 THEN RANK$ ="a Wimp"</code>',
         '<code>10021 IF JOHN! > 35000 THEN RANK$="a Peasant"</code>',
         'Yang pertama menguji <b>kurang dari</b> 20.000; yang kedua ' +
         '<b>lebih dari</b> 35.000. Skor di antara keduanya tidak memenuhi ' +
         'satu pun, dan <code>RANK$</code> tetap string kosong.',
         'Kalimat pangkatnya tetap tercetak &mdash; tanpa pangkat di dalamnya. ' +
         'Dan rentang 20.000-35.000 justru rentang yang paling mungkin dicapai ' +
         'pemain baru.'],
        ['Dua rumus skor untuk satu nama',
         '<code>6450 JOHN!=IQ*100+ST*100+DX*100+KM!+FTRS+REQ+GP!-T*5</code>',
         '<code>11050 LET JOHN!=ST+IQ+DX+GP!-T</code>',
         'Baris 6450 dipakai papan keadaan; baris 11050 dipakai perintah ' +
         '"#". Keduanya menulis ke variabel yang sama, dan yang kedua jauh ' +
         'lebih kecil &mdash; tanpa pengali seratus, tanpa nilai monster yang ' +
         'dibunuh, tanpa denda giliran lima kali.',
         'Jadi menekan "#" MENURUNKAN skor yang tercatat, dan skor akhir di ' +
         'baris 10000 bergantung pada baris mana yang terakhir dijalankan. ' +
         'Pemain yang sering memeriksa skornya mendapat pangkat yang lebih ' +
         'rendah.'],
        ['Bola kristal yang berbohong tanpa memberi tanda',
         '<code>6040 IF FNA(8) &lt; 4 THEN A=O(1) : B=O(2) : C=O(3)</code>',
         '<code>6050 &hellip; PRINT "The Amulet of Chaos at (";A;",";B;") level";C</code>',
         'Tiga dari delapan kali, A, B, dan C diisi letak Jimat yang ' +
         'sebenarnya. Lima dari delapan kali mereka tetap berisi angka acak ' +
         'yang disiapkan baris sebelumnya.',
         'Dan kalimat yang tercetak SAMA PERSIS di kedua kasus. Tidak ada ' +
         '"mungkin", tidak ada "sepertinya" &mdash; bola kristalnya menyatakan ' +
         'kebohongan dengan keyakinan yang sama dengan kebenaran.',
         'Sebagai rancangan permainan itu bagus. Sebagai kode ia berbahaya: ' +
         'satu-satunya yang membedakan kedua cabang adalah tiga penugasan di ' +
         'dalam sebuah <code>IF</code>, dan tidak ada satu komentar pun yang ' +
         'menyebutkannya.']
      ]
    },

    penjelasan: [
      { judul: 'Empat tahun, dua penulis, satu kerangka',
        isi: [
          'Bagian kepala berkas ini menyebut sumbernya sendiri:',
          '<code>750 REM    * THANKS TO RECREATIONAL COMPUTING FOR THE ORIGINAL*</code>',
          '<code>760 REM    * PROGRAM          JUNE 29, 1984                   *</code>',
          'Recreational Computing memuat WIZARD.BAS di edisi Juli/Agustus 1980, ' +
          'karya Joseph R. Power. Berkas itu ada di koleksi ini juga, 944 ' +
          'baris, dan sudah diport.',
          'Yang membuktikan hubungannya bukan kalimat itu melainkan lima baris ' +
          'di bagian atas:',
          '<code>810 DEF FNA(Q)=1+INT(RND(1)*Q)</code>',
          '<code>820 DEF FNB(Q)=Q+8*((Q=9)-(Q=0))</code>',
          '<code>830 DEF FNC(Q)=-Q*(Q&lt;19)-18*(Q>18)</code>',
          '<code>840 DEF FND(Q)=64*(Q-1)+8*(X-1)+Y</code>',
          '<code>850 DEF FNE(Q)=Q+100*(Q>99)</code>',
          'Kelimanya sama bentuknya dengan WIZARD.BAS baris 240-280. Bukan ' +
          'mirip &mdash; sama. Larik 512 ruang, pembungkusan koordinat ' +
          'delapan-ke-satu, batas atas 18 untuk sifat pemain, dan penanda ' +
          '"+100 berarti belum dilihat".',
          'Dan yang berbeda menceritakan empat tahun di antaranya. WIZARD ' +
          'punya monster generik; TEMPLE berterima kasih kepada TSR &mdash; ' +
          'penerbit Dungeons &amp; Dragons &mdash; dan memakai Mind Flayer, ' +
          'Drider, Balor Demon. WIZARD punya Orb of Zot; TEMPLE punya Amulet ' +
          'of Chaos dan cerita latar dua puluh baris tentang Perang Elf ' +
          'Pertama.',
          'WIZARD berjalan di layar teks polos; TEMPLE membuka dengan layar ' +
          'grafik CGA, dua ratus bintang, dan terowongan elips yang menutup.',
          'Yang tidak berubah: aritmetikanya. Empat tahun, dua penulis, dan ' +
          'lima baris yang disalin utuh karena tidak ada yang perlu diperbaiki ' +
          'di sana.',
          'Dan TEMPLE menambahkan sesuatu yang tidak dimiliki induknya: berkas ' +
          'kedua. Baris 11570 memanggil <code>CHAIN"TEM-INS.BAS",10</code>, ' +
          'dan TEM-INS baris 3010 memanggil balik <code>CHAIN "Temple",700</code>. ' +
          'Dua ratus sembilan puluh baris petunjuk yang tidak muat di memori ' +
          'bersama permainannya, jadi keduanya saling melempar.'
        ] },
      { judul: 'Skor yang bernama John',
        isi: [
          'Variabel skor program ini bernama <code>JOHN!</code>.',
          '<code>6450 JOHN!=IQ*100+ST*100+DX*100+KM!+FTRS+REQ+GP!-T*5</code>',
          'John Belew, yang menandatangani baris 520 dan menyebut dirinya ' +
          'Nurruc the Chaotic di baris 530. Tanda seru di ujungnya bukan ' +
          'ekspresi &mdash; ia penanda presisi tunggal, karena skornya bisa ' +
          'melebihi 32.767.',
          'Dan baris terakhir program ini, nomor 12100, berbunyi:',
          '<code>12100 IF JOHN! > 142498 THEN PRINT " Don\'t forget to replace ' +
          'my score on Tem-Ins.Bas</code>',
          'Seratus empat puluh dua ribu empat ratus sembilan puluh delapan. ' +
          'Skor penulisnya sendiri, ditulis sebagai bilangan telanjang di ' +
          'dalam syarat.',
          'Dan angka yang sama ada di TEM-INS.BAS &mdash; berkas petunjuknya, ' +
          'di disket yang sama, di daftar skor tertinggi. Dua berkas, satu ' +
          'angka, dan tidak ada apa pun yang menjaga keduanya tetap sama.',
          'Yang diminta baris ini bukan agar programnya memperbarui daftar ' +
          'itu. Ia meminta <b>pemainnya</b> melakukannya: memuat berkas yang ' +
          'lain di penyunting BASIC, mencari barisnya, dan mengetik ulang ' +
          'angkanya.',
          'Itu cara sebuah papan skor bekerja ketika tidak ada berkas data, ' +
          'tidak ada jaringan, dan satu-satunya penyimpanan bersama adalah ' +
          'disket yang dipinjamkan dari tangan ke tangan.',
          'Dan itu juga sebabnya angka 142.498 masih ada di sini, empat puluh ' +
          'dua tahun kemudian, di kedua berkasnya: tidak ada seorang pun yang ' +
          'pernah mengalahkannya, atau kalau ada, tidak ada yang repot-repot ' +
          'menyuntingnya.'
        ] }
    ]
  };
})(window);
