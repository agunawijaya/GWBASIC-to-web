# Catatan teknik menggambar SVG

Rujukan cara menggambar untuk seluruh proyek. Ditulis supaya bisa diulang, bukan
sekadar dikagumi — tiap teknik disertai angka dan alasan kenapa angka itu.

Contoh hidupnya ada di [`../svg-demo.html`](../svg-demo.html). Komponen yang
sudah jadi kode ada di [`../_shared/svg.js`](../_shared/svg.js).

---

## Prinsip umum

**1. Gambar dalam kotak yang bulat, lalu skala di tempat pemakaian.**
Semua simbol saya gambar dalam kotak `0..100`. Menempatkannya cukup dengan
`transform="translate(x,y) scale(s)"`. Kalau menggambar langsung di koordinat
akhir, satu perubahan ukuran berarti menghitung ulang semua titik.

**2. Satu definisi, banyak pemakaian.**
Bentuk yang berulang masuk `<defs>` sebagai `<path id="…">`, lalu dipanggil
dengan `<use href="#…">`. Satu simbol sekop dipakai 13 kali di satu kartu dan
52 kali di satu dek.

**3. Bentuk dulu, baru bahan.**
Tulis geometri sebagai `path` polos dan pastikan siluetnya benar. Gradien dan
filter ditambahkan belakangan. Kalau siluetnya salah, gradien secantik apa pun
tidak menolong.

**4. Jangan menulis warna literal di komponen.**
Pakai `currentColor` atau variabel CSS, supaya tema gelap/terang ikut bekerja.

**5. `viewBox` menentukan segalanya, `width` hanya saran.**
Selalu set `viewBox`; biarkan `width`/`height` mengikuti tata letak.

---

## A · Kartu remi

Lihat `RETRO.svg.card()` di `_shared/svg.js`.

### Kotak kerja

Kartu digambar dalam `viewBox="0 0 100 140"` — rasio 1:1,4, mendekati kartu
poker sungguhan (63×88 mm = 1:1,397).

### Empat simbol suit sebagai path

Semuanya dalam kotak `0..100`, jadi bisa dipakai di ukuran mana pun.

```
sekop   M50 4C50 4 8 42 8 68c0 15 11 25 24 25 6 0 12-3 15-8
        1 12-4 22-13 28h32c-9-6-14-16-13-28 3 5 9 8 15 8
        13 0 24-10 24-25C92 42 50 4 50 4Z
hati    M50 97C50 97 6 63 6 34 6 17 18 6 32 6c9 0 15 5 18 12
        3-7 9-12 18-12 14 0 26 11 26 28 0 29-44 63-44 63Z
wajik   M50 4C64 30 78 44 96 51 78 58 64 72 50 98 36 72 22 58 4 51Z
```

Yang membuatnya terbaca sebagai simbol yang benar:

- **Sekop** — satu kurva turun dari puncak melebar ke bawah, dua lekuk bahu, lalu
  tangkai berbentuk trapesium terbalik. Tangkainya **wajib**; tanpa itu bentuknya
  jadi hati terbalik.
- **Hati** — dua kurva cembung yang bertemu di lekuk atas (titik `50,18`) dan
  meruncing ke `50,97`. Kunci: titik kendali bahu harus **di luar** lebar bentuk
  akhir, kalau tidak lekukannya jadi dangkal.
- **Wajik** — bukan belah ketupat lurus. Sisi-sisinya sedikit cekung
  (`C64 30 78 44 96 51` bukan `L96 51`), dan itulah yang membedakannya dari
  bentuk geometris biasa.
- **Keriting** — tiga lingkaran yang saling menimpa, disatukan jadi satu path,
  plus tangkai yang sama dengan sekop.

### Tata letak pip: tabel, bukan tiga belas rutin

Ini pelajaran yang diambil langsung dari `BLACK.BAS`, yang memakai
`ON CARD+1 GOSUB` dengan 14 cabang — satu rutin penggambar per nilai kartu.
Idenya benar (tabel), tapi di sini tabelnya bisa jadi data:

```js
const LAYOUT = {
  '2': [[50,22],[50,88]],
  '3': [[50,22],[50,55],[50,88]],
  '4': [[28,22],[72,22],[28,88],[72,88]],
  ...
};
```

Aturannya: kolom di `x = 28` dan `72`, kolom tengah di `50`; baris di
`y = 22` (atas), `55` (tengah), `88` (bawah). Pip di separuh bawah **diputar
180°** — itu yang membuat kartu sungguhan terlihat benar dari kedua arah.

### Lapisan sebuah kartu, dari bawah ke atas

| Lapis | Isi |
|---|---|
| 1 | `rect` putih, `rx="8"`, garis tepi abu |
| 2 | `pattern` guilloche — dua kurva sinus bersilang, `opacity .28` |
| 3 | sudut kiri-atas: angka + simbol kecil (`scale .11`) |
| 4 | sudut kanan-bawah: sama, dibungkus `rotate(180 50 70)` |
| 5 | badan kartu: pip menurut tabel, atau bingkai + huruf untuk J/Q/K |

Untuk punggung kartu: gradien biru gelap + guilloche yang sama dengan warna
lebih terang. Satu `pattern` melayani muka dan punggung.

---

## B · Dadu isometrik

Ini bagian yang paling mudah salah, dan versi pertama saya memang salah.

### Kesalahan yang harus dihindari

**Jangan menggambar tiga belah ketupat lalu menaruh elips di atasnya.** Pip yang
digambar sebagai elips lurus tidak mengikuti bidang mukanya, dan mata langsung
menolaknya sebagai kubus. Itu persis yang salah di percobaan pertama.

### Cara yang benar: proyeksi sungguhan

```
X = (x − z) · cos30°   = (x − z) · 0,866
Y = (x + z) · sin30° − y = (x + z) · 0,5 − y
```

Untuk kubus bersisi 100, hasilnya membentang `X = −86,6 … 86,6` dan
`Y = −100 … 100`. Delapan sudutnya jadi:

```
atas   : M0 -100  L86.6 -50  L0 0    L-86.6 -50 Z
kiri   : M-86.6 -50  L0 0    L0 100  L-86.6 50 Z
kanan  : M0 0    L86.6 -50  L86.6 50 L0 100 Z
```

### Kunci: tempelkan muka datar lewat `matrix()`

Gambar tiap muka sebagai **kotak datar biasa** `0..100` dengan pip di kisi 3×3
yang normal, lalu tempelkan ke bidangnya:

```
muka atas  : matrix( 0.866,  0.5, -0.866, 0.5,    0, -100)
muka kiri  : matrix( 0.866,  0.5,  0,     1,  -86.6,  -50)
muka kanan : matrix( 0.866, -0.5,  0,     1,     0,     0)
```

Karena pip ikut ditransformasi, `<circle>` berubah jadi elips dengan sudut yang
benar **dengan sendirinya**. Tidak ada satu pun elips yang saya hitung manual.

Cara membaca `matrix(a,b,c,d,e,f)`: `X = a·u + c·v + e`, `Y = b·u + d·v + f`,
dengan `(u,v)` koordinat lokal muka.

### Detail yang membuatnya "berat"

| Detail | Nilai |
|---|---|
| Pip di kisi 3×3 | `22`, `50`, `78`; jari-jari `9` |
| Muka atas paling terang | gradien `#ffffff → #dde5ee` |
| Muka kanan paling gelap | `#93a1b2 → #7a8899` |
| Sorotan tiga rusuk atas | putih `opacity .55`, tebal `2` |
| Bayangan lantai | elips `rx 88 ry 17`, `opacity .18` |

### Aturan angka dadu

Muka yang berhadapan **selalu berjumlah 7** (1–6, 2–5, 3–4). Jadi kombinasi
sudut yang sah hanya yang tidak berpasangan: `5-3-6` sah, `5-2-x` tidak.

---

## C · Pesawat luar angkasa (X-Wing)

Pelajaran utamanya: **kesan "canggih" datang dari kerapatan detail, bukan dari
bentuk dasarnya.** Siluet X-Wing bisa digambar dengan enam poligon dan sudah
dikenali — tapi terlihat seperti mainan. Yang membuatnya terasa mesin adalah
lapisan ornamen di atasnya.

### Urutan menggambar

```
1. Siluet    sayap, badan, nasel     ~10 path
2. Volume    gradien per permukaan   4 gradien
3. Struktur  garis panel             ~12 path tipis
4. Fungsi    intake, engsel, nosel   ~20 rect/path
5. Identitas pita merah, sensor      ~10 path
6. Cahaya    semburan mesin + filter 4 ellipse
```

Versi pertama saya berhenti di langkah 2 — itu sebabnya terlihat terlalu
sederhana.

### Greeble: ornamen yang tidak berarti apa-apa

Kotak-kotak kecil acak di badan pesawat. Tidak melambangkan apa pun, tapi
memberi skala dan kesan mesin. Aturannya:

- ukuran `3–9` unit dalam kotak `240×208` — cukup kecil untuk tidak jadi fokus
- `opacity .85` supaya menyatu, bukan menempel
- ditempatkan **tidak simetris**; simetri sempurna terlihat seperti pola, bukan
  mesin

### Garis panel

Garis tipis (`stroke-width .8`, `opacity .65–.7`) yang membagi permukaan besar.
Aturan yang saya pakai: **ikuti arah aliran bentuknya**. Di sayap yang menyudut,
garis panel juga menyudut sejajar tepi. Garis lurus di permukaan miring langsung
merusak ilusi kedalaman.

### Detail yang bisa dikenali

Ini yang membuat pesawat terasa "punya cerita":

| Bagian | Kenapa penting |
|---|---|
| Engsel s-foil di pangkal sayap | menjelaskan **kenapa** sayapnya bisa membentuk X |
| Cincin intake di nasel | membedakan mesin dari tabung polos |
| Soket droid astromekanik | detail fungsional yang menyiratkan awak |
| Meriam berlaras banyak | dua cincin di laras memberi kesan mekanisme |
| Larik sensor di hidung | memberi arah — mana depan pesawat |

### Cahaya mesin

```xml
<filter id="engGlow" x="-80%" y="-80%" width="260%" height="260%">
  <feGaussianBlur stdDeviation="3.4" result="b"/>
  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
```

Polanya: **blur lalu tumpuk aslinya di atas**. Blur saja menghasilkan noda;
tumpukan inilah yang memberi inti terang dengan halo. `x`/`y`/`width`/`height`
harus diperluas jauh melebihi 100%, kalau tidak halonya terpotong.

Gradien radialnya berhenti di `stop-opacity="0"`, bukan warna gelap — supaya
menyatu ke latar apa pun.

---

## D · Api roket & efek dinamis

Lihat bagian Lander di demo.

### Dua lapis api

| Lapis | Bentuk | Warna |
|---|---|---|
| Luar | panjang, melebar | gradien radial putih → kuning → jingga → transparan |
| Inti | pendek, sempit | `#fff6d0` pekat, `opacity .9` |

Satu lapis saja terlihat seperti tetesan. Dua lapis dengan panjang berbeda
langsung terbaca sebagai nyala.

### Tekstur api dengan turbulensi

```xml
<filter id="rough">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4"/>
</filter>
```

`feTurbulence` membangkitkan derau, `feDisplacementMap` memakainya untuk
menggeser piksel. `scale` kecil (2–3) memberi tepi tidak rata; kalau terlalu
besar bentuknya hancur.

### Urutan lapisan: SVG tidak punya `z-index`

Di SVG, **elemen yang ditulis belakangan menimpa yang di depannya.** Tidak ada
`z-index`; urutan dokumen *adalah* urutan lapisan.

Ini menyebabkan satu kesalahan yang mudah terlewat: api roket saya taruh di
akhir grup, jadi ia tergambar **di depan** sungkup mesin — seolah menyembur
dari depan cerobong, bukan dari dalamnya.

Perbaikannya: pindahkan api ke **sebelum** sungkup mesin.

```xml
<g id="craft">
  <g id="flameGroup"> … </g>      <!-- api: digambar lebih dulu -->
  <path id="descent" … />         <!-- badan menimpa pangkal api -->
  <path d="M119 186 L141 186 …"/> <!-- sungkup menimpa pangkal api -->
</g>
```

Aturan umum yang bisa dibawa: **apa pun yang keluar dari sebuah lubang harus
digambar sebelum benda yang berlubang itu.** Berlaku untuk api roket, asap
cerobong, air dari keran, peluru dari laras.

Ada satu perbaikan pendamping: **pangkal api dinaikkan masuk ke dalam sungkup**
(`y=200`, sementara mulut sungkup di `y=212`). Dengan begitu, saat api mengecil
ia menyusut ke dalam mulut cerobong dan tidak pernah terlihat menggantung
terpisah di udara.

Dan pangkal path itu **wajib sama** dengan titik jangkar `scale` di JS. Kalau
berbeda, api tidak memanjang dari mulut cerobong melainkan bergeser sambil
membesar — kesalahan yang sempat ada di versi sebelumnya karena jangkarnya masih
memakai koordinat gambar yang lama.

```js
const AX = 130, AY = 200;   // harus sama dengan "M130 200" di path
outer.setAttribute('transform',
  `translate(${AX},${AY}) scale(${sx},${sy}) translate(${-AX},${-AY})`);
```

### Hover: jangan pernah mengubah geometri

Jebakan yang menghasilkan bug nyata di `15PUZZLE` dan pasti berulang.

Versi pertama ubinnya begini:

```css
.tile rect { stroke-width: 1.5; }
.tile:hover rect { stroke-width: 3; }   /* ← salah */
```

Hasilnya: **ubin bergetar saat kursor di atasnya.** Rantai sebabnya:

1. `stroke-width` naik → kotak pembatas elemen ikut membesar.
2. Ubin itu juga memakai `<filter>`, dan wilayah filter dihitung dari kotak
   pembatas → wilayahnya ikut dihitung ulang.
3. Gambarnya bergeser sepersekian piksel.
4. Kalau kursor kebetulan di tepi, ia jadi keluar-masuk area hover.
5. Kembali ke langkah 1. Osilasi.

**Aturannya: saat hover, ubah hanya properti yang tidak memengaruhi tata letak
maupun kotak pembatas** — warna, dan `opacity` lapisan yang sudah ada sejak awal.

```css
.tile .face { stroke-width: 2; transition: stroke 110ms; }  /* tetap */
.tile .hl   { opacity: 0; transition: opacity 110ms; }      /* lapisan tetap */
.tile:hover .face { stroke: var(--tile-ink); }              /* warna saja */
.tile:hover .hl   { opacity: .14; }                         /* opacity saja */
```

Yang **aman** diubah saat hover: `fill`, `stroke`, `opacity`, `filter: brightness()`.
Yang **berbahaya**: `stroke-width`, `r`, `width`, `height`, `x`, `y`, `font-size`,
`transform` (kalau elemen itu juga dipakai untuk posisi).

Kalau butuh efek "membesar", buat lapisan kedua yang sudah berukuran besar sejak
awal dengan `opacity: 0`, lalu nyalakan opacity-nya.

### Filter: satu untuk banyak, bukan banyak yang kecil

Masalah kedua di kasus yang sama: **lima belas ubin, masing-masing dengan
`<filter>` sendiri.** Tiap filter punya wilayah yang dihitung ulang setiap kali
sumbernya berubah, dan lima belas di antaranya berjalan bersamaan.

Perbaikannya: pasang bayangan **sekali** di sumur papan, dan berikan kedalaman
pada ubin lewat gradien + pita sorot yang tidak berbiaya sama sekali.

```xml
<rect class="well" … filter="url(#wellShadow)"/>   <!-- satu filter -->
<g id="tiles"> … 15 ubin tanpa filter … </g>
```

Aturan praktis: **filter mahal, gradien murah.** Kalau efeknya bisa dicapai
dengan gradien, `opacity`, atau elemen tambahan, pilih itu.

### `clip-path` dan `transform` tidak boleh di elemen yang sama

Dipakai di 15PUZZLE untuk memotong gambar jadi lima belas ubin.

```xml
<!-- SALAH: bidang potong ikut bergeser bersama gambarnya -->
<g clip-path="url(#tileClip)" transform="translate(-96,-12)"> … </g>

<!-- BENAR: dua grup bersarang -->
<g clip-path="url(#tileClip)">          <!-- luar: memotong, tanpa transform -->
  <g transform="translate(-96,-12)">    <!-- dalam: menggeser -->
    <use href="#pic-art"/>
  </g>
</g>
```

Keduanya diselesaikan di ruang koordinat yang sama, jadi kalau dipasang
bersamaan, `clip-path` ikut terbawa `transform` dan potongannya meleset.

Pola "satu gambar, banyak potongan" ini berguna jauh di luar puzzle geser:
lembar sprite, atlas ikon, potongan peta.

### Menganimasikan dari keadaan, bukan dari timeline

Ini pola yang dipakai di seluruh proyek:

```js
let thrust = 0;                                     // satu variabel keadaan
setInterval(() => thrust += (wanted - thrust) * 0.22, 16);   // dikejar perlahan

function draw() {                                    // gambar = fungsi keadaan
  const flicker = 1 + Math.sin(t*37)*0.06 + Math.sin(t*23.7)*0.04;
  const len = thrust * flicker;
  group.style.opacity = thrust;
  outer.setAttribute('transform',
    `translate(110,150) scale(${0.7+len*0.45},${len}) translate(-110,-150)`);
  requestAnimationFrame(draw);
}
```

Tiga hal yang membuatnya terasa hidup:

1. **Titik jangkar.** `translate(110,150) … translate(-110,-150)` membuat api
   memanjang **dari mulut nosel**, bukan dari tengahnya.
2. **Nilai dikejar, tidak dilompatkan.** `thrust += (wanted - thrust) * 0.22`
   memberi waktu naik. Tanpa ini api muncul-hilang seperti saklar lampu.
3. **Kedip dari dua sinus berfrekuensi tidak berkelipatan** (`37` dan `23.7`).
   Satu sinus saja terlihat berdenyut teratur; dua yang tidak sinkron terlihat
   acak tanpa perlu `Math.random()` — dan tetap bisa diulang persis.

### Anatomi modul pendarat: detail yang membuatnya "bercerita"

Versi pertama pendarat saya cuma segi delapan + kotak kabin, dan terasa generik.
Yang memperbaikinya bukan bentuk yang lebih rumit, melainkan **bagian-bagian yang
bisa dikenali orang**. Tiap bagian menjawab satu pertanyaan "kenapa bentuknya
begitu":

| Bagian | Kenapa ada, dan apa yang disampaikannya |
|---|---|
| Tingkat turun segi delapan berbalut foil emas | selimut termal berjahit; polanya dibuat dengan satu `<pattern>`, bukan puluhan garis |
| Empat kaki: dua depan menonjol, dua belakang lebih gelap | memberi kedalaman. Kaki belakang digambar **lebih dulu** supaya tertutup badan |
| Telapak kaki + probe kontak menjuntai | probe itu yang menyentuh tanah lebih dulu; detail kecil yang menyiratkan pendaratan sungguhan |
| Tangga di kaki depan-kiri | menyiratkan ada manusia di dalamnya |
| Dua jendela segitiga miring ke bawah-luar | bentuk paling khas Apollo LM; miring karena awak berdiri dan melihat ke bawah |
| Palka depan + beranda EVA | melanjutkan cerita tangga |
| Sungkup mesin yang melebar di ujung | membedakan mesin roket dari tabung biasa |
| Dua antena piring berbeda ukuran | pengarah pita-S (besar) dan radar rendezvous (kecil); ukuran berbeda = fungsi berbeda |
| Terowongan dok di puncak | menjelaskan wahana ini menempel ke sesuatu yang lebih besar |
| Kluster RCS di bahu | memberi tempat asal semburan sikap — lihat di bawah kenapa posisinya penting |

Urutan menggambarnya sama dengan X-Wing: siluet → volume → garis panel →
bagian fungsional → identitas → cahaya. Yang berubah cuma daftar bagiannya.

### Memutar seluruh wahana: satu grup, satu atribut

```xml
<g id="craft">
  ... seluruh badan, kaki, antena ...
  <path id="rcsLeft" .../>          <!-- semburan sikap -->
  <g id="flameGroup"> ... </g>      <!-- api roket utama -->
</g>
```

```js
craft.setAttribute('transform', `rotate(${angle} 130 150)`);
```

Kuncinya: **api ada DI DALAM grup badan, bukan di luar.** Karena itu, saat
wahana miring, semburannya ikut miring dengan sendirinya — tidak perlu satu
baris kode tambahan. Kalau api ditaruh di luar, Anda harus menghitung ulang
posisinya tiap frame, dan hampir pasti salah.

Titik putarnya kira-kira **titik berat**, bukan tengah gambar. Untuk pendarat
ini `(130, 150)` — tengah tingkat turun, bukan tengah `viewBox`. Memutar di
titik yang salah membuat wahana terlihat "terlempar", bukan berputar.

`viewBox` juga harus diberi kelonggaran: sudut maksimum 28° membuat ujung kaki
dan antena bergerak jauh, jadi kotaknya dilebihkan di keempat sisi.

### Pendorong sikap: arah yang benar

Hukum ketiga Newton. Gas keluar ke satu arah, wahana terdorong ke arah
sebaliknya:

| Ingin | Yang menyala | Semburan ke |
|---|---|---|
| berputar **kanan** | pendorong **kiri** | kiri |
| berputar **kiri** | pendorong **kanan** | kanan |

Terdengar terbalik, dan memang harus terbalik. Kalau dibuat "logis" (tekan
kanan → api di kanan), pemain yang memperhatikan akan langsung merasa salah.

**Kenapa kluster RCS ditaruh di bahu, bukan di dasar.** Dorongan yang bekerja
jauh dari titik berat menghasilkan **torsi** — wahana berputar. Kalau pendorong
diletakkan sejajar titik berat, hasilnya wahana **bergeser** ke samping, bukan
berputar. Jadi posisi nosel di gambar bukan sekadar hiasan: ia menjelaskan
kenapa menekan tombol menghasilkan rotasi.

### Kembali tegak: pilihan, bukan fisika

Di demo, melepas tombol RCS membuat wahana kembali tegak:

```js
if (turn !== 0) angle += turn * 0.9;          // RCS menyala
else if (autoUpright) angle += (0 - angle) * 0.07;   // kembali tegak
```

Gerakan `(target - sekarang) * k` membuatnya melambat saat mendekat — jauh lebih
enak dilihat daripada kembali dengan kecepatan tetap.

Tapi ini **bukan fisika**. Di ruang hampa tidak ada yang menghentikan putaran:
sekali berputar, terus berputar sampai pendorong lawan dinyalakan. Karena itu
demo menyediakan kotak centang untuk mematikannya, supaya kedua perilaku bisa
dibandingkan langsung.

`LANDER.BAS` memodelkan yang versi fisika: `ON TILTOLD GOTO` berisi **13 sudut
tetap**, dan sudut yang dipilih pemain bertahan sampai diubah. Untuk permainan
sungguhan nanti, itu yang dipakai — auto-tegak hanya untuk demo ini.

Ini relevan untuk `LANDER.BAS`, yang punya `ON TILTOLD GOTO` dengan **13 cabang
untuk 13 sudut kemiringan**. Modelnya: RCS memutar wahana, lalu roket utama
mendorong sepanjang sumbu badan. Jadi mendarat berarti mengatur sudut dulu, baru
mendorong.

Kedua pendorong dibuat **elemen terpisah dengan id sendiri**, supaya bisa
dinyalakan sendiri-sendiri dari keadaan permainan.

---

## E · Papan permainan dari data

Contoh Othello di demo. Papan digambar oleh JS dari array 8×8 — bukan 64 elemen
yang ditulis tangan.

```js
board.forEach((row, r) => row.forEach((v, c) => {
  if (!v) return;
  st.insertAdjacentHTML('beforeend',
    `<circle cx="${c*25+12.5}" cy="${r*25+12.5}" r="9.5"
             fill="url(#${v === 1 ? 'wStone' : 'bStone'})"/>`);
}));
```

Rumus posisinya `indeks × ukuranSel + setengahSel`. Bidak memakai gradien radial
dengan pusat digeser ke kiri-atas (`cx="35%" cy="30%"`) — itu yang memberi kesan
bidak cembung yang disinari dari kiri atas.

**Ini pemisahan yang sama yang gagal dipegang `BOWLING.BAS`**, yang membaca
`SCREEN(r,c)` untuk mengetahui posisi pin — menjadikan tampilan sebagai sumber
kebenaran. Aturannya: **data adalah kebenaran, gambar adalah turunannya.**

---

## F · Panel CRT

Untuk elemen yang sengaja mengingatkan asal-usulnya.

```xml
<pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse">
  <rect width="4" height="2" fill="#000" opacity=".28"/>
</pattern>
```

Garis pindai sebagai `pattern`, bukan puluhan `rect`. Ditumpuk di atas isi,
dibatasi `clipPath` supaya tidak keluar dari layar.

Fosfor: gradien radial gelap (`#123c2a → #04120c`) dengan teks hijau terang di
atasnya, plus filter glow lembut (`stdDeviation 1.6`).

**Penting:** di aplikasi sungguhan, garis pindai dipakai `opacity .05`, bukan
`.28` seperti di demo. Di demo ia jadi bahan pameran; di aplikasi ia harus jadi
tekstur yang nyaris tak terasa, dan otomatis mati kalau pengguna menyalakan
`prefers-reduced-motion`.

---

## G · Daftar periksa sebelum menyatakan sebuah gambar selesai

- [ ] `viewBox` diset, `width`/`height` tidak dipaksa
- [ ] Bentuk digambar dalam kotak bulat, ditempatkan lewat `transform`
- [ ] Bentuk berulang ada di `<defs>` + `<use>`
- [ ] Ada `role="img"` dan `aria-label` yang menjelaskan isinya
- [ ] Tidak ada warna literal di komponen yang dipakai ulang
- [ ] Elemen yang akan dianimasikan punya `id` sendiri
- [ ] Filter punya `x`/`y`/`width`/`height` yang diperluas
- [ ] Terbaca di tema gelap **dan** terang
- [ ] Tidak ada kurung yang tidak berpasangan di dalam label
- [ ] Kalau ada gerak: menghormati `prefers-reduced-motion`
- [ ] **Hover hanya mengubah warna/opacity — tidak pernah geometri**
- [ ] **Filter dipasang sesedikit mungkin, bukan satu per elemen berulang**
- [ ] Sudah dicoba dengan kursor **diam di tepi** elemen interaktif — di situ
      getaran akibat umpan balik hover paling mudah muncul

---

Berkas terkait: [demo hidup](../svg-demo.html) ·
[komponen siap pakai](../_shared/svg.js) · [keputusan fondasi](_fondasi.md) ·
[rencana](../PLAN.md)
