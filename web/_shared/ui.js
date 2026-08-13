/* ===========================================================================
   ui.js — komponen antarmuka bersama.

   DARI RETRO KE MODERN
   --------------------
   Di aslinya, "antarmuka" berarti menulis karakter ke posisi tertentu:

       190 LOCATE 24,12: COLOR 15,0: PRINT "Strike Any Key To Continue";
       120 COLOR 0,7: LOCATE 2,29: PRINT " F R I E N D L Y W A R E "

   Baris bantuan selalu di baris 24 atau 25, judul selalu di tengah atas.
   Konsistensi itu dijaga dengan disiplin manusia, bukan oleh alat apa pun —
   dan tiap program menyalin ulang rutin bingkainya sendiri (ANATOMY, HISTORY,
   dan HINTS punya mesin halaman yang identik dengan nomor baris berbeda).

   Di sini konsistensi itu dijaga oleh berkas ini. Perbaiki sekali, berlaku
   di semua aplikasi — sesuatu yang tidak mungkin dilakukan dengan menyalin
   berkas seperti dulu.
   =========================================================================== */
(function (global) {
  'use strict';

  const doc = global.document;

  function el(tag, attrs, children) {
    const n = doc.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(c => n.append(c));
    return n;
  }

  /* --- tema ---------------------------------------------------------------
     Bawaannya mengikuti sistem. Pilihan pengguna disimpan dan menang. */
  const THEME_KEY = 'retro:theme';

  function applyTheme(mode) {
    if (mode === 'system') doc.documentElement.removeAttribute('data-theme');
    else doc.documentElement.setAttribute('data-theme', mode);
    try { global.localStorage.setItem(THEME_KEY, mode); } catch (e) { /* abaikan */ }
  }

  function initTheme() {
    let saved = 'system';
    try { saved = global.localStorage.getItem(THEME_KEY) || 'system'; } catch (e) {}
    applyTheme(saved);
    return saved;
  }

  /* `opts` boleh menimpa labelnya. Dipakai halaman peluncur yang bilingual;
     ke-66 halaman permainan memanggilnya tanpa argumen dan tidak berubah
     sedikit pun — itulah sebabnya bawaannya tetap di sini, bukan dipindah
     jadi kewajiban tiap pemanggil. */
  function themeToggle(opts) {
    opts = opts || {};
    const order = ['system', 'dark', 'light'];
    const label = opts.label ||
      { system: 'Tema: sistem', dark: 'Tema: gelap', light: 'Tema: terang' };
    let cur = initTheme();
    const btn = el('button', {
      class: 'btn btn--ghost btn--sm', type: 'button',
      title: opts.title || 'Ganti tema', text: label[cur]
    });
    btn.addEventListener('click', () => {
      cur = order[(order.indexOf(cur) + 1) % order.length];
      applyTheme(cur);
      btn.textContent = label[cur];
    });
    return btn;
  }

  /* --- toast --------------------------------------------------------------- */
  let toastHost = null;
  function toast(message, ms) {
    if (!toastHost) {
      toastHost = el('div', { class: 'toast-host', role: 'status',
                              'aria-live': 'polite' });
      doc.body.append(toastHost);
    }
    const t = el('div', { class: 'toast', text: message });
    toastHost.append(t);
    setTimeout(() => {
      t.style.transition = 'opacity .25s';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 260);
    }, ms || 2200);
  }

  /* --- dialog -------------------------------------------------------------
     Padanan modern dari:
       190 LOCATE 8,23: PRINT "Would You Like Instructions? <Y/N>"
       200 A$=INKEY$: IF A$="" THEN 200
     Bedanya: bisa ditutup Esc, fokus terkunci di dalam, dan pembaca layar tahu
     bahwa ini dialog. */
  function dialog(opts) {
    const d = el('dialog', { class: 'modal' });
    const box = el('div', { class: 'stack' });
    if (opts.title) box.append(el('h2', { class: 'h2', text: opts.title }));
    if (opts.body) {
      box.append(typeof opts.body === 'string'
        ? el('p', { class: 'prose', html: opts.body })
        : opts.body);
    }
    const actions = el('div', { class: 'row', style: 'justify-content:flex-end' });
    const buttons = opts.buttons || [{ label: 'OK', value: true, primary: true }];
    buttons.forEach(b => actions.append(el('button', {
      class: 'btn' + (b.primary ? ' btn--primary' : ''), type: 'button',
      text: b.label, onclick: () => { d.dataset.value = JSON.stringify(b.value); d.close(); }
    })));
    box.append(actions);
    d.append(box);
    doc.body.append(d);

    return new Promise(resolve => {
      d.addEventListener('close', () => {
        let v = null;
        try { v = JSON.parse(d.dataset.value || 'null'); } catch (e) {}
        d.remove();
        resolve(v);
      });
      d.showModal();
      const first = d.querySelector('.btn--primary') || d.querySelector('.btn');
      if (first) first.focus();
    });
  }

  const confirmYesNo = (title, body) => dialog({
    title, body,
    buttons: [{ label: 'Ya', value: true, primary: true },
              { label: 'Tidak', value: false }]
  });

  /* --- pemilih instrumen ---------------------------------------------------
     Tidak ada padanannya di aslinya: speaker PC hanya bisa gelombang kotak,
     satu suara, tanpa pilihan. Pilihan bawaan tetap "Speaker PC (asli)" —
     itu satu-satunya yang terdengar seperti mesin sungguhannya. */
  const INSTR_KEY = 'retro:instrument';

  /**
   * Deretan tombol instrumen.
   *
   * Versi pertama memakai `<select>` di bilah atas. Dua alasan menggantinya:
   *
   *   Jarak.   `<select>` butuh dua tindakan — buka, lalu pilih — dan
   *            daftarnya menutupi halaman selama terbuka. Untuk sesuatu yang
   *            dipakai sambil mendengarkan, itu terlalu jauh.
   *   Tempat.  Instrumen bukan pengaturan halaman seperti tema; ia bagian
   *            dari alat musiknya. Tempatnya di dekat papan tuts, bukan di
   *            bilah atas bersama tombol kembali.
   *
   * Delapan pilihan masih nyaman sebagai tombol. Kalau suatu saat jadi tiga
   * puluh, `<select>` akan menang lagi — jumlah menentukan bentuk.
   */
  function instrumentBar(opts) {
    opts = opts || {};
    const A = global.RETRO && global.RETRO.audio;
    if (!A || !A.available) return el('div');

    let saved = null;
    try { saved = global.localStorage.getItem(INSTR_KEY); } catch (e) {}
    if (saved) A.setInstrument(saved);

    const bar = el('div', { class: 'picker', role: 'group',
                            'aria-label': 'Instrumen' });
    bar.append(el('span', { class: 'picker__label', text: 'Instrumen' }));

    const btns = [];
    const sync = () => btns.forEach(b => b.setAttribute(
      'aria-pressed', b.dataset.id === A.instrument ? 'true' : 'false'));

    A.instruments.forEach(i => {
      const b = el('button', { class: 'picker__btn', type: 'button',
                               text: i.label, title: i.label });
      b.dataset.id = i.id;
      b.addEventListener('click', () => {
        /* Berlaku SEKETIKA, termasuk di tengah lagu yang sedang berjalan.
           Itu dimungkinkan oleh penjadwal beruntun di audio.js — nada baru
           dijadwalkan 120 ms sebelum berbunyi, jadi ia membaca instrumen
           yang berlaku saat itu, bukan saat tombol Mainkan ditekan. */
        A.setInstrument(i.id);
        try { global.localStorage.setItem(INSTR_KEY, i.id); } catch (e) {}
        sync();
        if (opts.onChange) opts.onChange(i.id);
      });
      btns.push(b);
      bar.append(b);
    });

    sync();
    return bar;
  }

  /* --- bilah atas standar --------------------------------------------------
     Semua aplikasi memakai ini, jadi tombol kembali dan pengalih tema selalu
     ada di tempat yang sama — padanan disiplin "baris 25 selalu baris bantuan". */
  function topbar(opts) {
    const right = el('div', { class: 'row' });
    (opts.actions || []).forEach(a => right.append(a));
    if (opts.sound !== false) right.append(soundToggle());
    right.append(themeToggle());

    return el('header', { class: 'topbar' }, [
      el('div', { class: 'wrap topbar__inner' }, [
        el('a', { class: 'btn btn--ghost btn--sm', href: opts.backHref || '../../index.html',
                  text: '← Semua program' }),
        el('div', { class: 'topbar__title', html:
          opts.title + (opts.source ? '<small>' + opts.source + '</small>' : '') }),
        el('div', { class: 'topbar__spacer' }),
        right
      ])
    ]);
  }

  function soundToggle() {
    const A = global.RETRO && global.RETRO.audio;
    if (!A || !A.available) return el('span');
    const btn = el('button', { class: 'btn btn--ghost btn--sm', type: 'button',
                               text: 'Suara: nyala', title: 'Nyalakan/matikan suara' });
    btn.addEventListener('click', () => {
      const m = A.setMuted(!A.muted);
      btn.textContent = m ? 'Suara: mati' : 'Suara: nyala';
    });
    return btn;
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.ui = { el, toast, dialog, confirmYesNo, topbar, instrumentBar,
                      themeToggle, soundToggle, applyTheme, initTheme };
})(window);
