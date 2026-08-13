/* ===========================================================================
   solitair.js — port dari SOLITAIR.BAS
   "The Game of Klondyke Solitar", Jeff Littlefield, IBM PC + Color Graphics.
   Diubah Ken Handzik 27/11/1983 (menampilkan lambang kartu),
   direvisi Jeff Littlefield 2/2/1984 (petunjuk yang lebih baik).

   Berkas ini PILOT komponen kartu. Yang umum tinggal di `_shared/cards.js`;
   yang di sini hanya aturan Klondike dan tata letaknya.

   ------------------------------------------------------------------------
   EMPAT HAL YANG LAYAK DIBACA DARI ASLINYA

   1. Baris 1640 adalah kode mati.

        1610 IF SIZE$>"9" THEN 1650
        1620 IF SIZE$="0" AND SIZEST$="J" THEN 1700
        1630 IF SIZE$="9" AND SIZEST$="0" THEN 1700
        1640 IF SIZE$="A" AND SIZEST$="2" THEN 1700   <- tidak pernah dicapai

      Pangkat disimpan sebagai SATU huruf: "A", "2".."9", "0" untuk sepuluh,
      lalu "J","Q","K". Baris 1610 membelokkan semua pangkat berupa huruf ke
      1650 -- dan "A" adalah huruf ("A" = 65 > "9" = 57). Jadi aturan "As
      boleh ditumpuk di atas 2" yang ditulis penulisnya sendiri tidak pernah
      sekali pun dijalankan. Di port ini baris itu hidup.

   2. DECKPTR mulai dari 31, bukan 29.

        550 DECKPTR=31 : ENDDECK=52 : DECK$(28)="   " : NC=24

      Buangan menempati DECK$(29..52). Penunjuk yang mulai di 31 berarti TIGA
      kartu sudah dibuang sebelum pemain menyentuh apa pun: ini Klondike
      buang-tiga, dan keadaan awalnya identik dengan "sudah sekali tekan N".
      Karena itu port ini membuat keadaan awal dengan MEMANGGIL `ambil()`
      sekali, bukan dengan menulis angka 3.

      `at` di sini persis DECKPTR-28, dan ia sekaligus GARIS PEMISAH: kartu
      1..at sudah dibalik (buangan terbuka), at+1..n belum (tumpukan
      tertutup). Aslinya tidak pernah menggambar pemisah itu -- layar 80x25
      hanya menampilkan satu kartu. Port ini menggambarnya.

   3. Langkah antar tumpukan aslinya semua-atau-tidak.

        1920 W$ = STACK$(STKNUM1, VISIPTR(STKNUM1))    ' kartu terbuka PERTAMA
        2030 FOR I = VISIPTR(STKNUM1) TO STACKPTR(STKNUM1)

      Yang diperiksa kartu terbuka pertama, yang dipindah SELURUH deret.
      Itu bukan aturan Klondike -- Klondike mengizinkan memindah sebagian
      deret. Port ini memakai aturan Klondike: yang terangkat adalah kartu
      yang Anda pegang ke bawah. Perintah `##` yang lama tetap memindahkan
      seluruh deret, supaya antarmuka 1984 tetap berperilaku seperti 1984.

   4. Fondasi aslinya jalan satu arah.

      Tidak ada satu pun perintah untuk menurunkan kartu dari fondasi. Sekali
      naik, selamanya di atas. Klondike mengizinkan menurunkannya lagi, dan
      itu kadang satu-satunya jalan keluar. Port ini mengizinkannya.
   ------------------------------------------------------------------------ */

(function () {
  'use strict';

  const ui    = RETRO.ui;
  const K     = RETRO.cards;
  const audio = RETRO.audio;
  const store = RETRO.store('solitair');
  const rng   = RETRO.rng(RETRO.freshSeed());
  const clock = RETRO.clock();
  const $     = id => document.getElementById(id);

  const CARD_H = 82, OFF_UP = 21, OFF_DOWN = 8, OFF_WASTE = 19, TAMPAK = 3;
  const SUIT_OF = {};
  K.SUITS.forEach(s => { SUIT_OF[s.key] = s; });
  const last = a => (a.length ? a[a.length - 1] : null);

  /* --- keadaan -------------------------------------------------------------
       st[i]  <- STACK$(i+1, .)     up[i] <- VISIPTR(i+1), 0-based
       found  <- TOP$(1..4)         pile  <- DECK$(29..ENDDECK)
       at     <- DECKPTR - 28       (0 = penjaga DECK$(28); 1..n = kartu)

     `found` hanya menyimpan kartu TERATAS tiap lambang. Itu cukup, karena
     fondasi selalu berisi As..kartu-teratas tanpa lubang: menurunkan kartu
     bernilai v berarti yang di bawahnya pasti v-1. */
  let st, up, found, pile, at, moves, done, cheated;

  function deal() {
    const d = rng.shuffle(K.deck());
    st = []; up = [];
    let x = 0;
    for (let i = 0; i < 7; i++) {              // baris 470-540
      st.push(d.slice(x, x + i + 1));
      x += i + 1;
      up.push(i);                              // hanya kartu terakhir terbuka
    }
    found = { hearts: null, diamonds: null, clubs: null, spades: null };
    pile = d.slice(28);                        // 24 kartu, baris 550
    at = 0; ambil();                           // lihat catatan 2 di atas
    moves = 0; done = false; cheated = false;
    pick = null;
    clock.start();
  }

  /* --- aturan --------------------------------------------------------------
     Dua fungsi ini seluruh peraturan Klondike. Sisanya cuma memindah larik. */

  /** Baris 1590-1700. Warna berselang, pangkat turun satu. */
  function bolehTumpuk(c, target) {
    if (!c) return false;
    if (!target) return c.v === 13;               // 1670: hanya Raja
    if (c.color === target.color) return false;   // 1590-1600
    return target.v - c.v === 1;                  // 1620-1680 + 1640 yang mati
  }

  /** Baris 1710-1790. Naik satu, sesuai lambang. */
  function bolehFondasi(c, top) {
    if (!c) return false;
    if (!top) return c.v === 1;                   // 1710: hanya As
    return top.suit === c.suit && c.v - top.v === 1;
  }

  /* --- tumpukan tertutup dan buangan ---------------------------------------
     Satu larik, satu penunjuk, dua tampilan. `at` adalah garis pemisahnya. */

  /** Baris 1220-1240. Maju tiga, memutar lewat penjaga di pangkal. */
  function ambil() {
    const n = pile.length;
    if (at + 3 > n) at = 0;                       // 1220
    at = (n <= 3) ? n : at + 3;                   // 1240
  }

  /** Baris 1420-1510. Cabut kartu yang tampak, mundur satu. */
  function buang() { pile.splice(at - 1, 1); at -= 1; }

  const kartuBuangan = () => (at >= 1 && at <= pile.length) ? pile[at - 1] : null;
  const sisaTertutup = () => pile.length - at;

  /* --- apa yang sedang dipegang --------------------------------------------
     pick = {from:'w'}              kartu teratas buangan
            {from:'s', i, j}        tumpukan i, dari kartu ke-j sampai bawah
            {from:'f', suit}        kartu teratas fondasi

     Bentuk {i, j} inilah perubahan aturan nomor 3: `j` datang dari kartu yang
     benar-benar disentuh, bukan dari VISIPTR. */
  let pick = null;

  function terpilih() {
    if (!pick) return [];
    if (pick.from === 'w') { const c = kartuBuangan(); return c ? [c] : []; }
    if (pick.from === 'f') { const c = found[pick.suit]; return c ? [c] : []; }
    return st[pick.i].slice(pick.j);
  }

  /** Lepaskan yang terpilih dari asalnya. Harus dipanggil SESUDAH `terpilih()`. */
  function cabut() {
    if (pick.from === 'w') return buang();
    if (pick.from === 'f') {
      const c = found[pick.suit];
      found[pick.suit] = c.v > 1 ? K.card(c.v - 1, SUIT_OF[pick.suit]) : null;
      return;
    }
    const i = pick.i;
    st[i].length = pick.j;
    // Baris 2110-2120: kartu berikutnya terbuka -- tapi hanya kalau yang
    // terangkat memang seluruh deret terbukanya. Pada langkah sebagian,
    // `up[i]` masih menunjuk kartu yang tetap di tempatnya.
    if (up[i] > st[i].length - 1) up[i] = st[i].length ? st[i].length - 1 : 0;
  }

  function keTumpukan(k) {
    const run = terpilih();
    if (!run.length) return false;
    if (pick.from === 's' && pick.i === k) return false;
    if (!bolehTumpuk(run[0], last(st[k]))) return false;
    cabut();
    if (!st[k].length) up[k] = 0;
    st[k].push.apply(st[k], run);
    return true;
  }

  function keFondasi() {
    const run = terpilih();
    if (run.length !== 1 || pick.from === 'f') return false;
    const c = run[0];
    if (!bolehFondasi(c, found[c.suit])) return false;
    cabut();
    found[c.suit] = c;
    return true;
  }

  /** Baris 1800-1850: menang kalau keempat fondasi sampai Raja. */
  const menang = () => Object.keys(found).every(s => found[s] && found[s].v === 13);

  /** Baris 2610-2670: boleh diklaim kalau buangan habis dan semua terbuka. */
  const bolehKlaim = () => pile.length === 0 && up.every(u => u === 0) && !menang();

  /* --- bunyi ---------------------------------------------------------------- */
  const buzz = () => audio.sound(50, 5);           // SOUND 50,5
  const klik = () => audio.sound(1200, 0.4);
  const ding = () => audio.sound(1975, 0.5);       // SOUND 1975,.5

  function say(t, kind) {
    const e = $('say');
    e.textContent = t;
    e.className = 'k-say' + (kind ? ' k-say--' + kind : '');
  }
  function tolak(pesan) { buzz(); say(pesan || 'Illegal move.', 'bad'); }

  /* --- gambar --------------------------------------------------------------- */

  function draw() {
    /* tumpukan tertutup: satu punggung, plus bayangan tipis kalau masih tebal */
    const sisa = sisaTertutup();
    const s = $('stock'); s.textContent = '';
    if (sisa > 0) {
      if (sisa > 1) { const b = K.backEl(); b.style.top = '-3px'; s.append(b); }
      const b = K.backEl(); b.style.top = '0px'; s.append(b);
    } else {
      const e = K.slotEl(pile.length ? '↻' : '');
      e.style.top = '0px'; s.append(e);
    }
    $('stockN').textContent = sisa;

    /* buangan: tiga kartu terakhir berjajar, hanya yang teratas bisa diambil */
    const w = $('waste'); w.textContent = '';
    const tampak = pile.slice(Math.max(0, at - TAMPAK), at);
    tampak.forEach((c, n) => {
      const e = K.el(c);
      e.style.left = (n * OFF_WASTE) + 'px';
      if (n === tampak.length - 1) { e.classList.add('card--live'); e.dataset.pick = 'w'; }
      w.append(e);
    });
    if (!tampak.length) { const e = K.slotEl(''); e.style.left = '0px'; w.append(e); }
    w.style.width = (58 + Math.max(0, tampak.length - 1) * OFF_WASTE) + 'px';

    /* fondasi: bisa diambil lagi (perubahan 4) */
    const f = $('found'); f.textContent = '';
    K.SUITS.forEach(su => {
      const zone = ui.el('div', { class: 'k-zone' });
      zone.dataset.drop = 'f';
      const c = found[su.key];
      if (c) {
        const e = K.el(c);
        e.classList.add('card--live');
        e.dataset.pick = 'f:' + su.key;
        zone.append(e);
      } else {
        zone.append(K.slotEl(su.sym));
      }
      f.append(zone);
    });

    /* tujuh tumpukan */
    const t = $('tab'); t.textContent = '';
    st.forEach((col, i) => {
      const fan = ui.el('div', { class: 'fan' });
      fan.dataset.drop = 's:' + i;
      let y = 0, atas = 0;
      col.forEach((card, j) => {
        const terbuka = j >= up[i];
        const e = K.el(card, { up: terbuka });
        e.style.top = y + 'px';
        atas = y;
        if (terbuka) { e.classList.add('card--live'); e.dataset.pick = 's:' + i + ':' + j; }
        fan.append(e);
        y += terbuka ? OFF_UP : OFF_DOWN;
      });
      if (!col.length) { const e = K.slotEl('K'); e.style.top = '0px'; fan.append(e); }
      fan.style.height = (atas + CARD_H) + 'px';
      t.append(ui.el('div', { class: 'k-col' },
        [ui.el('div', { class: 'k-num', text: String(i + 1) }), fan]));
    });

    $('sLeft').textContent = pile.length;
    $('sMoves').textContent = moves;
    $('claim').disabled = !bolehKlaim();
    tandai();
    if (!done && menang()) selesai();
  }

  /* --- memilih -------------------------------------------------------------- */

  function tandai() {
    document.querySelectorAll('.card.is-picked')
            .forEach(e => e.classList.remove('is-picked'));
    terpilihEl().forEach(e => e.classList.add('is-picked'));
  }

  function terpilihEl() {
    if (!pick) return [];
    if (pick.from === 'w') return [].slice.call(document.querySelectorAll('#waste [data-pick]'));
    if (pick.from === 'f') return [].slice.call(document.querySelectorAll('[data-pick="f:' + pick.suit + '"]'));
    const fan = document.querySelector('[data-drop="s:' + pick.i + '"]');
    if (!fan) return [];
    return [].slice.call(fan.children).filter((e, j) => j >= pick.j);
  }

  function daftarKe(spec) {
    const b = spec.split(':');
    if (b[0] === 'w') return kartuBuangan() ? { from: 'w' } : null;
    if (b[0] === 'f') return found[b[1]] ? { from: 'f', suit: b[1] } : null;
    return st[+b[1]].length ? { from: 's', i: +b[1], j: +b[2] } : null;
  }

  const specDari = p => p.from === 'w' ? 'w'
                      : p.from === 'f' ? 'f:' + p.suit
                      : 's:' + p.i + ':' + p.j;

  function pilih(spec) {
    const p = daftarKe(spec);
    if (!p) return;
    pick = p;
    tandai();
    say('Terpilih ' + terpilih().map(K.label).join(' ') +
        '. Klik tujuannya, atau klik lagi untuk batal.');
  }

  function jatuhkan(spec) {
    if (!pick) return false;
    const ok = spec === 'f' ? keFondasi() : keTumpukan(+spec.split(':')[1]);
    if (ok) { moves++; pick = null; klik(); say(''); draw(); }
    else { tolak(); tandai(); }
    return ok;
  }

  /* --- perintah asli -------------------------------------------------------
     Antarmuka 1984: N, P#, PT, ##, #T, C. Perhatikan `##` dan `#T` sengaja
     tetap memakai VISIPTR / kartu terbawah -- perintah dua huruf memang tidak
     punya cara menyatakan "mulai dari kartu yang mana", jadi di jalur ini
     aturan semua-atau-tidak aslinya masih berlaku. */
  function perintah(sRaw) {
    const s = String(sRaw).trim().toUpperCase();
    if (!s || done) return;
    if (s === 'N') {
      if (!pile.length) return tolak('The pile is empty.');
      ambil(); pick = null; klik(); say(''); return draw();
    }
    if (s === 'C') return klaim();
    let m;
    if ((m = s.match(/^P([1-7T])$/))) {
      if (!kartuBuangan()) return tolak('No card on the pile.');
      pick = { from: 'w' };
    } else if ((m = s.match(/^([1-7])([1-7T])$/))) {
      const i = +m[1] - 1;
      if (!st[i].length) return tolak('That stack is empty.');
      pick = { from: 's', i: i, j: m[2] === 'T' ? st[i].length - 1 : up[i] };
    } else {
      return tolak('Unknown command.');
    }
    const tuj = m[m.length - 1];
    // Kalau gagal, lepaskan pilihannya DAN sorotannya. `jatuhkan` memanggil
    // `tandai()` sebelum kita sampai di sini, jadi tanpa `tandai()` kedua ini
    // kartu tetap tersorot padahal tidak ada yang terpilih.
    if (!jatuhkan(tuj === 'T' ? 'f' : 's:' + (+tuj - 1))) { pick = null; tandai(); }
  }

  function klaim() {
    if (!bolehKlaim()) return tolak('You Have Not Won Yet!!!');   // baris 2680
    Object.keys(found).forEach(s => { found[s] = K.card(13, SUIT_OF[s]); });
    st = st.map(() => []); up = up.map(() => 0); pile = []; at = 0;
    draw();
  }

  function selesai() {
    done = true; clock.pause();
    const detik = Math.round(clock.now());
    if (!cheated) {
      const best = store.get('best', null);
      if (best === null || detik < best) { store.set('best', detik); tampilRekor(); }
    }
    say('YOU WON  —  ' + moves + ' langkah, ' + waktu(detik), 'big');
    $('banner').hidden = false;
    [0, 130, 260, 460].forEach((ms, i) =>
      setTimeout(() => audio.note([60, 64, 67, 72][i], .22), ms));
  }

  const waktu = d => Math.floor(d / 60) + ':' + String(d % 60).padStart(2, '0');

  function tampilRekor() {
    const b = store.get('best', null);
    $('sBest').textContent = b === null ? '—' : waktu(b);
  }

  /* --- menyerah, dan tuduhan curang ---------------------------------------
     Baris 2230-2300 menawarkan melihat kartu tertutup saat menyerah, dan
     baris 2540 mengingatnya: "Cheater... Shame Shame!". Konsekuensinya juga
     dipertahankan: papan yang sudah diintip tidak berhak masuk rekor. */
  function menyerah() {
    if (done) return;
    ding(); setTimeout(ding, 140);            // "two short beeps", baris 970
    cheated = true; done = true; clock.pause();
    up = up.map(() => 0);
    say('Cheater... Shame Shame!  You have seen the cards.', 'bad');
    draw();
  }

  /* --- seret ---------------------------------------------------------------
     Ambang gerak 6px memisahkan "klik" dari "seret", jadi satu penangan
     melayani keduanya. Kartu yang terangkat adalah kartu yang ditekan, bukan
     seluruh deret -- lihat catatan 3 di kepala berkas. */
  let drag = null;

  document.addEventListener('pointerdown', e => {
    const pk = e.target.closest('[data-pick]');
    if (!pk || done || e.button) return;
    drag = { spec: pk.dataset.pick, id: e.pointerId,
             x0: e.clientX, y0: e.clientY, moved: false, ghost: null };
  });

  document.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved) {
      if (Math.abs(e.clientX - drag.x0) < 6 && Math.abs(e.clientY - drag.y0) < 6) return;
      drag.moved = true;
      if (!pick || specDari(pick) !== drag.spec) { pick = null; pilih(drag.spec); }
      if (!pick) { drag = null; return; }
      drag.ghost = ui.el('div', { class: 'k-ghost' });
      terpilih().forEach((c, i) => {
        const g = K.el(c); g.style.top = (i * OFF_UP) + 'px'; drag.ghost.append(g);
      });
      document.body.append(drag.ghost);
    }
    drag.ghost.style.left = (e.clientX - 26) + 'px';
    drag.ghost.style.top  = (e.clientY - 18) + 'px';
  });

  document.addEventListener('pointerup', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (!d.moved) return;                      // klik biasa: ditangani `click`
    d.ghost.remove();
    const bawah = document.elementFromPoint(e.clientX, e.clientY);
    const zone  = bawah && bawah.closest('[data-drop]');
    if (zone) jatuhkan(zone.dataset.drop);
    else { pick = null; tandai(); say(''); }
  });

  /* --- klik ----------------------------------------------------------------- */

  document.addEventListener('click', e => {
    if (done || e.detail > 1) return;          // detail>1 = klik kedua dblclick
    const pk   = e.target.closest('[data-pick]');
    const drop = e.target.closest('[data-drop]');
    if (pk && pick && specDari(pick) === pk.dataset.pick) {
      pick = null; tandai(); say(''); return;  // klik lagi = batal
    }
    if (pk && !pick) return pilih(pk.dataset.pick);
    if (drop && pick) return jatuhkan(drop.dataset.drop);
    if (pk && pick) return pilih(pk.dataset.pick);
  });

  /** Klik ganda pada kartu = kirim ke fondasi. */
  document.addEventListener('dblclick', e => {
    const pk = e.target.closest('[data-pick]');
    if (!pk || done) return;
    const p = daftarKe(pk.dataset.pick);
    if (!p) return;
    pick = p;
    if (!jatuhkan('f')) pick = null;
  });

  /* --- pemasangan ----------------------------------------------------------- */

  function papanBaru() {
    deal();
    $('banner').hidden = true;
    say('Pardon me while I shuffle the deck.');
    draw();
  }

  $('topbar-host').append(ui.topbar({
    title: 'Klondyke Solitaire',
    source: 'SOLITAIR.BAS &middot; Jeff Littlefield &middot; 1982&ndash;84'
  }));

  /* Tumpukan tertutup: sekali klik membuang tiga. Penangannya sendiri, bukan
     lewat delegasi `click` di atas, supaya klik ganda benar-benar berarti dua
     kali buang dan bukan satu. */
  $('stock').addEventListener('click', () => {
    if (done) return;
    if (!pile.length) return tolak('The pile is empty.');
    ambil(); pick = null; klik(); say(''); draw();
  });

  $('next').addEventListener('click', () => perintah('N'));
  $('claim').addEventListener('click', () => perintah('C'));
  $('restart').addEventListener('click', papanBaru);
  $('giveup').addEventListener('click', menyerah);
  $('resetBest').addEventListener('click', () => { store.remove('best'); tampilRekor(); });
  $('cmd').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    perintah(e.target.value); e.target.value = '';
  });

  setInterval(() => {
    $('sTime').textContent = waktu(Math.round(clock.now()));
  }, 500);

  tampilRekor();
  papanBaru();
})();
