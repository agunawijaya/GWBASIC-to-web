/* ===========================================================================
   pacgal.js — port dari PAC-GAL.EXE (Al J. Jiménez, Mei 1982).

   Ini port pertama di koleksi ini yang berangkat dari sebuah .EXE, bukan dari
   .BAS. Basisnya `decompile/PAC-GAL/pac-gal-run.bas` — 295 baris hasil
   rekompilasi yang berjalan tanpa galat di PC-BASIC, dengan NOL panggilan
   runtime yang tak tertangani.

   ------------------------------------------------------------------------
   SEBELUM MENGUBAH APA PUN DI BERKAS INI, BACA DUA RUJUKAN INI:

       GEOMETRY.md   petak labirin, kandang, gerbang, terowongan, koordinat
       GHOSTS.md     perilaku hantu di kedua mode, mesin keadaan, ambang

   Keduanya DIHASILKAN dari maze.js dan berkas ini oleh
   decompile/tools/gen-pacgal-ref.py, jadi angkanya tidak bisa menyimpang dari
   kode. Sesudah mengubah tetapan geometri di sini, jalankan skrip itu lagi:
   ia memuat 14 pemeriksaan yang dibangun dari PETAK, bukan dari tetapan,
   sehingga bisa menemukan kesalahan yang justru ada di tetapannya.

   Jangan menggali geometri labirin dari kode lagi. Ia statis, dan menggalinya
   berulang cuma memberi kesempatan salah baca yang sama terjadi dua kali --
   gerbang kandang pernah dikira satu sel padahal dua, dan tiga gejala yang
   tampak tidak berhubungan lahir dari satu sel itu.

   ------------------------------------------------------------------------
   TEMUAN 1 — LABIRINNYA TIDAK ADA DI MANA PUN

   Pencarian literal CP437 di segmen data tidak menemukan satu pun potongan
   labirin. Sebabnya: labirinnya tidak DISIMPAN, ia DIBANGUN. Delapan variabel
   string diisi sekali di awal —

       V09DC$ = CHR$(219)          █ dinding
       V09E0$ = CHR$(186) + " "    ║ dinding samping
       V09F0$ = CHR$(249) + " "    ∙ pelet
       V09F8$ = STRING$(2, 205)    ══ dinding datar

   — lalu tiap baris labirin dicetak sebagai rentetan `PRINT` atas variabel itu.
   Menyimpan labirin sebagai literal berarti menulis 24 baris penuh di sumber;
   membangunnya dari `CHR$` jauh lebih ringkas di mesin dengan 64 KB.

   Akibatnya untuk port ini: tidak ada larik yang bisa disalin. Labirin di
   `maze.js` karena itu DIUKUR — `run/PAC-GAL.EXE` dijalankan di emulator dan
   layarnya dipanen. Susunannya sudah dicocokkan sel demi sel dengan
   rekonstruksi .bas-nya, 24 dari 24 baris.

   Angka yang memeriksa dirinya sendiri: ubin pelet di data terhitung 468, dan
   baris status yang dicetak programnya sendiri berbunyi "dots 468".

   ------------------------------------------------------------------------
   TEMUAN 2 — TABRAKAN DIDETEKSI DENGAN MEMBACA LAYAR

   Tidak ada peta tabrakan di memori. Yang ada ini:

       1800 I4% = I23%+I17% : I5% = I24%+I18%
            I3% = SCREEN(I4%, I5%+I5%+1)
            IF I3% <> 32 THEN ...      ' 32 = spasi, boleh dilewati
       1860 IF I3% <> 249 THEN ...     ' 249 = pelet, boleh dilewati + dimakan

   `SCREEN(baris, kolom)` membaca karakter yang sedang tampil. Jadi layar
   BUKAN keluaran program — ia juga struktur datanya. Itu sebabnya labirin
   harus tergambar sebelum permainan bisa jalan sama sekali.

   `I5%+I5%+1` juga menjelaskan bentuk labirinnya: kolom logis dikalikan dua,
   jadi satu sel permainan selebar DUA kolom layar. Petak 40 kolom digambar
   di layar 80 kolom.

   Di port ini peta tabrakan dibaca dari kisi karakter yang sama — bukan
   karena harus, tapi karena mengubahnya jadi peta terpisah akan menghilangkan
   satu-satunya hal yang membuat labirin ini bisa dipahami.

   ------------------------------------------------------------------------
   TEMUAN 3 — TEROWONGAN ADALAH SEBUAH KARAKTER

       2040 IF I4% = 12 THEN ...
       2100 IF I3% = 196 THEN ...          ' 196 = ─
       2160 I5% = 39 - I18%                ' pantulkan ke sisi seberang

   Baris 12 diberi ubin `─` di kedua ujungnya, dan menyentuhnya memantulkan
   kolom ke `39 - kolom`. Terowongan Pac-Man dikerjakan tanpa satu pun cabang
   khusus di gelung gerak: cukup satu karakter yang berbeda.

   ------------------------------------------------------------------------
   TEMUAN 4 — KEHILANGAN NYAWA JUSTRU MEMBUATNYA LEBIH MUDAH

       2880 F2! = CSNG(I11%)/5 + 20 : I1% = CINT(F2! / CSNG(I10%*I10%))
       2910 J2%(I6%) = 26 : J6%(I6%) = I1%

   `I11%` pelet tersisa, `I10%` nyawa. Angka itu lama hantu tetap rentan
   sesudah pelet besar dimakan. Dibagi KUADRAT nyawa:

       468 pelet, 3 nyawa  ->  (93,6 + 20) / 9  =  13 giliran
        50 pelet, 3 nyawa  ->  (10  + 20) / 9   =   3 giliran
       468 pelet, 1 nyawa  ->  (93,6 + 20) / 1  = 114 giliran

   Jadi permainannya mengetat saat pelet menipis, dan MELONGGAR saat pemain
   kehabisan nyawa — sembilan kali lipat dari nyawa tiga ke satu. Itu belas
   kasihan yang dipanggang ke dalam satu baris aritmetika, dan tidak pernah
   diberitahukan ke pemain.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, loop, rng } = window.RETRO;
  /* Menulis ke elemen yang mungkin tidak ada. Pelajaran dari Hopper: satu
     `$('...')` yang null pernah melempar dari penyegar panel dan menghentikan
     penangan klik SEBELUM gelung dinyalakan. Panel angka tidak boleh punya kuasa
     sebesar itu atas gelung permainan. */
  const tulis = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  const $ = (id) => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const db = store('pacgal');

  const ROWS = window.RETRO.PACGAL_ROWS;
  const META = window.RETRO.PACGAL_MAZE;

  // --- ukuran gambar ------------------------------------------------------
  // Satu SEL permainan selebar dua kolom layar (temuan 2), jadi kisi gambarnya
  // 80 kolom sementara kisi geraknya 40. Sel dibuat 16x16 supaya dinding tipis
  // (garis 3 unit) masih punya ruang bernapas di tengahnya.
  const KOL = 80, BAR = 24, W = 8, H = 16;

  // --- ubin ---------------------------------------------------------------
  const SPASI = ' ', PELET = '∙', TEROWONGAN = '─';
  const BLOK = '█▀▄';          // █ ▀ ▄ — bingkai layar

  /* Peta karakter dinding -> arah sambungannya. Dipakai menggambar: sebuah
     dinding digambar sebagai garis dari titik tengah sel ke sisi yang
     tersambung, jadi sudut dan pertigaan terbentuk sendiri tanpa daftar
     bentuk terpisah. */
  const SAMBUNG = {
    '═': 'lr', '─': 'lr',                      // ═ ─
    '║': 'ud',                                       // ║
    '╔': 'rd', '╗': 'ld',                      // ╔ ╗
    '╚': 'ru', '╝': 'lu',                      // ╚ ╝
    '╦': 'lrd', '╩': 'lru',                    // ╦ ╩
    '╠': 'rud', '╣': 'lud', '╬': 'lrud'   // ╠ ╣ ╬
  };

  const at = (r, c) => (ROWS[r] && ROWS[r][c]) || SPASI;
  const bolehLewat = (ch) => ch === SPASI || ch === PELET;

  // =========================================================================
  // Menggambar labirin
  // =========================================================================
  function svgEl(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function gambarLabirin() {
    const g = svgEl('g', { class: 'p-maze' });
    for (let r = 0; r < BAR; r++) {
      for (let c = 0; c < KOL; c++) {
        const ch = at(r, c);
        if (ch === SPASI || ch === PELET) continue;
        const x = c * W + W / 2, y = r * H + H / 2;
        if (BLOK.indexOf(ch) >= 0) {
          g.append(svgEl('rect', {
            x: c * W, y: r * H, width: W, height: H, class: 'p-blok'
          }));
          continue;
        }
        const s = SAMBUNG[ch];
        if (!s) continue;
        // Terowongan digambar beda supaya terlihat sebagai jalan tembus,
        // bukan dinding — ia satu-satunya ubin yang BOLEH dimasuki.
        const kelas = (ch === TEROWONGAN) ? 'p-terowongan' : 'p-dinding';
        if (s.indexOf('l') >= 0) g.append(svgEl('line', { x1: c * W, y1: y, x2: x, y2: y, class: kelas }));
        if (s.indexOf('r') >= 0) g.append(svgEl('line', { x1: x, y1: y, x2: (c + 1) * W, y2: y, class: kelas }));
        if (s.indexOf('u') >= 0) g.append(svgEl('line', { x1: x, y1: r * H, x2: x, y2: y, class: kelas }));
        if (s.indexOf('d') >= 0) g.append(svgEl('line', { x1: x, y1: y, x2: x, y2: (r + 1) * H, class: kelas }));
      }
    }
    return g;
  }

  // =========================================================================
  // Keadaan permainan
  // =========================================================================
  const MULAI = { r: 18, c: 19 };                  // I17%=19, I18%=19 (1-based)
  const KANDANG = { r: 13, cs: [17, 18, 19, 20] }; // J3%=14, J4%=i+16
  const ARAH = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // atas, bawah, kiri, kanan

  /* GERBANG KANDANG — dibaca dari petak hasil panen, bukan ditaruh.

     Baris 11 kolom 19 dan 20 adalah dua sel SPASI di tengah dinding atas
     kandang (`╔══  ══╗`), dan di atasnya baris 10 kolom 19 sebuah pelet. Itu
     satu-satunya jalan keluar.

     Versi pertama port ini tidak punya keadaan "keluar": hantu selalu memilih
     arah menuju pemain, dan pemain mulai di BAWAH kandang — jadi arah "atas"
     selalu jadi pilihan terakhir dan gerbangnya tidak pernah dicoba. Keempatnya
     terkurung selamanya, memantul di lantai kandang. */
  const GERBANG = { r: 11, c: 19 };

  /* ENERGIZER — REKONSTRUKSI, bukan pemulihan.

     Aslinya memang punya keadaan hantu-rentan, dan rumus lamanya terpulihkan
     utuh (baris 2880). Yang TIDAK terpulihkan pemicunya: ujinya
     `IF SCREEN(...) > 7`, dan setiap ubin labirin — pelet 249, spasi 32,
     dinding 205 — semuanya lebih dari 7. Pembacaan itu tidak menghasilkan
     penjelasan yang masuk akal, dan petak hasil panen tidak memuat ubin khusus
     yang bisa jadi energizer.

     Jadi empat energizer di sudut ini KONVENSI Pac-Man, bukan temuan. Selnya
     dipilih dengan mencari pelet terdekat ke tiap sudut petak. Ditandai sebagai
     rekonstruksi di halaman dan di tabel penyimpangan. */
  const ENERGIZER = [[1, 1], [1, 38], [22, 1], [22, 38]];

  /* Empat watak. Aslinya keempat hantu memakai pengejar yang SAMA — satu-satunya
     yang membedakan cuma nilai acak arah awal. Akibatnya mereka menumpuk jadi
     satu rombongan dan permainannya jadi mudah ditebak.

     Yang dipakai di sini konvensi Pac-Man 1980: empat sasaran berbeda, sehingga
     keempatnya menyebar sendiri tanpa aturan tambahan. Ini REKONSTRUKSI. */
  const WATAK = [
    { nama: 'Pengejar', sudut: [0, 38] },
    { nama: 'Pembayang', sudut: [0, 1] },
    { nama: 'Penjepit', sudut: [23, 38] },
    { nama: 'Pemalu', sudut: [23, 1] }
  ];

  /* Kapan tiap hantu keluar kandang — dihitung dari PELET YANG SUDAH DIMAKAN,
     bukan dari waktu.

     Versi sebelumnya memakai penundaan tetap 0/24/60/100 tik permainan. Satu tik
     = 0,13 detik, jadi hantu keempat menunggu TIGA BELAS DETIK — dan `reset()`
     memasang ulang penundaan itu setiap kali pemain mati. Akibatnya: mati sebelum
     13 detik, dan hantu keempat tidak pernah keluar sama sekali. Dua hantu
     terakhir praktis tidak ikut bermain. Dilaporkan pemilik proyek, dan cacat itu
     sudah ada sejak versi pertama — bukan dari perubahan watak.

     Pencacah pelet memperbaikinya sekaligus mendekatkannya ke Pac-Man 1980, yang
     juga melepas hantu berdasarkan pelet (Pinky 0, Inky 30, Clyde 60 dari 244).
     Yang menentukan: `sisa` TIDAK di-reset saat mati, jadi sesudah mati keempatnya
     langsung keluar lagi — persis yang seharusnya. Ambangnya diskalakan ke 468
     pelet dan tetap REKONSTRUKSI: PAC-GAL sendiri tidak punya aturan ini. */
  const AMBANG_KELUAR = [0, 5, 14, 28];   // 0% / 1% / 3% / 6% dari 468

  /* SKOR HANTU DAN JEDA — REKONSTRUKSI dari Pac-Man arcade, bukan dari
     PAC-GAL.

     PAC-GAL 1982 tidak punya skor sama sekali. Satu-satunya pencacah yang
     dicetaknya adalah `dots`, dan saat hantu dimakan yang terjadi cuma ini
     (baris 4560 `pac-gal-run.bas`):

         4560 J2%(I6%) = 7 : J3%(I6%) = 14 : J4%(I6%) = I6% + 16

     warna kembali ke 7 (normal), baris ke 14, kolom ke sel start-nya —
     seketika, tanpa fase mata dan tanpa penundaan. Jadi aslinya justru LEBIH
     keras daripada port ini, yang masih memaksa matanya berjalan pulang.

     Yang hilang dari port ini bukan jedanya, melainkan IMBALANNYA: memakan
     hantu tidak menghasilkan apa pun, jadi masa rentan cuma beberapa detik
     aman tanpa apa-apa. Di Pac-Man arcade justru di situ inti bonusnya —
     200/400/800/1600 berlipat untuk hantu berturut-turut dalam SATU energizer,
     dan permainan membeku sekitar sedetik menampilkan angkanya, yang sekaligus
     memberi pemain waktu bernapas.

     Keduanya dipasang di sini. Ditandai penyimpangan di GHOSTS.md §5. */
  const NILAI_HANTU = [200, 400, 800, 1600];
  const BEKU_LAMA = 0.9;         // detik permainan membeku sambil menampilkan angka

  const PER_LANGKAH = 0.13;      // detik per langkah petak
  const SEBAR = [0, 56, 200, 256, 400];  // ambang tik: sebar <-> kejar

  /* --- tetapan yang datang dari Pac-Man 1980 --------------------------------
     Diperiksa terhadap pacman.fandom.com/wiki/Maze_Ghost_AI_Behaviors, bagian
     "Pac-Man" saja (bukan Arrangement 1996 dan seterusnya). Empat angka: */
  const DEPAN = 2;               // Pinky membidik 2 petak di depan, bukan 4
  const RADIUS_PEMALU = 8;       // Clyde pulang ke sudut dalam radius 8 petak
  const ELROY1 = 20, ELROY2 = 10; // ambang pelet sisa untuk "marah"-nya Blinky

  let pelet, energi, sisa, nyawa, pemain, hantu, takut, tik, mainLoop;
  let bonus, rantai, beku, angka;   // skor hantu, rantai dalam satu energizer,
                                    // sisa jeda, dan angka yang sedang tampil
  let acak = rng(20250810);      // untuk arah acak hantu yang ketakutan

  /* --- mode hantu asli PAC-GAL ---------------------------------------------
     `I12%` = peluang mengejar, SATU angka untuk keempat hantu. Nilai awal dan
     kedua aturan pengubahnya dikutip dari `pac-gal-run.bas`:

         1030  I12% = 0                          ' nilai awal
         3320  I12% = CINT(I12% * 0.5)           ' saat pelet tersisa < 50
         3680  I12% = I12% + I12%                ' mati saat pelet > 300, jika < 0,1
         5210  IF CSNG(I12%) >= RND(2) THEN kejar ELSE jalan lurus

     Nilai awalnya NOL, dan kedua operasinya cuma membagi dua dan mengalikan
     dua. Nol tetap nol. Jadi syarat di 5210 tidak pernah benar, dan hantunya
     TIDAK PERNAH MENGEJAR -- mereka berjalan lurus dan memantul.

     Itu bukan cacat port ini; itu yang dilakukan pernyataan yang berhasil
     dipulihkan. Angkanya ditampilkan di panel supaya bisa dilihat sendiri, dan
     kedua aturan pengubahnya tetap dijalankan -- kalau suatu saat pernyataan
     yang mengisi `I12%` ditemukan, yang berubah cuma satu tetapan.
     Lihat decompile/PAC-GAL/ARCHITECTURE.md sec. 4b. */
  const I12_AWAL = 0;
  let i12 = I12_AWAL;
  const modeAsli = () => { const n = $('t-asli'); return !!(n && n.checked); };

  function reset(penuh) {
    if (penuh) {
      pelet = ROWS.map(r => r.split('').map(ch => ch === PELET));
      energi = new Set(ENERGIZER.map(([r, c]) => r + ',' + c));
      sisa = META.pelet;
      bonus = 0;
      i12 = I12_AWAL;
      nyawa = 3;                                   // I10% = 3
    }
    rantai = 0; beku = 0; angka = null;
    pemain = { r: MULAI.r, c: MULAI.c, dr: 0, dc: -1, ndr: 0, ndc: -1 };
    hantu = WATAK.map((w, i) => ({
      r: KANDANG.r, c: KANDANG.cs[i], dr: -1, dc: 0,
      watak: i, mode: 'kandang', takut: 0, dimakan: false
    }));
    takut = 0;
    tik = 0;
  }

  const bolehSel = (r, c) => r >= 0 && r < BAR && c >= 0 && c < 40
    && bolehLewat(at(r, c * 2));

  /* Satu langkah. Terowongan ditangani persis seperti aslinya: ubin `─` di
     baris 11 memantulkan kolom ke 39 - kolom. Baris itu DIPERIKSA oleh
     decompile/tools/gen-pacgal-ref.py; lihat GEOMETRY.md. */
  function langkah(r, c, dr, dc) {
    let nr = r + dr, nc = c + dc;
    if (nr < 0 || nr >= BAR) return null;
    if (at(nr, nc * 2) === TEROWONGAN) nc = 39 - c;
    return bolehSel(nr, nc) ? { r: nr, c: nc } : null;
  }

  function gerakPemain() {
    if (pemain.ndr || pemain.ndc) {
      const p = langkah(pemain.r, pemain.c, pemain.ndr, pemain.ndc);
      if (p) { pemain.dr = pemain.ndr; pemain.dc = pemain.ndc; }
    }
    const p = langkah(pemain.r, pemain.c, pemain.dr, pemain.dc);
    if (!p) return;
    pemain.r = p.r; pemain.c = p.c;

    const kunci = p.r + ',' + p.c;
    if (energi.has(kunci)) {
      energi.delete(kunci);
      pelet[p.r][p.c * 2] = false;
      sisa--; i12PeletDimakan();
      rantai = 0;                  // energizer baru -> nilai kembali ke 200
      // Rumus lama-rentan ASLI, baris 2880: (pelet/5 + 20) / nyawa^2
      takut = Math.round((sisa / 5 + 20) / (nyawa * nyawa));
      hantu.forEach(h => {
        if (h.mode === 'kejar' || h.mode === 'sebar') {
          h.takut = takut;
          // membalik arah saat ketakutan -- perilaku Pac-Man yang membuat
          // pemain bisa mengejar, bukan sekadar aman
          h.dr = -h.dr; h.dc = -h.dc;
        }
      });
      audio.play('mbl64o2afgao4d');
      ui.toast('Hantu rentan ' + takut + ' giliran');
      return;
    }
    if (pelet[p.r][p.c * 2]) {
      pelet[p.r][p.c * 2] = false;
      sisa--; i12PeletDimakan();
      audio.sound(660, 1);
    }
  }

  // =========================================================================
  // Hantu: sasaran per watak, lalu langkah yang memperkecil jarak
  // =========================================================================
  /* Titik "n petak di depan pemain" — BERIKUT bug 1980-nya.

     Di mesin aslinya, offset arah ditambahkan ke koordinat pemain lewat satu
     rutin yang, untuk arah ATAS, juga menambahkan offset yang sama ke sumbu
     mendatar. Akibatnya saat Pac-Man menghadap ke atas, titik bidiknya bukan
     n petak di atasnya melainkan n di atas DAN n ke kiri.

     Itu bug, bukan rancangan — tapi ia bug yang membentuk seluruh rasa main
     permainan itu, karena ia yang membuat Pinky bisa dikelabui dengan
     menghadap ke atas. Meniru perilakunya tanpa meniru bug-nya berarti meniru
     yang salah. Penjepit memakai rutin yang sama, jadi ia mewarisi bug yang
     sama persis seperti di aslinya. */
  function didepan(n) {
    const r = pemain.r + pemain.dr * n;
    let c = pemain.c + pemain.dc * n;
    if (pemain.dr === -1 && pemain.dc === 0) c -= n;   // bug limpahan arah atas
    return [r, c];
  }

  function sasaran(h) {
    /* Keluar kandang dan pulang setelah dimakan TIDAK lewat sini: keduanya
       memakai peta jarak (`langkahKeluar` / `langkahPulang`) dan sudah kembali
       lebih dulu. Cabangnya sengaja tidak disisakan di sini supaya tidak ada
       dua sumber kebenaran untuk satu tugas. */
    // Blinky yang sudah "marah" TIDAK ikut menyebar -- ia terus mengejar.
    // Itu bagian dari mode marahnya di 1980, dan bagian yang paling terasa.
    if (h.mode === 'sebar' && !(h.watak === 0 && elroy())) return WATAK[h.watak].sudut;

    const pr = pemain.r, pc = pemain.c;
    switch (h.watak) {
      case 0:                                   // Pengejar: langsung ke pemain
        return [pr, pc];
      case 1:                                   // Pembayang: DEPAN petak di muka
        return didepan(DEPAN);
      case 2: {                                 // Penjepit: cerminan si Pengejar
        const [ar, ac] = didepan(2);
        const b = hantu[0];
        return [ar * 2 - b.r, ac * 2 - b.c];
      }
      default: {                                // Pemalu: dekat -> pulang
        const d = Math.hypot(pr - h.r, pc - h.c);
        return d > RADIUS_PEMALU ? [pr, pc] : WATAK[3].sudut;
      }
    }
  }

  /* Gerak ala Pac-Man: di tiap langkah, coba semua arah KECUALI berbalik, lalu
     ambil yang paling memperkecil jarak ke sasaran. Berbalik hanya kalau buntu.

     Larangan berbalik itu yang membuat hantu punya lintasan, bukan bergetar di
     tempat -- dan bersama empat sasaran berbeda, ia juga yang mencegah keempatnya
     menempuh jalur yang sama. */
  /* Gerak hantu ASLI PAC-GAL. Tiga aturan, ketiganya dari `pac-gal-run.bas`:

       5210  undian: kejar, atau JALAN LURUS ke arah yang sedang ditempuh
       5270  kalau mengejar, koreksi hanya pada SUMBU YANG TIDAK SEDANG DITEMPUH
             (J7% = 0 -> samakan baris; selain itu -> samakan kolom)
       ----  sasarannya posisi pemain, sama untuk keempat hantu (I17%/I18%)

     Yang TIDAK terpulihkan: apa yang terjadi saat langkahnya menabrak dinding.
     Di sini dipilih arah sah lain secara acak -- perilaku memantul yang wajar
     untuk hantu yang arah awalnya sendiri diundi. Itu REKONSTRUKSI. */
  function gerakAsli(h) {
    if (h.mode === 'kandang' && !bolehKeluar(h)) return;
    if (h.mode === 'kandang') h.mode = 'keluar';
  /* Selesai keluar = sudah BERADA DI ATAS baris gerbang, bukan menginjak satu sel
     tertentu.

     Versi sebelumnya menguji sel (10,19)
     persis. Karena gerbangnya dua sel lebar, hantu yang naik lewat (11,20) tiba di
     (10,20) dan TIDAK PERNAH memenuhi syarat itu: ia tetap bermode 'keluar'
     selamanya, dan karena sasaran mode 'keluar' adalah gerbang, ia terus berusaha
     kembali masuk. Dari luar terlihat seperti hantu yang mondar-mandir di atas
     kandang, atau yang tiba-tiba masuk lagi dan tidak keluar-keluar.

     Satu sel yang salah dijadikan syarat, dan tiga gejala berbeda lahir darinya. */
    if (h.mode === 'keluar' && h.r < GERBANG.r) h.mode = 'kejar';
    if (h.dimakan && h.r === KANDANG.r && h.c === KANDANG.cs[h.watak]) {
      h.dimakan = false; h.takut = 0; h.mode = 'keluar';
    }
    if (h.dimakan) return langkahPulang(h);          // mata pulang lewat peta jarak
    if (h.mode === 'keluar') return langkahKeluar(h); // keluar juga lewat peta jarak

    let dr = h.dr, dc = h.dc;
    if (i12 >= acak.next()) {                        // 5210: menang undian
      if (h.dr === 0) {                              // 5270: koreksi baris
        if (h.r !== pemain.r) { dr = Math.sign(pemain.r - h.r); dc = 0; }
      } else {                                       // 5660: koreksi kolom
        if (h.c !== pemain.c) { dc = Math.sign(pemain.c - h.c); dr = 0; }
      }
    }

    if ((h.mode === 'kejar' || h.mode === 'sebar') && !h.dimakan && diKandang(h.r, h.c)) {
      h.mode = 'keluar';
    }
    let p = (dr || dc) ? langkah(h.r, h.c, dr, dc) : null;
    if (p && !bolehGerbang(h) && adalahGerbang(p.r, p.c)) p = null;
    if (!p) {                                        // menabrak -> memantul
      const sah = [];
      for (const [ar, ac] of ARAH) {
        const q = langkah(h.r, h.c, ar, ac);
        if (q && (bolehGerbang(h) || !adalahGerbang(q.r, q.c)))
          sah.push({ q, ar, ac });
      }
      if (!sah.length) return;
      const pilih = acak.pick(sah);
      p = pilih.q; dr = pilih.ar; dc = pilih.ac;
    }
    h.r = p.r; h.c = p.c; h.dr = dr; h.dc = dc;
    if (h.takut > 0) h.takut--;
  }

  /* Gerbang kandang SATU ARAH. Hanya hantu yang sedang keluar, atau yang sudah
     dimakan dan pulang, boleh melewatinya. Hantu yang sedang bermain tidak.

     Tanpa aturan ini, hantu ketakutan yang bergerak acak bisa melangkah masuk
     kembali ke kandang — dan begitu di dalam, modenya masih 'kejar', jadi
     baris "kalau di kandang, keluar" tidak pernah kena dan ia terjebak selamanya.
     Itulah persis dua gejala yang dilaporkan: hantu yang tidak bisa keluar, dan
     hantu yang tiba-tiba kembali ke kotak awal tanpa sebab. */
  /* GEOMETRI KANDANG, dibaca dari petak hasil panen — bukan diperkirakan.

         kol  16 17 18 19 20 21 22 23
         r11   #  #  #  .  .  #  #  #     <- gerbang DUA sel: (11,19) dan (11,20)
         r12   #  .  .  .  .  .  .  #
         r13   #  .  .  .  .  .  .  #     <- interior kolom 17..22
         r14   #  .  .  .  .  .  .  #
         r15   #  #  #  #  #  #  #  #

     Versi pertama aturan satu-arah ini memakai `GERBANG` tunggal di (11,19) dan
     menganggap interiornya kolom 17..20. Keduanya salah, dan salahnya persis
     sebesar yang dibutuhkan untuk merusak semuanya: hantu berjalan masuk lewat
     (11,20) yang tidak dijaga, lalu berdiri di kolom 21..22 yang tidak dikenali
     jaring pengaman — jadi ia tidak pernah dikembalikan ke fase keluar. */
  const adalahGerbang = (r, c) => r === GERBANG.r && (c === 19 || c === 20);
  const bolehGerbang = (h) => h.dimakan || h.mode === 'keluar' || h.mode === 'kandang';
  const diKandang = (r, c) => r >= 12 && r <= 14 && c >= 17 && c <= 22;

  const bolehKeluar = (h) => (META.pelet - sisa) >= AMBANG_KELUAR[h.watak];

  /* PETA JARAK PULANG — satu banjir per sel start hantu, dihitung SEKALI.

     Sebelumnya mata yang pulang dikemudikan aturan sumbu: samakan baris dulu,
     baru kolom. Aturan itu tidak bisa memulangkan siapa pun. Untuk masuk
     kandang, hantu harus sejajar di KOLOM gerbang (19/20) lalu turun lewat
     baris 11 — tapi aturan itu baru mengizinkan gerak mendatar setelah baris
     sasaran tercapai, dan baris sasarannya (13) ada DI DALAM kandang yang
     berdinding. Jadi matanya tidak pernah bisa sejajar dengan gerbang: ia
     mendorong ke bawah, menabrak atap kandang, lalu memantul acak — selamanya.
     Dilaporkan pemilik proyek di mode PAC-GAL, dan mode 1980 punya penyakit
     yang sama bentuknya (di sana pemilihnya meminimalkan jarak lurus, yang juga
     bisa terjebak di lembah lokal).

     Banjir menghapus seluruh kelas kesalahan itu: jarak sebenarnya ke rumah
     sudah tersimpan di tiap sel, jadi mata cukup melangkah ke tetangga dengan
     angka terkecil. Selalu jalan terpendek, tidak ada lembah lokal, dan
     biayanya nol saat bermain. Gerbang dilewati dalam banjir ini karena hantu
     yang dimakan memang boleh melewatinya. */
  function petaJarak(benih) {
    const d = [];
    for (let r = 0; r < BAR; r++) d.push(new Array(40).fill(-1));
    for (const [r, c] of benih) d[r][c] = 0;
    let antre = benih.slice();
    while (antre.length) {
      const lagi = [];
      for (const [r, c] of antre) {
        for (const [dr, dc] of ARAH) {
          const p = langkah(r, c, dr, dc);
          if (!p || d[p.r][p.c] >= 0) continue;
          d[p.r][p.c] = d[r][c] + 1;
          lagi.push([p.r, p.c]);
        }
      }
      antre = lagi;
    }
    return d;
  }

  const PULANG = KANDANG.cs.map((c) => petaJarak([[KANDANG.r, c]]));

  /* PETA JARAK KELUAR — banjir dari kedua sel tepat DI ATAS gerbang.

     Fase keluar dulu memakai aturan sumbu yang sama dengan jalan pulang, dan
     punya cacat yang sama bentuknya. Yang paling merusak: begitu hantu berdiri
     PERSIS di sel gerbang, sasarannya adalah selnya sendiri, jadi `dr` dan `dc`
     dua-duanya nol -- tidak ada langkah yang dihitung, dan hantu jatuh ke
     cabang "memantul acak". Dari sel gerbang cuma ada dua tetangga: satu ke
     luar, satu kembali ke dalam kandang. Jadi tiap kali hantu sampai di ambang
     pintu, ia melempar koin apakah mau keluar atau masuk lagi.

     Mode 1980 tidak terkena karena pemilihnya menimbang keempat arah dan
     mengambil jarak terkecil, dan urutan ARAH menaruh "atas" lebih dulu --
     jadi ia selalu memilih keluar. Mode asli PAC-GAL tidak punya penyeimbang
     itu: hantunya bergelantungan di sekitar kandang, dan yang apes tidak
     pernah benar-benar pergi. Itulah "satu hantu yang tinggal di kotak awal".

     Peta jarak menghapusnya: selalu ada satu tetangga dengan angka lebih kecil,
     jadi tidak ada undian di ambang pintu dan tidak ada jalan buntu. */
  const KELUAR = petaJarak([[GERBANG.r - 1, 19], [GERBANG.r - 1, 20]]);

  /* Satu langkah menuruni peta jarak. Berbalik arah DIIZINKAN: hantu yang
     sedang pulang atau sedang keluar bukan hantu yang sedang berpatroli, dan
     larangan berbalik cuma memperpanjang perjalanannya tanpa alasan.

     Dipakai untuk KEDUA fase terarah -- pulang dan keluar -- supaya keduanya
     tidak punya dua mekanisme berbeda yang bisa rusak sendiri-sendiri. */
  function turuniPeta(h, d) {
    let pilih = null, kecil = Infinity;
    for (const [dr, dc] of ARAH) {
      const p = langkah(h.r, h.c, dr, dc);
      if (!p) continue;
      const j = d[p.r][p.c];
      if (j >= 0 && j < kecil) { kecil = j; pilih = { p, dr, dc }; }
    }
    if (!pilih) return;
    h.r = pilih.p.r; h.c = pilih.p.c; h.dr = pilih.dr; h.dc = pilih.dc;
  }

  const langkahPulang = (h) => turuniPeta(h, PULANG[h.watak]);
  const langkahKeluar = (h) => turuniPeta(h, KELUAR);

  function gerakSatuHantu(h) {
    if (modeAsli()) return gerakAsli(h);
    if (h.mode === 'kandang' && !bolehKeluar(h)) return;

    if (h.mode === 'kandang') h.mode = 'keluar';
    /* Jaring pengaman: hantu yang sedang bermain tapi berada DI DALAM kandang
       tidak punya jalan pulang lewat logika biasa. Kembalikan ia ke fase keluar
       supaya ia menuju gerbang. */
    if ((h.mode === 'kejar' || h.mode === 'sebar') && !h.dimakan && diKandang(h.r, h.c)) {
      h.mode = 'keluar';
    }
    if (h.mode === 'keluar' && h.r < GERBANG.r) h.mode = modeSekarang();
    if (h.dimakan && h.r === KANDANG.r && h.c === KANDANG.cs[h.watak]) {
      h.dimakan = false; h.takut = 0; h.mode = 'keluar';
    }
    if (h.dimakan) return langkahPulang(h);          // mata pulang lewat peta jarak
    if (h.mode === 'keluar') return langkahKeluar(h); // keluar juga lewat peta jarak
    if (h.mode === 'kejar' || h.mode === 'sebar') h.mode = modeSekarang();

    const [tr, tc] = sasaran(h);
    let pilihan = null, jarakTerbaik = Infinity;
    const sah = [];
    for (const [dr, dc] of ARAH) {
      if (dr === -h.dr && dc === -h.dc) continue;        // jangan berbalik
      const p = langkah(h.r, h.c, dr, dc);
      if (!p) continue;
      if (!bolehGerbang(h) && adalahGerbang(p.r, p.c)) continue;
      const j = (p.r - tr) * (p.r - tr) + (p.c - tc) * (p.c - tc);
      if (j < jarakTerbaik) { jarakTerbaik = j; pilihan = { p, dr, dc }; }
      sah.push({ p, dr, dc });
    }
    /* Saat ketakutan, hantu 1980 TIDAK kabur — ia memilih arah ACAK di tiap
       persimpangan. Bedanya bukan derajat melainkan jenis: yang kabur bisa
       digiring ke sudut dan dikumpulkan, yang acak tetap berbahaya justru saat
       pemain mengira sudah aman. Versi sebelumnya di sini memaksimalkan jarak
       ke sasaran; itu keliru. */
    /* Acak HANYA saat hantu sedang bermain. Kalau ia sedang keluar kandang atau
       sedang pulang setelah dimakan, ia harus tetap menuju sasarannya — kalau
       tidak, ia tidak akan pernah sampai. */
    const bermain = h.mode === 'kejar' || h.mode === 'sebar';
    if (h.takut > 0 && !h.dimakan && bermain && sah.length) pilihan = acak.pick(sah);
    if (!pilihan) {                                      // buntu -> berbalik
      const p = langkah(h.r, h.c, -h.dr, -h.dc);
      if (p) pilihan = { p, dr: -h.dr, dc: -h.dc };
    }
    if (!pilihan) return;
    h.r = pilihan.p.r; h.c = pilihan.p.c; h.dr = pilihan.dr; h.dc = pilihan.dc;
    if (h.takut > 0) h.takut--;
  }

  /* Mode "marah" Blinky — Cruise Elroy di aslinya. Menyala saat pelet tinggal
     sedikit: ia bergerak lebih cepat dan berhenti ikut menyebar. Dua tingkat,
     ambangnya 20 dan 10 pelet tersisa.

     Ini yang mengubah akhir permainan dari "tinggal menyapu sisa" jadi kejaran
     sungguhan, dan tanpanya pelet terakhir selalu aman diambil. */
  function elroy() { return sisa <= ELROY1 ? (sisa <= ELROY2 ? 2 : 1) : 0; }

  /* Kedua aturan pengubah `I12%`, dikutip apa adanya. Keduanya MENURUNKAN
     keganasan saat pemain mendekati menang, dan MENAIKKANNYA saat pemain mati
     di awal -- kebalikan dari Cruise Elroy. */
  function i12PeletDimakan() { if (sisa < 50) i12 = Math.round(i12 * 0.5); }   // 3320
  function i12Mati() { if (sisa > 300 && i12 < 0.1) i12 = i12 + i12; }         // 3680

  /* Sebar/kejar bergantian. Tanpa ini, empat hantu yang semuanya mengejar akan
     menyudutkan pemain sejak awal dan permainannya tidak bisa dimainkan. */
  function modeSekarang() {
    let i = 0;
    while (i < SEBAR.length && tik >= SEBAR[i]) i++;
    return (i % 2) ? 'sebar' : 'kejar';
  }

  function gerakHantu() {
    // Hantu yang ketakutan bergerak SETENGAH kecepatan -- itu yang memberi
    // pemain kesempatan nyata untuk mengejar.
    hantu.forEach(h => {
      /* Hantu ketakutan bergerak SEPERTIGA kecepatan, bukan setengah.
         Rumus lamanya (`(pelet/5+20)/nyawa²` = 13 giliran di awal) datang dari
         biner dan tidak diubah — yang diubah berapa lama satu "giliran" itu di
         layar. Dengan setengah kecepatan, 13 giliran cuma 3,4 detik, dan sejak
         hantu bergerak ACAK (bukan kabur) waktu sesingkat itu praktis tidak bisa
         dipakai: mereka tidak datang menghampiri, jadi pemain tidak sempat
         mengejar. Dilaporkan pemilik proyek sebagai "hampir tidak terasa".
         Sepertiga kecepatan memberi ~5 detik DAN membuat mereka bisa dikejar. */
      if (h.takut > 0 && !h.dimakan && (tik % 3)) return;
      /* Langkah tambahan untuk Blinky yang marah: tingkat 1 tiap empat tik,
         tingkat 2 tiap dua tik. Angkanya dipilih supaya ia sedikit lebih cepat
         dari pemain, bukan supaya mustahil dihindari. */
      if (!modeAsli() && h.watak === 0 && !h.takut && !h.dimakan) {
        const e = elroy();
        if (e === 2 && tik % 2 === 0) gerakSatuHantu(h);
        else if (e === 1 && tik % 4 === 0) gerakSatuHantu(h);
      }
      gerakSatuHantu(h);
    });
  }

  function cekTabrakan() {
    for (const h of hantu) {
      if (h.r !== pemain.r || h.c !== pemain.c || h.dimakan) continue;
      if (h.takut > 0) {
        h.dimakan = true; h.takut = 0;
        const nilai = NILAI_HANTU[Math.min(rantai, NILAI_HANTU.length - 1)];
        rantai++;
        bonus += nilai;
        /* Jeda dipasang DI SINI, bukan sesudah gambar: `update()` membekukan
           seluruh dunia selama `beku` masih ada, termasuk pencacah rentan --
           persis seperti arcade, di mana waktu rentan tidak berjalan selama
           angka ditampilkan. */
        beku = BEKU_LAMA;
        angka = { r: h.r, c: h.c, nilai: nilai };
        audio.sound(1200, 2);
      } else {
        return true;
      }
    }
    return false;
  }

  // =========================================================================
  // Penggambaran
  // =========================================================================
  let lapisPelet, lapisTokoh;

  function gambarPelet() {
    while (lapisPelet.firstChild) lapisPelet.firstChild.remove();
    for (let r = 0; r < BAR; r++)
      for (let c = 0; c < 40; c++) {
        if (!pelet[r][c * 2]) continue;
        const besar = energi.has(r + ',' + c);
        lapisPelet.append(svgEl('circle', {
          cx: c * 2 * W + W / 2, cy: r * H + H / 2,
          r: besar ? 4 : 1.6,
          class: besar ? 'p-energi' : 'p-pelet'
        }));
      }
  }

  /* Bentuk Pac-Gal dibangun sebagai POLIGON, bukan busur SVG.

     Versi pertama memakai `A` dengan large-arc dan sweep flag, dan hasilnya tidak
     terbaca sebagai Pac-Man: dengan jari-jari kecil, satu bendera yang salah
     mengubah lingkaran-berpotong jadi irisan pizza, dan bedanya sulit dilihat
     sampai diperbesar. Dua puluh delapan ruas menghasilkan lingkaran yang mulus
     pada ukuran ini dan tidak punya bendera yang bisa salah sama sekali. */
  function jalurPac(rr, bukaDeg) {
    const a = bukaDeg * Math.PI / 180;
    const n = 28;
    const titik = ['M 0 0'];
    for (let i = 0; i <= n; i++) {
      const t = a + (2 * Math.PI - 2 * a) * i / n;
      titik.push('L ' + (rr * Math.cos(t)).toFixed(2) + ' ' + (rr * Math.sin(t)).toFixed(2));
    }
    titik.push('Z');
    return titik.join(' ');
  }

  function gambarTokoh() {
    while (lapisTokoh.firstChild) lapisTokoh.firstChild.remove();

    const px = pemain.c * 2 * W + W / 2, py = pemain.r * H + H / 2;
    const sudut = Math.atan2(pemain.dr, pemain.dc) * 180 / Math.PI;
    /* Sudut mulut tidak pernah di bawah 12 derajat: pada jari-jari 7 piksel,
       celah 4 derajat hampir tak terlihat dan Pac-Gal terbaca sebagai lingkaran
       polos di separuh bingkainya. */
    const buka = [12, 26, 42, 26][tik % 4];
    lapisTokoh.append(svgEl('path', {
      d: jalurPac(7, buka), class: 'p-pemain',
      transform: 'translate(' + px + ',' + py + ') rotate(' + sudut + ')'
    }));

    hantu.forEach(h => {
      const x = h.c * 2 * W + W / 2, y = h.r * H + H / 2;
      const kelas = 'p-hantu'
        + (h.dimakan ? ' is-dimakan' : (h.takut > 0 ? ' is-takut' : ''));
      const g = svgEl('g', {
        class: kelas, 'data-watak': h.watak,
        transform: 'translate(' + x + ',' + y + ')'
      });
      if (!h.dimakan) {
        g.append(svgEl('path', {
          d: 'M-6.5,4.5 L-6.5,-1 A6.5,6.5 0 0 1 6.5,-1 L6.5,4.5 '
            + 'L4.3,2.4 L2.2,4.5 L0,2.4 L-2.2,4.5 L-4.3,2.4 Z',
          class: 'p-hantu__badan'
        }));
      }
      // Mata selalu digambar -- hantu yang dimakan tinggal sepasang mata yang
      // pulang ke kandang, dan itu yang memberi tahu pemain ia sedang aman.
      const mx = h.dc * 0.9, my = h.dr * 0.9;
      [-2.3, 2.3].forEach(dx => {
        g.append(svgEl('circle', { cx: dx, cy: -1.4, r: 1.7, class: 'p-hantu__mata' }));
        g.append(svgEl('circle', {
          cx: dx + mx, cy: -1.4 + my, r: 0.8, class: 'p-hantu__pupil'
        }));
      });
      lapisTokoh.append(g);
    });

    // Angka bonus, digambar di atas hantu yang baru saja dimakan.
    if (angka) {
      const t = svgEl('text', {
        x: angka.c * 2 * W + W / 2, y: angka.r * H + H / 2 + 4,
        class: 'p-nilai', 'text-anchor': 'middle'
      });
      t.textContent = angka.nilai;
      lapisTokoh.append(t);
    }
  }

  function segarkanHud() {
    $('s-pelet').textContent = sisa;
    $('s-nyawa').textContent = '●'.repeat(Math.max(0, nyawa));
    $('s-takut').textContent = takut ? takut + ' giliran' : '—';
    /* `I12%` ditampilkan supaya nolnya bisa dilihat sendiri, bukan cuma dibaca
       di dokumen. Itu satu-satunya cara panel ini jujur soal temuan yang
       melahirkannya. */
    tulis('s-i12', modeAsli() ? i12.toFixed(3) + (i12 === 0 ? ' — tak pernah kejar' : '') : '—');
    const k = $('ket-asli');
    if (k) k.textContent = modeAsli()
      ? 'jalan lurus + undian kejar, sasaran sama untuk keempatnya'
      : 'mati = watak Pac-Man 1980';
    $('s-mode').textContent = modeAsli() ? 'PAC-GAL asli'
      : hantu.some(h => h.takut > 0) ? 'rentan'
      : modeSekarang() === 'sebar' ? 'menyebar' : 'mengejar';
    $('s-tik').textContent = tik;
    tulis('s-bonus', bonus);
  }

  // =========================================================================
  // Gelung
  // =========================================================================
  let langkahKe = 0;

  function update(dt) {
    /* Membeku sesudah hantu dimakan. Diperiksa PALING AWAL supaya `langkahKe`
       tidak ikut menumpuk -- kalau tidak, begitu jeda usai dunia akan melompat
       beberapa langkah sekaligus. */
    if (beku > 0) {
      beku -= dt;
      if (beku <= 0) { beku = 0; angka = null; gambarTokoh(); }
      return;
    }
    langkahKe += dt;
    if (langkahKe < PER_LANGKAH) return;
    langkahKe = 0;
    tik++;
    gerakPemain();
    if (cekTabrakan()) return kalahNyawa();
    gerakHantu();
    if (cekTabrakan()) return kalahNyawa();
    if (takut > 0) takut--;
    if (sisa <= 0) return selesai('Menang — 468 pelet habis');
    gambarPelet(); gambarTokoh(); segarkanHud();
  }

  function kalahNyawa() {
    nyawa--; i12Mati();
    audio.play('mbl8t255o4fego3abcdefgo0l1g-g');
    if (nyawa <= 0) return selesai('Kalah — semua nyawa habis');
    reset(false);
    gambarPelet(); gambarTokoh(); segarkanHud();
  }

  function selesai(pesan) {
    mainLoop.stop();
    $('go').textContent = 'Main lagi';
    $('go').disabled = false;
    // Bonus disebut di pesan penutup, jadi ia harus digabung SEBELUM toast-nya
    // menyala -- bukan sesudah, seperti tambalan pertama yang keliru.
    if (bonus > 0) pesan += ' · bonus hantu ' + bonus;
    ui.toast(pesan);
    const rekor = db.get('rekor', 0);
    const skor = META.pelet - sisa;
    if (skor > rekor) db.set('rekor', skor);
    $('s-rekor').textContent = Math.max(rekor, skor);
    gambarPelet(); gambarTokoh(); segarkanHud();
  }

  function mulai() {
    reset(true);
    gambarPelet(); gambarTokoh(); segarkanHud();
    $('go').textContent = 'Berjalan';
    $('go').disabled = true;
    mainLoop.start();
  }

  // =========================================================================
  // Pemasangan
  // =========================================================================
  $('topbar-host').append(ui.topbar({
    title: 'Pac-Gal',
    source: 'PAC-GAL.EXE · Al J. Jiménez · Mei 1982 · dibongkar dari EXE',
    backHref: '../../index.html'
  }));

  const svg = svgEl('svg', {
    viewBox: '0 0 ' + (KOL * W) + ' ' + (BAR * H),
    class: 'p-svg', role: 'img',
    'aria-label': 'Labirin Pac-Gal, ' + META.pelet + ' pelet'
  });
  svg.append(gambarLabirin());
  lapisPelet = svgEl('g', { class: 'p-lapis-pelet' });
  lapisTokoh = svgEl('g', { class: 'p-lapis-tokoh' });
  svg.append(lapisPelet, lapisTokoh);
  $('layar').append(svg);

  mainLoop = loop({ update, hz: 60 });

  const TOMBOL = {
    ArrowUp: 0, ArrowDown: 1, ArrowLeft: 2, ArrowRight: 3,
    w: 0, s: 1, a: 2, d: 3, W: 0, S: 1, A: 2, D: 3
  };
  window.addEventListener('keydown', (e) => {
    const i = TOMBOL[e.key];
    if (i === undefined) return;
    e.preventDefault();
    pemain.ndr = ARAH[i][0]; pemain.ndc = ARAH[i][1];
  });

  /* Mengganti mode di tengah permainan dibiarkan: justru di situ bedanya paling
     terasa, karena hantu yang sedang mengepung mendadak berjalan lurus. */
  const sak = $('t-asli');
  if (sak) sak.addEventListener('change', segarkanHud);

  $('go').addEventListener('click', mulai);

  // Gambar pertama dipanggil LANGSUNG: rAF tidak berjalan di tab latar belakang.
  reset(true);
  gambarPelet(); gambarTokoh(); segarkanHud();
  $('s-rekor').textContent = db.get('rekor', 0);
})();
