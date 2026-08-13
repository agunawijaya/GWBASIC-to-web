# ELIZA — kata kuncinya bukan kata, melainkan siapa yang mengatakannya

> Port web: [`web/games/eliza/`](../games/eliza/index.html) ·
> Sumber: [`run/ELIZA.BAS`](../../run/ELIZA.BAS) (514 baris) +
> [`run/WRTSTR.BAS`](../../run/WRTSTR.BAS) (17 baris) +
> [`run/STRINGS.FIL`](../../run/STRINGS.FIL) (1.275 bita) ·
> Analisis BASIC: [`reviews/ELIZA.md`](../../reviews/ELIZA.md) ·
> [`reviews/WRTSTR.md`](../../reviews/WRTSTR.md)

*Eliza — Version 3.0. Copyright (C) 1981 by Steve Grumette.* Satu-satunya
program di koleksi yang **seluruh perilakunya dibaca dari berkas di luar
dirinya**. 514 baris, 82 subrutin, 113 `GOSUB`, 121 `GOTO`, dan 47 tabel
`ON…`.

Dua dari angka itu tertinggi di koleksi, dan dua tidak — perbedaannya
menerangkan bentuk programnya:

| | ELIZA | tertinggi di koleksi |
|---|--:|---|
| subrutin | **82** | **ELIZA** (berikutnya `MENU2`, 66) |
| tabel `ON…GOTO`/`GOSUB` | **47** | **ELIZA** — lebih dari dua kali lipat `TEMPLE` (20) |
| `GOSUB` | 113 | `MENU2` (179) |
| `GOTO` | 121 | `TEMPLE` (255), lalu `WIZARD` (224) |
| baris | 514 | `TEMPLE` (1.187) |

Jadi ELIZA bukan program terpanjang maupun yang paling banyak melompat. Yang
membuatnya menonjol adalah **kepadatan percabangan berindeks**: 47 tabel
`ON…`, tiga kali lipat program mana pun. Itu tanda arsitektur yang
digerakkan tabel, bukan alur kendali yang kusut — dan justru karena itulah
`reviews/ELIZA.md` keliru menyebut 121 `GOTO`-nya "tertinggi di koleksi"
(lihat §7).

Ini juga satu-satunya pasangan di koleksi yang **pembangkit dan hasilnya
sama-sama selamat**: `WRTSTR.BAS` menulis `STRINGS.FIL`, `ELIZA.BAS`
membacanya, dan ketiga berkasnya masih ada. Halaman portnya karena itu
**menjalankan pembangkitnya**, bukan menyalin hasilnya — dan hasilnya cocok
bita demi bita, 1.275 bita termasuk penanda EOF `Ctrl-Z`.

---

## 1 · Dua penjaga untuk satu masalah, dan umurnya berbeda

Kaidah sulih nomor 12 dan 13 di `STRINGS.FIL` berbunyi:

```
" I "," YOU ",3,5
" YOU "," I ",5,3
```

Keduanya dijalankan berurutan atas kalimat yang sama (baris 420–450). Tanpa
penjaga, kaidah kedua **membatalkan** yang pertama: *I HATE YOU* akan jadi
*I HATE I*. Diperiksa dengan melepas penjaganya:

| masukan | hasil akhir (asli) | penjaganya dilepas |
|---|---|---|
| `I HATE YOU` | `YO␀U HATE I` | `I HATE I` |
| `MY DOG BIT ME` | `YOUR DOG BIT YOU` | `MY DOG BIT YOU` |

*(Kolom tengah adalah keadaan sesudah baris 480 memulihkan `*` jadi `Y`.
Panel "Di balik layar" sengaja memperlihatkan langkah **sebelum** itu —
`*OUR DOG BIT YOU` — supaya kedua penjaga terlihat sekaligus, lalu langkah
berikutnya memperlihatkan bintangnya sudah hilang sementara `␀` masih ada.)*

Program ini punya **dua** penjaga, dan bedanya bukan gaya melainkan **umur**:

| penjaga | dipasang di | dibuang di | bertahan sampai |
|---|---|---|---|
| `*` | `DATA` di WRTSTR (`MY,*OUR`) | baris 470–480 | **sebelum** penyapuan kata kunci |
| `CHR$(0)` | baris 180 / 200 / 230 di ELIZA | baris 4600–4605 | **sesudah** penyapuan kata kunci |

```basic
 180 RW$(12)=" YO"+CHR$(0)+"U ":RW$(21)=" AR"+CHR$(0)+"E "
 230 K$(22)=" AR"+CHR$(0)+"E ":K$(43)=" YO"+CHR$(0)+"U "
 480 A=INSTR(B,A$,"*"):IF A<>0 THEN MID$(A$,A)="Y":B=A+1:GOTO 480
4600 ZZ=INSTR(B$,CHR$(0))
4605 IF ZZ THEN B$=LEFT$(B$,ZZ-1)+MID$(B$,ZZ+1):GOTO 4600
```

Perbedaan umur itulah temuan utamanya. Karena `CHR$(0)` bertahan melewati
penyapuan, ia bukan sekadar penjaga — ia **satu bit informasi tambahan yang
ikut dicocokkan**. Dua kata kunci membawanya, dan dua lagi bekerja justru
karena **tidak** membawanya:

| kaidah sulih | kata kunci | penangan | yang dicocokkan |
|---|---|---|---|
| `I → YO␀U` | `K$(43) = " YO␀U "` | 1280 | apa yang **Anda** sebut "I" |
| `YOU → I` | `K$(36) = " I "` | 1110 | apa yang **Anda** sebut "YOU" |
| `AM → AR␀E` | `K$(22) = " AR␀E "` | 990 | apa yang **Anda** sebut "AM" |
| *(tanpa kaidah)* | `K$(21) = " ARE "` | 960 | `ARE` yang Anda ketik sendiri |

Jadi `K$(21)` dan `K$(22)` adalah **kata yang sama persis** di layar,
dibedakan hanya oleh satu bita tak terlihat, dan dikirim ke dua penangan yang
berbeda. Hasilnya simetri yang bersih:

| Anda ketik | jawaban Eliza | lewat |
|---|---|---|
| `I AM SAD` | I AM SORRY TO HEAR YOU ARE SAD. | K$(43) → 1280 |
| `YOU ARE SAD` | WHAT MAKES YOU THINK I AM SAD? | K$(36) → 1110 |
| `AM I CRAZY` | DO YOU BELIEVE YOU ARE CRAZY? | K$(22) → 990 |
| `ARE YOU CRAZY` | WHY ARE YOU INTERESTED IN WHETHER I AM CRAZY OR NOT? | K$(21) → 960 |

Pasangan `MY`/`YOUR` **tidak** dapat perlakuan itu, karena `*` sudah hilang
sebelum penyapuan. Ketik *MY DOG AND YOUR CAT* di halaman portnya: keduanya
berakhir sebagai kata biasa (`YOUR DOG AND MY CAT`), dan tidak ada lagi yang
tahu mana yang mana.

> **Pelajarannya.** Nilai penanda (*sentinel*) tidak ditentukan oleh bentuknya
> melainkan oleh **berapa lama ia hidup**. `*` dan `CHR$(0)` memecahkan
> masalah yang sama; yang satu dibuang lebih awal dan karena itu hanya jadi
> penjaga, yang satu dibiarkan hidup dan karena itu jadi **data**. Pertanyaan
> yang sama muncul tiap kali kita menandai nilai yang sudah diproses: kapan
> tandanya dilepas?

---

## 2 · Satu gelung `FOR`, dua aturan prioritas

```basic
 570 A0=50:FOR Z=1 TO 44:A=INSTR(A$,K$(Z)):IF A=0 THEN 590 ELSE IF Z<21 THEN 620
 580 IF A<A0 THEN A0=A:Z0=Z
 590 NEXT Z
 600 IF A0<>50 THEN Z=Z0:A=A0:GOTO 620
```

Baca `IF Z<21 THEN 620` pelan-pelan. Untuk dua puluh kata kunci pertama, gelung
itu **langsung berangkat** ke tabel pengiriman pada kecocokan pertama: mereka
menang menurut **urutan daftar**. Untuk dua puluh empat sisanya, gelung itu
justru mencatat dan meneruskan: mereka menang menurut **posisi terkecil di
dalam kalimat**.

| kalimat | yang menang | kenapa |
|---|---|---|
| `I ALWAYS DREAM ABOUT COMPUTERS` | `COMPUTERS` = K$(2) | ada di dua puluh besar; `ALWAYS` (19) dan `DREAM` (11) kalah urutan meski lebih dulu muncul |
| `WHY DO YOU THINK SO` | `WHY` = K$(42) | ketiganya di luar dua puluh besar, dan `WHY` berdiri paling kiri |
| `YES I CAN` | `YES` = K$(26) | posisi 2, mengalahkan `CAN` (K$24) dan `YO␀U` (K$43) |

Dua aturan berbeda dalam satu gelung, tanpa satu pun komentar. Dan angka
**21** — batas antara keduanya — hanya ada di baris 570; `STRINGS.FIL` tidak
menyimpannya. Menyusun ulang daftar kata kunci di `WRTSTR.BAS` akan diam-diam
memindahkan garis itu, dan tidak ada apa pun di kedua berkas yang menyebutkan
ketergantungan tersebut.

---

## 3 · Slot kosong sebagai jalur ganti topik

Empat puluh enam keluarga jawaban memakai pola yang sama:

```basic
2680 XF=XF+1:IF XF=6 THEN XF=1
2690 ON XF GOTO 2700,2710,2720,2730,2740
2740 RETURN                    ' <- tidak menetapkan B$ sama sekali
 970 GOSUB 1580:GOSUB 2680:IF XF=5 THEN 1100 ELSE GOTO 4600
```

Perhatikan dua hal. Pertama, `IF XF=6 THEN XF=1` berarti daftarnya punya
**lima** tujuan, bukan enam — batasnya tidak pernah terpakai sebagai slot.
Kedua, tujuan kelima (`2740`) adalah `RETURN` telanjang: ia tidak menetapkan
jawaban apa pun. Pemanggilnya menguji nomor slot itu dan melempar giliran
tersebut ke penjawab pertanyaan di baris 1100.

Sembilan keluarga melakukan ini:

| pencacah | slot | baris kosong | diuji di | dialihkan ke |
|---|--:|--:|--:|--:|
| `X4` | 4 | 1960 | 740 | 1100 |
| `X5` | 4 | 2040 | 760 | **780** |
| `XA` | 6 | 2420 | 860 | 1100 |
| `XF` | 5 | 2740 | 970 | 1100 |
| `XH` | 5 | 2870 | 1000 | 1100 |
| `XK` | 2 | 2990 | 1040 | 1100 |
| `XL` | 4 | 3070 | 1050 | 1100 |
| `XV` | 5 | 3780 | 1250 | 1100 |
| `XW` | 5 | 3850 | 1270 | 1100 |

Jadi pencacah putarannya bukan cuma pemilih jawaban — ia **mesin keadaan**.
Tiap *n* giliran, Eliza mengganti topik dengan sengaja, dan yang mengaturnya
adalah slot yang kosong.

Dua slot lain melangkah lebih jauh. Baris 2050 dan 2120 menyetel `A=0`, dan
baris 630 membaca itu sebagai *"anggap kata kunci ini tidak cocok"* — jadi
penyapuan **diteruskan** dan kata kunci lain di kalimat yang sama dapat
giliran. Sebuah kata kunci yang bisa **menyerahkan** haknya:

```
1. I DREAM OF YOU  -> WHAT DOES THAT DREAM SUGGEST TO YOU?      [DREAM,  X6=1]
2. I DREAM OF YOU  -> DO YOU DREAM OFTEN?                       [DREAM,  X6=2]
3. I DREAM OF YOU  -> WHAT PERSONS APPEAR IN YOUR DREAMS?       [DREAM,  X6=3]
4. I DREAM OF YOU  -> DON'T YOU BELIEVE THAT DREAM HAS …        [DREAM,  X6=4]
5. I DREAM OF YOU  -> PERHAPS IN YOUR FANTASY WE DREAM OF …     [YO␀U,   X6=5]
6. I DREAM OF YOU  -> WHAT DOES THAT DREAM SUGGEST TO YOU?      [DREAM,  X6=1]
```

Giliran kelima dijawab oleh kata kunci yang **berbeda**, tanpa satu pun baris
kode yang khusus mengurus itu.

---

## 4 · Ingatan lintas giliran — dan tempatnya cuma dua puluh

```basic
 890 GOSUB 1520:GOSUB 1580:IF A=0 THEN RETURN ELSE IF S=0 THEN NE=0
 900 S=S+1:M$(S)=D$: …
1500 IF NE>5 AND S<>0 THEN NE=0:GOTO 4460 ELSE GOSUB 4690: …
4460 D$=M$(1):FOR I=1 TO S-1:M$(I)=M$(I+1):NEXT:S=S-1:GOSUB 4470: …
```

Tiap kali Anda bilang *MY …*, potongannya disimpan. Kalau lebih dari lima
giliran berlalu **dan** sebuah giliran tidak mencocokkan satu pun kata kunci,
baris 4460 memanggilnya kembali: *"EARLIER YOU SAID YOUR …"*.

Perhatikan `D$=M$(1)` dan geserannya: ini **antrean**, bukan tumpukan. Eliza
aslinya Weizenbaum memakai tumpukan — yang paling baru lebih dulu. Grumette
membalikkannya, dan sifatnya jadi berbeda: yang dipanggil kembali adalah
keluhan **pertama** Anda, bukan yang terakhir.

Diperiksa:

```
MY DOG BARKS / MY CAR IS RED / MY JOB IS HARD   -> M$ = [DOG BARKS, CAR IS RED, JOB IS HARD]
… empat giliran tanpa kata kunci …
-> DOES THAT HAVE ANYTHING TO DO WITH THE FACT THAT YOUR DOG BARKS?
   sisa M$ = [CAR IS RED, JOB IS HARD]
```

### 4a · Dua luapan larik yang benar-benar bisa dicapai

Baris 900 menambah `S` **tanpa pernah memeriksanya** terhadap `DIM M$(20)` di
baris 150. Dua puluh satu kalimat *MY …* dan GW-BASIC berhenti:

```
Subscript out of range in 900
```

Diukur dengan menjalankannya: berturut-turut tanpa jeda, jebol di masukan
ke-**21**; kalau diselingi giliran yang gagal mencocokkan (yang memakan satu
ingatan tiap kali), jebol di *MY* ke-**26**. Ini bukan sudut yang aneh —
program terapi yang mengundang Anda bicara soal diri sendiri akan mendengar
"MY" jauh lebih dari dua puluh kali.

Saudaranya ada di baris 510: `DIM A$(20)` membatasi **jumlah kalimat dalam
satu masukan**, dan dua puluh satu titik memberi `Subscript out of range in
510`.

Keduanya **tidak diperbaiki** di port ini, sesuai keputusan (c) di
[fondasi](_fondasi.md): aturan main dipertahankan persis. Yang dilakukan
port adalah **menahan diri di batasnya lalu mengatakannya** — papan angka
*Ingatan M$* menghitung mundur ke 20, dan panel "Di balik layar" menampilkan
galat yang akan terjadi di aslinya, dengan nomor barisnya.

---

## 5 · Dua kata yang tidak pernah muncul di listingnya

```basic
 250 FOR I=1 TO 4:READ ZZ:FZ$=FZ$+CHR$(ZZ):NEXT
 260 FOR I=1 TO 4:READ ZZ:SZ$=SZ$+CHR$(ZZ):NEXT
1510 DATA 83,72,73,84,70,85,67,75
 460 IF INSTR(A$,FZ$) OR INSTR(A$,SZ$) THEN GOSUB 4410:GOSUB 4600:GOTO 640
```

Dua kata umpatan yang diawasi Eliza disimpan sebagai **kode aksara**, bukan
sebagai teks. `LIST` tidak pernah memperlihatkannya, dan membaca listingnya di
layar 1981 pun tidak. Itu penyuntingan sopan yang dikerjakan dengan
aritmetika.

Baris 460 juga satu-satunya jalur yang **memotong sebelum kalimat dipotong**:
umpatan dijawab (`MY, MY, SUCH LANGUAGE!`) sebelum penyulihan sempat berarti
apa pun. Ia mendahului seluruh mesin aturannya.

Pendampingnya di baris 410 dan 4740 adalah **dua teguran seumur percakapan**:

```basic
 410 IF INSTR(A$," SEX")<>0 THEN SX=1
4740 IF M=0 THEN B$="YOU SEEM TO HAVE AVOIDED SPEAKING OF YOUR PARENTS
     ALTOGETHER.":M=1:RETURN ELSE IF SX=0 THEN B$="I NOTICE THAT YOU
     HAVEN'T DISCUSSED SEX AT ALL.":SX=1:RETURN ELSE Y7=5
```

`M` disetel di baris 910 hanya kalau Anda menyebut `MOTHER` atau `FATHER`
(`B$(5)` dan `B$(6)`), `SX` hanya kalau kalimat Anda mengandung `SEX`. Kalau
Eliza kehabisan bahan dan kedua bendera itu masih nol, ia menegur — sekali
saja, lalu benderanya dinaikkan sendiri supaya tidak diulang. Dua bendera,
dua kalimat, dan sebuah program yang **memperhatikan apa yang tidak Anda
katakan**.

---

## 6 · Fosil di ujung berkasnya

Koleksi ini memuat dua salinan Eliza: `run/ELIZA.BAS` (24.255 bita) dan
`misc/ELIZA.SRC` (24.320 bita). Yang kedua bukan versi lain — 24.255 bita
pertamanya **identik**. Yang menarik ada di 65 bita sisanya:

```
panjang ELIZA.SRC          24.320 = 190 × 128  (kelipatan rekaman 128 bita)
Ctrl-Z (penanda EOF)       bita 24.255
bita 0…24.254              identik dengan run/ELIZA.BAS
bita 24.256…24.319         64 bita: OTO 290␍␊5080 GOTO 5050␍␊5090 I=0␍␊5100 I=I+1:IF MID$(A$,I,1)=" 
```

Enam puluh empat bita sesudah penanda EOF itu bukan sampah acak: itu potongan
**program yang sama**, dari posisi yang di berkas hidup ada tepat **128 bita**
lebih awal (bita 24.128).

Panjang berkasnya kelipatan 128 — ukuran rekaman yang MS-DOS warisi dari
CP/M. Rekaman terakhir tidak ditimpa penuh, jadi yang tertinggal di sana
adalah ekor **simpanan sebelumnya**, dari saat berkas ini 128 bita lebih
panjang.

Artinya kita memegang jejak satu penyuntingan yang tidak tercatat di mana
pun: antara dua kali simpan, 128 bita dibuang dari bagian awal program.
Isinya tidak bisa dipulihkan — tapi **ukurannya** bisa dibaca dari sisa yang
tertinggal.

---

## 7 · Tiga hal yang ditulis lalu tidak pernah dipakai

| baris | apa | kenapa mati |
|---|---|---|
| 830 | `PRINT B$:RETURN` | baris 820 di atasnya berakhir `GOTO 4600`, jadi 830 tak pernah tercapai, dan tak ada satu pun `GOTO 830`. Fosil dari sebelum 4600 ada |
| 140 / 380 | `T=1` … `IF T=0 OR A$=""` | saklar untuk mempertahankan huruf kecil: disetel sekali, diuji sekali, tak pernah diubah lagi |
| 4650–4680 | bungkus baris ke berkas | salinan kata demi kata dari 4610–4640; bedanya hanya `PRINT` lawan `PRINT#1` |

### 7a · Dua kekeliruan di reviewnya sendiri, dan keduanya sesebab

**Yang pertama: `WHILE`/`WEND`.**
[`reviews/ELIZA.md`](../../reviews/ELIZA.md) mencantumkannya di daftar
perkakas bahasa yang dipakai. Program ini tidak punya satu pun.
Satu-satunya kemunculan "WHILE" di seluruh berkas ada **di dalam sebuah
kalimat Inggris**, baris 2020:

```basic
2020 B$="HAVE YOU EVER FANTASIED"+D$+" WHILE YOU WERE AWAKE?":RETURN
```

Dihitung ulang dengan isi tanda kutip dibuang lebih dulu: ELIZA punya **nol**
`WHILE`. Sembilan program lain di koleksi memang memakainya — `15PUZZLE`,
`BOWLING`, `CRAZY8`, `DRAW`, `FLYS`, `MAXIT1`, `SOLITAIR`, `STATS`,
`YAHTZEE` — jadi pemindainya bukan rusak, ia hanya tidak tahu bahwa yang
sedang dibacanya adalah prosa.

**Yang kedua: "121 `GOTO` — tertinggi di koleksi".** Bukan. `TEMPLE` punya
255 dan `WIZARD` 224; ELIZA ketiga. Angka 121-nya benar, peringkatnya tidak —
dan peringkat itu dipakai untuk sebuah kesimpulan ("program dengan arsitektur
data yang bagus tetap bisa punya alur kendali yang kusut") yang jadi jauh
lebih lemah begitu angkanya diletakkan pada tempatnya. Yang benar-benar
tertinggi, dan dengan selisih besar, adalah **47 tabel `ON…`** — dua kali
lipat program mana pun. Itu kesimpulan yang berlawanan: percabangannya
**terstruktur**, bukan kusut.

Keduanya lahir dari sebab yang sama: **menghitung tanpa melihat.** Yang
pertama menghitung kata di tempat yang salah, yang kedua membandingkan
hitungan itu dengan hitungan yang tidak pernah diambil. Dan ini kebalikan
persis dari [ANATOMY](anatomy.md), tempat **kode terbaca sebagai data** dan
menipu alat yang sama di enam tempat. Dua program di koleksi yang sama, dua
arah kekeliruan, satu penyebab: pemindainya tidak tahu apa yang sedang
dibacanya.

---

## 8 · Detail kecil yang mudah disalahbaca

**Baris 520 menyisakan tepat satu spasi di ekor kalimat.**

```basic
 520 IF ASC(RIGHT$(A$(I),2))=32 AND LEN(A$(I))>2 THEN A$(I)=LEFT$(A$(I),LEN(A$(I))-1):GOTO 520
```

`RIGHT$(x,2)` mengambil dua aksara terakhir dan `ASC` membaca yang
**pertama** dari dua itu — yaitu aksara kedua-dari-belakang. Jadi gelung ini
memangkas selama *kedua-dari-belakang* masih spasi, dan berhenti dengan
tepat **satu** spasi tersisa. Itu bukan kelalaian: kata kunci disimpan
berselubung spasi (`" ALWAYS "`), jadi tanpa spasi ekor itu kata terakhir
kalimat tidak akan pernah cocok.

**Baris 400 memberi dua spasi di depan.**

```basic
 400 A$="  "+A$+" "
```

Dua, bukan satu. Baris 1580 mengambil `MID$(A$,A-1,…)` — satu aksara
*sebelum* posisi kecocokan — jadi harus selalu ada tempat di kiri. Dua spasi
membuat `A-1` aman dan sekaligus membuat pola berselubung-spasi cocok di awal
kalimat.

**`SPACE$(100)` adalah batas keras.**

```basic
 510 A0$=LEFT$(A$,A-1):IF INSTR(SPACE$(100),A0$)=1 THEN 530 ELSE I=I+1:A$(I)=A0$
```

Uji "kalimat ini seluruhnya spasi" dikerjakan dengan mencari `A0$` di dalam
seratus spasi. Kalau `A0$` lebih panjang dari 100, ia **tidak ketemu** dan
kalimatnya dianggap berisi. Ambangnya: **98 spasi** yang diketik (dua dari
baris 400, satu lagi dari kaidah yang mengubah `.` jadi `" . "`). Ketik
sembilan puluh delapan spasi dan sebuah titik, dan Eliza akan menjawab
"kalimat" yang isinya tidak ada.

---

## 9 · Dari retro ke modern

| Aspek | Bentuk asli | Kendala yang melahirkannya | Bentuk sekarang & alasannya |
|---|---|---|---|
| Basis aturan | `OPEN "I",1,"STRINGS.FIL"` lalu tiga gelung `INPUT#` yang membaca 93 nilai | Memori 64 KB; aturan di luar kode berarti kode bisa lebih besar, dan bahasanya bisa diganti tanpa menyentuh program | **`strings.js` menjalankan `WRTSTR.BAS`**, bukan menyalin hasilnya. Berkasnya dihitung ulang saat halaman dimuat dan panjangnya diperiksa terhadap 1.275 bita yang asli. Hubungan pembangkit–hasil itu yang mau ditunjukkan, dan menempelkan isinya akan menghapusnya |
| Penanda `CHR$(0)` | bita nol yang tidak mencetak apa pun | Satu-satunya "aksara yang tidak ada" yang tersedia | **Dipertahankan sebagai bita nol yang sungguhan**, tapi ditampilkan sebagai `␀` berwarna di panel. Di aslinya penanda ini mustahil diamati; justru itu yang membuatnya layak diperlihatkan |
| `WD=PEEK(&H4A)` + bungkus baris 4610–4640 | Lebar layar dibaca dari BIOS | Layar bisa 40 atau 80 kolom, dan program menyesuaikan diri alih-alih mengasumsikan | **Pemotongannya dikerjakan di JS, bukan diserahkan ke `word-wrap` peramban** — kalau peramban yang memotong, yang terlihat bukan lagi perilaku programnya. `WD` jadi pilihan 40/80, dan **ukuran hurufnya diturunkan dari `WD`** supaya WD kolom selalu muat tanpa gulir mendatar |
| `ON Z GOSUB` 44 cabang | Tidak ada `switch`, tidak ada array asosiatif, tidak ada fungsi sebagai nilai | Satu-satunya sarana yang tersedia | **Bentuk daftarnya dipertahankan** (`KIRIM[]`, 44 masuk 29 keluar), tidak diratakan jadi rantai `if` — lihat §2.8 [fondasi](_fondasi.md) |
| Alur penangan 650–1500 | Saling melompat: `1490→1320`, `1120→670`, `1410→1110`, semuanya keluar lewat `RETURN` atau `GOTO 4600` | `GOSUB` tanpa parameter dan tanpa nilai kembali; `A` dipakai sebagai kanal balik (0 = lanjut menyapu, −1 = kalimat berikutnya) | **Mesin keadaan bernomor baris**, bukan fungsi-fungsi terpisah. Meratakannya akan menyembunyikan justru bagian yang menarik — dan panel port menampilkan *jalur*-nya (`1280 → 1310 → 1380 → …`) sebagai hasil |
| `LINE INPUT` + `INKEY$` | Menunggu dengan memutar CPU | Tidak ada konsep asinkron | Kotak isian + Enter. Menunggu berarti tidak melakukan apa-apa |
| `OPEN "O",1,A$` untuk SAVE | Satu-satunya penyimpanan adalah disket | — | `localStorage` lewat `_shared/store.js`. Nama tetap dinaikkan ke huruf besar (baris 4840) |
| Penyangga `DIM S$(100)` | Percakapan disimpan di RAM untuk `DISPLAY`/`SAVE` | 64 KB | **Dipertahankan, termasuk batas 100** dan penolakan masukan saat penuh (baris 280 → 5020). Papan angka menampilkannya |
| Perintah `DISPLAY`/`CLEAR`/`SAVE`/`RESTART` | Dibandingkan terhadap **dua ejaan**, sebelum baris 380 menaikkan huruf | — | **Dipertahankan persis.** `Display` memang tidak dikenali dan diteruskan ke Eliza sebagai kalimat biasa. Ini bukan bug yang layak diperbaiki; ini bentuk aslinya |
| Luapan `M$(20)` dan `A$(20)` | `Subscript out of range`, program mati | Larik harus di-`DIM` di depan, dan tidak ada pemeriksaan otomatis yang murah | **Tidak diperbaiki dan tidak disembunyikan**: port menahan diri di batasnya, papan angka memperingatkan sejak 15, dan panel menyebutkan galat persis yang akan muncul di GW-BASIC beserta nomor barisnya |
| Panel "Di balik layar" | *tidak ada padanannya* | — | **Tambahan murni**, dan alasannya pedagogis: seluruh kecerdasan Eliza terjadi di antara apa yang Anda ketik dan apa yang tercetak, dan di aslinya jendela itu tertutup rapat |

---

## 10 · Peta translasi

| Pola di BASIC | Padanan di port | Kenapa begitu |
|---|---|---|
| `ON Z GOSUB 650,650,…` (44 cabang) | `const KIRIM = [null, 650, 650, …]` | tabel penunjuk berindeks; bentuknya sengaja dipertahankan |
| `X0=X0+1:IF X0=7 THEN X0=1` (46×) | `putar(nama, batas)` | satu fungsi menggantikan 46 salinan pola yang sama |
| `ON X0 GOTO 1620,…,1670` | daftar jawaban, `null` = slot kosong | kekosongan slot itu **punya arti**, jadi ia harus bisa diwakili |
| `GOSUB 1520` / `1550` / `1580` | `L1520()` / `L1550()` / `L1580()` | dipanggil 27, 4, dan 26 kali; namanya nomor barisnya supaya bisa diadu dengan listing |
| `A=0 : RETURN` / `A=-1 : RETURN` | nilai balik lewat `S.A`, dibaca di penyapu | kanal balik aslinya memang sebuah variabel, bukan nilai fungsi |
| `INSTR(B,A$,X$)` 1-berbasis | `instr(b, a, x)` 1-berbasis | dibuat 1-berbasis, **bukan** 0, supaya tiap baris bisa dibandingkan langsung dengan aslinya |
| `MID$(A$,A)="Y"` (pernyataan) | `midAssign(s, i, r)` | JS tidak punya penetapan-di-tempat pada string |
| `PRINT` dengan bungkus 4610–4640 | `bungkus(teks, WD)` | pemotongan adalah perilaku program, bukan urusan tata letak |

---

## 11 · Bagaimana port ini diperiksa

Mesin aturannya ditulis **dua kali dari listing yang sama**, terpisah: sekali
dalam Python sebagai acuan, sekali dalam JavaScript untuk halamannya.
Keduanya lalu diberi masukan acak yang identik — kosakata yang sama, pengacak
yang sama, 40 sesi × 250 giliran = **10.000 giliran** — dan keluarannya
digabung bersama keadaan dalamnya (`S`, `NE`, `X`, dan kedua bendera teguran)
lalu disidik-jari.

```
Python : 10.000 giliran, 802.065 aksara, FNV-1a = 71c5557d
JS      : 10.000 giliran, 802.065 aksara, FNV-1a = 71c5557d
```

Cocok aksara demi aksara. Itu bukan bukti bahwa keduanya setia pada BASIC-nya
— dua salah baca yang sama akan lolos — tapi ia menutup seluruh kelas
kesalahan salin-tempel dan salah indeks, yang justru kelas paling mungkin di
program sepanjang ini.

Pemeriksaan yang berdiri sendiri:

- **`STRINGS.FIL` disimulasikan dari `WRTSTR.BAS`** dan dibandingkan **bita
  demi bita** dengan berkas yang ada di koleksi: 1.275 bita, cocok, termasuk
  penanda `Ctrl-Z`.
- **Ke-29 penangan terjangkau.** Disapu 200.000 masukan acak dari kosakata
  yang memuat keempat puluh empat kata kunci dan kedua puluh tujuh kata di
  `B$`: tidak ada satu pun target di baris 620 yang mati, dan tidak ada satu
  galat.
- **Kedua penjaga diuji dengan melepasnya**, dan akibatnya diukur (§1).

Dua cacat di portnya sendiri ditemukan dengan **melihat**, bukan membaca, dan
keduanya layak dicatat karena sifatnya berulang:

1. Pengubah `stat--warn` dipasang pada `.stat__value`, padahal `base.css`
   menuliskannya `.stat--warn .stat__value`. Kelasnya menempel, tidak ada
   galat apa pun, dan warnanya tidak pernah muncul.
2. Layar 80 kolom pada ukuran huruf tetap **tidak muat**, jadi halamannya
   minta digulir mendatar — dan yang terlihat jadi lebar jendela pembaca,
   bukan perilaku programnya. Sekarang ukuran hurufnya **diturunkan dari
   `WD`**, dengan petak monospace diukur sungguhan alih-alih ditebak 0,6 em
   (yang meleset antar font sistem). Diukur pada 860, 760, 640, 520, 420, dan
   360 px: nol elemen keluar dari wadahnya, dan tabel serta blok kode tetap
   terkurung di penggulirnya sendiri.

---

## 12 · Latihan

1. Ketik `I HATE YOU`, lalu lihat baris 2 di panel "Di balik layar". Anda akan
   melihat `YO␀U HATE I` — dan penanda hijau itulah yang memberi tahu baris
   620 kalimat ini bermula dari kata *Anda*.
2. Ketik `I DREAM ABOUT MY FATHER`. Satu kalimat, **dua penjaga sekaligus**:
   `␀` hijau di `YO␀U` dan `*` amber di `*OUR`. Lalu bandingkan baris 2 dengan
   baris 3 — bintangnya sudah jadi `Y`, penanda nolnya masih ada.
3. Ketik kalimat yang sama enam kali berturut-turut. Pada giliran kelima
   jawabannya datang dari kata kunci yang **berbeda**; papan angka *Penangan*
   memperlihatkan nomor barisnya berpindah.
4. Ketik `MY …` lima belas kali. Papan angka *Ingatan M$* berubah kuning, lalu
   merah di dua puluh. Yang ke-21 akan mematikan program aslinya.
5. Ketik `Display` dengan huruf besar di depan. Ia **bukan** perintah — baris
   290 hanya mengenal dua ejaan, dan pemeriksaannya terjadi sebelum baris 380
   menaikkan huruf.
6. Ganti *Lebar layar* ke 40 kolom, lalu ketik kalimat panjang. Seluruh
   gulungan digambar ulang: pemotongan terjadi saat **mencetak**, sama seperti
   di aslinya, tempat `WD` dibaca sekali di baris 40 dan berlaku selamanya.

---

[Katalog port](../index.html) · [Fondasi](_fondasi.md) ·
[Analisis BASIC aslinya](../../reviews/ELIZA.md) ·
[Analisis WRTSTR.BAS](../../reviews/WRTSTR.md) ·
[Dasar-dasar BASIC](../../reviews/00-DASAR-BASIC.md)
