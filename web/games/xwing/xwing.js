/* ===========================================================================
   xwing.js — port XWING.BAS, "Star Pilot" / X-Wing Fighter.

   George Blank, Leechburg PA, versi 4.0, 25 September 1978. Diport ke IBM PC
   oleh Ernest Smith dan Raymond Rogers, Houston, Desember 1982. Disket
   IPCO 2060-A. Program tertua di koleksi ini.

   Dan baris 1020 adalah kalimat paling jujur di seluruh 83 program:

       1020 REM * FOR PUBLIC DOMAIN UNLESS MOVIEMAKERS OBJECT *

   ATURANNYA DIPERTAHANKAN, TERMASUK YANG ANEH
   -------------------------------------------
   Permainan ini BUKAN "hancurkan tiga sasaran". Ia satu perlombaan:

     - Bintang Kematian (O) datang dari 70.000-102.000 km. Menang HANYA lewat
       torpedo ke arahnya, dan hanya kalau O-S <= 10.000 (5830) DAN piksel di
       bawah bidikan memang miliknya (5840, `POINT(38,21)<>3`) — uji tabrakan
       yang dilakukan dengan MEMBACA WARNA LAYAR, bukan membandingkan angka.
     - Pesawat Imperial (G) dan Darth Vader (J) tidak bisa dimatikan untuk
       selamanya: begitu mereka lewat, jaraknya ditambah 25.000 (3550, 4730)
       dan mereka datang lagi. Meriam cuma menunda.
     - Menabrak Bintang Kematian = CRASH. Waktu habis = TOO LATE.

   SKILL 0..3 (1920) mengubah empat hal sekaligus: batas waktu (5:00 / 3:00 /
   2:45 / 2:30), seberapa sering musuh mengelak (BYPASS), peluang selamat saat
   dilewati (3580, 4760), dan peluang torpedonya kena (5850, 5870). Di SKILL 0
   torpedo yang sudah masuk jangkauan dan tepat sasaran SELALU menang — baris
   5850 memotong sebelum lemparan dadunya.

   YANG MEMBUAT PROGRAM INI PANTAS JADI YANG TERAKHIR
   --------------------------------------------------
     - SPRITE SEBAGAI ANGKA (IM4..IM8) dan SPRITE SEBAGAI BAHASA (makro DRAW
       yang di-GET dari layar, 1330/1340) — dua cara menyimpan gambar, di satu
       program. Lihat pesawat.js.
     - BUNYI SEBAGAI JAM. `SOUND 37*Q,1` di baris 2440 adalah deru mesin YANG
       NADANYA KECEPATAN ANDA, dan sekaligus pengatur laju gelungnya: satu
       centang = 1/18,2 detik. Animasi lintasnya pakai `PLAY "P4"`.
     - ENAM PENANGAN KEJADIAN, `ON KEY(1)`, `KEY(2)`, `KEY(11..14)`.
     - `POKE &H410` (1070), alamat BIOS yang sama dengan DRAW.BAS di sesi 26.
     - `RANDOMIZE(VAL(RIGHT$(TIME$,2)))` (1310) — 60 benih.
     - WAKTU JAM DINDING. Baris 2290/5200 membaca `TIME$` sungguhan, bukan
       menghitung putaran gelung. Satu-satunya di koleksi yang begitu.
   =========================================================================== */
(function () {
  'use strict';

  const ui = window.RETRO.ui;
  const ART = window.RETRO.XW_ART;
  const audio = window.RETRO.audio;
  const store = window.RETRO.store('xwing');
  const q = (id) => document.getElementById(id);

  /* Medan grafiknya: `LINE (1,1)-(76,42),3,B` di baris 2160. Bidikan tetap
     di (38,21) — baris 2180 menggambar garis tegaknya di x=38. */
  const LEBAR = 76, TINGGI = 42, BIDIK_X = 38, BIDIK_Y = 21;
  /* 1100-1170. Batasnya TIDAK simetris, dan itu aslinya. Dideklarasikan di
     sini, bukan di dekat penangan tombol, karena `gambar()` juga memakainya
     untuk menggambar tangga kemudi — dan `const` di bawah tempat pakainya
     adalah jebakan zona-mati yang tidak perlu diambil risikonya. */
  const BATAS_V = 3, BATAS_W = 5;

  /* 2110-2140. BYPASS untuk SKILL 3 tidak pernah ditetapkan, jadi ia tetap 0
     — nilai bawaan peubah BASIC. Itu bukan kelalaian saya; itu listingnya. */
  const TINGKAT = [
    { menit: 5, detik: 0,  bypass: 3 },
    { menit: 3, detik: 0,  bypass: 2 },
    { menit: 2, detik: 45, bypass: 1 },
    { menit: 2, detik: 30, bypass: 0 }
  ];

  const S = {};
  let rng = null;
  const rnd = () => rng.next();
  const irnd = (n) => Math.floor(rnd() * n);          /* INT(RND*n) */

  function mulai(benih, skill) {
    rng = window.RETRO.rng(benih === undefined ? window.RETRO.freshSeed() : benih);
    S.benih = rng.seed;
    S.SKILL = skill;
    const t = TINGKAT[skill];
    S.bypass = t.bypass;
    S.waktu = t.menit * 60 + t.detik;                 /* A1:A2, jam dinding */

    /* 2050-2080 */
    S.M = irnd(61) + 10; S.N = irnd(21) + 10; S.O = irnd(32001) + 70000;
    S.E = irnd(61) + 10; S.F = irnd(21) + 10; S.G = 25000;
    S.H = irnd(61) + 10; S.I = irnd(21) + 10; S.J = irnd(32001) + 40000;
    S.Q = 5; S.Z = 3;
    S.S = 0; S.V = 0; S.W = 0;

    /* 2090-2100. Kotak bidik ikut membesar saat musuh mendekat — 1x1, lalu
       2x2, lalu 4x3. Perhatikan yang terakhir: LEBIH LEBAR daripada tinggi,
       asimetri yang sama arahnya dengan batas kemudi. */
    S.IMX = 38; S.IMY = 21; S.IMR1 = 1; S.IMR2 = 1; S.imTahap = 0;
    S.DVX = 38; S.DVY = 21; S.DVR1 = 1; S.DVR2 = 1; S.dvTahap = 0;
    S.dsTahap = 0;
    S.FLAG1 = 0; S.FLAG2 = 0;

    S.pesan = []; S.selesai = null; S.tembak = null; S.ledak = null;
    S.lintas = null; S.pecah = false;
    S.torpedoTerpakai = 0;
    S.detak = 0;                 /* pencacah bingkai, untuk denyut kunci */
    S.awasSejak = 0;
    /* Torpedo yang terbuang DI LUAR JANGKAUAN. Dihitung terpisah dari `Z`
       karena inilah cara paling sering kehilangan permainan tanpa sadar:
       5820 mengurangi Z sebelum 5830 memeriksa jaraknya. */
    S.torpedoJauh = 0;
  }

  function catat(t, k) {
    S.pesan.unshift({ t, k });
    if (S.pesan.length > 7) S.pesan.pop();
  }

  /* ======================================================================
     LAJU GELUNG — dan koreksi atas kekeliruan saya sendiri.

     Versi pertama memakai 18,2 Hz dengan alasan `SOUND 37*Q,1` di baris 2440
     menahan satu centang (1/18,2 detik). Itu keliru: satu centang adalah
     LANTAI, bukan lajunya. Satu putaran gelung utama aslinya mengerjakan
     jauh lebih banyak — DELAPAN pasang `LOCATE`+`PRINT` (2340-2430), dua
     `PUT`, dua GOSUB berisi enam `KEY ... ON/STOP` (1180/1190), lalu blok
     Bintang Kematian, Imperial, dan Vader dengan `PUT`-nya masing-masing,
     ditambah `INKEY$` dan dua pembacaan `TIME$`. Di BASICA yang ditafsirkan
     pada 4,77 MHz, kerja itu yang menentukan, bukan bunyinya.

     Akibat kekeliruan itu nyata dan dilaporkan pemain: pada 18,2 Hz kemudi
     menyeret seluruh medan ke tepi dalam 1,8 detik, dan jendela membidik di
     Mach 10 cuma 5,5 detik. Permainannya bukan sulit, ia tak terkendali.

     Lajunya tidak bisa saya UKUR — itu perlu menjalankan DOSBox, dan itu di
     luar batas proyek ini. Yang bisa dilakukan: mencari laju yang membuat
     angka-angka programnya SENDIRI membentuk permainan yang utuh.

       Hz    dekat Q=9   dekat Q=5   bidik Q=1   medan W=1   medan W=5
       18,2      4,6 s       8,4 s       5,5 s       1,9 s       0,4 s
        9        9,4 s      16,9 s      11,1 s       3,8 s       0,8 s
        6       14,1 s      25,3 s      16,7 s       5,7 s       1,1 s
        3       28,1 s      50,7 s      33,3 s      11,3 s       2,3 s

     Pada 6 Hz semuanya masuk akal sekaligus: mendekat dengan Mach 90 makan
     14 detik, memperlambat ke Mach 10 memberi jendela membidik 17 detik, dan
     kemudi butuh 5,7 detik untuk menyeret medan ke tepi — cukup lama untuk
     dikoreksi. Dan 6 Hz kebetulan juga sekitar 100-170 ms per putaran, yang
     sesuai dengan perkiraan kerja BASICA di atas. Dua alasan yang tidak
     bergantung satu sama lain menunjuk ke tempat yang sama.

     Ini tetap PENYIMPANGAN, bukan pemulihan: aslinya tidak punya laju tetap
     sama sekali — ia berbeda di tiap mesin, dan itulah cacat seluruh generasi
     permainan ini. Yang berubah cuma pilihan angkanya, dari yang mustahil
     (lantai teoretis) ke yang bisa dipertanggungjawabkan.
     ====================================================================== */
  const HZ = 6;
  let jam = null;

  function langkah(dt) {
    if (S.selesai) return;
    S.detak++;

    /* Animasi lintas: musuhnya sudah sampai, dan selama gambarnya berjalan
       program aslinya juga tidak mengurus apa pun yang lain (3190-3550). */
    if (S.lintas) {
      S.lintas.t += dt;
      if (S.lintas.t >= 1.5) selesaiLintas();
      return gambar();
    }

    /* Peluru sedang terbang. DUNIANYA IKUT BERHENTI, dan itu bukan
       penyederhanaan melainkan justru yang aslinya lakukan: 5350 dan 5750
       adalah subrutin yang dipanggil dari `ON KEY`, jadi gelung utamanya
       tertahan sampai ia selesai — dan baris pertamanya (5360, 5760)
       mematikan tombol-tombol yang lain. Sapuan bunyi 5380-5400 memakan
       kira-kira dua persepuluh detik, dan uji kenanya baru di 5420, SESUDAH
       bunyinya habis. Jadi urutan "tembak, tunggu, baru ketahuan kena atau
       tidak" itu urutan aslinya. */
    if (S.tembak) {
      S.tembak.t += dt;
      if (S.tembak.t >= S.tembak.dur) return selesaiTembak();
      return gambar();
    }

    /* --- 2470-2700: Bintang Kematian ---------------------------------- */
    const OS = S.O - S.S;
    if (OS <= 30000) {
      if (OS < 20000 && S.dsTahap < 1) S.dsTahap = 1;
      if (OS < 10000 && S.dsTahap < 2) S.dsTahap = 2;
      if (OS <  5000 && S.dsTahap < 3) S.dsTahap = 3;
      if (S.FLAG1 !== S.bypass) { S.FLAG1++; }
      else { S.FLAG1 = 0; S.M += irnd(5) - 2; S.N += irnd(5) - 2; }
      S.M -= S.W; S.N -= S.V;
      if (S.M < 2)  S.M = 2 + irnd(3);
      if (S.M > 69) S.M = 69 - irnd(3);
      if (S.N < 2)  S.N = 2 + irnd(3);
      if (S.N > 35) S.N = 35 - irnd(3);      /* 35, bukan 37 — lihat bawah */
    }

    /* --- 2850-2950: pesawat Imperial ---------------------------------- */
    const GS = S.G - S.S;
    if (GS <= 26000) {
      if (GS < 20000 && S.imTahap < 1) {
        S.imTahap = 1; S.IMX = 37; S.IMY = 20; S.IMR1 = 2; S.IMR2 = 2;
      }
      if (GS < 10000 && S.imTahap < 2) {
        S.imTahap = 2; S.IMX = 35; S.IMY = 19; S.IMR1 = 4; S.IMR2 = 3;
      }
      gerak('E', 'F', 37);
    }

    /* --- 3920-4020: Darth Vader ---------------------------------------
       FLAG2 dipakai DUA KALI dalam satu putaran: sekali di 2880 untuk
       pesawat Imperial, sekali lagi di 3950 untuk Vader. Satu pencacah,
       dua gerbang. Akibatnya gerak mengelak keduanya saling mengunci —
       dan itu dipertahankan apa adanya, bukan diperbaiki. */
    const JS = S.J - S.S;
    if (JS <= 26000) {
      if (JS < 20000 && S.dvTahap < 1) {
        S.dvTahap = 1; S.DVX = 37; S.DVY = 20; S.DVR1 = 2; S.DVR2 = 2;
      }
      if (JS < 10000 && S.dvTahap < 2) {
        S.dvTahap = 2; S.DVX = 35; S.DVY = 19; S.DVR1 = 4; S.DVR2 = 3;
      }
      gerak('H', 'I', 37);
    }

    /* --- 5170: maju -------------------------------------------------- */
    S.S += S.Q * 100;

    /* --- tabrakan ------------------------------------------------------ */
    if (S.O - S.S <= 0) return akhir('CRASH', false,
      'Anda menabrak Bintang Kematian. Catnya pun tidak tergores.');
    if (S.G - S.S <= 0) return mulaiLintas('imp');
    if (S.J - S.S <= 0) return mulaiLintas('dv');

    /* --- 5200-5270: jam dinding --------------------------------------- */
    S.waktu -= dt;
    if (S.waktu <= 0) return akhir('TOO LATE!', false,
      'Waktunya habis. Darth Vader menertawakan Anda.');

    if (S.ledak) { S.ledak.sisa -= dt; if (S.ledak.sisa <= 0) S.ledak = null; }
    deru();
    awas();
    gambar();
  }

  /* Bip peringatan saat waktu-tiba menipis. Programnya sudah punya isyaratnya
     sendiri — sprite DS4 muncul di bawah 5.000 (2510) — tapi isyarat itu
     berupa gambar yang membesar sedikit, dan mudah terlewat. */
  function awas() {
    if (!audio || !audio.available || q('senyap').checked) return;
    const t = detikTiba(S.O - S.S);
    if (t >= 3 || S.O - S.S <= 0) return;
    const n = Date.now();
    if (n - S.awasSejak < 620) return;
    S.awasSejak = n;
    audio.playNotes([{ freq: 880, at: 0, dur: 0.07 },
                     { freq: 660, at: 0.09, dur: 0.07 }]);
  }

  /** 2880-2950 / 3950-4020, satu bentuk untuk dua musuh. */
  function gerak(kx, ky, batasBawah) {
    if (S.FLAG2 !== S.bypass) { S.FLAG2++; }
    else { S.FLAG2 = 0; S[kx] += irnd(5) - 2; S[ky] += irnd(5) - 2; }
    S[kx] -= S.W; S[ky] -= S.V;
    if (S[kx] < 2)  S[kx] = 2 + irnd(3);
    if (S[kx] > 69) S[kx] = 69 - irnd(3);
    if (S[ky] < 2)  S[ky] = 2 + irnd(3);
    if (S[ky] > batasBawah) S[ky] = batasBawah - irnd(3);
  }

  /* 3170-3550 dan 4560-4730. Musuhnya berjalan ke (29,19), membesar lima
     bingkai, lalu lewat — dan Anda melempar dadu untuk tetap hidup. */
  function mulaiLintas(siapa) {
    S.lintas = { siapa, t: 0 };
    catat(siapa === 'imp' ? 'IMPERIAL FIGHTER MELINTAS' : 'DARTH VADER MELINTAS',
          'xw-bahaya');
    gambar();
  }

  function selesaiLintas() {
    const siapa = S.lintas.siapa;
    S.lintas = null;
    if (siapa === 'imp') {
      S.G += 25000;                                     /* 3550 */
      S.E = irnd(61) + 10; S.F = irnd(21) + 10;         /* 3560 */
      S.imTahap = 0; S.IMX = 38; S.IMY = 21; S.IMR1 = 1; S.IMR2 = 1;
      /* 3570-3580: K=INT(RND*10); selamat kalau K>SKILL */
      if (irnd(10) > S.SKILL) catat('SELAMAT — ia meleset', 'xw-menang');
      else return akhir('BLAM!', false, 'Pesawat Imperial menembak Anda.');
    } else {
      S.J += 25000;                                     /* 4730 */
      S.H = irnd(61) + 10; S.I = irnd(21) + 10;         /* 4740 */
      S.dvTahap = 0; S.DVX = 38; S.DVY = 21; S.DVR1 = 1; S.DVR2 = 1;
      /* 4750-4760: selamat kalau K>SKILL+1 — Vader lebih berbahaya */
      if (irnd(10) > S.SKILL + 1) catat('SELAMAT — ia meleset', 'xw-menang');
      else return akhir('BOOM!', false, 'Darth Vader menembak Anda.');
    }
    gambar();
  }

  function akhir(teks, menang, ket) {
    S.selesai = { teks, menang, ket };
    /* Tiga dari lima akhir permainan menghancurkan pesawatnya, dan sejak itu
       Anda melihat dunia lewat kaca yang pecah. `TOO LATE!` tidak: di situ
       tidak ada yang menghantam apa pun. */
    S.pecah = teks === 'CRASH' || teks === 'BLAM!' || teks === 'BOOM!';
    S.tembak = null;
    S.selesai.saran = postMortem(teks);
    catat(teks + ' ' + ket, menang ? 'xw-menang' : 'xw-bahaya');
    catat(S.selesai.saran, 'xw-saran');
    if (menang) store.addHighScore('PILOT', skor());
    if (jam) jam.stop();
    gambar();
    papanSkor();
  }

  /* Satu kalimat yang dihitung dari keadaan akhir, bukan kalimat tetap.
     Aslinya tidak ada apa pun seperti ini — yang ada cuma "YOU LOSE!!" dan
     "DARTH VADER IS LAUGHING AT YOU." Ejekan itu tetap dipertahankan di
     tempatnya; yang ini di sebelahnya, dan tugasnya menerangkan. */
  function postMortem(teks) {
    const mach = S.Q * 10;
    const jendela = (10000 / lajuTutup()).toFixed(1);
    const jendela10 = (10000 / (1 * 100 * HZ)).toFixed(1);
    /* Kalau ada torpedo yang terbuang di luar jangkauan, itu yang paling
       pantas disebut lebih dulu — ia penyebab kalah yang paling tidak
       kelihatan, dan sebabnya cuma urutan dua baris. */
    if (S.torpedoJauh > 0 && teks !== 'DEATH STAR DESTROYED')
      return S.torpedoJauh + ' dari 3 torpedo terbuang di luar jangkauan. ' +
             'Baris 5820 mengurangi persediaan SEBELUM 5830 memeriksa jarak, ' +
             'jadi menembak dari jauh tetap menghabiskannya. Tunggu sampai ' +
             'jarak Bintang Kematian di bawah 10.000 dan kurung bidiknya ' +
             'menyala TORPEDO LOCK.';
    if (teks === 'CRASH')
      return 'Pada Mach ' + mach + ' jendela tembak Anda cuma ' + jendela +
             ' detik — jarak 10.000 sampai 0 terlewat secepat itu. Di Mach 10 ' +
             'jendelanya ' + jendela10 + ' detik. Turunkan kecepatan begitu ' +
             'Bintang Kematian di bawah 20.000.';
    if (teks === 'TOO LATE!')
      return 'Waktu habis dengan Bintang Kematian masih ' +
             Math.max(0, Math.round(S.O - S.S)) + ' km. Pada Mach ' + mach +
             ' Anda butuh ' + detikTiba(S.O - S.S).toFixed(0) +
             ' detik lagi — melaju lebih cepat di awal, lalu perlambat di akhir.';
    if (teks === 'BLAM!' || teks === 'BOOM!')
      return (teks === 'BLAM!' ? 'Pesawat Imperial' : 'Darth Vader') +
             ' melintas dan menembak. Meriam sudah menjangkau sejak 26.000 km, ' +
             'jadi tembak lebih awal — dan kalaupun kena, ia cuma mundur 25.000, ' +
             'tidak hilang.';
    return 'Menang dengan ' + S.Z + ' torpedo tersisa dan ' + waktuTeks() +
           ' di jam. Coba skill ' + Math.min(3, S.SKILL + 1) +
           ': waktunya lebih pendek dan torpedonya tidak lagi pasti kena.';
  }

  /* Aslinya TIDAK ADA skor sama sekali — menang atau tidak, itu saja. Angka
     di bawah ini tambahan port, dan disebut begitu di layar: waktu sisa dan
     torpedo yang tidak terpakai, dikalikan tingkat kesulitan. */
  function skor() {
    return Math.round((S.waktu * 10 + S.Z * 500) * (1 + S.SKILL * 0.5));
  }

  /* ======================================================================
     Senjata
     ====================================================================== */

  /* ======================================================================
     KUNCI SASARAN

     Uji yang sama persis dengan baris 5420/5430, tapi tanpa menembak — supaya
     keadaan "kalau ditembak sekarang, kena" bisa DIPERLIHATKAN alih-alih
     ditebak. Aslinya keadaan ini tidak pernah ditampilkan sama sekali; Anda
     baru tahu sesudah menembak dan kehilangan torpedo.
     ====================================================================== */
  function kunciMeriam() {
    if (S.G - S.S < 26000 &&
        Math.abs(S.IMX - S.E) < S.IMR1 && Math.abs(S.IMY - S.F) < S.IMR2) return 'imp';
    if (S.J - S.S < 26000 &&
        Math.abs(S.DVX - S.H) < S.DVR1 && Math.abs(S.DVY - S.I) < S.DVR2) return 'dv';
    return null;
  }
  function kunciTorpedo() {
    return S.O - S.S <= 10000 && diBawahBidikan();
  }

  /* Laju menutup jarak: `S = S + Q*100` tiap putaran, 18,2 putaran per detik
     (baris 5170 dan 2440). Jadi detik-menuju-tiba bisa dihitung, dan itulah
     satu-satunya angka yang benar-benar menentukan permainan ini. */
  function lajuTutup() { return S.Q * 100 * HZ; }
  function detikTiba(jarak) {
    const v = lajuTutup();
    return v > 0 ? Math.max(0, jarak) / v : Infinity;
  }

  /* Pusat gambar sebuah sasaran, dalam satuan SVG — supaya peluru bisa
     benar-benar terbang ke arah yang akan diledakkannya. */
  function pusat(bx, by, peta) {
    return [PX(bx + peta[0].length / 2), PY(by + peta.length / 2)];
  }

  /* 5350-5440. Perhatikan: meriam TIDAK BISA menyentuh Bintang Kematian.
     Hanya dua baris uji, 5420 untuk Imperial dan 5430 untuk Vader.

     Hasilnya ditentukan SEKARANG, tapi baru diterapkan saat pelurunya
     sampai. Boleh begitu karena dunianya berhenti selama peluru terbang
     (lihat `langkah`), jadi menguji sekarang dan menguji nanti memberi
     jawaban yang sama persis — dan menentukannya sekarang memungkinkan
     pelurunya diarahkan ke benda yang memang akan meledak. */
  function meriam() {
    if (S.selesai || S.lintas || S.tembak || !q('pembuka').hidden) return;
    bunyiSapuan(5000, 100, -250);
    let ke = [PX(BIDIK_X), PY(BIDIK_Y)];
    const hasil = kunciMeriam();
    if (hasil === 'imp') ke = pusat(S.E, S.F, ART.IM[S.imTahap]);
    else if (hasil === 'dv') ke = pusat(S.H, S.I, ART.DV[S.dvTahap]);
    S.tembak = { jenis: 'meriam', t: 0, dur: 0.42, ke, hasil };
    gambar();
  }

  /* 5750-5980. Torpedonya HABIS walau di luar jangkauan: 5820 mengurangi Z
     sebelum 5830 memeriksa jaraknya. Itu bukan salah ketik saya. */
  function torpedo() {
    if (S.selesai || S.lintas || S.tembak || !q('pembuka').hidden) return;
    if (S.Z === 0) { catat('TORPEDO HABIS', 'xw-redup'); return gambar(); }
    bunyiSapuan(1500, 100, -20, true);
    let hasil = 'jauh';
    let ke = [PX(BIDIK_X), PY(BIDIK_Y)];
    if (S.O - S.S <= 10000) {
      ke = pusat(S.M, S.N, ART.DS[S.dsTahap]);
      /* 5840: `IF POINT(38,21)<>3 THEN 5880` — uji tabrakan dengan MEMBACA
         WARNA PIKSEL di bawah bidikan. Dinyatakan ulang persis: apakah petak
         (38,21) memang bagian dari gambar Bintang Kematian? */
      if (!diBawahBidikan()) hasil = 'luput';
      /* 5850: di SKILL 0, kena berarti menang, TANPA lemparan dadu. */
      else if (S.SKILL === 0 || irnd(10) > S.SKILL + 1) hasil = 'kena';
      else hasil = 'luput';
    }
    S.tembak = { jenis: 'torpedo', t: 0, dur: 1.0, ke, hasil };
    gambar();
  }

  /** Peluru sampai. Di sinilah baris 5420/5430 dan 5820-5870 diterapkan. */
  function selesaiTembak() {
    const T = S.tembak;
    S.tembak = null;
    if (T.jenis === 'meriam') {
      if (T.hasil === 'imp') {
        S.ledak = { x: T.ke[0], y: T.ke[1], sisa: 0.8, dur: 0.8, besar: 70 };
        S.G += 25000; S.E = irnd(61) + 10; S.F = irnd(21) + 10;
        S.imTahap = 0; S.IMX = 38; S.IMY = 21; S.IMR1 = 1; S.IMR2 = 1;
        catat('IMPERIAL FIGHTER KENA — tapi yang berikutnya sudah datang',
              'xw-menang');
      } else if (T.hasil === 'dv') {
        S.ledak = { x: T.ke[0], y: T.ke[1], sisa: 0.8, dur: 0.8, besar: 70 };
        S.J += 25000; S.H = irnd(61) + 10; S.I = irnd(21) + 10;
        S.dvTahap = 0; S.DVX = 38; S.DVY = 21; S.DVR1 = 1; S.DVR2 = 1;
        catat('DARTH VADER KENA — ia akan kembali', 'xw-menang');
      } else {
        catat('MERIAM MELESET', 'xw-redup');
      }
      return gambar();
    }
    /* 5820: Z dikurangi SESUDAH bunyinya, dan SEBELUM jangkauan diperiksa. */
    S.Z -= 1;
    if (T.hasil === 'jauh') {
      S.torpedoJauh++;
      catat('**** OUT OF RANGE **** — torpedo tetap habis (5820 sebelum 5830)',
            'xw-redup');
      return gambar();
    }
    if (T.hasil === 'luput') { catat('**** TORPEDO MISSED ****', 'xw-redup'); return gambar(); }
    S.ledak = { x: T.ke[0], y: T.ke[1], sisa: 1.4, dur: 1.4, besar: 170 };
    akhir('DEATH STAR DESTROYED', true, 'Pangkalan pemberontak selamat.');
  }

  function diBawahBidikan() {
    const peta = ART.DS[S.dsTahap];
    const x = BIDIK_X - S.M, y = BIDIK_Y - S.N;
    return y >= 0 && y < peta.length && x >= 0 && x < peta[0].length &&
           peta[y][x] === '1';
  }

  /* 5380-5400 dan 5780-5810: sapuan frekuensi turun, dan yang kedua ganda
     (`SOUND 3600-J2` di 5800 — dua nada bergerak berlawanan). */
  function bunyiSapuan(dari, ke, langkahF, ganda) {
    if (!audio || !audio.available || q('senyap').checked) return;
    const n = []; let t = 0;
    for (let f = dari; langkahF < 0 ? f >= ke : f <= ke; f += langkahF) {
      n.push({ freq: Math.max(40, f), at: t, dur: 0.01 }); t += 0.01;
      if (ganda) { n.push({ freq: Math.max(40, 3600 - f), at: t, dur: 0.01 }); t += 0.01; }
    }
    audio.playNotes(n);
  }

  /* 2440: `SOUND 37*Q,1`. Deru mesin yang nadanya kecepatan — dan sekaligus
     pengatur waktu gelungnya. Di sini ia cuma bunyi; waktunya dipegang
     `_shared/loop.js`, karena menyandarkan laju simulasi pada durasi bunyi
     adalah persis kesalahan yang membuat permainan segenerasi ini rusak. */
  let deruTerakhir = 0;
  function deru() {
    if (!audio || !audio.available || q('senyap').checked) return;
    const n = Date.now();
    if (n - deruTerakhir < 700) return;
    deruTerakhir = n;
    audio.playNotes([{ freq: 37 * S.Q, at: 0, dur: 0.06 }]);
  }

  /* ======================================================================
     Gambar — pandangan dari kokpit
     ====================================================================== */
  const L = 1000, T = 620;
  const KACA = 'M116 18 H884 L982 116 V470 L884 568 H116 L18 470 V116 Z';
  const K = { x: 26, y: 26, w: 948, h: 534 };          /* isi kaca */
  const PX = (bx) => K.x + bx * (K.w / LEBAR);
  const PY = (by) => K.y + by * (K.h / TINGGI);
  const SKX = K.w / LEBAR, SKY = K.h / TINGGI;
  /* Asal keempat meriam. Titiknya harus di DALAM segi delapan di atas —
     kalau di luar, sinarnya kena clip dan hilang tanpa galat apa pun. */
  const SUDUT = [[150, 450], [850, 450], [150, 140], [850, 140]];

  /* ----------------------------------------------------------------------
     UKURAN GAMBAR MUSUH — dan kenapa angkanya bukan lebar spritenya.

     Aslinya musuh digambar 1x1, lalu 3x3, lalu 7x5 PIKSEL. Ukuran-ukuran itu
     dipertahankan sebagai LETAK dan sebagai UJI KENA, tapi tidak sebagai
     gambar: satu piksel bukan pesawat, ia titik.

     Yang dipakai sebagai lebar gambar justru KOTAK BIDIKNYA — 2*IMR1 petak,
     yaitu kotak yang benar-benar diuji baris 5420. Akibatnya lebar pesawat di
     layar SAMA PERSIS dengan lebar daerah yang bisa dikenai meriam. Itu
     kebetulan yang menguntungkan: yang Anda lihat adalah yang bisa Anda kena,
     dan tidak ada pemain yang menembak benda yang tampak di dalam kurung lalu
     diberitahu bahwa ia meleset.

     Bintang Kematian tidak punya kotak bidik — ujinya `POINT(38,21)`, yaitu
     petaknya sendiri. Jadi lebarnya diambil dari petak itu, dengan lantai
     untuk dua tahap terjauh yang aslinya cuma satu dan tiga piksel.
     ---------------------------------------------------------------------- */
  const UK_KAPAL = [30, 50, 100];        /* tahap 0,1,2 — 2*IMR1 petak */
  const UK_DS    = [26, 37, 50, 87];     /* tahap 0..3 — lebar petaknya */

  /* ----------------------------------------------------------------------
     PELURU YANG TERLIHAT.

     Aslinya tidak menggambar peluru sama sekali: yang menandai tembakan cuma
     sapuan bunyi 5380-5400, ditambah `PUT (2,2),LASAR` — sebuah larik 382
     bilangan yang dipasang lalu DILEPAS LAGI dua baris kemudian (5370 dan
     5410, XOR), yaitu kilatan di pojok kiri-atas layar. Jadi seluruh umpan
     baliknya adalah SATU KILATAN DI SUDUT dan suara.

     Itu tidak cukup untuk dipahami sekarang: tanpa peluru yang terbang,
     "kena" dan "meleset" cuma dua baris teks yang berbeda. Maka pelurunya
     digambar, dan digambar JUJUR — ia terbang ke benda yang memang akan
     meledak kalau kena, dan lewat menembus titik bidik kalau tidak.
     ---------------------------------------------------------------------- */
  function peluru() {
    const T = S.tembak;
    if (!T) return '';
    const p = Math.min(1, T.t / T.dur);
    const kena = T.hasil && T.hasil !== 'jauh' && T.hasil !== 'luput';
    /* Yang meleset tidak berhenti di titik bidik — ia terus dan mengecil. */
    const maju = kena ? p : p * 1.35;
    let s = '';

    if (T.jenis === 'meriam') {
      /* Empat larik meriam, satu dari tiap ujung sayap — jumlah yang sama
         dengan gambar X-Wing di panel sebelah. */
      SUDUT.forEach(([x0, y0]) => {
        const ekor = Math.max(0, maju - 0.22);
        const ax = x0 + (T.ke[0] - x0) * ekor, ay = y0 + (T.ke[1] - y0) * ekor;
        const bx = x0 + (T.ke[0] - x0) * maju, by = y0 + (T.ke[1] - y0) * maju;
        const w = 8 - 5.4 * Math.min(1, maju);
        s += '<line x1="' + ax.toFixed(1) + '" y1="' + ay.toFixed(1) + '" x2="' +
             bx.toFixed(1) + '" y2="' + by.toFixed(1) + '" stroke="#ff4a2e" ' +
             'stroke-width="' + w.toFixed(1) + '" stroke-linecap="round" opacity=".9"/>';
        s += '<line x1="' + ax.toFixed(1) + '" y1="' + ay.toFixed(1) + '" x2="' +
             bx.toFixed(1) + '" y2="' + by.toFixed(1) + '" stroke="#fff1e0" ' +
             'stroke-width="' + (w * 0.38).toFixed(1) + '" stroke-linecap="round"/>';
      });
      return s;
    }

    /* Torpedo proton: satu butir, berangkat dari bawah kanopi, mengecil
       karena menjauh, dengan jejak yang memudar di belakangnya. */
    const x0 = PX(BIDIK_X), y0 = PY(TINGGI) - 8;
    const x = x0 + (T.ke[0] - x0) * maju, y = y0 + (T.ke[1] - y0) * maju;
    const ekor = Math.max(0, maju - 0.3);
    const tx = x0 + (T.ke[0] - x0) * ekor, ty = y0 + (T.ke[1] - y0) * ekor;
    const r = 16 - 11 * Math.min(1, maju);
    s += '<line x1="' + tx.toFixed(1) + '" y1="' + ty.toFixed(1) + '" x2="' +
         x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="#ffb066" ' +
         'stroke-width="' + (r * 0.7).toFixed(1) + '" stroke-linecap="round" opacity=".35"/>';
    s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' +
         (r * 1.9).toFixed(1) + '" fill="#ff9a3c" opacity=".28"/>';
    s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' +
         r.toFixed(1) + '" fill="#ffc27a"/>';
    s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' +
         (r * 0.48).toFixed(1) + '" fill="#fff6e6"/>';
    return s;
  }

  /* Ledakan, digambar dari `S.ledak.sisa`.

     Versi pertama halaman ini memakai animasi CSS di sini, dan itu KESALAHAN
     yang sama dengan peluru: elemennya lahir baru tiap 55 ms, jadi
     animasinya tak pernah lewat dari beberapa persen pertama dan yang
     terlihat cuma titik terang yang tidak pernah mekar. Waktu simulasi harus
     dipegang simulasinya. */
  function ledakan() {
    if (!S.ledak) return '';
    const p = S.selesai ? 0.5
            : Math.min(1, 1 - Math.max(0, S.ledak.sisa) / S.ledak.dur);
    const b = S.ledak.besar, x = S.ledak.x, y = S.ledak.y, sisa = 1 - p;
    /* Bola api dulu, baru intinya di atasnya — kalau terbalik, yang putih
       menutupi yang jingga dan hasilnya cuma cakram pucat. */
    let s = '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' +
            (b * (0.25 + 1.35 * p)).toFixed(0) + '" fill="#ff7a2c" opacity="' +
            (0.5 * sisa).toFixed(2) + '"/>';
    s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' +
         (b * (0.2 + 0.75 * p)).toFixed(0) + '" fill="#ffb347" opacity="' +
         (0.8 * sisa).toFixed(2) + '"/>';
    s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' +
         (b * (0.14 + 0.34 * p)).toFixed(0) + '" fill="#fff6dc" opacity="' +
         (0.95 * sisa * sisa).toFixed(2) + '"/>';
    s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' +
         (b * (0.2 + 2.4 * p)).toFixed(0) + '" fill="none" stroke="#ffb066" ' +
         'stroke-width="' + (10 * sisa).toFixed(1) + '" opacity="' +
         (0.9 * sisa).toFixed(2) + '"/>';
    /* pecahan, arahnya tetap supaya tidak berkedip */
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + 0.37;
      const d = b * (0.4 + 2.2 * p);
      s += '<circle cx="' + (x + Math.cos(a) * d).toFixed(0) + '" cy="' +
           (y + Math.sin(a) * d).toFixed(0) + '" r="' + (4 * sisa + 1).toFixed(1) +
           '" fill="#ffd76a" opacity="' + (0.85 * sisa).toFixed(2) + '"/>';
    }
    return s;
  }

  /* ----------------------------------------------------------------------
     KACA PECAH.

     Aslinya cuma `CLS:PRINT "CRASH"` (6570) — layar dibersihkan dan satu kata
     dicetak. Di sini akibatnya digambar: retaknya dibangkitkan dari BENIH
     permainan, bukan dari `Math.random`, supaya ia tidak berubah tiap
     penggambaran ulang dan supaya benih yang sama memberi retak yang sama.
     ---------------------------------------------------------------------- */
  let retakCache = null;
  function retak() {
    if (retakCache) return retakCache;
    let n = (S.benih ^ 0x5bf03635) | 0;
    const r = () => { n = (Math.imul(n ^ (n >>> 15), 0x2c1b3c6d) + 0x9e3779b9) | 0;
                      return ((n >>> 8) & 0xffffff) / 0x1000000; };
    const ix = 500 + (r() - 0.5) * 260, iy = 293 + (r() - 0.5) * 170;
    let g = '';
    for (let i = 0; i < 16; i++) {
      let a = (i / 16) * Math.PI * 2 + (r() - 0.5) * 0.5;
      let x = ix, y = iy, d = 'M' + ix.toFixed(0) + ' ' + iy.toFixed(0);
      const seg = 4 + Math.floor(r() * 4);
      for (let k = 0; k < seg; k++) {
        a += (r() - 0.5) * 0.8;
        const len = 45 + r() * 130;
        x += Math.cos(a) * len; y += Math.sin(a) * len;
        d += ' L' + x.toFixed(0) + ' ' + y.toFixed(0);
      }
      g += '<path d="' + d + '"/>';
    }
    for (let i = 0; i < 3; i++) {
      const rr = 55 + i * 62;
      let d = '';
      for (let k = 0; k <= 14; k++) {
        const a = (k / 14) * Math.PI * 2;
        const rad = rr * (0.78 + r() * 0.44);
        d += (k ? ' L' : 'M') + (ix + Math.cos(a) * rad).toFixed(0) + ' ' +
             (iy + Math.sin(a) * rad).toFixed(0);
      }
      g += '<path d="' + d + ' Z"/>';
    }
    retakCache =
      '<circle cx="' + ix.toFixed(0) + '" cy="' + iy.toFixed(0) +
      '" r="54" fill="#cfe0ea" opacity=".18"/>' +
      '<g fill="none" stroke="#05070d" stroke-width="6" opacity=".9" ' +
      'stroke-linejoin="round">' + g + '</g>' +
      '<g fill="none" stroke="#dbe9f5" stroke-width="2" opacity=".85" ' +
      'stroke-linejoin="round">' + g + '</g>';
    return retakCache;
  }

  /* Penanda MENTOK. Baris 2560-2590 menjepit sasarannya ke petak 2..69 dan
     2..35/37, lalu memantulkannya sedikit secara acak. Akibatnya, kemudi yang
     ditahan membuat semua sasaran menumpuk di satu tepi dan tinggal di sana —
     dan dari kursi pemain itu terlihat seperti "kemudinya tidak berbuat
     apa-apa lagi". Aturannya tidak diubah; keadaannya yang dinyatakan. */
  function mentok(bx, by, warna) {
    let s = '';
    const kiri = bx <= 5, kanan = bx >= 66, atas = by <= 5, bawah = by >= 32;
    if (!(kiri || kanan || atas || bawah)) return '';
    const y = Math.min(Math.max(PY(by + 1), 72), T - 100);
    const x = Math.min(Math.max(PX(bx + 1), 72), L - 72);
    const seg = (d) => '<path d="' + d + '" fill="' + warna + '" opacity=".9"/>';
    /* Segitiga sungguhan, menunjuk KE LUAR. Versi pertama menutup jalurnya
       dengan dua belokan siku dan yang keluar justru persegi panjang — sebuah
       penanda arah yang tidak menunjuk ke mana pun. */
    if (kiri)  s += seg('M62 ' + (y - 11) + ' l-20 11 l20 11 Z');
    if (kanan) s += seg('M' + (L - 62) + ' ' + (y - 11) + ' l20 11 l-20 11 Z');
    if (atas)  s += seg('M' + (x - 11) + ' 62 l11 -20 l11 20 Z');
    if (bawah) s += seg('M' + (x - 11) + ' ' + (T - 62) + ' l11 20 l11 -20 Z');
    return s;
  }

  /** Gambar sebuah kapal di tengah jejak petak yang ditempati sprite asli. */
  function kapalDiPetak(a, bx, by, wPetak, hPetak, uk) {
    const cx = PX(bx + wPetak / 2), cy = PY(by + hPetak / 2);
    const sk = uk / a.w, th = a.h * sk;
    /* Cincin kontak untuk sasaran yang masih jauh. Lambung kapalnya kelabu
       gelap — bagus di jarak dekat, tapi pada 30 satuan ia lenyap ke dalam
       medan bintang. Aslinya tidak punya masalah ini karena satu pikselnya
       digambar dengan warna CGA penuh. Cincinnya hilang sendiri begitu
       kapalnya cukup besar untuk dikenali. */
    let s = '';
    if (uk < 60)
      s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' +
           (uk * 0.92).toFixed(1) + '" fill="none" stroke="' + a.warna +
           '" stroke-width="1.6" opacity="' + (uk < 40 ? '.6' : '.42') + '"/>';
    return s + '<g transform="translate(' + (cx - uk / 2).toFixed(1) + ' ' +
           (cy - th / 2).toFixed(1) + ') scale(' + sk.toFixed(4) +
           ')" style="color:' + a.warna + '">' + a.isi + '</g>';
  }

  function gambar() {
    let s = '<svg class="xw-svg" viewBox="0 0 ' + L + ' ' + T + '" role="img" ' +
            'aria-label="Pandangan dari kokpit X-Wing">';
    s += '<defs>' +
         '<clipPath id="xw-kaca"><path d="' + KACA + '"/></clipPath>' +
         '<radialGradient id="xw-vignette" cx="50%" cy="50%" r="62%">' +
           '<stop offset=".55" stop-color="#000" stop-opacity="0"/>' +
           '<stop offset="1" stop-color="#000" stop-opacity=".72"/></radialGradient>' +
         '<linearGradient id="xw-rangka" x1="0" y1="0" x2="0" y2="1">' +
           '<stop offset="0" stop-color="#39424e"/><stop offset=".5" stop-color="#232a33"/>' +
           '<stop offset="1" stop-color="#161b22"/></linearGradient>' +
         '<linearGradient id="xw-papan" x1="0" y1="0" x2="0" y2="1">' +
           '<stop offset="0" stop-color="#2b333d"/><stop offset="1" stop-color="#0e1319"/>' +
         '</linearGradient>' +
         '</defs>';
    s += '<rect width="' + L + '" height="' + T + '" fill="#05070d"/>';

    /* ---- yang terlihat menembus kaca ---------------------------------- */
    s += '<g clip-path="url(#xw-kaca)">';
    s += '<rect width="' + L + '" height="' + T + '" fill="#03060e"/>';
    s += bintang();

    /* Garis acuan kemudi. Inilah satu-satunya cara batas TAK SIMETRIS baris
       1100-1170 (-3..3 tegak, -5..5 mendatar) bisa DILIHAT, bukan dibaca. */
    const gx = PX(BIDIK_X) - S.W * 22, gy = PY(BIDIK_Y) + S.V * 22;
    s += '<g stroke="#2f7d55" stroke-width="1.5" opacity=".5" fill="none">' +
         '<path d="M40 ' + gy.toFixed(0) + ' H960" stroke-dasharray="3 15"/>' +
         '<path d="M' + gx.toFixed(0) + ' 30 V' + (T - 70) + '" stroke-dasharray="3 15"/>' +
         '</g>';

    /* Tangga kemudi, berubah SEKETIKA, dan sekaligus memperlihatkan batas tak
       simetrisnya: -5..5 mendatar, -3..3 tegak.

       KENAPA ADA PANAH ARAH DI SINI. Pemain melaporkan bahwa panah kiri dan
       kanan "arahnya sama saja". Diukur, arahnya BENAR berlawanan — 38 ke 50
       melawan 38 ke 26 dengan benih yang sama. Yang tidak terbaca adalah
       akibatnya: pada W=1 sasarannya sudah MENTOK ke tepi dalam 1,8 detik dan
       menghabiskan 65% waktunya terkurung di sana; pada W=3 cuma 0,6 detik
       dan 89%. Jadi yang terlihat di kedua arah sama: semuanya melesat ke
       salah satu tepi lalu nyangkut. Panah kecil ini menyatakan ke mana
       medannya sedang bergeser, karena `M = M - W` membuatnya bergerak
       BERLAWANAN dengan tombol yang ditekan. */
    const tx = PX(BIDIK_X), ty = PY(TINGGI) - 26;
    if (S.W !== 0) {
      const arah = S.W > 0 ? -1 : 1;            /* medan bergeser -W */
      const ax = tx + arah * (BATAS_W * 26 + 34);
      s += '<path d="M' + ax + ' ' + (ty - 9) + ' l' + (arah * 15) + ' 9 l' +
           (-arah * 15) + ' 9 Z" fill="#4ef08a" opacity=".9"/>';
      s += '<text x="' + (tx + arah * (BATAS_W * 26 + 34)) + '" y="' + (ty + 30) +
           '" text-anchor="middle" font-size="12" ' +
           'font-family="ui-monospace,monospace" fill="#4ef08a" opacity=".8">' +
           'MEDAN</text>';
    }
    for (let i = -BATAS_W; i <= BATAS_W; i++) {
      const aktif = i === S.W;
      s += '<rect x="' + (tx + i * 26 - 5).toFixed(0) + '" y="' +
           (ty - (aktif ? 11 : 5)) + '" width="10" height="' +
           (aktif ? 22 : 10) + '" rx="2" fill="' +
           (aktif ? '#4ef08a' : '#2f7d55') + '" opacity="' +
           (aktif ? '1' : '.55') + '"/>';
    }
    const vx = PX(LEBAR) - 30, vy = PY(BIDIK_Y);
    for (let i = -BATAS_V; i <= BATAS_V; i++) {
      const aktif = i === S.V;
      s += '<rect x="' + (vx - (aktif ? 11 : 5)) + '" y="' +
           (vy + i * 26 - 5).toFixed(0) + '" width="' + (aktif ? 22 : 10) +
           '" height="10" rx="2" fill="' + (aktif ? '#4ef08a' : '#2f7d55') +
           '" opacity="' + (aktif ? '1' : '.55') + '"/>';
    }

    if (S.lintas) {
      /* 3320-3470: lima bingkai membesar, dipisah `PLAY "P4"`. Di sini
         pembesarannya menerus alih-alih lima langkah, karena tiga dari lima
         lariknya tidak bisa dibaca dengan yakin (docs/xwing.md §4) dan
         menaikkan bacaan yang meragukan sampai memenuhi layar akan membuatnya
         tampak seperti barang temuan justru saat ia paling terlihat. */
      const p = Math.min(1, S.lintas.t / 1.5);
      const a = ART.ARMADA[S.lintas.siapa];
      const uk = 60 + p * p * 1180;
      const sk = uk / a.w;
      s += '<g transform="translate(' + (PX(29) - uk / 2).toFixed(0) + ' ' +
           (PY(19) - a.h * sk / 2).toFixed(0) + ') scale(' + sk.toFixed(4) +
           ')" style="color:' + a.warna + '">' + a.isi + '</g>';
    } else {
      /* Bintang Kematian: hanya digambar kalau O-S <= 30000 (2480). Saat
         menabrak ia digambar memenuhi pandangan — karena itulah yang terjadi:
         `O-S<=0` berarti Anda sudah sampai di permukaannya. */
      if (S.O - S.S <= 30000) {
        const p = ART.DS[S.dsTahap];
        const tabrak = S.selesai && S.selesai.teks === 'CRASH';
        s += kapalDiPetak(ART.ARMADA.ds, S.M, S.N, p[0].length, p.length,
                          tabrak ? 1300 : UK_DS[S.dsTahap]);
        s += mentok(S.M, S.N, '#ffd76a');
      }
      /* Musuh: hanya kalau jaraknya <= 26000 (2850, 3920). */
      if (S.G - S.S <= 26000) {
        const p = ART.IM[S.imTahap];
        s += kapalDiPetak(ART.ARMADA.imp, S.E, S.F, p[0].length, p.length,
                          UK_KAPAL[S.imTahap]);
        s += mentok(S.E, S.F, '#8ef0ff');
      }
      if (S.J - S.S <= 26000) {
        const p = ART.DV[S.dvTahap];
        s += kapalDiPetak(ART.ARMADA.dv, S.H, S.I, p[0].length, p.length,
                          UK_KAPAL[S.dvTahap]);
        s += mentok(S.H, S.I, '#ff6a5a');
      }
    }

    s += peluru();
    s += ledakan();

    /* Bidikan, digambar SEBESAR kotak yang benar-benar diuji baris 5420.
       Kotak ini MEMBESAR sendiri saat musuh mendekat (2860, 2870): 1x1,
       lalu 2x2, lalu 4x3 — dan yang terakhir lebih lebar daripada tinggi. */
    const r1 = Math.max(S.IMR1, S.DVR1), r2 = Math.max(S.IMR2, S.DVR2);
    const bx = PX(BIDIK_X), by = PY(BIDIK_Y);
    const kw = r1 * SKX, kh = r2 * SKY, u = 16;
    /* KUNCI. Keadaan "kalau ditembak sekarang, kena" adalah satu-satunya hal
       yang menentukan permainan ini, dan aslinya tidak pernah ditampilkan —
       Anda baru tahu sesudah menembak. Di sini ia berdenyut. */
    const kT = kunciTorpedo(), kM = kunciMeriam();
    const denyut = 0.55 + 0.45 * Math.sin(S.detak * 0.55);
    const warnaK = kT ? '#ffb347' : (kM ? '#4ef08a' : '#4ef08a');
    const tebal = (kT || kM) ? 4 : 2.5;
    const opak  = (kT || kM) ? denyut.toFixed(2) : '.9';
    s += '<g stroke="' + warnaK + '" stroke-width="' + tebal + '" fill="none" ' +
         'opacity="' + opak + '">' +
         '<path d="M' + (bx - kw) + ' ' + (by - kh + u) + ' v' + -u + ' h' + u + '"/>' +
         '<path d="M' + (bx + kw) + ' ' + (by - kh + u) + ' v' + -u + ' h' + -u + '"/>' +
         '<path d="M' + (bx - kw) + ' ' + (by + kh - u) + ' v' + u + ' h' + u + '"/>' +
         '<path d="M' + (bx + kw) + ' ' + (by + kh - u) + ' v' + u + ' h' + -u + '"/>' +
         '<circle cx="' + bx + '" cy="' + by + '" r="3.5"/>' +
         '<path d="M' + (bx - 24) + ' ' + by + ' h12"/>' +
         '<path d="M' + (bx + 24) + ' ' + by + ' h-12"/>' +
         '</g>';
    if (kT || kM) {
      s += '<text x="' + bx + '" y="' + (by - kh - 20) + '" text-anchor="middle" ' +
           'font-size="24" font-weight="700" letter-spacing="3" ' +
           'font-family="ui-monospace,monospace" paint-order="stroke" ' +
           'stroke="#03060e" stroke-width="7" fill="' + warnaK + '" opacity="' +
           opak + '">' + (kT ? 'TORPEDO LOCK' : 'GUNS LOCK') + '</text>';
    }

    s += '<rect width="' + L + '" height="' + T + '" fill="url(#xw-vignette)"/>';

    /* Retak digambar di atas segalanya yang ada di balik kaca — karena ia
       ADA DI KACANYA, bukan di luar sana. */
    if (S.pecah) s += retak();

    if (S.selesai) {
      const c = S.selesai.menang ? '#4ef08a' : '#ff6a5a';
      s += '<text x="500" y="' + (S.pecah ? 500 : 305) + '" text-anchor="middle" ' +
           'font-size="' + (S.selesai.teks.length > 12 ? 52 : 78) + '" ' +
           'font-weight="700" letter-spacing="4" ' +
           'font-family="ui-monospace,monospace" paint-order="stroke" ' +
           'stroke="#03060e" stroke-width="12" fill="' + c + '">' +
           S.selesai.teks + '</text>';
    }
    s += '</g>';   /* --- selesai bagian yang menembus kaca --------------- */

    /* ---- rangka kanopi dan papan instrumen ---------------------------- */
    s += '<path d="M0 0 H' + L + ' V' + T + ' H0 Z ' + KACA +
         '" fill="url(#xw-rangka)" fill-rule="evenodd"/>';
    s += '<path d="' + KACA + '" fill="none" stroke="#4d5866" stroke-width="3"/>';
    /* Tiang tengah kanopi SENGAJA TIDAK ADA: bersama garis acuan tegak, ia
       terbaca sebagai kaca depan yang terbelah dua, bukan kanopi. */
    let keling = '';
    for (let x = 150; x <= 850; x += 50) {
      keling += '<circle cx="' + x + '" cy="9" r="2.6"/>';
      keling += '<circle cx="' + x + '" cy="' + (T - 44) + '" r="2.6"/>';
    }
    s += '<g fill="#59636f" opacity=".8">' + keling + '</g>';

    s += '<path d="M0 ' + (T - 36) + ' H' + L + ' V' + T + ' H0 Z" fill="url(#xw-papan)"/>';
    const lampu = [
      ['TORP', S.Z > 0 ? '#4ef08a' : '#c0503f'],
      ['GUNS', S.tembak ? '#ffd76a' : '#2f7d55'],
      ['LOCK', S.O - S.S <= 10000 && diBawahBidikan() ? '#4ef08a' : '#2a3138'],
      ['HULL', S.selesai && !S.selesai.menang ? '#c0503f' : '#2f7d55'],
      ['R2', '#7fd7ff']
    ];
    lampu.forEach((p, i) => {
      const x = 40 + i * 92;
      s += '<circle cx="' + x + '" cy="' + (T - 18) + '" r="6" fill="' + p[1] + '"/>' +
           '<text x="' + (x + 13) + '" y="' + (T - 13) + '" font-size="12" ' +
           'font-family="ui-monospace,monospace" fill="#8b98a6">' + p[0] + '</text>';
    });
    s += '<text x="' + (L - 24) + '" y="' + (T - 13) + '" text-anchor="end" ' +
         'font-size="12" font-family="ui-monospace,monospace" fill="#8b98a6">' +
         'MACH ' + S.Q * 10 + '  ·  ' + waktuTeks() + '  ·  SKILL ' + S.SKILL + '</text>';

    s += '</svg>';
    q('kokpit').innerHTML = s;
    papanAtas();
  }

  /* ======================================================================
     JALUR PENDEKATAN

     Ini tambahan port, dan tambahan terbesar di halaman ini. Aslinya ketiga
     jaraknya cuma tiga angka yang dicetak ulang tiap putaran (2380, 2400,
     2420) — dan itulah sebabnya permainan ini terasa mustahil: keterampilan
     sebenarnya adalah MENGATUR KECEPATAN, sementara hubungan antara jarak,
     kecepatan, dan waktu tidak pernah diperlihatkan di mana pun.

     Tidak ada aturan baru di sini. Semuanya turunan dari angka yang memang
     sudah dihitung programnya: jaraknya `O-S`/`G-S`/`J-S`, ambang 26.000
     (5420) dan 10.000 (5830), dan laju menutup `Q*100` per putaran (5170).
     ====================================================================== */
  const JL = 1000, JT = 96, JKIRI = 74, JKANAN = 968, JMAKS = 110000;
  /* Skala pangkat: yang menentukan ada di bawah 30.000, jadi bagian itu
     diberi ruang lebih. Linear akan menumpuk semuanya di ujung kanan. */
  const JX = (d) => JKIRI + (JKANAN - JKIRI) *
        Math.pow(Math.min(1, Math.max(0, d) / JMAKS), 0.55);

  function jalur() {
    const y = 52;
    let s = '<svg class="xw-jalurSvg" viewBox="0 0 ' + JL + ' ' + JT + '" ' +
            'role="img" aria-label="Jalur pendekatan ketiga sasaran">';
    /* pita jangkauan */
    s += '<rect x="' + JX(26000).toFixed(0) + '" y="' + (y - 15) + '" width="' +
         (JX(110000) - JX(26000)).toFixed(0) + '" height="30" fill="#1b2229"/>';
    s += '<rect x="' + JX(10000).toFixed(0) + '" y="' + (y - 15) + '" width="' +
         (JX(26000) - JX(10000)).toFixed(0) + '" height="30" fill="#1d3527"/>';
    s += '<rect x="' + JX(0).toFixed(0) + '" y="' + (y - 15) + '" width="' +
         (JX(10000) - JX(0)).toFixed(0) + '" height="30" fill="#3a2a12"/>';
    s += '<rect x="' + JX(0).toFixed(0) + '" y="' + (y - 15) + '" width="' +
         (JX(2500) - JX(0)).toFixed(0) + '" height="30" fill="#41171a"/>';
    /* garis ambang + label */
    [[26000, 'MERIAM', '#4ef08a'], [10000, 'TORPEDO', '#ffb347']].forEach(([d, t, c]) => {
      s += '<path d="M' + JX(d).toFixed(0) + ' ' + (y - 18) + ' v36" stroke="' + c +
           '" stroke-width="1.6" opacity=".8"/>';
      s += '<text x="' + (JX(d) + 5).toFixed(0) + '" y="' + (y - 22) +
           '" font-size="13" font-family="ui-monospace,monospace" fill="' + c +
           '" opacity=".9">' + t + ' ' + (d / 1000) + 'K</text>';
    });
    /* pesawat Anda di ujung kiri */
    s += '<path d="M' + (JKIRI - 30) + ' ' + y + ' l-16 -11 v22 Z" fill="#8ef0ff"/>';
    s += '<text x="' + (JKIRI - 52) + '" y="' + (y + 30) + '" text-anchor="middle" ' +
         'font-size="12" font-family="ui-monospace,monospace" fill="#8b98a6">ANDA</text>';
    s += '<path d="M' + JKIRI + ' ' + y + ' H' + JKANAN + '" stroke="#39424e" ' +
         'stroke-width="1.4"/>';

    /* ketiga sasaran */
    const isi = [
      { d: S.O - S.S, c: '#ffd76a', n: 'DS', tinggi: -1 },
      { d: S.J - S.S, c: '#ff6a5a', n: 'DV', tinggi: 1 },
      { d: S.G - S.S, c: '#8ef0ff', n: 'IMP', tinggi: 1 }
    ];
    isi.forEach(o => {
      const x = JX(o.d), yy = y + o.tinggi * 0;
      s += '<path d="M' + x.toFixed(0) + ' ' + (yy - 11) + ' l9 11 l-9 11 l-9 -11 Z" ' +
           'fill="' + o.c + '"/>';
      s += '<text x="' + x.toFixed(0) + '" y="' + (yy + (o.tinggi < 0 ? -18 : 34)) +
           '" text-anchor="middle" font-size="13" font-weight="600" ' +
           'font-family="ui-monospace,monospace" fill="' + o.c + '">' + o.n + ' ' +
           Math.max(0, Math.round(o.d)) + '</text>';
    });
    s += '</svg>';
    return s;
  }

  /* 2430: `PRINT A1;":";A2NEW` — menit dan detik, dari jam sungguhan. */
  function waktuTeks() {
    const w = Math.max(0, S.waktu);
    return Math.floor(w / 60) + ':' + String(Math.floor(w % 60)).padStart(2, '0');
  }

  function papanAtas() {
    const set = (id, v) => { q(id).textContent = v; };
    set('s-torpedo', S.Z);
    set('s-hor', S.W);
    set('s-vert', -S.V);                                 /* 2350: PRINT W;-V */
    set('s-mach', S.Q * 10);
    set('s-waktu', waktuTeks());
    set('s-skill', S.SKILL);
    set('s-benih', String(S.benih >>> 0));
    /* 2370-2420: jaraknya dijepit di nol, tidak pernah negatif. */
    const jarak = { imp: S.G - S.S, dv: S.J - S.S, ds: S.O - S.S };
    Object.keys(jarak).forEach(k => {
      const v = Math.max(0, Math.round(jarak[k]));
      const e = q('s-' + k);
      e.textContent = v;
      e.className = 'xw-nilai mono' + (v < 10000 ? ' xw-dekat' : '');
    });
    q('pesan').innerHTML = S.pesan.map(p =>
      '<div class="' + (p.k || '') + '">' + p.t + '</div>').join('');
    q('s-status').textContent = S.selesai ? S.selesai.teks
                             : (S.lintas ? 'MELINTAS!' : 'DALAM PENERBANGAN');
    q('s-status').className = 'xw-nilai mono' +
      (S.selesai ? (S.selesai.menang ? ' xw-menangTeks' : ' xw-bahayaTeks') : '');

    /* --- jalur pendekatan + hitungan mundur tiba ----------------------- */
    q('jalur').innerHTML = jalur();
    const tiba = detikTiba(S.O - S.S);
    const el = q('s-tiba');
    if (S.selesai) {
      el.textContent = '—';
      el.className = 'xw-tibaNilai mono';
    } else {
      el.textContent = (tiba > 99 ? '99+' : tiba.toFixed(1)) + ' dtk';
      el.className = 'xw-tibaNilai mono' +
        (tiba < 3 ? ' xw-bahayaTeks' : (tiba < 8 ? ' xw-awasTeks' : ''));
    }
    q('s-jendela').textContent = (10000 / lajuTutup()).toFixed(1) + ' dtk';
  }

  /* Medan bintang dibangkitkan dari benih, bukan Math.random — kalau acak
     murni ia berkedip tiap penggambaran ulang. */
  let bintangCache = null, bintangBenih = null;
  function bintang() {
    if (bintangCache && bintangBenih === S.benih) return bintangCache;
    let s = S.benih | 0;
    const r = () => { s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x9e3779b9) | 0;
                      return ((s >>> 8) & 0xffffff) / 0x1000000; };
    let t = '';
    for (let i = 0; i < 220; i++) {
      t += '<circle cx="' + (r() * L).toFixed(1) + '" cy="' + (r() * T).toFixed(1) +
           '" r="' + (0.5 + r() * 1.6).toFixed(2) + '" opacity="' +
           (0.2 + r() * 0.7).toFixed(2) + '"/>';
    }
    bintangCache = '<g fill="#dbe6ff">' + t + '</g>';
    bintangBenih = S.benih;
    return bintangCache;
  }

  function papanSkor() {
    const l = store.highScores();
    q('skor').innerHTML = l.length
      ? l.slice(0, 5).map(x => '<li>' + x.score + '</li>').join('')
      : '<li class="xw-kecil">belum ada</li>';
  }

  /* ======================================================================
     KENDALI

     Aslinya enam penangan `ON KEY`: F1 meriam, F2 torpedo, KEY 11-14 keempat
     panah (1320), ditambah angka 1-9 lewat `INKEY$` biasa untuk kecepatan
     (5160). Semuanya dipertahankan. Yang ditambahkan cuma tiga hal, dan
     ketiganya alasannya sama — F1 dan F2 bukan tombol yang aman di peramban:

       Spasi    = meriam    (F1 sering direbut peramban sebagai tombol bantuan)
       Enter/T  = torpedo
       0        = pusatkan kemudi

     `0` sengaja dipilih karena aslinya TIDAK memakainya: baris 5160 berbunyi
     `IF VAL(Z$)>0 AND VAL(Z$)<10`, jadi nol tidak pernah jadi kecepatan.

     Tombol pusatkan itu BUKAN aturan baru. `W` dan `V` adalah kecepatan geser,
     bukan posisi (2550: `M = M - W`), jadi untuk berhenti melayang Anda harus
     menekan panah lawan sebanyak tekanan tadi. Menolkan keduanya sekaligus
     memberi hasil yang sama persis — ia cuma menghapus pekerjaan tangan yang
     tidak mengajarkan apa pun.
     ====================================================================== */
  const KENDALI = {
    naik:  () => { S.V = Math.max(-BATAS_V, S.V - 1); },   /* 1100 */
    kiri:  () => { S.W = Math.max(-BATAS_W, S.W - 1); },   /* 1120 */
    kanan: () => { S.W = Math.min(BATAS_W, S.W + 1); },    /* 1140 */
    turun: () => { S.V = Math.min(BATAS_V, S.V + 1); },    /* 1160 */
    pusat: () => { S.V = 0; S.W = 0; },
    meriam, torpedo
  };
  /* Z dan X jadi tombol UTAMA senjata, bukan Spasi dan Enter.

     Spasi dan Enter punya tugas bawaan di peramban: keduanya MENEKAN kontrol
     yang sedang fokus. Sekuat apa pun penjaganya, memilih tombol yang memang
     sudah punya arti lain adalah cari perkara — dan pemain yang melaporkannya
     benar. Z dan X tidak punya arti apa pun di peramban, letaknya berdekatan
     di tangan kiri, dan itu pasangan tombol tembak paling lazim di arkade.

     Spasi, Enter, F1, dan F2 tetap dipertahankan sebagai alias. */
  const TOMBOL = {
    /* menurut `e.key` */
    ArrowUp: 'naik', ArrowDown: 'turun', ArrowLeft: 'kiri', ArrowRight: 'kanan',
    z: 'meriam', Z: 'meriam', F1: 'meriam', ' ': 'meriam', Spacebar: 'meriam',
    x: 'torpedo', X: 'torpedo', F2: 'torpedo', Enter: 'torpedo',
    t: 'torpedo', T: 'torpedo',
    '0': 'pusat', c: 'pusat', C: 'pusat',
    /* menurut `e.code` — jaring pengaman kalau `key` tidak terbaca */
    KeyZ: 'meriam', Space: 'meriam',
    KeyX: 'torpedo', NumpadEnter: 'torpedo', KeyT: 'torpedo',
    Digit0: 'pusat', Numpad0: 'pusat', KeyC: 'pusat'
  };

  /* Papan ketik hanya disandera SELAMA KOKPITNYA TERLIHAT. Versi sebelumnya
     memasang penangkap di `document` tanpa syarat, jadi panah tidak pernah
     bisa dipakai menggulir halaman — padahal panelnya panjang.

     Percobaan pertama memakai `IntersectionObserver`, dan itu SALAH pilih:
     pengamat itu menyampaikan hasilnya lewat pembaruan render, yang berhenti
     saat tabnya tidak terlihat. Kalau ia tidak pernah menyala sekali pun,
     benderanya macet di nilai awal dan panah tersandera selamanya. Ukuran
     geometri saat tombol ditekan tidak punya ketergantungan itu, dan cuma
     satu pembacaan per penekanan. */
  /* Yang diukur adalah SELURUH panel permainan, bukan kokpitnya saja.

     Versi sebelumnya mengukur `#kokpit` — dan itu cacat yang dilaporkan
     pemain: tombol-tombolnya ada JAUH DI BAWAH kokpit, jadi di layar yang
     tidak terlalu tinggi Anda harus menggulir untuk mencapainya, kokpitnya
     keluar layar, dan sejak itu SELURUH papan ketik lepas dari permainan.
     Panahnya jadi seolah tidak berfungsi. Yang benar: selama ada bagian panel
     permainan yang terlihat, tombolnya milik permainan. */
  const panel = document.querySelector('.screen');
  function panelTerlihat() {
    const r = panel.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }

  /* Apakah fokus sekarang datang dari papan ketik (Tab), bukan dari klik?
     Ini memisahkan dua kebutuhan yang bertabrakan: pemakai tetikus yang baru
     saja mengklik sebuah tombol tetap harus bisa menembak dengan Spasi,
     sementara pemakai papan ketik yang sengaja meniti ke tombol harus bisa
     menekannya dengan Spasi. */
  let fokusPapanKetik = false;
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') fokusPapanKetik = true;
  }, true);
  window.addEventListener('pointerdown', () => { fokusPapanKetik = false; }, true);
  const mengetik = (t) => t && t.closest &&
    t.closest('input, select, textarea, [contenteditable="true"]');
  /* Tombol dan tautan memakai Enter/Spasi untuk menekan dirinya sendiri. Kalau
     tidak dikecualikan, menekan Spasi saat fokus ada di tombol "Misi baru"
     akan menekan tombolnya DAN menembakkan meriam sekaligus. Panah tidak
     dikecualikan, supaya kemudi tetap hidup sesudah tombol diklik. */
  const kontrolTekan = (t) => t && t.closest &&
    t.closest('button, a[href], [role="button"]');

  /* Dipasang di `window` fase TANGKAP, bukan di `document`. Sebabnya ditemukan
     dengan mengukur: sebuah perekam di `window` fase tangkap melihat keempat
     tombol sampai ke halaman, sementara penangan yang sama di `document`
     tidak dipanggil sama sekali — jadi peristiwanya tidak selalu menempuh
     jalur yang saya kira. Fase tangkap di `window` adalah simpul paling awal
     yang pasti dilewati apa pun jalurnya. */
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (mengetik(e.target)) return;          /* jangan rebut pemilih Skill */
    /* Hanya dilepas kalau fokusnya memang dititi dengan Tab. Versi sebelumnya
       melepasnya untuk SETIAP tombol yang sedang fokus — dan sesudah mengklik
       tombol mana pun dengan tetikus, fokus memang tinggal di situ. Akibatnya
       Spasi dan Enter berhenti menembak begitu pemain menyentuh satu tombol.
       Saya bahkan sempat menguji perilaku itu dan menyatakannya BENAR; yang
       salah bukan kodenya melainkan syarat yang saya uji. */
    if (fokusPapanKetik &&
        (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') &&
        kontrolTekan(e.target)) return;
    if (!q('pembuka').hidden) return;        /* jangan apa-apa saat pembuka */
    if (!panelTerlihat()) return;            /* biarkan halaman digulir     */

    /* 5160: kecepatan diketik sebagai angka 1-9, bukan tombol khusus.
       `e.code` ikut diperiksa supaya papan angka (numpad) juga bekerja. */
    const angka = (e.key >= '1' && e.key <= '9') ? e.key
                : (/^(Digit|Numpad)([1-9])$/.exec(e.code) || [])[2];
    if (angka) { S.Q = Number(angka); e.preventDefault(); return gambar(); }

    /* Dicari lewat `key` DULU lalu `code`. `code` adalah letak fisik tombol
       dan tidak terpengaruh tata letak papan ketik — itu jaring pengaman
       untuk F1/F2, dua tombol yang paling mungkin tidak sampai. */
    const n = TOMBOL[e.key] || TOMBOL[e.code];
    if (!n) return;
    e.preventDefault();
    KENDALI[n]();
    gambar();
  }, true);

  /* ======================================================================
     Pasang
     ====================================================================== */
  q('topbar-host').append(ui.topbar({
    title: 'X-Wing Fighter', source: 'XWING.BAS · George Blank · 1978'
  }));
  q('kapal').innerHTML = ART.XWING;

  /* Tiga bacaan larik IM4/IM5/IM7, dipajang berdampingan supaya masalahnya
     kelihatan sendiri: dua yang pertama sepakat, yang ketiga transpose-nya. */
  const bukti = (nama, peta, ket, uk) =>
    '<figure class="xw-bukti"><div>' + ART.sprite(peta, uk) + '</div>' +
    '<figcaption><b>' + nama + '</b><br>' + peta[0].length + '&times;' +
    peta.length + '<br><span class="xw-kecil">' + ket + '</span></figcaption></figure>';
  q('tie-contoh').innerHTML =
    bukti('IM4', ART.TIE.kecil, 'bilah tegak', 46) +
    bukti('IM5', ART.TIE.sedang, 'bilah tegak', 54) +
    bukti('IM7', ART.TIE.miring, 'bilah mendatar', 62);
  q('tie-tangan').innerHTML = ART.tie(190);

  /* Ketiga musuh sebagaimana ia benar-benar tergambar di kokpit. */
  const A = ART.ARMADA;
  q('armada').innerHTML =
    ['imp', 'dv', 'ds'].map((k, i) =>
      '<figure class="xw-bukti"><div>' +
      ART.kapal(A[k].isi, A[k].w, A[k].h, [150, 150, 130][i], A[k].warna) +
      '</div><figcaption><b>' +
      ['TIE Fighter', 'TIE Advanced x1', 'Death Star'][i] + '</b><br>' +
      '<span class="xw-kecil">' +
      ['dari IM3', 'dari DV3 — sudut dipangkas', 'dari DS4'][i] +
      '</span></figcaption></figure>').join('');

  /* Sepuluh sprite yang dipulihkan dari makro DRAW — yang ini justru yang
     benar-benar Anda lawan saat terbang. */
  q('draw-contoh').innerHTML =
    ['IM', 'IM2', 'IM3'].map((n, i) =>
      bukti(n, ART.IM[i], ['>20.000', '<20.000', '<10.000'][i], 14 + i * 22)).join('') +
    ['DV', 'DV2', 'DV3'].map((n, i) =>
      bukti(n, ART.DV[i], ['>20.000', '<20.000', '<10.000'][i], 14 + i * 22)).join('') +
    ['DS', 'DS2', 'DS3', 'DS4'].map((n, i) =>
      bukti(n, ART.DS[i], ['>20.000', '<20.000', '<10.000', '<5.000'][i],
            14 + i * 18)).join('');

  /* Tombol layar. Yang mengemudi bisa DITAHAN — tanpa itu, pemain tetikus dan
     layar sentuh harus mengeklik lima kali untuk mentok ke satu sisi.
     Senjata sengaja TIDAK berulang: keduanya sekali tembak, dan dunianya
     memang berhenti selama pelurunya terbang. */
  function pasangTahan(el, aksi, ulangi) {
    let mulaiT = null, ulangT = null;
    const jalan = () => { aksi(); gambar(); };
    const henti = () => { clearTimeout(mulaiT); clearInterval(ulangT);
                          mulaiT = ulangT = null; };
    el.addEventListener('pointerdown', (e) => {
      if (e.button) return;
      e.preventDefault();
      if (el.setPointerCapture && e.pointerId !== undefined) {
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
      }
      jalan();
      if (!ulangi) return;
      mulaiT = setTimeout(() => { ulangT = setInterval(jalan, 90); }, 240);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(n =>
      el.addEventListener(n, henti));
    /* Papan ketik tetap bisa memakai tombolnya lewat Enter/Spasi bawaan. */
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jalan(); }
    });
  }
  const KEMUDI = { naik: 1, turun: 1, kiri: 1, kanan: 1 };
  document.querySelectorAll('[data-aksi]').forEach(b =>
    pasangTahan(b, () => KENDALI[b.dataset.aksi](), !!KEMUDI[b.dataset.aksi]));
  pasangTahan(q('lebih'),  () => { S.Q = Math.min(9, S.Q + 1); }, true);
  pasangTahan(q('kurang'), () => { S.Q = Math.max(1, S.Q - 1); }, true);

  function baru(benih) {
    const skill = Number(q('skill').value);
    mulai(benih, skill);
    bintangCache = null; retakCache = null;
    catat('SKILL ' + skill + ' — ' + waktuTeks() +
          '. Torpedo Bintang Kematian, itu satu-satunya cara menang.', 'xw-menang');
    if (jam) jam.stop();
    /* Langkah tetap dari `_shared/loop.js` — fondasi §2.2, dengan lajunya
       diambil dari batas yang dipasang `SOUND ...,1` di baris 2440. */
    jam = window.RETRO.loop({ update: langkah, hz: HZ });
    jam.start();
    gambar();
  }
  /* Pembuka sekali-jalan. Ditutup tersimpan, jadi ia tidak mengganggu
     kunjungan berikutnya — tapi bisa dibuka lagi lewat panel Cara memainkannya. */
  const pembuka = q('pembuka');
  function tampilkanPembuka(paksa) {
    if (!paksa && store.get('pembukaDitutup')) return;
    pembuka.hidden = false;
    if (jam) jam.stop();                 /* jangan biarkan misinya berjalan
                                            sementara pemainnya masih membaca */
  }
  function tutupPembuka() {
    pembuka.hidden = true;
    store.set('pembukaDitutup', true);
    if (jam && !S.selesai) jam.start();
  }
  q('mulai-main').addEventListener('click', tutupPembuka);
  q('buka-pembuka').addEventListener('click', (e) => {
    e.preventDefault(); tampilkanPembuka(true);
  });

  q('baru').addEventListener('click', () => baru());
  q('skill').addEventListener('change', () => baru());
  q('ulangi').addEventListener('click', () => {
    const v = prompt('Nomor benih (angka):', String(S.benih >>> 0));
    if (v !== null && v !== '') baru(Number(v) | 0);
  });

  /* `langkah` ikut diekspor supaya simulasinya bisa dijalankan TANPA gelung —
     rAF berhenti begitu tabnya tidak terlihat, jadi kalau pengujian bergantung
     pada gelung, ia diam-diam tidak menguji apa pun. */
  window.RETRO.XWING = { S, KENDALI, gambar, langkah, mulai, skor,
                         diBawahBidikan, kunciMeriam, kunciTorpedo, detikTiba,
                         get jam() { return jam; } };

  /* Angka di pembuka DIHITUNG, bukan ditulis tangan. Versi sebelumnya menulis
     "1,1 detik" dan "5,5 detik" langsung di HTML — dan begitu laju gelungnya
     dikoreksi, kedua angka itu jadi bohong tanpa ada yang memberi tahu. */
  q('p-j5').textContent = (10000 / (5 * 100 * HZ)).toFixed(1) + ' detik';
  q('p-j1').textContent = (10000 / (1 * 100 * HZ)).toFixed(1) + ' detik';

  papanSkor();
  baru();
  tampilkanPembuka(false);
})();
