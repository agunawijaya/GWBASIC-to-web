/* ===========================================================================
   prizepics.js — ikon hadiah untuk mode gambar.

   Mengikuti pola `15puzzle/pictures.js`: gambar disimpan sebagai DATA, semuanya
   SVG yang digambar tangan, jadi tidak ada berkas terpisah dan tetap jalan
   dari file://.

   ------------------------------------------------------------------------
   KENAPA IKON PER KATEGORI, BUKAN PER HADIAH

   Ada delapan puluh hadiah. Menggambar delapan puluh ikon berarti delapan
   puluh gambar yang masing-masing dipakai rata-rata seperempat permainan —
   pekerjaan yang besar untuk hasil yang jarang terlihat.

   Yang dipakai di sini: sekitar dua puluh kategori, dan tiap hadiah dipetakan
   ke salah satunya. "WINNABAGO" dan "MOBILE HOME" berbagi ikon karavan;
   "COLOR TV" dan "B&W T-V" berbagi ikon televisi.

   ------------------------------------------------------------------------
   DAN KENAPA NAMANYA TETAP DITAMPILKAN

   Konsekuensi langsung dari keputusan di atas: dua hadiah BERBEDA bisa
   memakai ikon yang SAMA. Di permainan ingatan, itu fatal — pemain akan
   mengira dua kotak cocok padahal tidak, dan aturannya (yang membandingkan
   hadiah, bukan ikon) akan menolaknya tanpa penjelasan.

   Jadi mode gambar menampilkan IKON DI ATAS NAMA, bukan ikon menggantikan
   nama. Ikonnya mempercepat pengenalan dan membuat papannya terlihat seperti
   acara kuis; namanya yang tetap memutuskan.

   Ini berbeda dari 15PUZZLE, yang boleh mengganti angka dengan potongan
   gambar sepenuhnya — di sana tiap potongan memang unik.

   ------------------------------------------------------------------------
   TIGA TEMA

   Ketiganya memakai GEOMETRI YANG SAMA, dengan perlakuan berbeda:

     poster   bidang datar berwarna, bergaya papan hadiah acara kuis
     garis    garis saja, tanpa isian — paling ringan, paling terbaca kecil
     fosfor   monokrom hijau, mengikuti aksen retro koleksi ini

   Itu dinyatakan terus terang: ini bukan tiga set ikon, melainkan satu set
   dengan tiga perlakuan. Menggambar tiga set berarti tiga kali pekerjaan
   untuk perbedaan yang, pada ukuran 28px, nyaris tidak terlihat.

   Ikon memakai `currentColor` untuk garis dan kelas `p-f1`/`p-f2` untuk dua
   tingkat isian, sehingga tema cukup mengganti warna di CSS.
   =========================================================================== */
window.RETRO = window.RETRO || {};

/* Semua ikon digambar dalam ruang 24x24, dengan garis setebal 1,6 dan sudut
   membulat — supaya keduapuluhnya terlihat berasal dari satu tangan. */
window.RETRO.PRIZE_ICONS = {

  rumah: '<path class="p-f1" d="M3 11 12 4l9 7v9H3z"/><path d="M3 11 12 4l9 7"/>' +
         '<path class="p-f2" d="M10 20v-6h4v6z"/>',

  karavan: '<rect class="p-f1" x="2" y="7" width="15" height="9" rx="1.5"/>' +
           '<path class="p-f2" d="M17 10h3l2 3v3h-5z"/>' +
           '<circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',

  mobil: '<path class="p-f1" d="M3 15v-3l2-4h11l3 4h2v3z"/>' +
         '<path class="p-f2" d="M6.5 9h8l2 3H5.5z"/>' +
         '<circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',

  motor: '<circle cx="5.5" cy="16" r="4"/><circle cx="18.5" cy="16" r="4"/>' +
         '<path d="M5.5 16 10 9h5l3.5 7M9 9h5"/><path class="p-f2" d="M13 9h4l1 3h-6z"/>',

  sepeda: '<circle cx="5.5" cy="16" r="4.5"/><circle cx="18.5" cy="16" r="4.5"/>' +
          '<path d="M5.5 16 9 7h3l6.5 9M9 7h4M12 7l3 9"/>',

  /* Perahu: lambung sebagai busur dangkal, tiang tegak, dua layar segitiga
     yang TIDAK sama besar. Versi pertama memakai satu layar dan lambung
     lurus, dan pada 22px terbaca sebagai bendera di atas balok. Dua layar
     dengan ukuran berbeda adalah tanda paling murah bahwa ini kapal layar. */
  perahu: '<path class="p-f1" d="M2 17h20a6 6 0 0 1-5 4H7a6 6 0 0 1-5-4z"/>' +
          '<path d="M12 3v14"/>' +
          '<path class="p-f2" d="M13 5l6 10h-6z"/>' +
          '<path class="p-f2" d="M11 8 6 15h5z"/>',

  pesawat: '<path class="p-f1" d="M2 13 22 6l-3 6 3 6z"/><path d="M9 11v7l3-3"/>',

  tv: '<rect class="p-f1" x="2" y="5" width="16" height="12" rx="1.5"/>' +
      '<path class="p-f2" d="M5 8h10v6H5z"/>' +
      '<path d="M19 7v8M6 20h8"/><circle cx="20" cy="6" r="1"/>',

  radio: '<rect class="p-f1" x="2" y="8" width="20" height="11" rx="2"/>' +
         '<circle class="p-f2" cx="8" cy="13.5" r="3"/>' +
         '<path d="M14 11h5M14 14h5M14 17h3M17 8 20 3"/>',

  komputer: '<rect class="p-f1" x="2" y="4" width="15" height="10" rx="1.5"/>' +
            '<path class="p-f2" d="M5 7h9v4H5z"/>' +
            '<path d="M2 17h20v3H2zM17 8h5"/>',

  kaset: '<rect class="p-f1" x="2" y="6" width="20" height="12" rx="2"/>' +
         '<circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="12" r="2.5"/>' +
         '<path d="M8 12h8"/>',

  kamera: '<rect class="p-f1" x="2" y="7" width="20" height="12" rx="2"/>' +
          '<circle class="p-f2" cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1.6"/>' +
          '<path d="M8 7l1.5-3h5L16 7"/>',

  cincin: '<circle class="p-f1" cx="12" cy="15" r="6"/>' +
          '<path class="p-f2" d="m12 2 3 4-3 3-3-3z"/>',

  emas: '<path class="p-f1" d="M4 19h16l-2-6H6z"/><path class="p-f2" d="M7 13h10l-1.5-5h-7z"/>',

  uang: '<rect class="p-f1" x="2" y="6" width="20" height="12" rx="2"/>' +
        '<circle class="p-f2" cx="12" cy="12" r="3.5"/><path d="M12 8v8"/>',

  pakaian: '<path class="p-f1" d="M8 3 4 6l2 3 2-1v13h8V8l2 1 2-3-4-3-2 2h-4z"/>',

  tas: '<rect class="p-f1" x="3" y="8" width="18" height="12" rx="2"/>' +
       '<path d="M9 8V6a3 3 0 0 1 6 0v2M3 13h18"/>',

  makanan: '<path class="p-f1" d="M4 12a8 8 0 0 1 16 0z"/><path d="M2 15h20M4 18h16"/>',

  minuman: '<path class="p-f1" d="M7 3h10l-1 6a4 4 0 0 1-8 0z"/>' +
           '<path d="M12 15v5M9 21h6"/>',

  perabot: '<path class="p-f1" d="M2 16h20v4H2z"/>' +
           '<path class="p-f2" d="M4 16V7h7v9M13 16v-5h7v5"/>',

  mesin: '<rect class="p-f1" x="4" y="3" width="16" height="18" rx="2"/>' +
         '<circle class="p-f2" cx="12" cy="14" r="4.5"/><circle cx="12" cy="14" r="1.5"/>' +
         '<path d="M7 6.5h3"/>',

  alat: '<path class="p-f1" d="M14 3a5 5 0 0 0-4.6 7L3 16.4 6.6 20l6.4-6.4A5 5 0 0 0 20 9l-3 1-2-2 1-3z"/>',

  kolam: '<path class="p-f1" d="M2 13h20v7H2z"/>' +
         '<path d="M6 13V5a2 2 0 0 1 4 0M14 13V5a2 2 0 0 1 4 0M6 9h4M14 9h4"/>',

  olahraga: '<circle class="p-f1" cx="12" cy="12" r="9"/>' +
            '<path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18"/>',

  /* Hewan: jejak kaki, bukan siluet binatang tertentu.

     Versi pertama menggambar tupai — dan pada 22px ia terbaca sebagai gumpalan
     tanpa arti. Kategorinya sendiri berisi dua hal yang tidak mirip
     ("PET SQURRIEL" dan "TURKEY FARM"), jadi siluet apa pun akan salah untuk
     salah satunya. Jejak kaki benar untuk keduanya, dan bentuknya bertahan
     saat kecil karena ia cuma lima lingkaran. */
  hewan: '<ellipse class="p-f1" cx="12" cy="16" rx="5" ry="4.2"/>' +
         '<circle class="p-f2" cx="6" cy="11" r="2.1"/>' +
         '<circle class="p-f2" cx="10" cy="7" r="2.1"/>' +
         '<circle class="p-f2" cx="14" cy="7" r="2.1"/>' +
         '<circle class="p-f2" cx="18" cy="11" r="2.1"/>',

  buku: '<path class="p-f1" d="M3 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H3z"/>' +
        '<path class="p-f2" d="M21 4h-7a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7z"/>',

  sabun: '<rect class="p-f1" x="3" y="10" width="18" height="9" rx="4"/>' +
         '<path d="M8 7c0-1 1-2 1-3M13 6c0-1 1-2 1-3M18 7c0-1 1-2 1-3"/>',

  ban: '<circle class="p-f1" cx="12" cy="12" r="9"/><circle class="p-f2" cx="12" cy="12" r="4"/>' +
       '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>',

  /* Tiga kartu khusus. Sengaja BUKAN benda — mereka bukan hadiah, dan
     bentuknya harus mengatakan itu sebelum namanya dibaca. */
  wild: '<path class="p-f1" d="m12 2 2.9 6.2 6.8.9-5 4.7 1.3 6.7L12 17.3 6 20.5l1.3-6.7-5-4.7 6.8-.9z"/>',
  ambil: '<path class="p-f1" d="M4 12h12"/><path d="m11 7 5 5-5 5"/>' +
         '<path class="p-f2" d="M17 4h3v16h-3z"/>',
  lepas: '<path class="p-f1" d="M20 12H8"/><path d="m13 7-5 5 5 5"/>' +
         '<path class="p-f2" d="M4 4h3v16H4z"/>'
};

/* Peta hadiah -> kategori. Nama di sini HARUS sama persis dengan yang
   dibangkitkan dari DATA di match.js; apa pun yang tidak terdaftar jatuh ke
   ikon cadangan, jadi salah ketik tidak akan merusak papan — cuma membuat
   satu hadiah tampak polos. */
window.RETRO.PRIZE_CAT = {
  'COLOR TV': 'tv', 'B&W T-V': 'tv', 'BETAMAX': 'tv',
  'WINNABAGO': 'karavan', 'MOBILE HOME': 'karavan',
  'BRICK HOME': 'rumah',
  'SWISS WATCH': 'cincin', 'GOLD RING': 'cincin', 'DIAMOND RING': 'cincin',
  'SILVER BOWL': 'emas', 'OUNCE OF GOLD': 'emas',
  '$5000 CASH': 'uang', '$500 CASH': 'uang', '$1 CASH': 'uang',
  'IBM P.C.': 'komputer', 'DISK DRIVE': 'komputer', 'MX-80 PRINTER': 'komputer',
  'FRIENDLYWARE': 'komputer',
  'BYTE MAGAZINE': 'buku', 'ENCYCLOPEDIAS': 'buku',
  'TRIP TO MEXICO': 'pesawat', 'TRIP TO JAPAN': 'pesawat', 'DISNEY TRIP': 'pesawat',
  'OCEAN CRUISE': 'perahu', 'SPEED BOAT': 'perahu', 'SAIL BOAT': 'perahu',
  'MINK COAT': 'pakaian', 'NEW WARDROBE': 'pakaian', 'SILK SHEETS': 'pakaian',
  'TOUPEE': 'pakaian', 'BLOND WIG': 'pakaian',
  'LEATHER WALLET': 'tas', 'BRIEF CASE': 'tas',
  '10 SPEED BIKE': 'sepeda', 'MINI BIKE': 'motor', 'MOPED': 'motor',
  'MOTOR CYCLE': 'motor', 'SNOWMOBILE': 'motor',
  'VOLKSWAGEN': 'mobil', 'USED CAR': 'mobil', 'NEW TIRES': 'ban',
  'BOX OF BANANAS': 'makanan', 'SHRIMP DINNER': 'makanan', 'TV DINNER': 'makanan',
  'FROZEN PIZZA': 'makanan',
  'APPLE CIDER': 'minuman', 'JUG OF MILK': 'minuman', '6 PACK/COORS': 'minuman',
  'TAMPA NUGGET': 'minuman',
  'STEREO': 'radio', 'AM-FM RADIO': 'radio', 'CB-RADIO': 'radio',
  'CASSETTE TAPE': 'kaset',
  'MINOLTA CAMERA': 'kamera', 'ROLEX CAMERA': 'kamera',
  'BRASS BED': 'perabot', 'BEDROOM SET': 'perabot', 'PATIO SET': 'perabot',
  'WATER BED': 'perabot', 'BED LAMP': 'perabot',
  'SEWING MACHINE': 'mesin', 'DISHWASHER': 'mesin', 'WASHER': 'mesin',
  'DRYER': 'mesin', 'TIRED OVEN': 'mesin',
  'LAWN MOWER': 'alat', 'SKILL SAW': 'alat',
  'JACUZZI SPA': 'kolam', 'SWIMMING POOL': 'kolam', 'SWING SET': 'kolam',
  'GOLF CLUBS': 'olahraga', 'SURF BOARD': 'olahraga', 'WATER SKIS': 'olahraga',
  'SNORKEL & FINS': 'olahraga',
  'PET SQURRIEL': 'hewan', 'TURKEY FARM': 'hewan',
  'BAR OF SOAP': 'sabun',
  'WILD CARD': 'wild', 'TAKE ONE': 'ambil', 'LOSE ONE': 'lepas'
};

/* Tiga tema. `id` jadi kelas pada papan; gambarnya sendiri tidak berubah. */
window.RETRO.PRIZE_THEMES = [
  { id: '', nama: 'Teks', hint: 'Tampilan asli 1982 — nama saja' },
  { id: 'poster', nama: 'Poster', hint: 'Bidang datar berwarna, gaya papan hadiah' },
  { id: 'garis', nama: 'Garis', hint: 'Garis saja, paling terbaca saat kecil' },
  { id: 'fosfor', nama: 'Fosfor', hint: 'Monokrom hijau, mengikuti aksen koleksi ini' }
];
