/* ===========================================================================
   armada.js — bentuk SVG untuk STARTREK.

   KENAPA BERKAS INI ADA
   ---------------------
   Versi pertama port ini menggambar kuadrannya dengan glif CP437 asli:
   `╠É╣` untuk Enterprise, `+☻+` untuk Klingon, `«⌂»` untuk starbase,
   ` ☼ ` untuk bintang. Itu setia — dan itu keliru.

   `docs/_fondasi.md` §2.3 menyatakannya dengan jelas: karakter kotak CP437
   adalah **kompromi, bukan pilihan estetis**. Kendalanya nyata (mode grafis
   CGA memakan 16 KB dari 64 KB, menulis karakter ke memori layar hampir
   gratis), kendalanya sudah hilang, dan penggantinya SVG. Menyalin glifnya
   apa adanya berarti menyalin kendalanya, bukan maksudnya.

   Yang sebenarnya dimaksud baris 1440-1500 adalah: *ini kapal, ini kapal
   musuh, ini stasiun, ini bintang*. Itu yang digambar di sini.

   BENTUKNYA
   ---------
   Semua ditulis tangan sebagai <path>/<ellipse>/<rect> di dalam <symbol>
   berkotak 100x100, lalu dipakai berkali-kali lewat <use>. Itu persis
   semangat `DIM FIG$(5,5)` di CRAZY8.BAS — satu sumber bentuk, banyak
   pemakaian — dan alasan yang sama yang dipakai `_shared/svg.js`.

   Glif aslinya tidak dibuang: ada saklar di halaman yang mengembalikannya,
   karena bentuk 1981 itu tetap bagian dari pelajarannya.
   =========================================================================== */
(function (global) {
  'use strict';

  /* ======================================================================
     Definisi bersama — gradien, filter, dan empat simbol.
     ====================================================================== */
  const DEFS = `
<defs>
  <!-- ===================== langit ===================== -->
  <radialGradient id="tr-langit" cx="50%" cy="42%" r="78%">
    <stop offset="0"   stop-color="#0d1830"/>
    <stop offset=".55" stop-color="#070d1c"/>
    <stop offset="1"   stop-color="#03060e"/>
  </radialGradient>
  <radialGradient id="tr-nebula" cx="50%" cy="50%" r="50%">
    <stop offset="0"   stop-color="#3a6ea8" stop-opacity=".30"/>
    <stop offset=".6"  stop-color="#2b4a86" stop-opacity=".12"/>
    <stop offset="1"   stop-color="#1b2a55" stop-opacity="0"/>
  </radialGradient>

  <!-- ===================== Enterprise ===================== -->
  <!-- Lambung utama: logam terang dengan tepi yang meredup, supaya
       cakramnya terbaca sebagai piringan dan bukan lingkaran datar. -->
  <linearGradient id="tr-lambung" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"   stop-color="#7c8794"/>
    <stop offset=".30" stop-color="#eef3f8"/>
    <stop offset=".58" stop-color="#cfd8e2"/>
    <stop offset="1"   stop-color="#6c7684"/>
  </linearGradient>
  <linearGradient id="tr-lambung2" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"   stop-color="#68727f"/>
    <stop offset=".38" stop-color="#c6cfda"/>
    <stop offset="1"   stop-color="#5b6572"/>
  </linearGradient>
  <radialGradient id="tr-bussard" cx="50%" cy="50%" r="50%">
    <stop offset="0"   stop-color="#fff1e2"/>
    <stop offset=".30" stop-color="#ff9d5a"/>
    <stop offset=".70" stop-color="#e4442a"/>
    <stop offset="1"   stop-color="#7d1a10"/>
  </radialGradient>
  <linearGradient id="tr-warp" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"   stop-color="#123a63"/>
    <stop offset=".45" stop-color="#7fd8ff"/>
    <stop offset="1"   stop-color="#1b5c8e"/>
  </linearGradient>
  <radialGradient id="tr-deflektor" cx="50%" cy="50%" r="50%">
    <stop offset="0"   stop-color="#fff6d0"/>
    <stop offset=".5"  stop-color="#f0b429"/>
    <stop offset="1"   stop-color="#8a5c06"/>
  </radialGradient>

  <!-- ===================== Klingon =====================
       CATATAN: nama gradien di sini sengaja diberi awalan "tr-g".
       Versi pertama memakai "tr-klingon" untuk gradien DAN untuk <symbol>,
       dan akibatnya kapal Klingon tidak tergambar sama sekali: "href" di
       <use> menemukan gradiennya lebih dulu, dan sebuah gradien tidak
       menggambar apa pun. Tidak ada galat, tidak ada peringatan — cuma sel
       kosong. Ruang nama "id" di sebuah dokumen SVG itu SATU, dan itu
       berlaku untuk semua jenis elemen sekaligus. -->
  <linearGradient id="tr-gKlingon" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"   stop-color="#39472f"/>
    <stop offset=".30" stop-color="#93a37f"/>
    <stop offset=".60" stop-color="#6a7a58"/>
    <stop offset="1"   stop-color="#2e3a26"/>
  </linearGradient>
  <linearGradient id="tr-gKlingon2" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="#8a9a74"/>
    <stop offset="1"   stop-color="#3b482f"/>
  </linearGradient>
  <radialGradient id="tr-gKlingonMesin" cx="50%" cy="50%" r="50%">
    <stop offset="0"   stop-color="#e8ffe9"/>
    <stop offset=".35" stop-color="#7cff9a"/>
    <stop offset=".75" stop-color="#1f9d4d" stop-opacity=".8"/>
    <stop offset="1"   stop-color="#0a3d20" stop-opacity="0"/>
  </radialGradient>

  <!-- ===================== starbase ===================== -->
  <linearGradient id="tr-basis" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0"   stop-color="#f6dfa4"/>
    <stop offset=".42" stop-color="#c99a34"/>
    <stop offset="1"   stop-color="#6d4a10"/>
  </linearGradient>
  <linearGradient id="tr-basis2" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="#ffeec4"/>
    <stop offset="1"   stop-color="#a87c22"/>
  </linearGradient>

  <!-- ===================== bintang ===================== -->
  <radialGradient id="tr-korona" cx="50%" cy="50%" r="50%">
    <stop offset="0"    stop-color="#ffffff" stop-opacity=".95"/>
    <stop offset=".18"  stop-color="#fff3cf" stop-opacity=".75"/>
    <stop offset=".42"  stop-color="#ffcf7a" stop-opacity=".30"/>
    <stop offset="1"    stop-color="#ff9a3c" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="tr-koronaB" cx="50%" cy="50%" r="50%">
    <stop offset="0"    stop-color="#ffffff" stop-opacity=".95"/>
    <stop offset=".18"  stop-color="#e6f1ff" stop-opacity=".75"/>
    <stop offset=".42"  stop-color="#9ec8ff" stop-opacity=".30"/>
    <stop offset="1"    stop-color="#4f8fe0" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="tr-koronaM" cx="50%" cy="50%" r="50%">
    <stop offset="0"    stop-color="#fff4ec" stop-opacity=".95"/>
    <stop offset=".18"  stop-color="#ffd2b0" stop-opacity=".75"/>
    <stop offset=".42"  stop-color="#ff9a72" stop-opacity=".30"/>
    <stop offset="1"    stop-color="#c0442c" stop-opacity="0"/>
  </radialGradient>

  <!-- ===================== filter ===================== -->
  <filter id="tr-nyala" x="-90%" y="-90%" width="280%" height="280%">
    <feGaussianBlur stdDeviation="2.2" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="tr-nyalaBesar" x="-120%" y="-120%" width="340%" height="340%">
    <feGaussianBlur stdDeviation="5" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>

  <!-- =====================================================================
       USS ENTERPRISE — kelas Constitution, dilihat dari atas, haluan ke atas.

       Bagian yang membuatnya bisa dikenali sengaja dipertahankan, karena
       itulah yang membuat sebuah gambar bercerita:
         - cakram utama dengan kubah anjungan dan cincin geladak
         - leher dorsal yang menyempit ke lambung teknik
         - piring deflektor di haluan lambung teknik
         - dua tiang penopang yang menyapu ke belakang
         - dua nacelle dengan kolektor Bussard merah di depan dan
           kisi medan warp biru di sisi dalam
       ===================================================================== -->
  <symbol id="tr-enterprise" viewBox="0 0 100 100">
    <!-- tiang penopang: digambar PALING DULU supaya nacelle menutupinya, dan
         sengaja dibuat menyapu ke belakang — itu yang memberi kesan panjang -->
    <g stroke="#39424e" stroke-width="1" stroke-linejoin="round">
      <path d="M45.5 66 L31 60 L34 54.5 L48.5 61Z" fill="url(#tr-lambung2)"/>
      <path d="M54.5 66 L69 60 L66 54.5 L51.5 61Z" fill="url(#tr-lambung2)"/>
    </g>

    <!-- nacelle: panjang, ujung depan membulat, ujung belakang rata -->
    <g stroke="#39424e" stroke-width="1" stroke-linejoin="round">
      <path d="M20.5 47 A6.5 8 0 0 1 33.5 47 L33.5 92 L20.5 92 Z"
            fill="url(#tr-lambung)"/>
      <path d="M66.5 47 A6.5 8 0 0 1 79.5 47 L79.5 92 L66.5 92 Z"
            fill="url(#tr-lambung)"/>
    </g>

    <!-- lambung teknik: haluan membulat, buritan menyempit -->
    <path d="M50 53 C55.5 53 58.5 58 58.5 65 L57.5 84 C57.5 89 54 92 50 92
             C46 92 42.5 89 42.5 84 L41.5 65 C41.5 58 44.5 53 50 53 Z"
          fill="url(#tr-lambung)" stroke="#39424e" stroke-width="1"/>

    <!-- leher dorsal -->
    <path d="M45.8 44 L54.2 44 L53 58 L47 58 Z"
          fill="url(#tr-lambung2)" stroke="#39424e" stroke-width="1"/>

    <!-- cakram utama -->
    <ellipse cx="50" cy="28" rx="25.5" ry="23.5"
             fill="url(#tr-lambung)" stroke="#39424e" stroke-width="1.1"/>

    <!-- cincin geladak: elips sehaluan, bukan garis lurus, supaya
         kelengkungan piringannya terbaca -->
    <g fill="none" stroke="#8c98a6" stroke-width=".85" opacity=".75">
      <ellipse cx="50" cy="28" rx="19" ry="17.5"/>
      <ellipse cx="50" cy="28" rx="11" ry="10"/>
    </g>
    <!-- bank phaser di tepi cakram -->
    <g fill="#5b6672">
      <circle cx="50" cy="8"    r="1.4"/>
      <circle cx="33.5" cy="13" r="1.2"/>
      <circle cx="66.5" cy="13" r="1.2"/>
      <circle cx="25.5" cy="28" r="1.2"/>
      <circle cx="74.5" cy="28" r="1.2"/>
    </g>
    <!-- kubah anjungan -->
    <circle cx="50" cy="28" r="4.8" fill="#e7eef6" stroke="#5d6874" stroke-width=".9"/>
    <circle cx="48.5" cy="26.6" r="1.6" fill="#ffffff" opacity=".9"/>

    <!-- piring deflektor di haluan lambung teknik -->
    <ellipse cx="50" cy="61" rx="5.2" ry="3.6" fill="url(#tr-deflektor)"
             stroke="#6a5416" stroke-width=".8"/>
    <ellipse cx="50" cy="61" rx="2.2" ry="1.5" fill="#fff8de" opacity=".9"/>

    <!-- kolektor Bussard di ujung DEPAN tiap nacelle -->
    <g filter="url(#tr-nyala)">
      <circle cx="27" cy="47" r="5.4" fill="url(#tr-bussard)"/>
      <circle cx="73" cy="47" r="5.4" fill="url(#tr-bussard)"/>
    </g>
    <!-- kisi medan warp di sisi DALAM tiap nacelle -->
    <g filter="url(#tr-nyala)">
      <rect x="29.8" y="58" width="3.4" height="28" rx="1.7" fill="url(#tr-warp)"/>
      <rect x="66.8" y="58" width="3.4" height="28" rx="1.7" fill="url(#tr-warp)"/>
    </g>
    <!-- semburan mesin di buritan nacelle -->
    <g filter="url(#tr-nyala)" opacity=".85">
      <ellipse cx="27" cy="92" rx="5" ry="2" fill="#9fdcff"/>
      <ellipse cx="73" cy="92" rx="5" ry="2" fill="#9fdcff"/>
    </g>
    <!-- garis panel: sedikit saja, cuma untuk memberi skala -->
    <g stroke="#7d8794" stroke-width=".5" opacity=".55" fill="none">
      <path d="M44.5 68 L44.5 88"/><path d="M55.5 68 L55.5 88"/>
      <path d="M21 62 L33 62"/><path d="M67 62 L79 62"/>
      <path d="M21 76 L33 76"/><path d="M67 76 L79 76"/>
    </g>
  </symbol>

  <!-- =====================================================================
       KLINGON — kelas D7, haluan ke BAWAH.

       Arahnya sengaja dibalik terhadap Enterprise. Di layar 1981 kedua
       benda cuma tiga aksara dan tidak punya arah sama sekali; di sini
       arah yang berlawanan adalah cara tercepat mata membedakan kawan dan
       lawan, tanpa perlu warna saja yang bekerja.
       ===================================================================== -->
  <symbol id="tr-kapal-klingon" viewBox="0 0 100 100">
    <g stroke="#242c1e" stroke-width="1" stroke-linejoin="round">
      <!-- sayap: menyapu ke belakang (ke atas), dengan tepi belakang bergigi -->
      <path d="M50 44 L88 14 L96 26 L94 34 L58 54 Z" fill="url(#tr-gKlingon)"/>
      <path d="M50 44 L12 14 L4 26 L6 34 L42 54 Z"  fill="url(#tr-gKlingon)"/>
      <!-- nacelle di ujung sayap, sejajar sumbu kapal -->
      <path d="M4 12 A5.5 5.5 0 0 1 15 12 L15 38 L4 38 Z" fill="url(#tr-gKlingon2)"/>
      <path d="M85 12 A5.5 5.5 0 0 1 96 12 L96 38 L85 38 Z" fill="url(#tr-gKlingon2)"/>
      <!-- badan tengah -->
      <path d="M43 32 L57 32 L56 60 L44 60 Z" fill="url(#tr-gKlingon2)"/>
      <!-- leher panjang: ciri paling khas D7 -->
      <path d="M46.5 58 L53.5 58 L52.5 71 L47.5 71 Z" fill="url(#tr-gKlingon2)"/>
      <!-- kepala komando -->
      <ellipse cx="50" cy="80" rx="11.5" ry="10" fill="url(#tr-gKlingon)"/>
      <!-- sirip kecil di kepala -->
      <path d="M38 80 L31 77 L31 83 Z" fill="url(#tr-gKlingon2)"/>
      <path d="M62 80 L69 77 L69 83 Z" fill="url(#tr-gKlingon2)"/>
    </g>
    <!-- mesin menyala di ujung BELAKANG nacelle -->
    <g filter="url(#tr-nyala)">
      <circle cx="9.5"  cy="37" r="4.4" fill="url(#tr-gKlingonMesin)"/>
      <circle cx="90.5" cy="37" r="4.4" fill="url(#tr-gKlingonMesin)"/>
    </g>
    <!-- jendela anjungan + lampu haluan -->
    <rect x="45" y="75" width="10" height="2.2" rx="1.1" fill="#ffd76a"/>
    <g filter="url(#tr-nyala)"><circle cx="50" cy="88" r="2" fill="#ff5a4a"/></g>
    <!-- garis panel sayap -->
    <g stroke="#47543a" stroke-width=".6" opacity=".85" fill="none">
      <path d="M57 48 L88 32"/><path d="M54 41 L85 22"/>
      <path d="M43 48 L12 32"/><path d="M46 41 L15 22"/>
      <path d="M44 40 L56 40"/><path d="M44 50 L56 50"/>
    </g>
  </symbol>

  <!-- =====================================================================
       STARBASE — stasiun orbital: cincin dok, empat lengan, inti bertingkat.
       Warnanya amber, meneruskan warna glif «⌂» di layar aslinya.
       ===================================================================== -->
  <!-- =====================================================================
       STARBASE.

       Dua percobaan pertama gagal dengan cara yang sama: cincin tebal
       dengan empat jari-jari yang sama besar terbaca sebagai RODA KEMUDI,
       dan menambah detail justru memperkuatnya. Yang salah bukan detailnya
       melainkan SIMETRINYA — simetri empat lipat yang rapi adalah tanda
       benda BUATAN TANGAN, bukan bangunan.

       Jadi cincinnya dibuang. Yang tersisa: satu tiang dok panjang dengan
       enam tambatan, inti bersegi delapan, dua sayap panel surya, dan satu
       piring antena yang sengaja tidak simetris. Ketidaksimetrisan itulah
       yang membuatnya terbaca sebagai stasiun dalam sekali lihat.
       ===================================================================== -->
  <symbol id="tr-starbase" viewBox="0 0 100 100">
    <!-- sayap panel surya, kiri dan kanan -->
    <g stroke="#5d3f0d" stroke-width=".9">
      <rect x="4"  y="36" width="24" height="28" rx="2" fill="#16305c"/>
      <rect x="72" y="36" width="24" height="28" rx="2" fill="#16305c"/>
    </g>
    <g stroke="#3f6ba8" stroke-width=".7" opacity=".9">
      <path d="M10 36 V64 M16 36 V64 M22 36 V64"/>
      <path d="M78 36 V64 M84 36 V64 M90 36 V64"/>
      <path d="M4 45 H28 M4 55 H28 M72 45 H96 M72 55 H96"/>
    </g>
    <!-- lengan penopang sayap -->
    <g fill="url(#tr-basis2)" stroke="#5d3f0d" stroke-width=".9">
      <rect x="27" y="47.5" width="10" height="5" rx="1.6"/>
      <rect x="63" y="47.5" width="10" height="5" rx="1.6"/>
    </g>

    <!-- tiang dok: sumbu panjang stasiun -->
    <rect x="44" y="7" width="12" height="86" rx="4"
          fill="url(#tr-basis)" stroke="#4c3409" stroke-width="1.1"/>
    <!-- enam tambatan, tiga di tiap sisi, jaraknya TIDAK seragam -->
    <g fill="url(#tr-basis2)" stroke="#5d3f0d" stroke-width=".8">
      <rect x="36" y="13" width="8" height="4.5" rx="1.4"/>
      <rect x="36" y="26" width="8" height="4.5" rx="1.4"/>
      <rect x="36" y="72" width="8" height="4.5" rx="1.4"/>
      <rect x="56" y="17" width="8" height="4.5" rx="1.4"/>
      <rect x="56" y="68" width="8" height="4.5" rx="1.4"/>
      <rect x="56" y="80" width="8" height="4.5" rx="1.4"/>
    </g>
    <!-- pintu hanggar yang menyala di tiang -->
    <g fill="#ffe6a8" opacity=".95">
      <rect x="46.5" y="20" width="7" height="2.4" rx="1"/>
      <rect x="46.5" y="76" width="7" height="2.4" rx="1"/>
    </g>

    <!-- inti bersegi delapan -->
    <path d="M50 32 L61 36.5 L65.5 47.5 L61 58.5 L50 63 L39 58.5 L34.5 47.5 L39 36.5 Z"
          fill="url(#tr-basis)" stroke="#4c3409" stroke-width="1.2"/>
    <path d="M50 37 L57.5 40 L60.5 47.5 L57.5 55 L50 58 L42.5 55 L39.5 47.5 L42.5 40 Z"
          fill="url(#tr-basis2)" stroke="#4c3409" stroke-width=".9"/>
    <!-- dua deret jendela dek -->
    <g fill="#fff3cf">
      <circle cx="44" cy="43" r="1.2"/><circle cx="50" cy="41.6" r="1.2"/>
      <circle cx="56" cy="43" r="1.2"/>
      <circle cx="44" cy="52" r="1.2"/><circle cx="50" cy="53.4" r="1.2"/>
      <circle cx="56" cy="52" r="1.2"/>
    </g>
    <circle cx="50" cy="47.5" r="4" fill="#ffeec4" stroke="#8a5c06" stroke-width=".8"/>

    <!-- piring antena, sengaja hanya di SATU sisi -->
    <g stroke="#5d3f0d" stroke-width=".8">
      <path d="M34 34 L26 26" stroke="#a87c22" stroke-width="1.6"/>
      <ellipse cx="23.5" cy="23.5" rx="7" ry="5" transform="rotate(-45 23.5 23.5)"
               fill="url(#tr-basis2)"/>
      <path d="M23.5 23.5 L27 27" stroke="#6d4a10" stroke-width="1"/>
    </g>
    <!-- dua tiang komunikasi pendek -->
    <g stroke="#a87c22" stroke-width="1.4" stroke-linecap="round">
      <path d="M66 60 L74 68"/><path d="M40 66 L33 73"/>
    </g>

    <!-- lampu navigasi -->
    <g filter="url(#tr-nyala)">
      <circle cx="50" cy="6" r="2.2" fill="#8ef0b0"/>
      <circle cx="50" cy="94" r="2.2" fill="#ff6a5a"/>
      <circle cx="74.5" cy="68.5" r="1.6" fill="#ffc65a"/>
      <circle cx="32.5" cy="73.5" r="1.6" fill="#ffc65a"/>
    </g>
  </symbol>

  <!-- =====================================================================
       BINTANG — tiga warna, dipilih dari posisi selnya sendiri supaya
       kuadrannya beragam tapi tetap sama tiap kali digambar ulang.
       ===================================================================== -->
  <symbol id="tr-bintang-k" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#tr-korona)"/>
    <g stroke="#fff0c8" stroke-linecap="round" opacity=".55">
      <path d="M50 8 L50 92" stroke-width="1.6"/>
      <path d="M8 50 L92 50" stroke-width="1.6"/>
      <path d="M24 24 L76 76" stroke-width=".9"/>
      <path d="M76 24 L24 76" stroke-width=".9"/>
    </g>
    <circle cx="50" cy="50" r="11" fill="#fff8e0" filter="url(#tr-nyala)"/>
    <circle cx="50" cy="50" r="6"  fill="#ffffff"/>
  </symbol>
  <symbol id="tr-bintang-b" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#tr-koronaB)"/>
    <g stroke="#dcecff" stroke-linecap="round" opacity=".55">
      <path d="M50 10 L50 90" stroke-width="1.6"/>
      <path d="M10 50 L90 50" stroke-width="1.6"/>
      <path d="M26 26 L74 74" stroke-width=".9"/>
      <path d="M74 26 L26 74" stroke-width=".9"/>
    </g>
    <circle cx="50" cy="50" r="9.5" fill="#eef6ff" filter="url(#tr-nyala)"/>
    <circle cx="50" cy="50" r="5"   fill="#ffffff"/>
  </symbol>
  <symbol id="tr-bintang-m" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46" fill="url(#tr-koronaM)"/>
    <g stroke="#ffd2b0" stroke-linecap="round" opacity=".5">
      <path d="M50 14 L50 86" stroke-width="1.4"/>
      <path d="M14 50 L86 50" stroke-width="1.4"/>
    </g>
    <circle cx="50" cy="50" r="13" fill="#ffd9c0" filter="url(#tr-nyala)"/>
    <circle cx="50" cy="50" r="7"  fill="#fff1e6"/>
  </symbol>
</defs>`;

  /* ======================================================================
     Latar: medan bintang jauh yang TETAP untuk sebuah kuadran.

     Dibangkitkan dari nomor kuadran, bukan dari Math.random, karena kalau
     acak murni ia akan berkedip tiap kali layar digambar ulang — dan layar
     ini digambar ulang setiap perintah.
     ====================================================================== */
  function acakTetap(benih) {
    let s = benih | 0;
    return function () {
      s = (Math.imul(s ^ (s >>> 15), 0x2c1b3c6d) + 0x9e3779b9) | 0;
      return ((s >>> 8) & 0xffffff) / 0x1000000;
    };
  }

  function latar(q1, q2, lebar, tinggi) {
    const r = acakTetap(q1 * 8191 + q2 * 131 + 7);
    let s = '<rect width="' + lebar + '" height="' + tinggi + '" fill="url(#tr-langit)"/>';
    /* dua kabut samar, supaya latarnya tidak rata */
    for (let i = 0; i < 2; i++) {
      const cx = r() * lebar, cy = r() * tinggi, rr = (0.28 + r() * 0.22) * lebar;
      s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) +
           '" r="' + rr.toFixed(1) + '" fill="url(#tr-nebula)"/>';
    }
    /* bintang jauh: kecil, redup, dan diam */
    let t = '';
    for (let i = 0; i < 130; i++) {
      const x = r() * lebar, y = r() * tinggi;
      const rad = 0.5 + r() * 1.3;
      const o = 0.18 + r() * 0.6;
      t += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
           '" r="' + rad.toFixed(2) + '" opacity="' + o.toFixed(2) + '"/>';
    }
    return s + '<g fill="#dbe6ff">' + t + '</g>';
  }

  /* Bintang mana untuk sel mana — tetap, diturunkan dari koordinatnya. */
  const JENIS_BINTANG = ['tr-bintang-k', 'tr-bintang-b', 'tr-bintang-m',
                         'tr-bintang-k', 'tr-bintang-k', 'tr-bintang-b'];
  function bintangUntuk(q1, q2, i, j) {
    const h = Math.abs(Math.imul(q1 * 31 + q2 * 17 + i * 7 + j * 3, 0x45d9f3b)) >>> 8;
    return { simbol: JENIS_BINTANG[h % JENIS_BINTANG.length],
             skala: 0.72 + ((h >>> 5) % 40) / 100 };
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.TREK_ART = { DEFS, latar, bintangUntuk };
})(window);
