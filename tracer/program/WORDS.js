/* ===========================================================================
   WORDS.js — porting minimalis WORDS.BAS sebagai tabel baris.

   Tiga puluh enam baris, dan SEMUANYA `DATA`. Tidak ada satu pun pernyataan
   yang bisa dijalankan. Menjalankan berkas ini sendirian: program berakhir
   seketika tanpa melakukan apa pun.

   Ini bukan program. Ini KAMUS — 398 kata bacaan tingkat dasar, dikelompokkan
   menurut POLA EJAAN, bukan menurut abjad atau makna:

       10000  fat cat act can fast hat ...     <- vokal a pendek
       10050  glass grass bell dress will ...  <- konsonan ganda di akhir
       10070  fish dish brush splash ...       <- bunyi sh
       10080  rich witch lunch catch ...       <- bunyi ch
       10090  that this them than ...          <- bunyi th
       10230  why wheel when whip ...          <- bunyi wh
       10350  one two three four ...           <- angka

   Berkas ini disisipkan ke READING.BAS lewat `CHAIN MERGE "words", 75, ALL`.
   Nomor barisnya sengaja dimulai dari 10000 supaya tidak bertabrakan dengan
   baris READING.BAS yang berhenti di 2020.

   Penyimpangan:

   - Tidak ada apa pun yang bisa dilihat: tidak ada layar, tidak ada variabel,
     tidak ada percabangan. Yang bisa dilakukan di halaman ini cuma membaca
     daftarnya dan melihat sorotan berjalan lurus dari 10000 ke 10350.
   =========================================================================== */

(function (global) {
  'use strict';

  /* Tiap baris DATA di sini tidak "dijalankan" — BASIC melewatinya begitu
     saja. Yang membacanya adalah `READ` di program yang menyisipkannya. */
  var KELOMPOK = [
    [10000, ['fat', 'cat', 'act', 'can', 'fast', 'hat', 'hand', 'last', 'man', 'ran', 'have']],
    [10010, ['red', 'hen', 'let', 'get', 'help', 'next', 'pet', 'men', 'went', 'bed', 'said']],
    [10020, ['big', 'pig', 'fir', 'did', 'swim', 'six', 'dig', 'win', 'sit', 'hit', 'been']],
    [10030, ['rug', 'bug', 'jump', 'hunt', 'fun', 'must', 'cup', 'bus', 'cut', 'run', 'of', 'from']],
    [10040, ['hot', 'pond', 'got', 'hop', 'not', 'dog', 'log', 'lost', 'soft', 'on', 'was', 'want']],
    [10050, ['glass', 'grass', 'bell', 'dress', 'will', 'still', 'off', 'cross', 'fuss', 'stuff', 'roll']],
    [10060, ['milk', 'truck', 'ask', 'back', 'mask', 'neck', 'desk', 'sick', 'silk', 'rock']],
    [10070, ['fish', 'dish', 'brush', 'splash', 'wish', 'ship', 'shop', 'shed', 'shut', 'shelf', 'wash']],
    [10080, ['rich', 'witch', 'lunch', 'catch', 'ranch', 'pitch', 'such', 'match', 'much', 'stretch', 'watch']],
    [10090, ['that', 'this', 'them', 'than', 'then', 'thin', 'bath', 'thick', 'with', 'cloth', 'both']],
    [10100, ['pink', 'thank', 'bank', 'think', 'trunk', 'string', 'sang', 'long', 'bring', 'hung', 'young']],
    [10110, ['play', 'day', 'may', 'say', 'stay', 'train', 'rain', 'wait', 'paint', 'mail', 'they']],
    [10120, ['bake', 'safe', 'chase', 'came', 'cake', 'gave', 'late', 'game', 'name', 'made', 'break']],
    [10130, ['see', 'need', 'keep', 'sleep', 'me', 'she', 'clean', 'read', 'teach', 'piece']],
    [10140, ['try', 'dry', 'by', 'cry', 'fly', 'pie', 'tie', 'lie', 'cried', 'tried', 'eye']],
    [10150, ['side', 'line', 'five', 'time', 'like', 'fine', 'ride', 'hide', 'kite', 'mine', 'give']],
    [10160, ['find', 'kind', 'mind', 'hind', 'blind', 'right', 'night', 'light', 'fight', 'might', 'wind']],
    [10170, ['go', 'no', 'slow', 'show', 'own', 'low', 'boat', 'road', 'goat', 'coat', 'to', 'do']],
    [10180, ['cold', 'nose', 'old', 'those', 'hold', 'close', 'told', 'hope', 'gold', 'home', 'one']],
    [10190, ['new', 'chew', 'few', 'blue', 'threw', 'true', 'grew', 'suit', 'flew', 'fruit', 'build']],
    [10200, ['use', 'mule', 'cute', 'goose', 'loose', 'choose', 'food', 'soon', 'zoo', 'room', 'you', 'school']],
    [10210, ['some', 'friend', 'done', 'does', 'come', 'shoe', 'move', 'guess', 'live', 'head']],
    [10220, ['put', 'pull', 'push', 'full', 'bush', 'foot', 'look', 'good', 'book', 'took', 'could', 'should', 'would']],
    [10230, ['why', 'wheel', 'when', 'whip', 'which', 'who', 'white', 'whose', 'while', 'what']],
    [10240, ['all', 'draw', 'ball', 'crawl', 'call', 'fault', 'fall', 'caught', 'saw', 'taught', 'shall', 'gone']],
    [10250, ['brown', 'house', 'cow', 'found', 'down', 'sound', 'how', 'our', 'now', 'out', 'your', 'four']],
    [10260, ['toy', 'noise', 'joy', 'point', 'boy', 'soil', 'join', 'boil', 'oil', 'spoil']],
    [10270, ['hear', 'year', 'ear', 'rear', 'dear', 'cheer', 'clear', 'deer', 'near', 'steer', 'here']],
    [10280, ['hair', 'care', 'air', 'scare', 'pair', 'bare', 'chair', 'square', 'fair', 'share', 'bear', 'where']],
    [10290, ['fork', 'or', 'for', 'short', 'horse', 'floor', 'store', 'tore', 'shore', 'more', 'wore', 'door']],
    [10300, ['barn', 'yard', 'car', 'arm', 'farm', 'are', 'hard', 'dark', 'far', 'march', 'part']],
    [10310, ['her', 'jerk', 'serve', 'girl', 'bird', 'first', 'third', 'curl', 'turn', 'hurt', 'word', 'work', 'were']],
    /* 10320 KOMA YANG HILANG: "water father" adalah SATU butir, bukan dua.
       Lihat catatan di bawah. ("coller" juga kemungkinan salah ketik untuk
       "collar".) */
    [10320, ['better', 'never', 'after', 'under', 'coller', 'color', 'other', 'mother', 'water father']],
    [10330, ['funny', 'happy', 'story', 'hurry', 'party', 'any', 'many', 'very', 'ready', 'pretty']],
    [10340, ['write', 'knew', 'know', 'wrote', 'lamb', 'talk', 'walk', 'laugh', 'climb', 'eight']],
    [10350, ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']]
  ];

  var tabel = KELOMPOK.map(function (k) {
    return { baris: k[0], jalan: function () { /* DATA: tidak dijalankan */ } };
  });

  var SEMUA = [];
  KELOMPOK.forEach(function (k) { SEMUA = SEMUA.concat(k[1]); });

  global.PROGRAM = global.PROGRAM || {};
  global.PROGRAM['WORDS'] = {
    nama: 'WORDS',
    judul: 'Words (kamus 398 kata untuk READING)',
    sumber: 'WORDS',
    berkas: 'run/WORDS.BAS',
    tabel: tabel,
    data: SEMUA,

    arsitektur: {
      judul: 'Alur WORDS.BAS',
      simpul: [
        { id: 'data', baris: '10000-10350', jenis: 'mulai',
          teks: ['36 baris DATA, 398 kata,', 'dikelompokkan per pola ejaan'] },
        { id: 'diam', baris: '—', jenis: 'keluar',
          teks: ['Tidak ada yang dijalankan;', 'program berakhir seketika'] },
        { id: 'pakai', baris: 'READING 74', jenis: 'subrutin',
          teks: ['CHAIN MERGE menyisipkan', 'baris-baris ini ke READING.BAS'] }
      ],
      panah: [
        { dari: 'data', ke: 'diam', label: 'kalau dijalankan sendiri' },
        { dari: 'data', ke: 'pakai', label: 'kalau disisipkan' }
      ]
    },

    pseudokode: [
      { baris: 10000, tingkat: 0, teks: '<b>tidak ada yang dijalankan</b> &mdash; 36 baris ini seluruhnya <code>DATA</code>' },
      { baris: 10000, tingkat: 1, teks: 'tiap baris satu <b>pola ejaan</b>: vokal a pendek, bunyi sh, bunyi th&hellip;' },
      { baris: 10320, tingkat: 1, teks: '&hellip;dan satu baris kehilangan komanya: <code>water father</code> jadi satu butir' },
      { baris: 10350, tingkat: 0, teks: 'kelompok terakhir: angka satu sampai sepuluh' }
    ],

    perintahAsli: 'run\\WORDS.bat',
    catatanAsli: 'Menjalankan berkas ini sendirian tidak melakukan apa pun: ' +
      'ia berakhir seketika dan mengembalikan prompt Ok.',

    penyimpangan: [
      '<b>Tidak ada apa pun yang bisa dilihat.</b> Tidak ada layar, tidak ada ' +
      'variabel, tidak ada percabangan. Yang bisa dilakukan di halaman ini ' +
      'cuma membaca daftarnya dan melihat sorotan berjalan lurus dari 10000 ' +
      'ke 10350.'
    ],

    pelajaran: {
      ringkas: 'Berkas yang seluruhnya data, disisipkan ke program lain saat ' +
        'berjalan. Kata-katanya dikelompokkan menurut pola ejaan &mdash; dan ' +
        'satu barisnya kehilangan koma.',
      pelajari: [
        ['Berkas data yang berwujud program',
         'Tiga puluh enam baris <code>DATA</code> dengan nomor baris ' +
         'sungguhan. Bentuknya program karena hanya itu bentuk yang bisa ' +
         'dimuat GW-BASIC &mdash; tapi tidak ada satu pun pernyataan yang ' +
         'bisa dijalankan di dalamnya.'],
        ['Nomor baris sebagai ruang alamat',
         'Baris di sini mulai dari <b>10000</b>, sementara READING.BAS ' +
         'berhenti di 2020. Itu bukan kebetulan: <code>CHAIN MERGE</code> ' +
         'menyisipkan baris menurut nomornya, dan nomor yang sama akan ' +
         '<b>menimpa</b>. Jarak delapan ribu adalah ruang yang sengaja ' +
         'dikosongkan &mdash; sama seperti nomor port atau rentang alamat ' +
         'yang dipesan.'],
        ['Dikelompokkan menurut bunyi, bukan abjad',
         'Baris 10070 semuanya berbunyi "sh", 10080 "ch", 10090 "th", 10230 ' +
         '"wh". Itu urutan pengajaran membaca fonetik, bukan urutan kamus. ' +
         '<b>Bentuk datanya mengikuti cara mengajarnya</b>, dan itu yang ' +
         'membuat READING.BAS bisa menampilkan kata acak yang tetap masuk ' +
         'akal untuk seorang anak.']
      ],
      hindari: [
        ['Koma yang hilang di tengah data',
         'Baris 10320 berbunyi <code>&hellip;other,mother,water father</code>. ' +
         'Tanpa koma di antara dua kata terakhir, BASIC membacanya sebagai ' +
         '<b>satu butir</b>: <code>"water father"</code>. Jadi daftarnya ' +
         'berisi 398 kata, bukan 399 &mdash; dan sesekali READING.BAS akan ' +
         'menampilkan "water father" sebagai kata yang harus dibaca seorang ' +
         'anak kelas satu. Tidak ada pesan galat, dan tidak ada yang ' +
         'memeriksa.'],
        ['Salah ketik yang tak terlihat',
         '<code>coller</code> di baris yang sama kemungkinan besar ' +
         '<code>collar</code>. Di berkas yang isinya <b>daftar kata untuk ' +
         'belajar mengeja</b>, satu huruf yang salah adalah pelajaran yang ' +
         'salah.']
      ]
    },

    penjelasan: [
      { judul: 'Berkas yang bentuknya program tapi isinya kamus',
        isi: [
          'GW-BASIC tidak punya cara memuat "berkas data" ke dalam program ' +
          'yang sedang berjalan &mdash; kecuali satu: <code>CHAIN MERGE</code>, ' +
          'yang menyisipkan <b>baris-baris program lain</b> ke program yang ' +
          'sedang jalan.',
          'Jadi kalau data Anda mau disisipkan begitu, ia harus berwujud ' +
          'program. Berkas ini adalah 398 kata yang dipakaikan nomor baris ' +
          'supaya bisa masuk.',
          'READING.BAS memanggilnya di baris 74:',
          '<code>74 CHAIN MERGE "words", 75, ALL</code>',
          '&mdash; muat WORDS.BAS, gabungkan barisnya ke program yang sedang ' +
          'berjalan, lanjutkan di baris 75, dan pertahankan seluruh variabel ' +
          '(<code>ALL</code>).',
          'Sesudah baris itu, program yang berjalan adalah READING.BAS ' +
          '<b>ditambah</b> tiga puluh enam baris ini. Dan karena semuanya ' +
          '<code>DATA</code>, tidak ada satu pun yang akan pernah disorot ' +
          'sebagai "baris yang sedang berjalan" &mdash; yang membacanya adalah ' +
          '<code>READ</code>.'
        ] },
      { judul: 'Delapan ribu nomor yang sengaja dikosongkan',
        isi: [
          '<code>CHAIN MERGE</code> menyisipkan baris <b>menurut nomornya</b>. ' +
          'Kalau berkas yang disisipkan punya baris bernomor sama dengan yang ' +
          'sedang berjalan, yang baru <b>menimpa</b> yang lama.',
          'READING.BAS memakai nomor 5 sampai 2020. Berkas ini mulai dari ' +
          '10000. Jarak itu bukan kebetulan &mdash; ia ruang yang sengaja ' +
          'dikosongkan supaya penyisipannya tidak merusak apa pun.',
          'Pola yang sama masih ada di sekitar kita, dengan nama lain: rentang ' +
          'nomor port yang dipesan, blok alamat IP privat, awalan pengenal ' +
          'yang dijatah per modul. <b>Ruang nama yang dibagi dengan cara ' +
          'menyepakati batas, bukan dengan cara memeriksa.</b>',
          'Dan seperti semua kesepakatan semacam itu, ia bekerja sampai ada ' +
          'yang lupa. Kalau suatu hari READING.BAS tumbuh melewati baris ' +
          '10000, kata-kata di berkas ini akan mulai menimpa kodenya &mdash; ' +
          'diam-diam, tanpa satu pun peringatan.'
        ] }
    ]
  };
})(window);
