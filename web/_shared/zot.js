/* ===========================================================================
   zot.js — mesin bersama untuk WIZARD.BAS dan TEMPLE.BAS.

   BERKAS INI ADA KARENA SUMBERNYA MEMANG SATU
   -------------------------------------------
   TEMPLE.BAS (John Belew, 1984) adalah WIZARD.BAS (Joseph R. Power, 1980)
   yang disalin lalu diubah, dan kodenya sendiri mengatakannya di baris 750:
   "THANKS TO RECREATIONAL COMPUTING FOR THE ORIGINAL PROGRAM".

   Diukur: 706 pernyataan identik kata demi kata — 61% dari TEMPLE dan 77%
   dari WIZARD. Kedua DIM dan kelima DEF FN sama AKSARA DEMI AKSARA, dan
   kedua blok DATA punya bentuk yang sama persis (12 blok, 88 item); yang
   diganti Belew cuma kata-katanya.

   Jadi port-nya juga satu mesin dengan dua objek aturan — pola yang sama
   dengan _shared/blackjack.js, yang melayani empat program blackjack.
   Menyalin mesin ini dua kali akan mengulang persis kesalahan yang jadi
   temuan utama sesi ini: cacat yang ikut tersalin.

   ===========================================================================
   Aslinya: WIZARD.BAS, "The Wizard's Castle"

   Joseph R. Power untuk Exidy Sorcerer, Recreational Computing Jul/Agu 1980;
   diport ke Heath Microsoft BASIC oleh J.F. Stetson; disket IPCO 2039-A.
   944 baris — terpanjang kedua di koleksi ini.

   SATU GAGASAN MENJALANKAN SELURUH PROGRAM
   ----------------------------------------
   Di BASIC, sebuah perbandingan BUKAN nilai benar/salah — ia ANGKA:
   -1 kalau benar, 0 kalau salah. Power memakai itu di mana-mana, dan
   hasilnya program yang hampir tidak pernah bercabang:

       3900 X=X+(O$="N")-(O$="S")        gerak, tanpa satu pun IF
       2480 AV=-3*(O$="P")-2*(O$="C")-(O$="L")    huruf jadi angka
       3040 C(Q,4)=-(C(Q,1)=X)*(C(Q,2)=Y)*(C(Q,3)=Z)   DAN = perkalian
       4860 ON (1-(ST<1)) GOTO 2920,8840   if/else jadi lompatan berindeks

   Empat dari lima DEF FN-nya adalah gagasan yang sama dipadatkan:

       FNB(Q)=Q+8*((Q=9)-(Q=0))     lingkar 1..8, tanpa IF
       FNC(Q)=-Q*(Q<19)-18*(Q>18)   min(Q,18), tanpa IF
       FND(Q)=64*(Q-1)+8*(X-1)+Y    (lantai,baris,kolom) -> 1..512
       FNE(Q)=Q+100*(Q>99)          buang penanda "belum terlihat"

   Port ini MEMPERTAHANKAN idiomnya, lewat satu fungsi `b()` yang
   mengembalikan -1 atau 0. Meratakannya jadi if/else akan menghapus
   justru hal yang membuat program ini layak dibaca — dan menyembunyikan
   satu cacatnya, yang lahir dari tanda idiom itu sendiri (lihat `OT`).

   TIGA TEMUAN YANG DIUJI DI HALAMANNYA
   ------------------------------------
   1. Baris 4150 membuka SELURUH lantai di peta, dan komentar di baris yang
      sama menjelaskan cara memperbaikinya: `' LET Q=34 TO HIDE ROOMS`.
      Kabutnya dipelihara dengan benar oleh enam baris lain dan tidak pernah
      dibaca. Yang ikut mati: suar, lampu, kutukan Lupa, dan Green Gem.
      Port ini menyalakan kabutnya SEBAGAI BAWAAN — satu-satunya penyimpangan
      aturan main di sini — dan saklarnya mengembalikan perilaku 1980 persis.

   2. Baris 2150 `OT=OT+4*(RC=1)` memberi Hobbit EMPAT TITIK LEBIH SEDIKIT,
      bukan lebih banyak, karena (RC=1) bernilai -1. Dan karena ST+DX selalu
      16 untuk keempat ras, OT adalah SATU-SATUNYA yang membedakan mereka.

   3. Tidak ada satu pun RANDOMIZE di 944 baris. Kastel pertama tiap kali
      program dijalankan identik.
   =========================================================================== */
(function (global) {
  'use strict';

  global.RETRO = global.RETRO || {};

  /**
   * @param {object} A objek aturan. Semua yang BERBEDA antara WIZARD dan
   *   TEMPLE ada di sana; semua yang SAMA ada di berkas ini.
   */
  global.RETRO.zot = function (A) {

  const ui = global.RETRO.ui;
  const store = global.RETRO.store(A.simpanan);
  const ART = global.RETRO.ZOT_ART;
  const q = (id) => document.getElementById(id);

  /* ======================================================================
     Bagian 1 — idiom yang menjalankan seluruh program
     ====================================================================== */
  /** Nilai sebuah perbandingan di BASIC: -1 kalau benar, 0 kalau salah. */
  const b = (c) => (c ? -1 : 0);

  let rng = null;
  const fna = (n) => 1 + Math.floor(rng.next() * n);          /* 1140 */
  const fnb = (n) => n + 8 * (b(n === 9) - b(n === 0));       /* 1150 */
  const fnc = (n) => -n * b(n < 19) - 18 * b(n > 18);         /* 1160 */
  const fnd = (z) => 64 * (z - 1) + 8 * (S.X - 1) + S.Y;      /* 1170 */
  const fne = (n) => n + 100 * b(n > 99);                     /* 1180 */

  /* ======================================================================
     Bagian 2 — DATA 9470-9580
     ====================================================================== */
  /* DATA 9470-9580 di WIZARD, 10540-10650 di TEMPLE. Bentuknya identik —
     34 pasang C$/I$, 8 pasang W$/E$, 4 nama ras — dan hanya isinya yang
     berbeda. Karena itu ia parameter, bukan tetapan. */
  const CS = A.CS, WS = A.WS, ES = A.ES, RS = A.RS;

  /* ======================================================================
     Bagian 3 — keadaan
     ====================================================================== */
  const S = {};

  function mulai(benih) {
    rng = window.RETRO.rng(benih === undefined ? window.RETRO.freshSeed() : benih);
    S.benih = rng.seed;
    S.L = new Array(513).fill(101);                            /* 1300-1320 */
    S.C = [null, [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    S.T = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    S.O = [0, 0, 0, 0];
    S.R = [0, 0, 0, 0];
    S.RS3 = 'MAN';                                             /* 1890 */
    S.X = 1; S.Y = 4; S.Z = 1;
    S.RC = 0; S.ST = 2; S.DX = 14; S.IQ = 8; S.OT = 8;
    S.BF = 0; S.AV = 0; S.HT = 0; S.turn = 1; S.VF = 0; S.LF = 0;
    S.TC = 0; S.GP = 60; S.RF = 0; S.OF = 0; S.BL = 0; S.SX = 0;
    S.WV = 0; S.FL = 0; S.WC = 0; S.AH = 0; S.H = 0;
    S.selesai = false; S.lawan = null; S.Q3 = 1;
    /* Peubah skor. Hanya TEMPLE memakainya (WIZARD tidak punya skor sama
       sekali); di WIZARD ketiganya tetap nol dan tidak pernah dibaca.
       KM! = 1000 per monster, FTRS = 10000 untuk Runestaff, REQ = 20000
       untuk Amulet — baris 8445, 8515, dan 10260 di TEMPLE. */
    S.KM = 0; S.FTRS = 0; S.REQ = 0;
    tataKastel();
  }

  /* --- 9590: cari kamar kosong di lantai Z ------------------------------- */
  function kosongDi(z) {
    for (;;) {
      S.X = fna(8); S.Y = fna(8);
      if (S.L[fnd(z)] === 101) return;
    }
  }

  /* --- 1530-2010 -------------------------------------------------------- */
  function tataKastel() {
    S.X = 1; S.Y = 4;
    S.L[fnd(1)] = 2;                                           /* 1530 */
    for (let z = 1; z <= 7; z++) {                             /* 1540-1600 */
      for (let q1 = 1; q1 <= 2; q1++) {
        kosongDi(z);
        S.L[fnd(z)] = 104;
        /* Ditulis BUTA: tidak ada pemeriksaan bahwa kamar di lantai atasnya
           kosong. Aman hanya karena lantai z+1 belum diisi apa pun. Dan
           akibatnya tangga naik SELALU tepat di atas tangga turun. */
        S.L[fnd(z + 1)] = 103;
      }
    }
    for (let z = 1; z <= 8; z++) {                             /* 1610-1720 */
      for (let qq = 113; qq <= 124; qq++) { kosongDi(z); S.L[fnd(z)] = qq; }
      for (let q1 = 1; q1 <= 3; q1++) {
        for (let qq = 105; qq <= 112; qq++) { kosongDi(z); S.L[fnd(z)] = qq; }
        kosongDi(z); S.L[fnd(z)] = 125;
      }
    }
    for (let qq = 126; qq <= 133; qq++) {                      /* 1730-1760 */
      const z = fna(8); kosongDi(z); S.L[fnd(z)] = qq;
    }
    for (let a = 1; a <= 3; a++) {                             /* 1770-1850 */
      const z = fna(8); kosongDi(z); S.L[fnd(z)] = 101;
      S.C[a] = [S.X, S.Y, z, 0];
    }
    let z = fna(8); kosongDi(z);                               /* 1900-1950 */
    S.L[fnd(z)] = 112 + fna(12);
    S.R = [0, S.X, S.Y, z];
    z = fna(8); kosongDi(z);                                   /* 1960-2010 */
    S.L[fnd(z)] = 109;                    /* Orb DISIMPAN sebagai warp biasa */
    S.O = [0, S.X, S.Y, z];
    S.X = 1; S.Y = 4; S.Z = 1;
  }

  /* ======================================================================
     Bagian 4 — keluaran
     ====================================================================== */
  function cetak(t, k) {
    const d = document.createElement('div');
    d.className = 'zot-baris ' + (k || '');
    d.textContent = t === '' ? ' ' : t;
    q('log').append(d);
    q('log').scrollTop = q('log').scrollHeight;
  }
  const ras = () => (S.RC === 3 ? 'HUMAN' : RS[S.RC] || 'ADVENTURER');

  /* Nama monster tanpa "A "/"AN " di depan — baris 7630-7640 melakukan itu
     dengan RIGHT$ lalu memeriksa spasi sisa. */
  function tanpaSandang(s) {
    let z = s.slice(2);
    if (z.slice(0, 1) === ' ') z = z.slice(1);
    return z;
  }

  /* ======================================================================
     Bagian 5 — tanya/jawab (padanan INPUT di tengah rutin)
     ====================================================================== */
  let tanya = null;
  function minta(teks, terima, opsi) {
    tanya = { teks, terima };
    q('prompt').textContent = teks;
    gambarTombol(opsi || null);
  }
  function bebas() {
    tanya = null;
    q('prompt').textContent = 'ENTER YOUR COMMAND';
    gambarTombol(null);
  }

  function terimaBaris(teksMentah) {
    const t = teksMentah.trim();
    if (S.selesai) return;
    if (tanya) { const f = tanya.terima; bebas(); f(t); gambar(); return; }
    cetak('> ' + t, 'zot-kamu');
    perintah(t);
    gambar();
  }

  /* ======================================================================
     Bagian 6 — gelung utama, baris 2920-3880
     ====================================================================== */
  function giliranBaru() {
    S.turn += 1;                                               /* 2920 */
    if (S.RF + S.OF <= 0) {                                    /* 2930 */
      if (S.C[1][3] > S.T[1]) S.turn += 1;                     /* 2940 lesu */
      if (S.C[2][3] > S.T[3]) S.GP -= fna(5);                  /* 2950 lintah */
      if (S.GP < 0) S.GP = 0;
      if (S.C[3][3] > S.T[5]) {                                /* 2970 lupa */
        const a = S.X, b2 = S.Y, c = S.Z;
        S.X = fna(8); S.Y = fna(8); S.Z = fna(8);
        S.L[fnd(S.Z)] = fne(S.L[fnd(S.Z)]) + 100;
        S.X = a; S.Y = b2; S.Z = c;
      }
      if (S.L[fnd(S.Z)] === 1) {                               /* 3020-3050 */
        for (let i = 1; i <= 3; i++) {
          S.C[i][3] = -b(S.C[i][0] === S.X) * b(S.C[i][1] === S.Y) * b(S.C[i][2] === S.Z);
        }
      }
    }
    if (fna(5) <= 1) suasana();                                /* 3060-3340 */
    if (S.BL + S.T[4] === 2) { cetak(''); cetak(CS[29] + ' CURES YOUR BLINDNESS!'); S.BL = 0; }
    if (S.BF + S.T[6] === 2) { cetak(''); cetak(CS[31] + ' DISSOLVES THE BOOK!'); S.BF = 0; }
    cetak('');
  }

  function suasana() {                                         /* 3070-3340 */
    let n = fna(7) + S.BL;
    if (n > 7) n = 4;
    const kata = [
      'SEE A BAT FLY BY!',
      'HEAR ' + ['A SCREAM!', 'FOOTSTEPS!', 'A WUMPUS!', 'THUNDER!'][fna(4) - 1],
      'SNEEZED!',
      'STEPPED ON A FROG!',
      'SMELL ' + CS[12 + fna(13)] + ' FRYING!',
      "FEEL LIKE YOU'RE BEING WATCHED!",
      'HEAR FAINT RUSTLING NOISES!'][n - 1];
    cetak('');
    cetak('YOU ' + kata);
  }

  /* --- 3440-3880: penguraian perintah ----------------------------------- */
  const BANTUAN = [
    '*** WIZARD\'S CASTLE COMMAND AND INFORMATION SUMMARY ***', '',
    'THE FOLLOWING COMMANDS ARE AVAILABLE :', '',
    'H/ELP     N/ORTH    S/OUTH    E/AST     W/EST     U/P',
    'D/OWN     DR/INK    M/AP      F/LARE    L/AMP     O/PEN',
    'G/AZE     T/ELEPORT Q/UIT', '',
    'THE CONTENTS OF ROOMS ARE AS FOLLOWS :', '',
    '. = EMPTY ROOM      B = BOOK            C = CHEST',
    'D = STAIRS DOWN     E = ENTRANCE/EXIT   F = FLARES',
    'G = GOLD PIECES     M = MONSTER         O = CRYSTAL ORB',
    'P = MAGIC POOL      S = SINKHOLE        T = TREASURE',
    'U = STAIRS UP       V = VENDOR          W = WARP/ORB', '',
    'THE BENEFITS OF HAVING TREASURES ARE :', '',
    'RUBY RED - AVOID LETHARGY     PALE PEARL - AVOID LEECH',
    'GREEN GEM - AVOID FORGETTING  OPAL EYE - CURES BLINDNESS',
    'BLUE FLAME - DISSOLVES BOOKS  NORN STONE - NO BENEFIT',
    'PALANTIR - NO BENEFIT         SILMARIL - NO BENEFIT'];

  function perintah(teks) {
    const O = teks.toUpperCase();
    if (O.slice(0, 2) === 'DR') return minum();                /* 3450 */
    const o = O.slice(0, 1);
    if (o === 'N' || o === 'S' || o === 'W' || o === 'E') {
      if (o === 'N' && S.L[fnd(S.Z)] === 2) return keluarKastel();  /* 3890 */
      return pindah(o);
    }
    if (o === 'U') {                                           /* 3950 */
      if (S.L[fnd(S.Z)] === 3) { S.Z -= 1; return masukKamar(o); }
      cetak(''); cetak('** THERE ARE NO STAIRS GOING UP FROM HERE!'); return;
    }
    if (o === 'D') {                                           /* 3990 */
      if (S.L[fnd(S.Z)] === 4) { S.Z += 1; return masukKamar(o); }
      cetak(''); cetak('** THERE ARE NO STAIRS GOING DOWN FROM HERE!'); return;
    }
    if (o === 'M') return butaAtau(() => { petaTeks(); });
    if (o === 'F') return butaAtau(suar);
    if (o === 'L') return butaAtau(lampu);
    if (o === 'O') return buka();
    if (o === 'G') return butaAtau(pandang);
    if (o === 'T') { cetak(''); return teleport(); }
    if (o === 'Q') return keluarPermainan();
    if (o === 'H') { cetak(''); BANTUAN.forEach(s => cetak(s)); return; }
    if (o === '#' && A.skor) {                               /* TEMPLE 3940 */
      cetak('');
      cetak('Your score at this time is ' + A.skor.cepat(S));
      return;
    }
    cetak(''); cetak('** SILLY ' + ras() + ", THAT WASN'T A VALID COMMAND!");
  }
  function butaAtau(f) {                                       /* 4030 */
    if (S.BL === 1) {
      cetak(''); cetak("** YOU CAN'T SEE ANYTHING, YOU DUMB " + ras() + '!');
      return;
    }
    f();
  }

  /* --- 3900-3940: gerak, seluruhnya aritmetika --------------------------- */
  function pindah(o) {
    S.X = S.X + b(o === 'N') - b(o === 'S');
    S.Y = S.Y + b(o === 'W') - b(o === 'E');
    S.X = fnb(S.X);
    S.Y = fnb(S.Y);
    masukKamar(o);
  }

  /* ======================================================================
     Bagian 7 — peta (4100-4230) dan kabut yang tidak pernah dipakai
     ====================================================================== */
  /* Saklar "LET Q=34".

     WIZARD 4150:  IF Q > 99 THEN Q=Q-100 ' LET Q=34 TO HIDE ROOMS
     TEMPLE 4570:  IF Q > 99 THEN Q=Q-100:LET Q=34:REM TO HIDE ROOMS

     Empat tahun kemudian Belew MEMBACA komentar itu dan melakukan yang
     disuruhnya: instruksinya pindah dari balik tanda kutip ke dalam alur
     program. Jadi di TEMPLE kabutnya memang menyala dari pabrik; di WIZARD
     ia mati, dan port WIZARD menyalakannya sebagai penyimpangan yang
     dinyatakan. Nilai bawaannya karena itu datang dari aturan. */
  let sembunyikan = A.kabutBawaan;

  /* RANK$ di TEMPLE tidak pernah dikosongkan di antara permainan, dan tidak
     pernah disetel sama sekali untuk skor 20.000..35.000. Peubah ini karena
     itu hidup DI LUAR keadaan permainan — persis seperti peubah BASIC. */
  let pangkat = '';

  function kodeTampil(z, x, y) {
    const idx = 64 * (z - 1) + 8 * (x - 1) + y;
    let Q = S.L[idx];
    /* 4150 IF Q > 99 THEN Q=Q-100        ' LET Q=34 TO HIDE ROOMS
       Yang tertulis MEMBUKA kamar yang belum dikunjungi. Komentar di baris
       yang sama menyebutkan perbaikannya, dan DATA 9550 menyediakan entri
       ke-34 ("X" / "?") khusus untuk itu. Saklar di halaman ini memilih
       antara keduanya. */
    if (Q > 99) Q = sembunyikan ? 34 : Q - 100;
    return Q;
  }

  function petaTeks() {                                        /* 4100-4230 */
    cetak('');
    for (let x = 1; x <= 8; x++) {
      let baris = '';
      for (let y = 1; y <= 8; y++) {
        const h = ART.KAMAR[kodeTampil(S.Z, x, y)][1];
        baris += (x === S.X && y === S.Y) ? '<' + h + '>  ' : ' ' + h + '   ';
      }
      cetak(baris);
    }
    cetak('YOU ARE AT (' + S.X + ',' + S.Y + ') LEVEL ' + S.Z + '.');
  }

  /* --- 4320-4470: suar membuka 3x3 -------------------------------------- */
  function suar() {
    if (S.FL === 0) { cetak('** HEY, BRIGHT ONE, YOU\'RE OUT OF FLARES!'); return; }
    cetak('');
    S.FL -= 1;
    const a = S.X, b2 = S.Y;
    for (let q1 = a - 1; q1 <= a + 1; q1++) {
      S.X = fnb(q1);
      let baris = '';
      for (let q2 = b2 - 1; q2 <= b2 + 1; q2++) {
        S.Y = fnb(q2);
        const Q = fne(S.L[fnd(S.Z)]);
        S.L[fnd(S.Z)] = Q;                     /* kamar jadi "terlihat" */
        baris += ' ' + ART.KAMAR[Q][1] + '   ';
      }
      cetak(baris);
    }
    S.X = a; S.Y = b2;
    cetak('YOU ARE AT (' + S.X + ',' + S.Y + ') LEVEL ' + S.Z + '.');
  }

  /* --- 4560-4720: lampu membuka satu kamar ------------------------------ */
  function lampu() {
    if (S.LF === 0) { cetak(''); cetak("** YOU DON'T HAVE A LAMP, " + ras() + '!'); return; }
    cetak('');
    minta('WHERE DO YOU WANT TO SHINE THE LAMP (N,S,E,W)', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      const a = S.X, b2 = S.Y;
      S.X = fnb(S.X + b(o === 'N') - b(o === 'S'));
      S.Y = fnb(S.Y + b(o === 'W') - b(o === 'E'));
      if (a - S.X + b2 - S.Y === 0) {                          /* 4620 */
        S.X = a; S.Y = b2;
        cetak(''); cetak("** THAT'S NOT A DIRECTION, " + ras() + '!');
        return;
      }
      cetak('');
      cetak('THE LAMP SHINES INTO (' + S.X + ',' + S.Y + ') LEVEL ' + S.Z + '.');
      S.L[fnd(S.Z)] = fne(S.L[fnd(S.Z)]);
      cetak('THERE YOU WILL FIND ' + CS[S.L[fnd(S.Z)]] + '.');
      S.X = a; S.Y = b2;
    }, ['N', 'S', 'E', 'W']);
  }

  /* ======================================================================
     Bagian 8 — kolam, peti, buku, bola kristal
     ====================================================================== */
  function minum() {                                           /* 4760-4940 */
    if (S.L[fnd(S.Z)] !== 5) {
      cetak(''); cetak('** IF YOU WANT A DRINK, FIND A POOL!'); return;
    }
    const Q = fna(8);
    cetak('');
    let t = 'YOU TAKE A DRINK AND ' + (Q < 7 ? 'FEEL ' : '');
    if (Q === 1) { S.ST = fnc(S.ST + fna(3)); cetak(t + 'STRONGER.'); }
    else if (Q === 2) { S.ST -= fna(3); cetak(t + 'WEAKER.'); if (S.ST < 1) return mati(); }
    else if (Q === 3) { S.IQ = fnc(S.IQ + fna(3)); cetak(t + 'SMARTER.'); }
    else if (Q === 4) { S.IQ -= fna(3); cetak(t + 'DUMBER.'); if (S.IQ < 1) return mati(); }
    else if (Q === 5) { S.DX = fnc(S.DX + fna(3)); cetak(t + 'NIMBLER.'); }
    else if (Q === 6) { S.DX -= fna(3); cetak(t + 'CLUMSIER.'); if (S.DX < 1) return mati(); }
    else if (Q === 7) {
      let n; do { n = fna(4); } while (n === S.RC);             /* 4910 */
      S.RC = n; cetak(t + 'BECOME A ' + ras() + '.');
    } else {
      S.SX = 1 - S.SX;
      cetak(t + 'TURN INTO A ' + (S.SX === 0 ? 'FE' : '') + 'MALE ' + ras() + '!');
    }
  }

  function buka() {                                            /* 4950-5240 */
    const kode = S.L[fnd(S.Z)];
    if (kode === 6) { cetak(''); cetak('YOU OPEN THE CHEST AND'); return peti(); }
    if (kode === 12) { cetak(''); cetak('YOU OPEN THE BOOK AND'); return buku(); }
    cetak(''); cetak('** THE ONLY THING OPENED WAS YOUR BIG MOUTH!');
  }

  function buku() {                                            /* 5060-5230 */
    const n = fna(6);
    if (n === 1) { cetak('FLASH! OH NO! YOU ARE NOW A BLIND ' + ras() + '!'); S.BL = 1; }
    else if (n === 2) cetak("IT'S ANOTHER VOLUME OF ZOT'S POETRY! - YECH!!");
    else if (n === 3) cetak("IT'S AN OLD COPY OF PLAY" + RS[fna(4)] + '!');
    else if (n === 4) { cetak("IT'S A MANUAL OF DEXTERITY!"); S.DX = 18; }
    else if (n === 5) { cetak("IT'S A MANUAL OF STRENGTH!"); S.ST = 18; }
    else {
      cetak('THE BOOK STICKS TO YOUR HANDS -');
      cetak('NOW YOU ARE UNABLE TO DRAW YOUR WEAPON!');
      S.BF = 1;
    }
    S.L[fnd(S.Z)] = 1;
  }

  function peti() {                                            /* 5250-5380 */
    const n = fna(4);
    if (n === 1) {
      cetak('KABOOM! IT EXPLODES!!');
      lukai(fna(6));
      S.L[fnd(S.Z)] = 1;
      if (S.ST < 1) return mati();
      return;
    }
    if (n === 3) {
      cetak('GAS!! YOU STAGGER FROM THE ROOM!');
      S.L[fnd(S.Z)] = 1;
      S.turn += 20;
      return pindah('NSEW'.charAt(fna(4) - 1));
    }
    const g = fna(1000);
    cetak('FIND ' + g + ' GOLD PIECES!');
    S.GP += g;
    S.L[fnd(S.Z)] = 1;
  }

  function pandang() {                                         /* 5390-5640 */
    if (S.L[fnd(S.Z)] !== 11) {
      cetak(''); cetak("** IT'S HARD TO GAZE WITHOUT AN ORB!"); return;
    }
    cetak('');
    const n = fna(6);
    if (n === 1) {
      cetak('YOU SEE YOURSELF IN A BLOODY HEAP!');
      S.ST -= fna(2); if (S.ST < 1) return mati();
    } else if (n === 2) {
      cetak('YOU SEE YOURSELF DRINKING FROM A POOL AND BECOMING ' + CS[12 + fna(13)] + '!');
    } else if (n === 3) {
      cetak('YOU SEE ' + CS[12 + fna(13)] + ' GAZING BACK AT YOU!');
    } else if (n === 4) {
      const a = S.X, b2 = S.Y, c = S.Z;
      S.X = fna(8); S.Y = fna(8); S.Z = fna(8);
      const Q = fne(S.L[fnd(S.Z)]);
      S.L[fnd(S.Z)] = Q;
      cetak('YOU SEE ' + CS[Q] + ' AT (' + S.X + ',' + S.Y + ') LEVEL ' + S.Z + '.');
      S.X = a; S.Y = b2; S.Z = c;
    } else if (n === 5) {
      /* 5590-5610: tiga angka acak, lalu 3 dari 8 kemungkinan ditimpa
         letak Orb yang sebenarnya. Jadi bola kristal berkata benar 37,5%
         waktu — dan tidak ada apa pun di layar yang membedakannya. */
      let a = fna(8), b2 = fna(8), c = fna(8);
      if (fna(8) < 4) { a = S.O[1]; b2 = S.O[2]; c = S.O[3]; }
      cetak('YOU SEE ***THE ORB OF ZOT*** AT (' + a + ',' + b2 + ') LEVEL ' + c + '!');
    } else {
      cetak('YOU SEE A SOAP OPERA RERUN!');
    }
  }

  /* --- 5650-5790: teleport, satu-satunya jalan menuju Orb ---------------- */
  function teleport() {
    if (S.RF === 0) {
      cetak("** YOU CAN'T TELEPORT WITHOUT THE RUNESTAFF!"); return;
    }
    const angka = (nama, lanjut) => minta(nama, (v) => {
      const n = Math.trunc(Number(v) || 0);
      if (!(n > 0 && n < 9)) { cetak(''); cetak('** TRY A NUMBER FROM 1 TO 8.'); return angka(nama, lanjut); }
      lanjut(n);
    }, ['1', '2', '3', '4', '5', '6', '7', '8']);
    angka('X-COORDINATE', (x) => angka('Y-COORDINATE', (y) => angka('Z-COORDINATE', (z) => {
      S.X = x; S.Y = y; S.Z = z;
      masukKamar('T');
    })));
  }

  /* ======================================================================
     Bagian 9 — masuk kamar, baris 5920-6180
     ====================================================================== */
  function masukKamar(o) {
    S.WC = 0;
    const Q = fne(S.L[fnd(S.Z)]);
    S.L[fnd(S.Z)] = Q;                       /* kamar ini jadi "terlihat" */
    cetak('');
    cetak('HERE YOU FIND ' + CS[Q] + '.');

    if (Q < 7 || Q === 11 || Q === 12) return;                 /* 6050 */
    if (Q === 7) { S.GP += fna(10); cetak('YOU NOW HAVE ' + S.GP + '.'); S.L[fnd(S.Z)] = 1; return; }
    if (Q === 8) { S.FL += fna(5); cetak('YOU NOW HAVE ' + S.FL + '.'); S.L[fnd(S.Z)] = 1; return; }
    if (Q === 9) {                                             /* 6090 warp */
      if (S.O[1] === S.X && S.O[2] === S.Y && S.O[3] === S.Z) {
        /* ON (1-(O$="T")) GOTO 3900,9370 — cabang KEDUA hanya kalau perintah
           terakhir "T". Seluruh syarat kemenangan permainan ini ada di sini. */
        const cabang = 1 - b(o === 'T');
        if (cabang === 2) return dapatOrb();
        return pindah(o);
      }
      S.X = fna(8); S.Y = fna(8); S.Z = fna(8);
      return masukKamar(o);
    }
    if (Q === 10) { S.Z = fnb(S.Z + 1); return masukKamar(o); }  /* 6110 lubang */
    if (Q > 25 && Q < 34) {                                    /* 6120-6170 */
      cetak(''); cetak("IT'S NOW YOURS!");
      S.T[Q - 25] = 1; S.TC += 1; S.L[fnd(S.Z)] = 1; return;
    }
    /* 6180: monster (A=1..12) atau pedagang (A=13) */
    const A = S.L[fnd(S.Z)] - 12;
    if (A < 13 || S.VF === 1) return mulaiLawan(A);
    return pedagang(A);
  }

  function dapatOrb() {                                        /* 9370-9460 */
    cetak('');
    cetak('GREAT UNMITIGATED ZOT!', 'zot-menang');
    cetak('');
    cetak('YOU JUST FOUND ***THE ORB OF ZOT***!', 'zot-menang');
    cetak('');
    cetak('THE RUNESTAFF HAS DISAPPEARED!');
    S.RF = 0; S.OF = 1; S.O[1] = 0;
    S.REQ = 20000;                                           /* TEMPLE 10260 */
    /* TEMPLE 10250-10262 memberi bonus yang tidak ada di WIZARD: Amulet
       menyembuhkan kebutaan, melepaskan buku yang melekat, dan menaikkan
       kelincahan ke maksimum. */
    if (A.orbBonus) A.orbBonus(S);
    S.L[fnd(S.Z)] = 1;
  }

  /* ======================================================================
     Bagian 10 — pertempuran, baris 7390-8730
     ====================================================================== */
  function mulaiLawan(A) {
    /* 7390: SATU angka — urutan monster di DATA — melahirkan serangan DAN
       darah. Tidak ada tabel monster sama sekali. */
    S.lawan = { A, Q1: 1 + Math.trunc(A / 2), Q2: A + 2 };
    S.Q3 = 1;
    if (S.C[1][3] > S.T[1] || S.BL === 1 || S.DX < fna(9) + fna(9)) return dilawan();
    tanyaLawan();
  }

  function tanyaLawan() {                                      /* 7410-7490 */
    const A = S.lawan.A;
    cetak('');
    cetak("YOU'RE FACING " + CS[A + 12] + '!', 'zot-bahaya');
    cetak('');
    cetak('YOU MAY ATTACK OR RETREAT.');
    if (S.Q3 === 1) cetak('YOU CAN ALSO ATTEMPT A BRIBE.');
    if (S.IQ > 14) cetak('YOU CAN ALSO CAST A SPELL.');
    cetak('');
    cetak('YOUR STRENGTH IS ' + S.ST + ' AND YOUR DEXTERITY IS ' + S.DX + '.');
    const opsi = ['A', 'R'];
    if (S.Q3 === 1) opsi.push('B');
    if (S.IQ > 14) opsi.push('C');
    minta('YOUR CHOICE', pilihLawan, opsi);
  }

  function pilihLawan(v) {
    const o = v.toUpperCase().slice(0, 1);
    const A = S.lawan.A;
    if (o === 'A') {
      if (S.WV === 0) { cetak(''); cetak('** POUNDING ON ' + CS[A + 12] + " WON'T HURT IT!"); return dilawan(); }
      if (S.BF === 1) { cetak(''); cetak("** YOU CAN'T BEAT IT TO DEATH WITH A BOOK!"); return dilawan(); }
      if (S.DX < fna(20) + 3 * S.BL) { cetak(''); cetak('YOU MISSED, TOO BAD!'); return dilawan(); }
      const nm = tanpaSandang(CS[A + 12]);
      cetak(''); cetak('YOU HIT THE EVIL ' + nm + '!');
      S.lawan.Q2 -= S.WV;
      if ((A === 9 || A === 12) && fna(8) === 1) {             /* 7680-7720 */
        cetak(''); cetak('OH NO! YOUR ' + WS[S.WV + 1] + ' BROKE!');
        S.WV = 0;
      }
      if (S.lawan.Q2 > 0) return dilawan();
      return monsterMati();
    }
    if (o === 'R') { S.lawanKabur = true; return dilawan(); }
    if (o === 'C') return mantra();
    if (o === 'B') {
      if (S.Q3 > 1) { cetak(''); cetak('** CHOOSE ONE OF THE OPTIONS LISTED.'); return tanyaLawan(); }
      return suap();
    }
    cetak(''); cetak('** CHOOSE ONE OF THE OPTIONS LISTED.');
    tanyaLawan();
  }

  function mantra() {                                          /* 7970-8200 */
    if (!(S.IQ >= 15 || S.Q3 <= 1)) {
      cetak(''); cetak("** YOU CAN'T CAST A SPELL NOW!"); return tanyaLawan();
    }
    cetak('');
    minta('WHICH SPELL (WEB, FIREBALL, DEATHSPELL)', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      cetak('');
      if (o === 'W') {
        S.ST -= 1; S.WC = fna(8) + 1;
        if (S.ST < 1) return mati();
        return dilawan();
      }
      if (o === 'F') {
        const d = fna(7) + fna(7);
        S.ST -= 1; S.IQ -= 1;
        if (S.IQ < 1 || S.ST < 1) return mati();
        cetak('IT DOES ' + d + ' POINTS WORTH OF DAMAGE.');
        cetak('');
        S.lawan.Q2 -= d;
        if (S.lawan.Q2 > 0) return dilawan();
        return monsterMati();
      }
      if (o === 'D') {
        if (S.IQ < fna(4) + 15) { cetak('DEATH . . . YOURS!'); S.IQ = 0; return mati(); }
        cetak('DEATH . . . HIS!');
        S.lawan.Q2 = 0;
        return monsterMati();
      }
      cetak('** TRY ONE OF THE OPTIONS GIVEN.');
      tanyaLawan();
    }, ['WEB', 'FIREBALL', 'DEATHSPELL']);
  }

  function suap() {                                            /* 8250-8410 */
    if (S.TC === 0) { cetak(''); cetak('ALL I WANT IS YOUR LIFE!'); return dilawan(); }
    let n; do { n = fna(8); } while (S.T[n] === 0);
    cetak('');
    minta('I WANT ' + CS[n + 25] + '. WILL YOU GIVE IT TO ME', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o === 'N') return dilawan();
      if (o !== 'Y') { cetak('** PLEASE ANSWER YES OR NO'); return suap(); }
      S.T[n] = 0; S.TC -= 1;
      cetak(''); cetak("OK, JUST DON'T TELL ANYONE ELSE.");
      /* 8400 VF=VF+(L(FND(Z))=25) — menyuap pedagang yang sedang marah
         membuatnya (dan semua pedagang lain) ramah lagi, karena (…=25)
         bernilai -1. Satu tambahan, satu pengurangan, tanpa IF. */
      S.VF = S.VF + b(S.L[fnd(S.Z)] === 25);
      S.lawan = null;
      giliranBaru();
    }, ['Y', 'N']);
  }

  function monsterMati() {                                     /* 7740-7900 */
    const A = S.lawan.A;
    cetak('');
    cetak(CS[A + 12] + ' LIES DEAD AT YOUR FEET!', 'zot-menang');
    S.KM += 1000;                                            /* TEMPLE 8445 */
    if (!(S.H > S.turn - 60)) {                                /* 7770 */
      cetak('');
      cetak('YOU SPEND AN HOUR EATING ' + CS[A + 12] + ES[fna(8)] + '.');
      S.H = S.turn;
    }
    const diRune = (S.X === S.R[1] && S.Y === S.R[2] && S.Z === S.R[3]);
    if (!diRune) {
      if (1 - b(A === 13) === 2) return jarahanPedagang();     /* 7810 */
    } else {
      cetak('');
      cetak("GREAT ZOT! YOU'VE FOUND THE RUNESTAFF!", 'zot-menang');
      S.R[1] = 0; S.RF = 1;
      S.FTRS = 10000;                                        /* TEMPLE 8515 */
    }
    hartaMonster();
  }
  function hartaMonster() {                                    /* 7860-7900 */
    const g = fna(1000);
    cetak('');
    cetak('YOU NOW GET HIS HOARD OF ' + g + " GP'S");
    S.GP += g;
    S.L[fnd(S.Z)] = 1;
    S.lawan = null;
  }
  function jarahanPedagang() {                                 /* 9630-9760 */
    cetak('');
    cetak('YOU GET ALL HIS WARES :');
    cetak('PLATE ARMOR'); S.AV = 3; S.AH = 21;
    cetak('A SWORD'); S.WV = 3;
    cetak('A STRENGTH POTION'); S.ST = fnc(S.ST + fna(6));
    cetak('AN INTELLIGENCE POTION'); S.IQ = fnc(S.IQ + fna(6));
    cetak('A DEXTERITY POTION'); S.DX = fnc(S.DX + fna(6));
    if (S.LF === 0) { cetak('A LAMP'); S.LF = 1; }
    hartaMonster();
  }

  function dilawan() {                                         /* 8420-8730 */
    S.Q3 = 2;
    if (S.WC > 0) {
      S.WC -= 1;
      if (S.WC === 0) { cetak(''); cetak('THE WEB JUST BROKE!'); }
    }
    const nm = tanpaSandang(CS[S.lawan.A + 12]);
    if (S.WC > 0) {
      cetak(''); cetak('THE ' + nm + " IS STUCK AND CAN'T ATTACK NOW!");
    } else {
      cetak(''); cetak('THE ' + nm + ' ATTACKS!');
      if (S.DX < fna(7) + fna(7) + fna(7) + 3 * S.BL) {
        cetak(''); cetak('OUCH! HE HIT YOU!', 'zot-bahaya');
        lukai(S.lawan.Q1);
        if (S.ST < 1) return mati();
      } else {
        cetak(''); cetak('WHAT LUCK, HE MISSED YOU!');
      }
    }
    if (S.lawanKabur) {                                        /* 8630-8730 */
      S.lawanKabur = false;
      cetak(''); cetak('YOU HAVE ESCAPED!');
      cetak('');
      return minta('DO YOU WANT TO GO NORTH, SOUTH, EAST, OR WEST', (v) => {
        const o = v.toUpperCase().slice(0, 1);
        if ('NSEW'.indexOf(o) < 0) {
          cetak(''); cetak("** DON'T PRESS YOUR LUCK, " + ras() + '!');
          return dilawan();
        }
        S.lawan = null;
        pindah(o);
      }, ['N', 'S', 'E', 'W']);
    }
    tanyaLawan();
  }

  /* --- 8740-8830: baju zirah menyerap, lalu hancur ----------------------- */
  function lukai(n) {
    if (S.AV !== 0) {
      n -= S.AV;
      S.AH -= S.AV;
      if (n < 0) { S.AH -= n; n = 0; }
      if (S.AH < 0) {
        S.AH = 0; S.AV = 0;
        cetak(''); cetak('YOUR ARMOR HAS BEEN DESTROYED . . . GOOD LUCK!', 'zot-bahaya');
      }
    }
    S.ST -= n;
  }

  /* ======================================================================
     Bagian 11 — pedagang, baris 6210-7380
     ====================================================================== */
  function pedagang() {
    cetak('');
    cetak('YOU MAY TRADE WITH, ATTACK, OR IGNORE THE VENDOR.');
    minta('YOUR CHOICE', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o === 'I') return;
      if (o === 'A') {
        S.VF = 1;
        cetak(''); cetak("YOU'LL BE SORRY THAT YOU DID THAT!");
        return mulaiLawan(13);
      }
      if (o === 'T') return jualHarta(1);
      cetak(''); cetak('** NICE SHOT, ' + ras() + '!');
      pedagang();
    }, ['T', 'A', 'I']);
  }

  function jualHarta(qi) {                                     /* 6340-6420 */
    if (qi > 8) return beliZirah();
    if (S.T[qi] === 0) return jualHarta(qi + 1);
    const harga = fna(qi * 1500);
    cetak('');
    minta('DO YOU WANT TO SELL ' + CS[qi + 25] + ' FOR ' + harga + " GP'S", (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o === 'Y') { S.TC -= 1; S.T[qi] = 0; S.GP += harga; return jualHarta(qi + 1); }
      if (o === 'N') return jualHarta(qi + 1);
      cetak('** PLEASE ANSWER YES OR NO');
      jualHarta(qi);
    }, ['Y', 'N']);
  }

  function beliZirah() {                                       /* 6430-6720 */
    if (S.GP < 1000) { cetak(''); cetak("YOU'RE TOO POOR TO TRADE, " + ras() + '.'); return; }
    if (S.GP < 1250) return beliRamuan(1);
    cetak('');
    cetak('OK, ' + ras() + ', YOU HAVE ' + S.GP + " GP'S AND " + WS[S.AV + 5] + ' ARMOR.');
    let daftar = 'NOTHING<0> LEATHER<1250> ';
    if (S.GP > 1499) daftar += 'CHAINMAIL<1500> ';
    if (S.GP > 1999) daftar += 'PLATE<2000>';
    cetak(daftar);
    minta('YOUR CHOICE', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o === 'N') return beliSenjata();
      if (o === 'L') { S.GP -= 1250; S.AV = 1; S.AH = 7; return beliSenjata(); }
      if (o === 'C' && S.GP < 1500) { cetak("** YOU HAVEN'T GOT THAT MUCH CASH ON HAND!"); return beliZirah(); }
      if (o === 'C') { S.GP -= 1500; S.AV = 2; S.AH = 14; return beliSenjata(); }
      if (o === 'P' && S.GP < 2000) { cetak("** YOU CAN'T AFFORD PLATE ARMOR!"); return beliZirah(); }
      if (o === 'P') { S.GP -= 2000; S.AV = 3; S.AH = 21; return beliSenjata(); }
      cetak(''); cetak('** DON\'T BE SILLY. CHOOSE A SELECTION.');
      beliZirah();
    }, ['N', 'L', 'C', 'P']);
  }

  function beliSenjata() {                                     /* 6720-6970 */
    if (S.GP < 1250) return beliRamuan(1);
    cetak('');
    cetak('YOU HAVE ' + S.GP + " GP'S LEFT WITH " + WS[S.WV + 1] + ' IN HAND.');
    let daftar = 'NOTHING<0> DAGGER<1250> ';
    if (S.GP > 1499) daftar += 'MACE<1500> ';
    if (S.GP > 1999) daftar += 'SWORD<2000>';
    cetak(daftar);
    minta('YOUR CHOICE', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o === 'N') return beliRamuan(1);
      if (o === 'D') { S.GP -= 1250; S.WV = 1; return beliRamuan(1); }
      if (o === 'M' && S.GP < 1500) { cetak("** SORRY SIR, I'M AFRAID I DON'T GIVE CREDIT!"); return beliSenjata(); }
      if (o === 'M') { S.GP -= 1500; S.WV = 2; return beliRamuan(1); }
      if (o === 'S' && S.GP < 2000) { cetak('** YOUR DUNGEON EXPRESS CARD - YOU LEFT HOME WITHOUT IT!'); return beliSenjata(); }
      if (o === 'S') { S.GP -= 2000; S.WV = 3; return beliRamuan(1); }
      cetak('** TRY CHOOSING A SELECTION!');
      beliSenjata();
    }, ['N', 'D', 'M', 'S']);
  }

  const RAMUAN = [null, ['STRENGTH', 'ST'], ['INTELLIGENCE', 'IQ'], ['DEXTERITY', 'DX']];
  function beliRamuan(i) {                                     /* 6970-7260 */
    if (i > 3) return beliLampu();
    if (S.GP < 1000) return;
    const [nama, kunci] = RAMUAN[i];
    cetak('');
    minta('DO YOU WANT TO BUY A POTION OF ' + nama + " FOR 1000 GP'S", (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o === 'Y') {
        S.GP -= 1000;
        S[kunci] = fnc(S[kunci] + fna(6));
        cetak(''); cetak('YOUR ' + nama + ' IS NOW ' + S[kunci] + '.');
        return beliRamuan(i);
      }
      if (o === 'N') return beliRamuan(i + 1);
      cetak('** PLEASE ANSWER YES OR NO');
      beliRamuan(i);
    }, ['Y', 'N']);
  }
  function beliLampu() {                                       /* 7270-7380 */
    if (S.GP < 1000 || S.LF === 1) return;
    cetak('');
    minta("DO YOU WANT TO BUY A LAMP FOR 1000 GP'S", (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o === 'Y') {
        S.GP -= 1000; S.LF = 1;
        cetak(''); cetak("IT'S GUARANTEED TO OUTLIVE YOU!");
        return;
      }
      if (o === 'N') return;
      cetak('** PLEASE ANSWER YES OR NO');
      beliLampu();
    }, ['Y', 'N']);
  }

  /* ======================================================================
     Bagian 12 — akhir permainan
     ====================================================================== */
  function mati() {                                            /* 8840-8950 */
    cetak('');
    cetak('A NOBLE EFFORT, OH FORMERLY LIVING ' + ras() + '!', 'zot-bahaya');
    cetak('');
    let sebab = S.ST < 1 ? 'STRENGTH.' : S.IQ < 1 ? 'INTELLIGENCE.' : 'DEXTERITY.';
    cetak('YOU DIED DUE TO LACK OF ' + sebab);
    cetak('');
    cetak('AT THE TIME YOU DIED, YOU HAD :');
    ringkasan(true);
  }
  function keluarKastel() {                                    /* 8960-9120 */
    cetak('');
    cetak('YOU LEFT THE CASTLE WITH' + (S.OF === 0 ? 'OUT' : '') + ' THE ORB OF ZOT.');
    cetak('');
    if (S.OF !== 0) {
      cetak('AN INCREDIBLY GLORIOUS VICTORY!!', 'zot-menang');
      cetak('');
      cetak('IN ADDITION, YOU GOT OUT WITH THE FOLLOWING :');
      ringkasan(true);
    } else {
      cetak('A LESS THAN AWE-INSPIRING DEFEAT.');
      cetak('');
      cetak('WHEN YOU LEFT THE CASTLE, YOU HAD :');
      cetak('YOUR MISERABLE LIFE!');
      ringkasan(false);
    }
  }
  function keluarPermainan() {                                 /* 5800-5880 */
    cetak('');
    minta('DO YOU REALLY WANT TO QUIT NOW', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o !== 'Y') { cetak('** THEN DON\'T SAY THAT YOU DO!'); return; }
      cetak('');
      cetak('A LESS THAN AWE-INSPIRING DEFEAT.');
      cetak('');
      cetak('WHEN YOU LEFT THE CASTLE, YOU HAD :');
      cetak('YOUR MISERABLE LIFE!');
      ringkasan(false);
    }, ['Y', 'N']);
  }
  function ringkasan() {                                       /* 9130-9230 */
    for (let i = 1; i <= 8; i++) if (S.T[i] === 1) cetak(CS[i + 25]);
    cetak(WS[S.WV + 1] + ' AND ' + WS[S.AV + 5] + (S.LF === 1 ? ' AND A LAMP' : ''));
    cetak('');
    cetak('YOU ALSO HAD ' + S.FL + ' FLARES AND ' + S.GP + ' GOLD PIECES');
    if (S.RF === 1) cetak('AND THE RUNESTAFF');
    cetak('');
    cetak('AND IT TOOK YOU ' + S.turn + ' TURNS!');
    if (A.skor) {
      const n = A.skor.akhir(S);
      cetak('');
      cetak('Your score was ' + n);
      /* TEMPLE 10020-10027. Perhatikan: RANK$ hanya disetel oleh tujuh
         syarat, dan rentang 20000..35000 tidak disentuh satu pun. Di BASIC
         itu berarti RANK$ menyimpan nilai permainan SEBELUMNYA — atau
         string kosong pada permainan pertama. Ditiru persis: `pangkat`
         sengaja dibiarkan menyimpan nilai lamanya. */
      A.skor.peringkat.forEach(([batas, nama, arah]) => {
        if (arah === '<' ? n < batas : n > batas) pangkat = nama;
      });
      cetak('You are ranked as ' + pangkat);
      if (n > A.skor.tertinggi) {
        cetak('');
        cetak("Don't forget to replace my score on Tem-Ins.Bas", 'zot-menang');
      }
    }
    S.selesai = true;
    q('prompt').textContent = 'selesai';
    q('ketik').disabled = true;
    if (S.OF === 1) store.addHighScore('ZOT', Math.max(1, 10000 - S.turn));
    gambar();
    papanSkor();
  }

  /* ======================================================================
     Bagian 13 — gambar
     ====================================================================== */
  const SEL = 100;
  function pastikanDefs() {
    if (document.getElementById('zot-defs')) return;
    const d = document.createElement('div');
    d.id = 'zot-defs';
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<svg width="0" height="0">' + ART.DEFS + '</svg>';
    document.body.prepend(d);
  }

  function gambar() {
    pastikanDefs();
    const L = 8 * SEL;
    let s = '<svg class="zot-svg" viewBox="0 0 ' + L + ' ' + L + '" role="img" ' +
            'aria-label="Peta lantai ' + S.Z + ' kastel">';
    s += '<rect width="' + L + '" height="' + L + '" fill="#0b0e18"/>';
    for (let x = 1; x <= 8; x++) for (let y = 1; y <= 8; y++) {
      const px = (y - 1) * SEL, py = (x - 1) * SEL;
      const kode = kodeTampil(S.Z, x, y);
      const info = ART.KAMAR[kode];
      const kini = (x === S.X && y === S.Y);
      s += '<g class="zot-petak' + (kini ? ' zot-kini' : '') + '">';
      s += '<rect x="' + (px + 3) + '" y="' + (py + 3) + '" width="' + (SEL - 6) +
           '" height="' + (SEL - 6) + '" rx="7" fill="#141a28" stroke="' +
           (kini ? '#ffd76a' : '#242c40') + '" stroke-width="' + (kini ? 4 : 2) + '"/>';
      s += '<use href="#' + info[0] + '" x="' + (px + 16) + '" y="' + (py + 16) +
           '" width="68" height="68"/>';
      s += '<text x="' + (px + 12) + '" y="' + (py + 26) + '" font-size="19" ' +
           'font-family="ui-monospace,monospace" fill="#8d9ab5">' + info[1] + '</text>';
      s += '<title>(' + x + ',' + y + ') ' + info[2] + '</title>';
      s += '</g>';
    }
    s += '</svg>';
    q('peta').innerHTML = s;

    const set = (id, v) => { q(id).textContent = v; };
    set('s-ras', (S.RC ? ras() : '—') + (S.RC ? (S.SX === 1 ? ' ♂' : ' ♀') : ''));
    set('s-st', S.ST); set('s-iq', S.IQ); set('s-dx', S.DX);
    set('s-gp', S.GP); set('s-fl', S.FL); set('s-tc', S.TC);
    set('s-senjata', WS[S.WV + 1]);
    set('s-zirah', WS[S.AV + 5] + (S.LF === 1 ? ' + LAMP' : ''));
    set('s-posisi', '(' + S.X + ',' + S.Y + ') LEVEL ' + S.Z);
    set('s-lantai', S.Z);
    set('s-giliran', S.turn);
    const bawa = [];
    if (S.RF === 1) bawa.push('RUNESTAFF');
    if (S.OF === 1) bawa.push('ORB OF ZOT');
    if (S.BL === 1) bawa.push('BUTA');
    if (S.BF === 1) bawa.push('BUKU MELEKAT');
    set('s-bawa', bawa.length ? bawa.join(' · ') : '—');
    q('s-bawa').className = 'zot-nilai mono' + (S.OF === 1 ? ' zot-menangTeks' : '');
    q('harta').innerHTML = [1, 2, 3, 4, 5, 6, 7, 8].map(i =>
      '<span class="zot-permata' + (S.T[i] ? ' zot-punya' : '') + '">' +
      CS[i + 25].replace('THE ', '') + '</span>').join('');
    q('s-benih').textContent = String(S.benih >>> 0);
    /* TEMPLE 6450 menghitung skor PENUH di dalam rutin papan status, jadi
       angka peringkat sebenarnya sudah terlihat tiap giliran. Perintah '#'
       di 11050 memakai rumus yang SAMA SEKALI BERBEDA — lihat panel. */
    const kotakSkor = q('s-skor-box');
    if (kotakSkor) {
      kotakSkor.hidden = !A.skor;
      if (A.skor) set('s-skor', A.skor.akhir(S).toLocaleString('id-ID'));
    }
  }

  function papanSkor() {
    const l = store.highScores();
    q('skor').innerHTML = l.length
      ? l.slice(0, 5).map(x => '<li>' + x.score + '</li>').join('')
      : '<li class="zot-kecil">belum ada</li>';
  }

  /* ======================================================================
     Bagian 14 — tombol perintah
     ====================================================================== */
  const PERINTAH = [['N', 'NORTH'], ['S', 'SOUTH'], ['E', 'EAST'], ['W', 'WEST'],
                    ['U', 'UP'], ['D', 'DOWN'], ['DR', 'DRINK'], ['M', 'MAP'],
                    ['F', 'FLARE'], ['L', 'LAMP'], ['O', 'OPEN'], ['G', 'GAZE'],
                    ['T', 'TELEPORT'], ['H', 'HELP'], ['Q', 'QUIT']];
  function gambarTombol(opsi) {
    const daftar = opsi ? opsi.map(o => [o, o]) : PERINTAH;
    q('tombol').innerHTML = daftar.map(([k, n]) =>
      '<button type="button" class="btn btn--ghost btn--sm zot-tombol" data-v="' + k +
      '">' + n + '</button>').join('');
    q('tombol').querySelectorAll('[data-v]').forEach(bt =>
      bt.addEventListener('click', () => { q('ketik').value = bt.dataset.v; kirim(); }));
  }

  function kirim() {
    const v = q('ketik').value;
    q('ketik').value = '';
    terimaBaris(v);
    if (!tanya && !S.selesai) giliranBaru();
  }

  /* ======================================================================
     Bagian 15 — pembuatan tokoh, baris 2070-2880
     ====================================================================== */
  function buatTokoh() {
    cetak('ALL RIGHT, BOLD ONE.');
    cetak('YOU MAY BE AN ELF, DWARF, MAN, OR HOBBIT.');
    minta('YOUR CHOICE', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      for (let i = 1; i <= 4; i++) {
        const nama = (i === 3) ? S.RS3 : RS[i];                /* 1890: "MAN" */
        if (nama.slice(0, 1) === o) { S.RC = i; S.ST += 2 * i; S.DX -= 2 * i; }
      }
      /* 2150 OT=OT+4*(RC=1). (RC=1) bernilai -1, jadi ini MENGURANGI empat.
         Karena ST+DX selalu 16 untuk keempat ras, OT adalah satu-satunya
         yang membedakan mereka — dan Hobbit, ras terlemah, mendapat paling
         sedikit. Dipertahankan apa adanya; panel di kanan menjelaskannya. */
      S.OT = S.OT + 4 * b(S.RC === 1);
      if (S.RC === 0) {
        cetak('** THAT WAS INCORRECT. PLEASE TYPE E, D, M, OR H.');
        return buatTokoh();
      }
      cetak('');
      pilihKelamin();
    }, ['E', 'D', 'M', 'H']);
  }
  function pilihKelamin() {
    minta('WHICH SEX TO YOU PREFER', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o === 'M') S.SX = 1;
      else if (o !== 'F') {
        cetak('** CUTE ' + ras() + ', REAL CUTE. TRY M OR F.');
        return pilihKelamin();
      }
      cetak('');
      cetak('OK, ' + ras() + ', YOU HAVE THE FOLLOWING ATTRIBUTES :');
      cetak('STRENGTH = ' + S.ST + '  INTELLIGENCE = ' + S.IQ + '  DEXTERITY = ' + S.DX);
      cetak('AND ' + S.OT + ' OTHER POINTS TO ALLOCATE AS YOU WISH.');
      cetak('');
      bagiTitik(1);
    }, ['M', 'F']);
  }
  const SIFAT = [null, ['STRENGTH', 'ST'], ['INTELLIGENCE', 'IQ'], ['DEXTERITY', 'DX']];
  function bagiTitik(i) {
    if (i > 3 || S.OT === 0) return beliAwalZirah();
    const [nama, kunci] = SIFAT[i];
    minta('HOW MANY POINTS DO YOU WISH TO ADD TO YOUR ' + nama, (v) => {
      const n = Number(v);
      if (!(n >= 0 && n <= S.OT && n === Math.trunc(n))) {
        cetak('** ');
        return bagiTitik(i);
      }
      S.OT -= n; S[kunci] += n;
      bagiTitik(i + 1);
    });
  }
  function beliAwalZirah() {                                   /* 2410-2530 */
    cetak('');
    cetak('OK, ' + ras() + ", YOU HAVE 60 GOLD PIECES (GP'S).");
    cetak('THESE ARE THE TYPES OF ARMOR YOU CAN BUY :');
    cetak('PLATE<30> CHAINMAIL<20> LEATHER<10> NOTHING<0>');
    minta('YOUR CHOICE', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o !== 'N') {
        /* 2480: tiga perbandingan jadi satu angka 0..3, tanpa satu pun IF. */
        S.AV = -3 * b(o === 'P') - 2 * b(o === 'C') - b(o === 'L');
        if (S.AV <= 0) {
          cetak('');
          cetak('** ARE YOU A ' + ras() + ' OR ' + CS[fna(12) + 12] + '?');
          return beliAwalZirah();
        }
      }
      S.AH = S.AV * 7; S.GP -= S.AV * 10;
      cetak('');
      cetak('OK, BOLD ' + ras() + ', YOU HAVE ' + S.GP + " GP'S LEFT.");
      beliAwalSenjata();
    }, ['P', 'C', 'L', 'N']);
  }
  function beliAwalSenjata() {                                 /* 2560-2660 */
    cetak('THESE ARE THE TYPES OF WEAPONS YOU CAN BUY :');
    cetak('SWORD<30> MACE<20> DAGGER<10> NOTHING<0>');
    minta('YOUR CHOICE', (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o !== 'N') {
        S.WV = -3 * b(o === 'S') - 2 * b(o === 'M') - b(o === 'D');
        if (S.WV <= 0) {
          cetak('');
          cetak('** IS YOUR IQ REALLY ' + S.IQ + '?');
          return beliAwalSenjata();
        }
      }
      S.GP -= S.WV * 10;
      beliAwalLampu();
    }, ['S', 'M', 'D', 'N']);
  }
  function beliAwalLampu() {                                   /* 2670-2730 */
    if (S.GP < 20) return beliAwalSuar();
    cetak('');
    minta("DO YOU WANT TO BUY A LAMP FOR 20 GP'S", (v) => {
      const o = v.toUpperCase().slice(0, 1);
      if (o === 'Y') { S.LF = 1; S.GP -= 20; return beliAwalSuar(); }
      if (o === 'N') return beliAwalSuar();
      cetak('** PLEASE ANSWER YES OR NO');
      beliAwalLampu();
    }, ['Y', 'N']);
  }
  function beliAwalSuar() {                                    /* 2740-2860 */
    if (S.GP < 1) return masukKastel();
    cetak('');
    cetak('OK, ' + ras() + ', YOU HAVE ' + S.GP + ' GOLD PIECES LEFT.');
    minta('FLARES COST 1 GP EACH. HOW MANY DO YOU WANT', (v) => {
      const n = Math.trunc(Number(v));
      if (!(n >= 0)) { cetak("** IF YOU DON'T WANT ANY, JUST TYPE 0 (ZERO)."); return beliAwalSuar(); }
      if (n > S.GP) { cetak('** YOU CAN ONLY AFFORD ' + S.GP + '.'); return beliAwalSuar(); }
      S.FL += n; S.GP -= n;
      masukKastel();
    });
  }
  function masukKastel() {
    S.X = 1; S.Y = 4; S.Z = 1;
    cetak('');
    cetak('OK, ' + ras() + ', YOU ARE NOW ENTERING THE CASTLE!', 'zot-menang');
    masukKamar('');
    gambar();
  }

  /* ======================================================================
     Bagian 16 — pasang
     ====================================================================== */
  function permainanBaru(benih) {
    q('log').textContent = '';
    q('ketik').disabled = false;
    mulai(benih);
    cetak(A.judul, 'zot-judul');
    cetak('');
    A.cerita.forEach(t => cetak(t));
    cetak('');
    buatTokoh();
    gambar();
  }

  q('topbar-host').append(ui.topbar({ title: A.topbar, source: A.sumber }));

  q('kirim').addEventListener('click', kirim);
  q('ketik').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); kirim(); }
  });
  q('kabut').addEventListener('change', (e) => { sembunyikan = e.target.checked; gambar(); });
  q('baru').addEventListener('click', () => permainanBaru());
  q('ulangi').addEventListener('click', () => {
    const v = prompt('Nomor benih (angka):', String(S.benih >>> 0));
    if (v !== null && v !== '') permainanBaru(Number(v) | 0);
  });

  global.RETRO[A.ekspor] = { S, b, fnb, fnc, fne, kodeTampil, gambar,
                             terimaBaris, aturan: A,
                             get sembunyikan() { return sembunyikan; },
                             set sembunyikan(v) { sembunyikan = v; } };

  pastikanDefs();
  papanSkor();
  permainanBaru();
  };
})(window);
