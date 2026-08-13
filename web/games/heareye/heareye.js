/* ===========================================================================
   heareye.js — port dari HEAREYE.BAS (Friendlyware PC Introductory Set, 1982).

   Dua alat kesehatan rumahan: kartu mata Snellen dari aksara blok CGA, dan
   sapuan nada 100-30.000 Hz lewat pengeras suara PC.

   ------------------------------------------------------------------------
   SEMBILAN JEBAKAN TOMBOL YANG TIDAK MELAKUKAN APA-APA

       1080 ON KEY(1) GOSUB 1180
        ...          (sembilan baris)
       1160 ON KEY(9) GOSUB 1180
       1170 FOR A=1 TO 9:KEY(A) ON:NEXT
       1180 RETURN

   Sekilas ini terlihat seperti tombol yang sengaja dimatikan. Bukan.

   Di GW-BASIC, F1..F9 punya MAKRO bawaan: F1 mengetik "LIST", F2 "RUN", F3
   `LOAD"`. `KEY OFF` di baris 10 cuma menyembunyikan tampilannya di baris 25 —
   makronya tetap mengetik. Program ini membaca masukan lewat INKEY$, jadi
   tanpa jebakan itu menekan F1 akan menumpahkan L-I-S-T ke dalam uji.

   Jadi penangan kosong bukan "tidak jadi dibuat": pekerjaannya memang tidak
   melakukan apa-apa. Menjebak adalah cara mematikan makronya.

   Baris 1180 melayani dua peran: RETURN untuk GOSUB 1080, DAN badan
   kesembilan penangan. Satu baris, dua tugas, nol komentar.

   ------------------------------------------------------------------------
   SATU ANGKA YANG MENGUBAH ALAT UKUR

       970 IF I=14000 THEN J=10

   `J` adalah panjang tiap nada dalam tik pencacah PC (1/18,2 detik). Mulai
   dari 1, jadi 10 begitu sapuan mencapai 14.000 Hz — sepuluh kali lebih
   LAMBAT, bukan lebih cepat. Hasilnya: 7,6 detik untuk mencapai 14 kHz, lalu
   88,5 detik merayapi 14-30 kHz. Sembilan puluh dua persen waktunya
   dihabiskan di rentang tempat pendengaran orang benar-benar habis (baris
   810: "most people will lose the tone near 15,000 cycles per second").

   Kerapuhannya: `IF I=14000` memakai SAMA DENGAN. Ia benar hanya karena
   14.000 tepat kelipatan STEP 100 dan sapuan mulai dari 100.

   ------------------------------------------------------------------------
   "STAND BACK 20 FEET FROM THE SCREEN"

   Baris 300 menyuruh berdiri 20 kaki; baris 350 menjanjikan mata normal bisa
   membaca baris 20/20. Itu tidak bisa benar: ukuran aksara di layar teks
   tergantung ukuran FISIK monitornya, dan program tidak pernah
   menanyakannya.

   Kartu Snellen cetak tidak punya masalah ini — ia dicetak pada ukuran
   tertentu, sekali, selamanya. Memindahkannya ke layar membuang justru sifat
   yang membuatnya alat ukur.

   Port ini tidak berpura-pura memperbaikinya diam-diam: ukurannya
   DITANYAKAN, dengan benda yang sama di seluruh dunia (kartu ATM, 85,6 mm
   menurut ISO/IEC 7810 ID-1), lalu jarak baca yang benar dihitung dari situ.
   =========================================================================== */
(function () {
  'use strict';

  const { ui, audio, store, reader } = window.RETRO;
  const SCR = window.RETRO.HEAREYE_SCREENS || {};
  const META = window.RETRO.HEAREYE_META || {};
  const $ = (id) => document.getElementById(id);
  const db = store('heareye');

  const esc = (s) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function barisHtml(teks, att) {
    let out = '', mulai = 0;
    const sama = (a, b) => a[0] === b[0] && a[1] === b[1];
    for (let i = 1; i <= teks.length; i++) {
      if (i === teks.length || !sama(att[i], att[mulai])) {
        const [fg, bg] = att[mulai];
        out += '<span class="c' + fg + ' b' + bg + '">' +
               esc(teks.slice(mulai, i)) + '</span>';
        mulai = i;
      }
    }
    return '<span class="h-scr__row">' + out + '</span>';
  }

  function layar(nama, label) {
    const s = SCR[nama];
    const crt = ui.el('div', { class: 'h-crt' });
    const scr = ui.el('div', { class: 'h-scr' });
    scr.setAttribute('role', 'img');
    scr.setAttribute('aria-label', label + '. ' +
      s.teks.filter(b => b.trim()).join('. '));
    scr.innerHTML = s.teks.map((t, i) => barisHtml(t, s.att[i])).join('');
    crt.append(scr);
    return crt;
  }

  function kepala(judul, baris) {
    const k = ui.el('div', { class: 'h-kepala' });
    k.append(ui.el('h2', { text: judul }),
             ui.el('span', { class: 'mono', text: 'HEAREYE.BAS ' + baris }));
    return k;
  }

  /* --- penyetel ukuran fisik ---------------------------------------------
     Kartu ATM: 85,6 mm (ISO/IEC 7810 ID-1). Itu satu-satunya benda yang
     hampir pasti ada di dekat pemakai DAN ukurannya sama di seluruh dunia. */
  const KARTU_MM = 85.6;

  /* Optotipe 20/20 menghadang 5 menit busur pada jarak ujinya — itu
     definisinya, bukan pilihan. Jadi jarak yang benar bisa dihitung terbalik
     dari tinggi hurufnya. */
  const MENIT5 = Math.tan(5 / 60 * Math.PI / 180);      // ~0,001454

  function kalibrasi(host, crtEl) {
    const box = ui.el('div', { class: 'e-kalib' });
    box.append(ui.el('p', { class: 'e-kalib__judul',
                            text: 'Setel ukuran layar dulu' }));

    const acuan = ui.el('div', { class: 'e-kartu-acuan',
                                 text: 'kartu ATM · 8,56 cm' });
    const geser = ui.el('input', { type: 'range', min: 120, max: 700, step: 1 });
    const nilai = ui.el('span', { class: 'mono', style: 'font-size:12px' });
    const baris = ui.el('div', { class: 'e-kalib__baris' });
    baris.append(geser, nilai);

    const hasil = ui.el('p', { class: 'e-hasil' });
    box.append(acuan, baris, hasil);
    host.append(box);

    function terap() {
      const lebarPx = Number(geser.value);
      acuan.style.width = lebarPx + 'px';
      const pxPerMm = lebarPx / KARTU_MM;
      nilai.textContent = pxPerMm.toFixed(2) + ' px/mm';
      db.set('pxmm', pxPerMm);

      /* Tinggi optotipe 20/20 diukur dari yang BENAR-BENAR tergambar, bukan
         dari angka yang ditulis di sini. Barisnya memakai dua baris teks. */
      const barisEl = crtEl.querySelector('.h-scr__row');
      const tinggiPx = barisEl ? barisEl.getBoundingClientRect().height * 2 : 0;
      const tinggiMm = tinggiPx / pxPerMm;
      const jarakM = (tinggiMm / 1000) / MENIT5;
      const kaki = jarakM * 3.28084;
      hasil.innerHTML =
        'Optotipe 20/20 di layar ini setinggi <b>' + tinggiMm.toFixed(1) +
        ' mm</b>, jadi jarak baca yang benar adalah <b>' + jarakM.toFixed(1) +
        ' m</b> (' + kaki.toFixed(1) + ' kaki). Aslinya menyuruh berdiri ' +
        '<span class="e-jauh">20 kaki</span> tanpa pernah menanyakan ukuran layar.';
    }

    geser.addEventListener('input', terap);
    const simpan = Number(db.get('pxmm', 0));
    geser.value = simpan ? Math.round(simpan * KARTU_MM) : 320;
    terap();
    /* Ukurannya bergantung pada lebar layar yang tergambar, jadi ia harus
       dihitung ulang saat jendelanya berubah. */
    window.addEventListener('resize', terap);
  }

  /* --- uji nada ----------------------------------------------------------- */
  const N = META.nada || {};
  const NYQUIST = 22050;

  function ujiNada(host) {
    const box = ui.el('div', { class: 'e-nada' });

    const hz = ui.el('p', { class: 'e-hz e-hz--diam', text: '—' });
    const mulai = ui.el('button', { class: 'btn btn--primary', type: 'button',
                                    text: 'Mulai' });
    const ulang = ui.el('button', { class: 'btn btn--ghost', type: 'button',
                                    text: 'Ulang' });
    const baris1 = ui.el('div', { class: 'e-nada__baris' });
    baris1.append(mulai, ulang, hz);

    const sapu = ui.el('div', { class: 'e-sapu' });
    const isi = ui.el('div', { class: 'e-sapu__isi' });
    const posAmbang = (N.ambang - N.awal) / (N.akhir - N.awal) * 100;
    const posNyq = (NYQUIST - N.awal) / (N.akhir - N.awal) * 100;
    sapu.append(isi,
      ui.el('div', { class: 'e-sapu__mati', style: 'left:' + posNyq + '%' }),
      ui.el('div', { class: 'e-sapu__ambang', style: 'left:' + posAmbang + '%' }),
      ui.el('div', { class: 'e-sapu__nyquist', style: 'left:' + posNyq + '%' }));

    const label = ui.el('div', { class: 'e-sapu__label' });
    label.append(ui.el('span', { text: N.awal + ' Hz' }),
                 ui.el('span', { text: N.ambang / 1000 + 'k — melambat 10×' }),
                 ui.el('span', { text: N.akhir / 1000 + 'k' }));

    const hasil = ui.el('p', { class: 'e-hasil' });
    const catat = ui.el('p', { class: 'e-catat',
      html: 'Di atas <b>' + NYQUIST.toLocaleString('id') + ' Hz</b> Web Audio ' +
            'tidak bisa menghasilkan nadanya (batas Nyquist pada 44,1 kHz). ' +
            'Bagian berarsir bukan pengukuran.' });

    box.append(baris1, sapu, label, hasil, catat);
    host.append(box);

    let i = N.awal, jalan = false, timer = 0;

    function setel(f) {
      hz.textContent = f.toLocaleString('id') + ' Hz';
      hz.classList.toggle('e-hz--diam', !jalan);
      isi.style.width = ((f - N.awal) / (N.akhir - N.awal) * 100) + '%';
    }

    function langkah() {
      if (!jalan) return;
      if (i > N.akhir) return selesai(true);
      const tik = i >= N.ambang ? N.durLambat : N.durCepat;
      setel(i);
      if (i <= NYQUIST) audio.sound(i, tik);
      const ms = tik * (N.tik * 1000);
      i += N.langkah;
      timer = setTimeout(langkah, ms);
    }

    function selesai(habis) {
      jalan = false;
      clearTimeout(timer);
      audio.stop();
      mulai.textContent = 'Mulai';
      const f = Math.min(i - N.langkah, N.akhir);
      hz.classList.add('e-hz--diam');
      hasil.innerHTML = habis
        ? 'Sapuan selesai sampai ' + N.akhir.toLocaleString('id') + ' Hz.'
        : 'Tombol ditekan pada <b>' + f.toLocaleString('id') + ' Hz</b>' +
          (f > NYQUIST ? ' — <span class="e-jauh">di atas batas Nyquist, ' +
                         'jadi bukan pengukuran</span>' : '') + '.';
    }

    mulai.addEventListener('click', () => {
      if (jalan) return selesai(false);
      jalan = true;
      mulai.textContent = 'Berhenti — tidak terdengar lagi';
      hasil.textContent = '';
      langkah();
    });
    ulang.addEventListener('click', () => {
      selesai(false);
      i = N.awal; hasil.textContent = ''; setel(N.awal);
      hz.textContent = '—';
    });

    setel(N.awal);
    hz.textContent = '—';
  }

  // --- pemasangan ---
  $('topbar-host').append(ui.topbar({
    title: 'Hearing And Eye Test',
    source: 'HEAREYE.BAS · Friendlyware · 1982',
    backHref: '../../index.html'
  }));

  /* Lima halaman. Aslinya DUA alur maju-saja yang dipilih dari menu, dan
     tidak ada tombol mundur sama sekali. Menjadikannya satu urutan yang bisa
     dibolak-balik adalah TAMBAHAN — keputusan pemakai koleksi ini, sesi 15 —
     dan dicatat di tabel empat kolom dokumennya. */
  const HAL = [
    { label: 'Menu', baris: '10–150',
      build(h) { h.append(kepala('Menu', '10–150'), layar('menu', 'Layar menu')); } },
    { label: 'Petunjuk uji mata', baris: '210–390',
      build(h) { h.append(kepala('Petunjuk uji mata', '210–390'),
                          layar('mataInfo', 'Petunjuk uji mata')); } },
    { label: 'Kartu mata', baris: '400–660',
      build(h) {
        const crt = layar('mataKartu', 'Kartu mata Snellen');
        h.append(kepala('Kartu mata', '400–660'), crt);
        kalibrasi(h, crt);
      } },
    { label: 'Petunjuk uji pendengaran', baris: '700–860',
      build(h) { h.append(kepala('Petunjuk uji pendengaran', '700–860'),
                          layar('dengarInfo', 'Petunjuk uji pendengaran')); } },
    { label: 'Uji nada', baris: '870–1060',
      build(h) { h.append(kepala('Uji nada', '870–1060')); ujiNada(h); } }
  ];

  reader($('reader'), {
    key: 'heareye',
    pages: HAL,
    onPage(n) {
      $('s-hal').textContent = (n + 1) + ' / ' + HAL.length;
      $('s-baris').textContent = HAL[n].baris;
      audio.stop();
    }
  });

  /* --- angka-angka, dihitung dari datanya sendiri ------------------------- */
  $('k-nada').textContent = N.awal + '–' + N.akhir.toLocaleString('id') + ' Hz';
  $('tbl-nada').innerHTML =
    '<thead><tr><th>Bagian sapuan</th><th>Langkah</th><th>Waktu</th></tr></thead><tbody>' +
    '<tr><td>' + N.awal + ' – ' + N.ambang.toLocaleString('id') + ' Hz (1 tik)</td><td>' +
      N.langkahCepat + '</td><td>' + N.detikCepat + ' dtk</td></tr>' +
    '<tr><td>' + N.ambang.toLocaleString('id') + ' – ' + N.akhir.toLocaleString('id') +
      ' Hz (' + N.durLambat + ' tik)</td><td>' + N.langkahLambat + '</td><td>' +
      N.detikLambat + ' dtk</td></tr>' +
    '<tr><td><b>Bagian di atas 14 kHz</b></td><td>—</td><td><b>' +
      Math.round(N.detikLambat / N.detikTotal * 100) + '% waktunya</b></td></tr>' +
    '</tbody>';
})();
