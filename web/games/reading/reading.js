/* ===========================================================================
   reading.js — port dari READING.BAS + WORDS.BAS (FriendlyWare, 1982).

   Tachistoscope: alat latih kecepatan baca. Sebuah kata dikilatkan sebentar,
   pemakai mengetik apa yang sempat terbaca. Benar -> kilatan dipersingkat;
   salah -> dipanjangkan.

   ------------------------------------------------------------------------
   DATA YANG DISISIPKAN KE PROGRAM YANG SEDANG JALAN

       74 CHAIN MERGE "words", 75, ALL

   Bukan RUN (yang membuang programnya) melainkan PENYISIPAN: sesudah baris
   74, program yang berjalan adalah READING plus 36 baris DATA yang tadinya
   berkas terpisah. `ALL` mempertahankan seluruh variabel.

   WORDS.BAS bernomor 10000-10350, induknya 5-2020. Jarak itu satu-satunya
   cara mencegah tabrakan — nomor baris adalah ruang nama, dan pemisahannya
   dijaga kesepakatan, bukan oleh bahasa.

   Satu-satunya CHAIN MERGE di seluruh koleksi ini.

   ------------------------------------------------------------------------
   MENGHITUNG DATA DENGAN SENGAJA MENABRAKNYA

       1000 ON ERROR GOTO 1050
       1010 RESTORE:L=0
       1020 READ X$:L=L+1:GOTO 1020
       1050 RETURN

   Perulangan tanpa syarat berhenti; galat "Out of DATA" yang menghentikannya,
   dan penangannya langsung RETURN dengan L berisi jumlahnya. Itu bukan
   penyalahgunaan — BASIC tidak punya cara bertanya "ada berapa butir DATA?",
   dan menuliskan jumlahnya sebagai angka akan salah begitu ada yang menambah
   satu baris ke WORDS.BAS.

   ------------------------------------------------------------------------
   TIGA CACAT YANG DIPERTAHANKAN

   1. SATU DARI ENAM PUJIAN KOSONG. Baris 78 mengisi C(1)..C(5); baris 500
      memakai `I=RND(6)*6+1` yang menghasilkan [1,7) dan dipotong jadi 1..6.
      C(6) tidak pernah diisi. Perbaikannya satu aksara (*5 bukan *6), dan
      cacatnya nyaris mustahil terlihat dari membaca karena yang salah adalah
      HUBUNGAN antara dua baris yang masing-masing benar.

   2. T4 TIDAK PERNAH DIKEMBALIKAN. Besar langkah mulai dari 100 dan jadi 10
      pada kesalahan pertama (baris 600), selamanya. Sesudah satu kesalahan,
      tiap jawaban benar hanya memangkas sepersepuluh dari sebelumnya.

   3. JAM YANG MENGIRA SATU JAM = DUA MENIT. Baris 75, 2000, dan 2010 semuanya
      mengalikan jam dengan 120, bukan 3600. Tidak pernah ketahuan karena
      rutinnya hanya memakai SELISIH dua pembacaan berjarak lima detik —
      selama keduanya di jam yang sama, komponen jam saling menghapus. Pola
      yang sama persis dengan BIO.

   ------------------------------------------------------------------------
   YANG TIDAK BISA DIPERTAHANKAN

       140 FOR I=1 TO T1:NEXT I:CLS

   Lama kilatan diukur dalam PUTARAN PERULANGAN KOSONG, bukan detik. Pada PC
   4,77 MHz seribu putaran GW-BASIC memakan sekitar 0,4 detik; pada mesin
   sekarang, mikrodetik — katanya tidak akan pernah terlihat.

   Jadi yang ditiru adalah ANGKANYA: T1 tetap berjalan dari 1000 dengan aturan
   yang sama, lalu dikalikan sebuah konstanta milidetik yang bisa digeser
   pemakai — karena angka aslinya memang tidak pernah tertulis di mana pun.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng } = window.RETRO;
  const BARIS = window.RETRO.READING_WORDS || [];
  const META = window.RETRO.READING_META || {};
  const $ = (id) => document.getElementById(id);
  const db = store('reading');

  /* Baris 1000-1050: jumlah butir dihitung dengan membaca sampai habis.
     Di sini tidak ada galat untuk ditabrak, jadi yang ditiru bentuknya:
     dihitung dari datanya, bukan ditulis sebagai angka. */
  const KATA = BARIS.reduce((a, b) => a.concat(b.kata), []);
  const L = KATA.length;

  /* Baris 78. Lima pujian, indeks 1..5 — dan C(6) yang tidak pernah ada. */
  const C = [null, 'Right', 'Correct', 'Absolutely',
             "You're doing OK!", "I knew you'd get that one"];

  const acak = rng();
  let T1 = 1000, T4 = 100;
  let benar = 0, salah = 0, kosong = 0;
  let kata = '', percobaan = 0, sedang = false;
  let msPerPutaran = 0.40;

  const lamaMs = () => Math.max(8, T1 * msPerPutaran);

  function papan() {
    $('s-t1').textContent = T1 + ' (' + Math.round(lamaMs()) + ' ms)';
    $('s-t4').textContent = T4 + (T4 === 10 ? ' ↓' : '');
    $('s-benar').textContent = benar;
    $('s-salah').textContent = salah;
    $('s-kosong').textContent = kosong;
  }

  function pesan(teks, kelas) {
    const p = $('pesan');
    p.className = 'r-pesan' + (kelas ? ' r-pesan--' + kelas : '');
    p.textContent = teks || ' ';
  }

  /* Baris 100: satu butir dipilih acak dari L butir. */
  function pilih() {
    return KATA[acak.int(L)];
  }

  function tampilkan() {
    if (sedang) return;
    sedang = true;
    percobaan = 0;
    kata = pilih();
    pesan('');
    $('jawab').value = '';
    $('jawab').disabled = true;
    $('kirim').disabled = true;
    $('mulai').disabled = true;

    const el = $('kilat');
    el.textContent = kata;
    el.classList.add('is-on');
    setTimeout(() => {
      el.classList.remove('is-on');
      el.textContent = '';
      $('jawab').disabled = false;
      $('kirim').disabled = false;
      $('jawab').focus();
    }, lamaMs());
  }

  /* Baris 500-520: benar. */
  function sukses() {
    /* Baris 500, apa adanya: RND(6)*6+1 menghasilkan [1,7), indeks larik
       dipotong ke bawah, jadi 1..6 — dan C(6) tidak pernah diisi. */
    const I = Math.floor(acak.next() * 6 + 1);
    const puji = C[I] || '';
    if (!puji) kosong++;
    benar++;
    pesan(puji || '(pujian kosong — C(6) tidak pernah diisi)',
          puji ? 'benar' : 'kosong');
    audio.play('mbc16c16c16ge8g');            // baris 510
    T1 = T1 - T4;                             // baris 520
    selesai();
  }

  /* Baris 600-650: salah. */
  function gagal() {
    audio.play('n50n25');                     // baris 600
    T4 = 10;                                  // baris 600 — dan tidak pernah kembali
    percobaan++;
    if (percobaan === 1) {                    // baris 610: satu kesempatan lagi
      pesan('Sorry - Try again!', 'salah');
      $('jawab').value = '';
      $('jawab').focus();
      papan();
      return;
    }
    salah++;
    pesan('Sorry, what I gave you was  ' + kata, 'salah');   // baris 630-640
    T1 = T1 + T4;                             // baris 650
    selesai();
  }

  function selesai() {
    sedang = false;
    $('jawab').disabled = true;
    $('kirim').disabled = true;
    $('mulai').disabled = false;
    papan();
  }

  function periksa() {
    if (!sedang || $('jawab').disabled) return;
    /* Baris 160: IF R=S — peka huruf besar-kecil, tanpa pemangkasan. */
    if ($('jawab').value === kata) sukses(); else gagal();
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Tachistoscope',
    source: 'READING.BAS + WORDS.BAS · FriendlyWare · 1982',
    backHref: '../../index.html'
  }));

  $('mulai').addEventListener('click', tampilkan);
  $('kirim').addEventListener('click', periksa);
  $('jawab').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); periksa(); }
  });

  $('ms').addEventListener('input', e => {
    msPerPutaran = Number(e.target.value);
    $('msv').textContent = msPerPutaran.toFixed(2) + ' ms';
    db.set('ms', msPerPutaran);
    papan();
  });
  msPerPutaran = Number(db.get('ms', 0.40));
  $('ms').value = msPerPutaran;
  $('msv').textContent = msPerPutaran.toFixed(2) + ' ms';

  /* --- angka-angka, dihitung dari datanya sendiri ------------------------- */
  $('k-kata').textContent = L + ' kata';
  $('n-butir').textContent = L;

  $('tbl-kata').innerHTML =
    '<thead><tr><th>Data WORDS.BAS</th><th></th></tr></thead><tbody>' +
    '<tr><td>Baris <code>DATA</code></td><td>' + META.barisData + '</td></tr>' +
    '<tr><td>Butir seluruhnya</td><td>' + META.butir + '</td></tr>' +
    '<tr><td>Butir unik</td><td>' + META.unik + '</td></tr>' +
    '<tr><td>Butir per baris</td><td>' + META.minButir + '–' + META.maksButir + '</td></tr>' +
    '<tr><td class="r-bad">Butir dengan spasi (koma hilang)</td><td class="r-bad">' +
      (META.spasi || []).map(x => '"' + x.k + '"').join(', ') + '</td></tr>' +
    '<tr><td>Kata kembar</td><td>' +
      (META.kembarDaftar || []).map(x => x.k).join(', ') + '</td></tr>' +
    '</tbody>';

  papan();
})();
