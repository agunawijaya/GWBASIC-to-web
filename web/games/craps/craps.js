/* ===========================================================================
   craps.js — port dari CRAPS.BAS (Friendlyware, "Nevada Dice", 1982).

   Dua ratus lima puluh empat baris. Aturannya craps kasino yang benar, dan
   tiga hal di bawahnya masing-masing layak dibaca sendiri.

   ------------------------------------------------------------------------
   1. SEBUAH DADU DISIMPAN SEBAGAI SATU STRING — TERMASUK GERAK KURSORNYA

       1420 A1=CHR$(201)+STRING$(2,205)+CHR$(187)+CHR$(31)+STRING$(4,29)+...

   CHR$(31) adalah KURSOR TURUN dan CHR$(29) adalah KURSOR KIRI. Keduanya
   karakter kendali, bukan karakter yang tampil. Jadi string ini, saat
   di-PRINT, menggerakkan kursornya sendiri turun dan mundur — dan menggambar
   kotak DUA DIMENSI dari satu perintah PRINT tunggal.

   Namanya sekarang escape sequence, dan itulah cara kerja `\033[2J` di
   terminal Unix sampai hari ini.

   Bandingkan dengan CRAZY8 (1986), yang merakit kartunya dari data ke dalam
   FIG$(5,5) lalu mencetaknya dengan 25 pasang LOCATE+PRINT. Dua jawaban yang
   berlawanan untuk soal yang sama:

       CRAPS   gambar jadi, satu PRINT     cepat, tapi tak terbaca manusia
       CRAZY8  dirakit dari data           satu rutin melayani 52 kartu

   Yang satu memilih kecepatan, yang lain memilih keterbacaan — dan keduanya
   benar untuk kebutuhannya sendiri: CRAPS cuma punya enam gambar, CRAZY8
   punya lima puluh dua.

   ------------------------------------------------------------------------
   2. RANDOMIZE DIPANGGIL DI DALAM LEMPARANNYA SENDIRI

       1220 FOR B=1 TO 6                     ' enam bingkai animasi
       1240 C=INT(RND(1)*6)+1                ' dadu pertama
       1260 RANDOMIZE(VAL(RIGHT$(TIME$,2))*RND)
       1270 D=INT(RND(1)*6)+1                ' dadu kedua
       1290 RANDOMIZE(VAL(RIGHT$(TIME$,2)))  ' semai ulang lagi
       1310 NEXT

   RANDOMIZE menyetel keadaan pengacak dari benihnya. Jadi sesudah baris 1290,
   keadaan pengacak SEPENUHNYA ditentukan oleh detik pada jam.

   Akibatnya bisa diturunkan tanpa tahu isi RND sama sekali:

     - Bingkai 2 sampai 6 semuanya masuk dengan keadaan yang sama persis,
       jadi kelimanya menghasilkan pasangan dadu YANG SAMA. "Animasi"
       enam-bingkai itu sebenarnya diam selama lima bingkai terakhir.

     - Hasil akhirnya — bingkai keenam — adalah fungsi murni dari detik.
       Enam puluh lemparan yang mungkin, selamanya.

   KENO menyemai ulang tiap permainan; itu sudah buruk. CRAPS menyemai ulang
   DI DALAM satu lemparan, dua kali. Ia mengubah pengacak jadi tabel yang
   diindeks jam dinding.

   Port ini menyemai SEKALI dari crypto.getRandomValues, dan tiap bingkai
   animasinya benar-benar berbeda.

   ------------------------------------------------------------------------
   3. SATU BARIS YANG NILAINYA TIDAK PERNAH DIPAKAI

       640 G=G*2      ' taruhan digandakan sesudah menang

   Terlihat seperti aturan: menang, lalu taruhan naik dua kali lipat. Tapi
   tiap ronde memanggil GOSUB 1720 yang menanyakan taruhan dari awal, dan
   baris 1750 menimpanya: G=VAL(A0). Nilai hasil penggandaan itu tidak pernah
   sempat dipakai.

   Dipertahankan sebagai KETIADAAN — port ini juga menanyakan taruhan tiap
   ronde, jadi penggandaan itu sama tidak berpengaruhnya. Yang ditambahkan
   cuma catatan bahwa baris itu ada.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng, dice } = window.RETRO;
  const $ = (id) => document.getElementById(id);

  /* Baris 1870-1940. Daftar barang yang ditawarkan program untuk dijual saat
     pemain kehabisan uang, dengan nilainya dalam keping $100 — apa adanya,
     termasuk urutannya. Perhatikan RUMAH. */
  const BARANG = [
    { nama: 'Car',         v: 20 },
    { nama: 'Boat',        v: 20 },
    { nama: 'Computer',    v: 20 },
    { nama: 'Motorcycle',  v: 18 },
    { nama: 'Stereo',      v: 12 },
    { nama: 'Golf Clubs',  v: 6  },
    { nama: 'House',       v: 5  },
    { nama: 'Skate Board', v: 5  }
  ];

  const db = store('craps');
  let keping, sisiTaruhan, taruhan, poin, fase, barangKe, dijual;
  let dadu = [1, 1];

  const uang = () => keping * 100;

  /* --------------------------------------------------------------------
     Melempar
     -------------------------------------------------------------------- */
  async function lempar() {
    if (fase !== 'lempar' && fase !== 'poin') return;
    const dulu = fase;
    fase = 'menggulir';
    gambar();

    /* Baris 1220: enam bingkai. Di sini keenamnya benar-benar berbeda —
       itulah seluruh maksud memindahkan RANDOMIZE keluar dari perulangan. */
    const r = rng();
    for (let b = 0; b < 6; b++) {
      dadu = dice.roll(r, 2);
      audio.sound(137, 0.02);                         // baris 1230
      gambarDadu(true);
      await new Promise(res => setTimeout(res, 90));
    }
    gambarDadu(false);

    const k = dadu[0] + dadu[1];
    $('sLast').textContent = k;

    if (dulu === 'lempar') return comingOut(k);
    return kejarPoin(k);
  }

  /* Baris 190-210: lemparan pembuka. */
  function comingOut(k) {
    if (k === 7 || k === 11) {                        // baris 190: NATURAL
      return sisiTaruhan === 'pass' ? menang('Natural ' + k + ' — you win!')
                                    : kalah('Natural ' + k + ' — dice win.');
    }
    if (k === 2 || k === 3 || k === 12) {             // baris 200: CRAPS
      return sisiTaruhan === 'pass' ? kalah('Craps ' + k + ' — you lose.')
                                    : menang('Craps ' + k + ' — you win!');
    }
    poin = k;
    fase = 'poin';
    gambar();
    kata('THE POINT IS ' + k);                        // baris 210
  }

  /* Baris 280-290: sesudah poin ditetapkan. */
  function kejarPoin(j) {
    if (j === poin) {                                 // baris 280
      return sisiTaruhan === 'pass' ? menang('Point ' + j + ' — you win!')
                                    : kalah('Point ' + j + ' — dice win.');
    }
    if (j === 7) {                                    // baris 290
      return sisiTaruhan === 'pass' ? kalah('Seven out — you lose.')
                                    : menang('Seven out — you win!');
    }
    fase = 'poin';
    gambar();
    kata('Rolled ' + j + '. Point is still ' + poin + '.');
  }

  /* Baris 590: H = H + 2*G. Taruhannya sudah dipotong di baris 530, jadi
     menerima 2x taruhan berarti bayaran satu-banding-satu — bayaran craps
     yang benar untuk pass maupun don't pass. */
  function menang(pesan) {
    keping += 2 * taruhan;
    fase = 'usai';
    kata(pesan);
    audio.play('MN T120 O3 P8 O2E8 O2G8. O2E16 F8 G4.', { fresh: true });  // baris 620
    simpanRekor();
    gambar();
    /* Baris 170: menang besar di atas $10.000. */
    if (uang() > 10000) return bankJebol();
    $('next').classList.remove('hidden');
  }

  function kalah(pesan) {
    fase = 'usai';
    kata(pesan, 'bad');
    audio.play('MB T90 O2 L8 g f e L4 c', { fresh: true });
    gambar();
    if (keping < 1) return bangkrut();                // baris 160
    $('next').classList.remove('hidden');
  }

  function bankJebol() {
    fase = 'tamat';
    kata('YOU BROKE THE BANK !!!!!!!');               // baris 2520
    audio.play('MB T160 O2 L8 c e g O3 c e g L2 c', { fresh: true });
    gambar();
    $('again').classList.remove('hidden');
  }

  /* --------------------------------------------------------------------
     Baris 1830-1990: kehabisan uang.

     Program menawarkan pemain MENJUAL BARANGNYA supaya bisa terus bermain,
     satu barang tiap kali bangkrut, menurut daftar tetap. Ini bagian paling
     gelap di seluruh koleksi, dan ia ditulis sebagai lelucon.
     -------------------------------------------------------------------- */
  function bangkrut() {
    fase = 'bangkrut';
    const b = BARANG[barangKe % BARANG.length];
    $('sellItem').textContent = b.nama;
    $('sellVal').textContent = '$' + (b.v * 100).toLocaleString('en-US');
    $('sell').classList.remove('hidden');
    kata("You don't have any more money.", 'bad');
    gambar();
  }

  function jual(ya) {
    const b = BARANG[barangKe % BARANG.length];
    $('sell').classList.add('hidden');
    if (!ya) {
      fase = 'tamat';
      kata('Thanks for playing.');
      gambar();
      $('again').classList.remove('hidden');
      return;
    }
    /* Baris 1990: H1=0 : H=VV. Menjual TIDAK menambah — ia MENGGANTI.
       Sisa keping seribuan Anda hangus. Karena ini hanya dijalankan saat
       pemain benar-benar habis, hasilnya sama; tapi bentuknya menyimpan
       kejutan kalau syaratnya pernah longgar. */
    keping = b.v;
    barangKe++;
    dijual.push(b.nama);
    $('sSold').textContent = dijual.length ? dijual.join(', ') : '—';
    fase = 'usai';
    kata('Sold your ' + b.nama + '.');
    gambar();
    $('next').classList.remove('hidden');
  }

  /* --------------------------------------------------------------------
     Ronde baru
     -------------------------------------------------------------------- */
  function rondeBaru() {
    $('next').classList.add('hidden');
    poin = 0;
    fase = 'taruh';
    const maks = Math.max(keping, 1);
    $('bet').max = maks;
    $('bet').value = Math.min(Number($('bet').value) || 1, maks);
    gambar();
    kata('Place your bets please.');                  // baris 440
  }

  function pasang() {
    const g = Number($('bet').value);
    if (!(g > 0)) return kata('Please bet an amount greater than zero.', 'bad');
    if (g > keping) return kata("Hey, I ain't stupid! You don't have that much.", 'bad');
    taruhan = g;
    keping -= g;                                      // baris 530
    fase = 'lempar';
    gambar();
    kata('***** COMING OUT *****');                   // baris 550
  }

  function simpanRekor() {
    const rek = db.get('best', 0);
    if (uang() > rek) { db.set('best', uang()); ui.toast('Rekor baru: $' + uang().toLocaleString('en-US')); }
  }

  /* --------------------------------------------------------------------
     Gambar
     -------------------------------------------------------------------- */
  function gambarDadu(bergulir) {
    const baris = $('dice');
    baris.textContent = '';
    dadu.forEach(v => {
      const e = dice.el(v, { size: 62 });
      if (bergulir) e.classList.add('die--rolling');
      baris.append(e);
    });
  }

  function gambar() {
    gambarDadu(fase === 'menggulir');

    $('sCash').textContent = '$' + uang().toLocaleString('en-US');
    $('sBet').textContent = taruhan ? '$' + (taruhan * 100).toLocaleString('en-US') : '—';
    $('sPoint').textContent = poin || '—';
    $('sBest').textContent = '$' + db.get('best', 0).toLocaleString('en-US');

    /* Tumpukan keping, padanan baris 2250-2300. Aslinya menggambar sampai
       dua belas keping saja (baris 2280: IF H1>12 THEN HH=12) — batas layar,
       bukan batas uang. Batas itu dipertahankan. */
    const tum = $('stack');
    tum.textContent = '';
    const n = Math.min(keping, 12);
    for (let i = 0; i < n; i++) tum.append(ui.el('i', { class: 'c-chip' }));
    if (keping > 12) tum.append(ui.el('span', { class: 'c-more', text: '+' + (keping - 12) }));

    $('betRow').classList.toggle('hidden', fase !== 'taruh');
    $('roll').classList.toggle('hidden', fase !== 'lempar' && fase !== 'poin' && fase !== 'menggulir');
    $('roll').disabled = fase === 'menggulir';
    $('roll').textContent = fase === 'poin' ? 'Roll for the point' : 'Roll';

    document.querySelectorAll('.c-side').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.side === sisiTaruhan));
      b.disabled = fase !== 'taruh';
    });
    $('bet').disabled = fase !== 'taruh';
    $('place').disabled = fase !== 'taruh';
  }

  function kata(t, jenis) {
    $('say').textContent = t;
    $('say').className = 'c-say' + (jenis ? ' c-say--' + jenis : '');
  }

  /* --------------------------------------------------------------------
     Panel: berapa banyak lemparan yang mungkin

     Bukan simulasi — ini penghitungan langsung atas 36 pasangan dadu, dan
     perbandingannya dengan "60 detik" milik program aslinya.
     -------------------------------------------------------------------- */
  function sebaran() {
    const t = {};
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
      t[a + b] = (t[a + b] || 0) + 1;
    }
    const tb = $('distBody');
    tb.textContent = '';
    for (let k = 2; k <= 12; k++) {
      const tr = ui.el('tr', [7, 11].includes(k) ? { class: 'c-row--win' }
                : [2, 3, 12].includes(k) ? { class: 'c-row--lose' } : null);
      tr.append(ui.el('td', { text: String(k) }),
                ui.el('td', { text: t[k] + ' / 36' }),
                ui.el('td', { text: (t[k] / 36 * 100).toFixed(1) + '%' }));
      tb.append(tr);
    }
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Nevada Dice (Craps)',
    source: 'CRAPS.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  document.querySelectorAll('.c-side').forEach(b => {
    b.addEventListener('click', () => {
      sisiTaruhan = b.dataset.side;                   // baris 360-370
      gambar();
    });
  });
  $('place').addEventListener('click', pasang);
  $('roll').addEventListener('click', lempar);
  $('next').addEventListener('click', rondeBaru);
  $('sellYes').addEventListener('click', () => jual(true));
  $('sellNo').addEventListener('click', () => jual(false));
  $('again').addEventListener('click', () => {
    $('again').classList.add('hidden');
    mulaiBaru();
  });
  $('resetBest').addEventListener('click', async () => {
    if (!await ui.confirmYesNo('Reset rekor?', 'Uang tertinggi dihapus.')) return;
    db.set('best', 0); gambar();
  });

  function mulaiBaru() {
    keping = 20;                 // baris 120: H=10 : H1=1  ->  $1000 + $1000
    sisiTaruhan = 'pass';
    taruhan = 0; poin = 0; barangKe = 0; dijual = [];
    dadu = [1, 1];
    $('sSold').textContent = '—';
    rondeBaru();
  }

  sebaran();
  mulaiBaru();
})();
