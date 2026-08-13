# LANDER — satu `BLOAD` yang mengisi empat puluh array

> Port web: [`web/games/lander/`](../games/lander/index.html) ·
> Sumber: [`run/LANDER.BAS`](../../run/LANDER.BAS) (399 baris),
> [`run/LANDER.BIN`](../../run/LANDER.BIN) (5.760 bita),
> [`run/LANDER.SCR`](../../run/LANDER.SCR) (128 bita) ·
> Analisis BASIC: [`reviews/LANDER.md`](../../reviews/LANDER.md)

LANDER.BAS bertanggal **8 Maret 1982** — tanggal berkas `LANDER.BIN`, yang tidak
pernah disunting lagi sesudahnya. Ia program paling ambisius di koleksi ini
secara teknis, dan tiga hal di dalamnya tidak ada padanannya di 82 program lain:
sebuah berkas biner yang isinya **tabel variabel BASIC**, sebuah daftar sudut
yang **sengaja tidak rata**, dan musik latar yang tanpa sengaja menjadi **jam
permainannya**.

---

## 1 · Satu `BLOAD` yang mengisi empat puluh array

```basic
1680 DEFINT M,R,P,X,T,L,B: S=66: DIM PDATA(20)
1690 DIM M1(S),M2(S),M3(S),…,M13(S)
1700 DIM R1(S),R2(S),R3(S),…,R13(S)
1710 DIM RR1(S),RR2(S),RR3(S),…,RR13(S)
1720 DEF SEG=0:A=VARPTR(PDATA(0))
1730 DEF SEG:BLOAD"LANDER.BIN",A
```

Baris 1730 memuat **satu berkas** ke alamat elemen pertama array **pertama**.
GW-BASIC menaruh array di memori menurut urutan pendeklarasiannya, jadi berkas
itu tumpah melewati `PDATA` dan mengisi ketiga puluh sembilan array sesudahnya.

Artinya `LANDER.BIN` bukan berkas gambar. Ia **potret mentah sepotong memori
GW-BASIC**, lengkap dengan deskriptor tiap array — tipe, nama, panjang, jumlah
dimensi. Program ini menyimpan sebagian dirinya sendiri ke disket.

Kalau urutan `DIM` di baris 1690–1710 diubah satu baris saja, seluruhnya
berantakan. Tidak ada pemeriksaan apa pun; kontraknya cuma "jangan disentuh".

### Isi berkasnya, dibaca ulang

| | |
|---|--:|
| Panjang berkas di disket | 5.760 bita |
| Kepala BSAVE (`FD`, segmen, ofset, panjang) | 7 bita |
| Panjang yang **dinyatakan** kepala itu | 5.644 bita |
| — `PDATA(0..20)` | 42 bita |
| — 39 array sprite (deskriptor + data) | 5.602 bita |
| Sisa yang tidak pernah dibaca `BLOAD` | 109 bita |
| Sprite ditemukan | **39** |
| Ukuran tiap sprite | 21 × 21 piksel, 2 bit/piksel |

Seratus sembilan bita terakhir itu bukan data. 7 + 5.644 = 5.651, dan
5.760 = **45 × 128** — DOS 1.x menulis berkas dalam rekaman 128 bita, jadi
berkasnya dibulatkan ke rekaman penuh berikutnya. Isinya nol dan sisa RAM.

`PDATA(0..3)` berisi `NANG=13`, `SIZE=66`, `MX=20`, `MY=20`; `PDATA(4..16)`
berisi ketiga belas sudutnya. Semua angka di halaman port dibaca dari berkasnya
oleh skrip, bukan diketik ulang.

### Nama arraynya membuktikan urutannya

Jarak antar sprite di dalam berkas tidak seragam, dan pola ketidakseragamannya
persis mengikuti **panjang nama variabel**:

| Jarak | Berapa kali | Nama yang menyusul |
|--:|--:|---|
| 143 bita | **17×** | `M2`…`M9` (8) dan `R1`…`R9` (9) — nama dua aksara |
| 144 bita | **17×** | `M10`…`M13` (4), `R10`…`R13` (4), `RR1`…`RR9` (9) — tiga aksara |
| 145 bita | **4×** | `RR10`…`RR13` — empat aksara |

Data tiap sprite tetap 134 bita; yang berubah hanya deskriptornya, dan
deskriptor GW-BASIC menyimpan nama variabel **apa adanya**. 17 + 17 + 4 = 38,
yaitu jarak antara 39 sprite.

Deretan itu hanya masuk akal kalau urutannya benar-benar M1…M13, R1…R13,
RR1…RR13 — yaitu urutan `DIM` di baris 1690–1710. Dua berkas yang berbeda
menyetujui satu hal, tanpa saling menyebut.

---

## 2 · Tiga belas sudut, dan lubang di tengahnya

```
0  15  30  45  60  90  180  270  285  300  315  330  345
```

Perhatikan lompatannya: **90° → 180° → 270°**. Seperempat lingkaran di kanan
bawah tidak ada sama sekali, sementara tiga puluh derajat terakhir dibagi halus
lima kali.

Alasannya bukan selera. Tiap sudut butuh **tiga gambar** — tanpa semburan,
semburan kecil, semburan besar — seharga 3 × 134 = 402 bita. Tiga belas sudut
sudah memakan 5.602 bita (hampir 5,5 KB) dari RAM 64 KB, dan itu belum
menghitung program, medan, dan dua lagunya. Sudut keempat belas tidak muat.

Karena itu "memutar pesawat" di program ini **bukan perhitungan**:

```basic
2390 ON TILTOLD GOTO 2400,2410,…,2520     ' 13 cabang, satu per sudut
2400 PUT(XOLD,YOLD),M1:RETURN
```

Angka 13 muncul di dua tempat yang tidak saling tahu: sebagai **cacah cabang**
di `LANDER.BAS`, dan sebagai **`PDATA(0)`** di `LANDER.BIN`. Keduanya cocok.

> Catatan koreksi untuk [`reviews/LANDER.md`](../../reviews/LANDER.md): review
> itu menyebut "36 array bernomor" dan menulis `M1…M12`. Angka yang benar
> **39** dan `M1…M13`. Sumber kekeliruannya terlihat di lampiran review sendiri
> — baris `DIM`-nya terpotong pada kolom ke-75, sehingga `M13` terbaca sebagai
> `M1`. Menariknya bagan `ON…GOTO` di review yang sama sudah menampilkan
> **13** cabang. Review itu bertentangan dengan dirinya sendiri, dan berkas
> biner memutuskan siapa yang benar.

---

## 3 · Fisikanya memakai 3.14, bukan π

```basic
790 SY=SY+GRAV-T*COS(3.14*ANG(TILT)/180)
    SX=0.9*SX+T*SIN(3.14*ANG(TILT)/180)
```

`3.14` meleset dari π sebesar 0,00159. Akibatnya kecil tapi bisa diukur:

| Keadaan | Yang diharapkan | Yang terjadi |
|---|--:|--:|
| `SIN` pada "180°" | 0 | **0,001593** |
| `COS` pada "90°" | 0 | **0,000796** |
| Dorongan menyamping saat terbalik penuh (T=19) | 0 | **0,0303 per bingkai** |

Jadi pesawat yang benar-benar terbalik tetap **melayang pelan ke kanan**, dan
pesawat yang benar-benar mendatar tetap **terangkat sedikit**. Dipertahankan apa
adanya di port: mengganti `3.14` dengan `Math.PI` akan memperbaiki program yang
tidak rusak.

`0.9*SX` adalah hambatan udara — di bulan. Komentar aslinya jujur: `' SX has air
drag.` Kecepatan mendatar 30 meluruh di bawah 1 dalam **33 bingkai**.

---

## 4 · Musiknya adalah jam permainannya

Ini temuan terpenting di program ini, dan ia tersembunyi di satu baris:

```basic
510 PLAY "mb":SOUND TUNE(C,0),TUNE(C,1)
             :SOUND TUNE(C+1,0),TUNE(C+1,1)
             :C=C+2:IF C>149 THEN C=1
```

Tiap bingkai permainan mengantre **dua nada** *Blue Danube*. Antrean `SOUND` di
GW-BASIC dalamnya **32 nada**; begitu penuh, BASIC berhenti dan menunggu. Jadi
sesudah enam belas bingkai, permainan tidak lagi berjalan secepat prosesornya —
ia berjalan secepat waltz-nya.

| | |
|---|--:|
| Nada di `TUNE` | 150 |
| Total durasi | 588 detak |
| Pada 18,2 detak/detik | **32,31 detik** |
| Dibagi 75 bingkai (2 nada per bingkai) | **2,32 bingkai/detik** |

Dua konsekuensi yang bisa diperiksa:

1. Menekan **`S` (silence)** di aslinya tidak cuma mendiamkan permainan, ia
   **mempercepatnya berlipat**. Pilihan bunyi adalah pilihan kesulitan.
2. Penulisnya tahu soal antrean itu. Buktinya `SOUND 99,0` — durasi nol adalah
   perintah *kosongkan antrean* — muncul di **empat** tempat: baris 530 dan 590
   (bahan bakar habis), 1130 (mendarat), dan 1220 (menabrak). Persis di saat
   waltz yang tertinggal akan terdengar konyol.

Tangga nadanya pun dihitung sendiri, bukan diserahkan ke `PLAY`:

```basic
1930 FOR I=7 TO 88: MM(I)=INT(36.8*(2^(1/12))^(I-6)):NEXT
```

Itu tangga sama-rata dua belas nada, dari rumus. `MM(49)` menghasilkan
**441 Hz** — nada A4, meleset satu hertz di atas 440. Kesalahannya bukan dari
`INT` melainkan dari tetapan `36.8`; supaya A4 tepat 440, angkanya harus
36,7081. Nada 0–6 disetel 32767 Hz, di luar jangkauan pendengaran, jadi
berfungsi sebagai **tanda diam** yang tetap memakan waktu di antrean.

---

## 5 · Enam puluh medan, selamanya

```basic
220 …:A=RND(100*-VAL(RIGHT$(TIME$,2))):…
```

`RIGHT$(TIME$,2)` adalah **detik** jam — 0 sampai 59. Itu satu-satunya sumber
keacakan yang membedakan satu permainan dari yang lain. Program ini punya
**enam puluh medan** seumur hidupnya.

Dan pada detik `"00"` argumennya menjadi 0. `RND(0)` di GW-BASIC berarti
"ulangi bilangan terakhir" — **tidak menyetel ulang benih sama sekali**. Satu
detik dari enam puluh, medannya mengulang ronde sebelumnya.

Medan **Advanced Lander** lain lagi. Ia dihitung di baris 1790–1840, yaitu saat
program dimuat — **sebelum** baris 220 pernah dijalankan. Jadi ia lahir dari
benih bawaan GW-BASIC yang selalu sama: **medan itu identik untuk semua orang,
setiap kali, sejak 1982**. Ia bukan tempat acak, ia tempat.

---

## 6 · Dua berkas yang menyetujui satu angka

Baris 940 menguji tabrakan tanah begini:

```basic
940 FOR I=(1+X/4) TO ((X+MX)/4-1):IF (Y+MY-6)>LY(I) GOTO 1020:NEXT
```

Kenapa `-6`? Karena `MY=20`, dan `MY-6 = 14`. Sekarang lihat sprite `M1` di
dalam `LANDER.BIN`, baris demi baris:

```
        …
row 11         .     .
row 12         .     .
row 13        .       .
row 14      .....   .....      <- bantalan kaki
row 15        (kosong)
```

Baris terisi paling bawah adalah **baris 14**. Itu bantalan kakinya. Jadi
`Y+MY-6` bukan angka ajaib — ia **garis kaki pesawat**, dan ia benar hanya
kalau gambar dan aturannya memang sepasang.

Halaman portnya menghitung kedua angka itu sendiri saat dimuat, dari dua sumber
berbeda, dan menampilkannya bersebelahan. Keduanya **14**.

Baris 1230 menguatkan: pusat ledakan `EX=10+X`, `EY=Y+10` — titik tengah kotak
21 × 21. Itu pula titik putar yang dipakai modul vektor di port ini, sehingga
gambar modern dan sprite 1982 bisa ditumpuk tanpa bergeser.

---

## 7 · Dan logo IBM-nya membuktikan pembacaan `DATA`

```basic
1880 FOR I=0 TO 75:READ IBMX(I):NEXT
1890 FOR I=0 TO 75 STEP 2:READ IBMY(I):IBMY(I+1)=IBMY(I):NEXT
```

Baris 1890 membaca **38 angka** untuk mengisi indeks 0..75 — hanya yang genap,
sisanya disalin dari tetangganya. Jadi `IBMY(2k)` adalah angka ke-*k* di `DATA`,
dan tiap garis pasti mendatar.

Saya salah membaca ini pada percobaan pertama dan mengindeksnya dengan `i`
alih-alih `i/2`. Hasilnya beberapa garis biru melayang di tempat acak dan
sisanya hilang. Yang membuktikan perbaikannya bukan argumen melainkan
gambarnya sendiri — 38 garis itu, kalau diindeks dengan benar, menggambar ini:

```
#########     ##############        ########          #######
#########     ################      ##########      #########
  #####         #####    ######       #########    ########
  #####         ##############        ########### #########
  #####         ##############        #####################
  #####         #####    ######       #####  #######  #####
#########     ################      #######   #####   #######
#########     ##############        #######    ###    #######
```

Logo IBM bergaris delapan lajur, digambar dengan `LINE` di layar CGA, pada
gedung yang harus Anda lewati untuk mendarat. Kalau salah indeks, tidak ada
yang terbaca. Gambar adalah pengujinya sendiri.

---

## 8 · Dua kekeliruan yang benar-benar ada

### 8a · `TILT=0` di baris 3010

```basic
3010 X=90:Y=30:…:T=11:TOLD=T:TILT=0:TILTOLD=TILT:SY=13:ADVAN=1
```

`ANG` dideklarasikan `DIM ANG(NANG)` dan diisi dari indeks **1**. `ANG(0)`
tidak pernah disentuh, jadi nilainya 0 — kebetulan sama dengan tegak. Tapi dua
hal lain rusak:

1. `ON TILTOLD GOTO …` dengan nilai **0 tidak bercabang ke mana pun** — ia
   langsung jatuh ke baris berikutnya. Subrutin penghapus gambar tidak
   melakukan apa-apa, jadi bingkai pertama Advanced Lander meninggalkan
   **bayangan pesawat** di tempat lamanya.
2. Baris 1130 berbunyi `IF (TILT<>1) GOTO 1200` — "GOOD LANDING, BUT PLEASE
   LAND ON 2 FEET!". Dengan `TILT=0`, pemain yang **tidak pernah menyentuh
   tombol miring** tetap dituduh mendarat miring.

Hampir pasti maksudnya `TILT=1`. **Diperbaiki di port**, dan ini satu-satunya
aturan yang diubah.

### 8b · Yang diuji dan yang ditulis berbeda

```basic
1120 IF SY>15-6*ADVAN GOTO 1190
1190 …PRINT"YOUR FALL RATE MUST BE LESS THAN "15-5*ADVAN…
```

Di ronde biasa `ADVAN=0` dan keduanya 15. Di Advanced Lander yang **diuji 9**
tapi yang **ditulis 10**. Pemain yang mematuhi pesan di layar tetap bisa gagal.

**Tidak diperbaiki** — port menampilkan kedua angka sekaligus, jadi selisihnya
terlihat, bukan tersembunyi.

### 8c · Penjaga yang tak pernah dijalankan

```basic
640 K$=RIGHT$(INKEY$,1):IF (K$="")THEN RETURN:IF (F=0)THEN RETURN
```

Di BASIC, semua yang ada sesudah `THEN` pada baris yang sama **ikut ke dalam
`THEN`**. Penjaga kedua karena itu hanya bisa dicapai lewat jalur yang baru saja
mengembalikan kendali — artinya tidak pernah. Maksudnya jelas ("kalau bahan
bakar habis, matikan papan tombol"), tapi yang berjalan bukan itu.

**Dipertahankan**, dan bukan cuma demi kesetiaan: ia menyelamatkan
permainannya. Baris 1130 menolak pendaratan yang miring, jadi kalau kemudi ikut
mati, pesawat yang kehabisan bahan bakar dalam keadaan miring **pasti** gagal,
tanpa ada yang bisa dilakukan pemain. Kekeliruan ini menutupi kekeliruan lain.

---

## 9 · Kesulitannya benar-benar naik, dan itu terhitung

```basic
200 F=4000*(1-S/1000):…:GRAV=10+S/100:… IF F<1500 THEN F=1500
220 …IF GRAV>15 THEN GRAV=15
390 LY(I)=LY(1)+(194-LY(1))*ABS(COS(3.14*(1+S/600)*(LX(I)-BOT-15)/400))
```

Tiga hal mengeras sekaligus: bahan bakar menyusut, gravitasi menguat, dan medan
makin bergelombang.

| Skor | Bahan bakar | Gravitasi |
|--:|--:|--:|
| 0 | 4000 | 10,00 |
| 100 | 3600 | 11,00 |
| 250 | 3000 | 12,50 |
| 500 | 2000 | **15,00** (batas) |
| 625 | **1500** (batas) | 15,00 |
| 1000 | 1500 | 15,00 |

Dan gravitasi 10 bukan angka kira-kira: dengan dorongan tepat 10 pada sudut 0°,
`SY` tetap **nol persis**. Layar petunjuk baris 2280 menuliskannya sebagai
*"Gravity = Vertical thrust of about 10"*; kata *about* itu terlalu rendah hati.

Delapan ronde beruntun yang dijalankan port ini dengan benih 7 dan satu
pengendali sederhana menghasilkan tambahan skor **43, 36, 23, 20, 17, 15, 4, 4**
— kurva yang mengeras itu, terukur.

---

## 6c · Bumi yang lonjong, dan kenapa peregangan itu benar untuk sprite saja

Seluruh dunia digambar di dalam satu kelompok ber-`transform: scale(1 1.2)`.
Itu bukan iseng: piksel CGA 320×200 di monitor 4:3 memang tidak persegi, dan
sprite 1982 digambar untuk piksel seperti itu. Tanpa peregangan itu, pendarat
dan medannya keluar gepeng.

Tapi peregangan itu berlaku ke **semua** anaknya. Bumi digambar sebagai
`<circle r="12">` — bulat sempurna dalam koordinatnya, dan keluar sebagai
elips **12 × 14,4** di layar.

Sprite memang harus ikut diregangkan; **bola langit tidak**. Ia benda bulat,
dan bulat di monitor mana pun. Jadi kelompok Bumi membatalkan peregangan itu
untuk dirinya sendiri — skala 1/1,2 pada sumbu tegak, di sekitar pusatnya —
dan anak-anaknya digambar dalam koordinat berpusat di (0,0). Diukur di piksel
layar, bukan koordinat SVG: **57,2 × 57,2 piksel, rasio 1,0000**.

Gambarnya sekalian diperbaiki: laut bergradien dengan sorotan di kiri-atas,
empat daratan dan dua tudung es yang **dipotong lingkaran yang sama** sehingga
tidak mungkin menjulur keluar bola, dua sapuan awan tipis, selubung udara di
tepinya, dan sisi malam.

Sisi malamnya sempat salah arah. Versi pertama memakai `radialGradient`
berpusat di kanan-bawah dengan tepi gelap — yang justru menggelapkan **seluruh
keliling** dan membiarkan kanan-bawah terang: terminatornya terbalik, dan
bolanya terbaca sebagai cakram berbingkai. Diganti gradien **lurus** dari
kiri-atas ke kanan-bawah, searah dengan sorotan di gradien lautnya.

Tudung esnya juga sempat terlalu besar (`rx 8` pada bola `r 13`) dan terbaca
sebagai noda kelabu. Di layar sungguhan bolanya hanya 57 piksel; pada ukuran
itu yang menentukan cuma empat hal — bulat, biru, ada daratan hijau, dan ada
arah cahaya. Sisanya terbuang.

Mode **1982** tetap menyembunyikan Bumi seluruhnya (`display: none`), karena
layar aslinya memang tidak punya Bumi.

---

## 10 · Dari retro ke modern

| Bentuk asli | Kendala yang melahirkannya | Penafsiran | Bentuk sekarang & alasannya |
|---|---|---|---|
| 39 sprite 21×21 di-`BLOAD` dari berkas terpisah | `GET`/`PUT` cuma menerima nama array utuh; RAM 64 KB | "Gambar pesawat itu data, bukan kode" | **Keduanya ada.** Bawaannya modul bulan versi vektor yang diputar ke sudut sebenarnya; tombol **Mode 1982** menampilkan ke-39 sprite aslinya piksel demi piksel dari `LANDER.BIN`. Proporsi versi vektor diambil dari sprite `M1`, jadi keduanya bisa ditumpuk |
| 13 sudut tak rata, dipilih lewat `ON…GOTO` | tiap sudut memakan 402 bita | Batas memori, bukan batas rancangan | **Dipertahankan persis.** Versi vektor pun hanya boleh memakai ketiga belas sudut itu — memuluskannya akan menghapus temuannya |
| Piksel CGA 320×200 di monitor 4:3 | perangkat keras | Piksel aslinya 1,2× lebih tinggi daripada lebar | Seluruh koordinat tetap piksel CGA; satu `scale(1 1.2)` membetulkan bentuknya. Tanpa itu modulnya gepeng |
| Warna palet CGA 0 (hijau, merah, kuning) | 4 warna | — | Mode modern memakai warna foil Apollo; **Mode 1982** mengembalikan palet aslinya, termasuk tanah hijau hasil `PAINT(0,199),1,3` |
| Kecepatan diatur antrean musik (≈2,32/detik) | `SOUND` mengantre 32 nada, BASIC memblokir | Efek samping, bukan rancangan | **Dilepas.** Waltz-nya berjalan dengan tempo tertulisnya sendiri lewat penjadwal terpisah; kecepatan simulasi jadi penggeser. Tombol **Pakai jam waltz** menyetelnya ke 2/detik supaya angkanya bisa dirasakan |
| Alat ukur: angka (`GAUGE=1`) atau tiga bilah (`GAUGE=0`), tombol `D`/`A` | layar 40 kolom | Dua selera pemain, dua tata letak | **Keduanya ada**, di dalam layar, di kolom 241–319 seperti aslinya. Papan angka HTML di bawah layar adalah tambahan, bukan pengganti |
| `RND` dibenihi dari detik jam (0–59) | tidak ada jam presisi | 60 medan, titik | Kotak **Detik jam** memperlihatkan strukturnya: benih sama → medan sama. Bilangan acaknya **bukan** bilangan GW-BASIC — LCG-nya tidak ditiru, dan itu dinyatakan, bukan disamarkan |
| Skor tertinggi di `LANDER.SCR` | berkas teks | — | Rekor awal port ini **152 atas nama "You"**, dibaca dari berkasnya |
| `TILT=0` di baris 3010 | kekeliruan ketik | — | **Diperbaiki jadi 1** (§8a) |
| `15-6*ADVAN` diuji, `15-5*ADVAN` ditulis | kekeliruan ketik | — | **Dipertahankan**, kedua angka ditampilkan (§8b) |
| Penjaga `IF (F=0) THEN RETURN` yang tak terjangkau | tata bahasa `THEN` | — | **Dipertahankan** — dan §8c menerangkan kenapa memperbaikinya justru merusak |

Yang **tidak** diubah: seluruh baris 790–860 dan 920–1200 apa adanya, termasuk
`3.14`, `0.9*SX`, batas `SY<-10`, dan `INT(F/30)`.

---

## 11 · Latihan

1. Setel **Detik jam** ke 34, lalu ke 42. Titik pangkal landasan (`BOT`)
   berpindah dari **32** ke **290** — dua ujung jangkauan `30+260*RND`.
   Dari 60 benih, hanya **56** yang menghasilkan landasan berbeda; empat
   pasang bertabrakan. Cari pasangannya.
2. Nyalakan **Mode 1982**, lalu miringkan pesawat dari 0° sampai kembali ke 0°.
   Hitung berapa kali gambarnya berubah. Jawabannya 13 — tapi berapa
   *derajat* yang Anda lewati di lompatan terbesar?
3. Terbangkan sekali dengan dorongan **tepat 10** dari awal sampai akhir tanpa
   menyentuh apa pun. Pesawatnya tidak akan turun sedikit pun sampai bahan
   bakarnya habis di bingkai ke-400. Kenapa 400?
4. Miringkan sampai **180°** (tekan kanan enam kali) lalu dorong penuh. Pesawat
   akan menghunjam — tapi perhatikan juga bahwa ia perlahan bergeser ke kanan.
   Itu `3.14`, bukan angin.
5. Tekan **Pakai jam waltz**, lalu mainkan satu ronde penuh pada 2 bingkai per
   detik. Itu kecepatan yang benar-benar dialami orang pada 1982 dengan bunyi
   menyala. Sekarang bayangkan menekan `S`.
6. Buka [`run/LANDER.SCR`](../../run/LANDER.SCR) dengan penyunting teks.
   Berapa lama waktu yang dibutuhkan untuk mengalahkan 152, dan berapa
   pendaratan sempurna?

---

[Katalog port](../index.html) · [Analisis BASIC aslinya](../../reviews/LANDER.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
