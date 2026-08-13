/* ===========================================================================
   startrek.js — port STARTREK.BAS (Bob & Sharon Fritz, Okt–Nov 1981)

   Silsilahnya panjang: Mike Mayfield 1971 -> Creative Computing -> "BASIC
   Computer Games" karya Dave Ahl -> port IBM PC oleh Bob & Sharon Fritz.
   Manualnya (docs/STARTREK.DOC) ditutup kalimat yang jarang ditemui:

       "This program is distributed AS IS. It certainly needs work,
        but at least we're started off."

   Manual itu menyebut TIGA keraguan penulisnya sendiri. Ketiganya diuji di
   sini, dan hasilnya tidak seperti yang mereka duga:

   1. "9 - Supposed to be synonymous with 1, but I'm not sure it works."
      Bekerja. C(9) memang identik dengan C(1), jadi interpolasi 8->9
      melingkar dengan benar. Dan `IF C1=9 THEN C1=1` bukan kenyamanan
      melainkan PENJAGA: rumus baris 2080 membaca C(C1+1), dan untuk C1=9
      itu C(10) — satu di luar DIM C(9,2).

   2. "TOR DATA ... Reliable only if direction is a whole number (needs work)"
      Justru TEPAT SEMPURNA. Disapu seluruh 4.032 pasangan posisi di kuadran
      8x8: arah yang dihitung baris 4590-4730, diumpankan ke penggerak
      torpedo baris 2840, mengenai sasaran 4.032 dari 4.032 kali — bahkan
      setelah dibulatkan ke tiga angka berarti. Sebabnya: "arah" di sini
      BUKAN sudut melainkan parameter dari pemetaan linear sepotong-sepotong
      yang sama, dan kalkulatornya adalah FUNGSI KEBALIKAN penggeraknya.
      Diperiksa: perkalian silang langkah(arah) dengan vektor ke sasaran nol
      pada keempat ribu pasangan itu.

   3. Yang TIDAK mereka ragukan, dan justru salah: JARAK-nya Euclid
      (`SQR(X^2+A^2)`, baris 4730) sementara geraknya Chebyshev — satu petak
      per putaran pada sumbu dominan. Memakai angka yang tercetak apa adanya
      membuat Anda melewati sasaran pada 31,8% pasangan; diagonal murni
      tercetak 41% terlalu jauh (3 petak jadi 4,24).

   Dan empat hal yang programnya bisa katakan tapi tidak pernah bisa:
   "Aldebaran" (5190 tak pernah jadi sasaran), pesan Spock soal tak ada
   starbase (4770-4780 dilewati GOTO tanpa syarat di 4760), hukuman CYGNUS 12
   (3000-3020, syarat 2990 tak pernah salah), dan kata "docked" (CC$ di 3770
   ditulis sekali dan tidak pernah dibaca — layarnya mencetak C$).

   Semua angka di berkas ini dihitung, bukan dikutip.
   =========================================================================== */
(function () {
  'use strict';

  const ui = window.RETRO.ui;
  const audio = window.RETRO.audio;
  const store = window.RETRO.store('startrek');
  const q = (id) => document.getElementById(id);

  /* ======================================================================
     Bagian 1 — CP437 dan glif

     Sel kuadran disimpan sebagai TIGA aksara di dalam satu string panjang;
     lihat Bagian 3. Ini kode aslinya, apa adanya.
     ====================================================================== */
  const CP = {
    2: '☻', 15: '☼', 127: '⌂', 144: 'É', 174: '«', 175: '»',
    185: '╣', 204: '╠', 250: '·'
  };
  const cp = (n) => CP[n] || String.fromCharCode(n);

  const KAPAL   = cp(204) + cp(144) + cp(185);        /* 1440 */
  const KLINGON = '+' + cp(2) + '+';                  /* 1450 */
  const BASIS   = cp(174) + cp(127) + cp(175);        /* 1480 */
  const BINTANG = ' ' + cp(15) + ' ';                 /* 1500 */
  const KOSONG  = '   ';
  /* 3850: yang KOSONG digambar sebagai titik — tapi yang DISIMPAN tetap tiga
     spasi, dan baris 2110 bergantung pada itu untuk menguji tabrakan. Tampilan
     dan data sengaja berbeda; membalik keduanya akan merusak navigasi. */
  const TITIK   = ' ' + cp(250) + ' ';

  /* ======================================================================
     Bagian 2 — tabel arah C(), baris 1030-1050

     Sembilan vektor satuan. C(9) sengaja disamakan dengan C(1) supaya
     interpolasi 8->9 melingkar; itu yang membuat arah pecahan 8,x bekerja.
     ====================================================================== */
  const C = [];
  for (let i = 0; i <= 9; i++) C[i] = [0, 0];
  [[3,1,-1],[2,1,-1],[4,1,-1],[4,2,-1],[5,2,-1],[6,2,-1],
   [1,2,1],[2,2,1],[6,1,1],[7,1,1],[8,1,1],[8,2,1],[9,2,1]]
    .forEach(([i, j, v]) => { C[i][j - 1] = v; });

  /* 2080-2090 / 2810-2820. `Math.trunc` di sini adalah tafsiran yang
     dinyatakan: GW-BASIC harus MEMANGKAS indeks larik pecahan agar
     interpolasinya benar, dan itulah satu-satunya bacaan yang membuat
     TOR DATA — fitur yang penulisnya tulis sendiri — berfungsi. */
  function vektor(c1) {
    const i = Math.trunc(c1), f = c1 - i;
    return [C[i][0] + (C[i + 1][0] - C[i][0]) * f,
            C[i][1] + (C[i + 1][1] - C[i][1]) * f];
  }

  /* ======================================================================
     Bagian 3 — keadaan

     Q$ dipertahankan sebagai STRING 192 aksara, bukan larik dua dimensi.
     Itu bukan nostalgia: 8 x 8 sel x 3 aksara = 192, dan seluruh permainan —
     tabrakan, pencarian tempat kosong, tampilan sensor — bekerja dengan
     MID$ atas string itu. Menggantinya dengan larik akan menghapus
     kerabat dekat "layar sebagai struktur data" yang muncul enam kali di
     koleksi ini; di sini bentuknya "string sebagai petak dua dimensi".
     ====================================================================== */
  const S = {};
  let rng = null;

  function mulai(benih) {
    rng = window.RETRO.rng(benih === undefined ? window.RETRO.freshSeed() : benih);
    S.benih = rng.seed;

    S.T = Math.floor(rng.next() * 20 + 20) * 100;    /* 970 */
    S.T0 = S.T;
    S.T9 = 25 + Math.floor(rng.next() * 10);
    S.D0 = 0; S.E = 3000; S.E0 = S.E;
    S.P = 10; S.P0 = S.P; S.S9 = 200; S.S = 0;       /* 980 */
    S.B9 = 0; S.K9 = 0; S.X = ''; S.X0 = ' is ';
    S.G = []; S.Z = []; S.K = []; S.D = [];
    S.Q1 = fnr(); S.Q2 = fnr(); S.S1 = fnr(); S.S2 = fnr();   /* 1020 */
    for (let i = 1; i <= 8; i++) S.D[i] = 0;         /* 1060 */
    for (let i = 1; i <= 3; i++) S.K[i] = [0, 0, 0];
    S.CS = 'GREEN'; S.CCS = '';
    S.G5 = 0; S.D4 = 0; S.B4 = 0; S.B5 = 0;
    S.K3 = 0; S.B3 = 0; S.S3 = 0;
    S.QS = '';
    S.selesai = null;
    S.W1 = 0; S.Xn = 0;      /* W1 dan X: dipakai ulang untuk banyak hal */

    galaksi();
  }

  const fnr = () => Math.floor(rng.next() * 7.98 + 1.01);      /* 1000 */

  /* --- 1100-1190: isi galaksi -------------------------------------------
     Tiap kuadran satu bilangan: ratusan = Klingon, puluhan = starbase,
     satuan = bintang. Satu kolom data, tiga arti — kerabat dekat titik
     jalan TRUCKER yang memuat dua hal dalam satu pecahan. */
  function galaksi() {
    for (let i = 1; i <= 8; i++) {
      S.G[i] = []; S.Z[i] = [];
      for (let j = 1; j <= 8; j++) {
        let k3 = 0;
        const r1 = rng.next();
        if (r1 > 0.9799999) { k3 = 3; S.K9 += 3; }
        else if (r1 > 0.95) { k3 = 2; S.K9 += 2; }
        else if (r1 > 0.8) { k3 = 1; S.K9 += 1; }
        let b3 = 0;
        if (rng.next() > 0.96) { b3 = 1; S.B9 += 1; }
        S.Z[i][j] = 0;
        S.G[i][j] = k3 * 100 + b3 * 10 + fnr();
      }
    }
    if (S.K9 > S.T9) S.T9 = S.K9 + 1;                /* 1150 */
    if (S.B9 === 0) {                                /* 1160-1180 */
      if (S.G[S.Q1][S.Q2] < 200) { S.G[S.Q1][S.Q2] += 100; S.K9 += 1; }
      S.B9 = 1; S.G[S.Q1][S.Q2] += 10;
      S.Q1 = fnr(); S.Q2 = fnr();
    }
    S.K7 = S.K9;
    if (S.B9 !== 1) { S.X = 's'; S.X0 = ' are '; }   /* 1190 */
  }

  /* ======================================================================
     Bagian 4 — masuk kuadran baru, baris 1280-1510
     ====================================================================== */
  function masukKuadran(pertama) {
    S.D4 = 0.5 * rng.next();
    S.Z[S.Q1][S.Q2] = S.G[S.Q1][S.Q2];
    const namaQ = namaKuadran(S.Q1, S.Q2, 0);
    if (pertama) {
      cetak("Your mission begins with your starship located");
      cetak("in the galactic quadrant, '" + namaQ + "'.");
    } else {
      cetak("Now entering " + namaQ + " quadrant. . .");
    }
    S.K3 = Math.floor(S.G[S.Q1][S.Q2] * 0.01);       /* 1340 */
    S.B3 = Math.floor(S.G[S.Q1][S.Q2] * 0.1) - 10 * S.K3;
    S.S3 = S.G[S.Q1][S.Q2] - 100 * S.K3 - 10 * S.B3;
    if (S.K3 !== 0) {
      cetak("COMBAT AREA!! Condition RED ", 'st-merah');
      bunyi('siaga');                                /* 1380 */
      if (S.S <= 200) cetak("    SHIELDS DANGEROUSLY LOW", 'st-merah');
    }
    for (let i = 1; i <= 3; i++) S.K[i] = [0, 0, 0];

    /* 1410: petaknya dibangun dari 7 potong Z$ + 17 aksara — 7*25+17 = 192. */
    S.QS = ' '.repeat(192);
    taruh(S.S1, S.S2, KAPAL);                        /* 1440 */
    for (let i = 1; i <= S.K3; i++) {                /* 1450-1460 */
      const [r1, r2] = tempatKosong();
      taruh(r1, r2, KLINGON);
      S.K[i] = [r1, r2, S.S9 * (0.5 + rng.next())];
    }
    if (S.B3 >= 1) {                                 /* 1480 */
      const [r1, r2] = tempatKosong();
      taruh(r1, r2, BASIS); S.B4 = r1; S.B5 = r2;
    }
    for (let i = 1; i <= S.S3; i++) {                /* 1500 */
      const [r1, r2] = tempatKosong();
      taruh(r1, r2, BINTANG);
    }
    srs();
  }

  /* --- 4830: sisipkan tiga aksara ke dalam string petak ------------------
     S8 = (Z2-1)*3 + (Z1-1)*24 + 1. Baris 4850 dan 4860 menangani ujung
     kiri dan kanan secara terpisah, padahal LEFT$(x,0) dan RIGHT$(x,0)
     keduanya sah di GW-BASIC — dua baris penjagaan yang tidak perlu. */
  function taruh(z1, z2, a) {
    const s8 = (Math.round(z2) - 1) * 3 + (Math.round(z1) - 1) * 24 + 1;
    S.QS = S.QS.slice(0, s8 - 1) + a + S.QS.slice(s8 + 2);
  }
  /* 4990 */
  function cocok(z1, z2, a) {
    z1 = Math.floor(z1 + 0.5); z2 = Math.floor(z2 + 0.5);
    const s8 = (z2 - 1) * 3 + (z1 - 1) * 24 + 1;
    return S.QS.substr(s8 - 1, 3) === a;
  }
  const isi = (z1, z2) => S.QS.substr(((z2 - 1) * 3 + (z1 - 1) * 24), 3);
  /* 4800 */
  function tempatKosong() {
    for (;;) {
      const r1 = fnr(), r2 = fnr();
      if (cocok(r1, r2, KOSONG)) return [r1, r2];
    }
  }

  /* ======================================================================
     Bagian 5 — nama kuadran, baris 5040-5280

     DUA cacat berbeda hidup di sini, dan keduanya bisa dilihat langsung di
     panel "Peta nama galaksi" di halaman ini.

     (a) Baris 5040 menguji `Z5<+4`, bukan `Z5<5`. (Tanda tambah uner itu
         kekeliruan ketik yang sama jenisnya dengan `WHILE+ A$=""` di
         BOWLING.BAS; GW-BASIC memaafkan keduanya.) Akibatnya KOLOM 4 memakai
         keluarga nama yang KEDUA. Delapan kuadran salah nama.

     (b) Baris 5140 menyebut 5180 DUA KALI dan 5190 nol kali, jadi baris 5
         keluarga kedua ikut bernama "Betelgeuse" dan "Aldebaran" — yang
         tertulis lengkap di baris 5190 — tidak pernah bisa muncul.

     Gabungannya: pemetaan yang seharusnya satu-satu (8 nama x 4 akhiran x 2
     keluarga = 64) hanya menghasilkan 52 nama berbeda untuk 64 kuadran, dan
     22 kuadran berbagi nama dengan kuadran lain.
     ====================================================================== */
  const NAMA_A = ['Antares', 'Rigel', 'Procyon', 'Vega', 'Canopus', 'Altair',
                  'Sagittarius', 'Pollux'];
  /* Sengaja ditulis sebagai peta, bukan larik, supaya 5180-yang-dua-kali
     terlihat sebagai apa adanya alih-alih tersembunyi di balik indeks. */
  const NAMA_B = { 1: 'Sirius', 2: 'Deneb', 3: 'Capella', 4: 'Betelgeuse',
                   5: 'Betelgeuse', 6: 'Regulus', 7: 'Arcturus', 8: 'Spica' };
  const NAMA_B_SEHARUSNYA = { 1: 'Sirius', 2: 'Deneb', 3: 'Capella',
                              4: 'Betelgeuse', 5: 'Aldebaran', 6: 'Regulus',
                              7: 'Arcturus', 8: 'Spica' };
  const SUFIKS = { 1: ' i', 2: ' ii', 3: ' iii', 4: ' iv',
                   5: ' i', 6: ' ii', 7: ' iii', 8: ' iv' };

  function namaKuadran(z4, z5, g5) {
    const g = (z5 < 4) ? NAMA_A[z4 - 1] : NAMA_B[z4];   /* 5040: Z5<+4 */
    return g5 === 1 ? g : g + SUFIKS[z5];               /* 5230 */
  }
  function namaSeharusnya(z4, z5) {
    const g = (z5 <= 4) ? NAMA_A[z4 - 1] : NAMA_B_SEHARUSNYA[z4];
    return g + SUFIKS[z5 <= 4 ? z5 : z5 - 4];
  }

  /* ======================================================================
     Bagian 6 — bunyi, baris 5290-5570

     Empat penyapu frekuensi. Yang membuatnya penting bukan bunyinya:
     baris 510 menjalankan PLAY "mb" (music background), yang membuat SOUND
     MENGANTRE alih-alih memblokir — tapi antrean GW-BASIC dalamnya 32 nada,
     dan tiap rutin di bawah ini mengantre jauh lebih banyak. Jadi program
     berhenti menunggu antrean kosong, dan RUTIN BUNYI INILAH SATU-SATUNYA
     PENGATUR TEMPO permainan ini. Persis temuan LANDER (sesi 20), tempat
     musik Blue Danube ternyata jam permainannya.

     Angkanya dihitung, bukan ditaksir — lihat panel "Bunyinya adalah jamnya".
     ====================================================================== */
  const RUTIN_BUNYI = {
    /* 5290-5350 */
    siaga: () => { const n = []; let t = 0;
      for (let j = 1; j <= 4; j++) for (let k = 1000; k <= 2000; k += 20) {
        n.push({ freq: k, at: t, dur: 0.01 }); t += 0.01; } return n; },
    /* 5360-5410 */
    torpedo: () => { const n = []; let t = 0;
      for (let j = 1500; j >= 100; j -= 20) {
        n.push({ freq: j, at: t, dur: 0.01 }); t += 0.01;
        n.push({ freq: 3600 - j, at: t, dur: 0.01 }); t += 0.01; } return n; },
    /* 5420-5470 */
    phaser: () => { const n = []; let t = 0;
      for (let j = 1; j <= 40; j++) {
        n.push({ freq: 800, at: t, dur: 0.01 }); t += 0.01;
        n.push({ freq: 2500, at: t, dur: 0.008 }); t += 0.008; } return n; },
    /* 5480-5570 */
    alarm: () => { const n = []; let t = 0;
      for (let s = 1; s <= 3; s++) {
        for (let j = 800; j <= 1500; j += 20) { n.push({ freq: j, at: t, dur: 0.01 }); t += 0.01; }
        for (let k = 1500; k >= 800; k -= 20) { n.push({ freq: k, at: t, dur: 0.01 }); t += 0.01; }
      } return n; }
  };
  function bunyi(nama) {
    if (!audio || !audio.available || q('senyap').checked) return;
    /* Fire-and-forget: penyimpangan yang dinyatakan. Di aslinya bunyi ini
       MENAHAN permainan; di sini permainan jalan terus dan bunyinya
       menyusul. Panel di sebelah kanan menyebutkan berapa lama tiap rutin
       menahan mesin 1981. */
    audio.playNotes(RUTIN_BUNYI[nama]());
  }

  /* ======================================================================
     Bagian 7 — keluaran
     ====================================================================== */
  const log = () => q('log');
  function cetak(teks, kelas) {
    const d = document.createElement('div');
    d.className = 'st-baris ' + (kelas || '');
    d.textContent = teks === '' ? ' ' : teks;
    log().append(d);
    log().scrollTop = log().scrollHeight;
  }
  function kosongkanLog() { log().textContent = ''; }

  /* ======================================================================
     Bagian 8 — sensor jarak dekat, baris 3720-3970
     ====================================================================== */
  function srs() {
    /* 3720-3780: berlabuh kalau ada starbase di sembilan petak sekeliling. */
    let dok = false;
    for (let i = S.S1 - 1; i <= S.S1 + 1 && !dok; i++)
      for (let j = S.S2 - 1; j <= S.S2 + 1 && !dok; j++) {
        if (Math.floor(i + 0.5) < 1 || Math.floor(i + 0.5) > 8 ||
            Math.floor(j + 0.5) < 1 || Math.floor(j + 0.5) > 8) continue;
        if (cocok(i, j, BASIS)) dok = true;
      }
    if (dok) {
      S.D0 = 1;
      /* 3770 menulis CC$, bukan C$. CC$ muncul tepat SEKALI di seluruh
         program dan tidak pernah dibaca; baris 3900 mencetak C$. Jadi kata
         "docked" ada di dalam program dan tidak pernah bisa terlihat, dan
         indikator Condition membeku pada nilai kuadran sebelumnya. */
      S.CCS = 'docked';
      S.E = S.E0; S.P = S.P0;
      cetak("Shields dropped for docking purposes");
      S.S = 0;
    } else {
      S.D0 = 0;
      if (S.K3 > 0) S.CS = '*red*';                  /* 3790 */
      else { S.CS = 'GREEN'; if (S.E < S.E0 * 0.1) S.CS = 'YELLOW'; }
    }
    if (S.D[2] < 0) { cetak(""); cetak("*** Short Range Sensors are out ***"); cetak(""); }
    gambar();
  }

  /* ======================================================================
     Bagian 9 — perintah
     ====================================================================== */
  const A1 = 'NAVSRSLRSPHATORSHIDAMCOMRES';                 /* 1070 */
  const CM1 = 'GALSTATORBASDIRREG';                         /* 3990 */

  let tanya = null;                     /* padanan INPUT: satu pertanyaan menggantung */
  function minta(teks, terima) { tanya = { teks, terima }; q('prompt').textContent = teks; }
  function bebas() { tanya = null; q('prompt').textContent = 'command'; }

  function terimaBaris(teks) {
    const t = teks.trim();
    if (S.selesai) return;
    if (tanya) { const f = tanya.terima; bebas(); f(t); gambar(); return; }
    cetak('command? ' + t, 'st-kamu');
    perintah(t);
    gambar();
  }

  function perintah(a) {
    const tiga = a.slice(0, 3).toUpperCase();
    const i = [...Array(9).keys()].map(k => A1.substr(3 * k, 3)).indexOf(tiga) + 1;
    if (i === 0) {                                          /* 1610-1700 */
      ["Enter one of the following:",
       "  NAV   (to set course)", "  SRS   (for short range sensor scan)",
       "  LRS   (for long range sensor scan)", "  PHA   (to fire phasers)",
       "  TOR   (to fire photon torpedoes)", "  SHI   (to raise or lower shields)",
       "  DAM   (for damage control reports)", "  COM   (to call on library-computer)",
       "  RES   (to resign your command)", ""].forEach(s => cetak(s));
      return;
    }
    [nav, srs, lrs, phaser, torpedo, perisai, kerusakan, komputer, mundur][i - 1]();
  }

  /* --- NAV, baris 1720-2420 --------------------------------------------- */
  function nav() {
    minta("Course (1-9)", (v) => {
      let c1 = Number(v);
      if (c1 === 9) c1 = 1;                                 /* 1720 — penjaga C(10) */
      if (!(c1 >= 1 && c1 < 9)) {
        cetak("   Lt. Sulu reports,  'Incorrect course data, sir!'"); return;
      }
      const maks = S.D[1] < 0 ? '0.2' : '8';                /* 1750 */
      S.X = maks;    /* <- lihat catatan di STATUS: X$ tidak pernah dikembalikan */
      minta("Warp factor(0-" + maks + ")", (w) => {
        const w1 = Number(w);
        if (S.D[1] < 0 && w1 > 0.2) {
          cetak("Warp engines are damaged.  Maximum speed = warp 0.2"); return;
        }
        if (w1 === 0) return;
        if (!(w1 > 0 && w1 < 8)) {
          cetak("   Chief Engineer Scott reports 'The engines won't take warp " +
                w1 + "!"); return;
        }
        S.W1 = w1;
        gerak(c1, w1);
      });
    });
  }

  function gerak(c1, w1) {
    const n = Math.floor(w1 * 8 + 0.5);                     /* 1820 */
    if (S.E - n < 0) {
      cetak("Engineering reports   'Insufficient energy available");
      cetak("                       for maneuvering at warp " + w1 + "!'");
      if (!(S.S < n - S.E || S.D[7] < 0)) {
        cetak("Deflector control room acknowledges " + S.S + " units of energy");
        cetak("                         presently deployed to shields.");
      }
      return;
    }
    /* 1900-1930: Klingon berpindah tempat lebih dulu */
    for (let i = 1; i <= S.K3; i++) {
      if (S.K[i][2] === 0) continue;
      taruh(S.K[i][0], S.K[i][1], KOSONG);
      const [r1, r2] = tempatKosong();
      S.K[i][0] = r1; S.K[i][1] = r2;
      taruh(r1, r2, KLINGON);
    }
    /* 1930: `GOSUB 4810`. Baris 4810 isinya HANYA `RETURN` — ia cuma pintu
       keluar gelung pencari-tempat-kosong di 4800. Jadi panggilan ini tidak
       melakukan apa pun.

       Yang seharusnya dipanggil di sini hampir pasti 3350, "klingons
       shooting". Buktinya: 3350 dipanggil dari empat tempat di seluruh
       program — 2730, 2950, 3060, 3070 — dan KEEMPATNYA sesudah PEMAIN
       menembak. Tidak ada satu pun sesudah bergerak.

       Akibatnya menentukan seluruh rasa mainnya: Klingon tidak pernah
       menembak lebih dulu. Anda bisa masuk kuadran Condition RED, melintas,
       berlabuh, memperbaiki kapal, dan pergi — tanpa sekali pun kena, asal
       Anda tidak menembak duluan. Satu nomor baris yang meleset 3.350 ke
       4.810 mengubah permainan bertahan-hidup jadi permainan pilihan.
       Dipertahankan apa adanya. */
    perbaikanDanKerusakan(w1);

    taruh(Math.floor(S.S1), Math.floor(S.S2), KOSONG);      /* 2070 */
    const [x1, x2] = vektor(c1);
    let x = S.S1, y = S.S2;
    const q4 = S.Q1, q5 = S.Q2;
    let s1 = S.S1, s2 = S.S2, keluar = false;
    for (let i = 1; i <= n; i++) {
      s1 += x1; s2 += x2;
      if (s1 < 1 || s1 >= 9 || s2 < 1 || s2 >= 9) { keluar = true; break; }
      const s8 = Math.floor(s1) * 24 + Math.floor(s2) * 3 - 26;   /* 2110 */
      if (S.QS.substr(s8 - 1, 2) !== '  ') {
        s1 = Math.floor(s1 - x1); s2 = Math.floor(s2 - x2);
        cetak("Warp engines shut down at sector " + s1 + " , " + s2 +
              " due to bad navigation.");
        S.S1 = s1; S.S2 = s2;
        taruh(S.S1, S.S2, KAPAL);
        energiManuver(n);
        S.T += (w1 < 1) ? 0.1 * Math.floor(10 * w1) : 1;
        if (S.T > S.T0 + S.T9 && !habisWaktu()) return;
        srs();
        return;
      }
    }
    if (!keluar) {
      S.S1 = Math.floor(s1); S.S2 = Math.floor(s2);
      taruh(S.S1, S.S2, KAPAL);
      energiManuver(n);
      S.T += (w1 < 1) ? 0.1 * Math.floor(10 * w1) : 1;      /* 2170-2180 */
      if (S.T > S.T0 + S.T9) { habisWaktu(); return; }
      srs();
      return;
    }
    /* 2220-2370: melewati batas kuadran */
    x = 8 * S.Q1 + x + n * x1; y = 8 * S.Q2 + y + n * x2;
    S.Q1 = Math.floor(x / 8); S.Q2 = Math.floor(y / 8);
    S.S1 = Math.floor(x - S.Q1 * 8); S.S2 = Math.floor(y - S.Q2 * 8);
    if (S.S1 === 0) { S.Q1 -= 1; S.S1 = 8; }
    if (S.S2 === 0) { S.Q2 -= 1; S.S2 = 8; }
    let x5 = 0;
    if (S.Q1 < 1) { x5 = 1; S.Q1 = 1; S.S1 = 1; }
    if (S.Q1 > 8) { x5 = 1; S.Q1 = 8; S.S1 = 8; }
    if (S.Q2 < 1) { x5 = 1; S.Q2 = 1; S.S2 = 1; }
    if (S.Q2 > 8) { x5 = 1; S.Q2 = 8; S.S2 = 8; }
    if (x5 === 1) {
      cetak("Lt. Uhura reports message from Starfleet Command:");
      cetak("  'Permission to attempt crossing of galactic perimeter");
      cetak("  is hereby *DENIED*.  Shut down your engines.'");
      cetak("Chief Engineer Scott reports 'Warp engines shut down");
      cetak("  at sector " + S.S1 + " , " + S.S2 + " of quadrant " +
            S.Q1 + " , " + S.Q2 + ".'");
      if (S.T > S.T0) { habisWaktu(); return; }
    }
    if (8 * S.Q1 + S.Q2 === 8 * q4 + q5) {                  /* 2360 */
      taruh(S.S1, S.S2, KAPAL); energiManuver(n); srs(); return;
    }
    S.T += 1;
    energiManuver(n);
    masukKuadran(false);
  }

  function energiManuver(n) {                               /* 2390-2420 */
    S.E = S.E - n - 10;
    if (S.E > 0) return;
    cetak("Shield control supplies energy to complete the maneuver.");
    S.S = S.S + S.E; S.E = 0;
    if (S.S <= 0) S.S = 0;
  }

  function perbaikanDanKerusakan(w1) {                      /* 1940-2050 */
    const d6 = w1 >= 1 ? 1 : w1;
    let d1 = 0;
    for (let i = 1; i <= 8; i++) {
      if (S.D[i] >= 0) continue;
      S.D[i] += d6;
      if (S.D[i] > -0.1 && S.D[i] < 0) { S.D[i] = -0.1; continue; }
      if (S.D[i] < 0) continue;
      if (d1 !== 1) { d1 = 1; cetak("DAMAGE CONTROL REPORT:   "); }
      cetak("        " + namaAlat(i) + " Repair completed.");
    }
    if (rng.next() > 0.2) return;
    const r1 = fnr();
    if (rng.next() >= 0.6) {
      S.D[r1] += rng.next() * 3 + 1;
      cetak("DAMAGE CONTROL REPORT:   " + namaAlat(r1) + " State of repair improved");
      cetak("");
    } else if (S.K3 !== 0) {
      S.D[r1] -= rng.next() * 5 + 1;
      cetak("DAMAGE CONTROL REPORT:   " + namaAlat(r1) + " damaged");
      cetak("");
    }
  }

  /* 4890-4970 */
  const ALAT = ['Warp Engines', 'Short Range Sensors', 'Long Range Sensors',
                'Phaser Control', 'Photon Tubes', 'Damage Control',
                'Shield Control', 'Library-Computer'];
  const namaAlat = (n) => ALAT[n - 1];

  /* --- LRS, baris 2440-2510 --------------------------------------------- */
  function lrs() {
    if (S.D[3] < 0) { cetak("Long Range Sensors are inoperable"); return; }
    cetak("Long Range Scan for quadrant " + S.Q1 + " , " + S.Q2);
    const garis = "-------------------";
    cetak(garis);
    for (let i = S.Q1 - 1; i <= S.Q1 + 1; i++) {
      const n = [-1, -2, -3];
      for (let j = S.Q2 - 1; j <= S.Q2 + 1; j++) {
        if (i > 0 && i < 9 && j > 0 && j < 9) {
          n[j - S.Q2 + 1] = S.G[i][j]; S.Z[i][j] = S.G[i][j];
        }
      }
      cetak(n.map(v => ': ' + (v < 0 ? '*** ' : String(v + 1000).slice(-3) + ' ')).join('') + ':');
      cetak(garis);
    }
  }

  /* --- PHASERS, baris 2530-2730 ----------------------------------------- */
  function phaser() {
    if (S.D[4] < 0) { cetak("Phasers Inoperative"); return; }
    if (S.K3 <= 0) {
      cetak("Science Officer Spock reports  'Sensors show no enemy ships");
      cetak("                                in this quadrant'"); return;
    }
    if (S.D[8] < 0) cetak("Computer failure hampers accuracy");
    /* 2580: string yang tidak pernah ditutup. Yang tercetak di layar 1981
       memuat ekornya sendiri — `;  :;` — karena tanda kutip penutupnya
       hilang dan GW-BASIC membaca sampai akhir baris. Dipertahankan. */
    cetak("Phasers locked on target;  :;");
    tanyaUnit();
  }
  function tanyaUnit() {
    cetak("Energy available = " + S.E + " units");
    minta("Numbers of units to fire", (v) => {
      const x = Number(v);
      if (!(x > 0)) return;
      if (S.E - x < 0) { tanyaUnit(); return; }
      S.Xn = x;
      S.E -= x;
      bunyi('phaser');
      let xx = x;
      if (S.D[7] < 0) xx = x * rng.next();
      const h1 = Math.floor(xx / S.K3);
      for (let i = 1; i <= 3; i++) {
        if (S.K[i][2] <= 0) continue;
        /* Baris 2630 membagi tenaga rata ke SEMUA Klingon sekaligus — jadi
           phasernya memang menembak beberapa arah dalam satu perintah, dan
           sinarnya digambar begitu. */
        antre({ jenis: 'phaser', dari: [S.S1, S.S2], ke: [S.K[i][0], S.K[i][1]], ms: 900 });
        const jarak = Math.sqrt((S.K[i][0] - S.S1) ** 2 + (S.K[i][1] - S.S2) ** 2);
        const h = Math.floor((h1 / jarak) * (rng.next() + 2));
        if (!(h > 0.15 * S.K[i][2])) {
          cetak("Sensors show no damage to enemy at " + S.K[i][0] + " , " + S.K[i][1]);
          continue;
        }
        S.K[i][2] -= h;
        cetak(h + " Unit hit on Klingon at sector " + S.K[i][0] + " , " + S.K[i][1]);
        if (S.K[i][2] > 0) {
          cetak("   (Sensors show " + Math.round(S.K[i][2]) + " units remaining)");
          continue;
        }
        cetak("**** KLINGON DESTROYED ****", 'st-merah');
        antre({ jenis: 'ledakan', sel: [S.K[i][0], S.K[i][1]], ms: 1100 });
        S.K3 -= 1; S.K9 -= 1;
        taruh(S.K[i][0], S.K[i][1], KOSONG);
        S.K[i][2] = 0;
        S.G[S.Q1][S.Q2] -= 100; S.Z[S.Q1][S.Q2] = S.G[S.Q1][S.Q2];
        if (S.K9 <= 0) { menang(); return; }
      }
      tembakKlingon();
      gambar();
    });
  }

  /* --- TORPEDO, baris 2750-3070 ----------------------------------------- */
  function torpedo() {
    if (S.P <= 0) { cetak("All photon torpedoes expended"); return; }
    if (S.D[5] < 0) { cetak("Photon tubes are not operational"); return; }
    minta("Photon torpedo course (1-9)", (v) => {
      let c1 = Number(v);
      if (c1 === 9) c1 = 1;
      if (!(c1 >= 1 && c1 < 9)) {
        cetak("Ensign Chekov reports,  'Incorrect course data, sir!'"); return;
      }
      const [x1, x2] = vektor(c1);
      S.E -= 2; S.P -= 1;
      bunyi('torpedo');
      let x = S.S1, y = S.S2;
      /* Jejaknya dikumpulkan sambil jalan — sel yang sama yang dicetak
         baris 2860 sebagai "Torpedo track:". Gambarnya mengikuti angka itu,
         bukan sebaliknya. */
      const jalur = [[S.S1, S.S2]];
      const lepas = () => antre({ jenis: 'torpedo', jalur: jalur.slice(),
                                  ms: 400 + jalur.length * 160 });
      cetak("Torpedo track:");
      for (;;) {
        x += x1; y += x2;
        const x3 = Math.floor(x + 0.5), y3 = Math.floor(y + 0.5);
        if (x3 < 1 || x3 > 8 || y3 < 1 || y3 > 8) {
          lepas();
          cetak("Torpedo missed"); tembakKlingon(); gambar(); return;
        }
        jalur.push([x3, y3]);
        cetak("              " + x3 + " , " + y3);
        if (cocok(x, y, KOSONG)) continue;
        if (cocok(x, y, KLINGON)) {
          lepas();
          antre({ jenis: 'ledakan', sel: [x3, y3], ms: 1100 });
          cetak("**** KLINGON DESTROYED ****", 'st-merah');
          S.K3 -= 1; S.K9 -= 1;
          if (S.K9 <= 0) { menang(); return; }
          let idx = 3;
          for (let i = 1; i <= 3; i++) if (x3 === S.K[i][0] && y3 === S.K[i][1]) { idx = i; break; }
          S.K[idx][2] = 0;
          taruh(x, y, KOSONG);
          S.G[S.Q1][S.Q2] = S.K3 * 100 + S.B3 * 10 + S.S3;
          S.Z[S.Q1][S.Q2] = S.G[S.Q1][S.Q2];
          tembakKlingon(); gambar(); return;
        }
        if (cocok(x, y, BINTANG)) {
          lepas();
          antre({ jenis: 'kena', sel: [x3, y3], ms: 900 });
          cetak("Star at " + x3 + " , " + y3 + " absorbed torpedo energy.");
          tembakKlingon(); gambar(); return;
        }
        if (cocok(x, y, BASIS)) {
          lepas();
          antre({ jenis: 'ledakan', sel: [x3, y3], ms: 1100 });
          cetak("*** STARBASE DESTROYED ***", 'st-merah');
          S.B3 -= 1; S.B9 -= 1;
          /* 2990: syaratnya tidak pernah salah selama permainan berjalan,
             karena T <= T0+T9 membuat T-T0-T9 <= 0 dan K9 >= 1. Jadi hukuman
             CYGNUS 12 di 3000-3020 tidak bisa dicapai. Bentuknya menunjukkan
             yang dimaksud SISA hari (T0+T9-T); tandanya terbalik. */
          if (!(S.B9 > 0 || S.K9 > S.T - S.T0 - S.T9)) {
            cetak("THAT DOES IT, CAPTAIN!!  You are hereby relieved of command");
            cetak("and sentenced to 99 stardates of hard labor on CYGNUS 12!!");
            akhir(); return;
          }
          cetak("Starfleet reviewing your record to consider");
          cetak("court martial!");
          S.D0 = 0;
          taruh(x, y, KOSONG);
          S.G[S.Q1][S.Q2] = S.K3 * 100 + S.B3 * 10 + S.S3;
          S.Z[S.Q1][S.Q2] = S.G[S.Q1][S.Q2];
          tembakKlingon(); gambar(); return;
        }
        /* 2960 ELSE 2770: sel berisi Enterprise sendiri -> tanya ulang */
        torpedo(); return;
      }
    });
  }

  /* --- SHIELDS, baris 3090-3160 ----------------------------------------- */
  function perisai() {
    if (S.D[7] < 0) { cetak("Shield control inoperable"); return; }
    cetak("Energy available = " + (S.E + S.S));
    minta("Number of units to shields?", (v) => {
      const x = Number(v);
      if (x < 0 || S.S === x) { cetak("<shields unchanged>"); return; }
      if (!(x < S.E + S.S)) {
        /* 3130-3140. Baris 3140 juga string yang tidak pernah ditutup, dan
           kali ini yang tertelan adalah SEBUAH PERINTAH: `:goto 1990` ada di
           dalam string, jadi tidak pernah dijalankan. Alur jatuh ke 3150 —
           yang MENERAPKAN perubahannya. Penolakan yang dikabulkan.
           (Dan seandainya kutipnya tertutup, GOTO 1990 mendarat di `NEXT I`
           tanpa FOR yang aktif, jadi kekeliruan ketik itu justru menukar
           sebuah kemacetan dengan sebuah celah.) */
        cetak("Shield Control reports  'This is not the federation treasury.'");
        cetak("<shields unchanged>:goto 1990");
      }
      S.E = S.E + S.S - x; S.S = x;
      cetak("Deflector Control Room report:");
      cetak("  'Shields now at " + Math.floor(S.S) + " units per your command.'");
    });
  }

  /* --- DAMAGE, baris 3180-3330 ------------------------------------------ */
  function kerusakan() {
    if (S.D[6] < 0) {
      cetak("Damage control report not available");
      if (S.D0 === 0) return;
      perbaikanDiPangkalan(); return;
    }
    laporanKerusakan();
    if (S.D0 !== 0) perbaikanDiPangkalan();
  }
  function laporanKerusakan() {
    cetak(""); cetak("Device            state of repair");
    for (let r = 1; r <= 8; r++) {
      const n = namaAlat(r);
      cetak(n + ' '.repeat(Math.max(1, 25 - n.length)) +
            (Math.floor(S.D[r] * 100) * 0.01));
    }
    cetak("");
  }
  function perbaikanDiPangkalan() {
    let d3 = 0;
    for (let i = 1; i <= 8; i++) if (S.D[i] < 0) d3 += 1;
    if (d3 === 0) return;
    d3 += S.D4; if (d3 >= 1) d3 = 0.9;
    cetak("");
    cetak("Technicians standing by to effect repairs to your ship;");
    cetak("estimated time to repair: " + (0.01 * Math.floor(100 * d3)) + " stardates");
    minta("Will you authorize the repair order (Y/N)?", (v) => {
      if (v !== 'y' && v !== 'Y') return;
      for (let i = 1; i <= 8; i++) if (S.D[i] < 0) S.D[i] = 0;
      S.T += d3 + 0.1;
      laporanKerusakan();
    });
  }

  /* --- Klingon menembak, baris 3350-3460 -------------------------------- */
  function tembakKlingon() {
    if (S.K3 <= 0) return;
    if (S.D0 !== 0) { cetak("Starbase shields protect the ENTERPRISE"); return; }
    for (let i = 1; i <= 3; i++) {
      if (S.K[i][2] <= 0) continue;
      const jarak = Math.sqrt((S.K[i][0] - S.S1) ** 2 + (S.K[i][1] - S.S2) ** 2);
      /* 3380: RND(0) di GW-BASIC MENGULANG nilai acak terakhir, yaitu nilai
         yang baru saja dipakai di (2+RND(1)) pada baris yang sama. Jadi
         seberapa keras pukulannya dan seberapa cepat Klingon itu kehabisan
         tenaga berasal dari SATU undian, bukan dua. Ditiru persis. */
      const r = rng.next();
      const h = Math.floor((S.K[i][2] / jarak) * (2 + r));
      S.S -= h;
      S.K[i][2] = S.K[i][2] / (3 + r);
      cetak("ENTERPRISE HIT!", 'st-merah');
      antre({ jenis: 'phaser', dari: [S.K[i][0], S.K[i][1]], ke: [S.S1, S.S2], ms: 900 });
      antre({ jenis: 'kena', sel: [S.S1, S.S2], ms: 900 });
      bunyi('alarm');
      cetak(h + " Unit hit on ENTERPRISE from sector " + S.K[i][0] + " , " + S.K[i][1]);
      if (S.S <= 0) { hancur(); return; }
      cetak("      <shields down to " + Math.round(S.S) + " units>");
      if (h < 20) continue;
      if (rng.next() > 0.6 || h / S.S <= 0.02) continue;
      const r1 = fnr();
      S.D[r1] = S.D[r1] - h / S.S - 0.5 * rng.next();
      cetak("Damage control reports  '" + namaAlat(r1) + " damaged by the hit'");
    }
  }

  /* --- COMPUTER, baris 3990-4780 ---------------------------------------- */
  function komputer() {
    if (S.D[8] < 0) { cetak("Computer Disabled"); return; }
    minta("Computer active and awaiting command", (v) => {
      const tiga = v.slice(0, 3).toUpperCase();
      const k = [...Array(6).keys()].map(i => CM1.substr(3 * i, 3)).indexOf(tiga) + 1;
      if (k === 0) {
        ["Functions available from library-computer:",
         "   KEY 1= Cumulative galactic record", "   KEY 2 = Status report",
         "   KEY 3 = Photon torpedo data", "   KEY 4 = Starbase nav data",
         "   KEY 5 = Direction/distance calculator",
         "   KEY 6 = Galaxy 'region name' map", ""].forEach(s => cetak(s));
        komputer(); return;
      }
      [rekamGalaksi, status, dataTorpedo, navPangkalan, kalkulator, petaWilayah][k - 1]();
    });
  }

  function rekamGalaksi() {                                 /* 4230-4380 */
    cetak("");
    cetak("            Computer record of galaxy for quadrant " + S.Q1 + " , " + S.Q2);
    cetak("");
    tampilkanPeta(true);
  }
  function petaWilayah() {                                  /* 4210 */
    cetak("                        the galaxy");
    tampilkanPeta(false);
  }
  function tampilkanPeta(rekam) {
    cetak("       1     2     3     4     5      6    7      8");
    const garis = "     ----- ----- ----- ----- ----- ------ ----- -----";
    cetak(garis);
    for (let i = 1; i <= 8; i++) {
      if (rekam) {
        let b = ' ' + i + ' ';
        for (let j = 1; j <= 8; j++) {
          b += '   ' + (S.Z[i][j] === 0 ? '***' : String(S.Z[i][j] + 1000).slice(-3));
        }
        cetak(b);
      } else {
        /* 4350-4360: hanya DUA nama per baris — kolom 1 dan kolom 5. Peta
           "region name" tidak pernah menampilkan kolom 2,3,4,6,7,8. */
        const a = namaKuadran(i, 1, 1), b = namaKuadran(i, 5, 1);
        cetak(' ' + i + '  ' + ' '.repeat(Math.max(1, 12 - Math.floor(a.length / 2))) + a +
              ' '.repeat(Math.max(1, 24 - Math.floor(b.length / 2) - a.length)) + b);
      }
      cetak(garis);
    }
    cetak("");
  }

  function status() {                                       /* 4400-4470 */
    cetak("   Status Report:");
    /* 4400 berbunyi:  PRINT"   Status Report:"X$="":IF K9>1 THEN X$="s"
       Titik dua sebelum X$ HILANG, jadi `X$=""` bukan penetapan melainkan
       PERBANDINGAN yang ikut tercetak (0 atau -1) — dan X$ TIDAK PERNAH
       dikosongkan. Karena baris 1750 menyetel X$="8" (batas warp), laporan
       status setelah sebuah perintah NAV bisa berbunyi "Klingon8 left: 1". */
    cetak(String(S.X === '' ? -1 : 0));
    if (S.K9 > 1) S.X = 's';
    cetak("Klingon" + S.X + " left: " + S.K9);
    cetak("Mission must be completed in " +
          (0.1 * Math.floor((S.T0 + S.T9 - S.T) * 10)) + " stardates");
    let xs = 's';
    if (S.B9 < 2) xs = '';
    if (S.B9 < 1) {
      cetak("Your stupidity has left you on your own in");
      cetak("    the galaxy -- you have no starbases left!");
    } else {
      cetak("The federation is maintaining " + S.B9 + " starbase" + xs + "in the galaxy");
    }
    kerusakan();
  }

  function dataTorpedo() {                                  /* 4490-4540 */
    if (S.K3 <= 0) {
      cetak("Science Officer Spock reports  'Sensors show no enemy ships");
      cetak("                                in this quadrant'"); return;
    }
    cetak("From ENTERPRISE to Klingon battle cruiser" + (S.K3 > 1 ? 's' : ''));
    for (let i = 1; i <= 3; i++) {
      if (S.K[i][2] <= 0) continue;
      arahJarak(S.S1, S.S2, S.K[i][0], S.K[i][1]);
    }
  }

  function navPangkalan() {                                 /* 4750-4780 */
    if (S.B3 !== 0) {
      cetak("From ENTERPRISE to Starbase:");
      S.W1 = S.B4; S.Xn = S.B5;
    }
    /* 4760 GOTO 4540 tanpa syarat: pesan Spock di 4770-4780 tidak pernah
       dijalankan, dan kalau tidak ada starbase di kuadran ini, W1 dan X
       masih berisi nilai lama — faktor warp terakhir dan jumlah unit phaser
       terakhir. Arah "ke starbase" dihitung ke titik itu. Dipertahankan. */
    arahJarak(S.S1, S.S2, S.W1, S.Xn);
  }

  function kalkulator() {                                   /* 4550-4580 */
    cetak("Direction/Distance Calculator:");
    cetak("You are at quadrant " + S.Q1 + " , " + S.Q2 +
          "  sector " + S.S1 + " , " + S.S2);
    cetak("Please enter");
    minta(" initial coordinates (x,y)", (v) => {
      const [c1, a] = v.split(/[, ]+/).map(Number);
      minta(" Final coordinates (x,y)", (w) => {
        const [w1, x] = w.split(/[, ]+/).map(Number);
        arahJarak(c1, a, w1, x);
      });
    });
  }

  /* --- 4590-4730: kalkulator arah/jarak ---------------------------------
     Inilah rutin yang manualnya sendiri ragukan, dan yang justru tepat
     sempurna: 4.032 dari 4.032 pasangan. Ia bukan menghitung SUDUT — ia
     membalik interpolasi di baris 2080. Lihat panel di halaman. */
  function arahJarak(c1, a, w1, x) {
    x = x - a; a = c1 - w1;                                 /* 4590 */
    const jarak = Math.sqrt(x * x + a * a);
    let base, hasil;
    const cabang1 = (b) => (Math.abs(a) <= Math.abs(x))
      ? b + Math.abs(a) / Math.abs(x)
      : b + ((Math.abs(a) - Math.abs(x)) + Math.abs(a)) / Math.abs(a);
    const cabang2 = (b) => (Math.abs(a) >= Math.abs(x))
      ? b + Math.abs(x) / Math.abs(a)
      : b + ((Math.abs(x) - Math.abs(a)) + Math.abs(x)) / Math.abs(x);
    if (x < 0) { if (a > 0) { base = 3; hasil = cabang2(base); }
                 else { base = 5; hasil = cabang1(base); } }
    else if (a < 0) { base = 7; hasil = cabang2(base); }
    else if (x > 0) { base = 1; hasil = cabang1(base); }
    else if (a === 0) { base = 5; hasil = cabang1(base); }
    else { base = 1; hasil = cabang1(base); }
    if (!isFinite(hasil)) {
      /* GW-BASIC tidak berhenti pada pembagian nol: ia mencetak pesan dan
         meneruskan dengan tak-hingga mesin. Terjadi hanya kalau dua
         koordinat yang sama diketik ke kalkulator. */
      cetak("Division by zero");
      cetak("Direction = 1.701412E+38");
    } else {
      cetak("Direction = " + bulat(hasil));
    }
    cetak("Distance = " + bulat(jarak));
    return hasil;
  }
  const bulat = (v) => Number(v.toPrecision(7)).toString();

  /* --- RESIGN / akhir --------------------------------------------------- */
  function mundur() { akhir(); }
  function habisWaktu() { cetak("It is stardate " + bulat(S.T)); akhir(); return true; }
  function hancur() {
    cetak("");
    cetak("the ENTERPRISE has been destroyed.  The Federation will be conquered",
          'st-merah');
    cetak("It is stardate " + bulat(S.T));
    akhir();
  }
  function menang() {
    cetak("Congratulations, Captain! the last Klingon battle cruiser", 'st-hijau');
    cetak("menacing the Federation has been destroyed.", 'st-hijau');
    cetak("");
    /* 3700: satu-satunya angka nilai di seluruh program. */
    const nilai = 1000 * Math.pow(S.K7 / (S.T - S.T0), 2);
    cetak("Your efficiency rating is " + bulat(nilai));
    store.addHighScore('CAPT', Math.round(nilai));
    akhir(true);
  }
  function akhir(sudahCetak) {
    if (!sudahCetak) {
      cetak("There were " + S.K9 + " Klingon battle cruisers left at");
      cetak("the end of your mission");
    }
    S.selesai = true;
    q('prompt').textContent = 'selesai';
    q('ketik').disabled = true;
    gambar();
    papanSkor();
  }

  /* ======================================================================
     Bagian 10 — gambar
     ====================================================================== */
  const NS = 'http://www.w3.org/2000/svg';
  const ART = window.RETRO.TREK_ART;
  const SEL = 100;                       /* ukuran satu sel di ruang SVG */
  let modeGlif = false;                  /* saklar: kembali ke glif CP437 1981 */
  let antrean = [];                      /* efek yang menunggu digambar */

  /* Definisi bersama disisipkan SEKALI ke dalam halaman, bukan diulang di
     tiap penggambaran — pola yang sama dengan `ensureDefs()` di
     `_shared/svg.js`. Karena ia berdiri sendiri, legenda dan panel bisa
     ikut memakai <use> ke simbol yang sama, dan saklar glif tidak
     menghapusnya. */
  function pastikanDefs() {
    if (document.getElementById('tr-defs')) return;
    const d = document.createElement('div');
    d.id = 'tr-defs';
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    d.innerHTML = '<svg width="0" height="0">' + ART.DEFS + '</svg>';
    document.body.prepend(d);
  }

  const pusat = (i, j) => [(j - 0.5) * SEL, (i - 0.5) * SEL];
  function pakai(id, i, j, ukuran) {
    const x = (j - 1) * SEL + (SEL - ukuran) / 2;
    const y = (i - 1) * SEL + (SEL - ukuran) / 2;
    return '<use href="#' + id + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) +
           '" width="' + ukuran + '" height="' + ukuran + '"/>';
  }

  /* Petak digambar dari Q$, bukan dari larik lain. Kalau ada dua sumber
     kebenaran, salah satunya akan salah — pelajaran BOWLING, dibalik.
     Yang berubah cuma cara MENGGAMBARnya, bukan apa yang digambar. */
  /* Papan dan efek adalah DUA lapisan yang bertumpuk, bukan satu.

     Versi pertama menaruh <g id="tr-efek"> di dalam svg papannya, dan
     efeknya tidak pernah terlihat: satu perintah memanggil gambar() lebih
     dari sekali (sekali di dalam penangannya, sekali lagi sesudah masukan
     diterima), dan penggambaran kedua menimpa lapisan yang baru saja diisi.
     Memisahkannya membuat pertanyaannya hilang sama sekali — papan boleh
     digambar ulang sesering apa pun tanpa menyentuh efek yang sedang
     berjalan. Keduanya memakai viewBox 800x800 yang sama, jadi
     koordinatnya tetap satu. */
  function pastikanLapisan() {
    if (document.getElementById('papan')) return;
    q('petak').innerHTML =
      '<div id="papan" class="st-papan"></div>' +
      '<svg id="lapisFx" class="st-fxLayer" viewBox="0 0 ' + (8 * SEL) + ' ' +
      (8 * SEL) + '" aria-hidden="true"><g id="tr-efek"></g></svg>';
  }

  function gambarPetak() {
    pastikanLapisan();
    const petak = document.getElementById('papan');
    q('petak').classList.toggle('st-modeGlif', modeGlif);

    if (modeGlif) {
      /* Bentuk 1981 apa adanya, untuk dibandingkan. */
      let html = '';
      for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) {
        const sel = isi(i, j);
        let k = 'st-sel', t = sel;
        if (sel === KOSONG) { t = TITIK; k += ' st-hampa'; }
        else if (sel === KAPAL) k += ' st-kapal';
        else if (sel === KLINGON) k += ' st-klingon';
        else if (sel === BASIS) k += ' st-basis';
        else if (sel === BINTANG) k += ' st-bintang';
        html += '<span class="' + k + '">' + t + '</span>';
      }
      petak.innerHTML = html;
      return;
    }

    const L = 8 * SEL;
    let s = '<svg class="st-svg" viewBox="0 0 ' + L + ' ' + L + '" ' +
            'role="img" aria-label="Sensor jarak dekat, petak 8 kali 8 sektor">';
    s += ART.latar(S.Q1, S.Q2, L, L);

    /* Kisi sektor: sangat samar. Ia harus ada — koordinat sektor adalah
       bahasa perintahnya — tapi ia bukan yang dilihat. */
    let kisi = '';
    for (let n = 1; n < 8; n++) {
      kisi += '<path d="M' + n * SEL + ' 0 V' + L + '"/>' +
              '<path d="M0 ' + n * SEL + ' H' + L + '"/>';
    }
    s += '<g stroke="#7fd8ff" stroke-width="1" opacity=".10" fill="none">' + kisi + '</g>';

    for (let i = 1; i <= 8; i++) for (let j = 1; j <= 8; j++) {
      const sel = isi(i, j);
      if (sel === KAPAL) {
        s += '<g class="st-spr st-sprKapal">' + pakai('tr-enterprise', i, j, 94) +
             '<title>Enterprise — sektor ' + i + ',' + j + '</title></g>';
      } else if (sel === KLINGON) {
        s += '<g class="st-spr st-sprKlingon">' + pakai('tr-kapal-klingon', i, j, 90) +
             '<title>Klingon — sektor ' + i + ',' + j + '</title></g>';
      } else if (sel === BASIS) {
        s += '<g class="st-spr st-sprBasis">' + pakai('tr-starbase', i, j, 82) +
             '<title>Starbase — sektor ' + i + ',' + j + '</title></g>';
      } else if (sel === BINTANG) {
        const b = ART.bintangUntuk(S.Q1, S.Q2, i, j);
        s += '<g class="st-spr st-sprBintang">' +
             pakai(b.simbol, i, j, Math.round(96 * b.skala)) +
             '<title>Bintang — sektor ' + i + ',' + j + '</title></g>';
      }
    }
    s += '</svg>';
    petak.innerHTML = s;
  }

  /* --- lapisan efek ------------------------------------------------------
     Digambar SESUDAH petaknya, dan dibuang sendiri. Antre dulu supaya efek
     yang lahir di tengah sebuah perintah tidak terhapus oleh penggambaran
     ulang di akhir perintah yang sama. */
  const antre = (e) => { antrean.push(e); };
  function potong(markup) {
    const d = new DOMParser().parseFromString(
      '<svg xmlns="' + NS + '">' + markup + '</svg>', 'image/svg+xml');
    const f = document.createDocumentFragment();
    while (d.documentElement.firstChild) f.append(d.documentElement.firstChild);
    return f;
  }
  function jalankanEfek() {
    const g = document.getElementById('tr-efek');
    const daftar = antrean; antrean = [];
    if (!g || modeGlif || !daftar.length) return;
    daftar.forEach(e => {
      const markup = BENTUK_EFEK[e.jenis] && BENTUK_EFEK[e.jenis](e);
      if (!markup) return;
      const w = document.createElementNS(NS, 'g');
      w.append(potong(markup));
      g.append(w);
      setTimeout(() => w.remove(), e.ms || 1200);
    });
  }

  const BENTUK_EFEK = {
    phaser(e) {
      const [x1, y1] = pusat(e.dari[0], e.dari[1]);
      const [x2, y2] = pusat(e.ke[0], e.ke[1]);
      const g = 'x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"';
      return '<line class="st-fxPhaser" ' + g + ' stroke="#2aa8d8" stroke-width="16"/>' +
             '<line class="st-fxPhaser" ' + g + ' stroke="#8ef0ff" stroke-width="7"/>' +
             '<line class="st-fxPhaser" ' + g + ' stroke="#ffffff" stroke-width="2.4"/>';
    },
    torpedo(e) {
      const d = e.jalur.map(([i, j], n) => {
        const [x, y] = pusat(i, j);
        return (n ? 'L' : 'M') + x + ' ' + y;
      }).join(' ');
      const lama = Math.max(0.35, e.jalur.length * 0.11);
      return '<path class="st-fxJejak" d="' + d + '" fill="none" stroke="#ffb066" ' +
             'stroke-width="3" stroke-linecap="round"/>' +
             '<circle r="11" fill="url(#tr-bussard)" filter="url(#tr-nyalaBesar)">' +
             '<animateMotion dur="' + lama + 's" fill="freeze" path="' + d + '"/>' +
             '</circle>';
    },
    ledakan(e) {
      const [x, y] = pusat(e.sel[0], e.sel[1]);
      return '<g transform="translate(' + x + ' ' + y + ')">' +
             '<circle class="st-fxKilat" r="34" fill="#fff0c8"/>' +
             '<circle class="st-fxCincin" r="10" fill="none" stroke="#ffb066" stroke-width="7"/>' +
             '<circle class="st-fxCincin2" r="10" fill="none" stroke="#ff6a3c" stroke-width="3"/>' +
             '</g>';
    },
    kena(e) {
      const [x, y] = pusat(e.sel[0], e.sel[1]);
      return '<g transform="translate(' + x + ' ' + y + ')">' +
             '<circle class="st-fxPerisai" r="46" fill="none" stroke="#7fd8ff" stroke-width="5"/>' +
             '</g>';
    }
  };

  function gambar() {
    gambarPetak();
    jalankanEfek();

    const set = (id, v) => { q(id).textContent = v; };
    set('s-stardate', bulat(Math.floor(S.T * 10) * 0.1));
    set('s-kondisi', S.D0 ? S.CS + '  ⟨CC$="docked"⟩' : S.CS);
    set('s-kuadran', S.Q1 + ' , ' + S.Q2);
    set('s-sektor', S.S1 + ' , ' + S.S2);
    set('s-torpedo', Math.floor(S.P));
    set('s-energi', Math.floor(S.E + S.S));
    set('s-perisai', Math.floor(S.S));
    set('s-energi2', Math.floor(S.E + S.S));
    set('s-perisai2', Math.floor(S.S));
    set('s-klingon', Math.floor(S.K9));
    set('s-nama', namaKuadran(S.Q1, S.Q2, 0));
    const salah = namaKuadran(S.Q1, S.Q2, 0) !== namaSeharusnya(S.Q1, S.Q2);
    q('s-nama').className = 'st-nilai mono' + (salah ? ' st-salah' : '');
    q('s-nama-catatan').textContent = salah
      ? 'seharusnya ' + namaSeharusnya(S.Q1, S.Q2) : '';
    q('s-kondisi').className = 'st-nilai mono' +
      (S.CS === '*red*' ? ' st-salah' : '');
    q('s-energi-box').classList.toggle('stat--bad', S.E + S.S < 500);
    q('s-perisai-box').classList.toggle('stat--warn', S.S < 200);
  }

  function papanSkor() {
    const l = store.highScores();
    q('skor').innerHTML = l.length
      ? l.slice(0, 5).map(s => '<li>' + s.score + '</li>').join('')
      : '<li class="st-kecil">belum ada</li>';
  }

  /* ======================================================================
     Bagian 11 — bukti yang dihitung saat halaman dimuat
     ====================================================================== */
  function bukti() {
    /* --- peta nama: dihitung dari kaidah 5040/5140/5230 sendiri --- */
    let html = '<tr><th></th>';
    for (let j = 1; j <= 8; j++) html += '<th>' + j + '</th>';
    html += '</tr>';
    const hitung = {};
    for (let i = 1; i <= 8; i++) {
      html += '<tr><th>' + i + '</th>';
      for (let j = 1; j <= 8; j++) {
        const n = namaKuadran(i, j, 0);
        hitung[n] = (hitung[n] || 0) + 1;
        const salah = n !== namaSeharusnya(i, j);
        html += '<td class="' + (salah ? 'st-salah-sel' : '') + '" title="' + n +
                (salah ? ' — seharusnya ' + namaSeharusnya(i, j) : '') + '">' +
                n.replace(/ /g, '&nbsp;') + '</td>';
      }
      html += '</tr>';
    }
    q('b-peta').innerHTML = html;
    const berbeda = Object.keys(hitung).length;
    const berbagi = Object.keys(hitung).filter(k => hitung[k] > 1)
      .reduce((s, k) => s + hitung[k], 0);
    q('b-nama-beda').textContent = berbeda;
    q('b-nama-berbagi').textContent = berbagi;
    q('b-nama-salah').textContent =
      [...Array(64).keys()].filter(n => {
        const i = Math.floor(n / 8) + 1, j = (n % 8) + 1;
        return namaKuadran(i, j, 0) !== namaSeharusnya(i, j);
      }).length;
    const adaAldebaran = Object.keys(hitung).some(k => k.indexOf('Aldebaran') === 0);
    q('b-aldebaran').textContent = adaAldebaran ? 'muncul' : 'nol kuadran';
    q('b-betelgeuse').textContent = Object.keys(hitung)
      .filter(k => k.indexOf('Betelgeuse') === 0)
      .reduce((s, k) => s + hitung[k], 0) + ' kuadran';

    /* --- kalkulator arah lawan penggerak torpedo, disapu di sini --- */
    let total = 0, sejajar = 0, luput = 0;
    for (let s1 = 1; s1 <= 8; s1++) for (let s2 = 1; s2 <= 8; s2++)
      for (let t1 = 1; t1 <= 8; t1++) for (let t2 = 1; t2 <= 8; t2++) {
        if (s1 === t1 && s2 === t2) continue;
        total++;
        const d = arahDiam(s1, s2, t1, t2);
        const [x1, x2] = vektor(d === 9 ? 1 : d);
        if (Math.abs(x1 * (t2 - s2) - x2 * (t1 - s1)) < 1e-9) sejajar++;
        /* jalankan torpedonya sungguhan */
        let x = s1, y = s2, kena = false;
        for (let n = 0; n < 20; n++) {
          x += x1; y += x2;
          const x3 = Math.floor(x + 0.5), y3 = Math.floor(y + 0.5);
          if (x3 < 1 || x3 > 8 || y3 < 1 || y3 > 8) break;
          if (x3 === t1 && y3 === t2) { kena = true; break; }
        }
        if (!kena) luput++;
      }
    q('b-arah-total').textContent = total.toLocaleString('id-ID');
    q('b-arah-sejajar').textContent = sejajar.toLocaleString('id-ID');
    q('b-arah-luput').textContent = luput;

    /* --- jarak Euclid lawan langkah Chebyshev --- */
    const beda = {};
    for (let s1 = 1; s1 <= 8; s1++) for (let s2 = 1; s2 <= 8; s2++)
      for (let t1 = 1; t1 <= 8; t1++) for (let t2 = 1; t2 <= 8; t2++) {
        if (s1 === t1 && s2 === t2) continue;
        const da = Math.abs(t1 - s1), db = Math.abs(t2 - s2);
        const k = Math.floor(Math.sqrt(da * da + db * db) + 0.5) - Math.max(da, db);
        beda[k] = (beda[k] || 0) + 1;
      }
    const tot = Object.keys(beda).reduce((s, k) => s + beda[k], 0);
    q('b-jarak').innerHTML = Object.keys(beda).sort((a, b) => a - b).map(k =>
      '<tr><td>' + (k > 0 ? '+' + k : k) + '</td><td>' + beda[k] +
      '</td><td>' + (100 * beda[k] / tot).toFixed(1) + '%</td></tr>').join('');
    q('b-jarak-meleset').textContent =
      (100 * (tot - beda[0]) / tot).toFixed(1) + '%';

    /* --- bunyi sebagai jam --- */
    const tabel = Object.keys(RUTIN_BUNYI).map(n => {
      const l = RUTIN_BUNYI[n]();
      const durasi = l.reduce((m, x) => Math.max(m, x.at + x.dur), 0);
      return '<tr><td>' + n + '</td><td>' + l.length + '</td><td>' +
             durasi.toFixed(2) + ' dtk</td></tr>';
    }).join('');
    q('b-bunyi').innerHTML = tabel;

    /* --- benih --- */
    const set = new Set();
    for (let s = 0; s < 60; s++) for (let m = 0; m < 60; m++) set.add(120 * (s + m));
    q('b-benih').textContent = set.size;
  }
  /* salinan 4590-4730 tanpa mencetak, untuk penyapuan di atas */
  function arahDiam(c1, a, w1, x) {
    x = x - a; a = c1 - w1;
    const c1a = (b) => (Math.abs(a) <= Math.abs(x))
      ? b + Math.abs(a) / Math.abs(x)
      : b + ((Math.abs(a) - Math.abs(x)) + Math.abs(a)) / Math.abs(a);
    const c2a = (b) => (Math.abs(a) >= Math.abs(x))
      ? b + Math.abs(x) / Math.abs(a)
      : b + ((Math.abs(x) - Math.abs(a)) + Math.abs(x)) / Math.abs(x);
    if (x < 0) return a > 0 ? c2a(3) : c1a(5);
    if (a < 0) return c2a(7);
    if (x > 0) return c1a(1);
    if (a === 0) return c1a(5);
    return c1a(1);
  }

  /* ======================================================================
     Bagian 12 — pasang
     ====================================================================== */
  function briefing() {                                     /* 1200-1250 */
    cetak("      Your orders are as follows: ");
    cetak("      Destroy the " + S.K9 + " Klingon warships which have invaded");
    cetak("    the galaxy before they can attack Federation headquarters");
    cetak("    on stardate " + (S.T0 + S.T9) + "  this gives you " + S.T9 +
          " days.  there" + S.X0);
    cetak("  " + S.B9 + " starbase" + S.X + " in the galaxy for resupplying your ship");
    cetak("");
  }

  function permainanBaru(benih) {
    kosongkanLog();
    q('ketik').disabled = false;
    mulai(benih);
    cetak("**** STAR TREK ****", 'st-judul');
    cetak("THE USS ENTERPRISE --- NCC-1701", 'st-judul');
    cetak("");
    briefing();
    masukKuadran(true);
    bebas();
    q('s-benih').textContent = String(S.benih >>> 0);
    gambar();
  }

  q('topbar-host').append(ui.topbar({
    title: 'Star Trek', source: 'STARTREK.BAS · Bob & Sharon Fritz · 1981'
  }));

  /* Tombol fungsi: padanan langsung baris 850-940, tempat program benar-benar
     MEMPROGRAM tombol F1-F10 milik GW-BASIC dengan teks perintah + Enter. */
  const KUNCI = [['F1', 'NAV'], ['F2', 'SRS'], ['F3', 'LRS'], ['F4', 'PHASERS'],
                 ['F5', 'TORPEDO'], ['F6', 'SHIELDS'], ['F7', 'DAMAGE REPORT'],
                 ['F8', 'COMPUTER'], ['F9', 'RESIGN']];
  q('kunci').innerHTML = KUNCI.map(([k, v]) =>
    '<button type="button" class="btn btn--ghost btn--sm st-kunci" data-v="' + v +
    '"><b>' + k + '</b> ' + v + '</button>').join('');
  q('kunci').querySelectorAll('[data-v]').forEach(b =>
    b.addEventListener('click', () => { q('ketik').value = b.dataset.v; kirim(); }));
  document.addEventListener('keydown', (e) => {
    const m = /^F([1-9])$/.exec(e.key);
    if (m && !S.selesai) { e.preventDefault(); q('ketik').value = KUNCI[m[1] - 1][1]; kirim(); }
  });

  function kirim() {
    const v = q('ketik').value;
    q('ketik').value = '';
    terimaBaris(v);
  }
  q('kirim').addEventListener('click', kirim);
  q('ketik').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); kirim(); }
  });
  q('glif').addEventListener('change', (e) => { modeGlif = e.target.checked; gambar(); });
  q('baru').addEventListener('click', () => permainanBaru());
  q('ulangi').addEventListener('click', () => {
    const v = prompt('Nomor benih (angka):', String(S.benih >>> 0));
    if (v !== null && v !== '') permainanBaru(Number(v) | 0);
  });

  /* Sambungan untuk pemeriksaan: seluruh keadaan dan tiga rutin murni.
     Dipakai untuk mengadu penyapuan di halaman ini dengan acuan Python,
     dan untuk membangun keadaan yang sulit dicapai dengan bermain —
     misalnya "K9 = 1 tepat sesudah sebuah perintah NAV". */
  window.RETRO.STARTREK = { S, arahDiam, vektor, namaKuadran, namaSeharusnya,
                            RUTIN_BUNYI, gambar, terimaBaris };

  pastikanDefs();
  bukti();
  papanSkor();
  permainanBaru();
})();
