/* ===========================================================================
   pictures.js — gambar bawaan untuk mode gambar.

   Semuanya SVG yang digambar tangan, bukan bitmap. Alasannya:
     - 3–8 KB per gambar, bukan ratusan KB
     - tajam di ukuran layar mana pun, termasuk saat papan diperbesar
     - tidak butuh berkas terpisah, jadi tetap jalan dari file://

   Tiap gambar digambar dalam ruang koordinat 402×402 — sama persis dengan
   viewBox papan — sehingga potongan tiap ubin bisa diambil hanya dengan
   menggeser gambar itu ke posisi yang berlawanan. Lihat `sliceOf()` di
   15puzzle.js.

   Warna di sini sengaja LITERAL, bukan variabel tema: ini karya gambar, bukan
   komponen antarmuka. Sebuah bulan tetap kelabu di tema terang maupun gelap.

   Menambah gambar baru: cukup tambahkan satu objek ke array di bawah. Tidak ada
   kode lain yang perlu disentuh — itulah gunanya menaruh gambar sebagai data.
   =========================================================================== */
window.RETRO = window.RETRO || {};

window.RETRO.PUZZLE_PICTURES = [

/* ---------------------------------------------------------------- 1. BULAN */
{
  id: 'moon',
  name: 'Pendaratan di Bulan',
  hint: 'Bumi, kawah, dan modul pendarat',
  svg: `
  <defs>
    <radialGradient id="pm-sky" cx="70%" cy="18%" r="95%">
      <stop offset="0" stop-color="#16233d"/><stop offset="1" stop-color="#04060d"/>
    </radialGradient>
    <radialGradient id="pm-earth" cx="34%" cy="30%" r="72%">
      <stop offset="0" stop-color="#7fc4ff"/><stop offset=".55" stop-color="#2a6fc4"/>
      <stop offset="1" stop-color="#0d2f5e"/>
    </radialGradient>
    <linearGradient id="pm-ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b9b2a6"/><stop offset="1" stop-color="#5d574d"/>
    </linearGradient>
    <radialGradient id="pm-halo" cx="50%" cy="50%" r="50%">
      <stop offset=".6" stop-color="#6fb4ff" stop-opacity=".35"/>
      <stop offset="1" stop-color="#6fb4ff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="402" height="402" fill="url(#pm-sky)"/>

  <g fill="#ffffff">
    <circle cx="28"  cy="34"  r="2.2"/><circle cx="96"  cy="18"  r="1.4"/>
    <circle cx="150" cy="52"  r="1.8"/><circle cx="212" cy="26"  r="1.2"/>
    <circle cx="58"  cy="96"  r="1.6"/><circle cx="128" cy="112" r="1.1"/>
    <circle cx="24"  cy="152" r="1.9"/><circle cx="188" cy="140" r="1.3"/>
    <circle cx="356" cy="180" r="1.7"/><circle cx="300" cy="212" r="1.2"/>
    <circle cx="86"  cy="188" r="1.4"/><circle cx="248" cy="88"  r="1.6"/>
    <circle cx="376" cy="52"  r="1.3"/><circle cx="164" cy="196" r="1.5"/>
    <circle cx="40"  cy="228" r="1.2"/><circle cx="222" cy="168" r="1.1"/>
    <circle cx="118" cy="66"  r="2.4" opacity=".9"/>
    <circle cx="330" cy="118" r="2"   opacity=".8"/>
  </g>

  <circle cx="300" cy="86" r="86" fill="url(#pm-halo)"/>
  <circle cx="300" cy="86" r="54" fill="url(#pm-earth)"/>
  <g fill="#3f9c5a" opacity=".92">
    <path d="M268 60 q18 -10 34 -2 q10 6 4 16 q-14 10 -30 4 q-12 -6 -8 -18Z"/>
    <path d="M296 104 q22 -8 34 4 q6 10 -6 16 q-20 8 -32 -4 q-6 -10 4 -16Z"/>
    <path d="M262 96 q10 -4 16 6 q2 10 -8 12 q-12 0 -12 -10Z"/>
  </g>
  <circle cx="300" cy="86" r="54" fill="none" stroke="#9fd8ff"
          stroke-opacity=".45" stroke-width="2"/>

  <path d="M0 268 q64 -26 122 -14 q58 12 108 -6 q56 -20 172 6 v148 H0Z"
        fill="url(#pm-ground)"/>
  <g fill="#4a463d" opacity=".55">
    <ellipse cx="64"  cy="326" rx="46" ry="15"/>
    <ellipse cx="196" cy="368" rx="62" ry="19"/>
    <ellipse cx="330" cy="312" rx="38" ry="13"/>
    <ellipse cx="268" cy="292" rx="22" ry="8"/>
    <ellipse cx="118" cy="386" rx="34" ry="11"/>
  </g>
  <g fill="#d6cfc2" opacity=".5">
    <ellipse cx="64"  cy="322" rx="46" ry="14"/>
    <ellipse cx="196" cy="363" rx="62" ry="18"/>
    <ellipse cx="330" cy="308" rx="38" ry="12"/>
  </g>

  <g transform="translate(150,206) scale(.62)">
    <g stroke="#9aa5b1" stroke-width="7" stroke-linecap="round" fill="none">
      <path d="M22 66 L-16 128"/><path d="M118 66 L156 128"/>
    </g>
    <ellipse cx="-16" cy="131" rx="15" ry="5" fill="#b6c0cb"/>
    <ellipse cx="156" cy="131" rx="15" ry="5" fill="#b6c0cb"/>
    <path d="M18 42 L122 42 L140 66 L122 92 L18 92 L0 66 Z" fill="#e8c96b"
          stroke="#7a6222" stroke-width="2"/>
    <path d="M18 42 L122 42 L122 92 L18 92Z" fill="#000" opacity=".12"/>
    <path d="M30 0 L110 0 L124 40 L16 40 Z" fill="#cfd8e2"
          stroke="#5c6672" stroke-width="2"/>
    <path d="M44 10 L96 10 L104 30 L36 30 Z" fill="#16303f"/>
    <path d="M44 10 L96 10 L92 18 L48 18 Z" fill="#7fd3ff" opacity=".55"/>
    <path d="M58 92 L82 92 L74 116 L66 116 Z" fill="#9aa5b1"/>
  </g>

  <g transform="translate(300,232)">
    <path d="M0 0 v-64" stroke="#c9d2dc" stroke-width="4"/>
    <path d="M2 -64 h44 l-8 12 8 12 h-44Z" fill="#d0453c"/>
  </g>`
},

/* ---------------------------------------------------------------- 2. KUCING */
{
  id: 'cat',
  name: 'Kucing',
  hint: 'Karakter orisinal, bergaya datar',
  svg: `
  <defs>
    <linearGradient id="pc-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd7a3"/><stop offset="1" stop-color="#f2a25c"/>
    </linearGradient>
    <linearGradient id="pc-fur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8f7f74"/><stop offset="1" stop-color="#5f544c"/>
    </linearGradient>
    <radialGradient id="pc-eye" cx="35%" cy="30%" r="70%">
      <stop offset="0" stop-color="#c9f36b"/><stop offset="1" stop-color="#5d8c1d"/>
    </radialGradient>
  </defs>

  <rect width="402" height="402" fill="url(#pc-bg)"/>
  <g fill="#ffffff" opacity=".22">
    <circle cx="52"  cy="58"  r="26"/><circle cx="352" cy="46"  r="18"/>
    <circle cx="368" cy="330" r="30"/><circle cx="36"  cy="352" r="22"/>
    <circle cx="196" cy="30"  r="14"/>
  </g>

  <path d="M74 402 q28 -96 127 -96 q99 0 127 96Z" fill="url(#pc-fur)"/>
  <path d="M150 402 q26 -58 51 -58 q25 0 51 58Z" fill="#efe4d8" opacity=".85"/>

  <path d="M92 148 L74 44 L162 96 Z" fill="url(#pc-fur)"/>
  <path d="M310 148 L328 44 L240 96 Z" fill="url(#pc-fur)"/>
  <path d="M104 142 L92 72 L150 104 Z" fill="#e79ba6"/>
  <path d="M298 142 L310 72 L252 104 Z" fill="#e79ba6"/>

  <ellipse cx="201" cy="200" rx="118" ry="104" fill="url(#pc-fur)"/>

  <g fill="#4a4139" opacity=".55">
    <path d="M168 108 q10 -22 20 -2 q-10 8 -20 2Z"/>
    <path d="M201 100 q10 -24 20 -2 q-10 8 -20 2Z"/>
    <path d="M234 108 q10 -22 20 -2 q-10 8 -20 2Z"/>
    <path d="M96 216 q-24 6 -26 22 q18 -8 26 -22Z"/>
    <path d="M306 216 q24 6 26 22 q-18 -8 -26 -22Z"/>
  </g>

  <g>
    <ellipse cx="152" cy="188" rx="30" ry="34" fill="url(#pc-eye)"/>
    <ellipse cx="250" cy="188" rx="30" ry="34" fill="url(#pc-eye)"/>
    <ellipse cx="152" cy="188" rx="10" ry="30" fill="#151310"/>
    <ellipse cx="250" cy="188" rx="10" ry="30" fill="#151310"/>
    <circle cx="143" cy="174" r="7.5" fill="#fff" opacity=".92"/>
    <circle cx="241" cy="174" r="7.5" fill="#fff" opacity=".92"/>
    <circle cx="159" cy="204" r="3.5" fill="#fff" opacity=".55"/>
    <circle cx="257" cy="204" r="3.5" fill="#fff" opacity=".55"/>
  </g>

  <path d="M186 240 L216 240 L201 258 Z" fill="#e79ba6"
        stroke="#8e5560" stroke-width="1.5"/>
  <path d="M201 258 v12" stroke="#3f382f" stroke-width="3.5"/>
  <path d="M201 270 q-20 20 -38 4" fill="none" stroke="#3f382f"
        stroke-width="3.5" stroke-linecap="round"/>
  <path d="M201 270 q20 20 38 4" fill="none" stroke="#3f382f"
        stroke-width="3.5" stroke-linecap="round"/>

  <g stroke="#efe4d8" stroke-width="3" stroke-linecap="round" opacity=".9">
    <path d="M126 244 L44 228"/><path d="M126 254 L48 262"/>
    <path d="M126 264 L52 292"/>
    <path d="M276 244 L358 228"/><path d="M276 254 L354 262"/>
    <path d="M276 264 L350 292"/>
  </g>`
},

/* ------------------------------------------------------------- 3. PC 1982 */
{
  id: 'pc',
  name: 'PC 1982',
  hint: 'Monitor fosfor, disket, dan papan ketik',
  svg: `
  <defs>
    <linearGradient id="pp-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b3440"/><stop offset="1" stop-color="#151b23"/>
    </linearGradient>
    <linearGradient id="pp-desk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a6a45"/><stop offset="1" stop-color="#5a442b"/>
    </linearGradient>
    <linearGradient id="pp-case" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#d9d2c2"/><stop offset=".5" stop-color="#efe9db"/>
      <stop offset="1" stop-color="#b9b2a2"/>
    </linearGradient>
    <radialGradient id="pp-phos" cx="50%" cy="42%" r="72%">
      <stop offset="0" stop-color="#123f2b"/><stop offset="1" stop-color="#04120b"/>
    </radialGradient>
    <pattern id="pp-scan" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="2" fill="#000" opacity=".3"/>
    </pattern>
  </defs>

  <rect width="402" height="402" fill="url(#pp-wall)"/>
  <rect y="286" width="402" height="116" fill="url(#pp-desk)"/>
  <path d="M0 286 H402" stroke="#3d2f1d" stroke-width="3"/>
  <g stroke="#6b5335" stroke-width="1.4" opacity=".5">
    <path d="M0 312 H402"/><path d="M0 344 H402"/><path d="M0 376 H402"/>
  </g>

  <rect x="66" y="40" width="236" height="188" rx="18" fill="url(#pp-case)"
        stroke="#8b8474" stroke-width="2"/>
  <rect x="88" y="60" width="192" height="132" rx="10" fill="url(#pp-phos)"
        stroke="#0a0f14" stroke-width="3"/>
  <g font-family="ui-monospace,Consolas,monospace" font-size="13" fill="#4ef08a">
    <text x="100" y="84">Ok</text>
    <text x="100" y="104">LOAD "15PUZZLE"</text>
    <text x="100" y="124">RUN</text>
    <text x="100" y="150">The 15 Puzzle</text>
    <text x="100" y="172">_</text>
  </g>
  <rect x="88" y="60" width="192" height="132" rx="10" fill="url(#pp-scan)"/>
  <circle cx="286" cy="212" r="5" fill="#4ef08a" opacity=".85"/>
  <rect x="150" y="228" width="68" height="18" fill="#c4bdad"/>
  <rect x="126" y="246" width="116" height="12" rx="4" fill="#b0a998"/>

  <rect x="300" y="196" width="92" height="62" rx="6" fill="url(#pp-case)"
        stroke="#8b8474" stroke-width="2"/>
  <rect x="312" y="212" width="68" height="12" rx="2" fill="#4a4438"/>
  <rect x="312" y="234" width="68" height="12" rx="2" fill="#4a4438"/>
  <circle cx="384" cy="204" r="3" fill="#d0453c"/>

  <g transform="translate(38,300)">
    <rect width="120" height="118" rx="4" fill="#2a2f36" stroke="#171b21"
          stroke-width="2"/>
    <rect x="26" y="10" width="68" height="42" rx="2" fill="#c9c2b2"/>
    <rect x="40" y="10" width="40" height="30" fill="#3b414a"/>
    <circle cx="60" cy="82" r="16" fill="#3b414a"/>
    <circle cx="60" cy="82" r="6" fill="#1b1f25"/>
    <rect x="14" y="104" width="92" height="6" rx="3" fill="#454b54"/>
  </g>

  <g transform="translate(178,318)">
    <rect width="204" height="72" rx="8" fill="url(#pp-case)"
          stroke="#8b8474" stroke-width="2"/>
    <g fill="#8f887a">
      <rect x="10" y="10" width="16" height="12" rx="2"/>
      <rect x="30" y="10" width="16" height="12" rx="2"/>
      <rect x="50" y="10" width="16" height="12" rx="2"/>
      <rect x="70" y="10" width="16" height="12" rx="2"/>
      <rect x="90" y="10" width="16" height="12" rx="2"/>
      <rect x="110" y="10" width="16" height="12" rx="2"/>
      <rect x="130" y="10" width="16" height="12" rx="2"/>
      <rect x="150" y="10" width="16" height="12" rx="2"/>
      <rect x="170" y="10" width="24" height="12" rx="2"/>
      <rect x="14" y="28" width="16" height="12" rx="2"/>
      <rect x="34" y="28" width="16" height="12" rx="2"/>
      <rect x="54" y="28" width="16" height="12" rx="2"/>
      <rect x="74" y="28" width="16" height="12" rx="2"/>
      <rect x="94" y="28" width="16" height="12" rx="2"/>
      <rect x="114" y="28" width="16" height="12" rx="2"/>
      <rect x="134" y="28" width="16" height="12" rx="2"/>
      <rect x="154" y="28" width="40" height="12" rx="2"/>
      <rect x="44" y="48" width="116" height="12" rx="3"/>
    </g>
  </g>`
}
];
