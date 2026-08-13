# PAC-GAL — dari EXE 1982 ke web

| | |
|---|---|
| Sumber | `run/PAC-GAL.EXE` |
| Basis port | `decompile/PAC-GAL/pac-gal-run.bas` — 295 baris, 0 panggilan runtime tak tertangani |
| Ukuran asli | 208 pernyataan · labirin 24 × 79 kolom · 468 pelet |
| Penulis | Al J. Jiménez, Mei 1982 (kredit di dalam EXE-nya sendiri) |
| Hasil port | [`../games/pacgal/`](../games/pacgal/index.html) |
| Analisis dekompilasi | [`../../decompile/PAC-GAL/ARCHITECTURE.md`](../../decompile/PAC-GAL/ARCHITECTURE.md) |
| **Rujukan geometri** | [`../games/pacgal/GEOMETRY.md`](../games/pacgal/GEOMETRY.md) — petak, kandang, gerbang, terowongan |
| **Rujukan perilaku hantu** | [`../games/pacgal/GHOSTS.md`](../games/pacgal/GHOSTS.md) — kedua mode, mesin keadaan, ambang |

Pengejaran labirin: makan 468 pelet tanpa tertangkap empat hantu.

> **Sebelum menelusuri masalah atau mengubah apa pun di port ini, baca dua
> rujukan di atas.** Keduanya DIHASILKAN dari `maze.js` dan `pacgal.js` oleh
> `decompile/tools/gen-pacgal-ref.py`, jadi angkanya tidak bisa menyimpang
> dari kodenya. Keduanya ada karena geometri labirin itu **statis** namun
> berkali-kali digali ulang dari kode — dan sekali salah baca, salahnya ikut
> ke perbaikan berikutnya. Gerbang kandang pernah dikira satu sel padahal
> dua, dan tiga gejala yang tampak tidak berhubungan lahir dari satu sel itu.

Ini **port pertama di koleksi ini yang berangkat dari sebuah `.EXE`**, bukan dari
kode BASIC. Tiga puluh sembilan port sebelumnya punya sumber aslinya untuk dibaca;
yang ini tidak. Setiap aturan di bawah dibaca dari mesinnya, dan itu menambah satu
kewajiban yang tidak dimiliki port lain — memisahkan apa yang **terbaca** dari apa
yang **saya isi sendiri** (§5).

---

## 1 · Labirinnya tidak ada di dalam berkasnya

Mencari potongan labirin di segmen data `PAC-GAL.EXE` tidak menemukan apa pun.
Bukan karena pencariannya kurang teliti — labirin itu memang tidak disimpan.

Yang ada delapan variabel string, diisi sekali saat startup:

| Dibangun dari | Ubin | Peran |
|---|---|---|
| `CHR$(219)` | █ | dinding |
| `CHR$(186) + " "` | ║ | dinding samping |
| `STRING$(2, 205)` | ══ | dinding datar |
| `CHR$(249) + " "` | ∙ | **pelet** |
| `STRING$(79, 220)` | ▄ | bingkai bawah selebar layar |

Lalu tiap baris labirin dicetak sebagai rentetan `PRINT` atas variabel-variabel itu.
Menyimpan labirin sebagai teks berarti menulis dua puluh empat baris penuh di dalam
sumbernya; membangunnya dari `CHR$` jauh lebih ringkas — dan di mesin dengan ruang
kerja 64 KB, itu selisih yang nyata.

**Akibatnya untuk port ini: tidak ada larik yang bisa disalin.** Jadi labirinnya
**diukur**. `run/PAC-GAL.EXE` dijalankan di emulator 8086 dan layar 80×25-nya
dipanen menjadi [`../games/pacgal/maze.js`](../games/pacgal/maze.js) oleh
`decompile/tools/genmaze.py`.

> **Pelajaran.** Kalau sebuah struktur tidak tersimpan di mana pun, ia mungkin
> bukan data melainkan **hasil**. Cara membacanya bukan dengan mencari lebih keras,
> melainkan dengan menjalankan yang menghasilkannya. Itu berlaku jauh di luar
> program 1982: konfigurasi yang dirakit saat boot, tata letak yang dihitung saat
> render, dan skema yang lahir dari migrasi semuanya punya sifat yang sama.

---

## 2 · Layarnya bukan keluaran — ia struktur datanya

Tidak ada peta tabrakan di memori. Program menanyakan langsung ke layar:

```basic
1800 I4% = I23%+I17% : I5% = I24%+I18%
     I3% = SCREEN(I4%, I5%+I5%+1)
     IF I3% <> 32 THEN ...       ' 32 = spasi, boleh dilewati
1860 IF I3% <> 249 THEN ...      ' 249 = pelet, boleh dilewati + dimakan
```

`SCREEN(baris, kolom)` mengembalikan karakter yang sedang tampil. Jadi menggambar
dan menyimpan adalah **satu tindakan yang sama**, dan labirin harus tergambar
sebelum permainan bisa jalan sama sekali.

`I5%+I5%+1` menjelaskan bentuknya: kolom logis dikalikan dua, jadi satu sel
permainan selebar **dua kolom layar**. Petak 40 kolom digambar di layar 80 kolom.

> **Pelajaran.** Memakai satu representasi untuk dua tujuan menghemat memori dan
> membayar dengan kebebasan. Program ini tidak bisa punya lapisan tak terlihat,
> tidak bisa menggambar ulang tanpa kehilangan keadaan, dan tidak bisa punya dua
> pandangan atas dunia yang sama. Setiap kali sebuah sistem membaca kembali
> keluarannya sendiri sebagai masukan, batasan itu yang sedang dibeli.

---

## 3 · Terowongan adalah sebuah karakter

```basic
2040 IF I4% = 12 THEN ...
2100 IF I3% = 196 THEN ...        ' 196 = ─
2160 I5% = 39 - I18%              ' pantulkan ke sisi seberang
```

Baris ke-12 diberi ubin `─` di kedua ujungnya, dan menyentuhnya memantulkan kolom
ke `39 − kolom`. Terowongan Pac-Man dikerjakan **tanpa satu pun cabang khusus di
gelung gerak** — cukup satu karakter yang berbeda dari tetangganya.

> **Pelajaran.** Aturan istimewa lebih murah disimpan di **data** daripada di
> kode. Satu ubin berbeda mengalahkan satu cabang `IF`, karena ubin bisa dipindah,
> digandakan, dan dihapus tanpa menyentuh logikanya.

---

## 4 · Kehilangan nyawa justru membuatnya lebih mudah

```basic
2880 F2! = CSNG(I11%)/5 + 20 : I1% = CINT(F2! / CSNG(I10%*I10%))
2910 J2%(I6%) = 26 : J6%(I6%) = I1%
```

`I11%` pelet tersisa, `I10%` nyawa. Angka itu **lama hantu tetap rentan** sesudah
pelet besar dimakan — dan pembaginya **kuadrat** nyawa:

| Pelet tersisa | Nyawa | Hitungan | Giliran rentan |
|---:|---:|---|---:|
| 468 | 3 | (93,6 + 20) ÷ 9 | **13** |
| 250 | 3 | (50 + 20) ÷ 9 | **8** |
| 50 | 3 | (10 + 20) ÷ 9 | **3** |
| 468 | 1 | (93,6 + 20) ÷ 1 | **114** |

Permainannya **mengetat** saat pelet menipis, dan **melonggar sembilan kali lipat**
saat pemain tinggal punya satu nyawa. Belas kasihan yang dipanggang ke dalam satu
baris aritmetika, dan tidak pernah diberitahukan ke pemain.

> **Pelajaran.** Kesulitan adaptif tidak butuh mesin kesulitan adaptif. Satu
> pembagi yang kebetulan berisi keadaan pemain sudah cukup — dan justru karena
> tidak diumumkan, ia terasa sebagai keberuntungan, bukan sebagai belas kasihan.

---

## 4b · Tiga cacat yang hanya terlihat saat dimainkan

Ketiganya lolos seluruh pemeriksaan statis, dan ketiganya dilaporkan pemilik proyek
setelah mencoba versi pertama. Ditulis di sini karena **cara mereka lolos** lebih
berguna daripada perbaikannya.

### Hantu tidak pernah bisa keluar kandang

Petak hasil panen memperlihatkan dinding atas kandang sebagai `╔══  ══╗` — dua sel
**spasi** di baris 11 kolom 19 dan 20, dengan sebuah pelet tepat di atasnya. Gerbang
itu ada, terbaca, dan benar.

Yang salah pengejarnya. Ia selalu memilih arah yang memperkecil jarak ke pemain, dan
pemain mulai **di bawah** kandang — jadi arah "atas" selalu jadi kandidat terakhir,
dan gerbangnya tidak pernah dicoba. Keempat hantu memantul di lantai kandang selamanya.

Perbaikannya bukan aturan gerak tambahan, melainkan **keadaan**: seekor hantu keluar
dulu (sasarannya gerbang), baru mengejar. Diukur sesudahnya — keempatnya keluar dalam
**3 sampai 5 langkah**.

> **Pelajaran.** Sebuah pencari-jalur yang hanya punya satu sasaran akan terjebak di
> mana pun jalan keluarnya menjauh dari sasaran itu. Menambah bobot atau heuristik
> tidak menyelesaikannya; yang kurang bukan kecerdasan, melainkan **fase**.

### Keempat hantu bergerak sebagai satu

Aslinya keempat hantu memakai pengejar yang sama — satu-satunya pembeda nilai acak
arah awal.

> [!WARNING]
> **Kalimat di atas benar tapi berhenti terlalu cepat**, dan itu baru ketahuan
> 10 Agustus 2026 ketika pemilik proyek bertanya *"lantas perilaku PAC-GAL
> seharusnya seperti apa?"*. Tiga mekanisme terlewat, dan ketiganya ada di baris
> berikutnya:
>
> 1. **Hantu tidak selalu mengejar.** Tiap langkah ia melempar dadu: menang →
>    melangkah ke arah pemain; kalah → **jalan lurus terus**. Modelnya jalan lurus
>    yang sesekali disela pengejaran, bukan pengejaran.
> 2. **Mengejarnya cuma pada satu sumbu** — sumbu yang sedang *tidak* ia tempuh.
>    Dari sini gerak zig-zag khasnya.
> 3. **Keganasannya adaptif, dan arahnya terbalik dari Pac-Man.** Ia **dibagi dua**
>    saat pelet tersisa < 50 dan saat level tamat, lalu **dikali dua** kalau pemain
>    mati di awal. Makin dekat menang, makin jinak hantunya — kebalikan telak dari
>    *Cruise Elroy*.
>
> Poin 3 adalah instans kedua dari watak yang sama dengan §Temuan 4: PAC-GAL
> berulang kali memberi kompensasi kepada pemain yang sedang kalah.
>
> Dan satu lagi: saklar itu (`I12%`) bertipe bulat, mulai dari 0, dan **tidak
> pernah diisi**. Di rekonstruksi yang bisa di-`RUN`, hantunya karena itu **tidak
> pernah mengejar sama sekali**. Rinciannya berikut apa yang bisa dan tidak bisa
> disimpulkan darinya:
> [`../../decompile/PAC-GAL/ARCHITECTURE.md`](../../decompile/PAC-GAL/ARCHITECTURE.md) §4b. Port pertama meniru itu setia, dan hasilnya persis seperti yang dilaporkan:
mereka menumpuk jadi satu rombongan.

Diukur, 120 langkah, pemain bergerak:

| | Rata-rata sel unik ditempati 4 hantu | Langkah dengan tumpang-tindih |
|---|--:|--:|
| Watak sama (versi pertama) | **1,00** | 120 / 120 |
| Empat watak berbeda | **3,03** | 68 / 120 |

Angka 1,00 itu harfiah: keempatnya berdiri di **sel yang sama persis**, setiap langkah,
tanpa kecuali. Empat hantu yang berperilaku identik bukan empat lawan — ia satu lawan
yang digambar empat kali.

Perbaikannya konvensi Pac-Man 1980: empat **sasaran** berbeda, bukan empat algoritma
berbeda.

### Diperiksa terhadap sumbernya, dan tiga hal ternyata salah

Klaim "konvensi Pac-Man 1980" itu diperiksa terhadap
[Maze Ghost AI Behaviors](https://pacman.fandom.com/wiki/Maze_Ghost_AI_Behaviors),
bagian **Pac-Man** saja — bukan *Arrangement* 1996 dan seterusnya. Hasilnya: sebagian
sudah benar, sebagian tidak.

**Yang sudah benar sejak awal:**

| hantu | sudut sebar | sasaran kejar |
|---|---|---|
| Pengejar (*Blinky*) | kanan-atas | pemain, langsung |
| Penjepit (*Inky*) | kanan-bawah | `2P − Blinky`, dengan `P` = dua petak di depan pemain — persis aturan "jarak Blinky ke titik itu digandakan" |
| Pemalu (*Clyde*) | kiri-bawah | pemain, tapi pulang ke sudutnya dalam radius **8** petak |
| Pembayang (*Pinky*) | kiri-atas | — |

**Tiga yang salah, dan sudah diperbaiki:**

| | sebelum | sekarang |
|---|---|---|
| Bidikan Pembayang | **4** petak di depan | **2** — angka aslinya |
| Bug arah-atas | tidak ada | ada: saat pemain menghadap **atas**, bidikannya 2 di atas **dan 2 ke kiri** |
| Mode "marah" Pengejar | tidak ada | ada: pada sisa 20 dan 10 pelet ia lebih cepat **dan berhenti ikut menyebar** |

Bug arah-atas itu perlu penjelasan, karena menambahkan bug dengan sengaja terdengar
aneh. Di mesin 1980, rutin yang menghitung "n petak di depan" untuk arah **atas** juga
menambahkan offset yang sama ke sumbu mendatar — kesalahan limpahan. Tapi ia kesalahan
yang **membentuk seluruh rasa main** permainan itu: ia yang membuat Pinky bisa dikelabui
dengan menghadap ke atas, dan tanpa itu Pinky jadi lawan yang berbeda. Meniru
perilakunya tanpa meniru bug-nya berarti meniru yang salah. Penjepit memakai rutin yang
sama, jadi ia **mewarisi bug yang sama** — persis seperti di aslinya.

**Satu lagi yang salah jenisnya, bukan derajatnya.** Hantu yang ketakutan dulu
**kabur** di sini — memaksimalkan jarak ke sasarannya. Di 1980 ia memilih **arah acak**
di tiap persimpangan. Bedanya besar: yang kabur bisa digiring ke sudut dan dikumpulkan,
yang acak tetap berbahaya justru saat pemain mengira sudah aman. Sudah diganti.

### Saklar: kedua perilaku bisa dibandingkan langsung

Sejak 10 Agustus 2026 halaman ini punya saklar **"Hantu asli PAC-GAL 1986"** di
bawah tombol Mulai. Mati = watak Pac-Man 1980 (bawaan). Nyala = perilaku yang
sesungguhnya ada di binernya:

| | Pac-Man 1980 | PAC-GAL 1986 |
|---|---|---|
| Sasaran | empat, berbeda per hantu | **satu**, pemain, untuk keempatnya |
| Cara bergerak | selalu membidik sasaran | **jalan lurus**, sesekali disela undian mengejar |
| Saat mengejar | kedua sumbu | hanya sumbu yang **tidak** sedang ditempuh |
| Menjelang menang | Blinky makin ganas | hantu makin **jinak** |

Panel skor menampilkan `I12%` saat saklarnya nyala, dan angkanya **0,000**. Itu
bukan kesalahan port: nilai awalnya nol dan kedua aturan pengubahnya cuma membagi
dua dan mengalikan dua. Jadi di pernyataan yang berhasil dipulihkan, hantunya
**tidak pernah mengejar sama sekali**.

Menampilkan angka itu di panel adalah keputusan sadar. Temuan ini bisa saja cuma
ditulis di dokumen, tapi angka yang bisa dilihat sendiri di layar lebih sulit
diabaikan daripada kalimat yang harus dipercaya.

Yang **tidak** terpulihkan dan karena itu rekonstruksi di mode ini: apa yang
terjadi saat langkah hantu menabrak dinding. Dipilih arah sah lain secara acak —
perilaku memantul yang wajar untuk hantu yang arah awalnya sendiri diundi.

### Empat cacat yang dilaporkan sesudahnya, dan sebabnya

Pemilik proyek memainkannya dan melaporkan empat hal. Ketiganya nyata; satu di
antaranya **sudah ada sejak versi pertama**, bukan dari perubahan watak.

**1. Dua hantu tidak pernah keluar kandang — cacat lama.** Keluarnya hantu memakai
penundaan tetap 0/24/60/100 *tik permainan*. Satu tik = 0,13 detik, jadi hantu
keempat menunggu **tiga belas detik** — dan `reset()` **memasang ulang penundaan itu
setiap kali pemain mati**. Mati sebelum 13 detik, dan hantu keempat tidak pernah
keluar sama sekali.

Diganti **pencacah pelet**, seperti Pac-Man 1980: ambang 0 / 5 / 14 / 28 pelet
dimakan. Yang menentukan bukan angkanya melainkan bahwa `sisa` **tidak** di-reset
saat mati — jadi sesudah mati keempatnya langsung keluar lagi. Diukur sesudah
perbaikan: keempat hantu keluar pada bingkai 6 / 39 / 110 / 271, dan **nol persen**
waktu di kandang pada 40% terakhir permainan, di kedua mode.

**2 dan 3. Hantu masuk lagi ke kandang lalu terjebak — cacat baru, dari saya.**
Perubahan "ketakutan bergerak acak" saya pasang **tanpa memandang mode**. Hantu yang
ketakutan saat sedang keluar kandang kehilangan sasarannya dan berputar-putar di
dalam; hantu yang di luar bisa melangkah acak **masuk kembali lewat gerbang**, dan
begitu di dalam modenya masih `'kejar'` sehingga baris "kalau di kandang, keluar"
tidak pernah kena — terjebak selamanya.

Dua perbaikan: gerak acak hanya berlaku saat hantu **sedang bermain**, dan
**gerbang kandang dibuat satu arah** — hanya hantu yang sedang keluar atau yang
sudah dimakan boleh melewatinya. Ditambah jaring pengaman: hantu yang sedang
bermain tapi berada di dalam kandang dikembalikan ke fase keluar.

**4. Keadaan rentan "hampir tidak terasa".** Rumus lamanya
(`(pelet/5+20)/nyawa²` = 13 giliran) datang dari biner dan **tidak diubah**. Yang
diubah berapa lama satu giliran itu di layar: hantu ketakutan sekarang bergerak
**sepertiga** kecepatan, bukan setengah. Itu memberi ~5 detik alih-alih 3,4 — dan,
yang lebih penting, membuat mereka **bisa dikejar**. Sejak geraknya acak dan bukan
kabur, mereka tidak lagi datang menghampiri pemain, jadi jendela sesingkat itu
praktis tidak bisa dipakai.

**Susulan: hantu oranye tidak keluar sama sekali — dan sebabnya geometri, bukan logika.**
Perbaikan di atas ternyata belum cukup, dan penyebabnya baru ketahuan setelah petak
hasil panen dibaca ulang di sekitar kandang:

```
kol  16 17 18 19 20 21 22 23
r11   #  #  #  .  .  #  #  #     <- gerbang DUA sel: (11,19) dan (11,20)
r12   #  .  .  .  .  .  .  #
r13   #  .  .  .  .  .  .  #     <- interior kolom 17..22, bukan 17..20
r14   #  .  .  .  .  .  .  #
r15   #  #  #  #  #  #  #  #
```

Tiga tetapan saya salah, dan ketiganya salah ke arah yang sama — **saya menyamakan
lebar kandang dengan jumlah hantu** (empat sel start di kolom 17–20) tanpa membaca
petaknya:

| yang saya kira | sebenarnya | akibatnya |
|---|---|---|
| gerbang satu sel (11,19) | **dua sel**, (11,19) dan (11,20) | hantu masuk lewat sel yang tidak dijaga |
| interior kolom 17–20 | **17–22** | hantu di kolom 21–22 tak dikenali jaring pengaman |
| selesai keluar = menginjak (10,19) | — | **inilah yang paling merusak** |

Yang ketiga akar sesungguhnya. Hantu dinyatakan selesai keluar hanya kalau menginjak
sel **persis (10,19)**. Karena gerbangnya dua sel, hantu yang naik lewat (11,20) tiba
di (10,20) dan **tidak pernah** memenuhi syarat itu — ia tetap bermode "keluar"
selamanya, dan karena sasaran mode keluar adalah gerbang, ia terus berusaha kembali
masuk. Dari luar: hantu yang mondar-mandir di atas kandang, atau yang masuk lagi dan
tidak keluar-keluar.

Diganti syarat yang tidak bergantung pada satu sel: **selesai keluar begitu barisnya
di atas baris gerbang**. Diukur sesudahnya, 12.000 bingkai di kedua mode: keempat
hantu keluar dan menjelajah seluruh labirin, posisi akhir tersebar di empat penjuru.

> **Pelajaran tambahan, dan ini yang mahal.** Uji pertama saya **lulus** padahal
> permainannya rusak: kotak "di dalam kandang" saya bikin dari kotak-batas keempat
> posisi awal hantu, jadi hantu yang naik satu petak — masih di dalam kandang —
> sudah terhitung "keluar". Alat ukur yang mewarisi asumsi yang sama dengan kode
> yang diukurnya tidak akan pernah menemukan kesalahan itu. Yang memecahkannya
> mencetak **petak labirinnya sendiri** dan membaca dindingnya satu per satu.

> **Pelajaran.** Cacat 2 dan 3 lahir dari satu baris yang benar secara lokal —
> "kalau ketakutan, pilih arah acak" — tapi dipasang di tempat yang juga menangani
> hantu yang sedang **keluar kandang** dan yang sedang **pulang setelah dimakan**.
> Perubahan perilaku yang benar untuk satu keadaan diterapkan ke semua keadaan.
> Yang menemukannya bukan membaca ulang kodenya, melainkan **melacak posisi tiap
> hantu bingkai demi bingkai** sampai terlihat yang mana yang diam di tempat.

### Yang MASIH berbeda dari 1980, dan sengaja dibiarkan

Supaya daftarnya tidak diam-diam mengecil:

- Hantu **tidak berbalik arah** saat mode sebar↔kejar berganti. Di aslinya berbalik.
- ~~Keluarnya hantu memakai penundaan tik tetap.~~ **Sudah diganti pencacah pelet**
  — lihat cacat 1 di atas. Ambangnya sendiri (0/5/14/28 dari 468) tetap
  **rekonstruksi**: PAC-GAL tidak punya aturan ini sama sekali.
- Jadwal sebar/kejar memakai ambang saya sendiri, bukan deret 7/20/7/20/5/20/5-lalu-
  kejar-selamanya, dan tidak berhenti berjalan selama hantu ketakutan.
- Tidak ada perlambatan di terowongan.

> **Dan ini yang paling perlu disadari:** setiap perbaikan di halaman ini membuat
> port-nya **lebih mirip Pac-Man 1980** sekaligus **lebih jauh dari PAC-GAL 1986**,
> yang binernya memakai satu pengejar untuk keempat hantu. Kesetiaan di sini bukan
> kepada sumbernya melainkan kepada konvensi yang sumbernya sendiri tidak ikuti.
> Itu pilihan yang sadar, bukan kelalaian — tapi ia pilihan, dan harus terbaca sebagai
> pilihan.

> **Pelajaran.** Keragaman perilaku paling murah dibuat dengan mengganti **masukan**,
> bukan logikanya. Satu pencari-jalur dan empat sasaran menghasilkan empat kepribadian
> yang bisa dibedakan pemain — dan hanya butuh satu fungsi yang diuji.

### Bentuk Pac-Gal tidak terbaca sebagai Pac-Man

Versi pertama memakai busur SVG `A` dengan bendera *large-arc* dan *sweep*. Pada
jari-jari 7 unit, satu bendera yang salah mengubah "lingkaran dengan mulut" jadi
"irisan pizza", dan bedanya sulit dilihat tanpa diperbesar.

Diganti **poligon 28 ruas**: mulus pada ukuran ini, dan tidak punya bendera yang bisa
salah sama sekali.

> **Pelajaran.** Kalau sebuah primitif punya parameter yang salahnya tidak kelihatan,
> menggantinya dengan konstruksi yang lebih bodoh sering lebih murah daripada
> memastikan parameternya benar.

---

## 5 · Tiga tingkat kepastian

Port yang berangkat dari `.EXE` wajib memisahkan ini, karena tidak ada sumber asli
yang bisa dipakai memeriksa (§8a instruksi serah-terima).

| Tingkat | Bagian | Dasar |
|---|---|---|
| **Pasti** | susunan labirin, 468 pelet, posisi awal (19,19), kandang hantu (14, 17–20), terowongan baris 12, dua kolom per sel, rumus hantu rentan | terbaca langsung dari EXE atau terukur dari layarnya |
| **Pasti** | gerbang kandang di baris 11 kolom 19–20 | terbaca dari petak hasil panen |
| **Turunan** | bahwa hantu memakai pengejar berbasis selisih | disimpulkan dari pola `SGN(selisih)`; bukan kutipan |
| **Rekonstruksi** | empat watak berbeda, sebar/kejar, empat energizer sudut, bentuk gambar, warna, laju | **saya yang mengisi** — tidak ada di berkasnya |
| **Rekonstruksi** | skor hantu 200/400/800/1600 dan jeda ~0,9 detik saat hantu dimakan | dari Pac-Man arcade. PAC-GAL tidak punya skor sama sekali; pencacahnya hanya `dots`. Yang aslinya terjadi (baris 4560) justru lebih keras: hantu **langsung** pindah ke sel start-nya dalam wujud normal, tanpa fase mata |

Nama variabel asli, nomor baris asli, dan seluruh komentar **hilang permanen**.
Ketiganya memang tidak pernah ada di dalam `.EXE`.

---

## 6 · Angka, dan cara menghitungnya

Standar koleksi ini: setiap angka harus bisa ditunjukkan cara menghitungnya (§9b).

| Klaim | Cara dibuktikan |
|---|---|
| Labirin hasil panen benar | 468 ubin `∙` terhitung dari petak, dan baris status yang **program itu sendiri** cetak berbunyi `dots 468` — dua sumber, satu angka |
| Panen tidak menutupi pelet | cacah pelet sebelum dan sesudah sprite dibuang sama-sama 468; kalau ada hantu berdiri di atas pelet, angkanya akan turun |
| Susunan sama dengan rekonstruksi | `refscreen.py` mencocokkan layar EXE dengan layar `.bas`: **24 dari 24 baris**, sel demi sel |
| Tiap baris labirin utuh | lebar minimum = maksimum = **79 kolom** |
| Labirin bisa ditamatkan | banjir dari posisi awal mencapai 489 sel, dan **468 dari 468 pelet** ada di dalamnya |
| Terowongan benar-benar terpakai | banjir yang sama melintasinya **2 kali** (satu per arah) |

Angka terakhir itu yang paling mudah dilewatkan: labirin yang tergambar cantik
tapi punya kantong terkunci akan terlihat benar dan tidak bisa ditamatkan.

---

## 7 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Labirin | dibangun saat startup dari `CHR$`/`STRING$`, dicetak baris demi baris | 64 KB ruang kerja; menyimpan 24 baris literal boros | Petak hasil **panen layar EXE** di `maze.js`, ditandai DIHASILKAN. Bukan pilihan gaya — tidak ada larik untuk disalin |
| Deteksi tabrakan | `SCREEN(r, c*2+1)` membaca karakter di layar | tidak ada memori untuk peta terpisah | Membaca kisi karakter yang **sama**. Bisa saja dipisah jadi peta bit, tapi itu menghapus satu-satunya hal yang membuat labirin ini bisa dipahami |
| Terowongan | ubin `─` + `kolom = 39 − kolom` | cabang `IF` mahal di gelung dalam | Dipertahankan apa adanya, termasuk ubinnya |
| Grafik | karakter CP437 di layar teks 80×25 | mode grafis CGA lambat dan boros 16 KB | SVG: dinding digambar sebagai garis dari titik tengah sel ke sisi yang tersambung, jadi sudut dan pertigaan terbentuk sendiri (`_teknik-svg.md` prinsip 2) |
| Warna | atribut CGA 4-bit | palet perangkat keras | Literal, **bukan token tema** — mengambilnya dari token akan menghapus justru hal yang sedang ditiru. Dinyatakan sebagai pengecualian di `pacgal.css` |
| Hantu rentan | lama `(pelet/5+20)/nyawa²`, dipicu `IF SCREEN(...) > 7` | — | Rumusnya dipertahankan **persis**. Pemicunya **tidak terpulihkan**: uji `> 7` mencakup pelet (249), spasi (32), dan semua ubin dinding, jadi pembacaannya tidak menghasilkan penjelasan yang masuk akal — dan petak hasil panen tidak memuat ubin energizer terpisah. Empat energizer sudut karena itu **rekonstruksi**, konvensi Pac-Man, bukan temuan |
| Watak hantu | **jalan lurus + undian kejar** (`I12%`), sasaran tunggal, koreksi satu sumbu, keganasan menurun menjelang menang | 64 KB; empat algoritma tidak muat | Empat **sasaran** berbeda dengan satu pencari-jalur, mengikuti **konvensi Pac-Man 1980** — termasuk bug arah-atas Pinky dan mode marah Blinky. **Rekonstruksi**, dan diukur: sel unik naik dari 1,00 jadi 3,03. Perlu dicatat: ini membuatnya lebih mirip Pac-Man dan **lebih jauh dari PAC-GAL**. Lihat §"Diperiksa terhadap sumbernya" |
| Keluar kandang | tidak ada keadaan khusus di aslinya yang terbaca | — | Fase "keluar" ditambahkan. **Perbaikan cacat**, bukan selera: tanpanya hantu terkurung permanen, dan permainannya tidak bisa kalah |
| Laju | gelung penghitung, `FOR` kosong | tidak ada jam | `RETRO.loop` langkah tetap. Nilai 0,14 detik per petak adalah **selera** — laju aslinya bergantung kecepatan mesin dan tidak bisa dipulihkan dari kodenya |
| Papan skor | tidak ada | — | `localStorage` lewat `store.js`, menyimpan pelet terbanyak. **Tambahan**, tidak ada di aslinya |
| Suara | enam string `PLAY` | speaker PC satu suara | String `PLAY` aslinya dipakai **verbatim** — `audio.js` menafsirkan bahasa makronya sungguhan |

---

## 8 · Latihan

1. **Hitung ulang jaminan bisa-ditamatkan.** Banjiri labirin dari kandang hantu,
   bukan dari posisi awal pemain. Apakah keempat hantu bisa mencapai semua 468
   pelet? Kalau tidak, sel mana yang terkunci — dan apa artinya untuk pengejarnya?
2. **Buktikan bahwa terowongan wajib.** Matikan ubin `─` di kedua ujung baris 12,
   lalu banjiri ulang. Berapa pelet yang jadi tak tercapai? Angka itu mengukur
   berapa besar sumbangan satu karakter terhadap rancangan labirinnya.
3. **Cari titik impasnya.** Pada kombinasi pelet-tersisa dan nyawa yang mana lama
   hantu rentan tepat sama dengan 13 giliran seperti di awal permainan? Selesaikan
   `(p/5 + 20)/n² = 13` untuk n = 1, 2, 3 dan tafsirkan hasilnya.
4. **Ukur biaya representasi tunggal.** Berapa byte yang dihemat dengan memakai
   layar sebagai peta tabrakan, dibandingkan menyimpan petak 40 × 24 bit terpisah?
   Bandingkan dengan 64 KB yang tersedia, lalu putuskan apakah penghematan itu
   sepadan dengan kehilangan lapisan tak terlihat.
5. **Periksa klaim dua sumber.** Ubah `genmaze.py` supaya mengganti sel sprite
   dengan pelet, bukan spasi. Berapa cacahnya sekarang, dan bagaimana pemeriksaan
   `assert` di dalamnya menangkap kesalahan itu sebelum sampai ke halaman?

---
Berkas terkait: [pakai](../games/pacgal/index.html) ·
[fondasi](_fondasi.md) ·
[teknik SVG](_teknik-svg.md) ·
[analisis dekompilasi](../../decompile/PAC-GAL/ARCHITECTURE.md) ·
[basis port](../../decompile/PAC-GAL/pac-gal-run.bas) ·
[EXE aslinya](../../run/PAC-GAL.EXE)
