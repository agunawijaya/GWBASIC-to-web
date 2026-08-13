# Ide pengembangan — seluruh koleksi

Dokumen ini menampung ide yang **tidak milik satu permainan**: fondasi bersama,
katalog, dan hal-hal yang baru bernilai kalau dikerjakan untuk semuanya sekaligus.

Ini gudang ide, bukan rencana. **Belum disaring, belum diurutkan**, dan sengaja
memuat yang meragukan — menyaring pada tahap ide terlalu dini.

Ide per permainan ada di:
[3DTTT](3dttt-ide.md) · [SPACEWAR](spacewar-ide.md) ·
[HOPPER](hopper-ide.md) · [PAC-GAL](pacgal-ide.md) — sisi bahan asli, dan
[3DTTT](3dttt-ide-port.md) · [SPACEWAR](spacewar-ide-port.md) ·
[HOPPER](hopper-ide-port.md) · [PAC-GAL](pacgal-ide-port.md) — sisi port web.

---

## Ukuran koleksi hari ini

| | |
|---|---|
| Halaman permainan | 65 |
| Dokumen port | 72 |
| Modul bersama di `_shared/` | 23 |
| Halaman yang memakai `_shared/input.js` | **11 dari 65** |
| Halaman dengan dukungan sentuh | **4 dari 65** |

Dua angka terakhir itu yang paling menonjol, dan keduanya baru terlihat setelah
dihitung. Selama ini "dukungan sentuh" ada di komentar kepala `input.js` sebagai
niat, bukan sebagai keadaan.

---

## Fondasi bersama

- **Papan pengukur keadaan koleksi**: satu halaman yang memindai keenam puluh lima
  permainan dan melaporkan mana yang punya sentuh, jeda, suara, tata letak layar
  kecil, `prefers-reduced-motion`, `aria-live`, dan uji. Selama tidak diukur,
  jawaban "sudah kok" tidak bisa dipercaya — termasuk jawaban saya.
- Komponen **d-pad layar** bersama, dipakai semua permainan aksi.
- Komponen **jeda** bersama, termasuk jeda otomatis saat tab tidak terlihat.
- **Adopsi `input.js`** di 54 halaman yang belum memakainya.
- Kerangka **uji rendaman** bersama: pompa rAF, jam yang dipatok, pelaporan galat,
  dan **kontrol negatif** sebagai bagian bakunya.
- Kerangka **mode atraksi** bersama (permainan bermain sendiri di halaman muka).
- **Perekam masukan** dan pemutar ulang deterministik — RNG di koleksi ini sudah
  berbenih, jadi ini hampir gratis.
- **Benih ditampilkan dan bisa dimasukkan** di semua permainan berbenih.
- Format **papan skor** yang seragam, dipakai bersama.
- Halaman **pengaturan global**: tema, suara, gerak, kendali, tersimpan sekali.
- **Peta tombol yang bisa diubah**, bersama.
- Dukungan **gamepad** bersama.
- Berkas **token warna ramah buta warna**, sebagai pilihan tema.
- Pemeriksa **kontras** otomatis untuk kedua tema.
- **Tangkap galat global** di semua halaman; jangan ada yang ditelan diam-diam.
- Pengukur **anggaran kinerja** — dan aturan bahwa kesimpulan soal kinerja harus
  dari pengukuran, bukan dugaan.

## Katalog dan navigasi

- Saring katalog menurut: genre, tahun, jenis masukan, jumlah pemain.
- Lencana **"bisa dimainkan di ponsel"** — yang hanya boleh muncul kalau terukur.
- Lencana "punya lawan komputer", "dua pemain", "ada suara".
- Urutkan menurut tahun program aslinya.
- Halaman **indeks dokumen**: 72 dokumen port belum punya daftar isi.
- Pencarian di seluruh dokumen.
- Tautan silang otomatis antara halaman permainan dan dokumennya.
- **Pemeriksa tautan** yang berjalan otomatis — 72 dokumen saling menaut dan itu
  akan membusuk diam-diam.
- Pemeriksa **kesegaran dokumen yang dihasilkan** (mis. `gen-pacgal-ref.py`):
  jalankan generatornya, bandingkan hasilnya, gagalkan kalau berbeda.

## Menjelaskan dirinya sendiri

- Penampil **"bagaimana ini didekompilasi"** di tiap halaman permainan: potongan
  `.asm`, potongan `.bas`, dan bagian port yang bersangkutan, berdampingan.
- Penampil **string asli** yang ditemukan di tiap biner.
- Garis waktu koleksi: program mana dari tahun berapa.
- Halaman **"apa yang salah dan bagaimana ketahuan"** — kumpulan cacat yang pernah
  dilaporkan pemilik proyek, berikut sebab dan perbaikannya. Nilainya besar dan
  bahannya sudah tersebar di dokumen-dokumen yang ada.
- Halaman **hasil negatif** koleksi: apa yang dicoba dan gagal, supaya tidak
  dicoba lagi.

## Yang lebih spekulatif

- Terjemahan dokumen ke bahasa Inggris (sekarang seluruhnya bahasa Indonesia).
- Ekspor GIF permainan langsung dari halaman.
- Tangkapan layar otomatis untuk katalog.
- Pencapaian lintas-permainan.
- Statistik lintas-permainan milik pemain.
- Mode "arcade": beberapa permainan berurutan dalam satu sesi.
- Berkas tunggal (satu HTML yang memuat semuanya) untuk diarsipkan.
- Versi yang bisa dipasang (PWA) — perlu dilayani lewat HTTP, bukan `file://`.
- Emulator DOS di halaman, berdampingan dengan port, untuk perbandingan langsung.
  **Perhatikan:** itu berarti menyertakan `.EXE` berhak cipta di halaman publik.

## Batasan yang tidak boleh dilanggar

Bukan ide, tapi harus ikut dibaca siapa pun yang mengambil ide dari sini:

- **`file://`**: tanpa modul ES, tanpa `fetch()`, tanpa CDN. Berkas data menyetel
  `window.RETRO.<NAMA>`, dan setiap JS dibungkus IIFE.
- **Kecepatan mutlak**, tidak relatif terhadap laju bingkai.
- **Angka yang dikutip dari biner tidak disetel ulang** demi keseimbangan.
- **Klaim butuh angka.** "Lebih cepat", "lebih pintar", "lebih enak" tanpa
  pengukuran tidak masuk dokumen.
- **`.EXE` asli** di `run/` adalah perangkat lunak komersial 1980-an. Jangan
  diterbitkan ke tempat publik.

---

Berkas terkait: [fondasi](_fondasi.md) · [teknik SVG](_teknik-svg.md) ·
[rencana](../PLAN.md)
