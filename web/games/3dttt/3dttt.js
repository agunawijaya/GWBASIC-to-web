/* ===========================================================================
   3dttt.js — port dari 3DTTT.EXE ("LU's 3D Game", 1984).

   Basisnya `decompile/3DTTT/3dttt-run.bas` — 1.150 baris hasil rekompilasi,
   berjalan tanpa galat, NOL panggilan runtime tak tertangani. Program terbesar
   dari empat EXE yang dibongkar, dan satu-satunya yang punya lawan komputer.

   ------------------------------------------------------------------------
   TEMUAN 1 — SEPARUH PROGRAMNYA ARITMETIKA, DAN ITU YANG MEMBUKA ISINYA

   Cacah operasi dari pembongkaran:

       aritmetika  LET! 426, LOAD! 297, ARITH! 233, FACSTORE! 95 …   50%
       tampilan    PRINT 198, LOCATE 154, COLOR 115 …                27%
       subrutin    GOSUB 96 panggilan -> 31 target                    5%

   Untuk permainan yang papannya 4x4x4 dan bidaknya cuma X/O, lima puluh persen
   aritmetika *single-precision* tidak wajar — kecuali kalau programnya
   MENGEVALUASI POSISI. Bentuk percabangannya menegaskan: **679 cabang melawan
   10 gelung**. Itu bukan program yang mengulang; itu program yang memutuskan.

   ------------------------------------------------------------------------
   TEMUAN 2 — PAPANNYA LARIK 5x5x5, BUKAN 4x4x4

   Indeksnya terbaca utuh di banyak tempat:

       G3!( CINT(F11!) + (CINT(F6!) * 5 + CINT(F12!)) * 5 )

   Itu `x + (z*5 + y)*5` — langkah 5, bukan 4. Papan 4x4x4 disimpan di larik
   5x5x5 dan baris/kolom indeks 0 dibiarkan kosong, supaya koordinat 1..4 bisa
   dipakai apa adanya tanpa dikurangi satu di setiap pemakaian. Menghamburkan
   61 sel dari 125 untuk menghemat satu pengurangan di ratusan tempat.

   ------------------------------------------------------------------------
   TEMUAN 3 — 76 GARIS, DIHITUNG DUA CARA

   Bukan angka yang dikutip. Dihitung di berkas ini saat halaman dimuat
   (`bangunGaris()`), dan dicocokkan dengan rumus tertutup:

       pencacahan langsung                    -> 76
       ((n+2)^3 - n^3)/2  untuk n=4           -> 76

   Rinciannya: 48 lurus (satu sumbu bergerak), 24 diagonal bidang (dua sumbu),
   4 diagonal ruang (tiga sumbu). 48 + 24 + 4 = 76.

   Rumus keduanya punya alasan yang bagus: bungkus kubus dengan satu lapis, lalu
   tiap garis menembus tepat DUA sel selubung — jadi cacah selubung dibagi dua.

   ------------------------------------------------------------------------
   YANG BUKAN DARI ASLINYA — DINYATAKAN TERANG

   Penilai posisi di sini **rekonstruksi saya**, bukan pemulihan. `ARCHITECTURE.md`
   §2 menyatakan pemetaan 31 target GOSUB ke fungsi permainan BELUM dikerjakan,
   jadi algoritma persisnya belum terbaca. Yang saya bangun sekeluarga dengannya —
   penilai yang memeriksa ke-76 garis — tapi bukan yang sama.

   Karena itu kekuatannya DIUKUR, bukan dideskripsikan: lihat `ukurKekuatan()`
   di bawah, dan angkanya di `web/docs/3dttt.md`.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, rng } = window.RETRO;
  const $ = (id) => document.getElementById(id);
  const db = store('3dttt');

  const N = 4;
  const KOSONG = 0, MANUSIA = 1, KOMPUTER = 2;

  // =========================================================================
  // Garis kemenangan — dihitung, tidak dikutip
  // =========================================================================
  const idx = (z, y, x) => (z * N + y) * N + x;

  function bangunGaris() {
    const lihat = new Set(), keluar = [];
    for (let dz = -1; dz <= 1; dz++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          if (!dz && !dy && !dx) continue;
          for (let z = 0; z < N; z++)
            for (let y = 0; y < N; y++)
              for (let x = 0; x < N; x++) {
                const sel = [];
                for (let t = 0; t < N; t++) {
                  const p = [z + dz * t, y + dy * t, x + dx * t];
                  if (p.some(v => v < 0 || v >= N)) break;
                  sel.push(idx(p[0], p[1], p[2]));
                }
                if (sel.length !== N) continue;
                const kunci = sel.slice().sort((a, b) => a - b).join(',');
                if (lihat.has(kunci)) continue;
                lihat.add(kunci);
                keluar.push(sel.slice().sort((a, b) => a - b));
              }
        }
    return keluar;
  }

  const GARIS = bangunGaris();

  /* Sel -> garis yang melewatinya. Dipakai penilai supaya tidak menyapu ke-76
     garis untuk tiap sel kosong; sel sudut cuma dilewati 7 garis, sel tengah 13. */
  const GARIS_DI = Array.from({ length: N * N * N }, () => []);
  GARIS.forEach((g, i) => g.forEach(s => GARIS_DI[s].push(i)));

  // =========================================================================
  // Keadaan
  // =========================================================================
  let papan, giliran, selesai, langkahTerakhir, statistik;

  function reset() {
    papan = new Array(N * N * N).fill(KOSONG);
    giliran = MANUSIA;
    selesai = null;
    langkahTerakhir = null;
    statistik = { langkah: 0, ancamanDiblok: 0, ancamanMuncul: 0 };
  }

  function garisMenang(pemain) {
    for (const g of GARIS) if (g.every(s => papan[s] === pemain)) return g;
    return null;
  }

  const penuh = () => papan.every(v => v !== KOSONG);

  // =========================================================================
  // Penilai posisi — REKONSTRUKSI, bukan pemulihan
  // =========================================================================
  /* Bobot naik tajam terhadap jumlah bidak sebaris. Alasannya bukan selera:
     garis berisi tiga bidak adalah ancaman yang HARUS dijawab langkah berikutnya,
     sementara garis berisi dua baru potensi. Kalau bobotnya linear, penilai akan
     menukar satu ancaman nyata dengan dua potensi — dan kalah. */
  const BOBOT = [0, 1, 12, 200];

  function nilaiSel(s, pemain) {
    const lawan = pemain === MANUSIA ? KOMPUTER : MANUSIA;
    let n = 0;
    for (const gi of GARIS_DI[s]) {
      const g = GARIS[gi];
      let milik = 0, punyaLawan = false;
      for (const c of g) {
        if (papan[c] === pemain) milik++;
        else if (papan[c] === lawan) { punyaLawan = true; break; }
      }
      if (punyaLawan) continue;          // garis mati untuk pemain ini
      n += BOBOT[milik];
    }
    return n;
  }

  /* Urutan keputusan: menang sekarang > halangi kekalahan > nilai gabungan.
     Dua yang pertama mutlak; yang ketiga heuristik. */
  function pilihLangkah(pemain) {
    const lawan = pemain === MANUSIA ? KOMPUTER : MANUSIA;
    const kosong = [];
    for (let s = 0; s < papan.length; s++) if (papan[s] === KOSONG) kosong.push(s);

    for (const s of kosong) {                       // 1. menang sekarang
      papan[s] = pemain;
      const menang = !!garisMenang(pemain);
      papan[s] = KOSONG;
      if (menang) return { sel: s, sebab: 'menang' };
    }
    for (const s of kosong) {                       // 2. halangi lawan menang
      papan[s] = lawan;
      const kalah = !!garisMenang(lawan);
      papan[s] = KOSONG;
      if (kalah) return { sel: s, sebab: 'blok' };
    }
    let terbaik = null, skorTerbaik = -1;           // 3. nilai gabungan
    for (const s of kosong) {
      const n = nilaiSel(s, pemain) + nilaiSel(s, lawan);  // serang + bertahan
      if (n > skorTerbaik) { skorTerbaik = n; terbaik = s; }
    }
    return { sel: terbaik, sebab: 'nilai' };
  }

  // =========================================================================
  // Pengukuran kekuatan — §9b: ukur, jangan taksir
  // =========================================================================
  const selKosong = () => {
    const k = [];
    for (let s = 0; s < papan.length; s++) if (papan[s] === KOSONG) k.push(s);
    return k;
  };

  /* Dua lawan uji, dan alasan ada dua.

     Versi pertama pengukuran ini cuma memakai lawan ACAK, hasilnya 200 menang
     dari 200 — dan angka itu tidak mengukur apa pun. Sebuah pengujian yang tidak
     bisa gagal tidak memberi informasi; ia cuma memberi rasa aman. Lawan acak
     nyaris tak pernah menyusun tiga sebaris, jadi cabang "halangi" di penilai
     hampir tidak pernah diuji (3 kesempatan dalam 200 permainan).

     Lawan kedua "rakus": ambil kemenangan langsung, kalau tidak halangi
     kemenangan lawan, kalau tidak main acak. Ia tidak pintar, tapi ia MENGHUKUM
     — dan itu yang membuat angkanya berarti. */
  const LAWAN = {
    acak(acak) { return acak.pick(selKosong()); },
    rakus(acak) {
      const kosong = selKosong();
      for (const s of kosong) {                      // menang sekarang
        papan[s] = MANUSIA;
        const w = !!garisMenang(MANUSIA);
        papan[s] = KOSONG;
        if (w) return s;
      }
      for (const s of kosong) {                      // halangi
        papan[s] = KOMPUTER;
        const w = !!garisMenang(KOMPUTER);
        papan[s] = KOSONG;
        if (w) return s;
      }
      return acak.pick(kosong);
    }
  };

  /* Dijalankan atas permintaan, bukan saat memuat: ratusan permainan penuh
     memakan waktu, dan halaman harus siap dipakai lebih dulu. */
  function ukurKekuatan(jumlah, jenisLawan) {
    const simpan = papan;
    const acak = rng(20260809);                     // benih tetap -> bisa diulang
    const gerakLawan = LAWAN[jenisLawan];
    let menang = 0, seri = 0, kalah = 0, blok = 0, adaAncaman = 0;
    for (let p = 0; p < jumlah; p++) {
      papan = new Array(N * N * N).fill(KOSONG);
      let siapa = p % 2 ? KOMPUTER : MANUSIA;       // giliran pertama bergantian
      for (;;) {
        if (siapa === KOMPUTER) {
          // sebelum bergerak: apakah lawan punya ancaman menang langsung?
          let ancaman = null;
          for (const s of selKosong()) {
            papan[s] = MANUSIA;
            if (garisMenang(MANUSIA)) ancaman = s;
            papan[s] = KOSONG;
            if (ancaman !== null) break;
          }
          const m = pilihLangkah(KOMPUTER);
          if (ancaman !== null) {
            adaAncaman++;
            if (m.sebab === 'menang' || m.sel === ancaman) blok++;
          }
          papan[m.sel] = KOMPUTER;
        } else {
          papan[gerakLawan(acak)] = MANUSIA;
        }
        if (garisMenang(KOMPUTER)) { menang++; break; }
        if (garisMenang(MANUSIA)) { kalah++; break; }
        if (penuh()) { seri++; break; }
        siapa = siapa === KOMPUTER ? MANUSIA : KOMPUTER;
      }
    }
    papan = simpan;
    return { jumlah, menang, seri, kalah, adaAncaman, blok };
  }

  // =========================================================================
  // Gambar
  // =========================================================================
  /* Papan dibangun sebagai KUBUS 3D, bukan empat kisi datar.

     Versi pertama menampilkan empat papan 4x4 bersebelahan -- tata letak layar
     1984-nya, dan setia. Tapi kesetiaan itu memindahkan pekerjaan yang paling
     sulit ke kepala pemain: empat diagonal ruang menembus keempat lapis
     sekaligus, dan di tampilan datar tidak ada satu pun cara MELIHATnya. Pemain
     harus membayangkannya.

     Layar teks 80x25 tahun 1984 tidak punya pilihan lain. Peramban punya. Jadi
     kubusnya digambar sebagai kubus, dan bisa diputar -- karena satu sudut
     pandang saja tetap menyembunyikan sebagian garis di belakang yang lain.

     Tampilan datarnya tetap disediakan sebagai saklar, bukan dibuang: ia yang
     asli, dan untuk membaca satu lapis secara cepat ia memang lebih jelas. */
  const JARAK = 84;                      // jarak antar sel, piksel

  function papanEl() {
    const panggung = document.createElement('div');
    panggung.className = 't-panggung';

    const kubus = document.createElement('div');
    kubus.className = 't-kubus';
    kubus.id = 'kubus';

    /* Dua belas rusuk kubus.

       Versi pertama menghitungnya dengan satu rumus untuk ketiga sumbu sekaligus
       dan hasilnya salah: yang keluar garis-garis liar menembak ke luar kubus,
       bukan kerangka. Sebabnya `transform` CSS dibaca KANAN-KE-KIRI, jadi
       `rotate` yang ditulis sesudah `translate` berputar di sekitar titik yang
       sudah dipindahkan -- bukan di tempatnya sendiri.

       Sekarang ketiga sumbu ditulis terpisah. Lebih panjang, tapi tiap barisnya
       bisa dibaca sendiri: rusuk sejajar X batang mendatar, yang sejajar Y batang
       tegak, yang sejajar Z batang mendatar yang diputar 90 derajat supaya
       menghadap ke dalam layar. */
    const R = JARAK * 1.62, T = R * 2;
    const rusuk = (gaya) => {
      const g = document.createElement('i');
      g.className = 't-rusuk';
      Object.assign(g.style, gaya);
      kubus.append(g);
    };
    [[-R, -R], [-R, R], [R, -R], [R, R]].forEach(([b, c]) => {
      rusuk({ width: T + 'px', height: '1px',
              transform: 'translate3d(' + (-R) + 'px,' + b + 'px,' + c + 'px)' });
      rusuk({ width: '1px', height: T + 'px',
              transform: 'translate3d(' + b + 'px,' + (-R) + 'px,' + c + 'px)' });
      rusuk({ width: T + 'px', height: '1px',
              transform: 'translate3d(' + b + 'px,' + c + 'px,' + (-R) + 'px) rotateY(-90deg)',
              transformOrigin: '0 0' });
    });

    for (let z = 0; z < N; z++)
      for (let y = 0; y < N; y++)
        for (let x = 0; x < N; x++) {
          const b = document.createElement('button');
          b.className = 't-sel';
          b.type = 'button';
          b.dataset.sel = idx(z, y, x);
          b.style.transform = 'translate3d('
            + ((x - 1.5) * JARAK) + 'px,'
            + ((y - 1.5) * JARAK) + 'px,'
            + ((z - 1.5) * JARAK) + 'px)';
          b.setAttribute('aria-label',
            'lapis ' + (z + 1) + ' baris ' + (y + 1) + ' kolom ' + (x + 1));
          b.addEventListener('click', () => main(idx(z, y, x)));
          kubus.append(b);
        }
    panggung.append(kubus);
    return panggung;
  }

  // --- putar bebas --------------------------------------------------------
  let putarX = -22, putarY = 32, seret = null;

  function terapkanPutar() {
    const k = $('kubus');
    if (k) k.style.transform =
      'rotateX(' + putarX + 'deg) rotateY(' + putarY + 'deg)';
  }

  function pasangPutar(panggung) {
    /* Pointer Events, bukan mouse+touch terpisah: satu jalur untuk tetikus,
       sentuh, dan pena. `setPointerCapture` membuat seretan tetap terkirim
       walau kursornya keluar dari panggung -- tanpa itu, seretan cepat akan
       "lepas" di tengah jalan. */
    panggung.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.t-sel')) return;    // klik sel bukan seretan
      seret = { x: e.clientX, y: e.clientY, px: putarX, py: putarY };
      panggung.setPointerCapture(e.pointerId);
      panggung.classList.add('is-seret');
    });
    panggung.addEventListener('pointermove', (e) => {
      if (!seret) return;
      putarY = seret.py + (e.clientX - seret.x) * 0.45;
      putarX = seret.px - (e.clientY - seret.y) * 0.45;
      putarX = Math.max(-89, Math.min(89, putarX));   // jangan terbalik
      terapkanPutar();
    });
    const lepas = (e) => {
      if (!seret) return;
      seret = null;
      panggung.classList.remove('is-seret');
      try { panggung.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    panggung.addEventListener('pointerup', lepas);
    panggung.addEventListener('pointercancel', lepas);

    // Papan ketik: kubus harus bisa diputar tanpa tetikus.
    panggung.tabIndex = 0;
    panggung.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 15 : 5;
      if (e.key === 'ArrowLeft') putarY -= step;
      else if (e.key === 'ArrowRight') putarY += step;
      else if (e.key === 'ArrowUp') putarX -= step;
      else if (e.key === 'ArrowDown') putarX += step;
      else return;
      e.preventDefault();
      putarX = Math.max(-89, Math.min(89, putarX));
      terapkanPutar();
    });
  }

  function gambar() {
    document.querySelectorAll('.t-sel').forEach(b => {
      const v = papan[+b.dataset.sel];
      b.textContent = v === MANUSIA ? 'X' : v === KOMPUTER ? 'O' : '';
      b.className = 't-sel' + (v ? ' is-isi is-p' + v : '')
        + (langkahTerakhir === +b.dataset.sel ? ' is-akhir' : '');
      b.disabled = !!v || !!selesai;
    });
    if (selesai && selesai.garis)
      selesai.garis.forEach(s => {
        const el = document.querySelector('.t-sel[data-sel="' + s + '"]');
        if (el) el.classList.add('is-menang');
      });

    $('s-giliran').textContent = selesai ? '—'
      : giliran === MANUSIA ? 'Anda (X)' : 'Komputer (O)';
    $('s-langkah').textContent = statistik.langkah;
    $('s-garis').textContent = GARIS.length;
    $('s-hidup').textContent = garisHidup();
    $('s-status').textContent = selesai ? selesai.pesan : 'berjalan';
  }

  /* Garis yang MASIH bisa dimenangkan siapa pun — turun cepat dan menjelaskan
     kenapa permainan 4x4x4 hampir selalu berakhir seri di antara dua pemain
     yang sama-sama memblok. */
  function garisHidup() {
    let n = 0;
    for (const g of GARIS) {
      let a = false, b = false;
      for (const s of g) {
        if (papan[s] === MANUSIA) a = true;
        else if (papan[s] === KOMPUTER) b = true;
      }
      if (!(a && b)) n++;
    }
    return n;
  }

  // =========================================================================
  // Alur permainan
  // =========================================================================
  function taruh(sel, pemain) {
    papan[sel] = pemain;
    langkahTerakhir = sel;
    statistik.langkah++;
    const z = Math.floor(sel / (N * N)), sisa = sel % (N * N);
    $('s-akhir').textContent = (z + 1) + ',' + (Math.floor(sisa / N) + 1)
      + ',' + (sisa % N + 1);
    $('s-oleh').textContent = pemain === MANUSIA ? 'Anda' : 'Komputer';
    const g = garisMenang(pemain);
    if (g) {
      selesai = { garis: g, pesan: pemain === MANUSIA ? 'Anda menang' : 'Komputer menang' };
      audio.play(pemain === MANUSIA ? 'mbt190o2l8ccego4c' : 'mbl8t255o3gedco2g');
    } else if (penuh()) {
      selesai = { garis: null, pesan: 'Seri' };
    } else {
      audio.sound(pemain === MANUSIA ? 880 : 440, 1);
    }
  }

  function main(sel) {
    if (selesai || giliran !== MANUSIA || papan[sel] !== KOSONG) return;
    taruh(sel, MANUSIA);
    giliran = KOMPUTER;
    gambar();
    if (selesai) return akhiri();
    // Jeda pendek supaya langkah komputer terlihat sebagai jawaban, bukan
    // sebagai bagian dari klik pemain. Aslinya menulis "Please Wait" di sini.
    $('s-status').textContent = 'Please Wait';
    setTimeout(() => {
      const m = pilihLangkah(KOMPUTER);
      if (m.sebab === 'blok') statistik.ancamanDiblok++;
      taruh(m.sel, KOMPUTER);
      giliran = MANUSIA;
      gambar();
      if (selesai) akhiri();
    }, 220);
  }

  function akhiri() {
    const kunci = selesai.pesan === 'Anda menang' ? 'menang'
      : selesai.pesan === 'Seri' ? 'seri' : 'kalah';
    const c = db.get('catatan', { menang: 0, seri: 0, kalah: 0 });
    c[kunci]++;
    db.set('catatan', c);
    segarkanCatatan();
    ui.toast(selesai.pesan);
    $('go').textContent = 'Main lagi';
  }

  function segarkanCatatan() {
    const c = db.get('catatan', { menang: 0, seri: 0, kalah: 0 });
    $('s-catatan').textContent = c.menang + ' / ' + c.seri + ' / ' + c.kalah;
  }

  function mulai() {
    reset();
    $('s-akhir').textContent = '—';
    $('s-oleh').textContent = '—';
    $('go').textContent = 'Ulang';
    gambar();
  }

  // =========================================================================
  // Pemasangan
  // =========================================================================
  $('topbar-host').append(ui.topbar({
    title: "LU's 3D Game",
    source: '3DTTT.EXE · "LU" · 1984 · dibongkar dari EXE',
    backHref: '../../index.html'
  }));

  const panggung = papanEl();
  $('layar').append(panggung);
  pasangPutar(panggung);
  terapkanPutar();

  $('datar').addEventListener('click', () => {
    const rata = panggung.classList.toggle('is-datar');
    $('datar').setAttribute('aria-pressed', String(rata));
    $('datar').textContent = rata ? 'Tampilan: datar' : 'Tampilan: kubus';
  });
  $('tegak').addEventListener('click', () => {
    putarX = -22; putarY = 32; terapkanPutar();
  });

  $('go').addEventListener('click', mulai);

  $('ukur').addEventListener('click', () => {
    $('ukur').disabled = true;
    $('ukur').textContent = 'Menghitung…';
    // Diberi satu putaran event supaya tombolnya sempat berubah sebelum
    // gelung sinkron yang panjang menahan untai utama.
    setTimeout(() => {
      const baris = [];
      for (const jenis of ['acak', 'rakus']) {
        const h = ukurKekuatan(200, jenis);
        baris.push('lawan ' + jenis + ': ' + h.menang + ' menang / ' + h.seri
          + ' seri / ' + h.kalah + ' kalah  ·  ancaman diblok '
          + h.blok + '/' + h.adaAncaman);
      }
      $('u-hasil').innerHTML = baris.join('<br>');
      $('ukur').textContent = 'Ukur ulang';
      $('ukur').disabled = false;
    }, 20);
  });

  // Cek silang 76 garis, dicetak ke panel supaya bisa dilihat, bukan dipercaya.
  const rumus = (Math.pow(N + 2, 3) - Math.pow(N, 3)) / 2;
  $('g-cacah').textContent = GARIS.length;
  $('g-rumus').textContent = rumus;
  $('g-cocok').textContent = (GARIS.length === rumus) ? 'cocok' : 'TIDAK COCOK';
  const perSumbu = { 1: 0, 2: 0, 3: 0 };
  GARIS.forEach(g => {
    const p = g.map(s => [Math.floor(s / (N * N)), Math.floor((s % (N * N)) / N), s % N]);
    let bergerak = 0;
    for (let k = 0; k < 3; k++) if (new Set(p.map(q => q[k])).size > 1) bergerak++;
    perSumbu[bergerak]++;
  });
  $('g-lurus').textContent = perSumbu[1];
  $('g-bidang').textContent = perSumbu[2];
  $('g-ruang').textContent = perSumbu[3];

  reset();
  gambar();
  segarkanCatatan();
})();
