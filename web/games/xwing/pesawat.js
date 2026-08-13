/* ===========================================================================
   pesawat.js — gambar untuk XWING.

   TIGA SUMBER YANG BERBEDA, DAN ITU DISENGAJA
   -------------------------------------------
   0. SPRITE PENERBANGAN dipulihkan dari MAKRO DRAW (baris 1330/1530/1760),
      bukan dari larik angka. Itu yang benar-benar Anda lawan. Lihat blok
      IM/DV/DS di bawah.

   1. ANIMASI LINTAS memakai piksel 1978 dari larik. Baris 1350-1520 XWING.BAS
      menyimpan sprite sebagai larik GET/PUT GW-BASIC yang ditulis langsung
      sebagai bilangan bulat bertanda 16-bit:

          1350 DIM IM4(13):IM4(0)=22:IM4(1)=7:IM4(2)=128:IM4(3)=-32760: ...

      Dua kata pertama adalah lebar-dalam-bit dan tinggi; sisanya data
      piksel, dua bit per piksel (SCREEN 1 = CGA 320x200 empat warna), tiap
      baris dibulatkan ke bita penuh. Dibongkar, IM4 dan IM5 ternyata TIE
      fighter dari depan — dan bentuk itulah yang dipakai selama sasarannya
      masih jauh, piksel demi piksel, bukan digambar ulang.

      TAPI TIDAK KELIMANYA. IM7 keluar sebagai transpose-nya (bilah mendatar,
      bukan tegak), IM6 cuma terisi 22 dari 45 elemen, dan untuk IM8 ketiga
      angkanya — lebar 50, tinggi 29, DIM 102 — tidak konsisten satu sama
      lain: kepalanya menuntut 207 bita, DIM-nya menyediakan 206. Tiga dari
      lima tidak dipakai. Rinciannya di docs/xwing.md §4.

   2. TIE JARAK DEKAT dan X-WING PEMAINNYA digambar tangan sebagai SVG.
      Untuk X-Wing itu memang tidak ada pilihan lain: di
      aslinya pesawat pemain TIDAK PERNAH TERGAMBAR sama sekali — layarnya
      pandangan dari kokpit, dan yang ada cuma HUD. Jadi tidak ada yang bisa
      dibongkar. Gambar ini memenuhi janji yang ditulis di `svg-demo.html`
      sejak fondasi dibangun: "X-Wing (untuk XWING.BAS)".
   =========================================================================== */
(function (global) {
  'use strict';

  /* ======================================================================
     Sprite musuh, dibongkar dari IM4 / IM5 / IM7.

     Kelimanya (IM4..IM8) dipakai baris 3320-3470 sebagai animasi zoom lima
     bingkai, tiap bingkai dipisah `PLAY "P4"` — jeda musik yang jadi
     pengatur waktunya. Tiga yang di bawah ini terbaca bersih pada lebar
     baris yang baku; dua sisanya tidak, dan itu dicatat di dokumen alih-alih
     ditebak.
     ====================================================================== */
  const TIE = {
    /* IM4 — 11 x 7 piksel, bingkai terjauh. Dua bilah TEGAK di kiri dan
       kanan, penghubung MENDATAR di tengah: TIE fighter dari depan. */
    kecil: [
      '10000000001', '10000000001', '10000000001', '11111111111',
      '10000000001', '10000000001', '10000000001'],
    /* IM5 — 13 x 9. Bentuk yang sama, satu langkah lebih dekat. */
    sedang: [
      '1000000000001', '1000000000001', '1000000000001', '1000000000001',
      '1111111111111', '1000000000001', '1000000000001', '1000000000001',
      '1000000000001'],
    /* IM7 — 15 x 21, dan DI SINILAH masalahnya: bilahnya MENDATAR di atas
       dan bawah, penghubungnya TEGAK. Itu transpose dari IM4/IM5, bukan
       pembesarannya. Sprite ini TIDAK dipakai di permainan — ia dipajang
       sebagai barang bukti. Alasannya di docs/xwing.md §4. */
    miring: [
      '001111111111111', '010000000000010', '111111111111100',
      '000000101000000', '000000101000000', '000000101000000',
      '000000101000000', '000000101000000', '000000101000000',
      '000000110100000', '000000101000000', '000001011000000',
      '000000101000000', '000000101000000', '000000101000000',
      '000000101000000', '000000101000000', '000000101000000',
      '001111101111111', '010000110000010', '111111111111100']
  };

  /** Ubah peta bit jadi <rect> — satu per piksel yang menyala. */
  function sprite(peta, ukuran, warna) {
    const h = peta.length, w = peta[0].length;
    let s = '';
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        if (peta[y][x] === '1')
          s += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + ukuran +
           '" height="' + Math.round(ukuran * h / w) +
           '" shape-rendering="crispEdges" fill="' + (warna || '#8ef0ff') +
           '" aria-hidden="true">' + s + '</svg>';
  }

  /* ======================================================================
     GAMBAR SEBAGAI BAHASA — sprite yang benar-benar Anda lawan saat terbang.

     Selama beberapa jam saya kira musuhnya IM4..IM8. Bukan. Baris 1340
     mengatakannya sendiri:

         DIM IM(6):DIM IM1(6):DIM IM2(6):DIM IM3(6)
         GET (145,59)-(145,59),IM  : GET (155,58)-(157,60),IM2
         GET (167,57)-(173,61),IM3

     Sprite penerbangan di-GET dari LAYAR — dari gambar yang baru saja dilukis
     makro DRAW di baris 1330, 1530, 1760 dan 1770. Jadi bentuknya tidak
     disimpan sebagai angka melainkan sebagai BAHASA:

         "C2;BM145,59;M+0,0;BM+10,1;M+0,-2;M+2,2;M+0,-2;BM+10,-1;M+0,4; ..."

     `M+0,0` menggambar garis dari titik sekarang ke titik sekarang — yaitu
     satu piksel. Program menggambar ketiga ukuran BERDAMPINGAN di layar judul
     (itulah gambar kecil di sebelah "IMPERIAL FIGHTER:"), lalu memotong tiap
     ukuran dengan GET. Layar judulnya sekaligus lembar sprite.

     Kesepuluh peta di bawah ini hasil menjalankan ulang makro itu dan
     memotong persis kotak yang sama. Perhatikan IM3: dua bilah TEGAK dan
     penghubung MENDATAR — orientasi yang sama dengan IM4/IM5, dan bukti
     ketiga bahwa IM7-lah yang menyimpang.

     DV3 bukan salinan IM3: keempat sudutnya dipangkas. Pesawat Vader memang
     berbeda bentuk, dan Blank menggambarnya berbeda — dalam tujuh kali lima
     piksel.
     ====================================================================== */
  const IM = [['1'], ['101', '111', '101'],
              ['1000001', '1000001', '1111111', '1000001', '1000001']];
  const DV = [['1'], ['101', '111', '101'],
              ['0100010', '1000001', '1111111', '1000001', '0100010']];
  const DS = [['1'], ['010', '111', '010'],
              ['0110', '1111', '1111', '0110'],
              ['0011100', '0111110', '1111111', '1111111', '1111111',
               '0111110', '0011100']];

  /* ======================================================================
     TIE fighter gambar tangan — dipakai saat sasaran sudah DEKAT.

     Kenapa tidak memakai IM7/IM8 saja untuk jarak dekat? Karena keduanya
     tidak bisa dipercaya (lihat TIE.miring di atas dan docs/xwing.md §4),
     dan membesar-besarkan bacaan yang meragukan sampai setinggi 190 piksel
     sama saja dengan menyajikan tebakan sebagai barang temuan.

     Jadi pembagiannya jelas dan disebutkan: PIKSEL ASLI selama sasaran masih
     kecil (IM4 lalu IM5, dua bacaan yang cocok satu sama lain), GAMBAR
     TANGAN begitu ia besar. Orientasinya sengaja mengikuti IM4/IM5 — bilah
     tegak, penghubung mendatar — supaya peralihannya tidak terasa loncat.

     Tanpa gradien sama sekali, dan itu disengaja: gambar ini ditempelkan
     sampai tiga kali di dalam satu SVG, dan `id` gradien yang kembar akan
     membuat salah satunya lenyap tanpa galat apa pun. Pelajaran sesi 28.
     ====================================================================== */
  const TIE_ISI = `
  <g stroke="#151a21" stroke-width="2.5" stroke-linejoin="round">
    <polygon points="46,10 84,44 84,176 46,210 8,176 8,44" fill="#39424e"/>
    <polygon points="214,10 176,44 176,176 214,210 252,176 252,44" fill="#39424e"/>
  </g>
  <g stroke="#59636f" stroke-width="2" fill="none" opacity=".9">
    <polygon points="46,26 72,50 72,170 46,194 20,170 20,50"/>
    <polygon points="214,26 188,50 188,170 214,194 240,170 240,50"/>
  </g>
  <g stroke="#4d5866" stroke-width="2.5">
    <path d="M46 26 V194 M20 50 L72 170 M72 50 L20 170"/>
    <path d="M214 26 V194 M188 50 L240 170 M240 50 L188 170"/>
  </g>
  <g fill="#2b333d" stroke="#151a21" stroke-width="2">
    <rect x="82" y="94" width="30" height="30" rx="3"/>
    <rect x="148" y="94" width="30" height="30" rx="3"/>
  </g>
  <g fill="#59636f"><rect x="86" y="100" width="22" height="4"/>
    <rect x="86" y="114" width="22" height="4"/>
    <rect x="152" y="100" width="22" height="4"/>
    <rect x="152" y="114" width="22" height="4"/></g>
  <circle cx="130" cy="110" r="38" fill="#4d5866" stroke="#151a21" stroke-width="2.5"/>
  <circle cx="130" cy="110" r="31" fill="#39424e"/>
  <g fill="#2b333d" stroke="#151a21" stroke-width="1.5">
    <polygon points="130,86 151,98 151,122 130,134 109,122 109,98"/>
  </g>
  <polygon points="130,92 146,101 146,119 130,128 114,119 114,101"
           fill="#10161d" stroke="currentColor" stroke-width="2.5"/>
  <g fill="#69737f">
    <circle cx="130" cy="76" r="3.2"/><circle cx="130" cy="144" r="3.2"/>
    <circle cx="101" cy="93" r="3.2"/><circle cx="159" cy="93" r="3.2"/>
    <circle cx="101" cy="127" r="3.2"/><circle cx="159" cy="127" r="3.2"/>
  </g>
  <g fill="#2b333d" stroke="#151a21" stroke-width="1.5">
    <rect x="115" y="146" width="7" height="18" rx="2"/>
    <rect x="138" y="146" width="7" height="18" rx="2"/>
  </g>
  <g fill="currentColor" opacity=".9">
    <rect x="116.5" y="162" width="4" height="5"/>
    <rect x="139.5" y="162" width="4" height="5"/>
  </g>`;

  const TIE_W = 260, TIE_H = 220;

  /* ======================================================================
     TIE ADVANCED x1 — pesawat Darth Vader.

     Bentuknya bukan karangan: DV3 yang dipulihkan dari makro DRAW memangkas
     KEEMPAT SUDUTNYA dibanding IM3, dan itu persis bagaimana sayap TIE
     Advanced terlihat dari depan — bilahnya MENYEMPIT ke arah lambung, bukan
     persegi seperti TIE biasa. Blank menyatakan perbedaan itu di dalam kanvas
     tujuh kali lima piksel; di sini perbedaan yang sama dinyatakan lebih
     leluasa, tapi tetap perbedaan yang sama.

     Aksen memakai `currentColor` supaya pemanggilnya yang menentukan warna —
     merah untuk Vader, biru untuk yang lain — tanpa satu pun `id` gradien.
     ====================================================================== */
  const TIE_ADV_ISI = `
  <g stroke="#141017" stroke-width="2.5" stroke-linejoin="round">
    <polygon points="8,22 92,64 92,156 8,198" fill="#2f2a34"/>
    <polygon points="272,22 188,64 188,156 272,198" fill="#2f2a34"/>
  </g>
  <g stroke="#5d5568" stroke-width="2" fill="none" opacity=".85">
    <polygon points="22,44 78,72 78,148 22,176"/>
    <polygon points="258,44 202,72 202,148 258,176"/>
  </g>
  <g stroke="#4a4353" stroke-width="2.5">
    <path d="M22 44 L78 148 M78 72 L22 176 M50 30 V190"/>
    <path d="M258 44 L202 148 M202 72 L258 176 M230 30 V190"/>
  </g>
  <g fill="#241f29" stroke="#141017" stroke-width="2">
    <rect x="88" y="94" width="30" height="32" rx="3"/>
    <rect x="162" y="94" width="30" height="32" rx="3"/>
  </g>
  <g fill="#5d5568"><rect x="92" y="100" width="22" height="4"/>
    <rect x="92" y="116" width="22" height="4"/>
    <rect x="166" y="100" width="22" height="4"/>
    <rect x="166" y="116" width="22" height="4"/></g>
  <path d="M140 60 L176 84 L176 136 L140 160 L104 136 L104 84 Z"
        fill="#453e4d" stroke="#141017" stroke-width="2.5"/>
  <path d="M140 70 L168 89 L168 131 L140 150 L112 131 L112 89 Z" fill="#332d3a"/>
  <polygon points="140,80 160,93 160,127 140,140 120,127 120,93"
           fill="#0e0b12" stroke="currentColor" stroke-width="2.5"/>
  <g fill="#7a7186">
    <circle cx="140" cy="52" r="3.4"/><circle cx="140" cy="168" r="3.4"/>
    <circle cx="108" cy="70" r="3.4"/><circle cx="172" cy="70" r="3.4"/>
    <circle cx="108" cy="150" r="3.4"/><circle cx="172" cy="150" r="3.4"/>
  </g>
  <g fill="#241f29" stroke="#141017" stroke-width="1.5">
    <rect x="122" y="164" width="8" height="20" rx="2"/>
    <rect x="150" y="164" width="8" height="20" rx="2"/>
  </g>
  <g fill="currentColor" opacity=".95">
    <rect x="123.5" y="181" width="5" height="6"/>
    <rect x="151.5" y="181" width="5" height="6"/>
  </g>`;

  const TIE_ADV_W = 280, TIE_ADV_H = 220;

  /* ======================================================================
     BINTANG KEMATIAN.

     Datar sepenuhnya — bulatannya dibentuk oleh lengkung terminator dan
     cincin tepi, bukan oleh gradien. Alasannya sama dengan di atas: gambar
     ini muncul di dua SVG berbeda dalam satu halaman, dan `id` gradien yang
     kembar akan membuat salah satunya lenyap TANPA GALAT APA PUN.

     Cawan superlaser sengaja diletakkan di kuadran kiri-atas, tidak di
     tengah: bola yang simetris sempurna terbaca sebagai lingkaran, bukan
     sebagai bola. Pelajaran yang sama dengan starbase di sesi 28, tempat dua
     percobaan gagal karena simetri empat sisinya, bukan karena kurang detail.
     ====================================================================== */
  const DS_ISI = `
  <circle cx="110" cy="110" r="100" fill="#5a646f" stroke="#20262d" stroke-width="3"/>
  <path d="M110 10 A100 100 0 0 1 110 210 A150 150 0 0 0 110 10 Z" fill="#3d454e"/>
  <path d="M110 10 A100 100 0 0 1 110 210 A118 118 0 0 0 110 10 Z"
        fill="#2b323a" opacity=".75"/>
  <g stroke="#454f5a" stroke-width="1.6" fill="none" opacity=".9">
    <path d="M18 78 A100 100 0 0 0 18 142"/>
    <path d="M46 34 A100 100 0 0 0 46 186"/>
    <path d="M78 15 A100 100 0 0 0 78 205"/>
    <path d="M142 15 A100 100 0 0 1 142 205"/>
    <path d="M12 96 H208 M12 124 H208"/>
  </g>
  <path d="M11 116 H209" stroke="#191e24" stroke-width="9"/>
  <path d="M11 113 H209" stroke="#79838f" stroke-width="2" opacity=".55"/>
  <g stroke="#333b44" stroke-width="1.4" fill="none" opacity=".8">
    <path d="M30 60 L60 74 M150 46 L176 62 M56 158 L92 172 M136 168 L172 150"/>
  </g>
  <circle cx="74" cy="70" r="31" fill="#2b323a" stroke="#20262d" stroke-width="2.5"/>
  <circle cx="74" cy="70" r="24" fill="#454f5a"/>
  <g stroke="#20262d" stroke-width="1.8">
    <path d="M74 46 V94 M50 70 H98 M57 53 L91 87 M91 53 L57 87"/>
  </g>
  <circle cx="74" cy="70" r="8.5" fill="#161b21"/>
  <circle cx="74" cy="70" r="5" fill="currentColor"/>
  <circle cx="110" cy="110" r="100" fill="none" stroke="#8b96a3"
          stroke-width="2.4" stroke-dasharray="150 480" stroke-dashoffset="60"
          opacity=".7"/>`;

  const DS_W = 220, DS_H = 220;

  /** Bungkus salah satu gambar di atas jadi SVG berdiri sendiri, untuk panel. */
  function kapal(isi, w, h, ukuran, warna) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + ukuran +
           '" height="' + Math.round(ukuran * h / w) + '" aria-hidden="true" ' +
           'style="color:' + (warna || '#8ef0ff') + '">' + isi + '</svg>';
  }
  function tie(ukuran, warna) {
    return kapal(TIE_ISI, TIE_W, TIE_H, ukuran, warna);
  }

  /* Ketiga musuh dalam satu bentuk, supaya pemanggilnya tidak perlu tahu
     ukuran kanvas masing-masing. */
  const ARMADA = {
    imp: { isi: TIE_ISI,     w: TIE_W,     h: TIE_H,     warna: '#8ef0ff' },
    dv:  { isi: TIE_ADV_ISI, w: TIE_ADV_W, h: TIE_ADV_H, warna: '#ff6a5a' },
    ds:  { isi: DS_ISI,      w: DS_W,      h: DS_H,      warna: '#ffd76a' }
  };

  /* ======================================================================
     X-Wing pemain — janji svg-demo.html, ditagih di sesi terakhir.
     ====================================================================== */
  const XWING = `
<svg viewBox="0 0 240 208" class="xw-kapal" role="img"
     aria-label="Pesawat tempur X-Wing dengan sayap terbuka">
  <defs>
    <linearGradient id="xw-badan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7f8b99"/><stop offset=".28" stop-color="#e9eef4"/>
      <stop offset=".62" stop-color="#cdd6e0"/><stop offset="1" stop-color="#6f7b88"/>
    </linearGradient>
    <linearGradient id="xw-sayapAtas" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c3cdd9"/><stop offset="1" stop-color="#8d99a7"/>
    </linearGradient>
    <linearGradient id="xw-sayapBawah" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a95a3"/><stop offset="1" stop-color="#aeb9c6"/>
    </linearGradient>
    <linearGradient id="xw-nacelle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b6c1cf"/><stop offset=".5" stop-color="#8a95a3"/>
      <stop offset="1" stop-color="#5f6a77"/>
    </linearGradient>
    <radialGradient id="xw-mesin" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#e8fbff"/><stop offset=".35" stop-color="#7fd7ff"/>
      <stop offset=".7" stop-color="#3fa9d8" stop-opacity=".85"/>
      <stop offset="1" stop-color="#12507a" stop-opacity="0"/>
    </radialGradient>
    <filter id="xw-nyala" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="3.4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- sayap, s-foil terbuka: dua di atas, dua di bawah -->
  <g stroke="#4e5863" stroke-width="1.1">
    <path d="M112 90 L20 36 L6 50 L104 102Z" fill="url(#xw-sayapAtas)"/>
    <path d="M128 90 L220 36 L234 50 L136 102Z" fill="url(#xw-sayapAtas)"/>
    <path d="M112 112 L20 168 L6 154 L104 100Z" fill="url(#xw-sayapBawah)"/>
    <path d="M128 112 L220 168 L234 154 L136 100Z" fill="url(#xw-sayapBawah)"/>
  </g>
  <!-- garis panel -->
  <g stroke="#5c6672" stroke-width=".8" opacity=".65" fill="none">
    <path d="M96 92 L34 56"/><path d="M80 96 L44 74"/>
    <path d="M144 92 L206 56"/><path d="M160 96 L196 74"/>
    <path d="M96 110 L34 148"/><path d="M80 106 L44 130"/>
    <path d="M144 110 L206 148"/><path d="M160 106 L196 130"/>
  </g>
  <!-- pita merah pengenal skuadron -->
  <g fill="#cf4238">
    <path d="M60 66 L74 74 L68 80 L54 72Z"/><path d="M180 66 L166 74 L172 80 L186 72Z"/>
    <path d="M60 138 L74 130 L68 124 L54 132Z"/><path d="M180 138 L166 130 L172 124 L186 132Z"/>
  </g>
  <!-- engsel s-foil -->
  <g fill="#66727f" stroke="#464f59" stroke-width=".9">
    <rect x="98" y="80" width="14" height="10" rx="3"/>
    <rect x="128" y="80" width="14" height="10" rx="3"/>
    <rect x="98" y="110" width="14" height="10" rx="3"/>
    <rect x="128" y="110" width="14" height="10" rx="3"/>
  </g>
  <!-- meriam ujung sayap -->
  <g fill="#5b6672" stroke="#3f4852" stroke-width=".8">
    <rect x="8" y="42" width="46" height="6" rx="3"/>
    <rect x="8" y="156" width="46" height="6" rx="3"/>
    <rect x="186" y="42" width="46" height="6" rx="3"/>
    <rect x="186" y="156" width="46" height="6" rx="3"/>
  </g>
  <g fill="#7d8895">
    <rect x="26" y="40" width="5" height="10" rx="1.5"/>
    <rect x="38" y="40" width="5" height="10" rx="1.5"/>
    <rect x="26" y="154" width="5" height="10" rx="1.5"/>
    <rect x="38" y="154" width="5" height="10" rx="1.5"/>
    <rect x="209" y="40" width="5" height="10" rx="1.5"/>
    <rect x="197" y="40" width="5" height="10" rx="1.5"/>
    <rect x="209" y="154" width="5" height="10" rx="1.5"/>
    <rect x="197" y="154" width="5" height="10" rx="1.5"/>
  </g>
  <g fill="#cf4238">
    <rect x="6" y="41" width="4" height="8" rx="1.5"/>
    <rect x="6" y="155" width="4" height="8" rx="1.5"/>
    <rect x="230" y="41" width="4" height="8" rx="1.5"/>
    <rect x="230" y="155" width="4" height="8" rx="1.5"/>
  </g>

  <!-- nacelle mesin -->
  <g stroke="#4e5863" stroke-width="1">
    <rect x="86" y="74" width="26" height="52" rx="11" fill="url(#xw-nacelle)"/>
    <rect x="128" y="74" width="26" height="52" rx="11" fill="url(#xw-nacelle)"/>
  </g>
  <g fill="#5f6a77" opacity=".8">
    <rect x="88" y="86" width="22" height="3"/><rect x="88" y="112" width="22" height="3"/>
    <rect x="130" y="86" width="22" height="3"/><rect x="130" y="112" width="22" height="3"/>
  </g>
  <!-- semburan mesin -->
  <g filter="url(#xw-nyala)">
    <ellipse cx="99" cy="128" rx="10" ry="6" fill="url(#xw-mesin)"/>
    <ellipse cx="141" cy="128" rx="10" ry="6" fill="url(#xw-mesin)"/>
  </g>

  <!-- badan: hidung runcing, kokpit, soket droid -->
  <path d="M120 6 C126 22 130 44 131 68 L131 150 C131 162 126 172 120 176
           C114 172 109 162 109 150 L109 68 C110 44 114 22 120 6 Z"
        fill="url(#xw-badan)" stroke="#4e5863" stroke-width="1.2"/>
  <path d="M120 6 C122 18 124 34 125 50 L115 50 C116 34 118 18 120 6 Z"
        fill="#aeb9c6" opacity=".85"/>
  <!-- larik sensor hidung -->
  <g stroke="#5c6672" stroke-width=".9" fill="none">
    <path d="M120 8 L120 30"/><path d="M116 24 L124 24"/>
  </g>
  <!-- kanopi -->
  <path d="M112 62 L128 62 L127 92 L113 92 Z" fill="#20303f"
        stroke="#4e5863" stroke-width="1"/>
  <path d="M114 66 L126 66 L125 78 L115 78 Z" fill="#4a7d9c" opacity=".7"/>
  <!-- soket droid astromekanik -->
  <circle cx="120" cy="104" r="7" fill="#2b3641" stroke="#4e5863" stroke-width="1"/>
  <circle cx="120" cy="104" r="4.4" fill="#6f7f8c"/>
  <circle cx="118.4" cy="102.4" r="1.5" fill="#cfe0ea" opacity=".8"/>
  <!-- greeble -->
  <g fill="#6f7b88" opacity=".85">
    <rect x="112" y="120" width="6" height="4" rx="1"/>
    <rect x="122" y="120" width="6" height="4" rx="1"/>
    <rect x="114" y="132" width="12" height="3" rx="1"/>
    <rect x="114" y="140" width="12" height="3" rx="1"/>
  </g>
</svg>`;

  global.RETRO = global.RETRO || {};
  global.RETRO.XW_ART = { TIE, IM, DV, DS, sprite, tie, kapal, ARMADA,
                          TIE_ISI, TIE_W, TIE_H,
                          TIE_ADV_ISI, TIE_ADV_W, TIE_ADV_H,
                          DS_ISI, DS_W, DS_H, XWING };
})(window);
