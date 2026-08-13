/* ===========================================================================
   midi.js — pembaca berkas Standard MIDI File (.mid / .midi).

   KENAPA INI ADA DI KOLEKSI PROGRAM BASIC 1982
   --------------------------------------------
   Karena formatnya seumuran. SMF dibakukan tahun 1988 — enam tahun setelah
   program-program di koleksi ini ditulis, dan dua tahun sebelum GERMFOLK.BAS.
   Ia masih dibaca semua perangkat lunak musik sampai hari ini, tanpa perubahan.

   Dan karena lingkarannya jadi tertutup: berkas MIDI dimuat, ditampilkan di
   not balok, lalu **diterjemahkan menjadi makro PLAY GW-BASIC** yang bisa
   ditempel ke BASICA. Dua format pertukaran dari era yang sama, saling bicara.

   TIDAK ADA PUSTAKA, TIDAK ADA JARINGAN
   -------------------------------------
   Seluruh berkas dibaca dari `ArrayBuffer` dengan `DataView`. Itu keharusan:
   halaman ini jalan dari `file://`, jadi tidak ada `fetch()` dan tidak ada CDN.
   `FileReader` tetap bekerja karena berkasnya diserahkan pengguna sendiri lewat
   `<input type="file">` — bukan diambil program.

   BENTUK BERKASNYA
   ----------------
   Sebuah SMF adalah rangkaian "chunk", dan hanya ada dua macam:

       "MThd" <panjang:4> <format:2> <jumlahTrek:2> <pembagian:2>
       "MTrk" <panjang:4> <kejadian...>

   Tiap kejadian didahului **delta time** — berapa tick sejak kejadian
   sebelumnya — yang ditulis dalam *variable-length quantity*: tiap byte
   menyumbang 7 bit, dan bit tertinggi berarti "masih ada lanjutannya".

       0x40            ->  64
       0x81 0x00       ->  128
       0xFF 0xFF 0x7F  ->  2097151

   Trik hemat tempat dari tahun 80-an yang masih dipakai di mana-mana:
   Protocol Buffers, LEB128 di WebAssembly, dan panjang muatan di UTF-8
   memakai gagasan yang persis sama.

   TIGA HAL YANG PALING SERING SALAH DIBACA
   ----------------------------------------
   1. **Running status.** Kalau byte status sebuah kejadian sama dengan yang
      sebelumnya, ia boleh dihilangkan sama sekali. Pembaca yang tidak
      mengingat status terakhir akan tersesat total di byte pertama yang
      dihemat — dan sisanya jadi sampah.

   2. **Note-on dengan velocity 0 berarti note-off.** Juga penghematan:
      dengan begitu satu deretan panjang note-on bisa memakai running status
      tanpa terputus oleh 0x8n. Hampir semua berkas nyata memakainya.

   3. **Tick bukan detik.** Konversinya bergantung pada tempo yang bisa
      **berubah di tengah lagu** lewat meta event 0x51. Jadi tidak bisa
      dikalikan satu faktor; harus dijalani sepanjang peta tempo.
   =========================================================================== */
(function (global) {
  'use strict';

  const HEADER = 0x4D546864;   // "MThd"
  const TRACK = 0x4D54726B;    // "MTrk"

  /** Pembaca beruntun sederhana di atas DataView. */
  function Reader(view, start, end) {
    this.v = view;
    this.p = start || 0;
    this.end = end === undefined ? view.byteLength : end;
  }
  Reader.prototype = {
    get eof() { return this.p >= this.end; },
    u8() { return this.v.getUint8(this.p++); },
    u16() { const x = this.v.getUint16(this.p); this.p += 2; return x; },
    u32() { const x = this.v.getUint32(this.p); this.p += 4; return x; },
    skip(n) { this.p += n; },
    bytes(n) {
      const out = [];
      for (let k = 0; k < n; k++) out.push(this.u8());
      return out;
    },
    text(n) {
      let s = '';
      for (let k = 0; k < n; k++) s += String.fromCharCode(this.u8());
      return s;
    },
    /** Variable-length quantity: 7 bit per byte, bit ke-8 = "ada lanjutan". */
    vlq() {
      let x = 0, b;
      do {
        b = this.u8();
        x = (x << 7) | (b & 0x7f);
      } while (b & 0x80);
      return x;
    }
  };

  /**
   * Baca satu trek jadi daftar kejadian bertick mutlak.
   * Kejadian yang tidak dipakai (control change, pitch bend, sysex) dilewati,
   * tapi tetap harus **diurai panjangnya dengan benar** — melewatkan byte yang
   * salah jumlahnya akan merusak seluruh sisa trek.
   */
  function readTrack(r, end) {
    const ev = [];
    let tick = 0;
    let status = 0;                       // untuk running status

    while (r.p < end) {
      tick += r.vlq();
      let b = r.u8();

      if (b < 0x80) {                     // running status: byte ini sudah data
        r.p--;
        b = status;
      } else if (b < 0xf0) {
        status = b;                       // hanya pesan kanal yang mengingat
      }

      const hi = b & 0xf0;
      const ch = b & 0x0f;

      if (b === 0xff) {                   // meta event
        const type = r.u8();
        const len = r.vlq();
        if (type === 0x51 && len === 3) {              // set tempo
          const d = r.bytes(3);
          ev.push({ tick, kind: 'tempo',
                    usPerBeat: (d[0] << 16) | (d[1] << 8) | d[2] });
        } else if (type === 0x03) {                    // nama trek
          ev.push({ tick, kind: 'name', text: r.text(len) });
        } else {
          r.skip(len);
        }
      } else if (b === 0xf0 || b === 0xf7) {           // sysex
        r.skip(r.vlq());
      } else if (hi === 0x90) {
        const note = r.u8(), vel = r.u8();
        // Velocity 0 pada note-on BERARTI note-off. Lihat catatan di kepala.
        ev.push({ tick, kind: vel > 0 ? 'on' : 'off', ch, note, vel });
      } else if (hi === 0x80) {
        const note = r.u8(); r.u8();
        ev.push({ tick, kind: 'off', ch, note });
      } else if (hi === 0xc0 || hi === 0xd0) {
        r.u8();                                        // satu byte data
      } else if (hi === 0xa0 || hi === 0xb0 || hi === 0xe0) {
        r.u8(); r.u8();                                // dua byte data
      } else {
        // Byte status yang tidak dikenal: tidak ada cara aman menebak
        // panjangnya, jadi trek ini dihentikan daripada menghasilkan sampah.
        break;
      }
    }
    return ev;
  }

  /**
   * Ubah tick jadi detik dengan menjalani peta tempo.
   *
   * Tidak bisa satu perkalian, karena tempo boleh berubah di tengah lagu.
   * Yang dilakukan: berjalan menaiki daftar perubahan tempo sambil menabung
   * berapa detik sudah lewat sampai perubahan itu.
   */
  function makeTickToSec(tempos, ticksPerBeat) {
    // Selalu ada tempo awal: 120 bpm = 500000 mikrodetik per ketuk (bawaan SMF).
    const map = [{ tick: 0, usPerBeat: 500000, sec: 0 }];
    tempos.slice().sort((a, b) => a.tick - b.tick).forEach(t => {
      if (t.tick === 0) { map[0].usPerBeat = t.usPerBeat; return; }
      const prev = map[map.length - 1];
      const sec = prev.sec +
        (t.tick - prev.tick) * prev.usPerBeat / 1e6 / ticksPerBeat;
      map.push({ tick: t.tick, usPerBeat: t.usPerBeat, sec });
    });

    return function (tick) {
      let e = map[0];
      for (let k = 1; k < map.length && map[k].tick <= tick; k++) e = map[k];
      return e.sec + (tick - e.tick) * e.usPerBeat / 1e6 / ticksPerBeat;
    };
  }

  /**
   * Urai seluruh berkas.
   *
   * @param {ArrayBuffer} buf
   * @param {object} [opts] {drums:false} — sertakan kanal 10 (perkusi)?
   * @returns {{notes:Array, total:number, format:number, tracks:number,
   *            name:string, tempoCount:number}}
   * @throws {Error} pesan dalam bahasa Indonesia, siap ditampilkan
   */
  function parseMIDI(buf, opts) {
    opts = opts || {};
    const v = new DataView(buf);
    if (v.byteLength < 14) throw new Error('Berkas terlalu pendek untuk sebuah MIDI.');

    const r = new Reader(v);
    if (r.u32() !== HEADER) {
      throw new Error('Ini bukan berkas MIDI — empat huruf pertamanya bukan "MThd". '
                    + 'Berkas .mp3, .wav, dan .kar tidak bisa dibaca di sini.');
    }
    const hdrLen = r.u32();
    const format = r.u16();
    const nTracks = r.u16();
    const division = r.u16();
    r.p = 8 + hdrLen;                    // hormati panjang header, jangan asumsi 6

    if (division & 0x8000) {
      throw new Error('Berkas ini memakai satuan waktu SMPTE (film/video), '
                    + 'bukan tick per ketuk. Belum didukung.');
    }
    const ticksPerBeat = division || 96;

    // --- baca semua trek ---
    const all = [];
    let name = '';
    for (let t = 0; t < nTracks && r.p + 8 <= v.byteLength; t++) {
      const id = r.u32();
      const len = r.u32();
      const end = Math.min(r.p + len, v.byteLength);
      if (id !== TRACK) { r.p = end; continue; }        // chunk asing: lewati
      const ev = readTrack(new Reader(v, r.p, end), end);
      ev.forEach(e => { e.track = t; all.push(e); });
      if (!name) {
        const nm = ev.find(e => e.kind === 'name');
        if (nm) name = nm.text.trim();
      }
      r.p = end;
    }

    const tempos = all.filter(e => e.kind === 'tempo');
    const toSec = makeTickToSec(tempos, ticksPerBeat);

    /* --- pasangkan note-on dengan note-off ---
       Kuncinya (kanal, nomor not), bukan nomor not saja: dua kanal boleh
       membunyikan C4 bersamaan, dan note-off milik kanal 1 tidak boleh
       mematikan not milik kanal 2.

       Dipakai tumpukan, bukan satu nilai, karena kanal yang sama boleh
       menekan not yang sama dua kali sebelum melepasnya (jarang, tapi sah). */
    all.sort((a, b) => a.tick - b.tick ||
                       (a.kind === 'off' ? 0 : 1) - (b.kind === 'off' ? 0 : 1));

    const open = new Map();
    const notes = [];
    const keyOf = (e) => e.ch * 128 + e.note;

    all.forEach(e => {
      if (e.kind === 'on') {
        if (e.ch === 9 && !opts.drums) return;         // kanal 10 = perkusi
        const k = keyOf(e);
        if (!open.has(k)) open.set(k, []);
        open.get(k).push({ tick: e.tick, vel: e.vel, track: e.track, ch: e.ch });
      } else if (e.kind === 'off') {
        const k = keyOf(e);
        const stack = open.get(k);
        if (!stack || !stack.length) return;
        const s = stack.shift();
        const t = toSec(s.tick);
        notes.push({
          midi: e.note, t, dur: Math.max(0.03, toSec(e.tick) - t),
          vel: s.vel, track: s.track, ch: s.ch
        });
      }
    });

    // Not yang tidak pernah dilepas (berkas terpotong) diberi panjang sopan.
    open.forEach((stack, k) => stack.forEach(s => {
      const t = toSec(s.tick);
      notes.push({ midi: k % 128, t, dur: 0.5, vel: s.vel,
                   track: s.track, ch: s.ch, orphan: true });
    }));

    notes.sort((a, b) => a.t - b.t || a.midi - b.midi);

    if (!notes.length) {
      throw new Error('Berkas terbaca, tapi tidak ada satu pun nada di dalamnya. '
                    + 'Mungkin isinya hanya trek perkusi.');
    }

    return {
      notes, format, tracks: nTracks, name,
      tempoCount: tempos.length,
      ticksPerBeat,
      total: notes.reduce((m, n) => Math.max(m, n.t + n.dur), 0)
    };
  }

  global.RETRO = global.RETRO || {};
  global.RETRO.parseMIDI = parseMIDI;
})(window);
