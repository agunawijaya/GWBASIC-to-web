# Rancangan penelusur baris

Dokumen ini menjelaskan kenapa penelusur di `tracer/` dibangun seperti ini, dan
apa yang harus dijaga saat menambah program berikutnya.

## Masalah yang dipecahkan

Halaman ini memperlihatkan tiga hal sekaligus:

| bagian | isi |
|---|---|
| kiri | layar teks CGA 80×25 tempat program berjalan |
| kanan | kode `.BAS` aslinya, baris yang sedang dijalankan disorot |
| bawah | kotak tetap: apa yang bisa dipelajari dari program ini |

Yang dieksekusi **bukan** berkas `.BAS`-nya, melainkan porting minimalis baru.
Artinya sorotan di panel kanan adalah **klaim**: "baris inilah yang sedang
dijalankan". Klaim itu bisa melenceng tanpa ada yang tahu — dan gambar yang
menceritakan hal yang tidak terjadi adalah cacat yang paling mahal di
repositori ini.

## Kerangka yang membuat sorotannya jujur

### 1. Program ditulis sebagai tabel baris

```js
var tabel = [
  { baris: 10,  jalan: function (m) { m.cls(); m.warna(3, 0); } },
  { baris: 20,  jalan: function (m) { m.gosub(500); } },
  { baris: 260, jalan: function (m) { m.v['R$'] = m.inkey();
                                      if (m.v['R$'] === '') m.lompat(260); } }
];
```

Penjalan memegang satu penunjuk ke dalam larik itu. **Baris yang disorot =
entri yang sedang ditunjuk penunjuk itu.** Tidak ada jalan bagi keduanya untuk
berbeda, karena tidak ada dua struktur untuk dibedakan.

Akibat sampingannya justru mengajar:

- `GOTO` dan `GOSUB` menjadi pencarian nomor baris di dalam tabel — persis yang
  dilakukan penafsir BASIC sungguhan, dan alasan kenapa program BASIC panjang
  terasa lambat.
- Baris yang belum ditulis **gagal terang-terangan**. `m.lompat(340)` ke nomor
  yang tidak ada di tabel menghentikan penelusuran dengan pesan yang menyebut
  nomornya, bukan melompatinya diam-diam.

### 2. Pemeriksa cakupan mencetak angkanya di halaman

`mesin/pemeriksa.js` membandingkan nomor baris di tabel dengan nomor baris yang
benar-benar ada di berkas `.BAS`, lalu empat hal dilaporkan:

| temuan | artinya |
|---|---|
| **hilang** | ada di `.BAS`, tidak ada di tabel → cakupan belum penuh |
| **asing** | ada di tabel, tidak ada di `.BAS` → tabelnya salah |
| **kembar** | satu nomor muncul dua kali di tabel → `GOTO` jadi ambigu |
| **urutan** | tabel tidak menaik seperti berkasnya → jatuh-ke-bawah salah |

Yang pertama adalah pekerjaan yang belum selesai. Tiga sisanya adalah cacat:
kalau salah satunya muncul, yang tersorot bisa bukan yang dijalankan.

Angkanya tampil di kepala panel kanan (`41/41 baris (100%)`), dan baris `.BAS`
yang belum punya padanan diredupkan di tempatnya sendiri — bukan cuma
dilaporkan sebagai satu angka di pojok.

### 3. Tiap program menjelaskan dirinya dari tiga jarak

Menelusuri baris demi baris memperlihatkan *apa yang terjadi*, tapi tidak
memperlihatkan *bentuk keseluruhannya*. Maka tiap program wajib memuat tiga
hal, dan ketiganya tampil di halaman:

| bidang | isinya | jaraknya |
|---|---|---|
| `arsitektur` | simpul dan panah alur programnya | sekali lihat |
| `pseudokode` | langkahnya dalam bahasa manusia | sebaris demi sebaris |
| `penjelasan` | kenapa bentuknya begitu | sepanjang paragraf |

**`arsitektur` adalah satu sumber untuk dua gambar.** `mesin/peta.js`
mengubahnya jadi SVG sebaris untuk halaman (karena `file://` tidak boleh
memuat pustaka dari CDN) *dan* jadi sumber Mermaid untuk `docs/*.md`. Kalau
dua-duanya ditulis tangan, cepat atau lambat gambarnya bercerita hal yang
berbeda dari kodenya — cacat yang sama persis dengan sorotan yang melenceng.

Aturan bentuk yang berlaku di seluruh koleksi:

| bentuk | artinya |
|---|---|
| bulat penuh | awal program atau pintu keluar |
| segi enam | ada pilihan di sini |
| kotak bergaris ganda | subrutin |
| kotak miring putus-putus merah | jalur galat |
| gelung | selalu digambar **di kanan** |
| lompatan-maju | selalu digambar **di kiri** |

Konsistensi itu yang membuat peta kedua puluh bisa dibaca secepat peta
pertama.

#### Jenis diagram mengikuti kerumitan programnya

Flowchart menjawab satu pertanyaan saja: *ke mana alurnya pergi*. Untuk menu
dan pengantar, itu memang seluruh ceritanya. Untuk permainan, tidak.

| kalau programnya | diagram yang dipakai |
|---|---|
| alur lurus, satu gelung utama | flowchart saja |
| punya beberapa peran atau skenario pemakaian | + use case |
| banyak subrutin yang saling memanggil berurutan | + sequence |
| punya mode/fase yang berganti (giliran, ronde, papan) | + state |

Flowchart **selalu tetap ada**; yang lain menambah, bukan menggantikan.

Sejauh ini penerapannya:

| program | diagram | alasan |
|---|---|---|
| MENU, INTRO, CHECK, HEAREYE | flowchart saja | alur lurus, satu gelung utama |
| MASTER, BOGGY, BIO, HANGMAN, BUSONE | flowchart saja | satu gelung tebak-dan-nilai; tidak ada fase yang berganti |
| TOWERS | + keadaan | `HOLD` mengubah arti tombol Enter |
| TICTAC | + keadaan + flowchart kedua | giliran berganti-ganti, dan otak komputernya rumit sendiri |
| PEGLEAP | + keadaan | penunjuk "memilih asal" vs "memilih tujuan" |
| OTHELLO | + keadaan | `U` memilih antara menghitung saja dan membalik sungguhan |
| CRAPS | + keadaan | COMING OUT vs POINT: angka dadu yang sama berarti terbalik |
| DRAW | + keadaan | `FLAG` mengubah arti seluruh tombol huruf |
| 21 | + keadaan | kartu tertutup adalah "kartu nomor nol", dibuka dengan `SWAP` |
| WILDCAT, MAZE, SUB, FOOTBALL, GOLF, MATCH, DOMINOES, STATS, MENU2 | flowchart saja | alurnya lurus, atau kerumitannya ada di TABEL bukan di keadaan |

`HEAREYE` sengaja **tidak** diberi tambahan meski ia program permainan:
subrutinnya lurus dari atas ke bawah dan tidak ada keadaan yang berganti.
Menambahkan diagram keadaan untuk program tanpa keadaan bukan kelengkapan —
itu hiasan yang menyiratkan kerumitan yang tidak ada.

Diagram tambahan ditulis di medan `diagramLain` (larik), dan boleh berjenis
apa pun termasuk flowchart kedua untuk bagian yang rumit sendiri. `peta.js`
sekarang mengenal `jenis: 'keadaan'`; use case dan sequence belum ada, dan
kalau nanti diperlukan harus tetap mengikuti aturan satu-sumber: satu
deklarasi data, dua keluaran (SVG untuk halaman, Mermaid untuk dokumen).

**`pseudokode` memakai nomor baris yang sungguhan.** Tiap langkah membawa
nomor baris `.BAS`-nya, dan di halaman nomor itu bisa diklik untuk menyorot
baris aslinya. Itu jembatan yang paling dibutuhkan pemula: dari "saya mengerti
apa yang dilakukan" ke "saya tahu baris mana yang melakukannya".

Sorotan dari klik itu sengaja **biru**, bukan kuning seperti sorotan "sedang
dijalankan" — kalau warnanya sama, pembacanya akan mengira penunjuk eksekusi
ikut pindah.

**`penjelasan` ditulis untuk pemrogram pemula**, bukan untuk arsip. Tiap bagian
menjawab satu pertanyaan "kenapa", dan kalau ada padanan modernnya, tunjukkan
kodenya berdampingan. Yang dicari bukan "program ini melakukan X", melainkan
"inilah yang bisa Anda bawa ke program Anda sendiri".

### 4. Penyimpangan ditulis di halaman, bukan disimpan di komentar

Tiap program memuat larik `penyimpangan` yang tampil di kotak bawah dengan
judul "Yang tidak sama dengan aslinya". Aturannya: kalau yang dijalankan
berbeda dari aslinya, pembacanya berhak tahu di mana dan kenapa. Kalau
alasannya selera, ditulis sebagai selera.

## Isi foldernya

```
tracer/
  index.html          halaman; memuat semua <script> (tanpa modul, tanpa fetch)
  gaya.css            tata letak + palet CGA
  mesin/
    konsol.js         layar teks 80×25, atribut per sel
    penjalan.js       penelusur tabel baris + kendali
    pemeriksa.js      pembanding tabel vs .BAS
    peta.js           arsitektur -> SVG (halaman) dan Mermaid (docs)
    antarmuka.js      perakit halaman
  program/
    MENU.js           tabel baris + teks pelajaran per program
    INTRO.js
    CHECK.js
    TOWERS.js
    HEAREYE.js
    TICTAC.js
    MASTER.js
    BOGGY.js
    PEGLEAP.js
    BIO.js
    HANGMAN.js
    BUSONE.js
    OTHELLO.js
    CRAPS.js
    DRAW.js
    WILDCAT.js
    MAZE.js
    SUB.js
    21.js
    FOOTBALL.js
    GOLF.js
    MATCH.js
    DOMINOES.js
    STATS.js
    MENU2.js
  sumber/
    *.js              isi run/*.BAS, dihasilkan alat/bikin-sumber.py
  alat/
    bikin-sumber.py   run/*.BAS -> sumber/*.js
  docs/
```

### Kenapa sumbernya disalin ke `.js`

Halaman ini harus bisa dibuka lewat `file://`. Di sana `fetch()` diblokir
peramban, dan modul ES juga ditolak. Satu-satunya cara memuat data tanpa server
adalah `<script src=…>` yang menugaskan ke `window.*`. Maka `run/*.BAS`
disalin menjadi `sumber/*.js` yang mengisi `window.SUMBER[nama]`.

Berkas hasilnya ASCII murni: karakter grafik CP437 ditulis sebagai `\uXXXX`,
sehingga tidak ada dugaan encoding yang bisa salah.

Regenerasi:

```
python tracer/alat/bikin-sumber.py          # semua yang ada di CAKUPAN
python tracer/alat/bikin-sumber.py MENU     # satu saja
```

## Apa yang sudah bisa ditiru mesinnya

Daftar ini tumbuh **karena program menuntutnya**, bukan karena diantisipasi di
awal. Kolom terakhir menyebut program yang menagihnya pertama kali.

| kemampuan | bentuknya di mesin | ditagih oleh |
|---|---|---|
| layar teks 80×25, atribut per sel | `m.cls` `m.warna` `m.locate` `m.cetak` | MENU |
| `TAB(n)` mutlak | `m.tab(n)` | MENU |
| `SPC(n)` relatif | `m.spc(n)` | INTRO |
| `CHR$(n)` dengan glif CP437 | `m.chr(n)` | INTRO |
| `STRING$(n, kode)` | `m.ulang(n, kode)` | INTRO |
| `GOTO` / `GOSUB` / `RETURN` | `m.lompat` `m.gosub` `m.kembali` | MENU |
| `INKEY$` yang tidak menunggu | `m.inkey()` | MENU |
| `POKE 106,0` (buang tombol tertunda) | `m.kosongkanPenyangga()` | MENU |
| `RUN "nama"` (variabel hilang) | `m.jalankan(nama)` | MENU |
| `ON ERROR GOTO` dan `ERR` | `m.penangkapGalat`, `m.galat(kode)` | MENU |
| `ON KEY(n) GOSUB` + `KEY(n) ON` | `m.pasangJebakan` `m.jebakan` | INTRO |
| banyak pernyataan per baris yang meninggalkan barisnya | entri `{baris, bagian:[…]}` | CHECK |
| `ERL` — baris tempat galat terjadi | `m.erl` | CHECK |
| `RESUME` dan `RESUME <baris>` | `m.lanjut(ke)` | CHECK |
| `ERROR n` — galat buatan sendiri | `m.galat(n)` | CHECK |
| `OPEN` / `CLOSE` sebagai uji keberadaan | `m.buka` `m.tutup` | CHECK |
| `CHAIN "nama", baris` | `m.rantai` | CHECK |
| `BEEP` | `m.bunyi()` (diam) | CHECK |
| `FOR`/`NEXT` yang membentang banyak baris | `m.untuk` `m.lanjutkan` | TOWERS |
| larik 1 dan 2 dimensi | `m.dim(nama, b1, b2)` | TOWERS |
| `READ` / `DATA` / `RESTORE` | `m.baca()`, bidang `data` | TOWERS |
| `CSRLIN` | `m.barisKursor()` | TOWERS |
| `RUN` tanpa nama (ulang dari awal) | `m.jalankan()` | TOWERS |
| tombol panah sebagai kode pindai | `CHR$(0)` + kode, otomatis | TOWERS |
| `SOUND` dan `PLAY` (keduanya diam) | `m.suara` `m.mainkan` | HEAREYE |
| `RND` dan `RANDOMIZE`, benih tetap | `m.acak()` `m.semai(n)` | MASTER |
| jebakan tombol panah `ON KEY(11..14)` | otomatis lewat `m.pasangJebakan` | PEGLEAP |
| `KEY(n) STOP` — keadaan ketiga | `m.tundaJebakan(n)` | PEGLEAP |
| `RETURN <baris>` — pulang ke tempat lain | `m.kembali(baris)` | BIO |
| kendali kursor `CHR$(28..31)` di dalam string | otomatis di `konsol.cetak` | HANGMAN |
| `INPUT` — menanti satu baris utuh | `m.masukan(nama, tanya)` | OTHELLO |
| `RUN <baris>` — ulang mulai dari baris | `m.jalankan(null, baris)` | OTHELLO |
| `PRINT USING` — pencetakan berformat | `m.cetakFormat(fmt, nilai)` | CRAPS |
| `BSAVE`/`BLOAD` atas RAM layar | `m.simpanLayar` `m.pulihkanLayar` | DRAW |
| `POKE` ke RAM layar (aksara dan atribut) | `m.pokeLayar(alamat, kode)` | WILDCAT, MAZE |
| `SCREEN(b,k)` — membaca kembali isi layar | `m.layarAksara` `m.layarAtribut` | SUB |
| larik tiga dimensi | `m.dim(nama, b1, b2, b3)` | WILDCAT |
| `RESTORE <baris>` — pindah penunjuk DATA | `m.ulangData(indeks)` | STATS |
| `RANDOMIZE` yang MENCAMPUR, bukan mengganti | `m.semaiCampur(n)` | MATCH |
| berhenti terus terang di jalan buntu | `m.buntu(alasan)` | — |

### Gelung `FOR` yang membentang banyak baris

Sampai program ketiga, tiap gelung muat dalam satu baris — jadi satu langkah
penelusuran menjalankan seluruh putarannya, dan tidak perlu mesin apa pun.
`TOWERS.BAS` memaksa yang sebenarnya, dan membawa dua aturan GW-BASIC yang
harus ikut ditiru kalau tidak mau salah:

- **`FOR` dengan nama variabel yang sama membuang bingkai lama.** Program lama
  sering melompat keluar gelung dengan `GOTO` tanpa pernah menyentuh `NEXT`
  (TOWERS baris 430). Tanpa aturan ini, tumpukan gelungnya bertambah tiap
  langkah dan tidak pernah surut.
- **`NEXT A` menutup gelung A dan membuang semua gelung yang lebih dalam.**
  Itu cara program lama keluar dari gelung bersarang: melompat dari dalam
  gelung `Y` langsung ke `NEXT X` (MASTER.BAS baris 1110). Penelusur sempat
  menolaknya sebagai kesalahan, dan akibatnya penilaian tebakan berhenti di
  tengah jalan. Sekarang gagal hanya kalau nama gelungnya benar-benar tidak
  ada di tumpukan.
- **Syaratnya diuji di `NEXT`,** jadi badan gelung selalu jalan sekali —
  berbeda dari GW-BASIC yang menguji di `FOR`. Bedanya ditutup dengan argumen
  `lewatKe` pada `m.untuk(...)`: nomor baris sesudah `NEXT`-nya. Kalau
  rentangnya kosong dan `lewatKe` tidak diberikan, penelusuran **berhenti dan
  mengatakannya** — bukan diam-diam menjalankan badan yang seharusnya
  dilewati.

### Baris berbagian

Satu baris BASIC boleh memuat banyak pernyataan, dan sebagian di antaranya
bisa **meninggalkan** baris itu di tengah jalan:

```basic
80 GOSUB 90:GOSUB 140:GOSUB 40:GOSUB 90:GOSUB 350:RUN"menu
```

`RETURN` yang pertama harus pulang ke pernyataan **kedua di baris 80**, bukan
ke baris sesudahnya. Karena itu entri tabel boleh berbentuk
`{ baris, bagian: [fn, fn, …] }`, dan alamat pulang `GOSUB` membawa nomor
bagiannya.

Penyorotan tidak terpengaruh — seluruh bagian milik satu nomor baris — tapi
akibatnya justru mengajar: kalau ditelusuri langkah demi langkah, sorotan
terlihat **kembali ke baris yang sama berkali-kali**, dan itu memang yang
terjadi.

Pakai `bagian` hanya kalau barisnya benar-benar bisa ditinggalkan di tengah
(`GOSUB`, `RESUME` yang harus mengulangi satu pernyataan). Baris yang cuma
panjang tetap ditulis sebagai satu `jalan`.

### `CHR$` menyimpan bita, bukan gambar

Sempat salah, dan `CHECK.BAS` yang menemukannya. `m.chr(n)` mengembalikan
**bita** n; pemetaan ke glif CP437 dikerjakan konsol saat mencetak — seperti
ROM font pada kartu CGA.

Kalau `m.chr` mengembalikan glifnya, `PRINT CHR$(196)` memang benar menggambar
garis, tapi `IF RS$=CHR$(27)` tidak akan pernah cocok dengan ESC yang datang
dari `INKEY$` — dan tombol itu berhenti berfungsi tanpa satu pun pesan galat.
Aturannya: **string di dalam program berisi bita, layar yang menerjemahkan.**

### Jebakan tombol fungsi dijemput di batas baris

GW-BASIC memeriksa jebakan `ON KEY` di antara **pernyataan**; penelusur ini di
antara **baris**. Itu penyimpangan yang nyata dan tertulis, tapi mekanismenya
sama dan mengajarkan hal yang sama: jebakan tidak menyela di tengah pekerjaan,
ia menunggu batas yang aman. Itu juga alasan satu baris yang panjang bisa
membuat tombol fungsi terasa tidak responsif.

Tiga hal yang ikut ditiru karena tanpanya perilakunya salah:

- jebakan **mati selama penangannya berjalan**, hidup lagi saat `RETURN` —
  kalau tidak, satu tombol yang ditahan menumpuk panggilan sampai tumpukannya
  habis;
- alamat pulangnya adalah **baris yang tertunda itu sendiri**, bukan baris
  sesudahnya;
- tombol fungsi tanpa jebakan yang menyala **dibuang**, tidak mengantre.

## Jembatan ke port lengkap

`RUN "WILDCAT"` di `MENU.BAS` harus benar-benar sampai ke Wildcatter — menu
yang tombolnya tidak membawa ke mana-mana bukan menu. Urutan yang dicoba
penelusur, dari yang paling dekat:

1. **Ada tabel barisnya di `program/`** → ditelusuri di halaman yang sama.
   Ini yang terjadi untuk `INTRO`, `CHECK`, dan `TOWERS`.
2. **Ada port lengkapnya di `web/games/`** → halaman berpindah ke sana.
   Kelanjutannya bukan penelusuran baris lagi, melainkan permainannya. Sama
   seperti `RUN` yang asli: program lama hilang, dan tidak ada jalan kembali
   kecuali lewat pintu yang disediakan program baru itu.
3. **Programnya melebur** (medan `merged` di katalog) → menuju halaman koleksi.
   `MENU` dan `MENU2` begitu: keduanya menjadi shell `web/index.html`.
4. **Tidak satu pun** → berhenti dan katakan yang mana yang belum ada.

Pemetaan nama berkas ke alamat port diambil dari `web/_shared/catalog.js`
lewat medan `base`, karena itulah nama yang tertulis di dalam `RUN "..."`.
Berkas katalognya **tidak disunting** — hanya dibaca.

Perkakas ini juga terdaftar di `web/index.html` pada kelompok "Edukasi &
presentasi". Entrinya ditulis langsung di halaman itu (larik `PERKAKAS`),
bukan di `catalog.js`, karena katalog itu data 83 program BASIC dan
dibangkitkan otomatis — penelusur bukan port program mana pun.

## Kendali penelusuran

Ketiganya berbagi satu mesin langkah yang sama:

- **Jalan / Jeda** — penelusuran otomatis, laju 1 sampai 600 baris per detik.
- **Langkah** — satu baris per klik.
- **Titik henti** — klik nomor baris di panel kanan. Penelusuran berhenti
  **sebelum** baris itu dijalankan, jadi yang tersorot saat berhenti adalah
  baris yang belum terjadi — seperti debugger.

Gelung otomatisnya memakai `requestAnimationFrame` dan mengambil waktunya dari
**argumen** rAF, bukan dari `Date.now()`. Itu bukan gaya penulisan: itu yang
membuat gelungnya bisa diuji di tab tersembunyi, tempat peramban tidak pernah
memanggil rAF sama sekali. Penguji mengganti `requestAnimationFrame` dan
memutar jamnya sendiri.

### Status yang mungkin muncul

| lencana | artinya |
|---|---|
| `diam` | siap; belum jalan, dijeda, atau berhenti di titik henti |
| `jalan` | penelusuran otomatis berjalan |
| `tunggu` | program menjajak `INKEY$` dan belum ada tombol |
| `masukan` | `INPUT` sedang menanti satu baris utuh (lencana ungu) |
| `selesai` | program habis dengan wajar |
| `gagal` | ada yang belum ditulis, atau tabelnya salah |

`gagal` bukan kecelakaan yang perlu disembunyikan — itulah cara tabel yang
belum penuh memberi tahu keadaannya.

## Menambah program berikutnya

1. `python tracer/alat/bikin-sumber.py NAMA` (kalau belum ada di `sumber/`).
2. Buat `tracer/program/NAMA.js` menurut aturan berikut:
   - **satu entri per nomor baris** di berkas `.BAS`; tidak digabung, tidak
     dipecah;
   - **urutan entri = urutan berkas**, supaya jatuh-ke-bawah benar sendirinya;
   - isi `jalan` menempuh langkah yang sama dengan pernyataan aslinya, dalam
     urutan yang sama;
   - tiap penyimpangan ditulis sebagai komentar di entrinya **dan** dimasukkan
     ke larik `penyimpangan` supaya tampil di halaman.
3. Tambahkan `<script src="program/NAMA.js"></script>` di `index.html`.
4. Isi `pelajaran` dari `reviews/NAMA.md` bagian "Yang bisa dipelajari" dan
   "Yang jangan ditiru" — jangan ditulis ulang dari nol.
5. **Isi `arsitektur`, `pseudokode`, dan `penjelasan`** menurut aturan di
   bagian 3 di atas. Ringkas alurnya jadi 8–12 simpul; peta dengan satu kotak
   per baris tidak menjelaskan apa pun.
6. Buka halamannya, pilih programnya, dan **baca angka cakupannya**. Kalau
   belum 100%, itu bukan kegagalan — tapi harus terbaca, bukan tertutup.
7. Tulis `docs/nama.md`, dan ambil blok Mermaid-nya dari
   `TRACER.peta.mermaid(PROGRAM.NAMA.arsitektur)` di konsol peramban —
   **jangan menggambar ulang dengan tangan.**

## Yang sengaja tidak dibangun

**Penafsir GW-BASIC sungguhan di dalam halaman.** Dua kandidat ditimbang:

- **PC-BASIC** akurat sampai tingkat bug, tapi ditulis dengan Python. Di
  peramban ia butuh Pyodide: unduhan sekitar 10 MB dan `fetch()` — dua-duanya
  mustahil di `file://`. Loop penafsirnya juga harus diinstrumentasi dulu agar
  melaporkan nomor baris.
- **DOSBox-di-peramban (js-dos)** menjalankan GW-BASIC yang asli, tapi
  emulatornya kotak hitam: tidak ada cara menanyakan baris berapa yang sedang
  dijalankan. Panel kanan tidak akan punya apa pun untuk disorot.

Sebagai gantinya, halaman menyediakan perintah untuk menjalankan program yang
sama di DOSBox-X yang **sudah terpasang di mesin ini**, memakai `run/GW.EXE`
yang **sudah ada di koleksi** dan profil perangkat keras di `dosbox-games.conf`.
Fidelitasnya penuh, jaringannya nol, dan penelusurannya tetap punya nomor
baris.

## Kemajuan

| program | baris | cakupan |
|---|--:|--:|
| [MENU](menu.md) | 41 | 41/41 (100%) |
| [INTRO](intro.md) | 23 | 23/23 (100%) |
| [CHECK](check.md) | 65 | 65/65 (100%) |
| [TOWERS](towers.md) | 131 | 131/131 (100%) |
| [HEAREYE](heareye.md) | 117 | 117/117 (100%) |
| [TICTAC](tictac.md) | 141 | 141/141 (100%) |
| [MASTER](master.md) | 137 | 137/137 (100%) |
| [BOGGY](boggy.md) | 101 | 101/101 (100%) |
| [PEGLEAP](pegleap.md) | 202 | 202/202 (100%) |
| [BIO](bio.md) | 169 | 169/169 (100%) |
| [HANGMAN](hangman.md) | 217 | 217/217 (100%) |
| [BUSONE](busone.md) | 138 | 138/138 (100%) |
| [OTHELLO](othello.md) | 248 | 248/248 (100%) |
| [CRAPS](craps.md) | 254 | 254/254 (100%) |
| [DRAW](draw.md) | 287 | 287/287 (100%) |
| [WILDCAT](wildcat.md) | 296 | 296/296 (100%) |
| [MAZE](maze.md) | 305 | 305/305 (100%) |
| [SUB](sub.md) | 317 | 317/317 (100%) |
| [21](21.md) | 336 | 336/336 (100%) |
| [FOOTBALL](football.md) | 345 | 345/345 (100%) |
| [GOLF](golf.md) | 361 | 361/361 (100%) |
| [MATCH](match.md) | 369 | 369/369 (100%) |
| [DOMINOES](dominoes.md) | 387 | 387/387 (100%) |
| [STATS](stats.md) | 449 | 449/449 (100%) |
| [MENU2](menu2.md) | 642 | 642/642 (100%) |

**Dua puluh lima program, 6.078 baris BASIC** — seluruh FriendlyWare, cakupan
penuh, tanpa satu pun baris asing, kembar, atau urutan yang rusak. Kedua menu
dan semua yang bisa dicapai dari keduanya ada di sini.

### Di luar FriendlyWare

Koleksi `run/` berisi **83** berkas `.BAS`; dua puluh lima di antaranya
FriendlyWare. Sisanya digarap mulai dari yang terpendek.

| program | baris | cakupan | yang membuatnya layak |
|---|--:|--:|---|
| [WHATMONF](whatmonf.md) | 4 | 4/4 (100%) | terpendek di koleksi; tidak mencetak apa pun |
| [OCTAVE](octave.md) | 6 | 6/6 (100%) | rumus tangga nada, dan gelung yang lupa maju |
| [GERMFOLK](germfolk.md) | 10 | 10/10 (100%) | `PLAY` ternyata penafsir bahasa makro |
| [WRTSTR](wrtstr.md) | 17 | 17/17 (100%) | tabel pembalikan kata ganti — seluruh ilusi ELIZA |
| [DREAM](dream.md) | 18 | 18/18 (100%) | bahasa makro itu punya subrutin |
| [NOTETABL](notetabl.md) | 26 | 26/26 (100%) | jembatan nama nada → pembagi pencacah 8253 |
| [WORDS](words.md) | 36 | 36/36 (100%) | berkas yang seluruhnya `DATA`, disisipkan ke program lain |
| [READING](reading.md) | 39 | 39/39 (100%) | `CHAIN MERGE`, dan menghitung `DATA` dengan cara menabrak |
| [INTEGRAT](integrat.md) | 42 | 42/42 (100%) | aturan Simpson, dikirim dengan satu baris sengaja dikosongkan |
| [SIMEQN](simeqn.md) | 50 | 50/50 (100%) | eliminasi Gauss dengan pivot parsial |
| [BUSNINE](bus-akuntansi.md) | 53 | 53/53 (100%) | neraca penutup yang seimbang — dan tak pernah dihitung |
| [BUSTEN](bus-akuntansi.md) | 54 | 54/54 (100%) | layar yang mengaku seluruh rangkaiannya brosur |
| [BUSTWO](bus-akuntansi.md) | 59 | 59/59 (100%) | bagan akun; angka pembukanya ditetapkan di sini |
| [SERPENT](serpent.md) | 64 | 64/64 (100%) | ular tanpa larik — layar itu sendiri strukturnya |
| [BUSFOUR](bus-akuntansi.md) | 66 | 66/66 (100%) | tabel dirakit sebagai string dulu, baru dicetak |
| [BUSSIX](bus-akuntansi.md) | 102 | 102/102 (100%) | tiga laporan berantai; naskah satu baris per layar |
| [BUSSEVEN](bus-akuntansi.md) | 102 | 102/102 (100%) | satu angka yang menyeberang empat berkas |
| [BUSEIGHT](bus-akuntansi.md) | 102 | 102/102 (100%) | `STRING$`, dan lubang nomor baris sebagai fosilnya |
| [BUSFIVE](bus-akuntansi.md) | 110 | 110/110 (100%) | kertas kerja delapan kolom; singkatan yang ditinggalkan |
| [BUSTHREE](bus-akuntansi.md) | 125 | 125/125 (100%) | seluruh naskah dalam satu baris, dua puluh `GOSUB` |
| [BOWLING](bowling.md) | 75 | 75/75 (100%) | pin digambar oleh datanya sendiri; permainan sempurna = 300 |
| [METEOR](meteor.md) | 80 | 80/80 (100%) | benih acak dari kelambatan manusia |
| [CURVE](curve.md) | 89 | 89/89 (100%) | kuadrat terkecil — dan SIMEQN yang disalin utuh |
| [HINTS](hints.md) | 132 | 132/132 (100%) | `RETURN <baris>` membatalkan penungguan dari dalam jebakan |
| [KENO](keno.md) | 137 | 137/137 (100%) | `ROW()` menyimpan kolom; janji pembayaran yang tak ada di kode |
| [ZAP'EM](zapem.md) | 137 | 137/137 (100%) | petunjuknya menjelaskan salah indeks sebagai fitur |
| [HIQUE2](hique2.md) | 142 | 142/142 (100%) | salib diubah jadi kisi; tabel ketetanggaan diganti aritmetika |
| [MAXIT1](maxit1.md) | 145 | 145/145 (100%) | `SV=A` mematikan telaah komputer; `PLOT` fosil dari PET |
| [ANATOMY](anatomy.md) | 159 | 159/159 (100%) | menampilkan kode MASTER.BAS — versi yang sudah tidak ada |
| [MORTGAGE](mortgage.md) | 204 | 204/204 (100%) | perangkat lunak IBM resmi; pembulatan uang bertambal sepersejuta |
| [BACKGAM](backgam.md) | 161 | 161/161 (100%) | satu larik bertanda menyimpan papan untuk dua pemain |
| [DROIDS](droids.md) | 183 | 183/183 (100%) | ladang bijih yang seluruhnya disimpan di layar |
| [MUSIC](music.md) | 210 | 210/210 (100%) | 82 frekuensi dari satu baris; layar sebagai peta tuts |
| [MUSIC1](music1.md) | 210 | 210/210 (100%) | MUSIC.BAS dengan empat baris berbeda — dua di antaranya tab lawan spasi |
| [ATTACK](attack.md) | 204 | 204/204 (100%) | pemandangan sebagai string; sasarannya pabrik Apple |
| [BJ](bj.md) | 218 | 218/218 (100%) | As disimpan di besarnya angka; bust bandar jadi &minus;0,5 |
| [BLACKJCK](blackjck.md) | 282 | 282/282 (100%) | 1978, dipindahkan ke PC; pip dibangun jatuh-tembus |
| [TEM-INS](tem-ins.md) | 290 | 290/290 (100%) | seluruhnya dokumentasi; overlay karena memori |
| [CRAZY8](crazy8.md) | 294 | 294/294 (100%) | satu kisi 5&times;5 bergantian; pintu reset tak pernah diketuk |
| [HISTORY](history.md) | 351 | 351/351 (100%) | lima dari enam belas tombol mundur salah sasaran |
| [TRUCKER](trucker.md) | 385 | 385/385 (100%) | kejadian di bagian bulat, besarnya di bagian pecahan |
| [BLACK](black.md) | 396 | 396/396 (100%) | pustaka pribadi di baris 59950, cacatnya ikut tersalin |
| [STARTREK](startrek.md) | 508 | 508/508 (100%) | kuadran sebagai string 192 aksara; Aldebaran tak pernah muncul |
| [ELIZA](eliza.md) | 514 | 514/514 (100%) | bita nol sebagai penanda "sudah ditukar" |
| [BATSHIP](batship.md) | 544 | 544/544 (100%) | petak terlarang diwujudkan, bukan dihitung |
| [YAHTZEE](yahtzee.md) | 612 | 612/612 (100%) | 40 baris komentar menggambar lariknya sendiri |
| [WIZARD](wizard.md) | 944 | 944/944 (100%) | induk Temple of Loth; MAP membocorkan seluruh peta |
| [SPACE](space.md) | 57 | 57/57 (100%) | 44 baris kerangkanya milik seluruh disket contoh IBM |
| [PIECHART](piechart.md) | 77 | 77/77 (100%) | seperseribu radian yang menyelamatkan potongan pertama |
| [15PUZZLE](15puzzle.md) | 117 | 117/117 (100%) | angka yang dicetak jadi dinding penahan cat |
| [BREAKOUT](breakout.md) | 164 | 164/164 (100%) | bola melengkung dari dua perkalian; 1 Januari 1982 |
| [FLYS](flys.md) | 180 | 180/180 (100%) | `DRAW` membaca variabel dari dalam stringnya sendiri |
| [LIFE2](life2.md) | 188 | 188/188 (100%) | daftar petak hidup, bukan papan; `STOP` sebagai penjaga |
| [ABM2A](abm2a.md) | 231 | 231/231 (100%) | `X`+`VARPTR$` &mdash; subrutin di dalam bahasa DRAW |
| [SOLITAIR](solitair.md) | 313 | 313/313 (100%) | petunjuk digambar di halaman teks kedua |
| [LANDER](lander.md) | 399 | 399/399 (100%) | satu `BLOAD` mengisi empat puluh larik |
| [XWING](xwing.md) | 732 | 732/732 (100%) | tiga belas gambar DIKETIK sebagai angka; torpedo bertanya pada layar |
| [TEMPLE](temple.md) | 1.187 | 1187/1187 (100%) | turunan WIZARD; skornya bernama JOHN; bola kristal yang berbohong |

**Delapan puluh tiga program, 18.414 baris — seluruh koleksi `run/`.**

## Permukaan grafik CGA

`mesin/grafik.js` (606 baris) menambahkan `SCREEN 1` dan `SCREEN 2` ke mesin
yang sama. Ia bukan pembungkus kanvas: yang disimpan tetap **larik indeks
warna satu bita per piksel**, persis seperti bidang memori kartunya, dan
kanvas cuma cerminannya. Itu yang membuat `POINT` dan `PAINT` bisa membaca
kembali piksel yang ditulis `LINE` dan `DRAW`.

| perintah | catatan |
| --- | --- |
| `SCREEN 1/2` | 320×200 empat warna, atau 640×200 dua warna |
| `COLOR latar, palet` | di SCREEN 1 artinya **lain**: warna 0 bebas, lalu gugus hijau-merah-coklat atau cyan-magenta-putih |
| `PSET` `PRESET` `POINT` | |
| `LINE` | termasuk `,B` `,BF` dan topeng gaya 16 bit untuk garis putus |
| `CIRCLE` | elips titik-tengah; busur dan potongan pai lewat sudut negatif |
| `PAINT` | isi banjir sampai warna batas, dengan tumpukan sendiri |
| `GET` / `PUT` | lima aksi: PSET, PRESET, AND, OR, **XOR** (bawaan) |
| `DRAW` | penafsir makro penuh: `U D L R E F G H M A C S B N X` |
| `VIEW` | kotak pemotong sederhana |
| `LOCATE` / `PRINT` | teks digambar di atas piksel — 40 kolom di SCREEN 1 |

Tiga hal yang harus diperbaiki sesudah diuji, dan ketiganya sama sebabnya —
**yang tampak benar di layar belum tentu benar sebagai data**:

1. **`CIRCLE` berlubang.** Versi pertama menyapu sudut dan menghasilkan 160
   piksel untuk keliling ~230. Di layar ia terlihat seperti lingkaran; tapi
   `PAINT` yang datang sesudahnya **bocor lewat lubangnya** dan mengecat
   seluruh layar. Diganti algoritma elips titik-tengah, yang menjamin tiap
   piksel bersentuhan dengan piksel berikutnya. Sesudah itu: 208 piksel
   tertutup, dan `PAINT` mengisi 4.051 piksel dengan **nol** kebocoran.
2. **`DRAW` tidak tahan spasi.** `BM 100,150` gagal karena parsernya berhenti
   di spasi; GW-BASIC mengabaikan spasi di mana pun di dalam string DRAW.
3. **Teks di layar grafik tidak sejajar.** Sel aksara CGA lebarnya 8 piksel
   logis; font vektor apa pun lebih sempit. Glifnya direntang mendatar sampai
   persis mengisi selnya.

Teks dan grafik disambung lewat satu kait di `konsol.js`: tiap sel yang
berubah diberitahukan ke permukaan piksel. Tabel baris tidak perlu tahu
bedanya — `LOCATE` dan `PRINT` yang sama bekerja di kedua mode.

### Berkas yang menjelaskan berkas lain

Dua pasang program di koleksi ini saling menerangkan, dan keduanya baru
ketahuan sesudah ditelusuri berdampingan:

- **[WIZARD](wizard.md) adalah induk Temple of Loth.** Delapan harta, tiga
  kutukan, kolam ajaib, bola kristal yang berbohong, dan benda utama yang
  menyamar jadi warp — semuanya sama persis. Dan Temple of Loth sendiri
  tersimpan lengkap di disket ini sebagai **dua** berkas yang saling memanggil:
  [TEM-INS](tem-ins.md) berisi petunjuknya, TEMPLE.BAS (1.187 baris) berisi
  permainannya. Baris 11570 TEMPLE memanggil `CHAIN"TEM-INS.BAS",10`; TEM-INS
  baris 3010 memanggil balik `CHAIN "Temple",700`. TEMPLE.BAS masuk kelompok
  grafik dan belum diport.
- **[YAHTZEE](yahtzee.md) dan [BLACKJCK](blackjck.md) dipindahkan orang yang
  sama** — Patrick Leabo dari Tucson — dari dua program klub CCII di Coronado,
  California, tertanggal 1979 dan 1978.

Dan satu pasang lagi yang sudah dicatat di atas: **[TRUCKER](trucker.md) dan
[BLACK](black.md)**, sama-sama karya Hughes Glantzberg, dengan empat baris
subrutin yang identik aksara demi aksara.

### Empat kali "pintu masuk kedua yang mati"

`SAMP$="NO":GOTO <baris berikutnya+1>` diikuti baris yang menyetelnya `"YES"` —
sebuah pintu masuk lewat `RUN <baris>` yang tidak pernah dipakai siapa pun —
muncul di **[MORTGAGE](mortgage.md), DROIDS, [MUSIC](music.md), dan
[WIZARD](wizard.md)**. Empat program, penulis berbeda, satu kebiasaan.

### Empat cara melacak kartu As

Empat program blackjack di koleksi ini memecahkan masalah yang sama persis —
sebuah As bernilai satu atau sebelas, dan yang mana bergantung kartu
berikutnya — dengan empat cara yang semuanya benar:

| program | caranya |
| --- | --- |
| [BJ](bj.md) | sebelasnya disimpan **di dalam** angka totalnya; `DEF FNA` yang memisahkannya lagi |
| [BLACKJCK](blackjck.md) | penghitung **terpisah** `E(P)`, diturunkan satu per satu — tiga baris, disalin tiga kali |
| [BLACK](black.md) | As menambah **1001**; digit ribuan menghitung As, satuan menyimpan nilai keras |
| [CRAZY8](crazy8.md) | tidak perlu — di Crazy Eights, As cuma sebuah pangkat |

Yang menarik bukan mana yang terbaik, melainkan bahwa empat orang yang
menghadapi kendala yang sama sampai ke empat penyandian yang berbeda, dan
tidak satu pun dari mereka menulis satu kalimat pun yang menjelaskan pilihannya.

### Satu penulis, dua program, satu pustaka

TRUCKER.BAS dan BLACK.BAS sama-sama karya Hughes Glantzberg. Empat baris di
ujung keduanya **identik aksara demi aksara** — 59950, 59960, 59970, dan 59990:
jeda, dan pembaca satu tombol.

Nomornya dipesan setinggi mungkin justru supaya bisa disalin ke mana saja tanpa
bentrok. Itu *namespace*, dibangun dari kesepakatan seseorang dengan dirinya
sendiri, di bahasa yang tidak punya cara mengimpor apa pun.

Dan cacatnya ikut: rumus waktunya mengalikan jam dengan 120, bukan 3600, di
kedua berkas. Satu cacat, dua program, dan tidak ada satu tempat pun untuk
memperbaikinya.

Penanda `RUN "b:???0??"` — nama berkas berisi kartu liar yang tidak diterima
`RUN` — juga muncul di keduanya: dua kali di TRUCKER, sekali di BLACK.

> **Belum selesai di batch ini.** BACKGAM, DROIDS, MUSIC, dan MUSIC1 sudah
> lolos cakupan dan sudah dijalankan, tapi **belum punya halaman `docs/`
> sendiri**, dan satu perilaku MUSIC belum terverifikasi (lihat penyimpangan
> di halamannya: pemilihan tuts hitam/putih di baris 1570).

### Lima program yang memakai layar sebagai struktur data

[SERPENT](serpent.md), [BOWLING](bowling.md), [METEOR](meteor.md), DROIDS,
MUSIC, dan ATTACK sama-sama tidak menyimpan keadaannya di larik mana pun — yang ditanyakan
`SCREEN(baris,kolom)`. Empat yang pertama menyimpan **keadaan yang berubah**;
MUSIC membaca **keadaan yang tetap** (bentuk papan tutsnya sendiri).

### Pintu masuk kedua yang tidak dipakai siapa pun

MORTGAGE, DROIDS, dan MUSIC sama-sama punya bentuk ini:

```basic
980  SAMPLES$ = "NO"
990  GOTO 1010
1000 SAMPLES$ = "YES"
...  IF SAMPLES$="YES" THEN CHAIN "SAMPLES",1000
```

Baris 990 melompati 1000, jadi cabang `CHAIN` tidak pernah tercapai. Program
lain seharusnya masuk lewat `RUN "MORTGAGE",1000`. Tidak ada program seperti
itu di disket ini — tiga kali.
Rantai `BUSONE → … → BUSTEN → MENU` berjalan penuh, sembilan `RUN`
berturut-turut.

### Tiga program yang memakai layar sebagai struktur data

[SERPENT](serpent.md), [BOWLING](bowling.md), dan [METEOR](meteor.md)
sama-sama tidak menyimpan keadaan permainannya di larik mana pun. Yang
ditanyakan `SCREEN(baris,kolom)` — dan yang terlihat di layar *adalah*
datanya. Tiga penulis berbeda, tiga tahun berbeda, satu gagasan.

### Tiga kali penyalinan yang membawa cacatnya

| dari | ke | yang ikut terbawa |
|---|---|---|
| [SIMEQN](simeqn.md) 390–590 | [CURVE](curve.md) 780–980 | pembagian tanpa cek nol, `V(M)` di dalam gelung |
| BUSTHREE 1210 | BUSSEVEN 930 | `JP` yang tidak pernah diisi |
| sepuluh berkas BUS* | — | gelung perakit garis; hanya BUSEIGHT yang diperbaiki |

### Lima perbaikan permukaan grafik yang datang dari program sungguhan

Sesudah sepuluh program grafik ditelusuri, lima hal lagi harus diperbaiki —
dan tiap satu ditagih oleh satu program tertentu:

4. **Teks tidak ada di dalam piksel.** Mula-mula glif dilukis langsung ke
   kanvas dan tidak pernah masuk ke larik piksel: tulisan yang terlihat tapi
   tidak ada. [15PUZZLE](15puzzle.md) baris 1180-1190 mencetak angka ubin lalu
   mengecat petaknya dengan **batas warna yang sama dengan angka itu** — cat
   yang mengalir mengelilingi angka dan angkanya selamat. Itu hanya mungkin
   kalau coretan angkanya benar-benar ada di bidang piksel. Glifnya sekarang
   diraster ke kanvas 8×8 tersembunyi, dibaca kembali, dan dipasang lewat
   `pset` yang sama dengan LINE dan CIRCLE. Diukur sesudahnya: ubin 713 piksel,
   684 berwarna ubin dan **29 tetap warna angka**, tanpa kebocoran.
5. **Tanda sudut `CIRCLE` diperiksa sekali untuk dua sudut.** Di GW-BASIC
   tandanya diperiksa **per sudut**: `CIRCLE ...,-1,2` menghasilkan busur
   dengan satu jari-jari. [PIECHART](piechart.md) baris 1620 menulis
   `-A1-0.001` bukan `-A1` justru karena itu — minus nol tetap nol, dan tanpa
   seperseribu itu potongan pertama kehilangan satu sisinya. Diukur: busur
   telanjang 48 piksel, satu jari-jari 81, dua jari-jari 122.
6. **`PSET` tidak memindahkan titik acuan.** [ABM2A](abm2a.md) baris 950
   menulis `PSET(0,180):DRAW "R32;X..."` — seluruh garis langit enam kotanya
   digambar secara **relatif** dari titik yang ditaruh PSET. Tanpa perpindahan
   itu, kotanya tergambar dari tengah layar dan berakhir di luar batas kanan.
7. **Titik acuan sesudah `SCREEN` dan `CLS` bukan (0,0) melainkan TENGAH
   LAYAR.** [FLYS](flys.md) baris 240-290 menggambar lalatnya tanpa satu pun
   koordinat mutlak, lalu memungutnya dengan `GET (151,91)-(172,103)` — angka
   yang hanya masuk akal kalau penanya bermula di (160,100). Sebelum
   diperbaiki, ketiga sprite lalatnya kosong melompong.
8. **`SCREEN` membersihkan layar hanya kalau MODENYA berganti.**
   [SOLITAIR](solitair.md) memanggil `SCREEN 0,1,...` berkali-kali semata-mata
   untuk menukar halaman teks, dan mejanya harus selamat. Yang membuktikan
   aturannya bukan manual melainkan [LANDER](lander.md) baris 3940:
   `SCREEN 1  'be sure next line is a change 02/23/82` — dua pernyataan
   berurutan dengan komentar bertanggal yang mengaku persis kenapa.

Dan satu tambahan yang bukan perbaikan melainkan kemampuan baru: **halaman
teks**. `SCREEN mode,warna,aktif,tampak` memilih halaman mana yang ditulisi
dan mana yang ditampilkan, dan keduanya boleh berbeda — lihat
[SOLITAIR](solitair.md).

### Dua puluh kali `WHILE+`

Tiap satu pernyataan `WHILE` di seluruh koleksi ini ditulis `WHILE+`, dengan
tanda tambah nyasar sesudahnya:

| berkas | jumlah |
|---|--:|
| DRAW.BAS | 6 |
| BOWLING.BAS | 5 |
| CRAZY8.BAS | 3 |
| SOLITAIR.BAS | 2 |
| 15PUZZLE, FLYS, STATS, YAHTZEE | 1 masing-masing |

Dua puluh kemunculan di delapan berkas, delapan penulis yang tidak saling
kenal. Dan **satu** pengecualian: MAXIT1.BAS baris 3000 menulis `WHILE KS$=""`
tanpa tambah.

GW-BASIC menerimanya — plus uner di depan sebuah ungkapan tidak mengubah
nilainya — jadi tak satu pun program terganggu. Tapi delapan penulis tidak
mengetikkan salah ketik yang sama; yang lebih mungkin, delapan berkas ini
melewati **satu alat yang sama** dalam perjalanannya ke disket ini, dan
MAXIT1 tidak.

Ditandai untuk diperiksa di mesin aslinya, bersama BREAKOUT.BAS baris 720 —
satu-satunya tempat di koleksi ini yang memakai aksara **backtick** (&H60)
di luar string, di posisi yang mengharuskannya jadi penanda komentar.

### Empat cara mengosongkan penyangga papan tik

Empat program butuh membuang tombol yang tertumpuk sebelum bertanya, dan tak
satu pun memakai cara yang sama:

| program | caranya | tingkat |
|---|---|---|
| [15PUZZLE](15puzzle.md) 355 | `WHILE+ INKEY$<>"":WEND` | BASIC murni |
| [LANDER](lander.md) 1180 | `DEF SEG:POKE 106,0` | daerah kerja BASIC |
| [LIFE2](life2.md) 2016 | `POKE 1052,PEEK(1050)` | ekor ← kepala, BIOS |
| [ABM2A](abm2a.md) 1210 | `POKE 1050,PEEK(1052)` | kepala ← ekor, BIOS |

Dua yang terakhir sama persis akibatnya dan **berlawanan penugasannya**.

### Empat cara kehilangan jalan pulang ke menu

| program | bentuknya | nasibnya |
|---|---|---|
| [SPACE](space.md) 1298 | `CHAIN "samples",1000` | tak pernah dicapai |
| [15PUZZLE](15puzzle.md) 660 | `END 'RUN "MENU"` | disunting jadi komentar |
| [BREAKOUT](breakout.md) 1390 | `RUN "MENU.PGM"` | **berkasnya tidak ada** |
| [ABM2A](abm2a.md) 630 | `LOAD"MENU",R` | menu ada, tapi lewat LOAD |
| [LIFE2](life2.md) 65002 | `IF ADDR.%<>0 THEN RUN DRIVE$+":START"` | syaratnya tak pernah benar |

### Dua cara membawa gambar kapal

[LANDER](lander.md) dan XWING ada di disket yang sama dan sama-sama butuh
puluhan sprite. Keduanya memilih jalan yang berlawanan:

- **LANDER** menyimpannya di berkas terpisah dan menuangnya dengan satu
  `BLOAD` ke alamat `VARPTR(PDATA(0))` — yang terus melewati PDATA dan
  menimpa 39 larik yang di-DIM sesudahnya. Yang menghubungkan bita ke-1.234
  dengan larik R3 hanyalah **urutan baris 1690-1710**.
- **XWING** mengetikkan angkanya langsung ke dalam program sebagai penugasan:
  `IM4(0)=22:IM4(1)=7:IM4(2)=128:IM4(3)=-32760:...` — ratusan bilangan bulat
  bertanda, satu per satu, termasuk `-32768!` yang butuh akhiran `!` supaya
  tidak melimpah saat diurai.

Satu memindahkan persoalannya ke disket; satu memindahkannya ke jari.

### Huruf O yang menyamar jadi nol

Dua program memakai huruf `O` di tempat angka `0` — dan keduanya benar, karena
variabel `O` tidak pernah diisi di kedua program:

- [ABM2A](abm2a.md) baris 250: `LINE (...)-(...),O` — warna garis penghapus.
- [SOLITAIR](solitair.md) baris 2770-2780: `A! = O` dan `FOR ID = O TO 3`.

Kebenaran yang dititipkan pada ketiadaan. Satu baris `O=3` di mana pun akan
mematahkan keduanya.

### Penerjemah yang sengaja sempit, dan dua bug yang ditangkapnya

Dua program terakhir — XWING (732 baris) dan TEMPLE (1.187 baris) — terlalu
besar untuk ditulis tangan seluruhnya tanpa salah salin. Keduanya dibangkitkan
dari sumbernya: **1.459 dari 1.919 baris** diterjemahkan otomatis, sisanya
ditulis tangan.

Aturan tunggal yang membuatnya aman: **apa pun yang tidak dikenali PERSIS
dikembalikan sebagai "menyerah", dan barisnya ditulis tangan.** Tidak ada baris
yang diterjemahkan setengah, dan tidak ada tebakan.

Aturan itu langsung membayar dirinya. Ketika penerjemahnya diperketat untuk
TEMPLE, ia menolak satu baris XWING yang versi longgarnya dulu terima:

```basic
5840 IF POINT(38,21)<>3 THEN 5880
```

`POINT` diperlakukan sebagai variabel biasa, dan hasilnya
`(m.v['POINT'] || 0) (38, 21)` — pemanggilan atas angka nol. Uji sebelumnya
tidak pernah menyentuhnya karena torpedo tidak pernah ditembakkan.

Lalu TEMPLE menemukan dua lagi, dan keduanya soal yang sama dari dua sisi:

1. **`=` di dalam ungkapan adalah PERBANDINGAN.** `OT=OT+4*(RC=1)` — yang
   pertama menugaskan, yang kedua membandingkan. Penerjemahnya menghasilkan
   penugasan bersarang, dan berkasnya gagal dimuat.
2. **Perbandingan yang benar bernilai −1, bukan +1.** Sesudah bug pertama
   diperbaiki, `4*(RC===1)` memberi **+4** padahal BASIC memberi **−4**.
   Tandanya terbalik, dan tidak ada galat apa pun yang muncul.

Perbaikannya bukan menerjemahkan lebih pintar melainkan **menolak lebih
banyak**: perbandingan di luar syarat `IF` sekarang selalu ditolak. Dua baris
TEMPLE jatuh ke tulisan tangan karenanya — 2150 dan 9080 — dan yang kedua
ternyata membuat `VF` selalu negatif, sehingga uji `VF=1` di baris 6880 **tidak
pernah benar**. Cacat di programnya sendiri, yang baru terlihat karena
penerjemahnya menolak menebak.

XWING dibangun ulang dengan penerjemah yang sudah diperketat dan hasilnya tidak
berubah satu bita pun.

Alatnya disimpan di [`alat/pembangkit/`](../alat/pembangkit/README.md), bersama
pembangkit halaman `docs/`. `python bangun.py` di sana membangun ulang
XWING.js dan TEMPLE.js dari `.BAS`-nya dan mengatakan apakah hasilnya masih
sama dengan yang tersimpan — tanpa menyentuh apa pun kecuali diminta `--tulis`.

### Yang masih menghalangi

- **`CHAIN MERGE` baru ditiru sebagian.** READING.BAS jalan penuh karena berkas
  yang disisipkannya seluruhnya `DATA`; kalau kelak ada yang menyisipkan baris
  yang **bisa dijalankan**, tabel dan panel sumber harus ikut disambung, dan
  itu belum dibangun.

---
[MENU](menu.md) · [INTRO](intro.md) · [CHECK](check.md) · [TOWERS](towers.md) · [HEAREYE](heareye.md) · [TICTAC](tictac.md) · [MASTER](master.md) · [BOGGY](boggy.md) · [PEGLEAP](pegleap.md) · [BIO](bio.md) · [HANGMAN](hangman.md) · [BUSONE](busone.md) · [OTHELLO](othello.md) · [CRAPS](craps.md) · [DRAW](draw.md) · [WILDCAT](wildcat.md) · [MAZE](maze.md) · [SUB](sub.md) · [21](21.md) · [FOOTBALL](football.md) · [GOLF](golf.md) · [MATCH](match.md) · [DOMINOES](dominoes.md) · [STATS](stats.md) · [MENU2](menu2.md) · [WHATMONF](whatmonf.md) · [OCTAVE](octave.md) · [GERMFOLK](germfolk.md) · [WRTSTR](wrtstr.md) · [DREAM](dream.md) · [NOTETABL](notetabl.md) · [WORDS](words.md) · [READING](reading.md) · [INTEGRAT](integrat.md) · [SIMEQN](simeqn.md) · [Keluarga BUS*](bus-akuntansi.md) · [SERPENT](serpent.md) · [BOWLING](bowling.md) · [METEOR](meteor.md) · [CURVE](curve.md) · [HINTS](hints.md) · [KENO](keno.md) · [ZAP'EM](zapem.md) · [HIQUE2](hique2.md) · [MAXIT1](maxit1.md) · [ANATOMY](anatomy.md) · [MORTGAGE](mortgage.md) · [SPACE](space.md) · [PIECHART](piechart.md) · [15PUZZLE](15puzzle.md) · [BREAKOUT](breakout.md) · [FLYS](flys.md) · [LIFE2](life2.md) · [ABM2A](abm2a.md) · [SOLITAIR](solitair.md) · [LANDER](lander.md) · [XWING](xwing.md) · [TEMPLE](temple.md) · [Katalog koleksi](../../README.md)
