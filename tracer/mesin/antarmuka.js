/* ===========================================================================
   antarmuka.js — merakit halaman: layar, panel sumber, kendali, kotak
   pelajaran, dan pengukur cakupan.

   Berkas ini tidak boleh memutuskan apa pun tentang program yang ditelusuri.
   Semua yang ditampilkannya dibaca dari dua tempat:

     window.SUMBER[nama]   larik baris berkas .BAS, dihasilkan dari run/
     window.PROGRAM[nama]  tabel baris + teks pelajaran

   Sorotan diambil dari penunjuk milik penjalan, bukan dihitung ulang di sini.
   Kalau nanti ada yang tergoda "memperbaiki" sorotan di lapisan tampilan,
   itulah saat rancangan ini mulai bohong.
   =========================================================================== */

(function (global) {
  'use strict';

  var T = global.TRACER;
  var UI = global.RETRO && global.RETRO.ui;

  /* Nama berkas DOS tidak peduli besar-kecil huruf: RUN"tictac" dan
     RUN"TICTAC" menunjuk berkas yang sama. */
  function kunci(nama) { return String(nama).toUpperCase(); }

  function cariProgram(nama) { return global.PROGRAM[kunci(nama)] || null; }
  function adaSumber(nama)   { return !!global.SUMBER[kunci(nama)]; }

  /* --- jembatan ke port lengkap di web/games/ -------------------------------

     Katalog 83 program dipakai ulang apa adanya dari web/_shared/catalog.js;
     berkas itu tidak disunting. Yang dicari medan `base` — nama berkas .BAS
     tanpa akhiran — karena itulah yang ditulis di dalam `RUN "..."`.

     Tiga kemungkinan, dan ketiganya punya arti berbeda:
       portnya siap      -> buka games/<id>/
       merged            -> program itu TIDAK jadi aplikasi terpisah; ia
                            melebur jadi shell koleksi (MENU dan MENU2 begitu)
       belum siap        -> katakan fasenya, jangan diam-diam gagal */
  function cariPort(nama) {
    var katalog = (global.RETRO && global.RETRO.CATALOG) || [];
    var k = kunci(nama), i, p;
    for (i = 0; i < katalog.length; i++) {
      p = katalog[i];
      if (String(p.base).toUpperCase() !== k) continue;
      if (p.merged) {
        return { id: p.id, judul: p.title, catatan: p.merged,
                 url: '../web/index.html' };
      }
      if (p.ready) {
        return { id: p.id, judul: p.title,
                 url: '../web/games/' + p.id + '/index.html' };
      }
      return { id: p.id, judul: p.title, url: null,
               catatan: 'fase ' + (p.phase || 'belum dijadwalkan') };
    }
    return null;
  }

  function bukaPort(port) { global.location.assign(port.url); }

  /* Kode pindai papan ketik IBM PC untuk tombol yang tidak punya kode ASCII.
     Angkanya bukan pilihan bebas: inilah nilai yang benar-benar dikirim BIOS,
     dan yang diperiksa program-program di koleksi ini. */
  var PINDAI = {
    ArrowUp: 72, ArrowLeft: 75, ArrowRight: 77, ArrowDown: 80,
    Home: 71, End: 79, PageUp: 73, PageDown: 81, Insert: 82, Delete: 83
  };

  var el = {};          /* elemen yang dipakai berulang */
  var barisEl = {};     /* nomorBaris -> elemen baris di panel sumber */
  var penjalan = null;
  var lajuPilihan = [1, 2, 4, 8, 16, 40, 120, 600];

  function mulai() {
    el.layar     = document.getElementById('layar');
    el.sumber    = document.getElementById('sumber');
    el.status    = document.getElementById('status');
    el.lencana   = document.getElementById('lencana');
    el.pesan     = document.getElementById('pesan');
    el.cakupan     = document.getElementById('cakupan');
    el.cakupanTeks = document.getElementById('cakupan-teks');
    el.meterIsi  = document.getElementById('meter-isi');
    el.pelajaran  = document.getElementById('pelajaran');
    el.peta       = document.getElementById('peta');
    el.petaKunci  = document.getElementById('peta-kunci');
    el.pseudokode = document.getElementById('pseudokode');
    el.penjelasan = document.getElementById('penjelasan');
    el.pilih     = document.getElementById('pilih-program');
    el.judulKode = document.getElementById('judul-kode');

    el.perintah    = document.getElementById('perintah-asli');
    el.catatanAsli = document.getElementById('catatan-asli');
    el.tSalin      = document.getElementById('t-salin');

    el.tJalan   = document.getElementById('t-jalan');
    el.tLangkah = document.getElementById('t-langkah');
    el.tUlang   = document.getElementById('t-ulang');
    el.laju     = document.getElementById('laju');
    el.lajuTeks = document.getElementById('laju-teks');

    pasangTopbar();

    var konsol = new T.Konsol(el.layar);
    penjalan = new T.Penjalan({
      konsol: konsol,
      cariProgram: cariProgram,
      adaSumber: adaSumber,
      cariPort: cariPort,
      bukaPort: bukaPort,
      saatBerubah: gambarKeadaan
    });
    global.PENJALAN = penjalan;   /* pintu untuk pengujian dari konsol peramban */

    isiPilihanProgram();
    pasangKendali();
    pasangSalin();
    pasangPapanKetik();

    muatProgram('MENU');
  }

  /* --- bilah atas ---------------------------------------------------------- */

  function pasangTopbar() {
    var induk = document.getElementById('topbar-host');
    if (!UI || !induk) return;
    UI.initTheme();
    induk.appendChild(UI.topbar({
      title: 'Penelusur Baris<small>program BASIC koleksi DOS lawas</small>',
      backHref: '../web/index.html',
      sound: false
    }));
  }

  /* --- daftar program ------------------------------------------------------ */

  function isiPilihanProgram() {
    var nama, opsi, semua = Object.keys(global.SUMBER).sort();
    for (var i = 0; i < semua.length; i++) {
      nama = semua[i];
      opsi = document.createElement('option');
      opsi.value = nama;
      if (cariProgram(nama)) {
        opsi.textContent = nama;
      } else {
        /* Program yang sumbernya ada tapi tabelnya belum ditulis tetap
           didaftarkan, dan tetap dimatikan. Menyembunyikannya berarti
           menyembunyikan cakupan yang belum penuh. */
        opsi.textContent = nama + ' — belum ditelusuri';
        opsi.disabled = true;
      }
      el.pilih.appendChild(opsi);
    }
    el.pilih.addEventListener('change', function () {
      muatProgram(el.pilih.value);
    });
  }

  function muatProgram(nama) {
    var prog = cariProgram(nama);
    if (!prog) return;
    el.pilih.value = kunci(nama);
    gambarSumber(prog);
    gambarSusunan(prog);
    gambarPelajaran(prog);
    gambarPembanding(prog);
    penjalan.muat(prog);
  }

  /* --- panel sumber -------------------------------------------------------- */

  function gambarSumber(prog) {
    var sumber = global.SUMBER[prog.sumber] || [];
    var hasil = T.pemeriksa.periksa(sumber, prog.tabel);

    el.judulKode.textContent = prog.berkas;
    el.sumber.innerHTML = '';
    barisEl = {};

    var adaDiTabel = {};
    for (var i = 0; i < prog.tabel.length; i++) adaDiTabel[prog.tabel[i].baris] = true;

    var frag = document.createDocumentFragment();
    for (i = 0; i < sumber.length; i++) {
      var n = T.pemeriksa.nomorBaris(sumber[i]);
      var baris = document.createElement('div');
      baris.className = 't-baris' + (n !== null && !adaDiTabel[n] ? ' t-baris--kosong' : '');

      var no = document.createElement('span');
      no.className = 't-baris__no';
      no.textContent = n === null ? '' : n;

      var henti = document.createElement('span');
      henti.className = 't-baris__henti';
      henti.textContent = '●';

      var kode = document.createElement('span');
      kode.className = 't-baris__kode';
      /* Nomor barisnya sudah tampil di kolom kiri; yang di sini isi barisnya. */
      kode.textContent = n === null ? sumber[i]
                       : sumber[i].replace(/^\s*\d+\s?/, '');

      baris.appendChild(no);
      baris.appendChild(henti);
      baris.appendChild(kode);

      if (n !== null && adaDiTabel[n]) {
        barisEl[n] = baris;
        (function (nomor, elemen) {
          function alih() {
            var pasang = penjalan.aturTitikHenti(nomor);
            elemen.classList.toggle('t-baris--henti', pasang);
          }
          no.addEventListener('click', alih);
          henti.addEventListener('click', alih);
        })(n, baris);
      }
      frag.appendChild(baris);
    }
    el.sumber.appendChild(frag);
    gambarCakupan(hasil);
  }

  function gambarCakupan(h) {
    var teks = h.cocok + '/' + h.totalAsli + ' baris (' + h.persen + '%)';
    var cacat = [];
    if (h.asing.length)       cacat.push(h.asing.length + ' baris asing');
    if (h.kembar.length)      cacat.push(h.kembar.length + ' nomor kembar');
    if (h.urutanRusak.length) cacat.push('urutan tabel tidak menaik');

    el.cakupanTeks.textContent = teks;
    el.meterIsi.style.width = h.persen + '%';
    el.meterIsi.className = 't-meter__isi' + (h.persen < 100 ? ' t-meter__isi--sebagian' : '');

    var judul = 'Cakupan tabel baris terhadap berkas .BAS aslinya.';
    if (h.hilang.length) {
      judul += '\nBelum punya padanan: ' + T.pemeriksa.ringkas(h.hilang, h.asli);
    }
    if (cacat.length) judul += '\nCACAT: ' + cacat.join(', ');
    el.cakupan.title = judul;
    el.cakupan.classList.toggle('t-pesan--gagal', cacat.length > 0);
  }

  /* --- bagaimana program ini disusun ---------------------------------------

     Tiga hal untuk satu pertanyaan yang sama, dari tiga jarak berbeda:

       peta alur    bentuk keseluruhannya, sekali lihat
       pseudokode   langkahnya dalam bahasa manusia, sebaris demi sebaris
       penjelasan   kenapa bentuknya begitu

     Nomor baris di pseudokode bisa diklik dan menyorot baris aslinya di panel
     kanan. Itu jembatan yang paling dibutuhkan pemula: dari "saya mengerti apa
     yang dilakukan" ke "saya tahu baris mana yang melakukannya". */

  function gambarSusunan(prog) {
    /* Peta alur. Digambar dari data yang sama dengan sumber Mermaid di
       docs/, jadi gambar di halaman dan gambar di dokumen tidak mungkin
       bercerita hal yang berbeda. */
    el.peta.innerHTML = '';
    if (prog.arsitektur) {
      el.peta.appendChild(T.peta.gambar(prog.arsitektur));
      el.petaKunci.innerHTML = kunciBentuk(prog.arsitektur);
    } else {
      el.peta.textContent = 'Peta alur untuk program ini belum ditulis.';
      el.petaKunci.textContent = '';
    }

    /* Diagram tambahan. Flowchart selalu ada; yang ini menambah, bukan
       menggantikan. Program sederhana tidak punya satu pun — dan memang tidak
       perlu. Yang punya keadaan, giliran, atau percakapan antar-subrutin
       biasanya butuh. */
    var wadah = el.peta.parentNode;
    Array.prototype.slice.call(wadah.querySelectorAll('.t-peta-lain'))
      .forEach(function (n) { n.remove(); });

    (prog.diagramLain || []).forEach(function (d) {
      var blok = document.createElement('div');
      blok.className = 't-peta-lain';

      var judul = document.createElement('p');
      judul.className = 't-judul-kecil';
      judul.textContent = d.judul;
      blok.appendChild(judul);

      if (d.keterangan) {
        var ket = document.createElement('p');
        ket.className = 't-peta-lain__ket';
        ket.innerHTML = d.keterangan;
        blok.appendChild(ket);
      }

      var kotak = document.createElement('div');
      kotak.appendChild(T.peta.gambar(d));
      blok.appendChild(kotak);
      wadah.appendChild(blok);
    });

    /* Pseudokode. */
    el.pseudokode.innerHTML = '';
    (prog.pseudokode || []).forEach(function (langkah) {
      var li = document.createElement('li');
      li.className = 't-pseudo__baris t-pseudo__baris--t' + (langkah.tingkat || 0);

      var no = document.createElement('button');
      no.type = 'button';
      no.className = 't-pseudo__no';
      no.textContent = langkah.baris;
      no.title = 'Sorot baris ' + langkah.baris + ' di kode asli';
      no.addEventListener('click', function () { tunjukBaris(langkah.baris); });

      var teks = document.createElement('span');
      teks.className = 't-pseudo__teks';
      teks.innerHTML = langkah.teks;

      li.appendChild(no);
      li.appendChild(teks);
      el.pseudokode.appendChild(li);
    });

    /* Penjelasan. */
    var html = '';
    (prog.penjelasan || []).forEach(function (bagian) {
      html += '<div class="t-jelas"><h3>' + bagian.judul + '</h3>';
      bagian.isi.forEach(function (p) { html += '<p>' + p + '</p>'; });
      html += '</div>';
    });
    el.penjelasan.innerHTML = html;
  }

  /* Kunci bentuk hanya menyebut bentuk yang benar-benar dipakai peta ini —
     daftar lengkap yang setengahnya tidak muncul justru membingungkan. */
  function kunciBentuk(arsitektur) {
    var NAMA = {
      mulai: 'awal/akhir', proses: 'kerjakan', putusan: 'pilihan',
      subrutin: 'subrutin', keluar: 'keluar', galat: 'jalur galat'
    };
    var ada = {}, urut = [];
    arsitektur.simpul.forEach(function (s) {
      var j = s.jenis || 'proses';
      if (!ada[j]) { ada[j] = true; urut.push(j); }
    });
    var html = urut.map(function (j) {
      return '<span class="t-kunci__item peta__simpul--' + j + '">' +
             '<span class="t-kunci__kotak"></span>' + NAMA[j] + '</span>';
    }).join('');
    return html + '<span class="t-kunci__catatan">gelung digambar di kanan, ' +
           'lompatan-maju di kiri</span>';
  }

  /* Menyorot satu baris sumber tanpa menjalankan apa pun — dipakai tombol
     nomor baris di pseudokode. Sorotan sementara ini sengaja dibedakan
     warnanya dari sorotan "sedang dijalankan", supaya tidak ada yang mengira
     penunjuknya pindah. */
  function tunjukBaris(nomor) {
    var baris = barisEl[nomor];
    if (!baris) return;
    Object.keys(barisEl).forEach(function (k) {
      barisEl[k].classList.remove('t-baris--tunjuk');
    });
    baris.classList.add('t-baris--tunjuk');
    gulungKe(baris);
  }

  /* --- kotak pelajaran ----------------------------------------------------- */

  function gambarPelajaran(prog) {
    var p = prog.pelajaran || {};
    var html = '';
    if (p.ringkas) html += '<p class="t-pelajaran__ringkas">' + p.ringkas + '</p>';
    html += '<div class="t-kolom">';
    html += kolomDaftar('Yang bisa dipelajari', p.pelajari);
    html += kolomDaftar('Yang jangan ditiru', p.hindari);
    html += '</div>';

    if (prog.penyimpangan && prog.penyimpangan.length) {
      html += '<div class="t-catatan"><b>Yang tidak sama dengan aslinya</b><ul>';
      for (var i = 0; i < prog.penyimpangan.length; i++) {
        html += '<li>' + prog.penyimpangan[i] + '</li>';
      }
      html += '</ul></div>';
    }
    el.pelajaran.innerHTML = html;
  }

  function kolomDaftar(judul, daftar) {
    if (!daftar || !daftar.length) return '';
    var html = '<div><p class="t-judul-kecil">' + judul + '</p><ul class="t-daftar">';
    for (var i = 0; i < daftar.length; i++) {
      html += '<li><b>' + daftar[i][0] + '</b><span>' + daftar[i][1] + '</span></li>';
    }
    return html + '</ul></div>';
  }

  /* --- pembanding GW-BASIC asli --------------------------------------------

     Kenapa perintah yang disalin, bukan DOSBox di dalam halaman? Dua alasan,
     keduanya keras:

     1. DOSBox-di-peramban (js-dos) perlu memuat berkas WebAssembly dari CDN.
        Halaman ini harus jalan dari file:// tanpa jaringan sama sekali.
     2. Emulator itu kotak hitam: tidak ada cara menanyakan baris berapa yang
        sedang dijalankan GW-BASIC di dalamnya. Panel kanan tidak akan punya
        apa pun untuk disorot — justru fitur yang seluruh halaman ini bangun.

     Yang terpasang di mesin ini sudah lebih baik daripada keduanya: GW-BASIC
     sungguhan ada di run/GW.EXE, DOSBox-X sudah terpasang, dan run/*.bat sudah
     memasang profil perangkat keras yang benar (IBM PC, CGA, 4,77 MHz). */

  function gambarPembanding(prog) {
    el.perintah.textContent = prog.perintahAsli || ('run\\' + prog.nama + '.bat');
    el.catatanAsli.textContent = prog.catatanAsli || '';
  }

  function pasangSalin() {
    if (!el.tSalin) return;
    el.tSalin.addEventListener('click', function () {
      var teks = el.perintah.textContent;
      var beres = function () {
        el.tSalin.textContent = 'Tersalin';
        setTimeout(function () { el.tSalin.textContent = 'Salin'; }, 1400);
      };
      /* navigator.clipboard tidak tersedia di file://; pilih jalan lama. */
      if (global.navigator.clipboard && global.isSecureContext) {
        global.navigator.clipboard.writeText(teks).then(beres, salinCaraLama);
      } else {
        salinCaraLama();
      }
      function salinCaraLama() {
        var kotak = document.createElement('textarea');
        kotak.value = teks;
        kotak.setAttribute('readonly', '');
        kotak.style.position = 'fixed';
        kotak.style.opacity = '0';
        document.body.appendChild(kotak);
        kotak.select();
        try { document.execCommand('copy'); beres(); } catch (e) { /* biarkan */ }
        document.body.removeChild(kotak);
      }
    });
  }

  /* --- kendali ------------------------------------------------------------- */

  function pasangKendali() {
    el.tJalan.addEventListener('click', function () {
      if (penjalan.status === 'jalan') penjalan.jeda();
      else penjalan.mulai();
    });
    el.tLangkah.addEventListener('click', function () {
      penjalan.jeda();
      penjalan.langkah();
    });
    el.tUlang.addEventListener('click', function () {
      muatProgram(penjalan.program.nama);
    });
    el.laju.max = String(lajuPilihan.length - 1);
    el.laju.addEventListener('input', pakaiLaju);
    el.laju.value = '3';
    pakaiLaju();
  }

  function pakaiLaju() {
    var n = lajuPilihan[parseInt(el.laju.value, 10)];
    penjalan.aturLaju(n);
    el.lajuTeks.textContent = n >= 600 ? 'secepatnya' : n + ' baris/dtk';
  }

  /* --- papan ketik --------------------------------------------------------- */

  function pasangPapanKetik() {
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      var t = e.target.tagName;
      if (t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA') return;

      /* F1..F10 tidak pernah masuk INKEY$; ia hanya memicu jebakan ON KEY.
         F11 dan F12 dilewatkan ke peramban (layar penuh, alat pengembang) -
         keduanya tidak dipakai program mana pun di koleksi ini. */
      var fungsi = /^F([1-9]|10)$/.exec(e.key);
      if (fungsi) {
        e.preventDefault();
        penjalan.tekanFungsi(parseInt(fungsi[1], 10));
        return;
      }

      /* Tombol tanpa kode ASCII - panah, Home, PgUp - dikirim INKEY$ sebagai
         DUA karakter: CHR$(0) diikuti kode pindai papan ketiknya. Itu sebabnya
         program lama memeriksanya dengan `RIGHT$(Z$,1)=CHR$(75)`, bukan
         `Z$=CHR$(75)`. */
      if (PINDAI[e.key] !== undefined) {
        e.preventDefault();
        penjalan.tekan('\u0000' + String.fromCharCode(PINDAI[e.key]));
        return;
      }

      var ch = null;
      if (e.key.length === 1) ch = e.key;
      else if (e.key === 'Enter') ch = '\r';
      else if (e.key === 'Escape') ch = '\u001b';
      if (ch === null) return;      /* Tab dan tombol lain lewat begitu saja */

      /* Spasi menggulung halaman dan menekan tombol yang sedang berfokus;
         keduanya tidak diinginkan saat tombol itu ditujukan ke program. */
      e.preventDefault();
      penjalan.tekan(ch);
    });
  }

  /* --- menggambar keadaan -------------------------------------------------- */

  function gambarKeadaan(P) {
    var n = P.barisSekarang();

    for (var kunciBaris in barisEl) {
      barisEl[kunciBaris].classList.remove('t-baris--aktif');
    }
    if (n !== null && barisEl[n]) {
      barisEl[n].classList.add('t-baris--aktif');
      gulungKe(barisEl[n]);
    }

    el.lencana.textContent = P.status;
    el.lencana.className = 't-lencana t-lencana--' + P.status;
    el.pesan.textContent = P.pesan || '';
    el.pesan.className = 't-pesan' + (P.status === 'gagal' ? ' t-pesan--gagal' : '');

    el.tJalan.textContent = P.status === 'jalan' ? 'Jeda' : 'Jalan';
    var mati = (P.status === 'selesai' || P.status === 'gagal');
    el.tJalan.disabled = mati;
    el.tLangkah.disabled = mati;
  }

  /* Menggulung wadah sumbernya sendiri, bukan halamannya. scrollIntoView akan
     menyeret seluruh halaman ikut bergerak setiap kali baris berganti. */
  function gulungKe(baris) {
    var wadah = el.sumber;
    var atas = baris.offsetTop - wadah.offsetTop;
    var bawah = atas + baris.offsetHeight;
    var pandanganAtas = wadah.scrollTop;
    var pandanganBawah = pandanganAtas + wadah.clientHeight;
    var batas = baris.offsetHeight * 3;

    if (atas < pandanganAtas + batas) {
      wadah.scrollTop = Math.max(0, atas - batas);
    } else if (bawah > pandanganBawah - batas) {
      wadah.scrollTop = bawah - wadah.clientHeight + batas;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
  } else {
    mulai();
  }
})(window);
