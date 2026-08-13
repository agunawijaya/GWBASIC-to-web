/* ===========================================================================
   integrat.js — port dari INTEGRAT.BAS (Phil Feldman & Tom Rugg, 1982).

   Empat puluh dua baris, 21% komentar, dan satu keputusan rancangan yang
   sangat berani:

       190 PRINT CHR$(B)TAB(13)"WARNING!"TAB(31)CHR$(B)
       200 "The subroutine at lines"
       220 "2000-2999 is assumed to"
       240 "define Y as a function of X"

   Fungsi yang mau diintegralkan BUKAN masukan program — melainkan BAGIAN
   DARI PROGRAMNYA. Pemakai diharapkan menyunting baris 2000-an, mengetik
   rumusnya sendiri, lalu menjalankan:

       2000 REM **** Y=F(X) Goes Here ************
       2999 RETURN

   Dari sudut pandang sekarang ini terlihat aneh, tapi sebetulnya inilah
   CALLBACK — hanya saja mekanismenya menyunting kode, karena BASIC tidak
   punya penunjuk fungsi. Rentang 2000-2999 yang dicadangkan adalah KONTRAK
   ANTARMUKA: "kode Anda di sini, kode saya di luar sini".

   Idenya masih hidup di mana-mana: `conftest.py` di pytest, `Makefile` yang
   Anda tulis sendiri, blok <script> di halaman HTML. Bedanya cuma, sekarang
   bahasanya membantu Anda memisahkan keduanya — dan peringatan berbingkai itu
   tidak perlu dicetak lagi.

   ------------------------------------------------------------------------
   PERULANGAN YANG TIDAK PERNAH BERHENTI

       440 PRINT N,A
       450 N=N*2
       460 GOTO 320

   Tidak ada syarat berhenti. Program menggandakan jumlah segmen SELAMANYA,
   mencetak satu baris tiap kali, sampai pemakai menekan Ctrl-Break.

   Itu terdengar seperti kelalaian, dan mungkin memang bukan: aturan Simpson
   MENDEKATI jawabannya, tidak pernah persis. Berhenti pada suatu ambang
   berarti memutuskan berapa teliti "cukup teliti" — dan program ini memilih
   TIDAK memutuskan, lalu menyerahkannya ke mata pemakai. Angkanya berhenti
   berubah di digit yang Anda pedulikan; di situlah Anda berhenti.

   Di port ini perulangannya tetap ada, tapi dibatasi dan bisa dihentikan —
   halaman web tidak punya Ctrl-Break.

   ------------------------------------------------------------------------
   KENAPA PENAFSIR SENDIRI, BUKAN eval()

   Fungsi pemakai harus dievaluasi puluhan ribu kali. `eval()` akan bekerja,
   dan ia juga akan menjalankan APA PUN yang diketik — termasuk yang
   ditempel orang lain lewat tautan. Penafsir kecil di bawah hanya mengenal
   angka, x, tanda kurung, operator aritmetika, dan daftar fungsi yang
   tertutup. Apa pun di luar itu ditolak dengan nama barisnya.

   Itu juga membuat pesan galatnya lebih baik daripada `eval`: "fungsi tidak
   dikenal: sinus" lebih berguna daripada "sinus is not defined".
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const db = store('integrat');

  /* --------------------------------------------------------------------
     Penafsir ekspresi: turun-rekursif, satu lintasan, tanpa eval.

         ekspr  := suku (('+'|'-') suku)*
         suku   := pangkat (('*'|'/') pangkat)*
         pangkat:= unari ('^' pangkat)?          -- kanan-asosiatif
         unari  := ('-'|'+')? primer
         primer := angka | 'x' | nama '(' ekspr ')' | '(' ekspr ')'
     -------------------------------------------------------------------- */
  const FUNGSI = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    asin: Math.asin, acos: Math.acos, atan: Math.atan,
    exp: Math.exp, ln: Math.log, log: Math.log10, sqr: Math.sqrt,
    sqrt: Math.sqrt, abs: Math.abs, sinh: Math.sinh, cosh: Math.cosh,
    tanh: Math.tanh, sgn: Math.sign, int: Math.floor
  };
  const TETAPAN = { pi: Math.PI, e: Math.E };

  function susun(src) {
    const s = src.toLowerCase();
    let i = 0;
    const lewati = () => { while (i < s.length && s[i] === ' ') i++; };
    const lihat = () => { lewati(); return s[i]; };

    function ekspr() {
      let v = suku();
      for (;;) {
        const c = lihat();
        if (c === '+') { i++; const r = suku(); const a = v; v = (x) => a(x) + r(x); }
        else if (c === '-') { i++; const r = suku(); const a = v; v = (x) => a(x) - r(x); }
        else return v;
      }
    }
    function suku() {
      let v = pangkat();
      for (;;) {
        const c = lihat();
        if (c === '*') { i++; const r = pangkat(); const a = v; v = (x) => a(x) * r(x); }
        else if (c === '/') { i++; const r = pangkat(); const a = v; v = (x) => a(x) / r(x); }
        else return v;
      }
    }
    function pangkat() {
      const b = unari();
      if (lihat() === '^') { i++; const e = pangkat(); return (x) => Math.pow(b(x), e(x)); }
      return b;
    }
    function unari() {
      const c = lihat();
      if (c === '-') { i++; const v = unari(); return (x) => -v(x); }
      if (c === '+') { i++; return unari(); }
      return primer();
    }
    function primer() {
      lewati();
      const c = s[i];
      if (c === '(') {
        i++; const v = ekspr(); lewati();
        if (s[i] !== ')') throw new Error('kurang tanda kurung tutup');
        i++; return v;
      }
      if (c >= '0' && c <= '9' || c === '.') {
        let j = i;
        while (j < s.length && (s[j] >= '0' && s[j] <= '9' || s[j] === '.')) j++;
        if (s[j] === 'e' && (s[j + 1] === '+' || s[j + 1] === '-' ||
                             (s[j + 1] >= '0' && s[j + 1] <= '9'))) {
          j++; if (s[j] === '+' || s[j] === '-') j++;
          while (j < s.length && s[j] >= '0' && s[j] <= '9') j++;
        }
        const n = Number(s.slice(i, j));
        if (!isFinite(n)) throw new Error('angka tidak sah: ' + s.slice(i, j));
        i = j; return () => n;
      }
      if (c >= 'a' && c <= 'z') {
        let j = i;
        while (j < s.length && s[j] >= 'a' && s[j] <= 'z') j++;
        const nama = s.slice(i, j);
        i = j; lewati();
        if (s[i] === '(') {
          if (!FUNGSI[nama]) throw new Error('fungsi tidak dikenal: ' + nama);
          i++; const arg = ekspr(); lewati();
          if (s[i] !== ')') throw new Error('kurang tanda kurung tutup');
          i++; const f = FUNGSI[nama];
          return (x) => f(arg(x));
        }
        if (nama === 'x') return (x) => x;
        if (TETAPAN[nama] !== undefined) { const t = TETAPAN[nama]; return () => t; }
        throw new Error('nama tidak dikenal: ' + nama);
      }
      throw new Error(c === undefined ? 'ekspresi terpotong' : 'tak terduga: ' + c);
    }

    const f = ekspr();
    lewati();
    if (i < s.length) throw new Error('sisa yang tidak terbaca: ' + s.slice(i));
    return f;
  }

  /* --------------------------------------------------------------------
     Aturan Simpson — baris 320-430, diport apa adanya.

         320 DX=(U-L)/N:T=0
         330 X=L:GOSUB 2000:T=T+Y      ' ujung kiri
         340 X=U:GOSUB 2000:T=T+Y      ' ujung kanan
         360 FOR J=1 TO M ... T=T+4*Z  ' titik GANJIL, bobot 4
         400 FOR J=1 TO M ... T=T+2*Z  ' titik GENAP, bobot 2
         430 A=DX*T/3

     Bobot 1, 4, 2, 4, 2, ..., 4, 1 dikali DX/3. Itu aturan Simpson yang
     benar, dan bentuknya di sini sudah persis bentuk buku teks.
     -------------------------------------------------------------------- */
  function simpson(f, L, U, N) {
    const dx = (U - L) / N;
    let t = f(L) + f(U);                       // baris 330-340
    let z = 0;
    const m = N / 2;
    for (let j = 1; j <= m; j++) z += f(L + dx * (2 * j - 1));   // baris 370
    t += 4 * z;                                                  // baris 380
    z = 0;
    for (let j = 1; j <= m - 1; j++) z += f(L + dx * 2 * j);      // baris 410
    t += 2 * z;                                                  // baris 420
    return dx * t / 3;                                           // baris 430
  }

  let berhenti = false;

  async function jalankan() {
    const src = $('fx').value.trim();
    const L = Number($('lo').value), U = Number($('hi').value);
    const tbody = $('tbody');
    tbody.textContent = '';
    $('msg').textContent = '';

    let f;
    try { f = susun(src); f(1); }
    catch (e) {
      audio.play('MB T200 O2 L8 f d', { fresh: true });
      $('msg').innerHTML = '<span class="i-err">** ERROR! **</span> &mdash; ' + e.message;
      return;
    }
    if (!isFinite(L) || !isFinite(U)) {
      $('msg').textContent = 'Batas bawah dan atas harus berupa angka.';
      return;
    }

    db.set('fx', src); db.set('lo', L); db.set('hi', U);
    berhenti = false;
    $('go').disabled = true; $('stop').disabled = false;

    /* Baris 160: N=2, lalu baris 450: N=N*2 selamanya. Di sini dibatasi
       2^20 segmen — bukan karena aturannya berubah, melainkan karena halaman
       web tidak punya Ctrl-Break dan sebuah tab yang menggantung selamanya
       bukan perilaku yang jujur. */
    let N = 2, sebelum = null;
    for (let langkah = 0; langkah < 20 && !berhenti; langkah++) {
      const A = simpson(f, L, U, N);
      const beda = sebelum === null ? null : Math.abs(A - sebelum);
      const tr = ui.el('tr');
      tr.append(ui.el('td', { text: String(N) }),
                ui.el('td', { text: isFinite(A) ? A.toPrecision(12) : String(A) }),
                ui.el('td', { text: beda === null ? '—' : beda.toExponential(2) }));
      /* Baris yang selisihnya sudah di bawah presisi ganda ditandai: di situlah
         angkanya berhenti berubah, dan di situlah pemakai 1982 berhenti
         menatap layar. */
      if (beda !== null && beda <= Math.abs(A) * 1e-14) tr.className = 'i-diam';
      tbody.append(tr);
      sebelum = A;
      N *= 2;                                                    // baris 450
      await new Promise(r => setTimeout(r, 60));
    }
    $('go').disabled = false; $('stop').disabled = true;
    if (!berhenti) {
      $('msg').innerHTML = 'Berhenti di N = ' + (N / 2) +
        '. <span class="i-note">Aslinya tidak pernah berhenti — lihat panel di samping.</span>';
    }
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Integral by Simpson’s Rule',
    source: 'INTEGRAT.BAS · Phil Feldman & Tom Rugg · 1982',
    backHref: '../../index.html'
  }));

  $('go').addEventListener('click', jalankan);
  $('stop').addEventListener('click', () => { berhenti = true; });
  document.querySelectorAll('.i-contoh').forEach(b => {
    b.addEventListener('click', () => {
      $('fx').value = b.dataset.f;
      $('lo').value = b.dataset.lo;
      $('hi').value = b.dataset.hi;
      $('tepat').textContent = b.dataset.tepat || '';
      jalankan();
    });
  });

  $('fx').value = db.get('fx', 'sin(x)');
  $('lo').value = db.get('lo', 0);
  $('hi').value = db.get('hi', 3.14159265358979);
})();
