/* ===========================================================================
   TOWERS.js — porting minimalis TOWERS.BAS sebagai tabel baris.

   Program keempat, dan permainan yang pertama. Ia menagih tiga hal besar:

     1. Gelung FOR/NEXT yang MEMBENTANG BANYAK BARIS. Sampai program ketiga
        tiap gelung muat dalam satu baris, jadi satu langkah penelusuran
        menjalankan seluruh putarannya. Di sini FOR dan NEXT ada di baris
        berbeda (420/440, 500/520, 650/700, 1390/1420) dan penunjuknya harus
        benar-benar kembali ke atas.
     2. Larik. `TW(3,8)` adalah papan permainannya: tiga menara, delapan
        posisi. `RDK$()` dan `LDK$()` menyimpan gambar tiap ukuran cakram.
     3. READ/DATA. Sembilan pasang gambar cakram ditulis sebagai DATA di baris
        910-990 — di tempat yang TIDAK PERNAH dieksekusi, karena baris 900
        sudah RETURN lebih dulu. Itu sah: DATA dikumpulkan sebelum program
        jalan, bukan saat barisnya dilewati.

   Penyimpangan yang berlaku di seluruh berkas ini:

   - `DEFSTR Z` menyatakan variabel Z bertipe string. Di sini tidak perlu
     ditiru; JavaScript tidak punya deklarasi tipe per huruf awal.
   - `KEY OFF`, `SCREEN 0,0,0`, `WIDTH 80` tidak berbuat apa-apa.
   - Gelung tunda `FOR A=1 TO 2000:NEXT` di baris 630 muat dalam satu baris,
     jadi ia habis dalam satu langkah dan pesannya tidak sempat terbaca. Di
     mesin aslinya jeda itu sekitar satu detik.
   - `COLOR 31,0` berarti putih-terang BERKEDIP (15 + 16). Bintang penanda di
     baris 240 dan 360 memang seharusnya berkedip; di sini ia putih terang
     diam. Ini yang paling terasa hilang di program ini.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Gambar cakram, dari DATA baris 910-990. Tiap ukuran punya separuh kiri dan
     separuh kanan, masing-masing sembilan kolom; menara digambar dengan
     mencetak keduanya berdampingan. Karakter 220 adalah balok separuh-bawah. */
  function cakram(n) {
    var blok = '', i;
    for (i = 0; i < n; i++) blok += String.fromCharCode(220);
    var isi = '';
    for (i = 0; i < 9 - n; i++) isi += ' ';
    return [isi + blok, blok + isi];   /* [kanan, kiri] seperti RDK$, LDK$ */
  }

  var DATA_CAKRAM = [];
  (function () {
    for (var n = 0; n <= 8; n++) {
      var p = cakram(n);
      DATA_CAKRAM.push(p[0], p[1]);
    }
  })();

  /* Kolom layar tiap menara, dipakai baris 380-400 dan 670-680. */
  var KOLOM_MENARA = [16, 40, 64];

  var tabel = [

    /* 1-2 komentar. Baris yang tidak berbuat apa-apa tetap punya entri, supaya
       cakupannya jujur dan nomor barisnya tetap bisa disorot. */
    { baris: 1, jalan: function () { /* 'last update 9/1/82 10:00 am */ } },
    { baris: 2, jalan: function () { /* ' */ } },

    /* 10 DEFSTR Z:SCREEN 0,0,0:COLOR 3,0,0:WIDTH 80:LOCATE ,,0 */
    { baris: 10, jalan: function (m) {
        m.warna(3, 0);
        m.locate(null, null, 0);
      } },

    /* 20 KEY OFF:ON KEY (10) GOSUB 1300 */
    { baris: 20, jalan: function (m) { m.pasangJebakan(10, 1300); } },

    /* 120 FOR A=1 TO 9:ON KEY(A) GOSUB 880:KEY(A) ON:NEXT
       Sembilan jebakan mandul lagi — baris 880 isinya RETURN. Pola yang sama
       dengan MENU.BAS dan CHECK.BAS. */
    { baris: 120, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 9; m.v.A++) {
          m.pasangJebakan(m.v.A, 880);
          m.jebakan(m.v.A, true);
        }
      } },

    /* 130 GOSUB 1000:GOSUB 890:XLIN=1:YPOS=1:GOSUB 1350
       Tiga pekerjaan dalam satu baris, dua di antaranya meninggalkan baris —
       jadi baris ini berbagian. */
    { baris: 130, bagian: [
        function (m) { m.gosub(1000); },   /* judul + tawaran petunjuk   */
        function (m) { m.gosub(890); },    /* isi larik cakram dari DATA */
        function (m) { m.v.XLIN = 1; m.v.YPOS = 1; },
        function (m) { m.gosub(1350); }    /* baris bantuan F10          */
      ] },

    /* 140 TRYS=-1:FIRSTTIME=0
       TRYS mulai dari -1 karena baris 160 menaikkannya sebelum langkah
       pertama benar-benar terjadi. Perhitungan mundur satu supaya angkanya
       benar — trik yang sah, tapi tidak ada petunjuknya di baris ini. */
    { baris: 140, jalan: function (m) { m.v.TRYS = -1; m.v.FIRSTTIME = 0; } },

    /* 150 GOSUB 720 — gambar papan permainan. */
    { baris: 150, jalan: function (m) { m.gosub(720); } },

    /* 160 TRYS=TRYS+1 — pintu masuk gelung utama. */
    { baris: 160, jalan: function (m) { m.v.TRYS++; } },

    { baris: 170, jalan: function (m) { m.warna(7, 0); } },

    /* 180 GOSUB 1380 — periksa apakah permainannya sudah selesai. */
    { baris: 180, jalan: function (m) { m.gosub(1380); } },

    { baris: 190, jalan: function (m) {
        m.locate(4, 22);
        m.cetak('Position Flashing Star Above Target Disk        ');
        m.barisBaru();
      } },
    { baris: 200, jalan: function (m) {
        m.locate(5, 22);
        m.cetak('          Then Strike Enter Key                 ');
        m.barisBaru();
      } },
    { baris: 210, jalan: function (m) { m.warna(2, 0); } },

    /* 220 LOCATE 7,30:PRINT"Number Of Moves So Far"TRYS:IF TRYS THEN 270
       PRINT angka di BASIC selalu menyisipkan spasi di depannya (tempat tanda
       minus) dan satu di belakangnya. Itu sebabnya tidak ada spasi sebelum
       tanda kutip penutup. */
    { baris: 220, jalan: function (m) {
        m.locate(7, 30);
        m.cetak('Number Of Moves So Far' + angka(m.v.TRYS));
        m.barisBaru();
        if (m.v.TRYS) m.lompat(270);
      } },

    /* 230 IF FIRSTTIME THEN 270 */
    { baris: 230, jalan: function (m) { if (m.v.FIRSTTIME) m.lompat(270); } },

    /* 240 gambar bintang penanda pertama kali, di menara tengah. */
    { baris: 240, jalan: function (m) {
        m.locate(14, 16);
        m.warna(31, 0); m.cetak('**');
        m.warna(3, 0);
      } },
    { baris: 250, jalan: function (m) { m.v.FIRSTTIME = 1; } },

    /* 260 XPOS=POS(0)-2:NPOS=XPOS
       Posisi bintang dibaca KEMBALI DARI LAYAR: POS(0) adalah kolom kursor
       sesudah mencetak "**", dikurangi dua untuk mendapat kolom awalnya.
       Layar dipakai sebagai penyimpan keadaan. */
    { baris: 260, jalan: function (m) {
        m.v.XPOS = m.pos() - 2;
        m.v.NPOS = m.v.XPOS;
      } },

    /* 270 DEF SEG:POKE 106,0:IF INKEY$<>"" THEN 270 */
    { baris: 270, jalan: function (m) {
        m.kosongkanPenyangga();
        if (m.inkey() !== '') m.lompat(270);
      } },

    /* 280 Z=INKEY$:IF Z="" THEN 280 */
    { baris: 280, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(280);
      } },

    /* 290-300 panah kiri/kanan, atau angka 4/6 di papan angka.
       Tombol panah datang sebagai DUA karakter: CHR$(0) lalu kode pindai.
       RIGHT$(Z,1) mengambil kode pindainya. 75 = kiri, 77 = kanan. */
    { baris: 290, jalan: function (m) {
        if (kanan1(m.v.Z) === m.chr(75) || m.v.Z === '4') {
          m.v.NPOS = m.v.XPOS - 24;
          m.lompat(330);
        }
      } },
    { baris: 300, jalan: function (m) {
        if (kanan1(m.v.Z) === m.chr(77) || m.v.Z === '6') {
          m.v.NPOS = m.v.XPOS + 24;
          m.lompat(330);
        }
      } },
    /* 310 IF Z=CHR$(13) THEN 380 — Enter. */
    { baris: 310, jalan: function (m) { if (m.v.Z === m.chr(13)) m.lompat(380); } },
    { baris: 320, jalan: function (m) { m.lompat(280); } },

    /* 330-340 kurung di tepi: bintang tidak boleh keluar dari tiga menara. */
    { baris: 330, jalan: function (m) { if (m.v.NPOS < 16) m.v.NPOS = 16; } },
    { baris: 340, jalan: function (m) { if (m.v.NPOS > 64) m.v.NPOS = 64; } },

    /* 350 hapus bintang lama, 360 gambar yang baru. */
    { baris: 350, jalan: function (m) {
        m.locate(14, m.v.XPOS);
        m.cetak('  ');
      } },
    { baris: 360, jalan: function (m) {
        m.locate(14, m.v.NPOS);
        m.warna(31, 0); m.cetak('**');
        m.warna(3, 0);
      } },
    { baris: 370, jalan: function (m) { m.lompat(260); } },

    /* 380-400 kolom layar diterjemahkan jadi nomor menara. */
    { baris: 380, jalan: function (m) { if (m.v.NPOS === 16) m.v.PL = 1; } },
    { baris: 390, jalan: function (m) { if (m.v.NPOS === 40) m.v.PL = 2; } },
    { baris: 400, jalan: function (m) { if (m.v.NPOS === 64) m.v.PL = 3; } },

    /* 410 IF HOLD THEN 500
       SATU baris yang membelah seluruh antarmuka jadi dua arti. Kalau HOLD
       kosong, Enter berarti "ambil cakram dari menara ini"; kalau berisi,
       Enter yang sama berarti "taruh cakram di sini". Lihat diagram keadaan
       di halaman. */
    { baris: 410, jalan: function (m) { if (m.v.HOLD) m.lompat(500); } },

    /* 420 FOR DK=1 TO 8 — gelung pertama yang MEMBENTANG BANYAK BARIS.
       Mencari cakram teratas di menara PL, dari atas ke bawah. */
    { baris: 420, jalan: function (m) { m.untuk('DK', 1, 8, 1, 450); } },

    /* 430 IF TW(PL,DK) THEN HOLD=TW(PL,DK):HOLD1=PL:HOLD2=DK:GOTO 460
       Perhatikan GOTO 460 keluar dari gelung tanpa pernah sampai ke NEXT.
       Bingkai gelungnya menggantung — dan tidak apa-apa, karena FOR berikutnya
       dengan nama DK yang sama membuangnya. */
    { baris: 430, jalan: function (m) {
        if (m.v.TW[m.v.PL][m.v.DK]) {
          m.v.HOLD = m.v.TW[m.v.PL][m.v.DK];
          m.v.HOLD1 = m.v.PL;
          m.v.HOLD2 = m.v.DK;
          m.lompat(460);
        }
      } },
    { baris: 440, jalan: function (m) { m.lanjutkan('DK'); } },

    /* 450 GOTO 610 — menaranya kosong, langkahnya tidak sah. */
    { baris: 450, jalan: function (m) { m.lompat(610); } },

    /* 460-480 ganti pesannya: sekarang pemakai sedang memegang cakram. */
    { baris: 460, jalan: function (m) { m.warna(14, 0); } },
    { baris: 470, jalan: function (m) {
        m.locate(4, 22);
        m.cetak('Position Flashing Star Above Target Tower');
        m.barisBaru();
      } },
    { baris: 480, jalan: function (m) {
        m.locate(5, 22);
        m.cetak('          Then Strike Enter Key          ');
        m.barisBaru();
      } },
    { baris: 490, jalan: function (m) { m.lompat(320); } },

    /* 500 FOR DK=1 TO 8 — gelung kedua: cari posisi teratas yang terisi di
       menara tujuan, untuk tahu di mana cakram baru boleh mendarat. */
    { baris: 500, jalan: function (m) { m.untuk('DK', 1, 8, 1, 530); } },
    { baris: 510, jalan: function (m) { if (m.v.TW[m.v.PL][m.v.DK]) m.lompat(540); } },
    { baris: 520, jalan: function (m) { m.lanjutkan('DK'); } },
    /* 530 GOTO 560 — menaranya kosong, cakram mendarat di dasar. */
    { baris: 530, jalan: function (m) { m.lompat(560); } },

    /* 540 IF TW(PL,DK)>HOLD THEN TW(PL,DK-1)=HOLD:GOTO 570
       Inti aturan permainannya, dan seluruhnya satu perbandingan: cakram yang
       dipegang hanya boleh mendarat di atas cakram yang LEBIH BESAR. */
    { baris: 540, jalan: function (m) {
        if (m.v.TW[m.v.PL][m.v.DK] > m.v.HOLD) {
          m.v.TW[m.v.PL][m.v.DK - 1] = m.v.HOLD;
          m.lompat(570);
        }
      } },
    { baris: 550, jalan: function (m) { m.lompat(610); } },
    /* 560 TW(PL,DK-1)=HOLD — DK di sini bernilai 9, sisa dari gelung yang
       habis, jadi cakramnya mendarat di posisi 8: dasar menara. */
    { baris: 560, jalan: function (m) {
        m.v.TW[m.v.PL][m.v.DK - 1] = m.v.HOLD;
      } },

    /* 570 HOLD=0:TW(HOLD1,HOLD2)=0 — lepaskan, dan kosongkan tempat asalnya. */
    { baris: 570, jalan: function (m) {
        m.v.HOLD = 0;
        m.v.TW[m.v.HOLD1][m.v.HOLD2] = 0;
      } },
    { baris: 580, jalan: function (m) { m.locate(24, 1); m.spc(79); } },
    { baris: 590, jalan: function (m) { m.gosub(640); } },
    { baris: 600, jalan: function (m) { m.lompat(160); } },

    /* 610-630 langkah tidak sah. */
    { baris: 610, jalan: function (m) {
        m.locate(24, 1); m.spc(79);
        m.locate(24, 25); m.warna(15, 0);
      } },
    { baris: 620, jalan: function (m) {
        m.cetak('Invalid Move. Please Try Again.');
        m.v.HOLD = 0;
      } },
    /* 630 FOR A=1 TO 2000:NEXT — jeda sekitar satu detik di mesin aslinya.
       Di sini gelungnya muat dalam satu baris, jadi habis seketika dan
       pesannya terhapus sebelum sempat terbaca. */
    { baris: 630, jalan: function (m) {
        for (m.v.A = 1; m.v.A <= 2000; m.v.A++) { /* jeda */ }
        m.locate(24, 1); m.spc(79);
        m.lompat(170);
      } },

    /* 640-710 gambar ulang ketiga menara. Dua gelung bersarang yang keduanya
       membentang banyak baris. */
    { baris: 640, jalan: function (m) { m.warna(12, 0); } },
    { baris: 650, jalan: function (m) { m.untuk('A', 1, 3, 1, 710); } },
    { baris: 660, jalan: function (m) { m.untuk('B', 1, 8, 1, 700); } },
    { baris: 670, jalan: function (m) {
        m.locate(m.v.B + 14, (m.v.A - 1) * 24 + 7);
        m.cetak(m.v['RDK$'][m.v.TW[m.v.A][m.v.B]]);
      } },
    { baris: 680, jalan: function (m) {
        m.locate(m.v.B + 14, (m.v.A - 1) * 24 + 18);
        m.cetak(m.v['LDK$'][m.v.TW[m.v.A][m.v.B]]);
      } },
    { baris: 690, jalan: function (m) { m.lanjutkan('B'); } },
    { baris: 700, jalan: function (m) { m.lanjutkan('A'); } },
    { baris: 710, jalan: function (m) { m.warna(3, 0); m.kembali(); } },

    /* 720 komentar penanda subrutin. */
    { baris: 720, jalan: function () { /* *** DISPLAY FIRST STACK OF DKS *** */ } },

    /* 730-790 gambar tumpukan awal di menara tengah, dari bawah ke atas. */
    { baris: 730, jalan: function (m) { m.v.B = 9; m.warna(12, 0); } },
    { baris: 740, jalan: function (m) { m.untuk('A', 22, 14, -1, 800); } },
    { baris: 750, jalan: function (m) { m.v.B = m.v.B - 1; } },
    { baris: 760, jalan: function () { /* *** 7,31,55 */ } },
    { baris: 770, jalan: function (m) {
        m.locate(m.v.A, 31);
        m.cetak(m.v['RDK$'][m.v.TW[2][m.v.B]]);
      } },
    /* 780 LOCATE A,POS(0)+2 — kolomnya dihitung dari posisi kursor sekarang,
       bukan dari angka tetap. Layar lagi-lagi dipakai sebagai penyimpan. */
    { baris: 780, jalan: function (m) {
        m.locate(m.v.A, m.pos() + 2);
        m.cetak(m.v['LDK$'][m.v.TW[2][m.v.B]]);
        m.barisBaru();
      } },
    { baris: 790, jalan: function (m) { m.lanjutkan(); } },

    /* 800-820 alas berpola dan tiga tiang menara. */
    { baris: 800, jalan: function (m) { m.warna(2, 0); } },
    { baris: 810, jalan: function (m) {
        m.locate(23, 5);
        m.cetak(m.ulang(72, 177));
        m.barisBaru();
      } },
    { baris: 820, jalan: function (m) { m.warna(3, 0); } },
    { baris: 830, jalan: function (m) { m.untuk('A', 22, 15, -1, 880); } },
    { baris: 840, jalan: function (m) { tiang(m, 16); } },
    { baris: 850, jalan: function (m) { tiang(m, 40); } },
    { baris: 860, jalan: function (m) { tiang(m, 64); } },
    { baris: 870, jalan: function (m) { m.lanjutkan(); } },

    /* 880 RETURN — penutup subrutin 720-870 SEKALIGUS badan jebakan F1-F9. */
    { baris: 880, jalan: function (m) { m.kembali(); } },

    /* 890 FOR A=0 TO 8:TW(2,A)=A:READ RDK$(A),LDK$(A):NEXT
       Satu baris yang mengerjakan dua hal sekaligus: menumpuk delapan cakram
       di menara tengah, DAN membaca gambar tiap ukuran dari DATA. Karena
       muat dalam satu baris, ia habis dalam satu langkah. */
    { baris: 890, jalan: function (m) {
        m.dim('TW', 3, 8);
        m.dim('RDK$', 8);
        m.dim('LDK$', 8);
        for (m.v.A = 0; m.v.A <= 8; m.v.A++) {
          m.v.TW[2][m.v.A] = m.v.A;
          m.v['RDK$'][m.v.A] = m.baca();
          m.v['LDK$'][m.v.A] = m.baca();
        }
      } },
    { baris: 900, jalan: function (m) { m.kembali(); } },

    /* 910-990 DATA. Sembilan pasang gambar cakram, di tempat yang TIDAK
       PERNAH dieksekusi — baris 900 sudah RETURN lebih dulu. Itu sah, karena
       DATA dikumpulkan sebelum program jalan. */
    { baris: 910, jalan: function () { /* DATA: cakram ukuran 0 */ } },
    { baris: 920, jalan: function () { /* DATA: cakram ukuran 1 */ } },
    { baris: 930, jalan: function () { /* DATA: cakram ukuran 2 */ } },
    { baris: 940, jalan: function () { /* DATA: cakram ukuran 3 */ } },
    { baris: 950, jalan: function () { /* DATA: cakram ukuran 4 */ } },
    { baris: 960, jalan: function () { /* DATA: cakram ukuran 5 */ } },
    { baris: 970, jalan: function () { /* DATA: cakram ukuran 6 */ } },
    { baris: 980, jalan: function () { /* DATA: cakram ukuran 7 */ } },
    { baris: 990, jalan: function () { /* DATA: cakram ukuran 8 */ } },

    /* 1000-1290 layar judul dan petunjuk. */
    { baris: 1000, jalan: function (m) { m.cls(); m.warna(6, 0); } },
    { baris: 1010, jalan: function (m) {
        m.locate(1, 1);
        m.cetak(m.ulang(80, 219));
        m.barisBaru();
      } },
    { baris: 1020, jalan: function (m) {
        for (m.v.A = 2; m.v.A <= 22; m.v.A++) {
          m.locate(m.v.A, 1);  m.cetak(m.chr(219)); m.barisBaru();
          m.locate(m.v.A, 80); m.cetak(m.chr(219)); m.barisBaru();
        }
      } },
    { baris: 1030, jalan: function (m) {
        m.locate(23, 1);
        m.cetak(m.ulang(80, 219));
      } },
    { baris: 1040, jalan: function (m) {
        m.locate(3, 24); m.warna(11, 0);
        m.cetak('T O W E R S   O F   A T L A N T I S'); m.barisBaru();
      } },
    { baris: 1050, jalan: function (m) {
        m.warna(15, 0);
        m.locate(8, 25);
        m.cetak('Would You Like Instructions? <Y/N>'); m.barisBaru();
      } },
    { baris: 1060, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1060);
      } },
    { baris: 1070, jalan: function (m) {
        if (m.v.Z === 'N' || m.v.Z === 'n') { m.cls(); m.kembali(); }
      } },
    { baris: 1080, jalan: function (m) {
        if (m.v.Z !== 'Y' && m.v.Z !== 'y') m.lompat(1060);
      } },

    baris_petunjuk(1090,  7, '           The game screen for Towers of Atlantis'),
    baris_petunjuk(1100,  8, '           contains three towers.   By moving one'),
    baris_petunjuk(1110,  9, '           Disk at a time,  and  never  placing a'),
    baris_petunjuk(1120, 10, '           larger disk on a smaller one, move all'),
    baris_petunjuk(1130, 11, '           disks to either of the outside towers.'),
    baris_petunjuk(1150, 12, '           This may take all of two hundred fifty-'),
    baris_petunjuk(1200, 13, '           three moves.'),

    { baris: 1280, jalan: function (m) {
        m.locate(25, 27); m.warna(15, 0);
        m.cetak('Strike Any Key To Continue');
      } },
    /* 1290 IF Z="" THEN 1290 ELSE CLS:RETURN */
    { baris: 1290, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1290);
        else { m.cls(); m.kembali(); }
      } },

    /* 1300-1370 penangan F10: tanya dulu sebelum keluar.
       Baris 1300 menyimpan posisi kursor supaya bisa dikembalikan persis di
       baris 1360 — kalau pemakai membatalkan, tidak ada jejak yang tersisa. */
    { baris: 1300, bagian: [
        function (m) {
          m.jebakan(10, false);
          m.v.XLIN = m.barisKursor();
          m.v.YPOS = m.pos();
          m.locate(25, 1); m.spc(79);
        }
      ] },
    { baris: 1310, jalan: function (m) {
        m.warna(15, 0);
        m.locate(25, 24);
        m.cetak('Do You Wish To Leave This Game? <Y/N>');
        m.warna(3, 0);
      } },
    { baris: 1320, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1320);
      } },
    { baris: 1330, jalan: function (m) {
        if (m.v.Z === 'y' || m.v.Z === 'Y') m.jalankan('menu');
      } },
    { baris: 1340, jalan: function (m) {
        if (m.v.Z !== 'n' && m.v.Z !== 'N') m.lompat(1320);
      } },
    { baris: 1350, jalan: function (m) {
        m.locate(25, 1); m.spc(79);
        m.locate(25, 25); m.warna(0, 7);
      } },
    { baris: 1360, jalan: function (m) {
        m.cetak(' Strike <F10> to leave this game ');
        m.warna(7, 0);
        m.locate(m.v.XLIN, m.v.YPOS, 0);
      } },
    { baris: 1370, jalan: function (m) { m.jebakan(10, true); m.kembali(); } },

    /* 1380-1440 periksa kemenangan: hitung isi menara kiri dan kanan. */
    { baris: 1380, jalan: function (m) { m.v.CT1 = 0; m.v.CT2 = 0; } },
    { baris: 1390, jalan: function (m) { m.untuk('LP', 1, 8, 1, 1430); } },
    { baris: 1400, jalan: function (m) { if (m.v.TW[1][m.v.LP]) m.v.CT1++; } },
    { baris: 1410, jalan: function (m) { if (m.v.TW[3][m.v.LP]) m.v.CT2++; } },
    { baris: 1420, jalan: function (m) { m.lanjutkan('LP'); } },
    { baris: 1430, jalan: function (m) {
        if (m.v.CT1 === 8 || m.v.CT2 === 8) m.lompat(1450);
      } },
    { baris: 1440, jalan: function (m) { m.kembali(); } },

    /* 1450-1500 layar menang. */
    { baris: 1450, jalan: function (m) {
        m.locate(10, 23);
        m.cetak('     You Made It In' + angka(m.v.TRYS) + 'Moves');
        m.barisBaru();
      } },
    { baris: 1460, jalan: function (m) {
        m.locate(11, 23);
        m.cetak('Would You Like To Play Again? <Y/N>');
      } },
    { baris: 1470, jalan: function (m) {
        m.v.Z = m.inkey();
        if (m.v.Z === '') m.lompat(1470);
      } },
    /* 1480 IF Z="Y" THEN RUN — RUN tanpa nama berkas: jalankan ulang program
       ini dari awal, dengan seluruh variabel dikosongkan. */
    { baris: 1480, jalan: function (m) {
        if (m.v.Z === 'Y' || m.v.Z === 'y') m.jalankan();
      } },
    { baris: 1490, jalan: function (m) {
        if (m.v.Z !== 'N' && m.v.Z !== 'n') m.lompat(1470);
      } },
    { baris: 1500, jalan: function (m) { m.jalankan('menu'); } }
  ];

  /* --- pembantu ------------------------------------------------------------ */

  /* PRINT sebuah angka di BASIC selalu memberinya bantalan: satu spasi di
     depan (tempat tanda minus) dan satu di belakang. Tanpa ini, tulisan di
     baris 220 dan 1450 rapat dan salah kolomnya. */
  function angka(n) {
    return (n < 0 ? '' : ' ') + String(n) + ' ';
  }

  /* RIGHT$(Z,1) — karakter terakhir. Untuk tombol panah, itulah kode
     pindainya; untuk tombol biasa, itu tombolnya sendiri. */
  function kanan1(s) { return s ? s.charAt(s.length - 1) : ''; }

  function tiang(m, kolom) {
    m.locate(m.v.A, kolom);
    m.cetak(m.chr(222) + m.chr(221));
    m.barisBaru();
  }

  function baris_petunjuk(nomor, baris, teks) {
    return { baris: nomor, jalan: function (m) {
      m.locate(baris, 10);
      m.cetak(teks);
      m.barisBaru();
    } };
  }

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['TOWERS'] = {
    nama: 'TOWERS',
    judul: 'Towers Of Atlantis',
    sumber: 'TOWERS',
    berkas: 'run/TOWERS.BAS',
    tabel: tabel,
    data: DATA_CAKRAM,

    arsitektur: {
      judul: 'Alur TOWERS.BAS',
      simpul: [
        { id: 'siap', baris: '10-130', jenis: 'mulai',
          teks: ['Pasang jebakan F1-F10,', 'tawarkan petunjuk, isi larik cakram'] },
        { id: 'papan', baris: '140-150', jenis: 'subrutin',
          teks: ['Gambar papan: 8 cakram', 'menumpuk di menara tengah'] },
        { id: 'menang', baris: '160-180', jenis: 'putusan',
          teks: ['Naikkan cacah langkah,', 'sudah menang?'] },
        { id: 'bintang', baris: '190-260',
          teks: ['Tulis petunjuk,', 'gambar bintang penanda'] },
        { id: 'tombol', baris: '270-320', jenis: 'putusan',
          teks: ['Tunggu tombol:', 'panah, atau Enter?'] },
        { id: 'geser', baris: '330-370',
          teks: ['Geser bintang ke menara', 'sebelah, jaga di dalam tepi'] },
        { id: 'menara', baris: '380-410', jenis: 'putusan',
          teks: ['Enter: menara mana?', 'Sedang memegang cakram?'] },
        { id: 'ambil', baris: '420-490',
          teks: ['Cari cakram teratas,', 'angkat ke tangan'] },
        { id: 'taruh', baris: '500-560', jenis: 'putusan',
          teks: ['Boleh mendarat di sini?', '(harus di atas yang lebih besar)'] },
        { id: 'jadi', baris: '570-600',
          teks: ['Pindahkan, gambar ulang', 'ketiga menara'] },
        { id: 'tolak', baris: '610-630', jenis: 'galat',
          teks: ['"Invalid Move"', 'lepaskan cakram, ulangi'] },
        { id: 'selesai', baris: '1450-1500', jenis: 'keluar',
          teks: ['Menang: main lagi,', 'atau kembali ke menu'] }
      ],
      panah: [
        { dari: 'siap',    ke: 'papan' },
        { dari: 'papan',   ke: 'menang' },
        { dari: 'menang',  ke: 'bintang', label: 'belum' },
        { dari: 'bintang', ke: 'tombol' },
        { dari: 'tombol',  ke: 'geser',  label: 'panah' },
        { dari: 'geser',   ke: 'bintang', label: 'GOTO 260' },
        { dari: 'tombol',  ke: 'menara', label: 'Enter' },
        { dari: 'menara',  ke: 'ambil',  label: 'tangan kosong' },
        { dari: 'ambil',   ke: 'tombol', label: 'GOTO 320' },
        { dari: 'menara',  ke: 'taruh',  label: 'memegang' },
        { dari: 'taruh',   ke: 'jadi',   label: 'sah' },
        { dari: 'taruh',   ke: 'tolak',  label: 'tidak sah', jenis: 'galat' },
        { dari: 'tolak',   ke: 'bintang', label: 'GOTO 170', jenis: 'galat' },
        { dari: 'jadi',    ke: 'menang', label: 'GOTO 160' },
        { dari: 'menang',  ke: 'selesai', label: 'satu menara penuh' }
      ]
    },

    /* Diagram kedua. Flowchart di atas memperlihatkan ke mana alurnya pergi;
       yang ini memperlihatkan kenapa satu tombol yang sama bisa berarti dua
       hal berbeda. Keduanya perlu — tidak ada yang menggantikan. */
    diagramLain: [
      {
        jenis: 'keadaan',
        judul: 'Keadaan tangan pemain',
        keterangan: 'Satu variabel, <code>HOLD</code>, menentukan arti seluruh ' +
          'antarmukanya. Tombol Enter yang sama berarti "ambil" atau "taruh" ' +
          'tergantung keadaan ini — dan itu tidak terlihat sama sekali di peta alur.',
        simpul: [
          { id: 'kosong', baris: '410', jenis: 'mulai',
            teks: ['Tangan kosong', 'HOLD = 0'] },
          { id: 'pegang', baris: '430-490', jenis: 'keadaan',
            teks: ['Sedang memegang cakram', 'HOLD = ukuran cakramnya'] }
        ],
        panah: [
          { dari: 'kosong', ke: 'pegang', label: 'angkat cakram (430)' },
          { dari: 'pegang', ke: 'kosong', label: 'cakram mendarat (570)' },
          { dari: 'pegang', ke: 'kosong', label: 'langkah ditolak (620)',
            jenis: 'galat' },
          { dari: 'kosong', ke: 'kosong', label: 'menara kosong (450)' }
        ]
      }
    ],

    pseudokode: [
      { baris: 10,  tingkat: 0, teks: 'siapkan layar, pasang jebakan F1&ndash;F10' },
      { baris: 130, tingkat: 0, teks: 'tampilkan judul, tawarkan petunjuk, isi larik gambar cakram' },
      { baris: 140, tingkat: 0, teks: 'cacah langkah = &minus;1 <span class="t-pseudo__ket">(baris 160 menaikkannya sebelum langkah pertama)</span>' },
      { baris: 150, tingkat: 0, teks: 'gambar papan: 8 cakram menumpuk di menara tengah' },
      { baris: 160, tingkat: 0, teks: '<b>ULANG selamanya:</b>' },
      { baris: 160, tingkat: 1, teks: 'cacah langkah = cacah langkah + 1' },
      { baris: 180, tingkat: 1, teks: 'kalau menara kiri ATAU kanan sudah berisi 8 cakram: <b>menang</b>' },
      { baris: 190, tingkat: 1, teks: 'tulis petunjuk dan jumlah langkah' },
      { baris: 240, tingkat: 1, teks: 'gambar bintang berkedip di atas menara yang sedang dipilih' },
      { baris: 260, tingkat: 1, teks: 'baca posisi bintang <b>dari layar</b>, bukan dari variabel' },
      { baris: 280, tingkat: 1, teks: 'tunggu tombol:' },
      { baris: 290, tingkat: 2, teks: 'panah kiri &rarr; geser bintang 24 kolom ke kiri' },
      { baris: 300, tingkat: 2, teks: 'panah kanan &rarr; geser 24 kolom ke kanan' },
      { baris: 330, tingkat: 2, teks: 'jaga bintang tetap di antara kolom 16 dan 64' },
      { baris: 350, tingkat: 2, teks: 'hapus bintang lama, gambar di tempat baru, ulangi' },
      { baris: 310, tingkat: 2, teks: 'Enter &rarr; lanjut ke bawah' },
      { baris: 380, tingkat: 1, teks: 'terjemahkan kolom bintang jadi nomor menara (1, 2, atau 3)' },
      { baris: 410, tingkat: 1, teks: '<b>KALAU TANGAN KOSONG</b> &mdash; ini langkah "ambil":' },
      { baris: 420, tingkat: 2, teks: 'telusuri menara dari atas, cari cakram pertama yang ada' },
      { baris: 430, tingkat: 3, teks: 'ketemu &rarr; angkat ke tangan, ingat asalnya, ganti pesan' },
      { baris: 450, tingkat: 3, teks: 'tidak ada &rarr; menaranya kosong, langkah tidak sah' },
      { baris: 500, tingkat: 1, teks: '<b>KALAU SEDANG MEMEGANG</b> &mdash; ini langkah "taruh":' },
      { baris: 500, tingkat: 2, teks: 'telusuri menara tujuan dari atas, cari cakram pertama' },
      { baris: 540, tingkat: 3, teks: 'ketemu dan <b>lebih besar</b> &rarr; taruh di atasnya' },
      { baris: 550, tingkat: 3, teks: 'ketemu dan lebih kecil &rarr; <b>tidak sah</b>' },
      { baris: 560, tingkat: 3, teks: 'tidak ada &rarr; menara kosong, taruh di dasar' },
      { baris: 570, tingkat: 2, teks: 'kosongkan tangan dan tempat asalnya, gambar ulang ketiga menara' },
      { baris: 610, tingkat: 1, teks: '<b>LANGKAH TIDAK SAH:</b> tulis "Invalid Move", tunggu, hapus' },
      { baris: 620, tingkat: 2, teks: 'lepaskan cakram yang dipegang &mdash; <b>kembali ke keadaan awal</b>' },
      { baris: 1450, tingkat: 0, teks: '<b>MENANG:</b> tampilkan jumlah langkah' },
      { baris: 1480, tingkat: 1, teks: 'Y &rarr; jalankan ulang program ini dari nol' },
      { baris: 1500, tingkat: 1, teks: 'N &rarr; kembali ke menu' }
    ],

    perintahAsli: 'run\\TOWERS.bat',
    catatanAsli: 'Di DOSBox-X, bintang penandanya benar-benar berkedip dan ' +
      'jeda satu detik sesudah "Invalid Move" benar-benar terasa. Keduanya ' +
      'hilang di penelusur ini — lihat daftar penyimpangan.',

    penyimpangan: [
      '<b>Bintang penanda tidak berkedip.</b> <code>COLOR 31,0</code> berarti ' +
      'putih-terang + kedip (15 + 16). Di layar aslinya kedip itulah yang ' +
      'membedakan penanda dari cakram; di sini ia putih terang diam. Ini ' +
      'penyimpangan yang paling terasa di program ini, dan alasannya selera: ' +
      'kedip di halaman web mengganggu.',

      '<b>Jeda satu detik sesudah "Invalid Move" habis seketika.</b> Baris 630 ' +
      'berbunyi <code>FOR A=1 TO 2000:NEXT</code> — gelung kosong yang gunanya ' +
      'cuma memakan waktu. Karena muat dalam satu baris, penelusur ' +
      'menjalankan kedua ribu putarannya dalam satu langkah, jadi pesannya ' +
      'terhapus sebelum sempat terbaca. Pasang titik henti di baris 630 untuk ' +
      'membacanya.',

      '<b>Gelung FOR diuji di NEXT, bukan di FOR.</b> GW-BASIC melompati badan ' +
      'gelung kalau rentangnya kosong sejak awal; penelusur ini menjalankannya ' +
      'sekali. Bedanya ditutup dengan menyebutkan baris tujuan pada tiap ' +
      '<code>m.untuk(...)</code>; kalau rentangnya kosong dan tujuannya belum ' +
      'disebutkan, penelusuran berhenti dan mengatakannya.',

      '<b>Tombol panah dikirim sebagai dua karakter</b> (<code>CHR$(0)</code> ' +
      'lalu kode pindai 75 atau 77), persis seperti BIOS aslinya — itulah ' +
      'sebabnya baris 290 memeriksanya dengan <code>RIGHT$(Z,1)</code>. ' +
      'Akibatnya panah kiri/kanan tidak lagi menggulung halaman selama ' +
      'penelusur terbuka.',

      '<b><code>DEFSTR Z</code> tidak ditiru.</b> Di BASIC ia menyatakan semua ' +
      'variabel berawalan Z bertipe teks. JavaScript tidak punya deklarasi ' +
      'tipe per huruf awal, dan tidak ada satu pun tempat di program ini yang ' +
      'perilakunya bergantung pada itu.'
    ],

    pelajaran: {
      ringkas: 'Menara Hanoi delapan cakram — permainan pertama di penelusur ' +
        'ini. Seratus tiga puluh satu baris, dan seluruh aturan mainnya muat ' +
        'dalam satu perbandingan di baris 540.',
      pelajari: [
        ['Satu perbandingan bisa jadi seluruh aturan main',
         'Baris 540: <code>IF TW(PL,DK)>HOLD THEN ...</code>. Itu saja. ' +
         '"Cakram besar tidak boleh di atas cakram kecil" — aturan yang butuh ' +
         'satu kalimat untuk dijelaskan dan satu baris untuk ditegakkan. ' +
         'Kalau aturan permainan Anda butuh lima puluh baris, kemungkinan ' +
         'besar Anda belum menemukan bentuk datanya yang tepat.'],
        ['Papan sebagai larik, tampilan sebagai turunan',
         '<code>TW(3,8)</code> adalah kebenaran; layar cuma gambarnya. Baris ' +
         '640-710 menggambar ulang ketiga menara dari larik itu, dan tidak ' +
         'pernah sebaliknya. Memisahkan "apa yang benar" dari "apa yang ' +
         'terlihat" adalah pemisahan paling berguna yang bisa Anda pelajari ' +
         'dari program permainan.'],
        ['Keadaan yang mengubah arti tombol',
         'Enter berarti "ambil" atau "taruh" tergantung <code>HOLD</code>. ' +
         'Satu variabel membelah seluruh antarmuka jadi dua mode. Lihat ' +
         'diagram keadaan di atas — bentuk itu tidak terlihat di peta alur.'],
        ['DATA boleh diletakkan di mana saja',
         'Baris 910-990 duduk di tempat yang tidak pernah dieksekusi, sesudah ' +
         '<code>RETURN</code> di baris 900. Tetap terbaca, karena DATA ' +
         'dikumpulkan sebelum program jalan. Ini nenek moyang berkas ' +
         'konfigurasi: data yang terpisah dari alur.']
      ],
      hindari: [
        ['Membaca keadaan kembali dari layar',
         'Baris 260 mengambil posisi bintang dari <code>POS(0)</code> — ' +
         'kolom kursor sesudah mencetak. Jalan, tapi berarti layar adalah ' +
         'satu-satunya tempat kebenaran itu disimpan. Satu <code>LOCATE</code> ' +
         'yang salah dan posisinya ikut salah, tanpa jejak. Simpan di ' +
         'variabel, gambar dari variabel.'],
        ['Nilai awal yang diperbaiki belakangan',
         'Baris 140 mengisi <code>TRYS=-1</code> supaya baris 160 boleh ' +
         'menaikkannya lebih dulu. Benar hasilnya, tapi tidak ada satu pun ' +
         'petunjuk di baris 140 bahwa &minus;1 itu disengaja. Enam bulan ' +
         'kemudian, yang membacanya akan mengira itu cacat.'],
        ['GOTO yang melompat keluar dari gelung',
         'Baris 430 keluar dari gelung <code>FOR DK</code> tanpa pernah ' +
         'sampai ke <code>NEXT</code>, meninggalkan bingkai gelung ' +
         'menggantung. Di GW-BASIC itu tidak berakibat karena FOR berikutnya ' +
         'dengan nama sama membuangnya — tapi Anda harus tahu aturan itu ' +
         'untuk berani menulisnya.']
      ]
    },

    penjelasan: [
      { judul: 'Bagaimana papan disimpan',
        isi: [
          '<code>TW(3,8)</code> adalah larik dua dimensi: <b>tiga menara, ' +
          'delapan posisi</b>. <code>TW(2,5)</code> berarti "apa yang ada di ' +
          'menara 2, posisi 5". Isinya angka 1 sampai 8 yang menyatakan ' +
          '<i>ukuran</i> cakram di situ, atau 0 kalau kosong.',
          'Posisi 1 adalah puncak, posisi 8 adalah dasar. Itu sebabnya baris ' +
          '420 mencari cakram teratas dengan menelusuri dari 1 ke atas: yang ' +
          'pertama ditemukan adalah yang paling atas.',
          'Perhatikan apa yang <b>tidak</b> disimpan: tinggi tumpukan, jumlah ' +
          'cakram per menara, cakram mana yang di atas mana. Semuanya bisa ' +
          'dihitung dari larik yang sama. Menyimpan hal yang bisa dihitung ' +
          'adalah cara paling umum membuat dua sumber kebenaran yang ' +
          'kemudian tidak cocok.'
        ] },
      { judul: 'Satu tombol, dua arti',
        isi: [
          'Tekan Enter di atas sebuah menara. Apa yang terjadi? Tergantung.',
          'Kalau tangan Anda kosong (<code>HOLD = 0</code>), Enter berarti ' +
          '<b>ambil cakram teratas dari menara ini</b>. Kalau Anda sedang ' +
          'memegang cakram, Enter yang sama berarti <b>taruh cakram di menara ' +
          'ini</b>.',
          'Seluruh pembelahan itu ada di satu baris: <code>410 IF HOLD THEN ' +
          '500</code>. Sebelum baris itu, kedua mode berbagi kode yang sama ' +
          '(baca tombol, geser bintang, terjemahkan kolom jadi nomor menara). ' +
          'Sesudahnya, mereka berpisah.',
          'Ini pola yang akan Anda temui terus-menerus: <b>satu variabel ' +
          'keadaan mengubah arti masukan yang sama</b>. Editor teks yang punya ' +
          'mode sisip dan mode perintah bekerja begitu. Kalau program Anda ' +
          'mulai punya "kalau sedang begini, tombol X artinya begitu", yang ' +
          'Anda punya adalah mesin keadaan — dan lebih baik menggambarnya ' +
          'sebelum ia tumbuh.'
        ] },
      { judul: 'Kenapa aturannya cuma satu baris',
        isi: [
          'Aturan Menara Hanoi: cakram besar tidak boleh diletakkan di atas ' +
          'cakram kecil. Di program ini, penegakannya seluruhnya ada di baris ' +
          '540:',
          '<code>IF TW(PL,DK)>HOLD THEN TW(PL,DK-1)=HOLD:GOTO 570</code>',
          '<code>TW(PL,DK)</code> adalah cakram teratas di menara tujuan; ' +
          '<code>HOLD</code> adalah cakram yang sedang dipegang. Kalau yang di ' +
          'menara lebih besar, langkahnya sah, dan cakramnya mendarat satu ' +
          'posisi di atasnya (<code>DK-1</code>).',
          'Itu bisa sesingkat ini karena <b>ukuran cakram disimpan sebagai ' +
          'angka</b>. Kalau cakram disimpan sebagai gambar (string), aturannya ' +
          'harus membandingkan panjang string, dan kalau disimpan sebagai ' +
          'objek harus mengambil bidangnya dulu. Bentuk data yang tepat ' +
          'membuat aturannya menciut.'
        ] },
      { judul: 'Gelung yang membentang banyak baris',
        isi: [
          'Sampai program ketiga, tiap <code>FOR</code> di koleksi ini muat ' +
          'dalam satu baris, jadi penelusur menjalankan seluruh putarannya ' +
          'dalam satu langkah. Di sini tidak:',
          '<code>420 FOR DK=1 TO 8</code> &middot; <code>430 IF ...</code> ' +
          '&middot; <code>440 NEXT DK</code>',
          'Turunkan laju ke 2 baris/detik dan perhatikan sorotan saat program ' +
          'mencari cakram teratas: ia benar-benar berjalan 420 &rarr; 430 ' +
          '&rarr; 440 &rarr; 430 &rarr; 440 &hellip; Gelung berhenti terasa ' +
          'seperti kata dan mulai terasa seperti gerakan.',
          'Satu detail yang layak diperhatikan: baris 430 keluar dari gelung ' +
          'dengan <code>GOTO</code>, tanpa pernah sampai ke ' +
          '<code>NEXT</code>. Di bahasa modern itu <code>break</code>. Di ' +
          'BASIC ia meninggalkan bingkai gelung menggantung — yang tidak ' +
          'berakibat di sini hanya karena <code>FOR DK</code> berikutnya ' +
          'membuangnya.'
        ] }
    ]
  };
})(window);
