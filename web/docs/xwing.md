# XWING — gambar yang disimpan sebagai bahasa

> Port web: [`web/games/xwing/`](../games/xwing/index.html) ·
> Sumber: [`run/XWING.BAS`](../../run/XWING.BAS) (732 baris) ·
> Analisis BASIC: [`reviews/XWING.md`](../../reviews/XWING.md) ·
> Demo SVG fondasi: [`web/svg-demo.html`](../svg-demo.html)

Program **tertua** di koleksi ini, dan yang terakhir dikerjakan. Tujuh baris
komentar di pucuknya menerangkan hampir seluruh silsilahnya:

```basic
1000  REM * STAR PILOT GAME *
1010  REM * WRITTEN BY GEORGE BLANK, LEECHBURG, PA. *
1020  REM * FOR  PUBLIC DOMAIN UNLESS MOVIEMAKERS OBJECT *
1030  REM * VERSION 4.0    SEPTEMBER 25,1978 *
1040  REM * MODIFIED TO RUN ON THE IBM PC BY ERNEST *
1050  REM * SMITH AND RAYMOND ROGERS, HOUSTON, TEXAS *
1060  REM * DECEMBER 82 *
```

Baris 1020 adalah kalimat paling jujur di seluruh 83 program. Setahun sesudah
filmnya keluar, Blank melepas programnya ke domain publik **dengan satu syarat
yang ia tulis sendiri di dalam kodenya**. Bukan lisensi, bukan sangkalan
hukum — sebuah kalimat yang mengakui bahwa ia tahu persis apa yang sedang
dipakainya, dan menyerahkan keputusannya kepada pihak lain.

Tanggalnya juga menerangkan sesuatu: **25 September 1978** untuk *versi 4.0*.
Berarti ada tiga versi sebelumnya, dan yang pertama hampir pasti ditulis pada
1977–78 — empat tahun sebelum port IBM PC-nya, dan sebelum IBM PC ada.

Dokumen ini memuat empat temuan yang tidak saya duga sebelum membongkarnya,
dan satu kesalahan saya sendiri yang perlu dicatat karena ia baru ketahuan di
tengah jalan.

---

## 1 · Gambar yang disimpan sebagai bahasa

Selama beberapa jam saya yakin sprite musuhnya adalah larik IM4–IM8, deretan
bilangan bulat panjang di baris 1350–1520. Itu keliru. Baris 1340
mengatakannya sendiri:

```basic
1330  LOCATE 8,1:PRINT "IMPERIAL FIGHTER:  ":DRAW "C2;BM145,59;M+0,0;
      BM+10,1;M+0,-2;M+2,2;M+0,-2;BM+10,-1;M+0,4;BM+6,-4;M+0,4;M+0,-2;M-6,0"
1340  DIM IM(6):DIM IM1(6):DIM IM2(6):DIM IM3(6):
      GET (145,59)-(145,59),IM  : GET (145,59)-(145,59),IM1 :
      GET (155,58)-(157,60),IM2 : GET (167,57)-(173,61),IM3
```

Sprite yang benar-benar Anda lawan saat terbang **tidak disimpan sebagai angka
sama sekali**. Ia disimpan sebagai **bahasa**: satu makro `DRAW` melukis
ketiga ukuran berdampingan di layar judul — gambar kecil di sebelah tulisan
*"IMPERIAL FIGHTER:"* yang muncul saat program dijalankan — lalu `GET`
memotong tiap ukuran dari layar itu ke dalam larik.

**Layar judulnya sekaligus lembar sprite.** Ia tidak sekadar menerangkan
lawan Anda; ia adalah bahan bakunya.

Idiomnya sendiri layak diperhatikan. `M+0,0` menggambar garis dari titik
sekarang ke titik sekarang — yaitu **satu piksel**. Tidak ada perintah "nyalakan
satu titik" di dalam `DRAW`, jadi Blank memakai garis sepanjang nol.

Menjalankan ulang keempat makro itu (baris 1330, 1530, 1760, 1770) lalu
memotong persis kotak yang sama mengembalikan kesepuluh gambarnya utuh:

```
IM  (>20.000)   IM2 (<20.000)   IM3 (<10.000)
    ##             ##  ##          ##      ##
                   ######          ##      ##
                   ##  ##          ##############
                                   ##      ##
                                   ##      ##

DV  (>20.000)   DV2 (<20.000)   DV3 (<10.000)
    ##             ##  ##            ##      ##
                   ######          ##      ##
                   ##  ##          ##############
                                   ##      ##
                                     ##      ##

DS  (>20.000)   DS2 (<20.000)   DS3 (<10.000)   DS4 (<5.000)
    ##               ##            ####            ######
                   ######        ########        ##########
                     ##          ########      ##############
                                   ####        ##############
                                               ##############
                                                 ##########
                                                   ######
```

Tiga hal yang keluar dari sini:

1. **Sebesar-besarnya musuh Anda tujuh kali lima piksel.** Bukan sprite
   raksasa; sebuah huruf H kecil.
2. **IM3 adalah TIE fighter dari depan**: dua bilah tegak, penghubung
   mendatar. Ingat bentuk ini — ia jadi barang bukti di §3.
3. **DV3 bukan salinan IM3.** Keempat sudutnya dipangkas. Pesawat Darth Vader
   memang berbeda bentuk, dan Blank menggambarnya berbeda — di dalam kanvas
   tujuh kali lima piksel. Itu keputusan seniman, bukan penyalinan.

Kesepuluh peta itu dipajang di halaman sebagai barang bukti, lengkap dengan
ukuran dan ambang jaraknya. Yang **tergambar di kokpit** bukan peta itu
melainkan tiga kapal SVG — penyimpangan yang diminta dan dijelaskan di §13
butir 1. Yang tetap dipakai dari peta ini adalah **bentuknya** (TIE Imperial
mengikuti `IM3`, TIE Advanced mengikuti `DV3` yang sudutnya dipangkas),
**letaknya**, **ketiga tahapnya**, dan **uji kenanya**.

---

## 2 · Gambar yang disimpan sebagai angka

Larik IM4–IM8 tetap ada, dan tetap gambar — hanya bukan untuk terbang.
Kelimanya dipakai **di satu tempat saja**, baris 3320–3470:

```basic
3320  PUT (EP-4,FP-1),IM4
3330  PUT (EP,FP),IM
3340  PLAY "P4"
3350  PUT (EP-9,FP-2),IM5
3360  PUT (EP-4,FP-1),IM4
3370  PLAY "P4"
3380  PUT (EP-12,FP-6),IM6
3390  PUT (EP-9,FP-2),IM5
3400  PLAY "P4"
3410  PUT (EP-9,FP-7),IM7
...
```

Itu animasi lima bingkai saat musuhnya **melintas** — adegan terpisah, bukan
kelanjutan ukuran sprite terbangnya. Itulah sebabnya ukurannya melompat dari
7×5 langsung ke 25×29.

Tiap pasang baris menggambar bingkai baru lalu **menghapus yang sebelumnya**:
`PUT` bawaannya XOR, jadi menggambar benda yang sama dua kali mengembalikan
latarnya. Dan yang mengatur kecepatannya `PLAY "P4"` — **tanda istirahat
musik**. Bukan gelung penghitung, bukan jam: sebuah jeda not seperempat.
Temuan yang sama persis dengan [LANDER](lander.md) dan
[STARTREK](startrek.md), di program yang ditulis **tiga tahun lebih dulu**
daripada keduanya.

Format lariknya sendiri lugas. `GET`/`PUT` GW-BASIC menyimpan dua kata kepala
— lebar dalam **bit** dan tinggi dalam baris — lalu data piksel dua bit per
piksel, karena `SCREEN 1` adalah CGA 320×200 empat warna (baris 1080 dan
6200 menetapkannya), tiap baris dibulatkan ke bita penuh.

Dibongkar dengan aturan itu, IM4 dan IM5 keluar sebagai TIE fighter dari
depan — bentuk yang sama dengan IM3. Sampai di sini semuanya cocok.

---

## 3 · Lalu IM7 keluar terputar 90 derajat

```
  IM4 (11×7)          IM7 (15×21)
  #.........#         ..#############
  #.........#         .#...........#.
  #.........#         #############..
  ###########         ......#.#......
  #.........#         ......#.#......
  #.........#         ......#.#......
  #.........#         ......#.#......
                      ......#.#......
                      ......#.#......
                      ......##.#.....
                      ......#.#......
                      .....#.##......
                      ......#.#......
                      ......#.#......
                      ......#.#......
                      ......#.#......
                      ......#.#......
                      ......#.#......
                      ..#####.#######
                      .#....##.....#.
                      #############..
```

IM4: dua bilah **tegak** di kiri-kanan, penghubung **mendatar** di tengah.
IM7: dua bilah **mendatar** di atas-bawah, penghubung **tegak** di tengah.

Itu transpose satu sama lain. Dan IM3 — yang dipulihkan dari makro `DRAW`,
sumber yang sama sekali berbeda — sepakat dengan IM4/IM5. Jadi tiga bacaan
bebas mengatakan hal yang sama, dan satu mengatakan yang sebaliknya.

Ketiga bingkai itu tidak mungkin pesawat yang sama dilihat dari tiga jarak.

---

## 4 · Kenapa tiga dari lima larik tidak dipakai

Langkah barisnya bukan soal selera. `DIM`-nya sendiri yang menentukan:
sebuah larik `GET` membutuhkan `4 + ceil(lebar_bit/8) × tinggi` bita, dan
`DIM IMn(k)` menyediakan `(k+1)×2`.

| larik | lebar bit | piksel | butuh | DIM beri | sisa | terisi |
|-------|-----------|--------|-------|----------|------|--------|
| IM4 | 22 | 11 × 7 | 25 | 28 | +3 | 13/14 |
| IM5 | 26 | 13 × 9 | 40 | 42 | +2 | 20/21 |
| IM6 | 34 | 17 × 17 | 89 | 90 | +1 | **22/45** |
| IM7 | 30 | 15 × 21 | 88 | 90 | +2 | 44/45 |
| IM8 | 50 | 25 × 29 | 207 | 206 | **−1** | **54/103** |

Sisa 0–2 bita wajar; `DIM` dibulatkan ke kata. Sisa **−1** tidak wajar sama
sekali: untuk IM8, ketiga angkanya — lebar 50, tinggi 29, `DIM 102` — **tidak
konsisten satu sama lain**. Kepalanya menuntut 207 bita; lariknya menyediakan
206. Salah satu dari ketiganya salah, dan tidak ada cara memutuskan yang
mana. IM6 pun cuma terisi 22 dari 45 elemen, dan hasil bacaannya tidak
berbentuk apa-apa.

Maka keputusannya, dan alasannya:

- **IM4 dan IM5 dipakai** untuk bingkai awal animasi lintas. Dua bacaan yang
  saling cocok dan cocok pula dengan IM3.
- **IM6, IM7, IM8 tidak dipakai.** IM7 dipajang di halaman sebagai barang
  bukti, dengan keterangan bahwa ia transpose — bukan sebagai pesawat.
- **Bingkai terdekat digambar tangan**, mengikuti orientasi IM4/IM5.

Membesarkan IM7 sampai hampir sepertiga lebar layar akan membuat sebuah
bacaan yang meragukan tampak seperti barang temuan, justru pada saat ia paling
terlihat. Itu penyimpangan yang lebih besar daripada menggambar sendiri dan
mengatakannya.

---

## 5 · Uji tabrakan yang dijawab oleh layar

Ini temuan yang paling tidak saya duga.

```basic
5820  Z=Z-1
5830  IF O-S>10000  THEN 5990        ' **** OUT OF RANGE ****
5840  IF POINT(38,21)<>3 THEN 5880   ' **** TORPEDO MISSED ****
5850  IF SKILL=0 GOTO 6100           ' * GAME WON *
5860  K=INT(RND*10)
5870  IF K>SKILL+1  THEN 6100
```

Baris 5840 tidak membandingkan koordinat apa pun. Ia memanggil
`POINT(38,21)` — **membaca warna piksel di titik bidik** — dan menganggap
kena kalau warnanya 3, warna Bintang Kematian. Tabrakan diuji dengan bertanya
kepada *layar*, bukan kepada model dunia.

Itu masuk akal sekali di mesin tanpa memori untuk menyimpan model apa pun:
gambarnya *adalah* keadaannya. Tapi konsekuensinya nyata — kalau ada benda
lain berwarna 3 yang kebetulan menutupi titik itu, torpedonya kena.

Dua hal lain di potongan yang sama:

- **Urutan 5820 lalu 5830.** Torpedonya dikurangi **sebelum** jaraknya
  diperiksa. Menembak dari luar jangkauan tetap menghabiskan satu dari tiga
  butir. Itu bukan salah ketik; itu urutan barisnya.
- **Baris 5850.** Di skill 0, torpedo yang tepat sasaran menang **tanpa
  lemparan dadu**. Manualnya (baris 7880) menulis *"skill level 0 provides the
  best chance of hitting the Death Star"* — benar, tapi tidak menyebut bahwa
  peluangnya seratus persen.

---

## 6 · Hanya ada satu cara menang

Saya sempat menulis port yang keliru di sesi ini: tiga sasaran, hancurkan
ketiganya. Itu bukan permainan ini.

- **Bintang Kematian (`O`)** datang dari 70.000–102.000 km (baris 2050).
  Satu-satunya kemenangan adalah torpedo ke arahnya, dan hanya kalau
  `O-S <= 10000` **dan** ia benar-benar berada di bawah titik bidik.
- **Pesawat Imperial (`G`)** dan **Darth Vader (`J`)** tidak bisa dihabisi.
  Ditembak pun jaraknya cuma ditambah 25.000 dan posisinya diacak ulang
  (baris 3550/3560 dan 4730/4740). Meriam hanya menunda.
- **Menabrak Bintang Kematian** = `CRASH`, dan teksnya pantas dikutip:
  *"you did not even scratch the Death Star's paint, but you are dead"*
  (6660–6700).
- **Waktu habis** = `TOO LATE!`, dan *"Darth Vader is laughing at you."*

Jadi ia bukan permainan menembak melainkan **perlombaan**: sampai ke jarak
tembak sebelum waktunya habis, tanpa terlalu cepat sehingga melewati — lalu
menabrak — sasarannya.

`G` mulai di **25.000 tepat**, bukan angka acak. Dua yang lain acak. Pesawat
Imperial selalu datang lebih dulu, selalu pada jarak yang sama, di semua
permainan.

---

## 7 · Satu angka yang mengubah empat hal

```basic
1920  LOCATE 17,1:PRINT "SELECT SKILL LEVEL FROM 0 TO 3"
2110  IF SKILL=0 THEN A1=5:A2=0:BYPASS=3
2120  IF SKILL=1 THEN A1=3:A2=0:BYPASS=2
2130  IF SKILL=2 THEN A1=2:A2=45:BYPASS=1
2140  IF SKILL=3 THEN A1=2:A2=30
```

`SKILL` mengubah empat hal sekaligus:

| | batas waktu | BYPASS | selamat dilewati pesawat | selamat dilewati Vader | torpedo kena |
|---|---|---|---|---|---|
| 0 | 5:00 | 3 | 90% | 80% | **100%** |
| 1 | 3:00 | 2 | 80% | 70% | 70% |
| 2 | 2:45 | 1 | 70% | 60% | 60% |
| 3 | 2:30 | **0** | 60% | 50% | 50% |

`BYPASS` untuk SKILL 3 **tidak pernah ditetapkan**, jadi ia tetap 0 — nilai
bawaan peubah BASIC. Baris 2140 memang berhenti di `A2=30`. Akibatnya di
tingkat tersulit musuhnya mengelak **setiap putaran**, dan itu didapat bukan
dengan menulisnya melainkan dengan tidak menulisnya.

Ketiga persentase itu diperiksa dengan menjalankan port ini 200 kali per
kotak (§12): 10,0% / 41,0% / 20,5% / 51,5% terhadap harapan 10 / 40 / 20 /
50%.

---

## 8 · Satu pencacah, dua gerbang

```basic
2880  IF FLAG2<>BYPASS THEN FLAG2=FLAG2+1:GOTO 2910   ' pesawat Imperial
2890  FLAG2=0
2900  E=E+INT(RND*5)-2:F=F+INT(RND*5)-2
...
3950  IF FLAG2<>BYPASS THEN FLAG2=FLAG2+1:GOTO 3980   ' Darth Vader
3960  FLAG2=0
3970  H=H+INT(RND*5)-2:I=I+INT(RND*5)-2
```

`FLAG2` yang sama dipakai dua kali dalam satu putaran gelung: sekali untuk
mengatur seberapa sering pesawat Imperial mengelak, sekali lagi untuk Vader.
Yang di depan sudah mengubah pencacahnya sebelum yang di belakang membacanya,
jadi gerak mengelak keduanya **saling mengunci** — tidak pernah bebas satu
sama lain. Bintang Kematian punya pencacah sendiri (`FLAG1`), jadi ia satu-
satunya yang mengelak menurut jadwalnya sendiri.

Ini **dipertahankan apa adanya** di port ini, sesuai keputusan (c) di
[`PLAN.md`](../PLAN.md) §9: aturan mainnya dipertahankan persis, dan yang
bukan jelas-jelas bug tidak diperbaiki — hanya dicatat.

Di dekatnya ada asimetri kedua yang lebih sunyi. Penjepit tepi bawahnya
berbeda: Bintang Kematian dibatasi `N>35` (baris 2590), kedua pesawat
dibatasi `F>37` (2950) dan `I>37` (4020). Dua batas bawah yang berbeda, di
layar yang sama.

---

## 9 · Jam dinding, bukan hitungan putaran

```basic
2290  SEC1=VAL(RIGHT$(TIME$,2))
5200  SEC2=VAL(RIGHT$(TIME$,2))
5250  A2NEW=A2-(SEC2+(60*N8)-SEC1)
5260  IF A2NEW<0 THEN A2NEW=A2NEW+60:A1=A1-1:A2=A2+60
5270  IF A1<0 GOTO 6760
```

Batas waktunya **detik sungguhan**, dibaca dari `TIME$`. Hampir semua program
lain di koleksi ini mengukur waktu dengan menghitung putaran gelung — dan
itulah sebabnya mereka jadi tak terpakai begitu prosesornya makin cepat.
Program **tertua** di koleksi justru yang tidak melakukannya.

Sementara itu jaraknya tetap dihitung per putaran: `S=S+Q*100` di baris 5170.
Jadi dua satuan berjalan berdampingan — kilometer per putaran, detik per
detik — dan yang menyambungkan keduanya cuma satu baris:

```basic
2440  SOUND 37*Q,1
```

Deru mesin sepanjang **satu centang** (1/18,2 detik), yang nadanya kebetulan
juga **kecepatan Anda sendiri**. Ia hiasan, jam, dan papan instrumen
sekaligus. Di [LANDER](lander.md) bunyi jadi pengatur waktu; di sini ia jadi
pengatur waktu *dan* penunjuk keadaan.

---

## 10 · Kotak bidik yang tumbuh, dan dua asimetri yang searah

```basic
2090  IMX=38:IMY=21:IMR1=1:IMR2=1
2860  IF G-S<20000 AND IMPFIGH2=0 THEN ... IMX=37:IMY=20:IMR1=2:IMR2=2
2870  IF G-S<10000 AND IMPFIGH3=0 THEN ... IMX=35:IMY=19:IMR1=4:IMR2=3
5420  IF G-S<26000 AND ABS(IMX-E)<IMR1 AND ABS(IMY-F)<IMR2 GOTO 5450
```

Kotak bidiknya **membesar sendiri** saat musuh mendekat: 1×1, lalu 2×2, lalu
4×3. `IMX`/`IMY` bergeser bersamanya (38→37→35, 21→20→19) karena `PUT`
menempatkan sprite dari sudut kiri-atas, dan pergeserannya persis setengah
lebar sprite yang baru — 7×5 berpusat di titik bidik saat `IMX=35, IMY=19`.

Perhatikan yang terakhir: **4×3**, lebih lebar daripada tinggi. Dan kemudinya
juga:

```basic
1100  V=V-1:IF V<-3 THEN V=-3      ' tegak   -3..3
1120  W=W-1:IF W<-5 THEN W=-5      ' mendatar -5..5
```

Dua asimetri yang berdiri sendiri, keduanya menghadap arah yang sama:
pesawatnya lebih lincah ke samping, dan kotak bidiknya lebih longgar ke
samping. Tidak ada satu pun kalimat di layar yang menyebut keduanya. Di port
ini keduanya **digambar**: kotak bidiknya digambar sebesar `IMR1`×`IMR2` yang
sebenarnya diuji baris 5420, dan garis acuan kemudi bergeser 22 piksel per
langkah sehingga batas −3..3 dan −5..5 terlihat sebagai jarak, bukan angka.

---

## 11 · Enam penangan kejadian

```basic
1320  ON KEY(1) GOSUB 5350:ON KEY(2) GOSUB 5750:ON KEY(11) GOSUB 1100:
      ON KEY(12) GOSUB 1120:ON KEY(13) GOSUB 1140:ON KEY(14) GOSUB 1160
1180  KEY(1) ON:KEY(2) ON:KEY(11) ON: ...
1190  KEY(1) STOP:KEY(2) STOP:KEY(11) STOP: ...
```

F1 dan F2 untuk senjata, KEY 11–14 untuk keempat panah. Satu-satunya program
di koleksi yang memakai **interupsi tombol** untuk kemudi *sekaligus* senjata
— dan yang rajin menyalakan serta mematikannya di sekitar bagian yang tidak
boleh diganggu (1180 dan 1190 dipanggil sebagai subrutin berpasangan di
sepanjang gelung utama).

Kecepatannya tidak lewat `ON KEY` melainkan lewat `INKEY$` biasa:

```basic
5160  IF VAL(Z$)>0 AND VAL(Z$)<10   THEN  Q=VAL(Z$)
```

Angka 1–9, diketik begitu saja. Di port ini tombol angkanya tetap bekerja,
dan tombol `± Mach` ditambahkan untuk yang memakai tetikus.

---

## 12 · Bagaimana port ini diperiksa

Semua di bawah ini dijalankan di dalam halaman, terhadap mesin yang sama yang
dipakai bermain — bukan terhadap salinan terpisah.

**Aturan pasti (18 uji).** Batas waktu keempat tingkat; keadaan awal
(`G`=25.000 tepat, `J` di 40.000–72.000, `O` di 70.000–102.000, `Z`=3, `Q`=5,
kotak bidik 1×1); meriam tidak pernah menyentuh Bintang Kematian walaupun ia
tepat di bawah bidikan pada jarak 5.000; meriam kena tepat di tengah kotak
lalu `G` naik 25.000 dan kotaknya kembali 1×1; **tepi kotak meleset** —
`|IMX−E| = IMR1` tidak lolos karena ujinya `<`, bukan `<=`; torpedo di luar
jangkauan tetap mengurangi `Z`; torpedo di dalam jangkauan tapi bukan di bawah
bidikan meleset.

**Peluang (1.800 percobaan).** Torpedo tepat sasaran di skill 0 menang
**50 dari 50** kali. Di skill 3 menang 199 dari 400 (49,8%; harapan 50%).
Dilewati pesawat Imperial: mati 20/200 di skill 0 (10,0%; harapan 10%) dan
82/200 di skill 3 (41,0%; harapan 40%). Dilewati Vader: 41/200 (20,5%;
harapan 20%) dan 103/200 (51,5%; harapan 50%).

**Ambang tahap.** Jejak `G-S` per putaran: 21000, 20500, 20000, 19500 → dan
tahap 2 muncul tepat pada 19500, bukan pada 20000. Ujinya `<20000`, dan
19500-lah nilai pertama yang memenuhinya. Percobaan pertama saya gagal di
sini karena saya menjalankan gelungnya tiga putaran, satu kurang.

**Kemudi.** Sembilan tekan ke tiap arah, lalu dua puluh ke arah balik:
−5/5 mendatar, −3/3 tegak.

**Semua akhir.** `CRASH`, `TOO LATE!`, `BLAM!`, `BOOM!`,
`DEATH STAR DESTROYED`.

**Sebelum halaman dibuka:** pemeriksa `id` ganda dan rujukan `url(#…)` yatim
di ketiga berkas. 36 `id`, tidak ada yang kembar, tidak ada yang yatim, dan
tidak ada `q('…')` tanpa elemen. Pelajaran sesi 28 dan 29 tidak terulang.

**Luber mendatar** diukur pada sepuluh lebar dari 1400 sampai 320 piksel.
Tidak ada satu pun elemen yang melebihi wadahnya, kecuali `<summary>` yang
selalu 2 piksel lebih lebar di seluruh proyek.

---

## 12a · Layar itu bukan jendela — programnya menyebutnya radar

Temuan ini muncul belakangan, sesudah portnya sudah berbentuk, dan ia
membantah salah satu keputusan saya sendiri.

Kotak grafiknya (`2160 LINE (1,1)-(76,42),3,B`) saya perlakukan sebagai
**jendela kokpit**: saya pasang rangka kanopi, kaca, dan — saat menabrak —
kaca yang pecah. Programnya menyebut benda itu **empat kali**, dan tidak
sekali pun menyebutnya jendela:

```basic
2230  LOCATE 17,1:PRINT "RADAR TARGETS"
7490  PRINT"ON THE RADAR SCREEN."
7570  PRINT"HAIRS ON YOUR RADAR SCREEN. THEN YOU MAY";
7660  PRINT"THE  CROSS HAIRS  ON YOUR  RADAR SCREEN.";
```

Itu **layar radar**. Titik 1×1 sampai 7×5 piksel itu **kontak radar**, bukan
pesawat yang terlihat mata. Dan itu menerangkan banyak hal yang tadinya
tampak seperti kekurangan: kenapa musuhnya sekecil itu, kenapa bidikannya
digambar sebagai garis putus-putus menyilang layar (2170–2180), dan kenapa
menabrak Bintang Kematian tidak memerlukan gambar apa pun — di radar,
tabrakan adalah sebuah angka yang mencapai nol.

Yang menarik, aslinya sudah memisahkan **dua lapis** dengan rapi:

| lapis | di aslinya | tugasnya |
|---|---|---|
| instrumen | kotak radar + angka HUD | tempat keputusan diambil |
| dunia yang dibayangkan | layar judul (legenda `DRAW`) + animasi lintas IM4–IM8 | tempat abstraksinya pecah dan bendanya jadi nyata |

Animasi lintas lima bingkai itu bukan hiasan — itu **satu-satunya saat
program membiarkan Anda melihat lawan Anda**, dan nilainya justru datang dari
kelangkaannya.

**Port ini menggabungkan keduanya, dan itu keputusan sadar.** Ditanyakan
langsung ke pemilik proyek, dan jawabannya "permainan yang enak dimainkan
lebih dulu" — jadi kokpitnya tetap, kapal SVG-nya tetap, kaca pecahnya tetap.
Yang tidak boleh terjadi adalah penyimpangan itu lewat tanpa disebut, karena
ia menyatakan sesuatu yang **dibantah sumbernya sendiri**: bahwa Anda sedang
melihat ke luar, padahal Anda sedang melihat ke sebuah alat.

Satu utang itu dibayar sebagian oleh **jalur pendekatan** (§13 butir 4): ia
instrumen, dan ia memang radar — cuma diletakkan di bawah kokpit alih-alih
menggantikannya.

---

## 13 · Penyimpangan, disebut satu per satu

Sesuai syarat yang Anda tetapkan di [`PLAN.md`](../PLAN.md) §9a, tiap
penyimpangan disebut, bukan disamarkan sebagai keharusan teknis.

1. **Ketiga musuhnya digambar sebagai SVG, bukan sebagai piksel yang
   dipulihkan.** Ini penyimpangan terbesar di halaman ini, dan diminta
   langsung: satu piksel bukan pesawat, ia titik, dan menaikkan peta 7×5
   sampai selebar layar cuma menghasilkan kotak besar. Yang **tidak** berubah
   adalah letaknya, ketiga tahapnya, dan uji kenanya — semuanya tetap
   dihitung pada petak BASIC yang sama.

   Bentuknya pun tetap terikat pada temuan §1: TIE Imperial mengikuti `IM3`
   (bilah tegak, penghubung mendatar), dan **TIE Advanced mengikuti `DV3`**,
   yang keempat sudutnya dipangkas sehingga sayapnya menyempit ke arah
   lambung — bentuk TIE Advanced yang sebenarnya. Perbedaan yang Blank
   nyatakan di dalam tujuh kali lima piksel dinyatakan ulang lebih leluasa,
   tapi ia perbedaan yang sama.

   Lebar gambarnya diambil dari **kotak bidiknya** (`2×IMR1` petak, kotak yang
   benar-benar diuji baris 5420), bukan dari lebar spritenya. Akibatnya lebar
   kapal di layar sama persis dengan lebar daerah yang bisa dikenai meriam —
   tidak ada pemain yang menembak benda yang tampak berada di dalam kurung
   lalu diberitahu bahwa ia meleset. Untuk Bintang Kematian lebarnya diambil
   dari petaknya sendiri, karena petak itulah yang diuji `POINT(38,21)`.

   Kesepuluh peta piksel aslinya tetap dipajang di halaman sebagai barang
   bukti, dengan ukuran dan ambang jaraknya.
2. **Pelurunya digambar.** Aslinya tidak ada peluru sama sekali. Yang
   menandai tembakan cuma sapuan bunyi 5380–5400 ditambah
   `PUT (2,2),LASAR` — sebuah larik **382 bilangan** yang dipasang di baris
   5370 lalu **dilepas lagi** di 5410 (`PUT` bawaannya XOR), yaitu satu
   kilatan di pojok kiri-atas layar. Jadi seluruh umpan baliknya adalah
   sebuah kilatan di sudut dan sebuah suara.

   Itu tidak cukup untuk dipahami sekarang: tanpa peluru yang terbang,
   "kena" dan "meleset" cuma dua baris teks yang berbeda. Maka pelurunya
   digambar — empat larik merah dari ujung sayap untuk meriam, satu butir
   torpedo dari bawah kanopi — dan digambar **jujur**: ia terbang ke benda
   yang memang akan meledak kalau kena, dan lewat menembus titik bidik kalau
   tidak. Yang menentukan tetap baris 5420/5430 dan 5830–5870, tidak
   berubah sedikit pun.

   Satu hal yang justru **lebih setia** daripada versi sebelumnya:
   **dunianya berhenti selama peluru terbang.** 5350 dan 5750 adalah
   subrutin yang dipanggil dari `ON KEY`, jadi gelung utamanya memang
   tertahan sampai selesai, dan baris pertamanya (5360, 5760) mematikan
   tombol yang lain. Uji kenanya pun baru di 5420, **sesudah** bunyinya
   habis. Urutan "tembak, tunggu, baru ketahuan" itu urutan aslinya.
   Lamanya sedikit dilebihkan (0,42 dtk untuk meriam yang aslinya ~0,2 dtk
   bunyi; 1,0 dtk untuk torpedo yang aslinya ~1,4 dtk) supaya pelurunya
   sempat terbaca.
3. **Kaca kanopi pecah saat pesawatnya hancur.** Aslinya `CLS:PRINT "CRASH"`
   (6570) — layar dibersihkan, satu kata dicetak. Di sini akibatnya
   digambar: retak radial dan melingkar dari satu titik hantaman, dan
   Bintang Kematian memenuhi pandangan karena `O-S<=0` memang berarti Anda
   sudah sampai di permukaannya. Retaknya dibangkitkan dari **benih
   permainan**, bukan `Math.random`, jadi ia tidak berubah tiap penggambaran
   ulang dan benih yang sama memberi retak yang sama. Muncul untuk `CRASH`,
   `BLAM!`, dan `BOOM!` — **tidak** untuk `TOO LATE!`, karena di situ tidak
   ada yang menghantam apa pun.
4. **Jalur pendekatan — tambahan terbesar di halaman ini.** Aslinya ketiga
   jaraknya cuma tiga angka yang dicetak ulang tiap putaran (2380, 2400,
   2420). Itulah sebabnya permainan ini terasa mustahil: keterampilan
   sebenarnya adalah **mengatur kecepatan**, dan hubungan antara jarak,
   kecepatan, dan waktu tidak pernah diperlihatkan di mana pun.

   Strip di bawah kokpit menaruh ketiganya di satu garis, dengan pita untuk
   ambang 26.000 (meriam, 5420) dan 10.000 (torpedo, 5830), plus dua angka
   turunan: **detik-menuju-tiba** dan **lebar jendela tembak**. Keduanya
   dihitung dari `S = S + Q*100` per putaran pada 18,2 putaran per detik —
   nol aturan baru. Pada Mach 50 jendelanya **1,1 detik**; pada Mach 10,
   **5,5 detik**. Angka itu sendiri sudah menerangkan seluruh permainannya,
   dan sebelumnya tidak ada di mana pun.
5. **Kunci sasaran diperlihatkan.** `TORPEDO LOCK` dan `GUNS LOCK` memakai
   uji yang **sama persis** dengan 5420/5430 dan 5830+5840, hanya tanpa
   menembak. Aslinya keadaan ini tidak pernah ditampilkan — Anda baru tahu
   sesudah menembak dan kehilangan satu dari tiga torpedo.
6. **Tombol senjata dipindah ke `Z` dan `X`, tombol pusatkan (`0`/`C`), dan
   tekan-tahan.** Aslinya F1 dan F2 (`ON KEY(1)`, `ON KEY(2)` di 1320).
   Keduanya masih bekerja, tapi tidak lagi jadi tombol utama, dan itu **hasil
   laporan pemain**: Spasi dan Enter — alias yang saya pilih lebih dulu —
   ternyata tidak menembak. Sebabnya dua penjaga yang saya pasang sendiri, dan
   keduanya bukan salah tafsir melainkan **salah syarat yang saya uji**:

   - Penjaga pertama melepas Enter/Spasi untuk **setiap** tombol yang sedang
     fokus. Sesudah mengklik tombol mana pun dengan tetikus, fokus memang
     tinggal di situ — jadi menyentuh satu tombol saja sudah mematikan kedua
     senjata. Saya bahkan sempat menulis uji "Spasi saat fokus di tombol TIDAK
     menembak" dan menyatakannya lulus. Sekarang pelepasan itu hanya berlaku
     kalau fokusnya memang **dititi dengan Tab**.
   - Penjaga kedua mengukur apakah **`#kokpit`** terlihat. Tombol-tombolnya ada
     jauh di bawah kokpit, jadi di layar yang tidak terlalu tinggi pemain harus
     menggulir untuk mencapainya, kokpitnya keluar layar, dan sejak itu seluruh
     papan ketik lepas dari permainan — **panahnya jadi seolah tidak
     berfungsi**, persis seperti yang dilaporkan. Sekarang yang diukur seluruh
     panel permainan.

   Dan Spasi/Enter memang pilihan yang buruk sejak awal: keduanya punya tugas
   bawaan di peramban, yaitu menekan kontrol yang sedang fokus. `Z` dan `X`
   tidak punya arti apa pun di peramban.

   Tombol pusatkan bukan aturan baru: `W` dan `V` adalah **kecepatan geser**,
   bukan posisi (2550: `M = M - W`), jadi untuk berhenti melayang Anda harus
   menekan panah lawan sebanyak tekanan tadi. Menolkan keduanya memberi hasil
   yang sama persis. `0` aman dipakai karena 5160 berbunyi `IF VAL(Z$)>0 AND
   VAL(Z$)<10` — nol tidak pernah jadi kecepatan.
7. **Tangga kemudi, panah arah medan, dan penanda mentok di tepi.**
   Pemain melaporkan bahwa panah kiri dan kanan "arahnya sama saja". Diukur,
   **arahnya benar berlawanan**: dengan benih yang sama, sepuluh putaran ke
   kiri memindahkan sasaran 38 → 48 dan sepuluh putaran ke kanan 38 → 28 —
   simetris sempurna, dan begitu pula tegaknya.

   Yang tidak terbaca bukan arahnya melainkan **akibatnya** — dan sebabnya
   ternyata kekeliruan saya sendiri di tempat lain: **laju gelungnya**.
   Lihat butir 14. Pada 18,2 Hz, kemudi `W`=1 menyeret medan ke tepi dalam
   **1,8 detik** dan menghabiskan **65%** dari lima detik berikutnya terkurung
   di sana; pada `W`=3, **0,6 detik** dan **89%**. Sesudah lajunya dikoreksi ke
   6 Hz: `W`=1 jadi **5,5 detik** dan 47%. Baris 2560–2590 memang menjepit
   sasaran ke petak 2..69 — itu aslinya — tapi kecepatan menabraknya bukan.

   Aturannya tidak disentuh. Yang ditambahkan tiga penanda: tangga kemudi yang
   berubah seketika (sebelas takik mendatar, tujuh tegak — batas tak
   simetrisnya jadi terlihat), **panah arah** yang menyatakan ke mana medannya
   bergeser (berlawanan dengan tombol, karena `M = M - W`), dan **segitiga di
   tepi layar** untuk tiap sasaran yang sedang terjepit di sana.

   Satu cacat kecil dalam pengerjaannya layak dicatat: segitiga itu semula
   ditutup dengan dua belokan siku, dan yang keluar **persegi panjang** —
   sebuah penanda arah yang tidak menunjuk ke mana pun. Hanya ketahuan dengan
   melihatnya.
8. **Satu kalimat post-mortem di tiap akhir**, dihitung dari keadaan akhir.
   Ejekan aslinya (*"Darth Vader is laughing at you."*) tetap di tempatnya;
   yang ini di sebelahnya, dan tugasnya menerangkan.
9. **Cincin kontak untuk sasaran jauh.** Lambung kapalnya kelabu gelap dan
   pada ukuran terjauh (30 satuan) ia lenyap ke dalam medan bintang. Aslinya
   tidak punya masalah ini: satu pikselnya digambar dengan warna CGA penuh.
   Cincinnya hilang sendiri begitu kapalnya cukup besar untuk dikenali.
10. **Animasi lintas membesar menerus**, bukan lima bingkai. IM6, IM7, IM8
   tidak dipakai; alasannya di §4. IM7 tetap dipajang sebagai barang bukti.
11. **Pesawat pemainnya digambar tangan.** Di seluruh 732 baris tidak ada satu
   pun sprite X-Wing — layarnya pandangan dari kokpit. Jadi tidak ada piksel
   yang bisa dipulihkan. Gambar SVG-nya memenuhi janji yang ditulis di
   [`svg-demo.html`](../svg-demo.html) sejak fondasi dibangun.
12. **Rangka kanopi ditambahkan — dan sumbernya menyebut layar itu RADAR,
    bukan jendela.** Ini penyimpangan yang paling perlu dibaca bersama
    [§12a](#12a--layar-itu-bukan-jendela--programnya-menyebutnya-radar):
    aslinya tidak menggambar kokpit sama sekali, tapi ia juga tidak
    menggambar apa pun selain HUD — dan "layar hitam kosong" bukan kesetiaan,
    itu kekosongan. Rangkanya hiasan; tidak ada aturan yang bergantung
    padanya. Yang tidak boleh terjadi adalah ia lewat tanpa disebut, karena
    ia menyatakan sesuatu yang dibantah sumbernya sendiri.
13. **`POINT(38,21)=3` dinyatakan ulang sebagai pertanyaan tentang petak.**
   Port ini tidak punya penyangga piksel untuk dibaca, jadi ujinya berbunyi
   "apakah petak (38,21) bagian dari gambar Bintang Kematian". Setara untuk
   semua keadaan yang bisa dicapai permainan ini, tapi tidak sama persis: di
   aslinya benda lain berwarna 3 juga akan lolos.
14. **Laju gelung dipatok 6 Hz** lewat `_shared/loop.js` — dan angka ini
    sudah salah sekali.

    Versi pertama memakai **18,2 Hz** dengan alasan `SOUND 37*Q,1` di baris
    2440 menahan satu centang (1/18,2 detik). Itu keliru: satu centang adalah
    **lantai**, bukan lajunya. Satu putaran gelung utama aslinya mengerjakan
    jauh lebih banyak — delapan pasang `LOCATE`+`PRINT` (2340–2430), dua
    `PUT`, dua GOSUB berisi enam `KEY ... ON/STOP` (1180/1190), tiga blok
    musuh dengan `PUT`-nya masing-masing, `INKEY$`, dan dua pembacaan
    `TIME$`. Di BASICA yang ditafsirkan pada 4,77 MHz, kerja itu yang
    menentukan.

    Akibatnya dilaporkan pemain: permainannya bukan sulit, ia **tak
    terkendali**. Lajunya tidak bisa saya ukur — itu perlu menjalankan
    DOSBox, dan itu di luar batas proyek. Yang bisa dilakukan: mencari laju
    yang membuat angka-angka programnya sendiri membentuk permainan utuh.

    | Hz | dekat Mach 90 | dekat Mach 50 | bidik Mach 10 | medan W=1 | medan W=5 |
    |---|---|---|---|---|---|
    | 18,2 | 4,6 dtk | 8,4 dtk | 5,5 dtk | 1,9 dtk | 0,4 dtk |
    | 9 | 9,4 dtk | 16,9 dtk | 11,1 dtk | 3,8 dtk | 0,8 dtk |
    | **6** | **14,1 dtk** | **25,3 dtk** | **16,7 dtk** | **5,7 dtk** | **1,1 dtk** |
    | 3 | 28,1 dtk | 50,7 dtk | 33,3 dtk | 11,3 dtk | 2,3 dtk |

    Pada 6 Hz semuanya masuk akal sekaligus, dan 6 Hz kebetulan juga sekitar
    100–170 ms per putaran — sesuai perkiraan kerja BASICA di atas. Dua
    alasan yang tidak bergantung satu sama lain menunjuk ke tempat yang sama.

    Ini tetap **penyimpangan, bukan pemulihan**: aslinya tidak punya laju
    tetap sama sekali, ia berbeda di tiap mesin, dan itulah cacat seluruh
    generasi permainan ini — lihat [`_fondasi.md`](_fondasi.md) §2.2. Yang
    berubah cuma pilihan angkanya, dari yang mustahil ke yang bisa
    dipertanggungjawabkan.

    Angka "jendela tembak" di layar pembuka kini **dihitung** dari `HZ`, bukan
    ditulis tangan — begitu lajunya dikoreksi, dua angka yang ditulis di HTML
    langsung jadi bohong tanpa ada yang memberi tahu.
15. **Skor ditambahkan.** Aslinya **tidak ada skor sama sekali** — menang atau
   tidak, itu saja. Angka di port ini (sisa waktu dan torpedo, dikali tingkat
   kesulitan) sepenuhnya tambahan, dan ditandai begitu.
16. **Deru mesin dijarangkan** jadi sekali per 0,7 detik, bukan tiap putaran.
   Nadanya tetap `37×Q`.
17. **Teks layar tetap Inggris** sesuai keputusan (b) di
   [`PLAN.md`](../PLAN.md) §9: `OUT OF RANGE`,
   `TORPEDO MISSED`, `CRASH`, `TOO LATE!`, `BLAM!`, `BOOM!`.

---

## 14 · Semua yang sudah kita kenali, sudah ada di sini

| di XWING (1978) | pertama kali kita catat di |
|---|---|
| `POKE &H410` memaksa mode video (1070) | [DRAW](draw.md), sesi 26 |
| `RANDOMIZE(VAL(RIGHT$(TIME$,2)))` — 60 benih (1310) | [WILDCAT](wildcat.md) dan 27 lainnya |
| bunyi sebagai pengatur waktu | [LANDER](lander.md), sesi 20 |
| sprite sebagai data mentah | [LANDER.BIN](lander.md), sesi 20 |
| sapuan frekuensi untuk senjata | [STARTREK](startrek.md), sesi 28 |
| `PLAY "P…"` sebagai jeda animasi | [LANDER](lander.md), [STARTREK](startrek.md) |
| komentar yang lebih jujur daripada dokumennya | [STARTREK](startrek.md) |

Selama tiga puluh sesi kita menyebut hal-hal ini "temuan". Ternyata semuanya
sudah terbentuk sebelum IBM PC ada, dan berpindah ke sana **bersama
orang-orangnya** — Smith dan Rogers membawa kebiasaan 1978 ke mesin 1982, dan
kebiasaan itulah yang kita temukan lagi dan lagi di tiga puluh program
berikutnya.

Yang benar-benar milik XWING sendiri cuma dua, dan keduanya tidak muncul di
program mana pun lagi: **gambar yang disimpan sebagai makro `DRAW` lalu
dipotong dari layar judulnya sendiri**, dan **tabrakan yang diuji dengan
membaca warna piksel**.

---

## 15 · Latihan

1. Baris 5840 memakai `POINT(38,21)` untuk menguji tabrakan. Sebutkan satu
   keadaan di mana uji itu memberi jawaban yang salah, dan terangkan kenapa
   keadaan itu tidak pernah tercapai di program ini.
2. `BYPASS` tidak pernah ditetapkan untuk SKILL 3. Apa yang akan berubah kalau
   baris 2140 ditutup dengan `:BYPASS=1`? Jawab dengan menyebut baris mana
   yang membacanya.
3. Torpedo dikurangi di 5820, jangkauannya diperiksa di 5830. Tukar kedua
   baris itu. Apa yang berubah bagi pemain, dan apakah itu membuat
   permainannya lebih mudah atau lebih sulit?
4. §4 menunjukkan IM8 membutuhkan 207 bita tapi hanya diberi 206. Ajukan dua
   penjelasan yang berbeda untuk selisih itu, lalu sebutkan pemeriksaan apa
   yang bisa memisahkan keduanya.
5. Permainan ini punya dua satuan waktu: detik jam dinding untuk batas waktu,
   dan putaran gelung untuk jarak. Di mesin yang dua kali lebih cepat, mana
   yang berubah dan mana yang tidak — dan apa akibatnya bagi tingkat
   kesulitannya?
