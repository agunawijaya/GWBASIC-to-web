/* ===========================================================================
   zot-kamar.js — bentuk SVG untuk ruangan-ruangan WIZARD dan TEMPLE.

   Aslinya tiap kamar adalah SATU HURUF: . E U D P C G F W S O B M V T ?
   (baris 9470-9550, kolom kedua tiap pasangan DATA). Itu bukan pilihan
   estetis melainkan kendala: peta 8x8 harus muat di layar teks bersama
   sisa antarmukanya, dan satu kamar hanya kebagian satu aksara.

   Kendalanya sudah hilang, jadi tiap huruf digambar. Yang TIDAK berubah:
   hurufnya tetap ditampilkan di pojok tiap petak, karena huruf itulah
   bahasa yang dipakai layar bantuan di baris 3700-3740 — dan pemain lama
   membaca peta dengan huruf, bukan dengan gambar.

   Semua ditulis tangan di dalam <symbol> berkotak 100x100 lalu dipakai
   lewat <use>, pola yang sama dengan `_shared/svg.js` dan armada STARTREK.

   Catatan yang dibayar mahal di sesi 28: JANGAN memakai backtick di dalam
   template literal ini, dan jangan menamai gradien sama dengan simbol —
   ruang nama `id` di dokumen SVG cuma satu untuk semua jenis elemen.

   Peringatan itu ditulis lebih dulu, DAN KESALAHANNYA TETAP TERJADI: versi
   pertama berkas ini memberi nama `zot-bola`, `zot-lubang`, dan `zot-warp`
   kepada gradien SEKALIGUS simbolnya, ketiganya. Yang menangkapnya bukan
   ingatan melainkan sebuah pemeriksa enam baris yang menghitung id ganda
   sebelum halamannya dibuka sama sekali. Peringatan tidak mencegah apa pun;
   pemeriksaan mencegahnya.
   =========================================================================== */
(function (global) {
  'use strict';

  const DEFS = `
<defs>
  <linearGradient id="zot-batu" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2a2f3d"/><stop offset="1" stop-color="#171b26"/>
  </linearGradient>
  <linearGradient id="zot-emas" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffe9a8"/><stop offset=".45" stop-color="#e0a72a"/>
    <stop offset="1" stop-color="#8a5c06"/>
  </linearGradient>
  <linearGradient id="zot-kayu" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9c6b3a"/><stop offset="1" stop-color="#4e3319"/>
  </linearGradient>
  <linearGradient id="zot-baja" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#6d7789"/><stop offset=".4" stop-color="#c8d2e0"/>
    <stop offset="1" stop-color="#5b6373"/>
  </linearGradient>
  <radialGradient id="zot-air" cx="50%" cy="45%" r="55%">
    <stop offset="0" stop-color="#8fe6ff"/><stop offset=".6" stop-color="#2f7fb8"/>
    <stop offset="1" stop-color="#123a5c"/>
  </radialGradient>
  <radialGradient id="zot-gBola" cx="38%" cy="34%" r="66%">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".28" stop-color="#c9b6ff"/>
    <stop offset=".7" stop-color="#7a54d8"/><stop offset="1" stop-color="#2c1b60"/>
  </radialGradient>
  <radialGradient id="zot-gLubang" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#000000"/><stop offset=".55" stop-color="#0a0d16"/>
    <stop offset="1" stop-color="#2a2f3d"/>
  </radialGradient>
  <radialGradient id="zot-gWarp" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".22" stop-color="#7ff0d8"/>
    <stop offset=".62" stop-color="#1e8f8f" stop-opacity=".8"/>
    <stop offset="1" stop-color="#0b3040" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="zot-api" cx="50%" cy="60%" r="55%">
    <stop offset="0" stop-color="#fff6d8"/><stop offset=".35" stop-color="#ffb03a"/>
    <stop offset=".75" stop-color="#e0491c"/><stop offset="1" stop-color="#7a1a08" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="zot-permata" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#7ef0c8"/>
    <stop offset=".7" stop-color="#1e9f8f"/><stop offset="1" stop-color="#0c4a52"/>
  </linearGradient>
  <linearGradient id="zot-jubah" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#6b4aa0"/><stop offset="1" stop-color="#2c1b52"/>
  </linearGradient>
  <linearGradient id="zot-kulit" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7a4a3a"/><stop offset="1" stop-color="#3a2018"/>
  </linearGradient>
  <filter id="zot-nyala" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="3" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>

  <!-- ============ . kamar kosong ============ -->
  <symbol id="zot-kosong" viewBox="0 0 100 100">
    <g fill="#3a4152" opacity=".75">
      <circle cx="50" cy="50" r="4"/>
    </g>
  </symbol>

  <!-- ============ E pintu masuk / keluar ============ -->
  <symbol id="zot-pintu" viewBox="0 0 100 100">
    <path d="M26 84 V44 A24 24 0 0 1 74 44 V84 Z" fill="#12172a"
          stroke="url(#zot-batu)" stroke-width="7"/>
    <path d="M34 84 V46 A16 16 0 0 1 66 46 V84 Z" fill="#0a0d16"/>
    <g filter="url(#zot-nyala)">
      <path d="M38 84 V48 A12 12 0 0 1 62 48 V84 Z" fill="#ffe9a8" opacity=".55"/>
    </g>
    <rect x="20" y="82" width="60" height="7" rx="2" fill="url(#zot-batu)"/>
  </symbol>

  <!-- ============ U tangga naik ============ -->
  <symbol id="zot-naik" viewBox="0 0 100 100">
    <g fill="url(#zot-baja)" stroke="#2a2f3d" stroke-width="2">
      <rect x="18" y="72" width="64" height="12"/>
      <rect x="27" y="58" width="55" height="12"/>
      <rect x="36" y="44" width="46" height="12"/>
      <rect x="45" y="30" width="37" height="12"/>
    </g>
    <path d="M28 26 L38 12 L48 26 Z" fill="#8ef0b0" filter="url(#zot-nyala)"/>
  </symbol>

  <!-- ============ D tangga turun ============ -->
  <symbol id="zot-turun" viewBox="0 0 100 100">
    <g fill="url(#zot-baja)" stroke="#2a2f3d" stroke-width="2">
      <rect x="18" y="30" width="64" height="12"/>
      <rect x="27" y="44" width="55" height="12"/>
      <rect x="36" y="58" width="46" height="12"/>
      <rect x="45" y="72" width="37" height="12"/>
    </g>
    <path d="M28 76 L38 90 L48 76 Z" fill="#ffb03a" filter="url(#zot-nyala)"/>
  </symbol>

  <!-- ============ P kolam ============ -->
  <symbol id="zot-kolam" viewBox="0 0 100 100">
    <ellipse cx="50" cy="56" rx="36" ry="26" fill="url(#zot-batu)"/>
    <ellipse cx="50" cy="54" rx="29" ry="20" fill="url(#zot-air)"/>
    <g fill="none" stroke="#cdeeff" stroke-width="1.6" opacity=".65">
      <ellipse cx="50" cy="52" rx="14" ry="9"/>
      <ellipse cx="50" cy="52" rx="21" ry="14"/>
    </g>
    <circle cx="43" cy="46" r="2.4" fill="#ffffff" opacity=".8"/>
  </symbol>

  <!-- ============ C peti ============ -->
  <symbol id="zot-peti" viewBox="0 0 100 100">
    <path d="M20 48 A30 22 0 0 1 80 48 V52 H20 Z" fill="url(#zot-kayu)"
          stroke="#2a1a0c" stroke-width="2"/>
    <rect x="20" y="52" width="60" height="30" rx="3" fill="url(#zot-kayu)"
          stroke="#2a1a0c" stroke-width="2"/>
    <g fill="url(#zot-emas)" stroke="#5a3c08" stroke-width="1.2">
      <rect x="18" y="48" width="64" height="7" rx="2"/>
      <rect x="44" y="56" width="12" height="16" rx="2"/>
    </g>
    <circle cx="50" cy="64" r="2.6" fill="#2a1a0c"/>
  </symbol>

  <!-- ============ G emas ============ -->
  <symbol id="zot-emasKamar" viewBox="0 0 100 100">
    <g fill="url(#zot-emas)" stroke="#6d4a10" stroke-width="1.4">
      <ellipse cx="38" cy="70" rx="16" ry="7"/>
      <ellipse cx="62" cy="70" rx="16" ry="7"/>
      <ellipse cx="50" cy="60" rx="16" ry="7"/>
      <ellipse cx="42" cy="50" rx="13" ry="6"/>
      <ellipse cx="59" cy="46" rx="11" ry="5"/>
    </g>
    <g fill="#fff6d0" opacity=".8">
      <circle cx="46" cy="49" r="1.8"/><circle cx="61" cy="45" r="1.5"/>
    </g>
  </symbol>

  <!-- ============ F suar ============ -->
  <symbol id="zot-suar" viewBox="0 0 100 100">
    <rect x="45" y="46" width="10" height="42" rx="3" fill="url(#zot-kayu)"
          stroke="#2a1a0c" stroke-width="1.5"/>
    <g filter="url(#zot-nyala)">
      <path d="M50 8 C62 26 66 34 66 42 A16 16 0 0 1 34 42 C34 34 38 26 50 8 Z"
            fill="url(#zot-api)"/>
    </g>
    <path d="M50 24 C56 34 58 38 58 42 A8 8 0 0 1 42 42 C42 38 44 34 50 24 Z"
          fill="#fff6d8" opacity=".9"/>
  </symbol>

  <!-- ============ W warp ============ -->
  <symbol id="zot-warp" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="42" fill="url(#zot-gWarp)"/>
    <g fill="none" stroke="#bff7ea" stroke-width="3" stroke-linecap="round" opacity=".9">
      <path d="M50 18 A32 32 0 0 1 82 50"/>
      <path d="M50 30 A20 20 0 0 0 30 50"/>
      <path d="M50 42 A8 8 0 0 1 58 50"/>
    </g>
    <circle cx="50" cy="50" r="5" fill="#ffffff" filter="url(#zot-nyala)"/>
  </symbol>

  <!-- ============ S lubang ============ -->
  <symbol id="zot-lubang" viewBox="0 0 100 100">
    <ellipse cx="50" cy="56" rx="38" ry="28" fill="url(#zot-batu)"/>
    <ellipse cx="50" cy="56" rx="30" ry="21" fill="url(#zot-gLubang)"/>
    <g fill="none" stroke="#4a5266" stroke-width="1.6" opacity=".8">
      <path d="M22 50 L14 42"/><path d="M78 50 L86 42"/>
      <path d="M40 30 L36 20"/><path d="M62 30 L66 20"/>
    </g>
  </symbol>

  <!-- ============ O bola kristal ============ -->
  <symbol id="zot-bola" viewBox="0 0 100 100">
    <path d="M30 84 L70 84 L64 74 L36 74 Z" fill="url(#zot-kayu)"
          stroke="#2a1a0c" stroke-width="1.6"/>
    <circle cx="50" cy="46" r="30" fill="url(#zot-gBola)" filter="url(#zot-nyala)"/>
    <ellipse cx="40" cy="35" rx="9" ry="6" fill="#ffffff" opacity=".55"
             transform="rotate(-28 40 35)"/>
  </symbol>

  <!-- ============ B buku ============ -->
  <symbol id="zot-buku" viewBox="0 0 100 100">
    <path d="M50 30 C38 22 24 22 14 26 V76 C24 72 38 72 50 80 Z"
          fill="#e8e2d0" stroke="#6b5a3a" stroke-width="2"/>
    <path d="M50 30 C62 22 76 22 86 26 V76 C76 72 62 72 50 80 Z"
          fill="#f4efe0" stroke="#6b5a3a" stroke-width="2"/>
    <path d="M50 30 V80" stroke="#6b5a3a" stroke-width="2.4"/>
    <g stroke="#a89878" stroke-width="1.4" opacity=".85">
      <path d="M22 38 H42"/><path d="M22 47 H42"/><path d="M22 56 H40"/>
      <path d="M58 38 H78"/><path d="M58 47 H78"/><path d="M60 56 H78"/>
    </g>
  </symbol>

  <!-- ============ M monster ============ -->
  <symbol id="zot-monster" viewBox="0 0 100 100">
    <path d="M26 34 L18 12 L34 22 Z" fill="url(#zot-kulit)" stroke="#231310" stroke-width="1.6"/>
    <path d="M74 34 L82 12 L66 22 Z" fill="url(#zot-kulit)" stroke="#231310" stroke-width="1.6"/>
    <path d="M50 20 C70 20 82 36 82 54 C82 74 68 86 50 86 C32 86 18 74 18 54
             C18 36 30 20 50 20 Z" fill="url(#zot-kulit)" stroke="#231310" stroke-width="2"/>
    <g fill="#ffd12e" filter="url(#zot-nyala)">
      <ellipse cx="38" cy="50" rx="7" ry="5.5"/><ellipse cx="62" cy="50" rx="7" ry="5.5"/>
    </g>
    <g fill="#2a0d08">
      <ellipse cx="38" cy="50" rx="2.4" ry="4"/><ellipse cx="62" cy="50" rx="2.4" ry="4"/>
    </g>
    <path d="M34 68 Q50 80 66 68 Q58 74 50 74 Q42 74 34 68 Z" fill="#2a0d08"/>
    <g fill="#fff4e0">
      <path d="M40 69 L43 75 L46 69 Z"/><path d="M54 69 L57 75 L60 69 Z"/>
    </g>
  </symbol>

  <!-- ============ V pedagang ============ -->
  <symbol id="zot-pedagang" viewBox="0 0 100 100">
    <path d="M50 22 C64 22 72 34 72 48 L76 86 H24 L28 48 C28 34 36 22 50 22 Z"
          fill="url(#zot-jubah)" stroke="#1c1130" stroke-width="2"/>
    <path d="M50 22 C62 22 70 32 70 44 C62 38 56 36 50 36 C44 36 38 38 30 44
             C30 32 38 22 50 22 Z" fill="#3d2870"/>
    <ellipse cx="50" cy="50" rx="12" ry="10" fill="#1a1030"/>
    <g fill="#ffd76a" filter="url(#zot-nyala)">
      <circle cx="45" cy="50" r="2.2"/><circle cx="55" cy="50" r="2.2"/>
    </g>
    <path d="M70 58 L88 52 L92 74 L74 80 Z" fill="url(#zot-kayu)"
          stroke="#2a1a0c" stroke-width="1.6"/>
    <circle cx="83" cy="64" r="4" fill="url(#zot-emas)"/>
  </symbol>

  <!-- ============ T harta ============ -->
  <symbol id="zot-harta" viewBox="0 0 100 100">
    <path d="M50 14 L78 38 L50 88 L22 38 Z" fill="url(#zot-permata)"
          stroke="#0a3a3a" stroke-width="2" filter="url(#zot-nyala)"/>
    <g fill="none" stroke="#eafff8" stroke-width="1.6" opacity=".85">
      <path d="M22 38 H78"/><path d="M50 14 L38 38 L50 88 L62 38 Z"/>
    </g>
    <path d="M38 26 L46 20 L44 32 Z" fill="#ffffff" opacity=".85"/>
  </symbol>

  <!-- ============ ? belum terlihat ============ -->
  <symbol id="zot-tanya" viewBox="0 0 100 100">
    <text x="50" y="70" text-anchor="middle" font-size="62" font-weight="700"
          font-family="ui-monospace,monospace" fill="#39415a">?</text>
  </symbol>
</defs>`;

  /* Kode kamar 1..34 -> simbol + huruf peta (kolom kedua DATA 9470-9550). */
  const KAMAR = {
    1:  ['zot-kosong',    '.', 'kamar kosong'],
    2:  ['zot-pintu',     'E', 'pintu masuk / keluar'],
    3:  ['zot-naik',      'U', 'tangga naik'],
    4:  ['zot-turun',     'D', 'tangga turun'],
    5:  ['zot-kolam',     'P', 'kolam'],
    6:  ['zot-peti',      'C', 'peti'],
    7:  ['zot-emasKamar', 'G', 'keping emas'],
    8:  ['zot-suar',      'F', 'suar'],
    9:  ['zot-warp',      'W', 'warp'],
    10: ['zot-lubang',    'S', 'lubang'],
    11: ['zot-bola',      'O', 'bola kristal'],
    12: ['zot-buku',      'B', 'buku'],
    25: ['zot-pedagang',  'V', 'pedagang'],
    34: ['zot-tanya',     '?', 'belum terlihat']
  };
  for (let q = 13; q <= 24; q++) KAMAR[q] = ['zot-monster', 'M', 'monster'];
  for (let q = 26; q <= 33; q++) KAMAR[q] = ['zot-harta', 'T', 'harta'];

  global.RETRO = global.RETRO || {};
  global.RETRO.ZOT_ART = { DEFS, KAMAR };
})(window);
