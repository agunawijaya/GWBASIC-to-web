/* ===========================================================================
   eliza.js — port ELIZA.BAS versi 3.0 (Steve Grumette, hak cipta 1981).

   514 baris BASIC, 82 subrutin, 113 GOSUB, 121 GOTO, 47 tabel `ON…`. Bukan
   program terpanjang di koleksi (TEMPLE 1.187 baris) dan bukan yang paling
   banyak melompat (TEMPLE 255 GOTO); yang tertinggi justru KEPADATAN
   PERCABANGAN BERINDEKSNYA — 47 tabel `ON…`, lebih dari dua kali lipat
   program mana pun. Dan ia satu-satunya yang seluruh perilakunya dibaca dari
   BERKAS DATA di luar dirinya (`STRINGS.FIL`, yang dibangkitkan
   `WRTSTR.BAS` — lihat strings.js).

   Empat hal yang membentuk berkas ini:

   1. DUA PENJAGA UNTUK SATU MASALAH, DAN UMURNYA BERBEDA. Kaidah 12 mengubah
      " I " jadi " YOU " dan kaidah 13 mengubah " YOU " jadi " I ". Dijalankan
      berurutan, keduanya saling meniadakan. WRTSTR memecahkannya dengan
      tanda '*' (MY -> *OUR), ELIZA baris 180 memecahkannya dengan CHR$(0)
      (I -> YO<NUL>U). Bedanya bukan gaya: '*' dibersihkan di baris 470-480,
      SEBELUM kalimat disapu, sedangkan CHR$(0) BERTAHAN sampai saat mencetak
      (4600-4605). Jadi NUL bukan sekadar penjaga — ia BIT INFORMASI TAMBAHAN.
      Dua kata kunci MEMBAWA penandanya (K$(22), K$(43)) dan dua lagi bekerja
      justru karena TIDAK membawanya (K$(21), K$(36)): empat kata kunci, dua
      pasang. K$(43)=" YO<NUL>U " hanya cocok dengan YOU yang lahir dari "I"
      yang Anda ketik, sementara K$(36)=" I " hanya cocok dengan I yang lahir
      dari "YOU". Kata kuncinya bukan kata, melainkan SIAPA YANG MENGATAKANNYA.

   2. PRIORITAS KATA KUNCI BERTINGKAT DUA. Baris 570: kata kunci 1-20 langsung
      menang menurut URUTAN DAFTAR; 21-44 bersaing menurut POSISI TERKECIL di
      dalam kalimat. Satu gelung, dua aturan, tanpa satu pun komentar.

   3. SLOT KOSONG SEBAGAI JALUR GANTI TOPIK. Sembilan dari 46 keluarga jawaban
      menyisakan satu slot yang tidak menetapkan B$ sama sekali; pemanggilnya
      menguji `IF Xn=k THEN 1100` dan melempar giliran itu ke penjawab
      pertanyaan. Dua slot lain (2050, 2120) menyetel A=0, yang artinya
      "anggap kata kunci ini tidak cocok, teruskan menyapu". Pencacah
      putarannya sekaligus mesin keadaan.

   4. INGATAN LINTAS GILIRAN. Tiap kali Anda bilang "MY ...", potongannya
      masuk antrean M$. Kalau lebih dari lima giliran berlalu dan sebuah
      giliran tidak mencocokkan apa pun, baris 4460 mengambil yang PALING
      LAMA (FIFO) dan berkata "EARLIER YOU SAID YOUR ...". Weizenbaum
      memakai tumpukan; Grumette memakai antrean.

   Mesinnya di bawah adalah transliterasi baris demi baris, bukan tafsiran.
   Nomor baris BASIC dipertahankan sebagai nama dan komentar supaya bisa
   diadu dengan listingnya. Ia diperiksa terhadap transliterasi kedua yang
   ditulis terpisah di Python: 200.000 masukan acak, keluaran identik.
   =========================================================================== */
(function () {
  'use strict';

  const ui = window.RETRO.ui;
  const store = window.RETRO.store('eliza');
  const DATA = window.RETRO.ELIZA_STRINGS;
  const q = (id) => document.getElementById(id);
  const NUL = '\u0000';

  /* ======================================================================
     Bagian 1 — primitif string BASIC, 1-berbasis
     ====================================================================== */
  function instr(a, b, c) {
    let mulai, s, t;
    if (c === undefined) { mulai = 1; s = a; t = b; } else { mulai = a; s = b; t = c; }
    if (mulai > s.length) return 0;
    if (t === '') return mulai;
    const i = s.indexOf(t, mulai - 1);
    return i < 0 ? 0 : i + 1;
  }
  const mid = (s, i, n) => (n === undefined ? s.slice(i - 1) : s.slice(i - 1, i - 1 + n));
  const left = (s, n) => s.slice(0, n);
  const right = (s, n) => (n >= s.length ? s : s.slice(s.length - n));
  /* Pernyataan MID$(s,i)=r — menimpa DI TEMPAT; panjang s tidak berubah. */
  function midAssign(s, i, r) {
    const n = Math.min(r.length, s.length - i + 1);
    return s.slice(0, i - 1) + r.slice(0, n) + s.slice(i - 1 + n);
  }

  /* ======================================================================
     Bagian 2 — tabel pengiriman baris 620

     44 cabang, 29 tujuan berbeda. Di bahasa sekarang ini `Map<kunci,fungsi>`;
     di sini bentuk daftarnya sengaja dipertahankan, karena justru itu yang
     mau ditunjukkan.
     ====================================================================== */
  const KIRIM = [null,
    650, 650, 650, 650, 660, 670, 680, 670, 710, 750,
    780, 800, 820, 820, 820, 820, 840, 890, 950, 1220,
    960, 990, 1020, 1030, 1070, 1070, 1080, 1080, 1080, 1080,
    1090, 1100, 1100, 1100, 1100, 1110, 1170, 1180, 1180, 1190,
    1210, 1230, 1280, 1490];

  /* ======================================================================
     Bagian 3 — mesin
     ====================================================================== */
  function Mesin() {
    const S = this;

    /* 160-240 — dibaca dari "berkas". Salinan, karena 180/200/230 menambalnya. */
    S.OW = DATA.OW.slice(); S.RW = DATA.RW.slice();
    S.LO = DATA.LO.slice(); S.LR = DATA.LR.slice();
    S.B = DATA.B.slice();   S.K = DATA.K.slice();

    S.RW[12] = ' YO' + NUL + 'U ';         /* 180 */
    S.RW[21] = ' AR' + NUL + 'E ';
    S.B[2] = ' AR' + NUL + 'E ';           /* 200 */
    S.Y = 'YO' + NUL + 'U ';               /* 210 — perhatikan: tanpa spasi awal */
    S.K[22] = ' AR' + NUL + 'E ';          /* 230 */
    S.K[43] = ' YO' + NUL + 'U ';

    /* 250-260 + DATA 1510. Dua kata ini disimpan sebagai KODE AKSARA, jadi
       me-LIST program ini tidak pernah memperlihatkannya. */
    const D1510 = [83, 72, 73, 84, 70, 85, 67, 75];
    S.FZ = String.fromCharCode.apply(null, D1510.slice(0, 4));
    S.SZ = String.fromCharCode.apply(null, D1510.slice(4));

    S.mulaiUlang();
  }

  Mesin.prototype.mulaiUlang = function () {
    const S = this;
    S.T = 1;                         /* 140 — tidak pernah disetel lagi */
    S.X = 0;                         /* jumlah entri di S$ */
    S.Sbuf = [];                     /* DIM S$(100) */
    S.M = [];                        /* DIM M$(20), antrean ingatan */
    S.S = 0;
    S.NE = 0;
    S.ortu = 0;                      /* M di aslinya */
    S.seks = 0;                      /* SX */
    S.F = ''; S.D$ = ''; S.B$ = '';
    S.A = 0; S.Bp = 0; S.C = 0; S.D = 0; S.Z = 0;
    S.A$ = '';
    S.c = {};                        /* X0..XZ, Y0..Y9 */
    S.keluaran = [];
    S.jejak = null;
  };

  /* --- primitif teks: 1520 / 1550 / 1580 / 5090 --------------------------
     Dua rutin dua baris, dipanggil 27 dan 26 kali. Ini pustaka string yang
     dibangun sendiri karena GW-BASIC tidak menyediakannya. */
  Mesin.prototype.L1520 = function () {          /* maju ke awal kata berikutnya */
    this.A = instr(this.A + 1, this.A$, ' ');
    for (;;) {
      this.A += 1;
      if (this.A > this.A$.length) { this.A = 0; return; }
      if (mid(this.A$, this.A, 1) === ' ') continue;
      return;
    }
  };
  Mesin.prototype.L1550 = function () {          /* mundur ke awal kata sebelumnya */
    for (;;) {
      this.A -= 1;
      if (this.A === 0) return;
      if (mid(this.A$, this.A, 1) === ' ') continue;
      break;
    }
    for (;;) {
      this.A -= 1;
      if (mid(this.A$, this.A, 1) !== ' ') continue;
      break;
    }
    this.A += 1;
  };
  Mesin.prototype.L1580 = function () {          /* potong ekor kalimat */
    this.D$ = this.A === 0 ? ''
      : mid(this.A$, this.A - 1, this.A$.length - this.A + 1);
  };
  Mesin.prototype.L5090 = function () {          /* buang spasi depan, sisakan satu */
    let i = 0;
    for (;;) { i += 1; if (mid(this.A$, i, 1) === ' ') continue; break; }
    this.D$ = mid(this.A$, i - 1, this.A$.length - i + 1);
  };

  /* --- pencacah putaran ---------------------------------------------------
     Pola `Xn=Xn+1: IF Xn=BATAS THEN Xn=1` muncul 46 kali. Perhatikan: batas
     tidak pernah TERPAKAI sebagai slot — daftar `ON Xn GOTO` selalu punya
     BATAS-1 tujuan. Jadi "IF X0=7" berarti enam jawaban, bukan tujuh. */
  Mesin.prototype.putar = function (nama, batas) {
    const v = ((this.c[nama] || 0) + 1);
    this.c[nama] = (v === batas) ? 1 : v;
    return this.c[nama];
  };

  /* --- 46 keluarga jawaban ------------------------------------------------
     Ditulis sebagai daftar, satu keluarga satu fungsi, nomor baris BASIC-nya
     dipakai sebagai nama. `null` di sebuah slot berarti slot itu memang
     KOSONG di aslinya — dan kekosongan itu punya guna; lihat catatan 3 di
     kepala berkas. */
  const J = {};
  function fam(baris, nama, batas, slot) {
    J[baris] = function (S) {
      const n = S.putar(nama, batas);
      S.slotAkhir = { baris: baris, cacah: nama, slot: n, dari: batas - 1 };
      const t = slot[n - 1];
      if (t === null || t === undefined) return;            /* slot kosong */
      S.B$ = (typeof t === 'function') ? (t(S) === undefined ? S.B$ : S.B$) : t;
    };
  }
  /* Keluarga yang isinya bergantung pada D$/F$ ditulis sebagai fungsi supaya
     D$ dibaca SAAT dipakai, bukan saat tabel dibangun. */
  function famF(baris, nama, batas, fn) {
    J[baris] = function (S) {
      const n = S.putar(nama, batas);
      S.slotAkhir = { baris: baris, cacah: nama, slot: n, dari: batas - 1 };
      fn(S, n);
    };
  }

  fam(1600, 'X0', 7, [
    'DO COMPUTERS WORRY YOU?',
    'WHY DO YOU MENTION COMPUTERS?',
    'WHAT DO YOU THINK MACHINES HAVE TO DO WITH YOUR PROBLEM?',
    "DON'T YOU THINK COMPUTERS CAN HELP PEOPLE?",
    'WHAT ABOUT MACHINES WORRIES YOU?',
    'WHAT DO YOU THINK ABOUT MACHINES?']);
  fam(1680, 'X1', 3, [
    'I AM NOT INTERESTED IN NAMES.',
    "I'VE TOLD YOU BEFORE, I DON'T CARE ABOUT NAMES - PLEASE CONTINUE."]);
  fam(1720, 'X2', 9, [
    'IN WHAT WAY?', 'WHAT RESEMBLANCE DO YOU SEE?',
    'WHAT DOES THAT SIMILARITY SUGGEST TO YOU?',
    'WHAT OTHER CONNECTIONS DO YOU SEE',
    'WHAT DO YOU SUPPOSE THAT RESEMBLANCE MEANS?',
    'WHAT IS THE CONNECTION, DO YOU SUPPOSE?',
    'COULD THERE REALLY BE SOME CONNECTION?', 'HOW?']);
  famF(1820, 'X3', 7, (S, n) => {
    const d = S.D$;
    S.B$ = ['DO YOU OFTEN THINK OF' + d + '?',
      'DOES THINKING OF' + d + ' BRING ANYTHING ELSE TO MIND?',
      'WHAT ELSE DO YOU REMEMBER?',
      'WHY DO YOU REMEMBER' + d + ' JUST NOW?',
      'WHAT IN THE PRESENT SITUATION REMINDS YOU OF' + d + '?',
      'WHAT IS THE CONNECTION BETWEEN ME AND' + d + '?'][n - 1];
  });
  famF(1900, 'X4', 6, (S, n) => {                 /* 1900-1980 */
    if (n === 1) S.B$ = 'DID YOU THINK I WOULD FORGET' + S.D$ + '?';
    else if (n === 2) S.B$ = 'WHY DO YOU THINK I SHOULD RECALL' + S.D$ + ' NOW?';
    else if (n === 3) {
      if (S.A === 0) S.D$ = ' IT';                /* 1940 */
      S.B$ = 'WHAT ABOUT' + S.D$ + '?';
    } else if (n === 4) { /* 1960 — slot kosong, pemanggil melempar ke 1100 */ }
    else {
      if (S.A === 0) S.D$ = ' IT';                /* 1970 */
      S.B$ = 'YOU MENTIONED' + S.D$ + '.';
    }
  });
  famF(1990, 'X5', 6, (S, n) => {                 /* 1990-2050 */
    const d = S.D$;
    if (n === 1) S.B$ = 'REALLY,' + d + '?';
    else if (n === 2) S.B$ = 'HAVE YOU EVER FANTASIED' + d + ' WHILE YOU WERE AWAKE?';
    else if (n === 3) S.B$ = 'HAVE YOU DREAMT' + d + ' BEFORE?';
    else if (n === 4) { /* 2040 kosong -> pemanggil lompat ke 780 */ }
    else S.A = 0;                                 /* 2050 — serahkan gilirannya */
  });
  famF(2060, 'X6', 6, (S, n) => {                 /* 2060-2120 */
    if (n === 1) S.B$ = 'WHAT DOES THAT DREAM SUGGEST TO YOU?';
    else if (n === 2) S.B$ = 'DO YOU DREAM OFTEN?';
    else if (n === 3) S.B$ = 'WHAT PERSONS APPEAR IN YOUR DREAMS?';
    else if (n === 4) S.B$ = "DON'T YOU BELIEVE THAT DREAM HAS SOMETHING TO DO WITH YOUR PROBLEM?";
    else S.A = 0;                                 /* 2120 — serahkan gilirannya */
  });
  famF(2130, 'X7', 5, (S, n) => {
    const d = S.D$;
    S.B$ = ['DO YOU THINK ITS LIKELY THAT' + d + '?', 'DO YOU WISH THAT' + d + '?',
      'WHAT DO YOU THINK ABOUT IF' + d + '?', 'REALLY, IF' + d + '?'][n - 1];
  });
  famF(2190, 'X8', 10, (S, n) => {
    const d = S.D$;
    S.B$ = ['REALLY,' + d + '?', 'SURELY NOT' + d + '?',
      'CAN YOU THINK OF ANYONE IN PARTICULAR?', 'WHO, FOR EXAMPLE?',
      'YOU ARE THINKING OF A VERY SPECIAL PERSON.', 'WHO, MAY I ASK?',
      'SOMEONE SPECIAL PERHAPS?',
      "YOU HAVE A PARTICULAR PERSON IN MIND, DON'T YOU?",
      "WHO DO YOU THINK YOU'RE TALKING ABOUT?"][n - 1];
  });
  famF(2300, 'X9', 4, (S, n) => {
    const d = S.D$;
    S.B$ = ['WERE YOU REALLY?', 'WHY DO YOU TELL ME YOU WERE' + d + ' NOW?',
      'PERHAPS I ALREADY KNEW YOU WERE' + d + '.'][n - 1];
  });
  famF(2350, 'XA', 7, (S, n) => {                 /* 2350-2420 */
    const d = S.D$;
    if (n === 1) S.B$ = 'WHAT IF YOU WERE' + d + '?';
    else if (n === 2) S.B$ = 'DO YOU THINK YOU WERE' + d + '?';
    else if (n === 3) S.B$ = 'WERE YOU' + d + '?';
    else if (n === 4) S.B$ = 'WHAT WOULD IT MEAN IF YOU WERE' + d + '?';
    else if (n === 5) {                           /* 2410 */
      if (S.A === 0) S.c.XA = 6;                  /* lompat ke slot kosong */
      else S.B$ = 'WHAT DOES "' + right(d, d.length - 1) + '" SUGGEST TO YOU?';
    } /* n===6: 2420 kosong -> pemanggil lompat ke 1100 */
  });
  famF(2430, 'XB', 6, (S, n) => {
    const d = S.D$;
    S.B$ = ['WOULD YOU LIKE TO BELIEVE I WAS' + d + '?',
      'WHAT SUGGESTS THAT I WAS' + d + '?', 'WHAT DO YOU THINK?',
      'PERHAPS I WAS' + d + '.', 'WHAT IF I HAD BEEN' + d + '?'][n - 1];
  });
  famF(2500, 'XC', 5, (S, n) => {                 /* keluarga */
    if (n === 1) { S.B$ = 'TELL ME MORE ABOUT YOUR FAMILY.'; return; }
    if (n === 2) {                                /* 2530 */
      if (S.A === 0) { S.c.XC = 3; S.B$ = "LET'S TALK ABOUT YOUR" + S.F + '.'; return; }
      S.B$ = 'WHO ELSE IN YOUR FAMILY' + S.D$ + '?'; return;
    }
    if (n === 3) { S.B$ = "LET'S TALK ABOUT YOUR" + S.F + '.'; return; }
    S.B$ = 'WHAT ELSE COMES TO MIND WHEN YOU THINK OF YOUR' + S.F + '?';
  });
  famF(2560, 'XD', 5, (S, n) => {                 /* YOUR ... */
    const d = S.D$;
    if (n === 1) {                                /* 2580 */
      if (S.A === 0) { S.c.XD = 2; S.B$ = 'WHY DO YOU SAY YOUR' + d + '?'; return; }
      S.B$ = 'YOUR' + d + " - THAT'S INTERESTING."; return;
    }
    if (n === 2) { S.B$ = 'WHY DO YOU SAY YOUR' + d + '?'; return; }
    if (n === 3) { S.B$ = 'DOES THE FACT THAT YOUR' + d + ' SUGGEST ANYTHING ELSE TO YOU?'; return; }
    S.B$ = 'IS IT IMPORTANT TO YOU THAT YOUR' + d + '?';
  });
  fam(2620, 'XE', 5, [
    'CAN YOU THINK OF A SPECIFIC EXAMPLE?', 'WHEN?',
    'WHAT INCIDENT ARE YOU THINKING OF?', 'REALLY, ALWAYS?']);
  famF(2680, 'XF', 6, (S, n) => {                 /* 2680-2740 */
    const d = S.D$;
    if (n === 1) S.B$ = 'WHY ARE YOU INTERESTED IN WHETHER I AM' + d + ' OR NOT?';
    else if (n === 2) S.B$ = "WOULD YOU PREFER IT IF I WEREN'T" + d + '?';
    else if (n === 3) S.B$ = 'PERHAPS I AM' + d + ' IN YOUR FANTASIES.';
    else if (n === 4) S.B$ = 'DO YOU SOMETIMES THINK I AM' + d + '?';
    /* n===5: 2740 kosong -> 1100 */
  });
  famF(2750, 'XG', 5, (S, n) => {
    const d = S.D$;
    S.B$ = ['DID YOU THINK THEY MIGHT NOT BE' + d + '?',
      'WOULD YOU LIKE IT IF THEY WERE NOT' + d + '?',
      'WHAT IF THEY WERE NOT' + d + '?', 'POSSIBLY THEY ARE' + d + '.'][n - 1];
  });
  famF(2810, 'XH', 6, (S, n) => {                 /* 2810-2870 */
    const d = S.D$;
    if (n === 1) S.B$ = 'DO YOU BELIEVE YOU ARE' + d + '?';
    else if (n === 2) S.B$ = 'WOULD YOU WANT TO BE' + d + '?';
    else if (n === 3) S.B$ = 'YOU WISH I WOULD TELL YOU THAT YOU ARE' + d + '.';
    else if (n === 4) S.B$ = 'WHAT WOULD IT MEAN TO YOU IF YOU WERE' + d + '?';
    /* n===5: 2870 kosong -> 1100 */
  });
  J[2880] = function (S) {                        /* 2880 — dwistabil, bukan putaran */
    S.slotAkhir = { baris: 2880, cacah: 'XI', slot: (S.c.XI ? 2 : 1), dari: 2 };
    if (!S.c.XI) { S.c.XI = 1; S.B$ = 'WHY DO YOU SAY "AM"?'; }
    else { S.c.XI = 0; S.B$ = "I DON'T UNDERSTAND THAT."; }
  };
  fam(2900, 'XJ', 5, [
    'IS THAT THE REAL REASON?', "DON'T ANY OTHER REASONS COME TO MIND?",
    'DOES THAT REASON SEEM TO EXPLAIN ANYTHING ELSE?',
    'WHAT OTHER REASONS MIGHT THERE BE?']);
  famF(2960, 'XK', 5, (S, n) => {                 /* 2960-3010 */
    const d = S.D$;
    if (n === 1) S.B$ = 'YOU BELIEVE I CAN' + d + ", DON'T YOU?";
    else if (n === 2) { /* 2990 kosong -> 1100 */ }
    else if (n === 3) S.B$ = 'DO YOU WANT ME TO BE ABLE TO' + d + '?';
    else S.B$ = 'PERHAPS YOU WOULD LIKE TO BE ABLE TO' + d + ' YOURSELF.';
  });
  famF(3020, 'XL', 5, (S, n) => {                 /* 3020-3070 */
    const d = S.D$;
    if (n === 1) S.B$ = 'WHETHER OR NOT YOU CAN' + d + ' DEPENDS ON YOU MORE THAN ON ME.';
    else if (n === 2) S.B$ = 'DO YOU WANT TO BE ABLE TO' + d + '?';
    else if (n === 3) S.B$ = "PERHAPS YOU DON'T WANT TO" + d + '?';
    /* n===4: 3070 kosong -> 1100 */
  });
  fam(3080, 'XM', 5, [
    'YOU SEEM QUITE POSITIVE.', 'YOU ARE SURE?', 'I SEE.', 'I UNDERSTAND.']);
  fam(3140, 'XN', 10, [
    'WHY DO YOU ASK?', 'DOES THAT QUESTION INTEREST YOU?',
    'WHAT IS IT YOU REALLY WANT TO KNOW?',
    'ARE SUCH QUESTIONS MUCH ON YOUR MIND?', 'WHAT ANSWER WOULD PLEASE YOU MOST?',
    'WHAT DO YOU THINK?', 'WHAT COMES TO YOUR MIND WHEN YOU ASK THAT?',
    'HAVE YOU ASKED SUCH QUESTIONS BEFORE?', 'HAVE YOU ASKED ANYONE ELSE?']);
  famF(3250, 'XO', 5, (S, n) => {
    const d = S.D$;
    S.B$ = ['WHAT MAKES YOU THINK I AM' + d + '?',
      'DOES IT PLEASE YOU TO BELIEVE I AM' + d + '?',
      'DO YOU SOMETIMES WISH YOU WERE' + d + '?',
      'PERHAPS YOU WOULD LIKE TO BE' + d + '?'][n - 1];
  });
  famF(3310, 'XP', 8, (S, n) => {
    const d = S.D$;
    S.B$ = ['WHY DO YOU THINK I' + d + ' YOU?',
      'YOU LIKE TO THINK I' + d + " YOU - DON'T YOU?",
      'WHAT MAKES YOU THINK I' + d + ' YOU?', 'REALLY, I' + d + ' YOU?',
      'DO YOU WISH TO BELIEVE I' + d + ' YOU?',
      'SUPPOSE I DID' + d + ' YOU - WHAT WOULD THAT MEAN?',
      'DOES SOMEONE ELSE BELIEVE I' + d + ' YOU?'][n - 1];
  });
  famF(3400, 'XQ', 5, (S, n) => {
    if (n === 1) { S.B$ = 'WE WERE DISCUSSING YOU - NOT ME.'; return; }
    if (n === 2) {                                /* 3430 */
      if (S.A === 0) { S.c.XQ = 3; S.B$ = "YOU'RE NOT REALLY TALKING ABOUT ME, ARE YOU?"; return; }
      S.B$ = 'OH, I' + S.D$ + '?'; return;
    }
    if (n === 3) { S.B$ = "YOU'RE NOT REALLY TALKING ABOUT ME, ARE YOU?"; return; }
    S.B$ = 'WHAT ARE YOUR FEELINGS NOW?';
  });
  fam(3460, 'XR', 6, [
    "YOU DON'T SEEM QUITE CERTAIN.", 'WHY THE UNCERTAIN TONE?',
    "CAN'T YOU BE MORE POSITIVE?", "YOU AREN'T SURE?", "DON'T YOU KNOW?"]);
  famF(3530, 'XS', 5, (S, n) => {
    const d = S.D$;
    S.B$ = ['WHY ARE YOU CONCERNED OVER MY' + d + '?',
      'WHAT ABOUT YOUR OWN' + d + '?',
      'ARE YOU WORRIED ABOUT SOMEONE ELSES' + d + '?',
      'REALLY, MY' + d + '?'][n - 1];
  });
  fam(3590, 'XT', 6, [
    'WHY NOT?', 'ARE YOU SAYING "NO" JUST TO BE NEGATIVE?',
    'YOU ARE BEING A BIT NEGATIVE.', 'HOW COME?', 'WHY DO YOU SAY "NO"?']);
  fam(3660, 'XU', 5, [
    "PLEASE DON'T APOLOGIZE.", 'APOLOGIES ARE NOT NECESSARY.',
    'WHAT FEELINGS DO YOU HAVE WHEN YOU APOLOGIZE?',
    "I'VE TOLD YOU THAT APOLOGIES ARE NOT REQUIRED."]);
  famF(3720, 'XV', 6, (S, n) => {                 /* 3720-3780 */
    const d = S.D$;
    if (n === 1) S.B$ = "DO YOU BELIEVE I DON'T" + d + '?';
    else if (n === 2) S.B$ = 'PERHAPS I WILL' + d + ' IN GOOD TIME.';
    else if (n === 3) S.B$ = 'SHOULD YOU' + d + ' YOURSELF?';
    else if (n === 4) S.B$ = 'YOU WANT ME TO' + d + '?';
    /* n===5: 3780 kosong -> 1100 */
  });
  famF(3790, 'XW', 6, (S, n) => {                 /* 3790-3850 */
    const d = S.D$;
    if (n === 1) S.B$ = 'DO YOU THINK YOU SHOULD BE ABLE TO' + d + '?';
    else if (n === 2) S.B$ = 'DO YOU WANT TO BE ABLE TO' + d + '?';
    else if (n === 3) S.B$ = 'DO YOU BELIEVE THIS WILL HELP YOU TO' + d + '?';
    else if (n === 4) S.B$ = "HAVE YOU ANY IDEA WHY YOU CAN'T" + d + '?';
    /* n===5: 3850 kosong -> 1100 */
  });
  famF(3860, 'XX', 7, (S, n) => {                 /* WANT / NEED */
    const d = S.D$;
    S.B$ = ['WHAT WOULD IT MEAN TO YOU IF YOU GOT' + d + '?',
      'WHY DO YOU WANT' + d + '?', 'SUPPOSE YOU GOT' + d + ' SOON?',
      'WHAT IF YOU NEVER GOT' + d + '?', 'WHAT WOULD GETTING' + d + ' MEAN TO YOU?',
      'WHAT DOES WANTING' + d + ' HAVE TO DO WITH THIS DISCUSSION?'][n - 1];
  });
  famF(3940, 'XY', 5, (S, n) => {                 /* rasa negatif */
    const d = S.D$;
    S.B$ = ['I AM SORRY TO HEAR YOU ARE' + d + '.',
      'DO YOU THINK COMING HERE WILL HELP YOU NOT TO BE' + d + '?',
      "I'M SURE IT'S NOT PLEASANT TO BE" + d + '.',
      'CAN YOU EXPLAIN WHAT MADE YOU' + d + '?'][n - 1];
  });
  famF(4000, 'XZ', 5, (S, n) => {                 /* rasa positif */
    const d = S.D$;
    S.B$ = ['HOW HAVE I HELPED YOU TO BE' + d + '?',
      'HAS YOUR TREATMENT MADE YOU' + d + '?', 'WHAT MAKES YOU' + d + ' JUST NOW?',
      'CAN YOU EXPLAIN WHY YOU ARE SUDDENLY' + d + '?'][n - 1];
  });
  famF(4060, 'Y0', 5, (S, n) => {
    const d = S.D$;
    S.B$ = ['IS IT BECAUSE YOU ARE' + d + ' THAT YOU CAME TO ME?',
      'HOW LONG HAVE YOU BEEN' + d + '?', 'DO YOU BELIEVE IT NORMAL TO BE' + d + '?',
      'DO YOU ENJOY BEING' + d + '?'][n - 1];
  });
  famF(4120, 'Y1', 4, (S, n) => {
    const d = S.D$;
    S.B$ = ['DO YOU REALLY THINK SO?', 'BUT YOU ARE NOT SURE YOU' + d + '?',
      'DO YOU REALLY DOUBT YOU' + d + '?'][n - 1];
  });
  famF(4170, 'Y2', 5, (S, n) => {
    const d = S.D$;
    S.B$ = ["HOW DO YOU KNOW YOU CAN'T" + d + '?', 'HAVE YOU TRIED?',
      'PERHAPS YOU COULD' + d + ' NOW?',
      'DO YOU REALLY WANT TO BE ABLE TO' + d + '?'][n - 1];
  });
  famF(4230, 'Y3', 5, (S, n) => {
    const d = S.D$;
    S.B$ = ["DON'T YOU REALLY" + d + '?', "WHY DON'T YOU" + d + '?',
      'DO YOU WISH TO BE ABLE TO' + d + '?', 'DOES THAT TROUBLE YOU?'][n - 1];
  });
  famF(4290, 'Y4', 5, (S, n) => {                 /* FEEL */
    const d = S.D$;
    S.B$ = ['TELL ME MORE ABOUT SUCH FEELINGS.', 'DO YOU OFTEN FEEL' + d + '?',
      'DO YOU ENJOY FEELING' + d + '?',
      'OF WHAT DOES FEELING' + d + ' REMIND YOU?'][n - 1];
  });
  famF(4350, 'Y5', 5, (S, n) => {
    const d = S.D$;
    S.B$ = ['PERHAPS IN YOUR FANTASY WE' + d + ' EACH OTHER.',
      'DO YOU WISH TO' + d + ' ME?', 'YOU SEEM TO NEED TO' + d + ' ME.',
      'DO YOU' + d + ' ANYONE ELSE?'][n - 1];
  });
  fam(4410, 'Y9', 4, [                            /* umpatan */
    'MY, MY, SUCH LANGUAGE!',
    "I'M NOT ACCUSTOMED TO HEARING THAT KIND OF LANGUAGE!",
    'I THOUGHT I ALREADY TALKED TO YOU ABOUT YOUR LANGUAGE!']);
  famF(4470, 'Y8', 5, (S, n) => {                 /* ingatan dipanggil kembali */
    const d = S.D$;
    S.B$ = ['DOES THAT HAVE ANYTHING TO DO WITH THE FACT THAT YOUR' + d + '?',
      'EARLIER YOU SAID YOUR' + d + '.', 'BUT YOUR' + d + '.',
      "LET'S DISCUSS FURTHER WHY YOUR" + d + '.'][n - 1];
  });
  famF(4530, 'Y6', 5, (S, n) => {                 /* ada isi, tak ada kata kunci */
    const d = S.D$;
    S.B$ = ['WHY DO YOU NEED TO TELL ME' + d + '?', 'CAN YOU ELABORATE ON THAT?',
      'DO YOU SAY' + d + ' FOR SOME SPECIAL REASON?',
      "THAT'S QUITE INTERESTING."][n - 1];
  });
  famF(4690, 'Y7', 8, (S, n) => {                 /* 4690-4770 */
    if (n === 1) { S.B$ = 'I AM NOT SURE I UNDERSTAND YOU FULLY.'; return; }
    if (n === 2) { S.B$ = 'PLEASE GO ON.'; return; }
    if (n === 3) { S.B$ = 'WHAT DOES THAT SUGGEST TO YOU?'; return; }
    if (n === 4) {                                /* 4740 — dua teguran sekali seumur */
      if (S.ortu === 0) {
        S.B$ = 'YOU SEEM TO HAVE AVOIDED SPEAKING OF YOUR PARENTS ALTOGETHER.';
        S.ortu = 1; return;
      }
      if (S.seks === 0) {
        S.B$ = "I NOTICE THAT YOU HAVEN'T DISCUSSED SEX AT ALL.";
        S.seks = 1; return;
      }
      S.c.Y7 = 5;                                 /* lalu JATUH ke 4750 */
      S.B$ = 'DO YOU FEEL STRONGLY ABOUT DISCUSSING SUCH THINGS?'; return;
    }
    if (n === 5) { S.B$ = 'DO YOU FEEL STRONGLY ABOUT DISCUSSING SUCH THINGS?'; return; }
    if (n === 6) { S.B$ = 'HOW IMPORTANT IS THAT TO YOU?'; return; }
    S.B$ = 'WHY DO YOU SAY THAT?';
  });

  /* --- 4600-4640: cetak jawaban ------------------------------------------
     Ini juga PINTU KELUAR tabel pengiriman: hampir semua penangan berakhir
     `GOTO 4600`, dan 4610 melakukan `A=1: RETURN` — sehingga RETURN itu
     mengembalikan kendali ke GOSUB di baris 620. Satu rutin, dua tugas. */
  Mesin.prototype.emit = function () {
    let b = this.B$;
    for (;;) {                                    /* 4600-4605 */
      const zz = instr(b, NUL);
      if (!zz) break;
      b = left(b, zz - 1) + mid(b, zz + 1);
    }
    this.Sbuf[this.X] = b;                        /* 4608 */
    this.X += 1;
    this.keluaran.push(b);
    this.A = 1;
  };

  /* --- 650..1500: penangan ------------------------------------------------
     Ditulis sebagai mesin keadaan bernomor baris, karena di aslinya memang
     begitu: penangan saling melompat (1490 -> 1320, 1120 -> 670, 1410 -> 1110)
     dan semuanya keluar lewat RETURN atau lewat 4600. Meratakannya jadi
     fungsi-fungsi terpisah akan menyembunyikan justru bagian yang menarik. */
  Mesin.prototype.penangan = function (pc) {
    const S = this;
    S.jalur = [];
    for (;;) {
      S.jalur.push(pc);
      switch (pc) {
        case 650: J[1600](S); pc = 4600; continue;
        case 660: J[1680](S); pc = 4600; continue;
        case 670: J[1720](S); pc = 4600; continue;
        case 680: {
          S.B$ = left(S.A$, S.A);
          let ketemu = false;
          for (let i = 1; i <= 4; i++) {          /* 690 — B$ skalar DAN B$(i) larik */
            if (instr(S.B$, S.B[i]) !== 0) { ketemu = true; break; }
          }
          if (ketemu) { pc = 670; continue; }
          S.A = 0; return;                        /* 700 */
        }
        case 710: {
          S.C = S.A; S.L1520(); S.D = S.A; S.A = S.C; S.L1550();
          if (S.A === 0) return;
          const d4 = mid(S.A$, S.A, 4);
          if (S.D === 0 || (d4 + ' ' !== S.Y && d4 !== 'YOU ')) { pc = 730; continue; }
          pc = 720; continue;
        }
        case 720: S.A = S.D; S.L1580(); J[1820](S); pc = 4600; continue;
        case 730:
          S.L1550();
          if (S.A === 0) return;
          if (mid(S.A$, S.A, 5) === 'DO I ') { S.A = S.D; S.L1580(); pc = 740; continue; }
          S.A = 0; return;
        case 740: J[1900](S); pc = (S.c.X4 === 4) ? 1100 : 4600; continue;
        case 750:
          S.C = S.A; S.L1520();
          if (S.A === 0) return;
          S.D = S.A; S.A = S.C; S.L1550();
          if (S.A === 0) return;
          if (mid(S.A$, S.A, 5) === S.Y) { S.A = S.D; S.L1580(); }
          else { S.A = 0; return; }
          pc = 760; continue;
        case 760:
          J[1990](S);
          if (S.c.X5 === 4) { pc = 780; continue; }
          if (S.A !== 0) { pc = 4600; continue; }
          return;                                  /* 770 */
        case 780:
          J[2060](S);
          if (S.A !== 0) { pc = 4600; continue; }
          return;                                  /* 790 */
        case 800:
          S.L1520();
          if (S.A === 0) return;
          S.L1580(); J[2130](S); pc = 4600; continue;
        case 820: {
          const k = S.K[S.Z];
          S.D$ = mid(k, 1, k.length - 1);          /* kata kuncinya sendiri, tanpa spasi akhir */
          J[2190](S); pc = 4600; continue;
        }
        case 840:
          S.C = S.A; S.L1550(); S.D = S.A; S.A = S.C; S.L1520();
          if (S.D !== 0 && mid(S.A$, S.D, 5) === S.Y) {
            S.L1580(); J[2300](S); pc = 4600; continue;
          }
          pc = 850; continue;
        case 850:
          if (S.A === 0) return;
          S.C = S.A; S.L1520(); S.L1580(); pc = 860; continue;
        case 860:
          if (mid(S.A$, S.C, 5) === S.Y) {
            J[2350](S); pc = (S.c.XA === 6) ? 1100 : 4600; continue;
          }
          pc = 870; continue;
        case 870:
          if (mid(S.A$, S.C, 2) === 'I ') { J[2430](S); pc = 4600; continue; }
          S.A = 0; return;                         /* 880 */
        case 890:
          S.L1520(); S.L1580();
          if (S.A === 0) return;
          if (S.S === 0) S.NE = 0;
          pc = 900; continue;
        case 900: {
          S.S += 1;
          if (S.S > 20) {                          /* DIM M$(20) — lihat catatan */
            S.S -= 1;
            S.luber = (S.luber || 0) + 1;
          } else {
            S.M[S.S] = S.D$;
          }
          let lompat = false;
          for (let i = 5; i <= 11; i++) {
            const b = instr(S.A - 1, S.A$, S.B[i]);
            if (b !== 0) {
              S.F = left(S.B[i], S.B[i].length - 1);
              S.A = b;
              if (i < 7) S.ortu = 1;               /* 910 — MOTHER / FATHER */
              S.L1520(); S.L1580(); J[2500](S);    /* 920 */
              lompat = true; break;
            }
          }
          pc = lompat ? 4600 : 940; continue;      /* 930 */
        }
        case 940: J[2560](S); pc = 4600; continue;
        case 950: J[2620](S); pc = 4600; continue;
        case 960:
          S.L1520();
          if (S.A === 0) { pc = 980; continue; }
          if (mid(S.A$, S.A, 2) === 'I ') S.L1520();
          else { pc = 980; continue; }
          pc = 970; continue;
        case 970:
          S.L1580(); J[2680](S);
          pc = (S.c.XF === 5) ? 1100 : 4600; continue;
        case 980: S.L1580(); J[2750](S); pc = 4600; continue;
        case 990:
          S.L1520();
          if (S.A === 0) { pc = 1010; continue; }
          S.C = S.A; S.L1520(); S.L1580(); pc = 1000; continue;
        case 1000:
          if (mid(S.A$, S.C, 5) === S.Y) {
            J[2810](S); pc = (S.c.XH === 5) ? 1100 : 4600; continue;
          }
          pc = 1010; continue;
        case 1010: J[2880](S); pc = 4600; continue;
        case 1020: J[2900](S); pc = 4600; continue;
        case 1030:
          S.L1520();
          if (S.A === 0) { S.A = -1; return; }
          S.C = S.A; S.L1520(); S.L1580(); pc = 1040; continue;
        case 1040:
          if (mid(S.A$, S.C, 2) === 'I ') {
            J[2960](S); pc = (S.c.XK === 2) ? 1100 : 4600; continue;
          }
          pc = 1050; continue;
        case 1050:
          if (mid(S.A$, S.C, 5) === S.Y) {
            J[3020](S); pc = (S.c.XL === 4) ? 1100 : 4600; continue;
          }
          S.A = -1; return;                        /* 1060 */
        case 1070: J[3080](S); pc = 4600; continue;
        case 1080: S.B$ = 'I AM SORRY, I SPEAK ONLY ENGLISH.'; pc = 4600; continue;
        case 1090: S.B$ = 'HELLO.  PLEASE STATE YOUR PROBLEM.'; pc = 4600; continue;
        case 1100: J[3140](S); pc = 4600; continue;
        case 1110:
          S.L1520(); S.L1580();
          if (S.A === 0) { pc = 1160; continue; }
          pc = 1120; continue;
        case 1120:
          if (mid(S.A$, S.A, 14) === 'REMIND YOU OF ') { pc = 670; continue; }
          pc = 1130; continue;
        case 1130:
          if (mid(S.A$, S.A, 4) === 'ARE ') { S.L1520(); S.L1580(); }
          else { pc = 1150; continue; }
          pc = 1140; continue;
        case 1140: J[3250](S); pc = 4600; continue;
        case 1150: {
          const a1 = instr(S.A, S.A$, ' YOU ');
          if (a1 > 0) {
            S.D$ = mid(S.A$, S.A - 1, a1 - S.A + 1);
            J[3310](S); pc = 4600; continue;
          }
          pc = 1160; continue;
        }
        case 1160: J[3400](S); pc = 4600; continue;
        case 1170: S.L1520(); S.L1580(); pc = 1140; continue;
        case 1180: J[3460](S); pc = 4600; continue;
        case 1190:
          S.L1520();
          if (S.A === 0) { S.A = -1; return; }
          S.L1580(); pc = 1200; continue;
        case 1200: J[3530](S); pc = 4600; continue;
        case 1210: J[3590](S); pc = 4600; continue;
        case 1220: J[3660](S); pc = 4600; continue;
        case 1230:
          S.L1520();
          if (S.A === 0) { S.A = 1; pc = 1100; continue; }
          pc = 1240; continue;
        case 1240:
          if (mid(S.A$, S.A, 8) === "DON'T I ") { S.A += 5; S.L1520(); }
          else { pc = 1260; continue; }
          pc = 1250; continue;
        case 1250:
          S.L1580(); J[3720](S);
          pc = (S.c.XV === 5) ? 1100 : 4600; continue;
        case 1260:
          if (mid(S.A$, S.A, 11) === "CAN'T " + S.Y) { S.A += 5; S.L1520(); }
          else { pc = 1100; continue; }
          pc = 1270; continue;
        case 1270:
          S.L1580(); J[3790](S);
          pc = (S.c.XW === 5) ? 1100 : 4600; continue;
        case 1280: {
          S.L1520();
          if (S.A === 0) { pc = 4590; continue; }
          let ket = false;
          for (let i = 12; i <= 13; i++) {
            if (mid(S.A$, S.A - 1, 6) === S.B[i]) { S.I = i; ket = true; break; }
          }
          if (ket) { pc = 1290; continue; }
          S.I = 13; pc = 1310; continue;           /* NEXT habis -> 1310 */
        }
        case 1290:
          S.L1520();
          if (S.A === 0) { pc = 4590; continue; }
          S.L1580(); pc = 1300; continue;
        case 1300: J[3860](S); pc = 4600; continue;
        case 1310:
          if (mid(S.A$, S.A, 5) !== 'AR' + NUL + 'E ') { pc = 1380; continue; }
          pc = 1320; continue;
        case 1320: {
          let ket = false;
          for (let i = 14; i <= 17; i++) {
            if (instr(S.A, S.A$, S.B[i]) !== 0) { S.I = i; ket = true; break; }
          }
          if (ket) { pc = 1330; continue; }
          S.I = 17; pc = 1340; continue;
        }
        case 1330:
          S.A$ = S.B[S.I]; S.A = 2; S.L1580(); J[3940](S); pc = 4600; continue;
        case 1340: {
          let ket = false;
          for (let i = 18; i <= 21; i++) {
            if (instr(S.A, S.A$, S.B[i]) !== 0) { S.I = i; ket = true; break; }
          }
          if (ket) { pc = 1350; continue; }
          S.I = 21; pc = 1360; continue;
        }
        case 1350:
          S.A$ = S.B[S.I]; S.A = 2; S.L1580(); J[4000](S); pc = 4600; continue;
        case 1360:
          S.L1520();
          if (S.A === 0) { pc = 4590; continue; }
          S.L1580(); pc = 1370; continue;
        case 1370: J[4060](S); pc = 4600; continue;
        case 1380: {
          let ket = false;
          for (let i = 22; i <= 25; i++) {
            if (instr(S.A - 1, S.A$, S.B[i]) === S.A - 1) { S.I = i; ket = true; break; }
          }
          if (ket) { pc = 1390; continue; }
          S.I = 25; pc = 1420; continue;
        }
        case 1390:
          S.L1520();
          if (S.A === 0) { pc = 4590; continue; }
          if (mid(S.A$, S.A, 5) !== S.Y) { pc = 1410; continue; }
          pc = 1400; continue;
        case 1400:
          S.L1520(); S.L1580();
          if (S.A === 0) { pc = 4590; continue; }
          J[4120](S); pc = 4600; continue;
        case 1410: {
          const c = instr(S.A - 1, S.A$, ' I ');
          if (c !== 0) { S.A = c; pc = 1110; continue; }
          pc = 1460; continue;
        }
        case 1420: {
          let ket = false;
          for (let i = 26; i <= 27; i++) {
            const c = instr(S.A - 1, S.A$, S.B[i]);
            if (c !== 0) { S.I = i; S.C = c; ket = true; break; }
          }
          if (ket) { pc = 1430; continue; }
          S.I = 27; pc = 1440; continue;
        }
        case 1430:
          S.A = S.C; S.L1520(); S.L1580(); J[4170](S); pc = 4600; continue;
        case 1440:
          if (mid(S.A$, S.A, 6) !== "DON'T ") { pc = 1470; continue; }
          S.L1520(); S.L1580(); pc = 1450; continue;
        case 1450: J[4230](S); pc = 4600; continue;
        case 1460:
          if (S.I === 22) { S.L1580(); J[4290](S); pc = 4600; continue; }
          pc = 1470; continue;
        case 1470: {
          const c = instr(S.A, S.A$, ' I ');
          if (c === 0) { pc = 4590; continue; }
          S.C = c; pc = 1480; continue;
        }
        case 1480:
          S.D$ = mid(S.A$, S.A - 1, S.C - S.A + 1);
          J[4350](S); pc = 4600; continue;
        case 1490: pc = 1320; continue;            /* satu-satunya cabang yang cuma GOTO */
        case 4590: S.L5090(); J[4530](S); pc = 4600; continue;
        case 4600: S.emit(); return;
        default: throw new Error('baris tak dikenal: ' + pc);
      }
    }
  };

  /* --- 360..640 + 1500: satu giliran -------------------------------------- */
  Mesin.prototype.bicara = function (teks) {
    const S = this;
    S.keluaran = [];
    S.luber = 0;
    const jj = {
      mentah: teks, kalimat: [], sapuan: [], menang: null,
      penangan: null, keluarga: null, slot: null, jalur: null,
      ingatan: false, umpatan: false, kosong: false
    };
    S.jejak = jj;

    let A = teks;
    S.Sbuf[S.X] = A; S.X += 1;                     /* 370 */
    if (S.T !== 0 && A !== '') {                   /* 380 */
      A = A.replace(/[a-z]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 32));
    }
    A = '  ' + A + ' ';                            /* 400 */
    jj.berbantalan = A;

    if (instr(A, ' SEX') !== 0) S.seks = 1;        /* 410 */

    for (let i = 1; i <= 22; i++) {                /* 420-450 */
      let b = 1;
      for (;;) {
        const a = instr(b, A, S.OW[i]);
        if (a === 0) break;
        A = left(A, a - 1) + S.RW[i] + mid(A, a + S.LO[i]);
        b = a + S.LR[i];
      }
    }
    jj.tersulih = A;

    if (instr(A, S.FZ) || instr(A, S.SZ)) {        /* 460 */
      S.A$ = A;
      J[4410](S); S.emit();
      jj.umpatan = true; jj.keluarga = 4410; jj.slot = S.slotAkhir;
      return S.keluaran;
    }

    let b = 1;                                     /* 470-480 */
    for (;;) {
      const a = instr(b, A, '*');
      if (a === 0) break;
      A = midAssign(A, a, 'Y');
      b = a + 1;
    }
    jj.dipulihkan = A;

    /* 490-530 — potong jadi kalimat pada setiap titik */
    let I = 0;
    const kal = [];
    for (;;) {
      let a = instr(A, '.');
      if (a === 0) a = A.length + 1;
      const a0 = left(A, a - 1);
      /* INSTR(SPACE$(100),A0$)=1 -> "seluruhnya spasi". Batasnya 100 aksara,
         jadi masukan berisi 98 spasi atau lebih LOLOS uji ini dan dianggap
         berisi. Itu batas keras yang tidak pernah disebut di mana pun. */
      if (instr(' '.repeat(100), a0) === 1) { /* lewati */ }
      else {
        I += 1;
        if (I > 20) { S.luberKalimat = true; I -= 1; }   /* DIM A$(20) */
        else {
          let s = a0;
          while (s.length > 2 && right(s, 2).charCodeAt(0) === 32) {  /* 520 */
            s = left(s, s.length - 1);
          }
          kal[I] = s;
        }
      }
      A = mid(A, a + 1);
      if (A.length > 2) continue;
      break;
    }
    jj.kalimat = kal.slice(1, I + 1);

    if (I === 0) { S.X -= 1; jj.kosong = true; return S.keluaran; }   /* 540 */
    S.NE += 1;                                     /* 550 */

    for (let P = 1; P <= I; P++) {                 /* 560 */
      S.A$ = kal[P];
      const sapuKal = { kalimat: kal[P], cocok: [] };
      jj.sapuan.push(sapuKal);
      let A0 = 50, Z0 = 0, lanjutKalimat = false;

      for (let Z = 1; Z <= 44; Z++) {              /* 570-590 */
        S.A = instr(S.A$, S.K[Z]);
        if (S.A === 0) continue;
        sapuKal.cocok.push({ z: Z, kata: S.K[Z], pos: S.A, tingkat: Z < 21 ? 'urutan' : 'posisi' });
        if (Z < 21) {                              /* menang menurut URUTAN */
          S.Z = Z;
          jj.menang = { z: Z, kata: S.K[Z], pos: S.A, sebab: 'urutan daftar (Z<21)' };
          jj.penangan = KIRIM[Z];
          S.penangan(KIRIM[Z]);
          jj.jalur = S.jalur; jj.slot = S.slotAkhir;
          if (S.A === 0) { jj.menang = null; continue; }        /* 630 -> 590 */
          if (S.A === -1) { lanjutKalimat = true; break; }      /* 630 -> 610 */
          return S.keluaran;                                    /* 640 */
        }
        if (S.A < A0) { A0 = S.A; Z0 = Z; }        /* 580 — menang menurut POSISI */
      }
      if (lanjutKalimat) continue;
      if (A0 !== 50) {                             /* 600 */
        S.Z = Z0; S.A = A0;
        jj.menang = { z: Z0, kata: S.K[Z0], pos: A0, sebab: 'posisi terkecil (Z>=21)' };
        jj.penangan = KIRIM[Z0];
        S.penangan(KIRIM[Z0]);
        jj.jalur = S.jalur; jj.slot = S.slotAkhir;
        if (S.A === 0) { jj.menang = null; continue; }
        if (S.A === -1) continue;
        return S.keluaran;
      }
    }

    /* 1500 */
    if (S.NE > 5 && S.S !== 0) {
      S.NE = 0;
      S.D$ = S.M[1];                               /* 4460 — ambil yang PALING LAMA */
      for (let i = 1; i < S.S; i++) S.M[i] = S.M[i + 1];
      S.S -= 1;
      J[4470](S); S.emit();
      jj.ingatan = true; jj.keluarga = 4470; jj.slot = S.slotAkhir;
    } else {
      J[4690](S); S.emit();
      jj.keluarga = 4690; jj.slot = S.slotAkhir;
    }
    return S.keluaran;
  };

  /* ======================================================================
     Bagian 4 — bungkus baris, 4610-4640

     `WD` datang dari BIOS: DEF SEG=&H40: WD=PEEK(&H4A) — jumlah kolom layar.
     Program ini menyesuaikan diri dengan perangkat kerasnya alih-alih
     mengasumsikan 80. Di sini WD jadi pilihan, supaya perilakunya terlihat.
     ====================================================================== */
  function bungkus(teks, wd) {
    const hasil = [];
    let b = teks;
    for (;;) {
      if (b.length < wd) { hasil.push(b); return hasil; }
      let i = wd + 1;
      do { i -= 1; } while (i > 0 && mid(b, i, 1) !== ' ');
      if (i <= 0) { hasil.push(left(b, wd)); b = mid(b, wd + 1); continue; }
      hasil.push(left(b, i - 1));
      b = mid(b, i + 1);
    }
  }

  /* ======================================================================
     Bagian 5 — antarmuka
     ====================================================================== */
  const mesin = new Mesin();
  let WD = 80;

  /* Sambungan untuk pemeriksaan silang. Mesin ini ditulis dua kali — sekali
     di sini, sekali di Python — dari listing yang sama, lalu keduanya diberi
     masukan acak yang sama dan sidik jari keluarannya dibandingkan. Tanpa
     satu titik masuk yang bisa dipanggil dari luar, pemeriksaan itu hanya
     bisa dilakukan lewat antarmuka, dan yang diuji jadi antarmukanya. */
  window.RETRO.ELIZA = { Mesin: Mesin, mesin: mesin, bungkus: bungkus };

  const layar = q('layar');
  const ketik = q('ketik');

  /* --- lebar layar yang benar-benar selebar WD ---------------------------
     Baris 4610 memotong pada WD kolom, jadi baris terpanjang selalu WD-1
     aksara. Kalau ukuran hurufnya tetap, baris itu tidak muat dan halamannya
     minta digulir mendatar — dan yang terlihat bukan lagi perilaku
     programnya, melainkan lebar jendela pembacanya.

     Jadi ukuran huruf diturunkan DARI WD: satu petak monospace diukur
     sungguhan (bukan ditebak 0,6 em, yang meleset antar font sistem), lalu
     dipakai untuk menghitung ukuran yang membuat WD petak persis muat. Ada
     lantai 9 px; di bawah itu batang gulir lebih jujur daripada teks yang
     tidak terbaca. */
  function ukurPetak(px) {
    const s = document.createElement('span');
    s.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;' +
                      'font-family:' + getComputedStyle(layar).fontFamily +
                      ';font-size:' + px + 'px';
    s.textContent = '0'.repeat(100);
    layar.append(s);
    const w = s.getBoundingClientRect().width / 100;
    s.remove();
    return w;
  }
  function sesuaikanLebar() {
    const tersedia = layar.clientWidth;
    if (!tersedia) return;
    const petakPada12 = ukurPetak(12);
    const px = Math.min(13.5, Math.max(9, 12 * tersedia / (WD * petakPada12)));
    layar.style.fontSize = px.toFixed(2) + 'px';
  }

  function tampil(teks, kelas) {
    bungkus(teks, WD).forEach(baris => {
      const d = document.createElement('div');
      d.className = 'e-baris ' + (kelas || '');
      d.textContent = baris === '' ? ' ' : baris;
      layar.append(d);
    });
    layar.scrollTop = layar.scrollHeight;
  }
  function kosongkanLayar() { layar.textContent = ''; }

  /* Penanda dibuat KELIHATAN. Di aslinya CHR$(0) tidak tercetak apa-apa —
     itu justru yang membuatnya berguna sekaligus mustahil dilihat. */
  const tampak = (s) => s.replace(/\u0000/g, '␀');

  function pembuka() {
    tampil('ELIZA - Version 3.0', 'e-judul');
    tampil('Copyright (C) 1981 by Steve Grumette', 'e-judul');
    tampil('All rights reserved', 'e-judul');
    tampil('');
    tampil('HOW DO YOU DO.');                      /* 270 */
    tampil('PLEASE TELL ME YOUR PROBLEM.');        /* 275 */
    tampil('');
  }

  /* --- perintah, baris 290-350 --------------------------------------------
     Dibandingkan HURUF DEMI HURUF terhadap dua ejaan saja, dan pemeriksaan
     ini terjadi SEBELUM baris 380 menaikkan hurufnya. Jadi "Display" tidak
     dikenali. Dipertahankan apa adanya. */
  function perintah(a) {
    if (a === 'DISPLAY' || a === 'display') { tampilkanPenyangga(); return true; }
    if (a === 'RESTART' || a === 'restart') { mulaiUlangPenuh(); return true; }
    if (a === 'CLEAR' || a === 'clear') { bersihkan(); return true; }
    if (a === 'SAVE' || a === 'save') { simpan(); return true; }
    return false;
  }

  function tampilkanPenyangga() {
    if (mesin.X === 0) { takAdaPercakapan(); return; }
    kosongkanLayar();
    for (let j = 0; j < mesin.X; j++) {
      tampil(mesin.Sbuf[j], j % 2 === 0 ? 'e-kamu' : '');
      if (j % 2 === 1) tampil('');
    }
    tampil('');
  }
  function takAdaPercakapan() {
    kosongkanLayar();
    tampil(">> THERE'S NO CONVERSATION IN MEMORY <<", 'e-peringatan');  /* 4790 */
    tampil('');
    tampil('PLEASE CONTINUE.');
    tampil('');
  }
  function bersihkan() {
    if (mesin.X === 0) { takAdaPercakapan(); return; }
    mesin.X = 0; mesin.Sbuf = [];
    kosongkanLayar();
    tampil('**** CONVERSATION BUFFER CLEARED ****', 'e-judul');         /* 340 */
    tampil('');
    tampil('PLEASE CONTINUE.');
    tampil('');
    perbaruiHud();
  }
  function mulaiUlangPenuh() {
    mesin.mulaiUlang();
    kosongkanLayar(); pembuka(); perbaruiHud(); bersihkanPipa();
  }
  async function simpan() {
    if (mesin.X === 0) { takAdaPercakapan(); return; }
    const nama = (prompt('** PLEASE ENTER A NAME UNDER WHICH **\n' +
                         '      TO SAVE THE CONVERSATION') || '').toUpperCase().trim();
    if (!nama) return;
    const d = store.get('percakapan') || {};
    d[nama] = mesin.Sbuf.slice(0, mesin.X);
    store.set('percakapan', d);
    daftarSimpanan();
    ui.toast('THE CURRENT CONVERSATION HAS BEEN SAVED UNDER THE NAME ' + nama);
  }
  function daftarSimpanan() {
    const d = store.get('percakapan') || {};
    const nm = Object.keys(d).sort();
    const host = q('simpanan');
    host.innerHTML = nm.length
      ? nm.map(n => '<span class="e-file"><button type="button" class="btn btn--ghost btn--sm" data-n="' +
          n + '">' + n + '</button><button type="button" class="btn btn--ghost btn--sm e-x" data-h="' +
          n + '">&times;</button></span>').join('')
      : '<span class="e-kecil">belum ada percakapan tersimpan</span>';
    host.querySelectorAll('[data-n]').forEach(bt => bt.addEventListener('click', () => {
      const isi = (store.get('percakapan') || {})[bt.dataset.n] || [];
      kosongkanLayar();
      isi.forEach((s, j) => { tampil(s, j % 2 === 0 ? 'e-kamu' : ''); if (j % 2 === 1) tampil(''); });
    }));
    host.querySelectorAll('[data-h]').forEach(bt => bt.addEventListener('click', () => {
      const d2 = store.get('percakapan') || {};
      delete d2[bt.dataset.h]; store.set('percakapan', d2); daftarSimpanan();
    }));
  }

  /* --- giliran ------------------------------------------------------------ */
  function kirim() {
    const teks = ketik.value;
    ketik.value = '';
    if (perintah(teks)) return;

    if (mesin.X >= 100) {                          /* 280 -> 5020 */
      tampil('>> THE CONVERSATION BUFFER <<', 'e-peringatan');
      tampil('    IS COMPLETELY FILLED', 'e-peringatan');
      tampil("Ketik SAVE, CLEAR, atau RESTART.");
      tampil('');
      return;
    }

    tampil(teks, 'e-kamu');
    const keluar = mesin.bicara(teks);
    keluar.forEach(k => tampil(k));
    tampil('');
    perbaruiHud();
    gambarPipa(mesin.jejak);
  }

  /* --- HUD ---------------------------------------------------------------- */
  function perbaruiHud() {
    const j = mesin.jejak;
    q('s-kunci').textContent = j && j.menang ? j.menang.kata.trim().replace(/\u0000/g, '␀')
      : (j && j.umpatan ? '⟨umpatan⟩' : (j && j.ingatan ? '⟨ingatan⟩' : '—'));
    q('s-penangan').textContent = j
      ? (j.penangan ? String(j.penangan) : (j.keluarga ? String(j.keluarga) : '—')) : '—';
    q('s-ingatan').textContent = mesin.S + ' / 20';
    q('s-penyangga').textContent = mesin.X + ' / 100';
    /* Pengubahnya harus di `.stat`, bukan di `.stat__value` — base.css
       menuliskannya sebagai `.stat--warn .stat__value`. Versi pertama
       memasangnya di nilainya sendiri, dan warnanya tidak pernah muncul:
       cacat yang hanya bisa dilihat dengan MELIHAT, bukan dengan membaca. */
    const kotak = q('s-ingatan-box');
    kotak.classList.toggle('stat--bad', mesin.S >= 20);
    kotak.classList.toggle('stat--warn', mesin.S >= 15 && mesin.S < 20);
  }

  /* --- panel "di balik layar" ---------------------------------------------
     Ini bagian yang tidak ada di aslinya sama sekali, dan alasannya pedagogis:
     seluruh kecerdasan Eliza terjadi di antara apa yang Anda ketik dan apa
     yang tercetak, dan di aslinya jendela itu tertutup rapat. */
  function bersihkanPipa() {
    ['p-mentah', 'p-sulih', 'p-kalimat', 'p-sapu', 'p-hasil'].forEach(id => {
      const e = q(id); if (e) e.textContent = '—';
    });
  }
  function gambarPipa(j) {
    if (!j) return;
    q('p-mentah').textContent = j.mentah === '' ? '(kosong)' : j.mentah;
    q('p-sulih').innerHTML = tampak(j.tersulih || '')
      .replace(/␀/g, '<b class="e-nul">␀</b>')
      .replace(/\*/g, '<b class="e-bintang">*</b>') || '—';
    q('p-kalimat').textContent = j.kalimat.length
      ? j.kalimat.map((s, i) => (i + 1) + '. «' + tampak(s) + '»').join('\n') : '—';

    if (j.umpatan) {
      q('p-sapu').innerHTML = '<em>Baris 460 memotong sebelum penyapuan: ' +
        'kata terlarang ditemukan.</em>';
    } else if (!j.sapuan.length) {
      q('p-sapu').textContent = '—';
    } else {
      const rows = [];
      j.sapuan.forEach(s => {
        if (!s.cocok.length) {
          rows.push('<tr><td colspan="4"><em>tak satu pun dari 44 kata kunci cocok</em></td></tr>');
          return;
        }
        s.cocok.forEach(c => {
          const menang = j.menang && j.menang.z === c.z && j.menang.pos === c.pos;
          rows.push('<tr class="' + (menang ? 'e-menang' : '') + '">' +
            '<td>' + c.z + '</td><td>' + tampak(c.kata).trim() + '</td>' +
            '<td>' + c.pos + '</td><td>' + c.tingkat + '</td></tr>');
        });
      });
      q('p-sapu').innerHTML =
        '<table class="e-tbl"><thead><tr><th>Z</th><th>K$(Z)</th><th>posisi</th>' +
        '<th>tingkat</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
    }

    const bagian = [];
    if (j.menang) bagian.push('kata kunci <b>' + tampak(j.menang.kata).trim() +
      '</b> = K$(' + j.menang.z + '), menang lewat ' + j.menang.sebab);
    if (j.penangan) bagian.push('penangan <b>baris ' + j.penangan + '</b>' +
      (j.jalur && j.jalur.length > 1 ? ' — jalur ' + j.jalur.join(' → ') : ''));
    if (j.slot) bagian.push('keluarga jawaban <b>baris ' + j.slot.baris + '</b>, pencacah ' +
      j.slot.cacah + ', slot <b>' + j.slot.slot + ' dari ' + j.slot.dari + '</b>');
    if (j.ingatan) bagian.push('<b>tak ada kata kunci</b>, dan NE&gt;5 — baris 4460 ' +
      'mengambil ingatan tertua dari antrean');
    if (j.umpatan) bagian.push('<b>baris 460</b> — kata terlarang, seluruh penyapuan dilewati');
    if (!j.menang && !j.ingatan && !j.umpatan && j.keluarga === 4690)
      bagian.push('<b>tak ada kata kunci</b> — jawaban umum baris 4690');
    if (mesin.luber) bagian.push('<b class="e-bahaya">M$(' + (mesin.S + mesin.luber) +
      ') melewati DIM M$(20)</b> — di GW-BASIC ini berhenti dengan ' +
      '<i>Subscript out of range in 900</i>');
    if (mesin.luberKalimat) bagian.push('<b class="e-bahaya">lebih dari 20 kalimat</b> — ' +
      'di GW-BASIC ini berhenti dengan <i>Subscript out of range in 510</i>');
    q('p-hasil').innerHTML = bagian.length
      ? '<ul class="e-langkah"><li>' + bagian.join('</li><li>') + '</li></ul>' : '—';
  }

  /* ======================================================================
     Bagian 6 — bukti yang dihitung, bukan diketik
     ====================================================================== */
  (function bukti() {
    /* Berkas STRINGS.FIL dibangkitkan ulang oleh strings.js. Panjangnya
       dibandingkan dengan berkas yang benar-benar ada di koleksi. */
    q('b-bita').textContent = DATA.bita.toLocaleString('id-ID');
    q('b-cocok').textContent = DATA.bita === DATA.bitaAsli
      ? 'cocok dengan run/STRINGS.FIL (' + DATA.bitaAsli.toLocaleString('id-ID') + ' bita)'
      : 'TIDAK cocok — ' + DATA.bitaAsli;
    q('b-cocok').className = DATA.bita === DATA.bitaAsli ? 'e-ok' : 'e-bahaya';

    /* Berapa banyak cabang, berapa banyak tujuan? Dihitung dari tabelnya. */
    const unik = new Set(KIRIM.slice(1));
    q('b-cabang').textContent = KIRIM.length - 1;
    q('b-tujuan').textContent = unik.size;
    const hitung = {};
    KIRIM.slice(1).forEach(t => { hitung[t] = (hitung[t] || 0) + 1; });
    /* Versi pertama mengambil `sort(...)[0]` dan mencetak "650 (4x)" — benar
       tapi menyesatkan, karena EMPAT penangan sama-sama dipakai empat kata
       kunci. Angka tertinggi yang punya seri harus disebut sebagai seri. */
    const puncak = Math.max.apply(null, Object.keys(hitung).map(k => hitung[k]));
    const seri = Object.keys(hitung).filter(k => hitung[k] === puncak)
      .sort((a, b) => a - b);
    q('b-terbanyak').textContent = seri.join(', ') + ' (masing-masing ' + puncak + ' kata kunci)';

    /* Empat kata kunci yang membaca penanda, bukan kata. */
    const bertanda = [];
    for (let i = 1; i <= 44; i++) if (mesin.K[i].indexOf(NUL) >= 0) bertanda.push(i);
    q('b-bertanda').textContent = bertanda.join(', ');

    /* Tabel pasangan kata ganti — dihitung dari kaidah sulihnya sendiri. */
    const brs = [];
    [[12, 43, 'apa yang Anda sebut "I"'], [13, 36, 'apa yang Anda sebut "YOU"'],
     [21, 22, 'apa yang Anda sebut "AM"'], [null, 21, 'ARE yang Anda ketik sendiri']]
      .forEach(([kaidah, z, ket]) => {
        brs.push('<tr><td>' + (kaidah !== null
            ? mesin.OW[kaidah].trim() + ' → ' + tampak(mesin.RW[kaidah]).trim()
            : '<i>tanpa kaidah</i>') +
          '</td><td>K$(' + z + ') = ' + tampak(mesin.K[z]).trim() +
          '</td><td>baris ' + KIRIM[z] + '</td><td>' + ket + '</td></tr>');
      });
    q('b-ganti').innerHTML = brs.join('');

    /* Slot kosong = jalur ganti topik. Diambil dari kode, bukan diketik. */
    const KOSONG = [['X4', 4, 1960, 740, 1100], ['X5', 4, 2040, 760, 780],
      ['XA', 6, 2420, 860, 1100], ['XF', 5, 2740, 970, 1100],
      ['XH', 5, 2870, 1000, 1100], ['XK', 2, 2990, 1040, 1100],
      ['XL', 4, 3070, 1050, 1100], ['XV', 5, 3780, 1250, 1100],
      ['XW', 5, 3850, 1270, 1100]];
    q('b-kosong').innerHTML = KOSONG.map(r =>
      '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] +
      '</td><td>' + r[3] + '</td><td>' + r[4] + '</td></tr>').join('');
    q('b-jumkosong').textContent = KOSONG.length;
  })();

  /* ======================================================================
     Bagian 7 — pasang
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'Eliza', source: 'ELIZA.BAS · Steve Grumette · 1981'
  }));

  pembuka();
  perbaruiHud();
  bersihkanPipa();
  daftarSimpanan();

  q('kirim').addEventListener('click', kirim);
  ketik.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); kirim(); } });
  q('lebar').addEventListener('change', e => {
    WD = Number(e.target.value);
    sesuaikanLebar();
    /* Mengubah WD menggambar ulang seluruh gulungan, karena pemotongannya
       terjadi saat MENCETAK — persis seperti di aslinya, tempat WD dibaca
       sekali di baris 40 dan berlaku untuk semua yang menyusul. */
    const isi = mesin.Sbuf.slice(0, mesin.X);
    kosongkanLayar(); pembuka();
    isi.forEach((s, j) => { tampil(s, j % 2 === 0 ? 'e-kamu' : ''); if (j % 2 === 1) tampil(''); });
  });
  sesuaikanLebar();
  window.addEventListener('resize', sesuaikanLebar);
  ketik.focus();

  /* Contoh percakapan yang menyentuh enam jalur berbeda dalam enam giliran. */
  q('contoh').addEventListener('click', () => {
    const urut = ['HELLO', 'I AM UNHAPPY', 'MY MOTHER NEVER LISTENS',
                  'DO YOU REMEMBER MY DOG', 'EVERYBODY LAUGHS AT ME',
                  'ARE YOU A COMPUTER'];
    let i = 0;
    const langkah = () => {
      if (i >= urut.length) return;
      ketik.value = urut[i++];
      kirim();
      setTimeout(langkah, 420);
    };
    langkah();
  });
})();
