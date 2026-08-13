# Fondasi: dari retro ke modern

Dokumen ini menjelaskan **setiap keputusan tingkat koleksi** — apa yang diubah
dari bentuk aslinya, bagaimana logika retro-nya ditafsirkan, dan bagaimana
wujud implementasinya sekarang.

Ini berlaku untuk ke-66 aplikasi. Dokumen per program hanya memuat yang khas
program itu, dan merujuk balik ke sini untuk yang umum.

Prinsip yang saya pegang: **tidak ada perubahan tanpa alasan tertulis.** Kalau
sesuatu diubah hanya karena selera, itu dinyatakan sebagai selera — bukan
disamarkan sebagai keharusan teknis.

---

## 1 · Cara membaca dokumen ini

Hampir setiap keanehan di kode 1982 lahir dari sebuah **kendala**. Memahami
kendalanya jauh lebih berguna daripada sekadar tahu bentuk barunya, karena
kendala berubah tapi cara berpikirnya tidak.

Jadi tiap keputusan ditulis dalam empat kolom:

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|

Kolom ketiga itulah pelajarannya.

---

## 2 · Keputusan besar: apa yang berubah total

### 2.1 Menunggu masukan

| | |
|---|---|
| **Bentuk asli** | `280 Z=INKEY$: IF Z="" THEN 280` |
| **Kendala** | BASIC tidak punya konsep asinkron. Satu-satunya cara "menunggu" adalah memutar CPU sekencang mungkin sampai ada tombol. Program yang menunggu tetap membakar 100% prosesor. |
| **Penafsiran** | Yang sebenarnya dimaksud penulis: *"berhenti di sini sampai pemain menekan sesuatu."* Loop itu bukan tujuan — ia satu-satunya cara menyatakan maksud tersebut. |
| **Sekarang** | `await input.nextKey()` di `_shared/input.js`. Maksudnya sama persis, tapi peramban punya event loop: menunggu benar-benar berarti tidak melakukan apa-apa. Hemat baterai, tab tidak membeku. |

Idiom pendampingnya, `DEF SEG: POKE 106,0`, menulis langsung ke ruang kerja
interpreter GW-BASIC untuk mengosongkan penyangga ketik-dulu — tidak
terdokumentasi, dan hanya jalan di GW-BASIC. Maksudnya: *"buang tombol yang
sudah menumpuk supaya pemain tidak melewati layar ini tanpa membacanya."*
Sekarang jadi `input.flush()`, satu fungsi bernama.

### 2.2 Mengukur waktu

| | |
|---|---|
| **Bentuk asli** | `FOR I=1 TO 2000: NEXT` |
| **Kendala** | Tidak ada jam beresolusi tinggi yang bisa diakses BASIC. Waktu diukur dengan **menghitung pekerjaan**. |
| **Penafsiran** | Penulis ingin jeda kira-kira setengah detik di IBM PC 4,77 MHz. Angka 2000 itu hasil coba-coba di mesin yang ada di mejanya. |
| **Sekarang** | `await RETRO.wait(500)` untuk jeda, dan *fixed timestep* di `_shared/loop.js` untuk simulasi. |

**Ini perubahan terpenting di seluruh proyek.** Karena kecepatan diukur dengan
menghitung, seluruh generasi permainan ini jadi tak bisa dimainkan begitu
prosesor makin cepat — dan lahirlah `SLOWDOWN.COM` serta `GOSLOW.COM` yang ada
di `..\tools\`. Itu bukan fitur; itu tambalan untuk kesalahan rancangan.

Pelajarannya masih berlaku persis: **jangan mengukur waktu dengan menghitung
pekerjaan. Ukur waktu dengan jam.**

### 2.3 Grafik

| | |
|---|---|
| **Bentuk asli** | `PRINT STRING$(80,219)`, `CHR$(201)+STRING$(2,205)+CHR$(187)`, kisi 80×25 karakter |
| **Kendala** | Mode grafis CGA lambat dan boros: 320×200 memakan 16 KB dari 64 KB yang tersedia. Menulis karakter ke memori layar hampir gratis. Karena itu 95 dari 111 pemakaian `SCREEN` di koleksi ini adalah `SCREEN 0` — mode teks. |
| **Penafsiran** | Bingkai, kartu, papan, dan pesawat semuanya *ingin* jadi gambar. Karakter kotak CP437 adalah kompromi, bukan pilihan estetis. |
| **Sekarang** | SVG. Bebas resolusi, bisa dianimasikan, ringan, dan satu definisi dipakai berkali-kali lewat `<use>` — persis semangat `DIM FIG$(5,5)` di CRAZY8.BAS yang membangun kartu dari data alih-alih menyimpan 52 gambar. |

Satu teknik lama yang **sengaja ditiru**: `CRAPS.BAS` menyimpan gambar dadu
sebagai satu string berisi karakter kendali (`CHR$(31)` = kursor turun,
`CHR$(29)` = kursor kiri), sehingga satu `PRINT` menggambar kotak dua dimensi.
Itu *escape sequence* — prinsip yang sama dengan `\033[2J` di terminal Unix
sampai hari ini. Semangatnya — **rakit sekali, gambar berkali-kali** — dipakai
di `_shared/svg.js`.

### 2.4 Suara

| | |
|---|---|
| **Bentuk asli** | `PLAY "o2 t200 l8 d g a b >c d4"`, `SOUND 525.25, 18.2` |
| **Kendala** | Speaker PC internal: satu suara, gelombang kotak, tanpa kendali volume. Durasi `SOUND` dalam satuan 1/18,2 detik karena pencacah waktu PC berdetak 18,2 kali per detik. |
| **Penafsiran** | `PLAY` adalah *domain-specific language* untuk not — sebuah bahasa mini yang dipanggang ke dalam interpreter tahun 1981. Itu bagian dari pelajarannya. |
| **Sekarang** | Bahasa makro `PLAY` **ditafsirkan sungguhan** di `_shared/audio.js`, bukan diganti API lain. String lagu dari kode 1982 bisa disalin apa adanya dan berbunyi sama. Bawaannya tetap gelombang kotak. |

Yang berubah, dan alasannya:

- **Ada kendali volume dan tombol bisu.** Speaker PC tidak punya. Ini keputusan
  kenyamanan, bukan keharusan teknis — dinyatakan sebagai selera.
- **Ada amplop serang/lepas 5 ms.** Ini keharusan: gelombang kotak yang dipotong
  mendadak menghasilkan "klik" keras di speaker modern yang tidak terjadi di
  speaker PC kecil.
- **Ada pilihan instrumen**, dan bisa diganti di tengah lagu (§2.4a).
- **Butuh gestur pengguna dulu.** Kendala **baru** yang tidak dimiliki versi
  1982: peramban melarang audio berbunyi sebelum pengguna mengklik (§2.4b).
- **Nada dijadwalkan beruntun, bukan sekaligus** — sehingga bunyi bisa
  dihentikan dan instrumen bisa berubah di tengah jalan (§2.4c).
- **Ada jeda yang tidak menggulung balik** (§2.4d).
- **Berkas MIDI bisa dimuat** — format 1988 yang masih hidup (§2.4e).

#### 2.4a Delapan instrumen — dan kenapa speaker PC tetap yang bawaan

Bawaan `pcspeaker` sengaja dipertahankan sebagai pilihan pertama. Ia
satu-satunya yang berbunyi seperti mesin aslinya, dan itu bagian dari isi
pelajaran. Tujuh sisanya — piano, gitar, biola, terompet, seruling, organ,
kotak musik — adalah **kenyamanan yang ditawarkan, bukan koreksi**. Pemilihannya
disimpan di `localStorage` dan berlaku di semua halaman musik.

Semuanya **disintesis**, tidak ada satu pun berkas rekaman. Alasannya kendala,
bukan selera: halaman ini harus jalan dari `file://` tanpa aset tambahan, dan
satu set sampel piano yang layak sudah berukuran puluhan megabita.

Yang membedakan satu instrumen dari lainnya cuma empat angka:

| | Apa | Contoh perbedaannya |
|---|---|---|
| `partials` | deret harmonik: perbandingan frekuensi dan kerasnya | organ punya harmonik genap kuat; seruling nyaris sinus murni |
| `env` | serang / peluruhan / tahan / lepas | piano meluruh sendiri walau tuts ditahan; biola bertahan selama digesek |
| `filter` | menumpulkan atau menajamkan | gitar dipotong di 3,2 kHz agar tidak terdengar "kaca" |
| `vibrato` | goyangan kecil pada frekuensi | ciri khas alat gesek dan tiup |

Jujurnya: ini **pendekatan, bukan tiruan**. Biola sungguhan jauh lebih rumit
dari enam partial dan satu LFO. Yang dituju hanya "bisa dibedakan telinga".

Konsekuensi yang perlu dinyatakan: dengan instrumen selain `pcspeaker`,
bunyinya **tidak lagi setia pada mesin 1982**. Itu pilihan pengguna, dan
karena itu ia harus berupa pilihan — bukan bawaan.

#### 2.4b Gestur pengguna: overlay yang dibongkar kembali

Versi pertama fondasi ini menyelesaikan aturan peramban dengan
`RETRO.ui.startOverlay()` — lapisan "klik untuk menyalakan suara" di depan tiap
halaman. **Itu dibuang, dan penghapusannya sendiri layak dijadikan pelajaran.**

Overlay itu memecahkan masalah yang salah. Aturan perambannya berbunyi "audio
tidak boleh berbunyi sebelum ada gestur pengguna" — gestur **apa pun**, sekali
saja, di mana saja di halaman. Sementara itu setiap halaman di sini memang
sudah punya tombol yang harus ditekan lebih dulu: "Mainkan" di halaman musik,
huruf di HANGMAN, ubin di 15PUZZLE. Gesturnya sudah pasti terjadi.

Jadi overlay itu menambah satu klik yang tidak menghasilkan apa-apa, di depan
klik yang memang sudah ada.

Sekarang penanganannya empat baris di `audio.js`, dan **tidak ada satu pun
halaman yang perlu tahu soal ini**:

```js
const WAKE = ['pointerdown', 'keydown', 'touchstart'];
function wakeOnce() {
  unlock();
  WAKE.forEach(e => global.removeEventListener(e, wakeOnce, true));
}
WAKE.forEach(e => global.addEventListener(e, wakeOnce, true));
```

Perhatikan `wakeOnce` sebagai **fungsi bernama**, bukan tiga arrow function.
Versi pertama saya menulis `addEventListener(e, () => …)` di dalam `forEach`,
yang membuat tiga closure berbeda — dan `removeEventListener` tidak akan pernah
cocok dengan satu pun dari mereka. Pendengarnya akan menetap selamanya. Bug ini
tidak pernah terlihat karena akibatnya cuma "sedikit lebih boros"; ia hanya bisa
ditemukan dengan membaca.

Pelajaran yang lebih besar: **antarmuka yang paling baik untuk sebuah kendala
sering kali adalah tidak ada antarmuka sama sekali.** Sebelum membangun
komponen untuk mengurus sebuah batasan, periksa dulu apakah batasan itu
sebenarnya sudah terpenuhi oleh alur yang ada.

#### 2.4c Penjadwal beruntun — dua bug dari satu penyebab

Versi pertama `audio.play()` menjadwalkan **seluruh lagu** ke Web Audio dalam
satu kali jalan:

```js
notes.forEach(n => tone(n.freq, t0 + n.at, n.dur, n.gate));
```

Sederhana, akurat, dan salah. Dua cacat baru terlihat saat halamannya benar-benar
dipakai:

| Gejala | Sebabnya |
|---|---|
| Tombol **Berhenti** hanya membekukan not balok; bunyinya jalan terus, dan menekan Mainkan lagi menghasilkan **dua lagu bertumpuk** | Osilator yang sudah di-`start()` akan berbunyi pada waktunya. Tidak ada yang memegang rujukannya, jadi tidak ada yang bisa menghentikannya |
| **Pergantian instrumen** tidak berlaku di tengah lagu | `tone()` membaca instrumen saat **menjadwalkan**, dan penjadwalan sudah selesai sebelum nada pertama berbunyi |

Keduanya gejala dari satu penyebab yang sama: **keputusan diambil terlalu awal.**

Penyelesaiannya pola baku Web Audio — sebuah pemompa yang berjalan tiap 25 ms
dan hanya menjadwalkan nada yang jatuh dalam 120 ms ke depan:

```js
function pump() {
  if (my !== gen) return;                     // sudah dihentikan
  const now = c.currentTime;
  while (i < notes.length && t0 + notes[i].at < now + LOOKAHEAD) {
    tone(notes[i].freq, t0 + notes[i].at, notes[i].dur, notes[i].gate);
    i++;
  }
  if (i >= notes.length && now >= t0 + total) return finish(my);
  later(pump, TICK);
}
```

Angkanya perlu dijelaskan, karena keduanya adalah kompromi:

- **120 ms ke depan** — cukup jauh supaya nada tetap tepat waktu walau
  `setTimeout` tersendat (dan `setTimeout` *selalu* tersendat: tab di latar
  belakang bisa memperlambatnya sampai sekali per detik). Cukup dekat supaya
  perubahan apa pun terasa seketika.
- **25 ms sekali** — jauh lebih rapat dari 120 ms, jadi selalu ada beberapa
  kesempatan menjadwalkan sebelum jendelanya habis.

Ini bukan tambalan; ia mengubah sifat programnya. Sebuah nada tidak lagi "sudah
pasti akan berbunyi" — ia baru pasti 120 ms sebelum terdengar. Segala sesuatu
yang bisa berubah di tengah lagu jadi mungkin, dan pergantian instrumen hanyalah
yang pertama.

Bagian keduanya: setiap suara yang hidup **didaftarkan**, supaya ada yang bisa
dihentikan.

```js
const live = new Set();
function killAll() {
  const t = ctx.currentTime;
  live.forEach(h => {
    h.amp.gain.cancelScheduledValues(t);
    h.amp.gain.setValueAtTime(Math.max(0.0001, h.amp.gain.value), t);
    h.amp.gain.linearRampToValueAtTime(0, t + 0.03);   // diredam, bukan dipotong
    h.oscs.forEach(o => o.stop(t + 0.05));
  });
  live.clear();
}
```

Peredaman 30 ms itu bukan kehalusan yang berlebihan: memotong gelombang di
tengah menghasilkan "klik" yang justru lebih mengganggu daripada nada yang
sedang dihentikan. Ini persis alasan yang sama dengan amplop 5 ms di §2.4.

> **Pelajaran yang lebih besar.** Kalau sebuah program tidak bisa dihentikan
> atau tidak bisa berubah di tengah jalan, biasanya penyebabnya bukan
> "kurang tombol" — melainkan keputusan yang sudah dibekukan terlalu awal.
> Menunda keputusan sampai sedekat mungkin dengan saat ia dibutuhkan hampir
> selalu membuka pintu yang tadinya terkunci.

#### 2.4c-bis Dua cacat, satu gejala — dan gejalanya menunjuk ke arah yang salah

Laporannya begini: *"kalau saya pilih piano, tuts pertama langsung bunyi. Kalau
instrumen lain, tuts pertama tidak bunyi; tuts kedua baru ada bunyinya."*

Gejala itu menunjuk lurus ke instrumennya. Ternyata bukan itu sebabnya sama
sekali — ada **dua** cacat berbeda yang kebetulan menghasilkan satu keluhan.

**Cacat pertama: perangkat suara yang belum terbuka.**

`AudioContext` dibuat malas, pada gestur pertama. Tapi konteks yang baru dibuat
belum benar-benar tersambung ke perangkat suara; selama perangkatnya dibuka —
puluhan milidetik, kadang lebih di Windows — `currentTime` tetap di nol dan
belum ada satu pun *render quantum* yang berjalan.

Akibatnya bukan cuma nadanya terlambat. `AudioParam.value` mengembalikan nilai
yang **terakhir benar-benar dirender**. Kalau belum ada yang dirender, yang
dikembalikan adalah nilai awalnya: nol. Lalu `release()` melakukan ini:

```js
g.setValueAtTime(Math.max(0.0001, g.value), now);   // g.value masih 0
g.linearRampToValueAtTime(0, now + rel);            // 0.0001 -> 0
```

Sebuah tanjakan dari nol ke nol. Nadanya tidak pernah berbunyi.

Dua perbaikannya:

1. **Pemanasan.** Saat kunci dibuka, satu buffer berisi satu cuplikan senyap
   dibunyikan. Itu memaksa perangkatnya terbuka sekarang, sehingga nada
   sungguhan yang menyusul menemukan jam yang sudah berjalan.
2. **Jangan bertanya, hitung.** `release()` tidak lagi membaca `.value`. Ia
   menghitung nilai amplop dari jadwal yang ditulisnya sendiri:

   ```js
   function levelAt(t) {
     if (t <= when) return 0.0001;
     if (t < tA)    return peak * (t - when) / (tA - when);
     …
   }
   ```

   Kita yang menulis jadwalnya; kita tahu nilainya tanpa bertanya pada untai
   audio. Ketergantungan pada keadaan yang tidak bisa kita amati hilang
   seluruhnya.

**Cacat kedua: serangan yang terpotong.**

`release()` memanggil `cancelScheduledValues(now)`, yang menghapus **semua**
kejadian berwaktu ≥ `now` — termasuk tanjakan menuju puncak kalau serangannya
belum selesai. Nada yang dilepas di tengah serangan berhenti di separuh jalan.

| | serangan | puncak (lama) | puncak (baru) |
|---|--:|--:|--:|
| piano | 2 ms | 1,38 | 1,38 |
| terompet | 45 ms | 0,80 | 0,80 |
| seruling | 70 ms | 0,71 | 1,10 |
| biola | 90 ms | **0,45** | 0,90 |

*(ketukan 50 ms; angka relatif terhadap `master.gain` = 0,22)*

Sekarang serangannya diselesaikan dulu — dipendekkan jadi 20 ms, tapi tidak
dihapus — sebelum turun ke nol. Nada pendek tetap terdengar, dan warna
instrumennya tetap utuh.

**Kenapa gejalanya menyesatkan.** Cacat pertama mengenai semua instrumen sama
rata. Cacat kedua tidak: ia hanya menyentuh instrumen berserangan panjang, dan
digabung dengan gain bawaannya (piano 1,5 lawan biola 0,9) selisihnya jadi
sekitar 10 dB. Cukup untuk membuat yang satu terdengar jelas dan yang lain
seperti tidak ada sama sekali.

> **Pelajaran.** Gejala yang berkorelasi rapi dengan sebuah pilihan
> ("instrumennya") sangat meyakinkan, dan justru karena itu berbahaya. Di sini
> korelasinya nyata tapi bukan sebabnya — instrumen hanya menentukan seberapa
> **terlihat** bugnya, bukan apakah bugnya ada.
>
> Cara memeriksanya: sebelum percaya pada penjelasan yang rapi, hitung apa yang
> diramalkannya. Kedua hipotesis pertama saya di sini gugur oleh simulasi
> amplopnya sendiri — yang pertama meramalkan senyap padahal hasilnya separuh
> volume, yang kedua meramalkan hanya sebagian instrumen padahal hasilnya
> semua. Yang benar baru muncul setelah keduanya gugur.

#### 2.4d Jeda: menyimpan jadwal, bukan membuangnya

`stop()` dan `pause()` sama-sama membuat semuanya diam. Bedanya bukan seberapa
keras berhentinya, melainkan **apa yang dibuang**:

| | `stop()` | `pause()` |
|---|---|---|
| Bunyi yang sedang berjalan | diredam | diredam |
| Jadwal sisa lagu | dibuang | disimpan |
| Posisi | hilang | diingat |
| Promise `play()` | diselesaikan | dibiarkan menggantung sampai lagunya benar-benar habis |

Jeda dikerjakan dengan mencatat posisi lalu memulai ulang penjadwalnya dari
situ:

```js
pause() {
  cur.at = ctx.currentTime - cur.t0;      // posisi dalam lagu
  timers.forEach(clearTimeout); timers.clear();
  killAll();
}
resume() {
  cur.t0 = ctx.currentTime + LEAD - cur.at;
  cur.i  = cur.notes.findIndex(n => n.at >= cur.at);   // dihitung ULANG
  pump();
}
```

Baris `cur.i` yang dihitung ulang itu yang paling mudah salah. Saat dijeda,
sebagian nada **sudah** dijadwalkan ke dalam jendela 120 ms lalu dibunuh
`killAll()`. Kalau indeksnya diteruskan begitu saja dari nilai tersimpan,
nada-nada itu hilang tanpa jejak — bunyinya bolong tepat di titik jeda, dan
bugnya hanya muncul kalau kebetulan menjeda di sela yang tepat. Mencari ulang
membuat pertanyaannya sederhana dan tidak bergantung pada keadaan: *mana nada
pertama yang belum lewat?*

Sisi gambarnya diurus `RETRO.clock()` di `_shared/loop.js` — jam yang bisa
dijeda, dengan pola stopwatch: menabung waktu yang sudah lewat alih-alih
menyimpan "kapan mulai". Menyimpan waktu mulai saja tidak cukup begitu boleh
ada jeda di tengah, dan itu berlaku untuk *semua* pengukur durasi, bukan hanya
musik.

#### 2.4e Membaca berkas MIDI

`_shared/midi.js` membaca Standard MIDI File (`.mid`) tanpa pustaka apa pun,
dari `ArrayBuffer` lewat `DataView`. Itu keharusan, bukan pilihan: halaman ini
jalan dari `file://`, jadi tidak ada `fetch()` dan tidak ada CDN. `FileReader`
tetap bekerja karena berkasnya diserahkan pengguna sendiri.

Formatnya seumuran dengan koleksi ini — SMF dibakukan 1988, dua tahun sebelum
`GERMFOLK.BAS` — dan belum berubah sejak itu.

Tiga hal yang paling sering dibaca salah, dan ketiganya adalah **penghematan
tempat dari era ketika satu disket berisi 360 KB**:

| | Apa | Kalau diabaikan |
|---|---|---|
| **VLQ** | delta time ditulis 7 bit per byte, bit ke-8 = "ada lanjutan" | panjang kejadian salah, sisa trek jadi sampah |
| **Running status** | byte status boleh dihilangkan kalau sama dengan sebelumnya | pembaca tersesat di byte pertama yang dihemat |
| **Note-on velocity 0** | berarti note-off, supaya running status tidak terputus | semua not menyala dan tidak pernah mati |

Gagasan VLQ masih hidup di tempat yang jauh dari musik: Protocol Buffers,
LEB128 di WebAssembly, dan panjang muatan di UTF-8 memakai prinsip yang persis
sama.

Hal keempat yang tidak terlihat sampai dicoba: **tick bukan detik**, dan
konversinya tidak bisa satu perkalian karena tempo boleh berubah di tengah lagu
(meta event `0x51`). Yang dilakukan `makeTickToSec()` adalah membangun peta
tempo lalu menjalaninya — sama seperti menghitung jarak tempuh kendaraan yang
berkali-kali ganti kecepatan.

Uji yang dipakai: sebuah berkas MIDI dibuat sendiri dengan jawaban yang sudah
diketahui — dua perubahan tempo, running status, velocity-0-sebagai-note-off,
akor dua nada, dan satu trek perkusi yang harus dilewati. Membuat berkas ujinya
memakan waktu lebih lama daripada menulis pengurainya, dan itu wajar: bagian
yang sulit dari pengurai bukan menulisnya, melainkan mengetahui bahwa ia benar.

### 2.5 Menyimpan data

| | |
|---|---|
| **Bentuk asli** | `OPEN "O",1,"BS.SCO"` … `WRITE#1, NME$(I), SCORE(I)` |
| **Kendala** | Satu-satunya penyimpanan adalah disket. `STATS.BAS` punya seluruh rutin khusus untuk mendeteksi pemakai memasang disket program alih-alih disket data. |
| **Penafsiran** | `WRITE#` dipilih dan bukan `PRINT#` karena ia menyisipkan koma pemisah dan tanda kutip otomatis — hasilnya bisa dibaca kembali `INPUT#` tanpa ambiguitas. Itu CSV, disediakan bahasa, tahun 1982. |
| **Sekarang** | `localStorage` + JSON di `_shared/store.js`. Tidak ada lagi disket yang bisa salah pasang. |

Kendala **baru**: kalau halaman dibuka lewat `file://`, semua berkas lokal
berbagi satu origin, jadi kunci wajib diberi awalan per aplikasi
(`retro:hangman:…`). Dan di mode privat `localStorage` bisa dilarang sama
sekali, jadi ada jalur cadangan ke memori.

### 2.6 Keacakan

| | |
|---|---|
| **Bentuk asli** | `RANDOMIZE VAL(RIGHT$(TIME$,2))` |
| **Kendala** | Tidak ada sumber entropi. Yang tersedia cuma jam. |
| **Penafsiran** | Dua digit terakhir detik = **hanya 60 kemungkinan benih**. Dua sesi yang dimulai pada detik yang sama mendapat urutan kartu identik. Penulisnya kemungkinan besar tidak menyadari ini. |
| **Sekarang** | `crypto.getRandomValues` untuk benih, mulberry32 untuk urutannya. |

Dua program di koleksi ini sudah melakukannya lebih baik, dan keduanya ditiru:

- **`METEOR.BAS` (1981)** mengaduk benihnya selama menunggu pemain menekan
  tombol, sehingga waktu reaksi manusia jadi sumber entropi. Tersedia sebagai
  `RETRO.stirFromUser()`.
- **`READING.BAS`** menggabungkan jam + menit + detik.

Satu yang **tidak** ditiru: `WILDCAT.BAS` memanggil `RANDOMIZE` dua kali, yang
kedua dari keluaran yang pertama. Itu tidak menambah entropi sama sekali —
dicatat di dokumen `WILDCAT` sebagai kesalahan yang layak dipahami.

Yang **baru** dan tidak mungkin dulu: pengacak **bisa diulang persis**. Beri
benih yang sama, dapat urutan yang sama — sehingga bug bisa direproduksi dan
pemain bisa berbagi "papan nomor 12345".

### 2.7 Memuat program lain

| | |
|---|---|
| **Bentuk asli** | `RUN "BUSTWO"`, `CHAIN "MORTGAGE",1000`, `CHAIN MERGE "words",75,ALL` |
| **Kendala** | Memori 64 KB. Tutorial `BUSONE`…`BUSTEN` dipecah sepuluh berkas karena materinya tidak muat sekaligus. |
| **Penafsiran** | Ini *overlay* — nenek moyang *code splitting* dan *lazy loading*. Konsekuensinya juga sama: keadaan hilang saat berpindah, jadi harus dititipkan lewat `COMMON`. |
| **Sekarang** | Kendalanya sudah tidak ada, jadi sepuluh berkas `BUS*` jadi **satu aplikasi** dengan sepuluh bagian. |

Ini keputusan yang **membuang** struktur aslinya, jadi harus dibenarkan:
strukturnya bukan pilihan rancangan, ia gejala dari keterbatasan. Yang
dipertahankan adalah *urutan materinya*, dan dokumen `BUSONE` menjelaskan
kenapa pemecahan itu dulu perlu.

Berbeda dengan itu, `MORTGAGE.BAS` memakai **nomor baris sebagai antarmuka
publik** (masuk lewat 980 = mode normal, lewat 1000 = mode contoh). Itu
keputusan rancangan sungguhan, dan padanannya sekarang adalah parameter fungsi
— jadi ia diterjemahkan, bukan dibuang.

### 2.8 Tabel dispatch

| | |
|---|---|
| **Bentuk asli** | `ON CHANCE GOTO 760,770,780,…` (146 tabel di seluruh koleksi) |
| **Kendala** | BASIC tidak punya `switch`, tidak punya array asosiatif, dan tidak punya fungsi sebagai nilai. |
| **Penafsiran** | Ini **tabel penunjuk yang diindeks nilai** — mekanisme yang sama dengan `switch`, `Map<kunci,fungsi>`, dan bahkan pemanggilan metode di bahasa berobjek. |
| **Sekarang** | Array fungsi atau objek pemetaan. |

**Struktur ini sengaja dipertahankan bentuknya**, tidak diratakan jadi rantai
`if`. Justru itu yang mau ditunjukkan: ketika Anda paham bahwa
`ON CARD+1 GOSUB 100,200,…` di `BLACK.BAS` adalah polimorfisme, `card.draw()`
di bahasa berobjek jadi jauh lebih jelas.

---

## 3 · Yang sengaja TIDAK diubah

| Hal | Kenapa dipertahankan |
|---|---|
| **Aturan main** | Persis seperti aslinya. Kalau `21.BAS` membolehkan split tapi tidak surrender, versi webnya juga begitu. |
| **Teks antarmuka** | Tetap Bahasa Inggris asli: `"Do You Wish To Go First? <Y/N>"`. Setia pada sumber, memudahkan perbandingan sebelum/sesudah, dan istilah permainan kartu memang lebih dikenal begitu. Dokumen menjelaskan artinya. |
| **Bentuk tabel dispatch** | Lihat 2.8. |
| **Empat program blackjack** | `21`, `BJ`, `BLACK`, `BLACKJCK` semuanya diport. Membandingkan empat rancangan untuk permainan yang sama adalah bahan belajar tersendiri. |
| **Monofoni** | Satu nada pada satu waktu, seperti speaker PC. |
| **Tingkat kesulitan** | Tidak diperlunak. `ABM2A.BAS` punya tingkat "MISSION-IMPOSSIBLE" dan itu tetap mustahil. |

---

## 4 · Yang diperbaiki, dengan bukti

Hanya untuk hal yang **jelas-jelas bug**, bukan selera. Setiap perbaikan dicatat
di dokumen program yang bersangkutan.

| Program | Bug | Bukti |
|---|---|---|
| `WHATMONF.BAS` | Pemetaan mode video terbalik: mode 7 (monokrom) dipetakan ke `&HB800`, mode 2/3 (CGA) ke `&HB000`. Seharusnya sebaliknya. | `MAZE.BAS` di koleksi yang sama memetakan monokrom ke `&HB000` — dan dokumentasi BIOS membenarkan MAZE. |
| `WILDCAT.BAS` | `RANDOMIZE` dua kali, yang kedua dari keluaran yang pertama. Tidak menambah entropi. | Benih kedua sepenuhnya ditentukan benih pertama; jumlah urutan yang mungkin tetap 60. |
| `BOWLING.BAS` | Salah ketik `WHILE+ A$=""`. | GW-BASIC memaafkannya karena `+` di depan ekspresi dianggap tanda positif. Di JS ini akan jadi galat. |

Yang **tidak** diperbaiki meski menggoda: AI Othello yang belum selesai.
Penulisnya sendiri menulis `NOT DONE YET BUT HAVE FUN -- PLEASE ADD A GOOD
ALGORITHM TO IT` di baris 1025. Itu bagian dari sejarahnya; dokumennya
menjelaskan cara memperbaikinya sebagai latihan pembaca.

---

## 5 · Arah visual

**Modern dengan jejak retro.** Tata letak, tipografi, kontras, dan
aksesibilitas mengikuti standar sekarang; palet dan beberapa detail kecil
mengingatkan asalnya.

| Elemen | Jejak retro | Modern |
|---|---|---|
| Warna aksen | hijau fosfor `#4ef08a`, amber `#f0b429` — warna monitor monokrom | kontras diuji memenuhi WCAG AA |
| Angka & kode | monospace, seperti layar 80×25 | `font-variant-numeric: tabular-nums` |
| Area permainan | lebih gelap dari sekelilingnya, seperti tabung CRT di dalam casing | radius, bayangan lembut |
| Garis pindai | ada, tapi `opacity: .05` — tekstur, bukan gangguan | otomatis mati kalau pengguna minta gerak dikurangi |
| Font | — | *system stack*; tidak ada font eksternal, karena harus jalan offline |

Yang **tidak** ditiru, dan alasannya:

- **Layar hijau penuh.** Melelahkan dibaca lebih dari beberapa menit dan
  menyulitkan kontras teks. Warna fosfor dipakai sebagai aksen, bukan sebagai
  latar.
- **Font bitmap 8×8.** Tidak terbaca di layar kepadatan tinggi, dan tidak punya
  huruf beraksen.
- **Kisi kaku 80×25.** Ini kendala perangkat keras, bukan bahasa desain. Tata
  letak sekarang mengalir dan responsif.
- **Berkedip.** `COLOR 16..31` di CGA berarti berkedip, dan `KENO.BAS`
  memakainya untuk menandai angka yang cocok. Diganti sorotan warna: berkedip
  memicu masalah bagi sebagian pembaca.

---

## 6 · Kendala baru yang tidak dimiliki versi 1982

Beberapa hal justru **lebih sulit** sekarang. Ini juga bagian pelajarannya.

| Kendala baru | Akibat |
|---|---|
| `file://` melarang ES module | Semua JS memakai `<script>` klasik, tanpa `import`. |
| `file://` melarang `fetch()` | Data disimpan sebagai `.js` yang menetapkan variabel global — lihat `_shared/catalog.js`. |
| Audio butuh gestur pengguna | Setiap aplikasi bersuara punya overlay "klik untuk mulai". |
| Banyak ukuran layar | Tata letak harus responsif; versi asli selalu 80×25 atau 40×25. |
| Aksesibilitas | Harus bisa dioperasikan papan ketik, punya label ARIA, dan menghormati `prefers-reduced-motion`. Tidak ada padanannya di 1982. |
| Tab bisa disembunyikan | `requestAnimationFrame` berhenti; loop harus tahan terhadap lompatan waktu besar (lihat "spiral of death" di `loop.js`). |

---

## 7 · Isi fondasi

| Berkas | Isi | Menggantikan idiom |
|---|---|---|
| `tokens.css` | warna, tipografi, jarak, radius, garis kontrol (`--edge`); mode gelap & terang | `COLOR 15,0` yang tersebar |
| `base.css` | panel, tombol, keycap, HUD, dialog, toast, layar | rutin bingkai yang disalin ke tiap program |
| `rng.js` | PRNG berbenih, kocok Fisher-Yates | `RANDOMIZE VAL(RIGHT$(TIME$,2))` |
| `store.js` | localStorage ber-awalan + papan skor | `OPEN "O",1,"BS.SCO"` |
| `input.js` | `nextKey()`, `flush()`, `isDown()`, `on()` | `INKEY$`, `POKE 106,0`, `ON KEY(n) GOSUB` |
| `audio.js` | penafsir makro `PLAY`, `SOUND`, `BEEP`, 8 instrumen, penjadwal beruntun, `stop()`, nada ditahan | `PLAY`, `SOUND`, `BEEP` |
| `loop.js` | fixed timestep, `wait()`, `tween()`, jam yang bisa dijeda | `FOR I=1 TO 2000: NEXT` |
| `ui.js` | topbar, dialog, toast, bilah instrumen, tema | `LOCATE 24,12: PRINT "Strike Any Key…"` |
| `svg.js` | kartu, dadu, simbol suit, dek | `DIM FIG$(5,5)`, `ON CARD+1 GOSUB` |
| `piano.js` | papan tuts yang bisa menyala dan ditekan | *tidak ada padanannya* |
| `staff.js` | not balok bergulir, garis penanda bisa dipindah | *tidak ada padanannya* |
| `midi.js` | pembaca Standard MIDI File, tanpa pustaka | *tidak ada padanannya* |
| `catalog.js` | data 83 program, dibangkitkan otomatis | `MENU.BAS` + `MENU2.BAS` |

Dua baris terakhir yang bertanda *tidak ada padanannya* penting untuk dibaca
apa adanya: keempat program musik di koleksi ini **buta**. `PLAY` dan `SOUND`
hanya berbunyi, tanpa menampilkan apa pun. Papan tuts dan not balok adalah
tambahan murni, dan alasannya pedagogis — bahasa makro `PLAY` jauh lebih mudah
dipahami kalau `>c d4 ml e c<` bisa **dilihat** bergerak sambil berbunyi.

Ujian sesungguhnya untuk fondasi ini datang dari
[FREEPLAY](freeplay.md), satu-satunya program di sini yang **bukan port**.
Ia dibangun hampir seluruhnya dari potongan yang sudah ada, dan menambahkan
`audio.noteOn()`, `staff.setDur()`, `staff.range`, `staff.setPlayhead()`,
`piano.onDown/onUp`, `RETRO.clock()`, `audio.playNotes()`, dan seluruh
`midi.js`. Yang menentukan bukan jumlahnya — melainkan bahwa **tidak satu pun
mengubah perilaku yang sudah ada.** Kedelapannya menambah; tidak ada yang
mengganti. Sebuah fondasi tidak dinilai dari seberapa baik ia
melayani program yang sudah ada, melainkan dari seberapa murah program yang
belum terpikirkan bisa berdiri di atasnya.

Satu perbedaan penting dari aslinya: **program Friendlyware menyalin kerangka
yang sama ke sepuluh berkas.** Perbaiki bug di rutin tunggu-tombol, dan ia harus
diperbaiki sepuluh kali — pasti ada yang terlewat. Di sini kerangka itu hidup di
satu tempat.

---

## 7b · Satu token yang lahir dari kesalahan yang berulang

Dua kali di proyek ini sebuah batas dibuat dengan `var(--line)` — sekali untuk
tombol sekunder, sekali untuk pasak petunjuk di MASTER — dan dua kali hasilnya
**tidak terlihat**. Keduanya baru ketahuan setelah dilaporkan, bukan saat
ditulis.

Sebabnya sama, dan bisa diukur:

| | di atas `--bg-sunken` |
|---|--:|
| `--line`, tema gelap | 1,40 : 1 |
| `--line`, tema terang | **1,10 : 1** |

Ambang WCAG untuk komponen antarmuka non-teks adalah **3,0 : 1**. `--line`
memang tidak dirancang untuk itu — tugasnya memisahkan dua permukaan yang
warnanya berdekatan, dan justru **tidak menonjol**. Memakainya sebagai batas
kontrol adalah salah pakai, bukan salah nilai.

Perbaikan yang benar bukan menambal tiap tempat, melainkan menambah nama:

```css
--edge:        color-mix(in srgb, var(--ink) 48%, transparent);   /* >= 3:1  */
--edge-strong: color-mix(in srgb, var(--ink) 62%, transparent);   /* hover   */
--edge-soft:   color-mix(in srgb, var(--ink) 32%, transparent);   /* kosong  */
```

Diturunkan dari warna **teks**, bukan dari warna garis pemisah — sehingga
kontrasnya ikut berpindah bersama tema tanpa satu pun aturan tambahan.
`var(--ink)` di dalamnya diselesaikan di tempat token itu **dipakai**, jadi
satu definisi otomatis benar di kedua tema.

Hasilnya di keempat latar tempat kontrol bisa berada:

| | gelap/biasa | gelap/aktif | terang/biasa | terang/aktif |
|---|--:|--:|--:|--:|
| `--edge-strong` | 6,68 | 4,86 | 4,81 | 4,77 |

> **Pelajaran.** Kalau kesalahan yang sama muncul dua kali di tempat berbeda,
> yang salah biasanya bukan orangnya melainkan **kosakatanya**. Selama satu-
> satunya nama yang tersedia adalah `--line`, semua orang akan memakainya untuk
> segala jenis garis.
>
> Aturannya sekarang bisa diucapkan dalam satu kalimat: **batas yang harus
> terlihat → `--edge`; garis yang memisahkan dua permukaan → `--line`.**

Satu hal yang **tidak** ikut diubah: isi pasak hitam dan putih di MASTER tetap
hitam dan putih harfiah di kedua tema. "Pasak hitam" dan "pasak putih" adalah
nama bidaknya, bukan pilihan warna — menukarnya mengikuti tema akan merusak
kosakata permainannya. Yang membuat bentuknya selalu terlihat adalah garis
tepinya, bukan isinya.

---

## 8 · Aturan kode yang saya pegang

1. **Logika terpisah dari tampilan.** Keadaan permainan adalah objek/array
   biasa; penggambaran adalah fungsi dari keadaan itu. Ini persis pelajaran yang
   gagal dipegang `BOWLING.BAS`, yang membaca `SCREEN(r,c)` untuk mengetahui
   posisi pin — menjadikan tampilan sebagai sumber kebenaran.
2. **Tanpa variabel global**, kecuali satu namespace `RETRO`.
3. **Nama bermakna.** `C(24)` di `TICTAC.BAS` jadi `WINNING_LINES`.
4. **Komentar menjelaskan _kenapa_, bukan _apa_.** Contoh terbaiknya ada di
   koleksi asli, di `LIFE2.BAS` baris 52: `'Mention early for efficiency` —
   menjelaskan sesuatu yang tidak terbaca dari kodenya.
5. **Tanpa dependensi, tanpa build step.** Kode ditulis agar terbaca apa adanya,
   karena ini bahan belajar.

---

Berkas terkait: [rencana lengkap](../PLAN.md) ·
[demo SVG](../svg-demo.html) · [peluncur](../index.html) ·
[analisis 83 program BASIC asli](../../reviews/README.md)
