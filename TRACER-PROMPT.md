# Prompt lanjutan — Penelusur Baris (stream baru)

> Salin seluruh isi berkas ini sebagai pesan pertama di sesi Claude Code yang
> baru. Ia berdiri sendiri; tidak perlu konteks dari percakapan sebelumnya.

---

Kerjakan **stream baru** di repositori ini: sebuah **penelusur baris** untuk
program BASIC koleksi `run/`.

Ini **bukan** kelanjutan dari proyek porting di `web/`. Jangan menyentuh,
mengubah, atau "merapikan" apa pun di `web/games/` maupun `web/docs/` yang sudah
ada — 61 port di sana sudah selesai dan diverifikasi. Stream ini hidup di
foldernya sendiri.

## Yang dibangun

Satu halaman dengan tiga bagian:

| bagian | isi |
|---|---|
| **kiri** | layar tempat program berjalan — konsol teks CGA 80×25 dengan `LOCATE`, `COLOR`, atribut per sel |
| **kanan** | kode sumber `.BAS` aslinya, dengan **baris yang sedang dijalankan disorot**, bergulir mengikuti eksekusi |
| **bawah** | kotak tetap: dari program ini seorang pemrogram pemula bisa belajar apa |

Tujuannya mengajar, bukan bermain: seseorang melihat baris 1750 disorot,
melihat layar berubah, dan mengerti apa yang baru saja dilakukan
`RANDOMIZE VAL(RIGHT$(TIME$,2))`.

## Keputusan yang sudah diambil pemilik proyek — jangan ditawar ulang

1. **Yang dieksekusi adalah porting minimalis baru**, bukan sumber `.BAS`-nya.
   Pemilik proyek sudah menimbang ini dan menerimanya: menjalankan GW-BASIC
   sungguhan di peramban terlalu mahal, dan soal kecepatan tetap menuntut
   penyesuaian. Porting minimalis ini **seperlunya saja** dan **tidak**
   menggantikan port lengkap yang sudah ada di `web/games/`.
2. **Sorotan per baris**, bukan per pernyataan.
3. **Kotak penjelasan tetap** — satu teks per program, tidak berubah mengikuti
   baris.
4. **Cakupan**: hanya program yang terjangkau `MENU.BAS` dan `MENU2.BAS`.

## Aturan yang menjaga sorotannya jujur — ini kerangkanya

Karena yang dieksekusi porting minimalis sementara yang disorot baris aslinya,
**sorotan itu klaim, bukan fakta**. Ia bisa melenceng tanpa ada yang tahu.
Itu jenis cacat yang paling sering menggigit proyek ini: gambar yang
menceritakan hal yang tidak terjadi.

Maka porting minimalisnya **wajib** ditulis sebagai **tabel baris**, bukan
sebagai fungsi biasa yang sorotannya ditempel belakangan:

```js
const PROGRAM = [
  { baris: 10,  jalan: (m) => { m.cls(); m.warna(7, 0); } },
  { baris: 20,  jalan: (m) => { m.locate(5, 22); m.cetak('...'); } },
  { baris: 100, jalan: (m) => m.tungguTombol(),  tunggu: true },
  { baris: 110, jalan: (m) => m.lompat(100),     lompat: true },
];
```

Mesin penjalannya menelusuri tabel itu. Akibatnya:

- Sorotan dan eksekusi berasal dari **struktur yang sama**, jadi tidak mungkin
  berbeda.
- `GOTO` dan `GOSUB` menjadi pencarian nomor baris di tabel — persis seperti
  aslinya, dan itu sendiri sudah mengajari sesuatu.
- Baris yang belum ditulis **gagal terang-terangan**, bukan dilewati diam-diam.

Sediakan satu pemeriksa yang membandingkan nomor baris di tabel dengan nomor
baris yang benar-benar ada di berkas `.BAS`-nya, dan melaporkan baris asli mana
yang belum punya padanan. Cetak angkanya di halaman — jangan sembunyikan
cakupan yang belum penuh.

## Cakupan: 24 program

`MENU.BAS` (41 baris) menjangkau 20 program:

```
21  BIO  BOGGY  CRAPS  DOMINOES  DRAW  FOOTBALL  GOLF  HANGMAN  HEAREYE
MASTER  MATCH  MAZE  OTHELLO  PEGLEAP  STATS  SUB  TICTAC  TOWERS  WILDCAT
```

`MENU2.BAS` (642 baris) menjangkau `BUSONE`, `CHECK`, `INTRO`.

**Mulai dari `MENU.BAS` sendiri** — ia pendek, ia pintu masuk koleksi ini, dan
ia memperlihatkan `RUN "nama"` yang membuat variabel hilang. Itu pelajaran
pertama yang bagus.

Program yang tidak bisa dijalankan utuh (`DRAW` memuat `DRAW.EXE` yang hilang
dari koleksi) tetap boleh ditelusuri sampai titik itu, lalu **berhenti dan
katakan terus terang** kenapa.

## Kendala teknis yang berlaku di repositori ini

- Dibuka lewat `file://` — **tanpa** modul ES, **tanpa** `fetch()`, **tanpa**
  CDN. Data dimuat lewat `<script>` yang menugaskan ke `window.*`.
- Bahasa antarmuka aplikasi: **Inggris**, mengikuti aslinya.
- Bahasa dokumen dan komentar kode: **Bahasa Indonesia** seluruhnya.
- Tiap penyimpangan dari perilaku asli dijelaskan dengan alasan tertulis. Kalau
  diubah karena selera, nyatakan sebagai selera.
- Uji lewat peramban dengan server lokal (`python -m http.server <port>`), lalu
  **hentikan servernya**. Pastikan nol galat konsol.
- Saat menguji lewat Chrome MCP: tabnya berstatus tersembunyi, jadi `rAF` tidak
  berjalan dan `setTimeout` dicekik ke ≥1 detik. Ambil alih `requestAnimationFrame`
  dan putar jamnya sendiri; beri giliran ke microtask (`await null`) di antara
  bingkai kalau kodenya memakai `await`.

## Bahan yang sudah tersedia

- `run/*.BAS` — sumber aslinya.
- `reviews/*.md` — analisis tiap program, **sudah memuat bagian "Yang bisa
  dipelajari" dan "Yang jangan ditiru"**. Kotak penjelasan di bawah layar
  sebaiknya bersumber dari sana, bukan ditulis ulang dari nol.
- `web/docs/*.md` — catatan port lengkapnya, berisi temuan yang jauh lebih
  dalam (mis. FOOTBALL: satu tabel dipakai dua arah; DROIDS: layar sebagai
  satu-satunya penyimpan keadaan). Boleh dirujuk, jangan disalin mentah.
- `web/_shared/` — pustaka bersama port lama (`audio.js`, `tokens.css`,
  `base.css`, `ui.js`, `rng.js`, `store.js`). **Boleh dipakai ulang**, tapi
  jangan diubah — port lama bergantung padanya.

## Pertanyaan terbuka yang perlu diputuskan di awal

Sebelum menulis banyak kode, tanyakan ini kepada pemilik proyek:

1. **Cari penafsir GW-BASIC siap pakai di web dulu?** Kalau ada yang cukup
   matang, keputusan (1) di atas bisa dibatalkan dan sorotan barisnya menjadi
   **fakta, bukan klaim** — perubahan mendasar yang membuat seluruh rancangan
   ini lebih kuat. Satu pencarian singkat sudah cukup untuk tahu.
2. **Letak folder dan namanya** — mis. `tracer/` di akar repositori, terpisah
   dari `web/`.
3. **Kendali penelusuran** — jalan otomatis dengan pengatur kecepatan, langkah
   satu baris, titik henti, atau ketiganya?

## Langkah pertama yang disarankan

1. Tanyakan ketiga pertanyaan terbuka di atas.
2. Baca `run/MENU.BAS` (41 baris) seluruhnya.
3. Bangun mesin penjalannya (tabel baris + konsol teks CGA 80×25) memakai
   `MENU.BAS` sebagai program pertama, sampai berjalan utuh dan sorotannya
   benar.
4. Baru sesudah itu tambahkan program kedua — dan biarkan program kedua itu
   yang memberi tahu bagian mana dari mesinnya yang masih kurang.
