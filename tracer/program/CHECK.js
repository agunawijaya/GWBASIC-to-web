/* ===========================================================================
   CHECK.js — porting minimalis CHECK.BAS sebagai tabel baris.

   Program ketiga, dan ia mematahkan satu asumsi arsitektur mesinnya.

   Baris 80 berbunyi:

       80 GOSUB 90:GOSUB 140:GOSUB 40:GOSUB 90:GOSUB 350:RUN"menu

   Lima GOSUB dalam SATU baris. Sampai program ini, tiap entri tabel hanya
   boleh melakukan satu tindakan kendali — jadi RETURN yang pertama akan
   pulang ke baris 90, bukan ke pernyataan kedua di baris 80. Maka entri tabel
   sekarang boleh berbentuk `{ baris, bagian: [fn, fn, ...] }`, dan alamat
   pulang GOSUB membawa nomor bagiannya.

   Sorotan tidak berubah: seluruh bagian milik satu nomor baris, dan nomor
   baris itulah yang disorot.

   Yang juga ditagih program ini:
     - `ERL` (nomor baris tempat galat terjadi), dipakai penangan di 760-810
       untuk membedakan gagal-di-730 dari gagal-di-740
     - `RESUME` dan `RESUME <baris>`
     - `ERROR 200` — galat buatan sendiri sebagai sandi, bukan galat sungguhan
     - `OPEN`/`CLOSE` sebagai uji keberadaan berkas, bukan sebagai pembacaan
     - `CHAIN` ke berkas yang hilang dari koleksi ini

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `KEY OFF`, `SCREEN 0,0,0`, `DEF SEG` tidak berbuat apa-apa.
   - `BEEP` di baris 790 tidak berbunyi; penelusur ini memang tidak bersuara.
   - `COLOR 31,0` di baris 790 berarti putih-terang BERKEDIP (31 = 15 + 16).
     Kedipnya tidak ditiru, jadi yang keluar putih terang saja.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Dinding teks di baris 170-320 ditulis sekali di sini. Tiap entri:
     [nomorBaris, barisLayar, teks]. Kolomnya selalu 10, dan tiap PRINT-nya
     tanpa titik koma penutup — itulah kenapa string aslinya banyak yang tidak
     ditutup tanda kutip: GW-BASIC menutupnya di ujung baris. */
  var PARAGRAF = [
    [170,  5, 'The Check Register program  is designed to  assist you with one'],
    [180,  6, 'of the most boring and thankless tasks known to man - balancing'],
    [190,  7, 'and reconciling your checking account(s). It combines the speed'],
    [200,  8, 'and accuracy of your computer  to help you maintain and monitor'],
    [210,  9, 'a virtually unlimited number of checking accounts.'],
    [240, 13, 'diskettes as follows:'],
    [270, 16, 'individual account diskettes.'],
    [280, 18, 'The  CHECK REGISTER MASTER DISKETTE  must be formatted and must'],
    [290, 19, 'contain BASICA.COM. To accomplish that, refer to your Friendly-'],
    [300, 20, 'Ware manual, pages I and II. To format the master diskette fol-'],
    [310, 21, 'low instructions 2 thru 6 on page I.To copy BASICA.COM onto the'],
    [320, 22, 'master follow instructions 8 and 9 on page II.']
  ];

  function barisTeks(nomor, baris, teks) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, 10);
      m.cetak(teks);
      m.barisBaru();
    } };
  }

  var tabel = [

    /* 10  KEY OFF:DEF SEG:SCREEN 0,0,0:KEY(10) ON:ON KEY(10) GOSUB 510
       Perhatikan urutannya: KEY(10) ON lebih dulu, ON KEY(10) GOSUB kemudian.
       Kebalikan dari INTRO.BAS. BASIC tidak peduli; keduanya sah. */
    { baris: 10, jalan: function (m) {
        m.warna(7, 0);
        m.jebakan(10, true);
        m.pasangJebakan(10, 510);
      } },

    /* 20 FOR A=1 TO 9:KEY(A) ON:ON KEY(A) GOSUB 70:NEXT:ON ERROR GOTO 750
       Sembilan jebakan yang semuanya menuju baris 70, dan baris 70 isinya
       RETURN. Trik yang sama dengan MENU.BAS: jebakan sengaja dibuat mandul
       supaya F1-F9 tidak mengacaukan tampilan. */
    { baris: 20, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.jebakan(m.v.A, true);
          m.pasangJebakan(m.v.A, 70);
        }
        m.penangkapGalat = 750;
      } },

    /* 30  GOTO 80 — melompati subrutin 40-70 yang duduk di depan alur utama. */
    { baris: 30, jalan: function (m) { m.lompat(80); } },

    /* 40-70: subrutin "tunggu satu tombol".
       40 POKE 106,0        buang tombol yang terlanjur ditekan
       50 IF INKEY$<>"" THEN 40   keringkan sisanya sampai benar-benar kosong
       60 RS$=INKEY$:IF RS$="" THEN 60   baru menunggu yang sungguhan
       70 RETURN
       Dua tahap pembuangan sebelum menunggu — pertanda penulisnya pernah
       kena masalah tombol nyasar dan menambalnya dua kali. */
    { baris: 40, jalan: function (m) { m.kosongkanPenyangga(); } },
    { baris: 50, jalan: function (m) { if (m.inkey() !== '') m.lompat(40); } },
    { baris: 60, jalan: function (m) {
        m.v['RS$'] = m.inkey();
        if (m.v['RS$'] === '') m.lompat(60);
      } },
    /* 70 RETURN — penutup subrutin 40-60 SEKALIGUS badan jebakan F1-F9. */
    { baris: 70, jalan: function (m) { m.kembali(); } },

    /* 80 GOSUB 90:GOSUB 140:GOSUB 40:GOSUB 90:GOSUB 350:RUN"menu

       Baris yang mematahkan asumsi mesinnya. Dibaca sebagai kalimat:
       gambar kotak, tulis penjelasannya, tunggu tombol, gambar kotak lagi
       (yang sekalian membersihkan layar), tanya kesiapan, lalu kembali ke
       menu. Seluruh alur program ada di satu baris ini. */
    { baris: 80, bagian: [
        function (m) { m.gosub(90); },    /* kotak + baris "F10 To Menu" */
        function (m) { m.gosub(140); },   /* judul + dinding teks        */
        function (m) { m.gosub(40); },    /* tunggu satu tombol          */
        function (m) { m.gosub(90); },    /* CLS lewat kotak, lagi       */
        function (m) { m.gosub(350); },   /* dua tanya "ARE YOU READY?"  */
        function (m) { m.jalankan('menu'); }
      ] },

    /* 90 CLS:PRINT:COLOR 0,7:PRINT" F10 ";:COLOR 7,0:PRINT" To Menu":COLOR 11,0
       PRINT tanpa apa pun = satu baris kosong. */
    { baris: 90, jalan: function (m) {
        m.cls();
        m.barisBaru();
        m.warna(0, 7); m.cetak(' F10 ');
        m.warna(7, 0); m.cetak(' To Menu'); m.barisBaru();
        m.warna(11, 0);
      } },

    /* 100 FOR I=1 TO 3 STEP 2:FOR J=20 TO 62:LOCATE I,J,0:PRINT CHR$(196):NEXT:NEXT

       Dua gelung bersarang dalam satu baris, menggambar sisi atas dan bawah
       kotak satu karakter demi satu karakter — 86 kali LOCATE untuk sesuatu
       yang bisa dikerjakan satu STRING$ seperti di INTRO.BAS. Satu langkah
       penelusuran menjalankan semuanya, karena satu baris tetap satu baris. */
    { baris: 100, jalan: function (m) {
        for (m.v.I = 1; m.v.I <= 3; m.v.I += 2) {
          for (m.v.J = 20; m.v.J <= 62; m.v.J++) {
            m.locate(m.v.I, m.v.J, 0);
            m.cetak(m.chr(196));
            m.barisBaru();
          }
        }
      } },

    /* 110 keempat sudut, satu per satu. */
    { baris: 110, jalan: function (m) {
        m.locate(1, 19); m.cetak(m.chr(218)); m.barisBaru();
        m.locate(1, 63); m.cetak(m.chr(191)); m.barisBaru();
        m.locate(3, 63); m.cetak(m.chr(217)); m.barisBaru();
        m.locate(3, 19); m.cetak(m.chr(192)); m.barisBaru();
      } },

    /* 120 LOCATE 2,19:PRINT CHR$(179) SPC(43) CHR$(179) */
    { baris: 120, jalan: function (m) {
        m.locate(2, 19);
        m.cetak(m.chr(179));
        m.spc(43);
        m.cetak(m.chr(179));
        m.barisBaru();
      } },

    /* 130 RETURN */
    { baris: 130, jalan: function (m) { m.kembali(); } },

    /* 140 COLOR 0,7 — lalu langsung ke 160. Tidak ada baris 150. */
    { baris: 140, jalan: function (m) { m.warna(0, 7); } },

    /* 160 LOCATE 2,27,0:PRINT" C H E C K   R E G I S T E R ":COLOR 7,0 */
    { baris: 160, jalan: function (m) {
        m.locate(2, 27, 0);
        m.cetak(' C H E C K   R E G I S T E R '); m.barisBaru();
        m.warna(7, 0);
      } },

    /* 170-210: paragraf pertama (lihat PARAGRAF di atas). */
    barisTeks(170, 5, PARAGRAF[0][2]),
    barisTeks(180, 6, PARAGRAF[1][2]),
    barisTeks(190, 7, PARAGRAF[2][2]),
    barisTeks(200, 8, PARAGRAF[3][2]),
    barisTeks(210, 9, PARAGRAF[4][2]),

    /* 220-260: paragraf kedua. Tiga di antaranya menyisipkan CHR$(34) —
       tanda kutip ganda. BASIC tidak punya cara meng-escape tanda kutip di
       dalam string, jadi satu-satunya jalan adalah memanggilnya lewat kodenya. */
    barisTeks(220, 11, 'The program requires  the use of  separate data diskettes:  one'),
    { baris: 230, jalan: function (m) {
        m.locate(12, 10);
        m.cetak('data diskette for each account, and one ' + m.chr(34) +
                'MASTER' + m.chr(34) + ' check register');
        m.barisBaru();
      } },
    barisTeks(240, 13, PARAGRAF[5][2]),
    { baris: 250, jalan: function (m) {
        m.locate(14, 10);
        m.cetak('diskettes as follows:  ' + m.chr(34) +
                'CHECK REGISTER MASTER DISKETTE' + m.chr(34) + ' for the');
        m.barisBaru();
      } },
    { baris: 260, jalan: function (m) {
        m.locate(15, 10);
        m.cetak('master and  ' + m.chr(34) +
                'DATA DISKETTE #__, ACCOUNT #_______, 19__' + m.chr(34) + ' for the');
        m.barisBaru();
      } },
    barisTeks(270, 16, PARAGRAF[6][2]),

    /* 280-320: paragraf ketiga. */
    barisTeks(280, 18, PARAGRAF[7][2]),
    barisTeks(290, 19, PARAGRAF[8][2]),
    barisTeks(300, 20, PARAGRAF[9][2]),
    barisTeks(310, 21, PARAGRAF[10][2]),
    barisTeks(320, 22, PARAGRAF[11][2]),

    /* 330 LOCATE 25,27:PRINT"Strike Any Key To Continue";
       Titik koma penutup menjaga baris 25 tidak menggulung layar. */
    { baris: 330, jalan: function (m) {
        m.locate(25, 27);
        m.cetak('Strike Any Key To Continue');
      } },

    /* 340 RETURN */
    { baris: 340, jalan: function (m) { m.kembali(); } },

    /* 350 judul lagi, di layar yang baru dibersihkan baris 90. */
    { baris: 350, jalan: function (m) {
        m.locate(2, 27);
        m.warna(0, 7);
        m.cetak(' C H E C K   R E G I S T E R '); m.barisBaru();
        m.warna(7, 0);
      } },

    barisTeks(360, 7, 'You must have a formatted  MASTER diskette with'),
    { baris: 370, jalan: function (m) {
        m.locate(8, 21); m.cetak('BASICA.COM on it  AND a blank, formatted'); m.barisBaru();
      } },
    { baris: 380, jalan: function (m) {
        m.locate(9, 31); m.cetak('diskette to continue.'); m.barisBaru();
      } },
    { baris: 390, jalan: function (m) {
        m.locate(11, 31); m.cetak('ARE YOU READY? (Y/N)'); m.barisBaru();
      } },

    /* 400 DEF SEG:POKE 106,0:IF INKEY$<>"" THEN 400 */
    { baris: 400, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(400);
      } },
    /* 410 A$=INKEY$:IF A$="" THEN 410 */
    { baris: 410, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(410);
      } },
    /* 420 IF A$="Y" OR A$="y" THEN 440 */
    { baris: 420, jalan: function (m) {
        var a = m.v['A$'];
        if (a === 'Y' || a === 'y') m.lompat(440);
      } },
    /* 430 IF A$="N" OR A$="n" THEN RETURN ELSE 410
       Semua yang sesudah ELSE milik ELSE. Tombol selain Y dan N dibuang dan
       pertanyaannya diulang tanpa pesan apa pun. */
    { baris: 430, jalan: function (m) {
        var a = m.v['A$'];
        if (a === 'N' || a === 'n') m.kembali();
        else m.lompat(410);
      } },

    { baris: 440, jalan: function (m) {
        m.locate(17, 21); m.cetak('You MUST follow the screen instructions'); m.barisBaru();
      } },
    { baris: 450, jalan: function (m) {
        m.locate(18, 23); m.cetak('to completion or errors will occur.'); m.barisBaru();
      } },
    { baris: 460, jalan: function (m) {
        m.locate(20, 31); m.cetak('ARE YOU READY? (Y/N)'); m.barisBaru();
      } },
    { baris: 470, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(470);
      } },
    { baris: 480, jalan: function (m) {
        m.v['A$'] = m.inkey();
        if (m.v['A$'] === '') m.lompat(480);
      } },
    { baris: 490, jalan: function (m) {
        var a = m.v['A$'];
        if (a === 'Y' || a === 'y') m.lompat(520);
      } },
    { baris: 500, jalan: function (m) {
        var a = m.v['A$'];
        if (a === 'N' || a === 'n') m.kembali();
        else m.lompat(480);
      } },

    /* 510 RUN"menu — badan jebakan F10. */
    { baris: 510, jalan: function (m) { m.jalankan('menu'); } },

    /* 520 CLS
       Sesudah ini nomor barisnya melompat dari 520 ke 720. Dua ratus nomor
       yang kosong: bagian program yang benar-benar mengerjakan buku cek tidak
       ada di berkas ini — ia ada di berkas lain, dan baris 720 yang
       memanggilnya. */
    { baris: 520, jalan: function (m) { m.cls(); } },

    /* 720 GOSUB 740:CLOSE:CHAIN"info.sys",4250

       Tiga pernyataan, satu di antaranya meninggalkan baris — jadi baris ini
       pun berbagian. CHAIN menuju `info.sys` yang TIDAK ADA di koleksi ini,
       jadi hasilnya ERR 53, dan penangan di baris 750 yang mengurusnya.
       Bukan cacat porting: berkasnya memang hilang dari disket yang tersalin. */
    { baris: 720, bagian: [
        function (m) { m.gosub(740); },
        function (m) { m.tutup(); },
        function (m) { m.rantai('info.sys', 4250); }
      ] },

    /* 730 ERX=0:CLOSE:OPEN "I",1,"MENU.BAS":IF ERX=0 THEN ERROR 200 ELSE RETURN

       Baris yang paling aneh di berkas ini. ERX baru saja diisi 0, jadi
       `IF ERX=0` selalu benar dan `ERROR 200` selalu dipicu — kecuali kalau
       OPEN-nya gagal lebih dulu, karena penangan galat di 750 mengisi ERX=1
       lalu RESUME kembali ke sini. Jadi ERX bukan penanda keadaan, melainkan
       cara menanyakan "apakah barusan ada galat?" — dan ERROR 200 dipakai
       sebagai sandi "disketnya salah", bukan sebagai galat sungguhan. */
    { baris: 730, bagian: [
        function (m) { m.v.ERX = 0; m.tutup(); m.buka('MENU.BAS'); },
        function (m) { if (m.v.ERX === 0) m.galat(200, 'sandi: disket salah');
                       else m.kembali(); }
      ] },

    /* 740 CLOSE:OPEN "I",1,"MENU.BAS":RETURN
       Membuka berkas hanya untuk menutupnya lagi. Ini bukan pembacaan berkas,
       melainkan pertanyaan: "apakah disket FriendlyWare ada di drive?" */
    { baris: 740, jalan: function (m) {
        m.tutup();
        m.buka('MENU.BAS');
        m.kembali();
      } },

    /* 750 ERX=1 — pintu masuk penangan galat. */
    { baris: 750, jalan: function (m) { m.v.ERX = 1; } },

    /* 754 galat disket: 70 Permission denied, 71 Disk not ready, 72 Disk error. */
    { baris: 754, jalan: function (m) {
        if (m.err === 70 || m.err === 72 || m.err === 71) {
          m.v['MG$'] = '         Disk Not Ready';
          m.lompat(790);
        }
      } },
    /* 755 sandi buatan sendiri dari baris 730. */
    { baris: 755, jalan: function (m) {
        if (m.err === 200) {
          m.v['MG$'] = 'Insert `CHECK REGISTER\' Diskette';
          m.lompat(790);
        }
      } },
    /* 760-770 ERL: baris mana yang gagal menentukan pesan mana yang muncul. */
    { baris: 760, jalan: function (m) { if (m.erl === 730) m.lanjut(9000); } },
    { baris: 770, jalan: function (m) {
        if (m.erl === 740) {
          m.v['MG$'] = 'Insert FriendlyWare Diskette #3';
          m.lompat(790);
        }
      } },
    { baris: 780, jalan: function (m) { m.lompat(800); } },

    /* 790 BEEP:COLOR 31,0:LOCATE 24,20:PRINT MG$;
       Warna 31 = putih terang + kedip (15 + 16). Kedipnya tidak ditiru. */
    { baris: 790, jalan: function (m) {
        m.bunyi();
        m.warna(31, 0);
        m.locate(24, 20);
        m.cetak(m.v['MG$'] || '');
      } },

    /* 800 LOCATE 25,20:COLOR 7,0:PRINT"Strike Any Key When Ready <ESC> To Abort"; */
    { baris: 800, jalan: function (m) {
        m.locate(25, 20);
        m.warna(7, 0);
        m.cetak('Strike Any Key When Ready <ESC> To Abort');
      } },

    /* 810 GOSUB 60:IF RS$=CHR$(27) THEN RESUME 820 ELSE ... RESUME

       Baris terpanjang di berkas ini, dan pusat seluruh penanganan galatnya.
       Berbagian karena GOSUB 60 harus pulang ke tengah baris. Sesudah pulang:
       ESC berarti menyerah (RESUME 820, keluar ke menu); tombol lain berarti
       "sudah saya perbaiki, coba lagi" — dua baris pesan dihapus, lalu RESUME
       mengulangi pernyataan yang tadi gagal.

       Kalau disketnya memang tidak ada, mengulanginya akan gagal lagi, dan
       gelung ini berputar selamanya. Itu bukan cacat: itu memang perilaku
       program yang menunggu manusia memasukkan disket. */
    { baris: 810, bagian: [
        function (m) { m.gosub(60); },
        function (m) {
          if (m.v['RS$'] === m.chr(27)) { m.lanjut(820); return; }
          m.locate(24, 1); m.spc(79);
          m.locate(25, 1); m.spc(79);
          if (m.erl === 730)      m.lanjut(730);
          else if (m.erl === 740) m.lanjut(740);
          else                    m.lanjut();
        }
      ] },

    /* 820 GOSUB 740:RUN"menu — jalan keluarnya. */
    { baris: 820, bagian: [
        function (m) { m.gosub(740); },
        function (m) { m.jalankan('menu'); }
      ] },

    /* 9000 RETURN */
    { baris: 9000, jalan: function (m) { m.kembali(); } }
  ];

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['CHECK'] = {
    nama: 'CHECK',
    judul: 'Check Register',
    sumber: 'CHECK',
    berkas: 'run/CHECK.BAS',
    tabel: tabel,

    arsitektur: {
      judul: 'Alur CHECK.BAS',
      simpul: [
        { id: 'siap', baris: '10-20', jenis: 'mulai',
          teks: ['Pasang jebakan F1-F10', 'arahkan galat ke baris 750'] },
        { id: 'alur', baris: '80', jenis: 'putusan',
          teks: ['Alur utama: enam pernyataan', 'dalam SATU baris'] },
        { id: 'kotak', baris: '90-130', jenis: 'subrutin',
          teks: ['Bersihkan layar,', 'gambar kotak judul'] },
        { id: 'teks', baris: '140-340', jenis: 'subrutin',
          teks: ['Tulis penjelasan program', 'lalu "Strike Any Key"'] },
        { id: 'tombol', baris: '40-70', jenis: 'subrutin',
          teks: ['Tunggu satu tombol', '(dua tahap pembuangan dulu)'] },
        { id: 'tanya', baris: '350-500', jenis: 'subrutin',
          teks: ['Dua kali "ARE YOU READY?"', 'N kapan saja = pulang'] },
        { id: 'kerja', baris: '520-720',
          teks: ['Bersihkan layar, uji disket,', 'lalu CHAIN ke info.sys'] },
        { id: 'tangkap', baris: '750-780', jenis: 'galat',
          teks: ['Galat mana? ERR dan ERL', 'menentukan pesannya'] },
        { id: 'pesan', baris: '790-800', jenis: 'galat',
          teks: ['Bunyikan, tulis pesan,', '"tekan tombol / ESC untuk batal"'] },
        { id: 'putusGalat', baris: '810', jenis: 'putusan',
          teks: ['Yang ditekan ESC?'] },
        { id: 'keluar', baris: '820', jenis: 'keluar',
          teks: ['RUN "menu"'] }
      ],
      panah: [
        { dari: 'siap',   ke: 'alur',   label: 'GOTO 80' },
        { dari: 'alur',   ke: 'kotak',  label: 'GOSUB 90' },
        { dari: 'kotak',  ke: 'alur',   label: 'RETURN' },
        { dari: 'alur',   ke: 'teks',   label: 'GOSUB 140' },
        { dari: 'teks',   ke: 'alur',   label: 'RETURN' },
        { dari: 'alur',   ke: 'tombol', label: 'GOSUB 40' },
        { dari: 'tombol', ke: 'alur',   label: 'RETURN' },
        { dari: 'alur',   ke: 'tanya',  label: 'GOSUB 350' },
        { dari: 'tanya',  ke: 'alur',   label: 'RETURN' },
        { dari: 'tanya',  ke: 'kerja',  label: 'Y dua kali' },
        { dari: 'kerja',  ke: 'tangkap', label: 'ERR 53', jenis: 'galat' },
        { dari: 'tangkap', ke: 'pesan' },
        { dari: 'pesan',  ke: 'putusGalat' },
        { dari: 'putusGalat', ke: 'kerja', label: 'bukan ESC: RESUME', jenis: 'galat' },
        { dari: 'putusGalat', ke: 'keluar', label: 'ya' }
      ]
    },

    pseudokode: [
      { baris: 10,  tingkat: 0, teks: 'pasang jebakan F10 &rarr; baris 510 (kembali ke menu)' },
      { baris: 20,  tingkat: 0, teks: 'pasang jebakan F1..F9 &rarr; baris 70, yang isinya cuma <b>pulang</b>' },
      { baris: 20,  tingkat: 0, teks: 'kalau ada galat, lompat ke baris 750' },
      { baris: 30,  tingkat: 0, teks: 'lompat ke baris 80, melewati subrutin di bawah ini' },
      { baris: 40,  tingkat: 0, teks: '<b>SUBRUTIN tunggu-tombol</b> (baris 40&ndash;70):' },
      { baris: 40,  tingkat: 1, teks: 'buang tombol yang tertunda' },
      { baris: 50,  tingkat: 1, teks: 'masih ada sisa? buang lagi &mdash; dua tahap, bukan satu' },
      { baris: 60,  tingkat: 1, teks: 'baru sekarang tunggu tombol yang sungguhan' },
      { baris: 70,  tingkat: 1, teks: 'pulang' },
      { baris: 80,  tingkat: 0, teks: '<b>ALUR UTAMA, seluruhnya dalam satu baris:</b>' },
      { baris: 80,  tingkat: 1, teks: '1. gambar kotak judul <span class="t-pseudo__ket">(subrutin 90)</span>' },
      { baris: 80,  tingkat: 1, teks: '2. tulis penjelasan program <span class="t-pseudo__ket">(subrutin 140)</span>' },
      { baris: 80,  tingkat: 1, teks: '3. tunggu satu tombol <span class="t-pseudo__ket">(subrutin 40)</span>' },
      { baris: 80,  tingkat: 1, teks: '4. gambar kotak lagi &mdash; sekalian membersihkan layar' },
      { baris: 80,  tingkat: 1, teks: '5. tanya kesiapan pemakai <span class="t-pseudo__ket">(subrutin 350)</span>' },
      { baris: 80,  tingkat: 1, teks: '6. kembali ke menu' },
      { baris: 100, tingkat: 0, teks: 'gambar sisi kotak <b>satu karakter demi satu karakter</b>, 86 kali' },
      { baris: 350, tingkat: 0, teks: '<b>SUBRUTIN tanya kesiapan</b> (baris 350&ndash;500):' },
      { baris: 390, tingkat: 1, teks: 'tanya "ARE YOU READY? (Y/N)"' },
      { baris: 420, tingkat: 1, teks: 'kalau Y: lanjut ke pertanyaan kedua' },
      { baris: 430, tingkat: 1, teks: 'kalau N: pulang. Tombol lain: tanya lagi tanpa berkata apa-apa' },
      { baris: 490, tingkat: 1, teks: 'kalau Y lagi: lanjut ke baris 520 &mdash; <b>pekerjaan sesungguhnya</b>' },
      { baris: 720, tingkat: 0, teks: 'uji disket dengan mencoba membuka MENU.BAS, lalu:' },
      { baris: 720, tingkat: 1, teks: 'serahkan kendali ke <code>info.sys</code> &mdash; <b>berkas ini hilang dari koleksi</b>' },
      { baris: 750, tingkat: 0, teks: '<b>KALAU ADA GALAT:</b>' },
      { baris: 754, tingkat: 1, teks: 'galat 70/71/72 (disket bermasalah) &rarr; pesan "Disk Not Ready"' },
      { baris: 755, tingkat: 1, teks: 'galat 200 (sandi buatan sendiri) &rarr; "Insert CHECK REGISTER Diskette"' },
      { baris: 760, tingkat: 1, teks: 'gagalnya di baris berapa? <code>ERL</code> yang menjawab' },
      { baris: 790, tingkat: 1, teks: 'bunyikan bel, tulis pesannya di baris 24' },
      { baris: 800, tingkat: 1, teks: 'tulis "tekan tombol kalau sudah siap, ESC untuk batal"' },
      { baris: 810, tingkat: 1, teks: 'tunggu tombol:' },
      { baris: 810, tingkat: 2, teks: 'ESC &rarr; menyerah, lanjut di baris 820' },
      { baris: 810, tingkat: 2, teks: 'tombol lain &rarr; hapus pesan, <b>ulangi pernyataan yang tadi gagal</b>' },
      { baris: 820, tingkat: 0, teks: 'kembali ke menu' }
    ],

    penjelasan: [
      { judul: 'Seluruh cerita program dalam satu baris',
        isi: [
          'Baris 80 berbunyi <code>GOSUB 90:GOSUB 140:GOSUB 40:GOSUB 90:' +
          'GOSUB 350:RUN"menu</code>. Enam pernyataan berderet, dan kalau ' +
          'dibaca sebagai kalimat ia adalah daftar isi programnya: gambar, ' +
          'jelaskan, tunggu, bersihkan, tanya, pulang.',
          'Pola ini masih hidup dan bagus: <b>satu tempat yang membaca seperti ' +
          'ringkasan</b>, dan semua detailnya di tempat lain. Kalau Anda bisa ' +
          'menulis fungsi utama yang seluruhnya muat dalam beberapa baris ' +
          'panggilan bernama jelas, pembaca berikutnya akan berterima kasih.',
          'Di peta alur di samping, baris 80 adalah kotak yang punya paling ' +
          'banyak panah keluar-masuk. Perhatikan penunjuk penelusuran: ia ' +
          '<b>kembali ke baris 80 lima kali</b>, sekali untuk tiap subrutin ' +
          'yang pulang.'
        ] },
      { judul: 'Membuka berkas sebagai cara bertanya',
        isi: [
          'Baris 740 membuka <code>MENU.BAS</code> lalu langsung menutupnya. ' +
          'Isinya tidak pernah dibaca. Jadi apa gunanya?',
          'Itu <b>pertanyaan</b>: "apakah disket FriendlyWare ada di drive?" ' +
          'Kalau tidak ada, membukanya gagal, dan galatnya yang menjawab. ' +
          'Menguji keberadaan dengan <i>mencoba memakai</i>, bukan dengan ' +
          'bertanya lebih dulu.',
          'Pola ini masih dipakai hari ini, dan ada namanya: lebih mudah ' +
          'meminta maaf daripada meminta izin. Alasannya bukan gaya, tapi ' +
          'kebenaran: antara "apakah berkasnya ada?" dan "buka berkasnya" ' +
          'selalu ada jeda, dan dalam jeda itu berkasnya bisa hilang.'
        ] },
      { judul: 'Galat sebagai keadaan yang bisa diperbaiki',
        isi: [
          'Kebanyakan program pemula memperlakukan galat sebagai kematian: ' +
          'tampilkan pesan, berhenti. Program ini memperlakukannya sebagai ' +
          '<b>keadaan yang bisa diperbaiki manusia</b>.',
          'Baris 810 memberi dua pilihan. Tekan sembarang tombol berarti "sudah ' +
          'saya perbaiki, coba lagi" &mdash; dan <code>RESUME</code> mengulangi ' +
          'persis pernyataan yang tadi gagal. Tekan ESC berarti menyerah, dan ' +
          '<code>RESUME 820</code> keluar dengan rapi.',
          'Di penelusur ini gelung "coba lagi" itu tidak akan pernah berhasil, ' +
          'karena berkas <code>info.sys</code> memang hilang dari koleksi &mdash; ' +
          'tidak ada disket untuk dimasukkan. Tekan ESC untuk melihat jalan ' +
          'keluar yang dirancang program ini.'
        ] },
      { judul: 'Dua penulis dalam satu produk',
        isi: [
          'Bandingkan cara dua program menggambar kotak yang sama. INTRO.BAS: ' +
          '<code>PRINT CHR$(218) STRING$(42,196) CHR$(191)</code> &mdash; satu ' +
          'baris, sekali cetak. CHECK.BAS baris 100: gelung bersarang yang ' +
          'memindahkan kursor lalu mencetak satu karakter, <b>86 kali</b>.',
          'Hasilnya sama. Yang satu tahu <code>STRING$</code> ada, yang satu ' +
          'tidak. Membaca kode lama sering berarti membaca jejak beberapa orang ' +
          'dengan tingkat pengalaman berbeda &mdash; dan itu bukan alasan untuk ' +
          'mencela, melainkan pengingat bahwa "cara yang lebih baik" hanya ' +
          'lebih baik kalau Anda tahu cara itu ada.'
        ] }
    ],

    perintahAsli: 'run\\CHECK.bat',
    catatanAsli: 'Di DOSBox-X pun program ini berhenti di tempat yang sama: ' +
      'info.sys tidak ada di disket yang tersalin. Bedanya di sana pesan ' +
      '"Insert FriendlyWare Diskette #3" muncul dengan kedip yang sungguhan.',

    penyimpangan: [
      '<b><code>CHAIN"info.sys"</code> gagal karena berkasnya memang hilang ' +
      'dari koleksi ini</b> — bukan karena penelusurnya belum menulisnya. ' +
      'Isi buku ceknya ada di berkas terpisah yang tidak ikut tersalin. Yang ' +
      'terjadi sesudah itu (ERR 53 → penangan di 750 → pesan "Insert ' +
      'FriendlyWare Diskette #3") adalah jalur asli program, ditelusuri utuh.',

      '<b>Gelung <code>RESUME</code> di baris 810 memang tak berujung.</b> ' +
      'Menekan tombol selain ESC mengulangi CHAIN yang sama, yang gagal lagi. ' +
      'Di mesin aslinya gelung itu berhenti begitu pemakai memasukkan disket ' +
      'yang benar; di sini tidak ada disket untuk dimasukkan. Tekan ESC untuk ' +
      'keluar lewat baris 820, seperti yang dirancang program ini.',

      '<b><code>BEEP</code> tidak berbunyi</b> dan <b><code>COLOR 31,0</code> ' +
      'tidak berkedip.</b> Warna 31 berarti putih-terang + kedip (15 + 16); ' +
      'yang keluar putih terang saja. Kedip di halaman web mengganggu — ' +
      'alasan selera, dinyatakan sebagai selera.',

      '<b><code>OPEN</code> hanya menguji keberadaan berkas.</b> Program ini ' +
      'tidak pernah membaca isi berkas yang dibukanya; ia memakai OPEN sebagai ' +
      'pertanyaan "apakah disketnya ada?". Itulah yang ditiru, bukan lebih.',

      '<b>Jebakan F1-F10 dijemput di batas baris.</b> Di baris 100 yang ' +
      'menggambar 86 karakter dalam satu langkah, bedanya paling terasa.'
    ],

    /* Diringkas dari reviews/CHECK.md. */
    pelajaran: {
      ringkas: 'Enam puluh lima baris yang isinya hampir seluruhnya ' +
        'penjelasan dan penanganan galat — pekerjaan sesungguhnya ada di ' +
        'berkas lain yang dipanggil baris 720. Yang layak dipelajari justru ' +
        'kerangkanya: bagaimana sebuah program 1982 menghadapi disket yang ' +
        'salah tanpa membuat pemakainya panik.',
      pelajari: [
        ['Membuka berkas sebagai cara bertanya',
         '<code>OPEN "I",1,"MENU.BAS"</code> di baris 740 tidak membaca ' +
         'apa-apa. Ia menanyakan "apakah disket FriendlyWare ada di drive?" ' +
         'dan membiarkan galatnya yang menjawab. Menguji keberadaan dengan ' +
         'mencoba memakai, bukan dengan bertanya lebih dulu — pola yang ' +
         'masih dipakai sampai sekarang.'],
        ['<code>ERL</code> membedakan tempat gagalnya',
         'Baris 760 dan 770 memakai nomor baris tempat galat terjadi untuk ' +
         'memilih pesan yang tepat. Satu penangan, tiga pesan berbeda, ' +
         'tergantung dari mana galatnya datang.'],
        ['<code>RESUME</code> yang mengulangi, bukan yang melompati',
         'Baris 810 memberi pemakai pilihan: perbaiki lalu tekan tombol ' +
         '(RESUME mengulangi pernyataan yang gagal), atau menyerah dengan ESC ' +
         '(RESUME 820 keluar). Galat sebagai keadaan yang bisa diperbaiki, ' +
         'bukan sebagai kematian.'],
        ['Alur utama boleh muat dalam satu baris',
         'Baris 80 berisi seluruh cerita program: gambar, jelaskan, tunggu, ' +
         'bersihkan, tanya, kembali. Enam pernyataan yang terbaca seperti ' +
         'daftar isi.']
      ],
      hindari: [
        ['<code>ERROR 200</code> sebagai sandi antar-bagian',
         'Baris 730 memicu galat buatan untuk memberi tahu penangannya ' +
         '"disketnya salah". Jalan, tapi memakai jalur galat sebagai saluran ' +
         'pesan biasa membuat galat sungguhan dan pesan buatan tidak bisa ' +
         'dibedakan lagi.'],
        ['<code>ERX</code> yang tidak pernah bisa bernilai selain 0 di tempatnya diperiksa',
         'Baris 730 mengisi ERX=0 lalu langsung memeriksanya di baris yang ' +
         'sama. Cabang ELSE-nya hanya tercapai lewat RESUME dari penangan ' +
         'galat — logika yang benar, tapi tidak ada satu pun petunjuk di ' +
         'barisnya bahwa begitulah cara membacanya.'],
        ['86 kali LOCATE untuk satu garis',
         'Baris 100 menggambar sisi kotak satu karakter demi satu karakter. ' +
         'INTRO.BAS mengerjakan hal yang sama dengan satu <code>STRING$</code>. ' +
         'Dua penulis, satu produk.']
      ]
    }
  };
})(window);
